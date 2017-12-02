/*eslint-disable */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then( projects => {
      return response.status(200).json(projects);
    })
    .catch( error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palette', (request, response) => {
  const projectId = request.params.id;

  database('palettes').where('projectId', projectId).select()
    .then(palette => {
      if (palette.length) {
        return response.status(200).json(palette);
      } else {
        return response.status(404).json({
          error: `Palette with id: ${projectId} not found`
        });
      }
    })
    .catch( error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).select()
    .then(palette => {
      if (palette.length) {
        return response.status(200).json(palette);
      } else {
        return response.status(404).json({
          error: `Could not find palette with id: ${id}`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/projects', (request, response) => {

  database('projects').select()
    .then( project => {
      if (project.length) {
        return response.status(200).json(project);
      } else {
        return response.status(404).json({
          error: `Could not find projects`
        });
      }
    })
    .catch( error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;

  database('projects').where("id", id).select()
    .then(project => {
      if (project) {
        return response.status(200).json(project);
      } else {
        return response.status(404).json({
          error: `Could not find palette with id: ${id}`
        });
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params;

  database('palettes').where('projectId', id).select()
    .then( palettes => {
      if (palettes.length) {
        return response.status(201).json(palettes);
      } else {
        return response.status(200).json([]);
      }
    })
    .catch(error => {
      return response.status(500).json({error});
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['title']) {
    if (!project[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }

  database('projects').insert(project, '*')
    .then(insertedProject => {
      return response.status(201).json(insertedProject);
    })
    .catch(error => {
      return response.status(500).json({error});
    });
});

app.post('/api/v1/projects/:id/palettes', (request, response) => {
  let palette = request.body;
  const { id } = request.params;

  for ( let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5']) {
    if (!palette[requiredParameter]) {
      console.log(response);
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property`
      });
    }
  }

  palette = Object.assign({}, palette, { projectId: id });

  database('palettes').insert(palette, '*')
    .then(paletteId => {
      return response.status(201).json({ id: paletteId[0]});
    })
    .catch(error => {
      return response.status(500).json({error});
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where('id', id).del()
  .then(length => {
    console.log(length);
    length ? response.sendStatus(204) : response.status(422)
      .send({ error: 'nothing to delete with that id' });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/projects/:id', (request, response) => {
  const { id } = request.params;

  database('projects').where('id', id).delete()
    .then(response => response.status(204).json({ id }))
    .catch(error => {
      response.status(500).json({error});
    });
});

app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}.`);
});

module.exports = app;
