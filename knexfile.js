// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgress://localhost/palette_picker',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  }

};
