const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ecommerce',
  password: 'postgres', // coloque sua senha aqui
  port: 5432,
});

module.exports = pool;