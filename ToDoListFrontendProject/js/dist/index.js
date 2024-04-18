"use strict";
var Status;
(function (Status) {
    Status["CREATED"] = "Created";
    Status["COMPLETED"] = "Completed";
})(Status || (Status = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "low";
    Priority["MEDIUM"] = "medium";
    Priority["HIGH"] = "high";
})(Priority || (Priority = {}));
const baseURL = "http://localhost:3000";
document.getElementById("close-warning")?.addEventListener("click", () => {
    let warningOutput = document.getElementById("warning");
    warningOutput.style.display = "none";
});
const getUsernameWithEmail = async (email) => {
    const url = `${baseURL}/user/username/${email}`;
    let username = "";
    try {
        await fetch(url, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => (username = data.username));
        return username;
    }
    catch (error) {
        console.error(error);
    }
};
const processFormSignIn = async () => {
    const SUCCESS_STATUS = 200;
    const INCORRECT_PASSWORD_STATUS = 400;
    const emailInput = document.getElementById("email-input")
        .value;
    const passwordInput = (document.getElementById("password-input")).value;
    let warningOutput = document.getElementById("warning");
    if (!warningOutput) {
        throw new Error("Warning div not found!");
    }
    let warningOutputStyle = warningOutput.style;
    const data = {
        email: emailInput,
        password: passwordInput,
    };
    const url = `${baseURL}/user/login`;
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === SUCCESS_STATUS) {
            const username = await getUsernameWithEmail(emailInput);
            window.location.href = `../../../html/user-tasks-page.html?username=${username}`;
            console.log("Logged in Successfully!");
        }
        else if (response.status === INCORRECT_PASSWORD_STATUS) {
            warningOutputStyle.display = "block";
            console.log("Incorrect password or email");
        }
    }
    catch (error) {
        console.error(error);
    }
};
const processFormSignUp = async () => {
    const SUCCESS_STATUS = 200;
    const EMAIL_ALREADY_EXISTS_STATUS = 404;
    const usernameInput = (document.getElementById("username-input")).value;
    const emailInput = document.getElementById("email-input")
        .value;
    const passwordInput = (document.getElementById("password-input")).value;
    const confirmPasswordInput = (document.getElementById("confirm-password-input")).value;
    let warning = document.getElementById("warning-text");
    let warningOutput = document.getElementById("warning");
    let warningOutputStyle = warningOutput.style;
    if (usernameInput.length === 0 ||
        emailInput.length === 0 ||
        passwordInput.length === 0) {
        const errorMessage = "Please complete all the fields";
        warning.textContent = errorMessage;
        warningOutputStyle.display = "block";
        throw new Error(errorMessage);
    }
    for (let i = 0; i < usernameInput.length; i++) {
        let code = usernameInput[i].charCodeAt(0);
        if (!((code >= 65 && code <= 90) || (code >= 97 && code <= 122))) {
            const errorMessage = "Username must only contain lowercase and uppercase letters";
            warning.textContent = errorMessage;
            warningOutputStyle.display = "block";
            throw new Error(errorMessage);
        }
    }
    let typesOfCharacter = {};
    for (let i = 0; i < passwordInput.length; i++) {
        let code = passwordInput[i].charCodeAt(0);
        if (code >= 65 && code <= 90) {
            typesOfCharacter["UpperCase"] = 1;
        }
        if (code >= 97 && code <= 122) {
            typesOfCharacter["LowerCase"] = 1;
        }
        if (code >= 48 && code <= 57) {
            typesOfCharacter["Number"] = 1;
        }
        if ((code >= 32 && code <= 47) ||
            (code >= 58 && code <= 64) ||
            (code >= 91 && code <= 96) ||
            (code >= 123 && code <= 126)) {
            typesOfCharacter["SpecialChar"] = 1;
        }
    }
    if (passwordInput.length < 8 || Object.keys(typesOfCharacter).length < 4) {
        const errorMessage = "Password must have a minimum length of 8 and must contain at least one lowercase, uppercase and special character";
        warning.textContent = errorMessage;
        warningOutputStyle.display = "block";
        throw new Error(errorMessage);
    }
    if (passwordInput !== confirmPasswordInput) {
        const errorMessage = "Password does not match";
        warning.textContent = errorMessage;
        warningOutputStyle.display = "block";
        throw new Error(errorMessage);
    }
    const data = {
        username: usernameInput,
        email: emailInput,
        password: passwordInput,
    };
    const url = `${baseURL}/user/register`;
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === SUCCESS_STATUS) {
            console.log("Successfully registered user");
            window.location.href = "../../../html/sign-in-page.html";
        }
        else if (response.status === EMAIL_ALREADY_EXISTS_STATUS) {
            const errorMessage = "Email already registered, did you mean to sign in instead?";
            warning.textContent = errorMessage;
            warningOutputStyle.display = "block";
            throw new Error(errorMessage);
        }
    }
    catch (error) {
        console.error(error);
    }
};
const getUsernameFromWindows = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("username");
};
const displayUsername = () => {
    const username = getUsernameFromWindows();
    if (username) {
        document.getElementById("username").textContent = username || "";
    }
    else {
        document.getElementById("username").textContent = "Guest";
    }
};
displayUsername();
const retrieveUserTasks = async () => {
    const username = getUsernameFromWindows();
    const url = `${baseURL}/tasks/retrieve_tasks/${username}`;
    let tasks = [];
    try {
        await fetch(url, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => (tasks = data));
        return tasks;
    }
    catch (error) {
        console.error(error);
    }
    return [];
};
const generateTableRows = (data) => {
    const tableBody = document.getElementById("table-body");
    const rowsHTML = data
        .map((task) => {
        return `
        <tr class="task-body-row">
            <td class="task-row-name" data-task-status=${task.status}>${task.name}</td>
            <td class="task-row-priority" data-task-status=${task.status}>${task.priority}</td>
            <td class="task-row-actions">
                <i class="completed-icon fas fa-check" data-task-id=${task._id} data-task-status=${task.status}></i>
                <i class="delete-icon fas fa-trash-alt" data-task-id=${task._id}></i>
                <i class="edit-icon fas fa-pen" data-task-id=${task._id}></i>
            </td>
        </tr>
        `;
    })
        .join("");
    tableBody.innerHTML = rowsHTML;
    document.querySelectorAll(".task-row-priority").forEach((task) => {
        const taskElement = task;
        const status = taskElement.dataset.taskStatus;
        const priority = taskElement.textContent?.trim() ?? "";
        if (priority === Priority.LOW) {
            taskElement.style.color = "forestgreen";
        }
        else if (priority === Priority.MEDIUM) {
            taskElement.style.color = "darkblue";
        }
        else if (priority === Priority.HIGH) {
            taskElement.style.color = "firebrick";
        }
        if (status && status === Status.COMPLETED) {
            taskElement.style.color = "grey";
        }
    });
    document.querySelectorAll(".task-row-name").forEach((task) => {
        const taskElement = task;
        const status = taskElement.dataset.taskStatus;
        if (status && status === Status.COMPLETED) {
            taskElement.style.color = "grey";
            taskElement.style.textDecoration = "line-through";
        }
    });
    document.querySelectorAll(".completed-icon").forEach((task) => {
        const taskElement = task;
        const status = taskElement.dataset.taskStatus;
        if (status && status === Status.COMPLETED) {
            taskElement.style.color = "grey";
        }
    });
};
const generateInitialTable = async () => {
    const userTasks = await retrieveUserTasks();
    generateTableRows(userTasks);
};
generateInitialTable();
const allSection = document.getElementById("all-section");
const activeSection = document.getElementById("active-section");
const completedSection = document.getElementById("completed-section");
const setStyleOfSections = (selectedSection) => {
    allSection.style.borderBottom = "none";
    activeSection.style.borderBottom = "none";
    completedSection.style.borderBottom = "none";
    selectedSection.style.borderBottom = "2px solid rgb(0,128,128)";
};
allSection?.addEventListener("click", () => {
    generateInitialTable();
    setStyleOfSections(allSection);
});
activeSection?.addEventListener("click", async () => {
    const userTasks = await retrieveUserTasks();
    const activeSectionTasks = userTasks.filter((task) => {
        return task.status != Status.COMPLETED;
    });
    generateTableRows(activeSectionTasks);
    setStyleOfSections(activeSection);
});
completedSection?.addEventListener("click", async () => {
    const userTasks = await retrieveUserTasks();
    const completedSectionTasks = userTasks.filter((task) => {
        return task.status != Status.CREATED;
    });
    generateTableRows(completedSectionTasks);
    setStyleOfSections(completedSection);
});
const addNewTask = async () => {
    let newTaskInput = document.getElementById("add-task");
    let newTaskPriority = (document.getElementById("select-priority"));
    const newTask = {
        name: newTaskInput.value,
        status: Status.CREATED,
        priority: newTaskPriority.value || Priority.LOW,
    };
    if (newTask.name.length > 0) {
        try {
            const username = getUsernameFromWindows();
            const url = `${baseURL}/tasks/create_task/${username}`;
            await fetch(url, {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const updatedTasks = await retrieveUserTasks();
            generateTableRows(updatedTasks);
            newTaskInput.value = "";
        }
        catch (error) {
            console.error(error);
        }
    }
    else {
        throw new Error("Task cannot have an empty name");
    }
};
document.addEventListener("click", async (event) => {
    const target = event.target;
    const username = getUsernameFromWindows();
    const taskId = target.dataset.taskId;
    if (username && target && taskId) {
        if (target.classList.contains("delete-icon")) {
            await deleteAction(username, taskId);
        }
        else if (target.classList.contains("completed-icon")) {
            await completeAction(username, taskId);
        }
        else if (target.classList.contains("edit-icon")) {
            await editAction(username, taskId);
        }
    }
    else {
        throw new Error("username, target and taskId cannot be null");
    }
});
const deleteAction = async (username, taskId) => {
    const url = `${baseURL}/tasks/delete_task/${username}`;
    const data = {
        id: taskId,
    };
    try {
        await fetch(url, {
            method: "DELETE",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    catch (error) {
        console.error(error);
    }
    const updatedTasks = await retrieveUserTasks();
    generateTableRows(updatedTasks);
};
const completeAction = async (username, taskId) => {
    const url = `${baseURL}/tasks/complete_task/${username}`;
    const data = {
        id: taskId,
        status: "Completed",
    };
    try {
        await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    catch (error) {
        console.error(error);
    }
    const updatedTasks = await retrieveUserTasks();
    generateTableRows(updatedTasks);
};
const editAction = async (username, taskId) => {
    const url = `${baseURL}/tasks/retrieve_delete_task/${username}`;
    const data = {
        id: taskId,
    };
    let task;
    let newTaskInput = document.getElementById("add-task");
    let newTaskPriority = (document.getElementById("select-priority"));
    try {
        await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => (task = data));
        newTaskInput.value = task.name;
        newTaskPriority.value = task.priority;
    }
    catch (error) {
        console.error(error);
    }
};
