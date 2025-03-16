const btn_add = document.querySelector(".add_task");
const task_list = document.querySelector(".task_list");
const user_input = document.getElementById("user_input");
const done_tasks_list = document.querySelector(".done_list");
const modal = document.querySelector(".modal");

loadTasks();
loadDoneTasks();

btn_add.addEventListener("click", addNew);
document.addEventListener("keydown", function(e) {
    if(e.key == "Enter" && document.activeElement === user_input) {
        addNew()
    }
});

function addNew(){

    if (user_input.value != "") {
        
        createTask(user_input.value);
        user_input.value = "";
        saveTasks();
        saveDoneTasks();
    }
}

function createTask(taskText){

    const new_task = document.createElement("div");
    const new_task_text = document.createElement("div");
    const new_buttons = document.createElement("div");
    const new_done_button = document.createElement("button");
    const new_delete_button = document.createElement("button");
    const new_edit_button = document.createElement("button");

    new_task.classList.add("task");
    new_task_text.classList.add("task_text");
    new_buttons.classList.add("buttons");
    new_done_button.classList.add("done_task");
    new_edit_button.classList.add("edit_task");
    new_delete_button.classList.add("delete_task");

    new_task_text.textContent = taskText;
        
    task_list.appendChild(new_task);
    new_task.appendChild(new_task_text);
    new_task.appendChild(new_buttons);
    new_buttons.appendChild(new_done_button);
    new_buttons.appendChild(new_delete_button);
    new_buttons.appendChild(new_edit_button);

    new_delete_button.addEventListener("click", function(){
        task_list.removeChild(new_task);
        saveTasks();
        saveDoneTasks();
    });
    
    new_done_button.addEventListener("click", function(){

        // берем заново, в ситуации если у нас изменялась задача
        let taskText = new_task.firstChild.textContent;

        task_list.removeChild(new_task);
        createDoneTask(taskText)
        saveTasks();
        saveDoneTasks();
    });

    new_edit_button.addEventListener("click", function(){
        editTask(new_task);
    });
}

function editTask(new_task){

    task_list.querySelectorAll("button").forEach(function(item){
        item.disabled = true;
    });
    const text_input = document.createElement("input");
    const edit_area = document.createElement("div");
    const previous_text = document.createElement("div");
    const edit_buttons = document.createElement("div");
    const accept = document.createElement("button");
    const cancel = document.createElement("button");

    modal.classList.add("modal");
    modal.classList.add("open");
    previous_text.classList.add("previous_text");
    edit_area.classList.add("edit_area");
    text_input.classList.add("text");
    text_input.classList.add("text_edit");
    edit_buttons.classList.add("edit_buttons");
    accept.classList.add("common_button");
    cancel.classList.add("common_button");

    text_input.setAttribute("id", "edit_input");
    text_input.placeholder = "Введите новый текст задачи...";
    accept.textContent = "Принять изменения";
    cancel.textContent = "Отменить";
    previous_text.textContent = "Изменить задачу: " + new_task.firstChild.textContent;
    modal.appendChild(edit_area);
    edit_area.appendChild(previous_text);
    edit_area.appendChild(text_input);
    edit_area.appendChild(edit_buttons);
    edit_buttons.appendChild(accept);
    edit_buttons.appendChild(cancel);

    const edit_input = document.getElementById("edit_input");

    accept.addEventListener("click", function() {
        if (edit_input.value != "") {
            new_task.firstChild.textContent = edit_input.value;
        }
        modal.removeChild(edit_area);
        task_list.querySelectorAll("button").forEach(function(item){
            item.disabled = false;
        });
        saveTasks();
        modal.classList.remove("open");
    });

    document.addEventListener("keydown", function(e) {
        if(e.key == "Enter" && document.activeElement === text_input) {
            if (edit_input.value != "") {
                new_task.firstChild.textContent = edit_input.value;
            }
            modal.removeChild(edit_area);
            task_list.querySelectorAll("button").forEach(function(item){
                item.disabled = false;
            });
            saveTasks();
            modal.classList.remove("open");
        }
    });

    cancel.addEventListener("click", function() {
        modal.removeChild(edit_area);
        task_list.querySelectorAll("button").forEach(function(item){
            item.disabled = false;
        });
        modal.classList.remove("open");
    });
}

function saveTasks(){

    let tasks = [];
    task_list.querySelectorAll(".task").forEach(function(item){
        tasks.push(item.firstChild.textContent.trim())
    });

    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function loadTasks(){
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(createTask)
}

function saveDoneTasks(){

    let done_tasks = [];
    done_tasks_list.querySelectorAll(".done").forEach(function(item){
        done_tasks.push(item.firstChild.textContent.trim())
    });

    localStorage.setItem('done_tasks', JSON.stringify(done_tasks))
}

function loadDoneTasks(){
    const done_tasks = JSON.parse(localStorage.getItem('done_tasks')) || [];
    done_tasks.forEach(createDoneTask)
}

function createDoneTask(taskText){
    const new_done_task = document.createElement("div");
    const new_task_text = document.createElement("div");
    new_task_text.classList.add("task_text");
    new_done_task.classList.add("task");
    new_done_task.classList.add("done");
    new_task_text.textContent = taskText;
    
    const new_buttons = document.createElement("div");
    const new_delete_button = document.createElement("button");

    new_buttons.classList.add("buttons");
    new_delete_button.classList.add("delete_task");
        
    done_tasks_list.appendChild(new_done_task);
    new_done_task.appendChild(new_task_text);
    new_done_task.appendChild(new_buttons);
    new_buttons.appendChild(new_delete_button);

    new_delete_button.addEventListener("click", function(){
        done_tasks_list.removeChild(new_done_task);
        saveTasks();
        saveDoneTasks();
    });    
}