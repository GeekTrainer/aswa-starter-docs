main();

const tasks = [];

async function main() {
    await loadTasks();
    displayTasks();
}

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const retrievedData = await response.json();
        const retrievedTasks = retrievedData.tasks;
        for (let task of retrievedTasks) {
            tasks.push(task);
        }    
    } catch {
        const messageElement = document.createElement('li');
        messageElement.innerHTML = "Could not pull data. Make sure you've <a href='https://github.com/geektrainer/aswa-starter/docs/add-database.md'>configured the database</a>."
        document.getElementById('task-list').appendChild(messageElement);
    }
}

function displayTasks() {
    for (let task of tasks) {
        addTaskToDisplay(task);
    }
}

function addTaskToDisplay(task) {
    const taskElement = document.createElement('li');

    // create checkbox
    const taskCompleteCheckbox = document.createElement('input');
    taskCompleteCheckbox.type = 'checkbox';
    taskCompleteCheckbox.id = task._id;
    taskCompleteCheckbox.checked = task.completed;
    taskCompleteCheckbox.addEventListener('change', updateTask);
    taskElement.appendChild(taskCompleteCheckbox);
    
    // create text
    const taskLabel = document.createElement('label');
    taskLabel.setAttribute('for', task._id);
    taskLabel.innerText = task.title;
    taskLabel.className = task.completed ? 'completed' : '';
    taskElement.appendChild(taskLabel);

    const taskListElement = document.getElementById('task-list');
    taskListElement.appendChild(taskElement);
}

async function updateTask(e) {
    const taskId = e.target.id;

    // update the task
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;
    task.completed = !task.completed;

    // update the UI
    const taskLabel = e.target.nextSibling;
    taskLabel.className = task.completed ? 'completed' : '';
    // save changes
    await fetch(
        `/api/tasks/${taskId}`,
        {
            method: 'PUT',
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}

document.getElementById('task-register').addEventListener('click', async () => {
    const task = {
        title: document.getElementById('task-title').value,
        completed: document.getElementById('task-completed').checked
    };
    const response = await fetch(
        '/api/tasks',
        {
            method: 'POST',
            body: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    const loadedTask = await response.json();
    tasks.push(loadedTask);
    addTaskToDisplay(loadedTask);
});
