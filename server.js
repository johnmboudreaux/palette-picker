/*eslint-disable */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.locals.projects = [{
  id: 0,
  name: 'project1',
  palettes: [{
    id: 0,
    projectId: 0,
    colors: ['fffff1', 'fffff2', 'fffff3', 'fffff4', 'fffff5']
  }]
}];

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
});

app.get('/api/v1/projectFolders', (request, response) => {
  response.status(200).json(app.locals.projects);
});

app.post('/api/v1/createProject', (request, response) => {
  app.locals.projects.push(request.body);
  response.status(200).json();
});

app.delete('/api/v1/deletePalette', (request, response) => {
  response.status(200).json();
});

app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}.`);
});
