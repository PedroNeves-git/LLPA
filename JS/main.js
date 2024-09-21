// Selectors

const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');


// Event Listeners

toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));

function addToDo(event) {
    event.preventDefault();

    const titulo = toDoInput.value;  // Pegue o valor do input

    if (titulo === '') {
        alert('Você tem que escrever algo!');
        return;
    }

    // Enviando a tarefa para o back-end usando fetch
    fetch('http://localhost:3000/add-tarefa', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ titulo: toDoInput.value })
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        // Lógica adicional para atualizar a interface
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });

    // Limpar o input após adicionar a tarefa
    toDoInput.value = '';
}


function deletecheck(event){

    // console.log(event.target);
    const item = event.target;

    // delete
    if(item.classList[0] === 'delete-btn')
    {
        // item.parentElement.remove();
        // animation
        item.parentElement.classList.add("fall");

        //removing local todos;
        removeLocalTodos(item.parentElement);

        item.parentElement.addEventListener('transitionend', function(){
            item.parentElement.remove();
        })
    }

    // check
    if(item.classList[0] === 'check-btn')
    {
        item.parentElement.classList.toggle("completed");
    }

    // edit
    if(item.classList[0] === 'edit-btn')
    {
        editTodo(item);
    }
}



// Saving to local storage:
function savelocal(todo){
    //Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}



function getTodos() {
    fetch('http://localhost:3000/todos')
        .then(response => response.json())
        .then(data => {
            data.forEach(todo => {
                // toDo DIV;
                const toDoDiv = document.createElement("div");
                toDoDiv.classList.add("todo", `${savedTheme}-todo`);

                // Create LI
                const newToDo = document.createElement('li');
                newToDo.innerText = todo.titulo; // Use o campo correto do seu banco
                newToDo.classList.add('todo-item');
                toDoDiv.appendChild(newToDo);
                
                // check btn;
                const checked = document.createElement('button');
                checked.innerHTML = '<i class="fas fa-check"></i>';
                checked.classList.add("check-btn", `${savedTheme}-button`);
                toDoDiv.appendChild(checked);

                // delete btn;
                const deleted = document.createElement('button');
                deleted.innerHTML = '<i class="fas fa-trash"></i>';
                deleted.classList.add("delete-btn", `${savedTheme}-button`);
                toDoDiv.appendChild(deleted);

                // Append to list;
                toDoList.appendChild(toDoDiv);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar tarefas:', error);
        });
}


function removeLocalTodos(todo){
    //Check: if item/s are there;
    let todos;
    if(localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const todoIndex =  todos.indexOf(todo.children[0].innerText);
    // console.log(todoIndex);
    todos.splice(todoIndex, 1);
    // console.log(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    // Change blinking cursor for darker theme:
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check or delete):
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