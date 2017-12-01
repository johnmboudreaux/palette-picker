/*eslint-disable */
exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then( () => knex('projects').del())
    .then( () => {
      return Promise.all([
        knex('projects').insert({
          id: 1,
          title: 'Star Wars'
        }, 'id')
          .then( project => {
            return knex('palettes').insert([
              {
                id: 1,
                name: 'palette1',
                color1: '#2ff923',
                color2: '#7bfe86',
                color3: '#551a8b',
                color4: '#2719c7',
                color5: '#ff9933',
                projectId: project[0]
              },
              {
                id: 2,
                name: 'palette2',
                color1: '#ae0000',
                color2: '#007ce6',
                color3: '#2de3a2',
                color4: '#b7a17c',
                color5: '#c0b49d',
                projectId: project[0]
              }
            ]);
          })
          .then( project => console.log('Seeding Complete'))
          .catch( error => console.log(`Error seeding data: ${ error }`))
      ]);//end of promise.all
    })
    .catch( error => console.log(`Error seeding data: ${ error }`));
};
