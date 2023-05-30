
let $ = document;
let AddTask = $.getElementById("addButton");
let input = $.getElementById("itemInput");
let ToDoDiv = $.getElementById("todoList");
let clearAll = $.getElementById("clearButton");
let newValue = "";
let ArrayForSave = [];
const serverBtnShow = $.getElementById("saveInServer");


function AddToDo() {
    let inputValue = input.value;
    if (inputValue == "") {
        alert("inter task");
    } else {
        let objTask = {
            id: ArrayForSave.length + 1,
            content: inputValue,
            compelet: false,
        }

        ArrayForSave.push(objTask);

        TodoGenerator(ArrayForSave);
        saveInLocal(ArrayForSave);
        input.value = "";
        input.focus();

    }
}
AddTask.addEventListener("click", AddToDo)

function TodoGenerator(Task) {
    ToDoDiv.innerHTML = "";

    Task.forEach((todo) => {
        let newTask = $.createElement("li");
        newTask.className = "completed well items";

        let newLable = $.createElement("label");
        newLable.className = "lbl"
        newLable.innerText = todo.content;


        let parentDiv = $.createElement("div");
        parentDiv.className = "parentdiv";

        let completeButton = $.createElement("button");
        completeButton.className = "btnSuccess";
        completeButton.innerText = "Completed"
        completeButton.setAttribute("onclick", `completeTask(${todo.id})`)

        let DeleteButton = $.createElement("button");
        DeleteButton.className = "btnDelet";
        DeleteButton.innerText = "Delete"
        DeleteButton.setAttribute("onclick", `removeTask(${todo.id})`)

        let EditButtom = $.createElement("button");
        EditButtom.classList = "EditBtn";
        EditButtom.innerText = "Edit";
        EditButtom.setAttribute("onclick", `EditTask(${todo.id})`)
        parentDiv.append(completeButton, DeleteButton, EditButtom)
        newTask.append(newLable, parentDiv);
        ToDoDiv.append(newTask);

        if (todo.compelet) {
            newTask.classList = "uncompleted well";
            completeButton.innerText = "UnCompleted"
        }
    });

}

// save data
function saveInLocal(todo) {
    localStorage.setItem("ToDos", JSON.stringify(todo))
}

function getSaveData() {
    let saveData = JSON.parse(localStorage.getItem("ToDos"));
    if (saveData) {
        ArrayForSave = saveData;
    } else {
        ArrayForSave = [];
    }
    TodoGenerator(ArrayForSave);
}

// clear Button 
clearButton.addEventListener("click", () => {
    ArrayForSave = [];
    TodoGenerator(ArrayForSave);
    localStorage.removeItem("ToDos")
})
input.addEventListener("keydown", (button) => {
    if (button.code === "Enter") {
        AddToDo();
    }
})
window.addEventListener("load", getSaveData)

// REMOVE TASK
function removeTask(todoID) {
    let locaSaveData = JSON.parse(localStorage.getItem("ToDos"));
    ArrayForSave = locaSaveData;
    let findTask = ArrayForSave.findIndex((todo) => {
        return todo.id === todoID;
    })
    ArrayForSave.splice(findTask, 1)
    saveInLocal(ArrayForSave);
    TodoGenerator(ArrayForSave)
}

//COMPLETED TASK
function completeTask(todoid) {

    let localData = JSON.parse(localStorage.getItem("ToDos"));
    ArrayForSave = localData;
    ArrayForSave.forEach((todo) => {
        if (todo.id === todoid) {
            todo.compelet = !todo.compelet;
        }
    })
    saveInLocal(ArrayForSave);
    TodoGenerator(ArrayForSave);
}

// EDIT TASK

function EditTask(todoIDEdit) {
    newValue = prompt("enter new value");
    let localDataAfterEdit = JSON.parse(localStorage.getItem("ToDos"));
    ArrayForSave = localDataAfterEdit;

    ArrayForSave.forEach((task) => {
        if (task.id === todoIDEdit) {
            task.content = newValue;
            newValue = "";
        }
    })
    saveInLocal(ArrayForSave);
    TodoGenerator(ArrayForSave);
}

//menu bar
let getAllTaskLink = document.getElementById("AllTask");
let getActiveLink = document.getElementById("ActiveLink");
let getCompletedTaskLink = document.getElementById("CompletedTask");

function AllTask() {

    getAllTaskLink.style.color = "yellow";
    getActiveLink.style.color = "#818181";
    getCompletedTaskLink.style.color = "#818181";
    const getPtask = document.querySelectorAll(".well");
    getPtask.forEach(task => {
        task.style.display = "block";
    });
}
function ActiveTask() {

    getAllTaskLink.style.color = "#818181";
    getActiveLink.style.color = "red";
    getCompletedTaskLink.style.color = "#818181";

    const getPtask = document.querySelectorAll(".well");
    getPtask.forEach(task => {
        task.style.display = "block";
        if (task.classList.contains("uncompleted")) {
            task.style.display = "none";
        }
    });

}
function DoneTask() {


    getAllTaskLink.style.color = "#818181";
    getActiveLink.style.color = "#818181";
    getCompletedTaskLink.style.color = "green";
    const getPtask = document.querySelectorAll(".well");
    getPtask.forEach(task => {
        task.style.display = "block";
        if (task.classList.contains("completed")) {
            task.style.display = "none";
        }
    });
    console.log("3");
}

// enter page : 

/* login button */

const logIn = $.getElementById("login-btn");

logIn.addEventListener("click", login);

function login() {
    document.getElementById('showloginModal').style.display = 'block';
}

//login main

const loginForm = document.getElementById("signInForm");
const notFoundUser = $.getElementById("notFoundUser");
loginForm.addEventListener("submit", signInFunc)

async function signInFunc(event) {
    const loginbtn = $.getElementById("login-btn");
    const signinbtn = $.getElementById("signup-btn");
    const logoutBtn = $.getElementById("log-out");
    const username = $.getElementById("userLogined");

    event.preventDefault();
    const formData = new FormData(loginForm);
    const formDataObj = Object.fromEntries(formData.entries());
    const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        body: JSON.stringify(formDataObj),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
    const token = await response.json();
    console.log(token)
    if (token.hasOwnProperty("accessToken")) {
        loginbtn.style.display = "none";
        signinbtn.style.display = "none";
        logoutBtn.style.display = "block";
        serverBtnShow.style.display = "bolck";
        localStorage.setItem("token", JSON.stringify(token.accessToken));
        username.innerText = token.name;
        setTimeout(() => {
            location.reload();
            localStorage.removeItem("ToDos");
        }, 1000);

    } else {
        notFoundUser.style.display = "block";
    }
};

//signout:
const signout = $.getElementById("log-out");
signout.addEventListener("click", () => {
    document.getElementById("backgroundLogOut").style.display = "block";
    localStorage.removeItem("token");
    setTimeout(() => {
        location.reload();
    }, 2500);
});

// download and upload 

// upload :

const uploadFunc = $.getElementById("upload-btn");
uploadFunc.addEventListener("click", uploadTodos);

async function uploadTodos() {
    if (!localStorage.getItem("ToDos")) localStorage.setItem("ToDos", "[]");
    const request = {
        token: localStorage.getItem("token"),
        todos: localStorage.getItem("ToDos")
    };
    console.log(request);
    const response = await fetch("http://localhost:3000/database/upload", {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
    if (!response.ok) {
        if (response.status === 401) {
            alert("please login")
            return;
        }
    } else {
        alert("uploaded successfully")
    }
}

// download : 

const downloadButton = document.getElementById("download-btn");
downloadButton.addEventListener("click", downloadTodos);

async function downloadTodos() {
    const response = await fetch("http://localhost:3000/database/download", {
        method: "POST",
        body: JSON.stringify({ token: `${localStorage.getItem("token")}` }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });

    if (!response.ok) {
        if (response.status === 401) {
            alert("please Login")
        } else {
            const err = await response.json();
            console.log(`error: ${err}`);
        }
    } else {
        const removeTodos = document.querySelectorAll(".well");
        removeTodos.forEach((item) => {
            item.remove();
        });

        const jsonResponse = await response.json();
        if (jsonResponse.length === 0) {
            alert("you dont have any todos");
            return;
        }

        let arryForSave = [];
        jsonResponse.forEach((item) => {
            let userTodo = {
                content: item.content,
                status: item.compelet,
                id: item.id
            }
            arryForSave.push(userTodo);
            localStorage.setItem("ToDos", JSON.stringify(arryForSave));
            location.reload();
        })
    }

}

/* sign up button */

const signup = $.getElementById("signup-btn");
signup.addEventListener("click", signUp);

function signUp() {
    document.getElementById('showsignupModal').style.display = 'block';
}

//for sign up user
const signUpForm = document.getElementById("signupForm");
signUpForm.addEventListener("submit", signupFunc);
const repeat = $.getElementById("repeatUser");
const waitModal = $.getElementById("wait");

async function signupFunc(event) {
    event.preventDefault();
    const myData = new FormData(signUpForm);
    const formDataObj = Object.fromEntries(myData.entries());
    formDataObj.todos = [];
    const response = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        body: JSON.stringify(formDataObj),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    });
    if (!response.ok) {
        const err = await response.text();
        if (response.status === 403) {
            repeat.style.display = "block";
            return;
        } else {
            console.log("error: " + err);
        }
    } else {
        let token = await response.json();
        localStorage.setItem("token", JSON.stringify(token));
        waitModal.style.display = "block";
        setTimeout(() => {
            location.reload();
        }, 2500);

    }
}

const token = localStorage.getItem("token");
const tokenObj = { token: `${token}` };
if (token) {
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("signup-btn").style.display = "none";
    document.getElementById("log-out").style.display = "block";
    (async () => {
        const response = await fetch("http://localhost:3000/users/username", {
            method: "POST",
            body: JSON.stringify(tokenObj),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        });
        if (!response.ok) {
            if (response.status === 403) {
                localStorage.removeItem("token");
                location.reload();
                return;
            }
            const err = await response.json();
            console.log(`error: ${err}`);
            return;
        } else {
            const name = await response.json();
            localStorage.setItem("name", JSON.stringify(name));
            document.getElementById("userLogined").innerHTML = name;
            return;
        }
    })();
} else {
    localStorage.removeItem("name");
    document.getElementById("userLogined").innerHTML = "User";
}


function aboutMe(){
    window.location = "http://localhost:3000/todo/aboutme.html"
}