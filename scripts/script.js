const taskTitleInputElement = document.getElementById("at-input");
const addButton = document.getElementById("add-task-button");
const clearInputButton = document.getElementById("clear-task-input-button");
const tasksGrid = document.getElementById("tasks-list-grid");

let tasks = [];

function start() {
  tasks = loadTasks();
  tasksGrid.innerHTML = "";
  if (tasks.length > 0) {
    tasks.forEach((task) => {
      defaultRender(task);
    });
  } else {
    tasksGrid.insertAdjacentHTML("beforeend", "<p>Nothing here</p>");
  }
}

start();

clearInputButton.onclick = function () {
  clearTaskInput();
};

addButton.onclick = function () {
  if (taskTitleInputElement.value.length === 0) {
    const errorLabel = document.getElementById("input-error-label");
    errorLabel.classList.remove("hidden");

    taskTitleInputElement.classList.add("error-input");

    setTimeout(() => {
      errorLabel.classList.add("hidden");
      taskTitleInputElement.classList.remove("error-input");
    }, 2000);

    return;
  }

  const task = {
    title: taskTitleInputElement.value,
    completed: false,

    id: tasks.length,
  };

  tasks.push(task);
  tasksGrid.insertAdjacentHTML("beforeend", getTaskHTMLTemplate(task));

  clearTaskInput();
  saveTasksToLocalStorage(tasks);
};

tasksGrid.addEventListener("click", function (event) {
  const index = event.target.dataset.index;
  const type = event.target.dataset.type;

  if (index !== undefined) {
    if (type === "toggle") {
      toggleTaskCompletion(index);
    } else if (type === "delete") {
      deleteTask(index);
    }
  }
});

function defaultRender(task) {
  tasksGrid.insertAdjacentHTML("beforeend", getTaskHTMLTemplate(task));
}

function clearTaskInput() {
  taskTitleInputElement.value = "";
}

function getTaskHTMLTemplate(task) {
  return `
    <div id="task-element-${task.id}" class="task-element">
      <p class="task-name ${task.completed ? "completed-task" : ""}">${
    task.title
  }</p>
      <div class="task-element-buttons">
        <button class="task-complete-button ${
          task.completed ? "completed-button" : ""
        }" data-index="${task.id}" data-type="toggle">✓</button>
        <button class="task-delete-button" data-index="${
          task.id
        }" data-type="delete">x</button>
      </div>
    </div>
  `;
}

function toggleTaskCompletion(index) {
  const task = tasks.find((t) => t.id == index);
  if (task) {
    task.completed = !task.completed;

    const taskElement = document.getElementById(`task-element-${index}`);
    if (taskElement) {
      const taskName = taskElement.querySelector(".task-name");
      const completeButton = taskElement.querySelector(".task-complete-button");
      if (taskName) {
        taskName.classList.toggle("completed-task");
      }
      if (completeButton) {
        completeButton.classList.toggle("completed-button");
      }
    }
    saveTasksToLocalStorage(tasks);
  }
}

function deleteTask(index) {
  tasks = tasks.filter((task) => task.id != index);

  tasks.forEach((task, i) => {
    task.id = i;
  });

  tasksGrid.innerHTML = "";
  tasks.forEach((task) =>
    tasksGrid.insertAdjacentHTML("beforeend", getTaskHTMLTemplate(task))
  );

  saveTasksToLocalStorage(tasks);
}

function saveTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasksJSON = localStorage.getItem("tasks");
  return tasksJSON ? JSON.parse(tasksJSON) : [];
}
