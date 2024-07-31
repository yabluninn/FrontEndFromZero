const taskTitleInputElement = document.getElementById("at-input");
const addButton = document.getElementById("add-task-button");
const clearInputButton = document.getElementById("clear-task-input-button");
const tasksGrid = document.getElementById("tasks-list-grid");
const sortIncompletedButton = document.getElementById("sort-inc-button");
const sortCompletedButton = document.getElementById("sort-c-button");

let tasks = [];

const sortingType = {
  COMPLETED_FIRST: "Completed first",
  INCOMPLETED_FIRST: "Incompleted first",
};

function start() {
  tasks = loadTasks();
  tasksGrid.innerHTML = "";
  if (tasks.length > 0) {
    tasks.forEach((task) => {
      defaultRender(task);
    });
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

sortIncompletedButton.onclick = function () {
  sortTasks(sortingType.INCOMPLETED_FIRST);
};

sortCompletedButton.onclick = function () {
  sortTasks(sortingType.COMPLETED_FIRST);
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
        }" data-index="${task.id}" data-type="toggle"><img src="icons/${
    task.completed ? "completed-icon.svg" : "complete-icon.svg"
  }"></button>
        <button class="task-delete-button" data-index="${
          task.id
        }" data-type="delete"><img src="icons/remove-icon.svg"></button>
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
      const completeButtonImg = taskElement.querySelector(
        ".task-complete-button img"
      );

      if (taskName) {
        taskName.classList.toggle("completed-task");
      }

      if (completeButton) {
        completeButton.classList.toggle("completed-button");
      }

      if (completeButtonImg) {
        completeButtonImg.src = `icons/${
          task.completed ? "completed-icon.svg" : "complete-icon.svg"
        }`;
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

function sortTasks(sortType) {
  let incompletedTasks = tasks.filter((task) => task.completed == false);
  let completedTasks = tasks.filter((task) => task.completed == true);

  let sortedTasks = [];

  if (sortType == sortingType.COMPLETED_FIRST) {
    sortedTasks = completedTasks.concat(incompletedTasks);
  } else if (sortType == sortingType.INCOMPLETED_FIRST) {
    sortedTasks = incompletedTasks.concat(completedTasks);
  }

  tasksGrid.innerHTML = "";
  sortedTasks.forEach((task) =>
    tasksGrid.insertAdjacentHTML("beforeend", getTaskHTMLTemplate(task))
  );
}
