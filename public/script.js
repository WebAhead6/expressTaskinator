function whiteSpaces(text) {
  return text.trim();
}

function taskCompleter(htmlel) {
  // console.log(htmlel);
  return `${htmlel.classList.toggle("striked")}`;
}
// ------------------------------ The todoList logic
// our selectors
const addForm = document.querySelector(".add");
const ullist = document.querySelector(".todos");
const search = document.querySelector(".search input");

// the form selector
addForm.addEventListener("submit", (e) => {
  let todo = addForm.add.value.trim();
  // ullist.prepend(li);
  if (todo.length) {
    //current date getter
    let timestamp = getCurrentTime();

    const newtask = {
      tasktext: todo,
      taskdate: timestamp,
    };
    // e.preventDefault();
    // console.log("from the front end we send ", newtask);
    fetch("/addTask", {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(newtask),
    }).then(() => {
      // console.log("exrctyvuiokpl[exrctvybunimok,rctfvybuni");
      location.reload();
    });

    addForm.reset();
  } else {
    alert("please enter something");
  }
});

function getCurrentTime() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //As January is 0.
  let yyyy = today.getFullYear();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return dd + "/" + mm + "/" + yyyy;
}

ullist.addEventListener("click", (e) => {
  // console.log(e.target);
  let data;
  let classLists = e.target.classList;
  if (classLists[1] === "insideli") {
    data = {
      paretTaskID:
        e.target.parentElement.parentElement.parentElement.classList[1],
      toStrike: e.target.textContent.trim(),
    };

    // console.log(data);
    fetch("/strikeTodo", {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(data),
    }).then(() => {
      // console.log("exrctyvuiokpl[exrctvybunimok,rctfvybuni");
      location.reload();
    });
    taskCompleter(e.target);
  }

  if (e.target.classList.contains("plus")) {
    let todo = addForm.add.value.trim();
    // ullist.prepend(li);
    if (todo.length) {
      // data.subtasktext, data.author_id, data.task_id, FALSE;
      console.log(todo, e.target);
      let data = {
        subtasktext: todo,
        task_id:
          e.target.parentElement.parentElement.firstChild.nextSibling
            .classList[1],
      };

      fetch("/addSubtask", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(data),
      }).then(() => {
        // console.log("exrctyvuiokpl[exrctvybunimok,rctfvybuni");
        location.reload();
      });

      addForm.reset();
    } else {
      alert("please enter something");
    }
  }
  if (classLists.contains("delete")) {
    // the pressed element
    let target = e.target.parentElement.parentElement.firstChild.nextSibling;
    // e.target.parentElement.parentElement.remove();
    let data = {};

    // check if we are clicking a subtask
    if (target.classList.contains("insideli")) {
      let mainTaskID =
        target.parentElement.parentElement.parentElement.classList[1];

      data = {
        taskid: mainTaskID,
        text: target.textContent,
        flag: "sub",
      };
    } else {
      // this means we are selecting a Main TASK not a subtask
      data = {
        taskid: target.classList[1],
        flag: "main",
      };
    }
    // involke the model controller
    fetch("/deleteTask", {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(data),
    }).then(() => {
      // console.log("exrctyvuiokpl[exrctvybunimok,rctfvybuni");
      location.reload();
    });
  }
});

//----------------------------- filter and search logic
const filterTodos = (term) => {
  //filter words that doesnt include the word, add a filtered class to them to remove them from the list
  Array.from(ullist.children)
    .filter((todoItem) => {
      return !todoItem.textContent.toLowerCase().includes(term);
      // console.log(todoItem.textContent);
      // return true;
    })
    .forEach((todoItem) => {
      todoItem.classList.add("filtered");
    });
  // // shorter syntax but less readable for newcomers:
  // Array.from(ullist.children)
  //     .filter((todoItem) => !todoItem.textContent.includes(term))
  //     .forEach((todoItem) => todo.classList.add('filtered'));

  // remove filtered when the word is in the text
  Array.from(ullist.children)
    .filter((todoItem) => {
      return todoItem.textContent.toLowerCase().includes(term);
    })
    .forEach((todoItem) => {
      todoItem.classList.remove("filtered");
    });

  return Array.from(ullist.children).filter((todoItem) => {
    return todoItem.textContent.toLowerCase().includes(term);
  });
};

//keyup event - this will fire out search logic
search.addEventListener("keyup", () => {
  const term = search.value.trim().toLowerCase();

  filterTodos(term);
});

// app drawer logic
const drawerBtn = document.querySelector(".toggleBTN");
const appDrawer = document.querySelector(".app_drawer");
const divContainer = document.querySelector("div.container");
drawerBtn.addEventListener("click", () => toggleDrawer(appDrawer));

divContainer.addEventListener("click", () => {
  if (appDrawer.classList.contains("app_drawer--visible")) {
    appDrawer.classList.remove("app_drawer--visible");
  }
});

function toggleDrawer(drawer) {
  drawer.classList.toggle("app_drawer--visible");
}

//button animation

/// client side authentication

function clinetAuth() {
  console.log("loading ClientAuth");
  let username = document.querySelector("#username");
  let email = document.querySelector("#email");
  let password = document.querySelector("#password");
  let confirmPassword = document.querySelector("#confirmPassowrd");
  let registerform = document.querySelector(".register__form");

  let emailErr = document.querySelector("#emailErr");
  let passwordErr = document.querySelector("#passwordErr");
  let confirmErr = document.querySelector("#confirmErr");

  let checkEmail = function () {
    if (email.validity.typeMismatch) {
      displayErr(emailErr, "Please enter a valid email address");
    } else if (email.validity.valueMissing) {
      displayErr(emailErr, "Please enter an email address");
    } else {
      displayErr(emailErr, "");
      return true;
    }
  };

  let checkPw = function () {
    if (password.validity.patternMismatch) {
      displayErr(
        passwordErr,
        "Password must contain at least eight characters, including one letter and one number"
      );
    } else if (password.validity.valueMissing) {
      displayErr(passwordErr, "Please enter a password");
    } else {
      displayErr(passwordErr, "");
      return true;
    }
  };

  let checkConfirmPw = function () {
    if (password.value != confirmPassword.value) {
      displayErr(confirmErr, "Passwords do not match");
    } else if (confirmPassword.validity.valueMissing) {
      displayErr(confirmErr, "Please confirm your password");
    } else {
      displayErr(confirmErr, "");
      return true;
    }
  };

  function displayErr(errElem, errMsg) {
    errElem.innerText = errMsg;
  }

  email.addEventListener("focusout", checkEmail);
  password.addEventListener("focusout", checkPw);
  confirmPassword.addEventListener("focusout", checkConfirmPw);

  registerform.addEventListener("submit", function (event) {
    if (!checkEmail()) {
      event.preventDefault();
    }
    if (!checkPw()) {
      event.preventDefault();
    }
    if (!checkConfirmPw()) {
      event.preventDefault();
    }
    if (checkEmail() && checkPw() && checkConfirmPw()) {
      console.log("all checks passed");
      fetch("/addUser", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
          username: username.value,
          email: email.value,
          password: password.value,
          confirmPassword: password.value,
        }),
      });
    }
  });
}

let url = window.location.href.url.split("/");
let rest = url[url.length - 1];
console.log(url, rest);
if (rest == "register") {
  clinetAuth();
}
