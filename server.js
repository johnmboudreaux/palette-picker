/*eslint-disable */
// pulls in express library
const express = require('express');
const app = express();

// parser middleware that enables express to parse json
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//variable that lets us use dynamic environments, defults to dev if none found
const environment = process.env.NODE_ENV || 'development';

//configs knex environment
const configuration = require('./knexfile')[environment];

//knex is bridging  to  db
const database = require('knex')(configuration);

//sets port based on env otherwise goes to 3000
app.set('port', process.env.PORT || 3000);

// serves up static elements of the app
app.use(express.static(__dirname + '/public'));
// this ones for jquery, it is npm installed
app.use(express.static(__dirname + '/node_modules'));

// retreives projects from db
app.get('/api/v1/projects', (request, response) => {
  // selects the projects table from app db
  database('projects').select()
    .then( projects => {
      // response has payload that represents the status of requested resource
      return response.status(200).json(projects);
    })
    .catch( error => {
      //server cannot process request for  unknown reason
      response.status(500).json({ error });
    });
});

// retrieves palettes for projects based of of id
app.get('/api/v1/projects/:id/palette', (request, response) => {
  const projectId = request.params.id;
  // selects the palette table from app db
  database('palettes').where('projectId', projectId).select()
    // returns a response from the request no matter
    .then(palette => {
      if (palette.length) {
        // response has payload that represents the status of requested resource
        return response.status(200).json(palette);
      } else {
        // returns not found response
        return response.status(404).json({
          error: `Palette with id: ${projectId} not found`
        });
      }
    })
    .catch( error => {
      // server is not functioning, internal server error
      return response.status(500).json({ error });
    });
});

// retrieves a specific palette based on id
app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).select()
    .then(palette => {
      if (palette.length) {
        // response has payload that represents the status of requested resource
        return response.status(200).json(palette);
      } else {
        //client able to communicate with server, but  server unable to fulfill request.
        return response.status(404).json({
          error: `Could not find palette with id: ${id}`
        });
      }
    })
    .catch(error => {
      // server is not functioning, internal server error
      return response.status(500).json({ error });
    });
});

// retrives projects from db
app.get('/api/v1/projects', (request, response) => {

  database('projects').select()
    .then( project => {
      if (project.length) {
        // response has payload that represents the status of requested resource
        return response.status(200).json(project);
      } else {
        //client able to communicate with server, but  server unable to fulfill request.
        return response.status(404).json({
          error: `Could not find projects`
        });
      }
    })
    .catch( error => {
      // server is not functioning, internal server error
      return response.status(500).json({ error });
    });
});

// retrieves a project based on id
app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;

  database('projects').where("id", id).select()
    .then(project => {
      if (project) {
        // response has payload that represents the status of requested resource
        return response.status(200).json(project);
      } else {
        return response.status(404).json({
          error: `Could not find palette with id: ${id}`
        });
      }
    })
    .catch(error => {
      // server is not functioning, internal server error
      return response.status(500).json({ error });
    });
});

//retrieves a palette based off of an id
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params;

  database('palettes').where('projectId', id).select()
    .then( palettes => {
      if (palettes.length) {
        // request fulfilled and resulted in new resource creation
        return response.status(201).json(palettes);
      } else {
        // response has payload that represents the status of requested resource
        return response.status(200).json([]);
      }
    })
    .catch(error => {
      // server is not functioning, internal server error
      return response.status(500).json({error});
    });
});

// adds a project into projects to the db
app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  // check for required parameter to make sure that all needed info is available from the request
  for (let requiredParameter of ['title']) {
    if (!project[requiredParameter]) {
      //does not have necessary data to prcess request
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }
  //specify the table to insert into and return what is entered
  database('projects').insert(project, '*')
    .then(projectIds => {
      // request fulfilled and resulted in new resource creation
      return response.status(201).json({ id: projectIds[0], name: project.title});
    })
    .catch(error => {
      // server is not functioning, internal server error
      return response.status(500).json({error});
    });
});

// adds a palette to a project
app.post('/api/v1/projects/:id/palettes', (request, response) => {
  let palette = request.body;
  const { id } = request.params;
   //requires parameters or respond with 422 error
  for ( let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!palette[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }
  // adds projectId (foreign key) to palette object and making a new copy
  palette = Object.assign({}, palette, { projectId: id });

  database('palettes').insert(palette, '*')
    .then(paletteId => {
      // request fulfilled and resulted in new resource creation
      return response.status(201).json({ id: paletteId[0]});
    })
    .catch(error => {
      // server is not functioning, internal server error
      return response.status(500).json({error});
    });
});

// destroys a palette from a project based off of id
app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).del()
  .then(length => {
    // 204 server successfully fulfilled  request no additional content avail to send response payload body
    length ? response.sendStatus(204) : response.status(422)
      .send({ error: 'nothing to delete with that id' });
    })
    .catch(error => {
      // server is not functioning, internal server error
      response.status(500).json({ error });
    });
});

// destroys a project based off of id
app.delete('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;

  database('projects').where('id', id).delete()
  // server successfully fulfilled  request no additional content avail to send response payload body
    .then(response => response.status(204).json({ id }))
    .catch(error => {
      // server is not functioning, internal server error
      response.status(500).json({error});
    });
});

//logs in the terminal the port where app is listening in browser localhost
app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}.`);
});

module.exports = app;
