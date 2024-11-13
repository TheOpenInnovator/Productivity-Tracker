function updateClock() {
  const timezoneSelect = document.getElementById("timezone-select");
  if (!timezoneSelect) return;  // If the timezone select element doesn't exist, exit the function

  const timezone = timezoneSelect.value;   
  const now = new Date();

  // Date options for the selected timezone
  const optionsDate = {
    timeZone: timezone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  // Time options for the selected timezone
  const optionsTime = {
    timeZone: timezone,
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  try {
    // Format date and time based on the selected timezone
    const datePart = now.toLocaleDateString("en-US", optionsDate);
    const timePart = now.toLocaleTimeString("en-US", optionsTime);

    // Display the formatted date and time in the element
    document.getElementById("current-time").textContent = `${datePart} - ${timePart}`;
  } catch (error) {
    // Handle any errors related to invalid timezone
    console.error("Error formatting date/time for timezone:", timezone, error);
    document.getElementById("current-time").textContent = "Invalid Timezone";
  }
}

 setInterval(updateClock, 1000);

 document.getElementById("timezone-select").addEventListener("change", updateClock);

 updateClock();

// Checklist functionality
const taskInput = document.getElementById("new-task");
const categoryInput = document.getElementById("task-category");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const categoryDropdown = document.getElementById("category-dropdown");
const mapAllButton = document.getElementById("map-all");
const customMapButton = document.getElementById("custom-map");
const taskCategories = new Set();
let tasks = [];

addTaskButton.addEventListener("click", addTask);
mapAllButton.addEventListener("click", mapAllTasks);
customMapButton.addEventListener("click", customMapTasks);

function addTask() {
  const taskText = taskInput.value.trim();
  const category = categoryInput.value.trim() || categoryDropdown.value;

  if (taskText) {
    const task = { text: taskText, category, completed: false };
    tasks.push(task);
    renderTask(task);

    if (category) {
      taskCategories.add(category.toLowerCase());
      updateCategoryDropdown();
    }

    taskInput.value = "";
    categoryInput.value = "";
    updateProductivityScore();
  }
}

function renderTask(task) {
  const li = document.createElement("li");
  li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <span class="task-category">${task.category}</span>
        <div class="task-control">
            <button class="complete-task">✓</button>
            <button class="edit-task">Edit</button>
            <button class="delete-task">Delete</button>
            <button class="toggle-category">👁️</button>
        </div>

    `;
  taskList.appendChild(li);

  li.querySelector(".complete-task").addEventListener("click", () =>
    toggleTaskCompletion(task, li)
  );
  li.querySelector(".edit-task").addEventListener("click", () =>
    editTask(task, li)
  );
  li.querySelector(".delete-task").addEventListener("click", () => {
    showAlertBox(task, li);
  });
  li.querySelector(".toggle-category").addEventListener("click", () =>
    toggleCategory(li)
  );
}

function showAlertBox(task, li) {
  const modal = document.getElementById("deleteModal");
  modal.style.display = "flex";

  const confirmDelete = document.getElementById("confirmDelete");
  const cancelDelete = document.getElementById("cancelDelete");

  confirmDelete.onclick = function () {
    deleteTask(task, li);
    modal.style.display = "none";
  };
  cancelDelete.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function toggleTaskCompletion(task, li) {
  task.completed = !task.completed;
  li.classList.toggle("completed");
  updateProductivityScore();
}

function editTask(task, li) {
  const newText = prompt("Edit task:", task.text);
  if (newText !== null) {
    task.text = newText.trim();
    li.querySelector(".task-text").textContent = task.text;
  }
}

function deleteTask(task, li) {
  const index = tasks.indexOf(task);
  if (index > -1) {
    tasks.splice(index, 1);
    li.remove();
    updateProductivityScore();
  }
}

function toggleCategory(li) {
  const categorySpan = li.querySelector(".task-category");
  categorySpan.style.display =
    categorySpan.style.display === "none" ? "inline" : "none";
}

function updateCategoryDropdown() {
  categoryDropdown.innerHTML = '<option value="">Select a category</option>';
  taskCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryDropdown.appendChild(option);
  });
}

function mapAllTasks() {
  mapTasksToTimer(tasks);
  mapTasksToLog(tasks);
}

function customMapTasks() {
  const selectedTasks = Array.from(taskList.querySelectorAll("li")).filter(
    (li) => li.querySelector(".complete-task").disabled
  );
  mapTasksToTimer(
    selectedTasks.map((li) =>
      tasks.find((t) => t.text === li.querySelector(".task-text").textContent)
    )
  );
  mapTasksToLog(
    selectedTasks.map((li) =>
      tasks.find((t) => t.text === li.querySelector(".task-text").textContent)
    )
  );
}

function mapTasksToTimer(tasks) {
  const timerTaskSelect = document.getElementById("timer-task-select");
  timerTaskSelect.innerHTML = "";
  tasks.forEach((task) => {
    const option = document.createElement("option");
    option.value = task.text;
    option.textContent = task.text;
    timerTaskSelect.appendChild(option);
  });
}

function mapTasksToLog(tasks) {
  // Implement the function to map tasks to log (timeline)
}

function updateProductivityScore() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const score = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  document.getElementById("score").textContent = Math.round(score);
  document.querySelector(".progress").style.width = `${Math.round(score)}%`;
}

// Timer functionality
let timerInterval;
let timerStartTime;
let timerTasks = [];

function formatTime(seconds) {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
}

function updateTimerTaskSelect() {
  const timerTaskSelect = document.getElementById("timer-task-select");
  timerTaskSelect.innerHTML = "";
  timerTasks.forEach((task) => {
    const option = document.createElement("option");
    option.value = task;
    option.textContent = task;
    timerTaskSelect.appendChild(option);
  });
}

document.getElementById("add-timer-task").addEventListener("click", () => {
  const newTimerTask = document.getElementById("new-timer-task").value.trim();
  if (newTimerTask) {
    timerTasks.push(newTimerTask);
    updateTimerTaskSelect();
    document.getElementById("new-timer-task").value = "";
  }
});

document.getElementById("start-timer").addEventListener("click", () => {
  const timerTask = document.getElementById("timer-task-select").value;
  if (timerTask) {
    timerStartTime = Date.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    document.getElementById("timer-display").classList.add("active");
  }
});

document.getElementById("pause-timer").addEventListener("click", () => {
  clearInterval(timerInterval);
  document.getElementById("timer-display").classList.remove("active");
});

document.getElementById("stop-timer").addEventListener("click", () => {
  clearInterval(timerInterval);
  document.getElementById("timer-display").textContent = "00:00:00";
  document.getElementById("timer-display").classList.remove("active");
});

function updateTimer() {
  const elapsedSeconds = Math.floor((Date.now() - timerStartTime) / 1000);
  document.getElementById("timer-display").textContent =
    formatTime(elapsedSeconds);
}

function mapTasksToTimer(tasks) {
  timerTasks = [...new Set([...timerTasks, ...tasks.map((task) => task.text)])];
  updateTimerTaskSelect();
}

// Pomodoro Timer functionality
let pomodoroInterval;
let pomodoroTime = 25 * 60;

function updatePomodoroDisplay() {
  document.getElementById("pomodoro-display").textContent =
    formatTime(pomodoroTime);
}

document.getElementById("start-pomodoro").addEventListener("click", () => {
  pomodoroInterval = setInterval(() => {
    if (pomodoroTime > 0) {
      pomodoroTime--;
      updatePomodoroDisplay();
    } else {
      clearInterval(pomodoroInterval);
    }
  }, 1000);
});

document.getElementById("reset-pomodoro").addEventListener("click", () => {
  clearInterval(pomodoroInterval);
  pomodoroTime = 25 * 60;
  updatePomodoroDisplay();
});

// Daily Log functionality
document.getElementById("add-log-task").addEventListener("click", () => {
  const logTask = document.getElementById("new-log-task").value.trim();
  const startTime = document.getElementById("log-start-time").value;
  const endTime = document.getElementById("log-end-time").value;

  if (logTask && startTime && endTime) {
    const timelineItem = document.createElement("div");
    timelineItem.className = "timeline-item";
    timelineItem.innerHTML = `<span class="timeline-time">${startTime} - ${endTime}</span> ${logTask}`;
    document.getElementById("daily-log-timeline").appendChild(timelineItem);
  }
});

// Links functionality
document.getElementById("add-link").addEventListener("click", () => {
  const linkInputs = document.getElementById("link-inputs");
  const linkInput = document.createElement("input");
  linkInput.type = "url";
  linkInput.placeholder = "Enter a link";
  linkInputs.appendChild(linkInput);
  linkInputs.appendChild(document.createElement("br"));
});

document.getElementById("add-more-link").addEventListener("click", () => {
  const linkList = document.getElementById("link-list");
  Array.from(document.querySelectorAll("#link-inputs input")).forEach(
    (input) => {
      if (input.value.trim()) {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${input.value}" target="_blank">${input.value}</a>`;
        linkList.appendChild(li);
        input.value = "";
      }
    }
  );
});

document.getElementById("copy-links-tomorrow").addEventListener("click", () => {
  // Implement copy links to tomorrow functionality
});

document.getElementById("copy-links-week").addEventListener("click", () => {
  // Implement copy links to week functionality
});

document
  .getElementById("copy-links-next-week")
  .addEventListener("click", () => {
    // Implement copy links to next week functionality
  });

// Daily Learnings functionality
document.getElementById("save-learning").addEventListener("click", () => {
  const learningInput = document.getElementById("learning-input").value.trim();
  if (learningInput) {
    alert("Learning saved!");
    document.getElementById("learning-input").value = "";
  }
});

document.getElementById("view-learnings").addEventListener("click", () => {
  // Implement view learnings functionality
});

// Toggle Dark Theme functionality
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");

  if (document.body.classList.contains("dark-theme")) {
    localStorage.setItem("theme", "dark");
    document.getElementById("toggle-theme").innerText = "Toggle Light Theme";
  } else {
    localStorage.setItem("theme", "light");
    document.getElementById("toggle-theme").innerText = "Toggle Dark Theme";
  }
});

//getting user prefernce of theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
  document.getElementById("toggle-theme").innerText = `Toggle Light Theme`;
} else {
  document.getElementById("toggle-theme").innerText = `Toggle Dark Theme`;
}

// Task Reports functionality
const taskCompletionChart = document.getElementById("task-completion-chart");
const timeSpentChart = document.getElementById("time-spent-chart");

// Define colors directly or use CSS variables correctly
const colorGreen = "#4caf50"; // Example color for completed tasks
const colorRed = "#f44336"; // Example color for pending tasks
const colorBlue = "#2196f3"; // Example color for time spent on tasks
const colorLightGray = "#e0e0e0"; // Example color for free time

// Task Completion Chart
new Chart(taskCompletionChart, {
  type: "bar",
  data: {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Task Completion",
        data: [
          tasks.filter((task) => task.completed).length,
          tasks.length - tasks.filter((task) => task.completed).length,
        ],
        backgroundColor: [colorGreen, colorRed], // Use defined color values
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});

// Time Spent Chart
new Chart(timeSpentChart, {
  type: "pie",
  data: {
    labels: ["Time Spent on Tasks", "Free Time"],
    datasets: [
      {
        label: "Time Spent",
        data: [
          tasks.length * 30, // Example time spent on tasks (e.g., 30 minutes per task)
          1440 - tasks.length * 30, // Remaining time in a day
        ],
        backgroundColor: [colorBlue, colorLightGray], // Use defined color values
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});

window.onscroll = function () {
  let backToTopButton = document.getElementById("back-to-top");
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
};

document.getElementById("back-to-top").addEventListener("click", function (e) {
  e.preventDefault(); // Prevent default anchor click behavior
  window.scrollTo({ top: 0, behavior: "smooth" });
});
