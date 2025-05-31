const { Client, Pool } = require('pg');

// const db = new Client({
//   user: process.env.POSTGRES_USERNAME,
//   host: process.env.POSTGRES_HOST,
//   database: process.env.POSTGRES_DATABASE, // 
//   password: process.env.POSTGRES_PASSWORD, // 
//   port: process.env.POSTGRES_PORT
// });

// module.exports = db;

const connectionString = process.env.NEON_POSTGRES_HOST;

const db = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: true // Required for Neon.tech
  }
});

// Optional: Add logging for pool events for better debugging (as suggested previously)
// db.on('error', (err, client) => {
//   console.error('Unexpected error on idle client', err);
// });

module.exports = db;
