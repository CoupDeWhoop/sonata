DROP DATABASE IF EXISTS sonata;
DROP DATABASE IF EXISTS test_sonata;

CREATE DATABASE sonata;
CREATE DATABASE test_sonata;

\c sonata; 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\c test_sonata; 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";