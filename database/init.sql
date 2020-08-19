BEGIN;

DROP TABLE IF EXISTS tasks,subtasks users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password TEXT NOT NULL
  
);

CREATE TABLE tasks (
id SERIAL PRIMARY KEY,
task TEXT,
task_author INTEGER REFERENCES users(id),
date TEXT,
);

CREATE TABLE subtasks (
task_id SERIAL REFERENCES tasks(id),
task TEXT,
task_author INTEGER REFERENCES users(id),
date TEXT,
);


INSERT INTO tasks (task, subtasks) VALUES (
  'johndoe@mail.com',
  crypt('johnspassword', gen_salt('bf'))
);

COMMIT;

 {
    "task": "Finish the javascript express porject",
    "subtasks": ["use handlebars", "add dates!"],
    "author": "Bader",
    "date": ""
  },
  {
    "task": "take nala for a strode",
    "subtasks": [],
    "author": "Bader",
    "date": ""
  },
  {
    "task": "get a beer!",
    "subtasks": ["but some wine aswell"],
    "author": "Bader",
    "date": ""
  }