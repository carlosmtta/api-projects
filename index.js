const express = require("express");

const server = express();

const projects = [];

server.use(express.json());

function checkProjectInArray(req, res, next) {
  const project = projects[req.params.id];

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  req.project = project;

  return next();
}

function checkBodyParams(req, res, next) {
  if (!req.body.id) {
    return res.status(400).json({ error: "Id is required" });
  }
  if (!req.body.title) {
    return res.status(400).json({ error: "Title is required" });
  }
  if (!req.body.tasks[0]) {
    return res.status(400).json({ error: "Tasks array not sent" });
  }

  return next();
}

function checkActiveProject(req, res, next) {
  if (projects[req.body.title]) {
    return res.status(400).json({ error: "Id is already in use" });
  }

  return next();
}

// Retorna todos os projetos armazenados
server.get("/projects", (req, res) => {
  return res.json(projects);
});

// Retorna projeto solicitado no parâmetro id
server.get("/projects/:id", checkProjectInArray, (req, res) => {
  return res.json(req.project);
});

// Adiciona um novo projeto
server.post("/projects", checkBodyParams, checkActiveProject, (req, res) => {
  projects.push(req.body);
  return res.json(projects);
});

// Adiciona uma tarefa em um projeto existente
server.post("/projects/:id/tasks", checkProjectInArray, (req, res) => {
  projects[req.body.id].tasks.push(req.body.tasks);

  return res.json(projects[req.body.id]);
});

server.put(
  "/projects/:id",
  checkBodyParams,
  checkProjectInArray,
  (req, res) => {
    projects[req.body.id].title = req.body.title;
    return res.json(project[req.body.id].title);
  }
);

server.delete("/projects/:id", checkProjectInArray, (req, res) => {
  const { id } = req.params;
  projects.splice(id, 1);

  res.send();
});

server.listen(3000);
