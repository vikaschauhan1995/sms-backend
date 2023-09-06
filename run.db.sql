-- you must be inside any database of postgresql
-- run this file using "\i run.db.sql" command

-- Create a new database
CREATE DATABASE sms_dev;

-- Connect to the new database
\c sms_dev;

-- Create new tables
CREATE TABLE school (
  id serial NOT NULL,
  school_id VARCHAR (255) UNIQUE NOT NULL,
  school_name VARCHAR (255) NOT NULL,
  mobile_number BIGINT NOT NULL,
  address1 VARCHAR (255) NOT NULL,
  address2 VARCHAR (255) NOT NULL,
  state VARCHAR (55) NOT NULL,
  pincode INT NOT NULL,
  country VARCHAR (55) NOT NULL,
  expiration_date DATE,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id serial PRIMARY KEY,
	user_id VARCHAR ( 255 ) UNIQUE NOT NULL,
  school_id VARCHAR ( 255 ) NOT NULL,
	email VARCHAR ( 255 ) NOT NULL,
	username VARCHAR ( 255 ) NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
  user_type VARCHAR (25 ) NOT NULL,
  is_active BOOLEAN NOT NULL,
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE teacher(
  id serial PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  school_id VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  class VARCHAR(25) NOT NULL,
  section VARCHAR(25) NOT NULL,
  gender VARCHAR(25) NOT NULL,
  dob DATE NOT NULL,
  id_number INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  religion VARCHAR(25) NOT NULL,
  email VARCHAR(255) NOT NULL,
  username VARCHAR (255) NOT NULL,
  password VARCHAR (255) NOT NULL,
  mobile_number BIGINT NOT NULL,
  address VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);


-- Commit the transaction
COMMIT;