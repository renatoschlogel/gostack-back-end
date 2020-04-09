const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

const projects = [];

function logRequest(request, response, next){
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);
  next();
}

function validateProjectId(request, response, next) {

  const { id } = request.params;
  if(!isUuid(id)){
    return response.status(400).json({error: 'Invalid project id'})
  }
  return next();
}

app.use(logRequest);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) =>{
  const { title } = request.query;

  let results = projects;
  if (title){
    results = projects.filter(project => project.title.includes(title));
  }

  return response.json(results);
});

app.post('/projects', (request, response) =>{

  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner};

  projects.push(project);

  return response.json(project);
});

app.put('/projects/:id', (request, response) =>{

  const { id } = request.params;
  const {title, owner} = request.body;

  const indexProject = projects.findIndex(project => project.id === id);
  if(indexProject < 0) {
    return response.status(400).json({error: "Project not found!"});
  }
 
  projects[indexProject].title = title;
  projects[indexProject].owner = owner;
 
  return response.json(projects[indexProject]);
});

app.delete('/projects/:id', (request, response) =>{
  const { id } = request.params;

  const indexProject = projects.findIndex(project => project.id === id);
  if(indexProject < 0) {
    return response.status(400).json({error: "Project not found!"});
  }

  projects.splice(indexProject, 1);

  response.status(204).send();
});

module.exports = app;
