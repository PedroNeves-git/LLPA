// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');
const oceanTheme = document.querySelector('.ocean-theme');
const sunsetTheme = document.querySelector('.sunset-theme');

// Event Listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));
oceanTheme.addEventListener('click', () => changeTheme('ocean'))
sunsetTheme.addEventListener('click', () => changeTheme('sunset'))
// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);

// Functions
function addToDo(event) {
    // Prevents form from submitting / Prevents form from reloading
    event.preventDefault();

    const titulo = toDoInput.value;  // Get the input value

    if (titulo === '') {
        alert('Você tem que escrever algo!');
        return;
    }

    // Send the task to the back-end using fetch
    fetch('http://localhost:3000/add-tarefa', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ titulo })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        // Additional logic to update the UI
        displayTask(titulo);
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });

    // Clear the input after adding the task
    toDoInput.value = '';
}

function displayTask(titulo) {
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    const newToDo = document.createElement('li');
    newToDo.innerText = titulo;
    newToDo.classList.add('todo-item');
    toDoDiv.appendChild(newToDo);

    // Check button
    const checked = document.createElement('button');
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add('check-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(checked);

    // Delete button
    const deleted = document.createElement('button');
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add('delete-btn', `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    // Append to list
    toDoList.appendChild(toDoDiv);
}

function deletecheck(event) {
    const item = event.target;

    // Delete
    if (item.classList[0] === 'delete-btn') {
        item.parentElement.classList.add("fall");
        removeLocalTodos(item.parentElement);

        item.parentElement.addEventListener('transitionend', function() {
            item.parentElement.remove();
        });
    }

    // Check
    if (item.classList[0] === 'check-btn') {
        item.parentElement.classList.toggle("completed");
    }

    // Edit (not implemented yet)
    if (item.classList[0] === 'edit-btn') {
        editTodo(item);
    }
}

// Saving to local storage (not used here since tasks are sent to the server)
function savelocal(todo) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
    fetch('http://localhost:3000/todos')
        .then(response => response.json())
        .then(data => {
            data.forEach(todo => {
                displayTask(todo.titulo); // Use the correct field from your database
            });
        })
        .catch(error => {
            console.error('Erro ao buscar tarefas:', error);
        });
}

function removeLocalTodos(todo) {
    let todos = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
    const todoIndex = todos.indexOf(todo.children[0].innerText);
    todos.splice(todoIndex, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Change theme function
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');
    document.body.className = color;

    color === 'darker' ? document.getElementById('title').classList.add('darker-title') : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ?
            todo.className = `todo ${color}-todo completed` :
            todo.className = `todo ${color}-todo`;
    });
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`;
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            } else if (item === 'edit-btn') {
                button.className = `edit-btn ${color}-button`;
            }
        });
    });
}
