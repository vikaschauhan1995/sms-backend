-- you must be inside any database of postgresql
-- run this file using "\i run.db.sql" command

-- Create a new database
CREATE DATABASE sms-dev;

-- Connect to the new database
\c sms-dev;

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
	username VARCHAR ( 255 ) UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
  user_type VARCHAR (25 ) NOT NULL,
  is_active BOOLEAN NOT NULL,
	created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE teacher(
  id serial PRIMARY KEY,
  teacher_id VARCHAR(255) UNIQUE NOT NULL,
  school_id VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  gender VARCHAR(25) NOT NULL,
  dob DATE NOT NULL,
  email VARCHAR(255) NOT NULL,
  username VARCHAR (255) UNIQUE,
  mobile_number BIGINT NOT NULL,
  address VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE verification(
  id serial PRIMARY KEY,
  unique_id VARCHAR(255) NOT NULL,
  purpose VARCHAR(255) NOT NULL,
  otp INT NOT NULL
);

CREATE TABLE student(
  id serial PRIMARY KEY,
  student_id VARCHAR(255) UNIQUE NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  school_id VARCHAR(255) NOT NULL,
  username VARCHAR (255) UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  class_id integer NOT NULL,
  dob DATE NOT NULL,
  gender VARCHAR(25) NOT NULL,
  roll_number INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile_number BIGINT NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
  -- id serial PRIMARY KEY,
  -- user_id VARCHAR(255) UNIQUE NOT NULL,
  -- school_id VARCHAR(255) NOT NULL,
  -- first_name VARCHAR(255) NOT NULL,
  -- last_name VARCHAR(255) NOT NULL,
  -- class_ INT NOT NULL,
  -- section VARCHAR(25) NOT NULL,
  -- gender VARCHAR(25) NOT NULL,
  -- dob DATE NOT NULL,
  -- roll_number INT NOT NULL,
  -- admission_number INT,
  -- religion VARCHAR(25) NOT NULL,
  -- email VARCHAR(255) NOT NULL,
  -- username VARCHAR (255) UNIQUE NOT NULL,

  -- father_name VARCHAR(255) NOT NULL,
  -- mother_name VARCHAR(255) NOT NULL,
  -- father_occupation VARCHAR(255),
  -- mother_occupation VARCHAR(255),
  -- mobile_number BIGINT NOT NULL,
  -- nationality VARCHAR(255) NOT NULL,
  -- present_address VARCHAR(255) NOT NULL,
  -- permanent_address VARCHAR(255) NOT NULL,
  -- is_active BOOLEAN NOT NULL,
  -- created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- last_login TIMESTAMP

CREATE TABLE teacher_attendance(
  id serial PRIMARY KEY,
  teacher_id VARCHAR(255) NOT NULL,
  school_id VARCHAR(255) NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  is_present BOOLEAN NOT NULL,
  comment VARCHAR(255) NOT NULL,
  created_date DATE DEFAULT CURRENT_DATE,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE classes(
  id serial PRIMARY KEY,
  school_id VARCHAR(255) NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  class_name VARCHAR(55) NOT NULL,
  section VARCHAR(55) NOT NULL,
  fee INT NOT NULL DEFAULT 0,
  created_year INT NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session_year(
  id serial PRIMARY KEY,
  year INT UNIQUE NOT NULL,
  session_name VARCHAR(25) NOT NULL
);

CREATE TABLE admin(
  id serial PRIMARY KEY,
  admin_id VARCHAR(255) UNIQUE NOT NULL,
  school_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  username VARCHAR (255) UNIQUE,
  mobile_number BIGINT NOT NULL,
  address VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE student_attendance(
  id serial PRIMARY KEY,
  student_id VARCHAR(255) NOT NULL,
  class_id INT NOT NULL,
  school_id VARCHAR(255) NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  is_present BOOLEAN NOT NULL,
  comment VARCHAR(255) NOT NULL,
  created_date DATE DEFAULT CURRENT_DATE,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE homework_assignment (
    id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(255) NOT NULL REFERENCES teacher(teacher_id),
    school_id VARCHAR(255) NOT NULL,
    class_id int NOT NULL REFERENCES classes(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by VARCHAR(255) NOT NULL,
    created_date DATE DEFAULT CURRENT_DATE,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO session_year (year, session_name) VALUES (2023, '2023-2024');
INSERT INTO session_year (year, session_name) VALUES (2024, '2024-2025');
INSERT INTO session_year (year, session_name) VALUES (2025, '2025-2026');
-- INSERT INTO users (user_id, school_id, email, username, password, user_type, is_active) VALUES ('123456789', '', 'email@gmail.com', 'root', 'bcryptPassword', 'root', true);

-- Commit the transaction
COMMIT;