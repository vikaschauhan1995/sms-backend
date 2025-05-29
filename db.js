const { Client } = require('pg');

// const db = new Client({
//   user: process.env.POSTGRES_USERNAME,
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DATABASE, // 
//   password: process.env.POSTGRES_PASSWORD, // 
//   port: process.env.POSTGRES_PORT
// });

// module.exports = db;

const connectionString = process.env.NEON_POSTGRES_HOST;

const db = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: true // Required for Neon.tech
  }
});

module.exports = db;
