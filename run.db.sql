-- you must be inside any database of postgresql
-- run this file using "\i run.db.sql" command

-- Create a new database
CREATE DATABASE sms_dev;

-- Connect to the new database
\c sms_dev;

-- Create a new table
CREATE TABLE users (
    id serial PRIMARY KEY,
	user_id VARCHAR ( 255 ) UNIQUE NOT NULL,
	username VARCHAR ( 255 ) UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP 
);

-- Commit the transaction
COMMIT;