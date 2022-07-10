let users = []
let todos = []
const todoList = document.getElementById('todo-list')
const userSelect = document.getElementById('user-todo')
const form = document.querySelector('form')
document.addEventListener('DOMContentLoaded', initApp)


form.addEventListener('submit', handleSubmit)
function getUserName(userId) {
    const user = users.find(u => u.id === userId)
    return user.name
}
function printTodo({ id, userId, title, completed }) {
    const li = document.createElement('li')
    li.className = 'todo-item'
    li.dataset.id = id
    li.innerHTML = `<span>${title}<i> by </i><b>${getUserName(userId)}</b></span>`
    const status = document.createElement('input')
    status.type = 'checkbox';
    status.checked = completed;
    status.addEventListener('change', handleToDoChange)
    const close = document.createElement('span')
    close.innerHTML = `&times;`
    close.className = 'close'
    close.addEventListener('click', handleClose)

    li.prepend(status)
    li.append(close)
    todoList.prepend(li)
}
function createUserOption(user) {
    const option = document.createElement('option')
    option.value = user.id
    option.innerText = user.name
    userSelect.append(option)
}
function removeToDo(todoId) {
    todos = todos.filter(todo => todo.id !== todo.id)
    const todo = todoList.querySelector(`[data-id='${todoId}']`)
    todo.getElementsByTagName('input').removeEventListener('change', handleToDoChange)
    todo.querySelector('.close').removeEventListener('click', handleClose)
    todo.remove()
}
function initApp() {
    Promise.all([getAlltodos(), getAllUsers()]).then(values => {
        [todos, users] = values;
        todos.forEach((todo) => printTodo(todo))
        users.forEach(user => createUserOption(user))
    }
    )
}
function handleSubmit(event) {
    event.preventDefault()

    createToDo({
        userId: Number(form.user.value),
        title: form.todo.value, 
        completed: false,
    }
    )
}
function handleToDoChange() {
    const todoId = this.parentElement.dataset.id
    const completed = this.checked
    toggleToDoComplete(todoId, completed)
}
function handleClose() {
    const todoId = this.parentElement.dataset.id
    deleteToDo(todoId)
}
async function getAlltodos() {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos')
    const data = await res.json()
    return data
}
async function getAllUsers() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await res.json()
    return data
}
async function createToDo(todo) {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const newtodo = await res.json()
    printTodo(newtodo)
}


async function toggleToDoComplete(todoId, completed) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,
     {  method: 'PATCH',
        body: JSON.stringify({completed}),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    )
    const data = await res.json()
    console.log(data)

}
async function deleteToDo(todoId) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,
        { method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            } 
        })
    if (res.ok) {
        removeToDo(todoId) 
    }
}