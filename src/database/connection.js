const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'pokedex',
    password: 'postgres',
    port: 5432
});

const query = (text, param) => {
    return pool.query(text, param);
};

module.exports = { query };