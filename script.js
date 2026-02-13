/* =========================================================
   FOCUSFLOW - FULL ENHANCED SCRIPT
========================================================= */

/* ===============================
   GLOBAL STATE
================================= */
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let focusSessions = parseInt(localStorage.getItem("focusSessions")) || 0;

let timer = null;
let timeLeft = 1500; // default 25 minutes
let isRunning = false;

/* ===============================
   STORAGE HELPERS
================================= */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveFocusSessions() {
  localStorage.setItem("focusSessions", focusSessions);
}

/* ===============================
   TASK MANAGEMENT
================================= */

function addTask() {
  const input = document.getElementById("taskInput");
  const prioritySelect = document.getElementById("priority");

  if (!input || input.value.trim() === "") return;

  const newTask = {
    text: input.value.trim(),
    completed: false,
    priority: prioritySelect ? prioritySelect.value : "Low"
  };

  tasks.push(newTask);
  saveTasks();

  input.value = "";

  renderTasks();
  updateDashboard();
}

function renderTasks(filter = "all") {
  const taskList = document.getElementById("taskList");
  if (!taskList) return;

  taskList.innerHTML = "";

  tasks.forEach((task, index) => {

    if (
      (filter === "completed" && !task.completed) ||
      (filter === "pending" && task.completed)
    ) return;

    const li = document.createElement("li");

    // Safe priority handling
    const priorityClass = task.priority
      ? task.priority.toLowerCase()
      : "low";

    li.classList.add(priorityClass);
    if (task.completed) li.classList.add("completed");

    li.classList.add("task-animate");

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${index})">✓</button>
        <button onclick="deleteTask(${index})">✕</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateProgressBar();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
  updateDashboard();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
  updateDashboard();
}

function filterTasks(type) {
  renderTasks(type);
}

/* ===============================
   PROGRESS BAR
================================= */

function updateProgressBar() {
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  if (!progressFill || !progressText) return;

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  const percentage = total === 0 ? 0 :
    Math.round((completed / total) * 100);

  progressFill.style.width = percentage + "%";
  progressText.textContent = percentage + "% Completed";
}

/* ===============================
   DASHBOARD UPDATE
================================= */

function updateDashboard() {
  const totalEl = document.getElementById("totalTasks");
  const completedEl = document.getElementById("completedTasks");
  const focusEl = document.getElementById("focusSessions");

  if (totalEl) {
    totalEl.textContent = tasks.length;
  }

  if (completedEl) {
    const completed = tasks.filter(t => t.completed).length;
    completedEl.textContent = completed;
  }

  if (focusEl) {
    focusEl.textContent = focusSessions;
  }
}

/* ===============================
   TIMER LOGIC
================================= */

function updateTimerDisplay() {
  const timeEl = document.getElementById("time");
  if (!timeEl) return;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timeEl.textContent =
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`;
}

function setCustomTime() {
  const input = document.getElementById("customMinutes");
  if (!input) return;

  const minutes = parseInt(input.value);

  if (!minutes || minutes <= 0) {
    alert("Enter valid minutes");
    return;
  }

  clearInterval(timer);
  isRunning = false;

  timeLeft = minutes * 60;
  updateTimerDisplay();
}

function startTimer() {
  if (isRunning) return;
  if (timeLeft <= 0) return;

  isRunning = true;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      isRunning = false;

      focusSessions++;
      saveFocusSessions();
      updateDashboard();

      alert("Focus Session Completed! 🎉");
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 1500;
  updateTimerDisplay();
}

function addTime(seconds) {
  timeLeft += seconds;

  if (timeLeft < 0) {
    timeLeft = 0;
  }

  updateTimerDisplay();
}

/* ===============================
   THEME TOGGLE
================================= */

function toggleTheme() {
  document.body.classList.toggle("light-mode");

  const isLight =
    document.body.classList.contains("light-mode");

  localStorage.setItem("theme",
    isLight ? "light" : "dark"
  );
}

/* ===============================
   INITIAL LOAD
================================= */

document.addEventListener("DOMContentLoaded", () => {

  // Restore theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }

  renderTasks();
  updateDashboard();
  updateTimerDisplay();
});