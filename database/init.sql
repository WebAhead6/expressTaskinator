BEGIN;

DROP TABLE IF EXISTS tasks,subtasks,users CASCADE;

CREATE TABLE users (
  userid SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email TEXT NOT NULL,
  password VARCHAR(1000) NOT NULL
);

CREATE TABLE tasks (
taskid SERIAL PRIMARY KEY,
tasktext TEXT,
author_id SERIAL REFERENCES users(userid),
taskdate TEXT
);

CREATE TABLE subtasks (
subtaskid SERIAL PRIMARY KEY,
subtasktext TEXT,
author_id SERIAL REFERENCES users(userid),
task_id SERIAL REFERENCES tasks(taskid),
strike BOOLEAN NOT NULL
);


INSERT INTO users (username, email,password) VALUES 
('bader', 'badf@gmail.com', 'pass'),
('yas', 'yas@gmail.com', 'pass'),
('ali', 'ali@gmail.com', 'pass');

INSERT INTO tasks (tasktext, author_id,taskdate) VALUES 
('Finish the javascript express porject', 1, '18/08/2020'),
('take nala for a strode', 1, '18/08/2020'),
('get a beer!', 3, '18/08/2020'),
('finish ghost of tsushima!', 1, '18/08/2020');

INSERT INTO subtasks (subtasktext, author_id, task_id, strike) VALUES 
('use handlebars',1 , 1, TRUE ),
('add dates!',1 , 1, FALSE ),
('buy some wine aswell', 3, 3, FALSE);



GRANT ALL PRIVILEGES ON TABLE subtasks TO bader;
GRANT ALL PRIVILEGES ON TABLE users TO bader;
GRANT ALL PRIVILEGES ON TABLE tasks TO bader;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO bader; 
COMMIT;
