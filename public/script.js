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

// const delete = document.querySelector(".delete");

// console.log(ullist);
// ------------------------------  the template generator, which creates a different markup for a MAIN LI which could contain other LIs and differentiate with a SUB LI - with does not
// const generateTemplate = (todo, elementToAdd, targetEl = ``) => {
//   //create the li
//   let taskli = document.createElement("li");
//   taskli.classList.add("text-center");
//   // format the markup
//   let spanli = document.createElement("span");
//   spanli.classList.add("todotext");
//   spanli.textContent = `${todo}`;

//   taskli.appendChild(spanli);
//   // this is all the elements all li should contain
//   let divGrouper = document.createElement("div");
//   divGrouper.classList.add("igroup");
//   let trash = document.createElement("i");
//   let plus = document.createElement("i");
//   trash.classList.add("fa", "fa-trash", "delete");
//   plus.classList.add("fa", "fa-plus", "plus");
//   divGrouper.appendChild(trash);
//   taskli.appendChild(divGrouper);
//   // console.log(taskli);
//   // if its a mainn LI the flag should be with ul
//   if (elementToAdd === "ul") {
//     taskli.classList.add("main");
//     taskli.lastChild.prepend(plus);
//     ullist.appendChild(taskli);
//   }
//   /// a sub li element
//   if (elementToAdd === "li") {
//     taskli.classList.add("subli");
//     taskli.querySelector("span").classList.add("insideli");
//     targetEl.parentElement.parentElement
//       .querySelector("span")
//       .appendChild(taskli);
//   }

//   return taskli;
// };
// the form selector
addForm.addEventListener("submit", (e) => {
  // const templateFlag = "ul";
  // console.log(addForm.add.value);
  // const li = document.createElement('li');
  let todo = addForm.add.value.trim();
  // ullist.prepend(li);
  if (todo.length) {
    //current date getter
    let timestamp = getCurrentTime();

    const newtask = {
      task: todo,
      subtasks: [],
      author: "Admin",
      date: timestamp,
    };
    // generateTemplate(todo, templateFlag);
    // console.log("from the front end we send ", newtas;
    fetch("/addTask", {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(newtask),
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

// using event delegation to delete todos -- Mario's brilliant Idea :) but our implementation
ullist.addEventListener("click", (e) => {
  // console.log(e.target);
  let data;
  let classLists = e.target.classList;
  // classLists.forEach((e) => console.log(e));
  if (classLists[1] === "insideli") {
    data = {
      taskID: e.target.parentElement.parentElement.parentElement.classList[1],
      toStrike: e.target.textContent.trim(),
    };
  } else if (classLists.contains("todotext")) {
    data = {
      taskID: classLists[1],
      toStrike: e.target.textContent.trim().split("\n")[0],
    };
  }

  console.log(data);

  fetch("/strikeTodo", {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify(data),
  });
  taskCompleter(e.target);

  if (e.target.classList.contains("plus")) {
    console.log(e.target.parentElement.parentElement);
    let templateFlag = "li";
    let todo = addForm.add.value.trim();
    // ullist.prepend(li);
    if (todo.length) {
      generateTemplate(todo, templateFlag, e.target);
      addForm.reset();
    } else {
      alert("please enter something");
    }
  }
  if (classLists.contains("delete")) {
    console.log(e.target);
    e.target.parentElement.parentElement.remove();
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
