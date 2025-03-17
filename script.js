const btn_add = document.querySelector(".add_task");
const task_list = document.querySelector(".task_list");
const user_input = document.getElementById("user_input");
const done_tasks_list = document.querySelector(".done_list");
const modal = document.querySelector(".modal");

loadTasksNew([['tasks', false], ['done_tasks', true]]);

btn_add.addEventListener("click", addNew);

document.addEventListener("keydown", function(e) {
    if(e.key === "Enter" && document.activeElement === user_input) {
        addNew()
    }
});

function addNew(){
    if (user_input.value != "") {
        createTaskNew(user_input.value);
        user_input.value = "";
        saveTasksNew([[task_list, '.task', 'tasks'], [done_tasks_list, '.done', 'done_tasks']]);
    }
}

function multiple_addClasses_helper(element_and_classes){
    element_and_classes.forEach((element) => {
        if (element[1]){
            element[1].forEach((item) => 
                element[0].classList.add(item));
     }
    })
}

function multiple_appendChild_helper(element_and_children){
    element_and_children.forEach((element) => {
        if (element[1]){
        element[1].forEach((item) => 
        element[0].appendChild(item));
    }
    })
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

    multiple_addClasses_helper(
        [[modal, ["modal", "open"]], [previous_text, ["previous_text"]],
        [edit_area, ["edit_area"]], [text_input,["text", "text_edit"]],
        [edit_buttons, ["edit_buttons"]], [accept,["common_button"]],
        [cancel,["common_button"]]]);

    text_input.setAttribute("id", "edit_input");
    text_input.placeholder = "Введите новый текст задачи...";
    accept.textContent = "Принять изменения";
    cancel.textContent = "Отменить";
    previous_text.textContent = "Изменить задачу: " + new_task.firstChild.textContent;
    
    multiple_appendChild_helper(
        [[modal, [edit_area]], 
        [edit_area, [previous_text, text_input, edit_buttons]],
        [edit_buttons, [accept, cancel]]]);

    accept.addEventListener("click", function() {
        acceptChanges(edit_input, new_task);
        modal.removeChild(edit_area);
        modal.classList.remove("open");
    });

    document.addEventListener("keydown", function(e) {
        if(e.key === "Enter" && document.activeElement === text_input) {
            acceptChanges(edit_input, new_task);
            modal.removeChild(edit_area);
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

function acceptChanges(edit_input, new_task){
    if (edit_input.value != "") {
        new_task.firstChild.textContent = edit_input.value;
    }
    task_list.querySelectorAll("button").forEach(function(item){
        item.disabled = false;
    });
    saveTasksNew([[task_list, '.task', 'tasks']]);
}

function loadTasksNew(tasks_array){
    tasks_array.forEach((array_element) => {
        const tasks = JSON.parse(localStorage.getItem(array_element[0])) || [];
        tasks.forEach((task_text => createTaskNew(task_text, array_element[1])));
    });
}

function saveTasksNew(tasks_array){
    tasks_array.forEach((array_element) =>
    {
        const tasks = [];
        array_element[0].querySelectorAll(array_element[1]).forEach(function(item){
        tasks.push(item.firstChild.textContent.trim())
        });
        localStorage.setItem(array_element[2], JSON.stringify(tasks))
    });
}

function createTaskNew(taskText, isDone = false){
    const new_task = document.createElement("div");
    const new_task_text = document.createElement("div");
    const new_buttons = document.createElement("div");
    const new_delete_button = document.createElement("button");

    let new_done_button = null, new_edit_button = null;
    let task_classes = ["task", "done"];
    let buttons = [new_delete_button];
    let list = done_tasks_list;

    if (!isDone){
        new_done_button = document.createElement("button");
        new_edit_button = document.createElement("button");
        task_classes = ["task"];
        edit_button = [new_edit_button,["edit_task"]];
        done_button = [new_done_button,["done_task"]];
        list = task_list;
        buttons = [new_done_button, new_edit_button, new_delete_button];
    }

    multiple_addClasses_helper(
        [[new_task_text, ["task_text"]], [new_task, task_classes],
        [new_buttons, ["buttons"]], [new_delete_button,["delete_task"]],
        edit_button, done_button]);

    new_task_text.textContent = taskText;

    multiple_appendChild_helper([[list, [new_task]],
                                 [new_task, [new_task_text, new_buttons]],
                                 [new_buttons, buttons]]);

    new_delete_button.addEventListener("click", function(){
        list.removeChild(new_task);
        saveTasksNew([[task_list, '.task', 'tasks'], [done_tasks_list, '.done', 'done_tasks']]);
    });   
    
    if (!isDone){
        new_done_button.addEventListener("click", function(){
            let taskText = new_task.firstChild.textContent;
            task_list.removeChild(new_task);
            createTaskNew(taskText, true)
            saveTasksNew([[task_list, '.task', 'tasks'], [done_tasks_list, '.done', 'done_tasks']]);
        });
    
        new_edit_button.addEventListener("click", function(){
            editTask(new_task);
        });
    }
}