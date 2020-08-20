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
      author_id: 1,
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
        author_id: 1,
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
