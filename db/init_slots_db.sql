CREATE DATABASE IF NOT EXISTS slots;

 CREATE USER 'lambda-user' IDENTIFIED WITH AWSAuthenticationPlugin AS 'RDS';

GRANT SELECT ON slots.* TO 'lambda-user'@'%';
GRANT INSERT ON slots.* TO 'lambda-user'@'%';
GRANT UPDATE ON slots.* TO 'lambda-user'@'%';

USE slots;

CREATE TABLE IF NOT EXISTS service_type(
  service_type_id VARCHAR(50) NOT NULL PRIMARY KEY,
  display_name VARCHAR(50) NOT NULL
);

INSERT INTO service_type (service_type_id, display_name)
VALUES
  ('22065eff-4c05-4ca1-8500-afa79c7c4bfa', 'Standard'),
  ('e4cbcf1f-a9f7-ec11-82e6-0022484289f6', 'Lorry Standard'),
  ('00bdc279-2cf2-ec11-bb3c-0022484289f6', 'Extended'),
  ('39ca001c-2ef2-ec11-bb3c-0022484289f6', 'Extra Time'),
  ('32c698e6-31f2-ec11-bb3c-0022484289f6', 'Extended Extra Time');

CREATE TABLE IF NOT EXISTS product(
  product_id VARCHAR(50) NOT NULL PRIMARY KEY,
  display_name VARCHAR(50) NOT NULL
);

INSERT INTO product(product_id, display_name)
VALUES
  ('23b71cbd-bcec-ec11-bb3c-6045bd1138c0', 'Car'),
  ('a586aedb-a9f7-ec11-82e6-0022484289f6', 'Lorry');

CREATE TABLE IF NOT EXISTS service(
  service_id VARCHAR(50) NOT NULL PRIMARY KEY,
  display_name VARCHAR(150) NOT NULL,
  service_type_id VARCHAR(50) NOT NULL,
  duration INT NOT NULL,
  price INT NOT NULL
);

INSERT INTO service(service_id, display_name, service_type_id, duration, price)
VALUES
  ('f1cc36f1-b3f7-ec11-82e6-002248428f64', 'Standard Car (premium)', '22065eff-4c05-4ca1-8500-afa79c7c4bfa', 57, 75),
  ('45e49ccb-b3f7-ec11-82e6-002248428f64', 'Standard Car (standard)', '22065eff-4c05-4ca1-8500-afa79c7c4bfa', 57, 47),
  ('ac293884-b9f7-ec11-82e6-002248428f64', 'Extended Car Test (premium)', '00bdc279-2cf2-ec11-bb3c-0022484289f6', 114, 150),
  ('726df864-b9f7-ec11-82e6-002248428f64', 'Extended Card Test (standard)', '00bdc279-2cf2-ec11-bb3c-0022484289f6', 114, 124),
  ('45b6d2c8-b7f7-ec11-82e6-002248428f64', 'Special Accommodations Extended Car Test (premium)', '00bdc279-2cf2-ec11-bb3c-0022484289f6', 114, 150),
  ('1b892c1b-b4f7-ec11-82e6-002248428f64', 'Special Accommodations Extended Car Test (standard)', '00bdc279-2cf2-ec11-bb3c-0022484289f6', 114, 124),
  ('a14b5d9e-b3f7-ec11-82e6-002248428f64', 'Special Accommodations Extra Time Car Test (premium)', '39ca001c-2ef2-ec11-bb3c-0022484289f6', 86, 75),
  ('7fefaa95-b0f7-ec11-82e6-002248428f64', 'Special Accommodations Extra Time Car Test (standard)', '39ca001c-2ef2-ec11-bb3c-0022484289f6', 86, 47),
  ('0a600347-b9f7-ec11-82e6-002248428f64', 'Special Accommodations Extra Time Extended Car Test (premium)', '32c698e6-31f2-ec11-bb3c-0022484289f6', 114, 150),
  ('733ce4db-b8f7-ec11-82e6-002248428f64', 'Special Accommodations Extra Time Extended Car Test (standard)', '32c698e6-31f2-ec11-bb3c-0022484289f6', 114, 124),
  ('fe258bf6-a8f7-ec11-82e6-0022484289f6', 'Special Accommodations Car Test (premium)', '22065eff-4c05-4ca1-8500-afa79c7c4bfa', 57, 75),
  ('fbadfb35-c2ec-ec11-bb3c-6045bd113d55', 'Special Accommodations Car Test (standard)', '22065eff-4c05-4ca1-8500-afa79c7c4bfa', 57, 47),
  ('f57d856c-67f8-ec11-82e6-0022484289f6', 'Large Goods Test (premium)', 'e4cbcf1f-a9f7-ec11-82e6-0022484289f6', 83, 141),
  ('e4cbcf1f-a9f7-ec11-82e6-0022484289f6', 'Large Goods Test (standard)', 'e4cbcf1f-a9f7-ec11-82e6-0022484289f6', 83, 141),
  ('8261b427-67f8-ec11-82e6-0022484289f6', 'Special Accommodations Large Goods Test (premium)', 'e4cbcf1f-a9f7-ec11-82e6-0022484289f6', 83, 141),
  ('9b14a015-66f8-ec11-82e6-0022484289f6', 'Special Accommodations Large Goods Test (standard)', 'e4cbcf1f-a9f7-ec11-82e6-0022484289f6', 83, 141);


CREATE TABLE IF NOT EXISTS test_centre(
  test_centre_id VARCHAR(50) NOT NULL PRIMARY KEY,
  display_name VARCHAR(500) NOT NULL,
  special_accommodation_slots_per_day TINYINT NOT NULL,
  extended_tests_slots_per_day TINYINT NOT NULL
);

INSERT INTO test_centre (test_centre_id, display_name, special_accommodation_slots_per_day, extended_tests_slots_per_day)
VALUES
  ('0d439f3a-acf7-ec11-82e6-0022484289f6', 'Barking', 5, 5),
  ('af8b374e-ebf6-ec11-82e6-002248428f64', 'Goodmayes', 5, 5),
  ('dfa600c9-b8ec-ec11-bb3c-6045bd1138c0', 'Hornchurch', 5, 5);

CREATE TABLE IF NOT EXISTS slot_status(
  status_id INT NOT NULL PRIMARY KEY,
  display_name VARCHAR(50) NOT NULL
);

INSERT INTO slot_status(status_id, display_name)
VALUES
  (1, 'Open'),
  (480600000, 'Booked'),
  (480600003, 'Booked (Provisional)'),
  (480600004, 'Cancelled');

CREATE TABLE IF NOT EXISTS slot(
  slot_id VARCHAR(500) NOT NULL PRIMARY KEY,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  service_id VARCHAR(50) NOT NULL,
  test_type_id VARCHAR(50) NOT NULL,
  service_type_id VARCHAR(50) NOT NULL,
  test_centre_id VARCHAR(50) NOT NULL,
  price VARCHAR(10) NOT NULL,
  extendable BOOLEAN NOT NULL,
  premium BOOLEAN NOT NULL,
  slot_status_id INT NOT NULL
  FOREIGN KEY (test_type_id) REFERENCES product(product_id),
  FOREIGN KEY (service_id) REFERENCES service(service_id),
  FOREIGN KEY (service_type_id) REFERENCES service_type(service_type_id),
  FOREIGN KEY (test_centre_id) REFERENCES test_centre(test_centre_id),
  FOREIGN KEY (slot_status_id) REFERENCES slot_status(status_id)
);

CREATE TABLE IF NOT EXISTS booking(
  slot_id VARCHAR(500) NOT NULL PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  service_type_id VARCHAR(50) NOT NULL,
  test_centre_id VARCHAR(50) NOT NULL,
  FOREIGN KEY (product_id) REFERENCES product(product_id),
  FOREIGN KEY (service_type_id) REFERENCES service_type(service_type_id),
  FOREIGN KEY (test_centre_id) REFERENCES test_centre(test_centre_id)
);


ALTER TABLE slot
ADD service_id VARCHAR(50);

ALTER TABLE slot
ADD FOREIGN KEY (service_id) REFERENCES service(service_id);

UPDATE slot set service_id = 'e4cbcf1f-a9f7-ec11-82e6-0022484289f6' where test_type_id = 'a586aedb-a9f7-ec11-82e6-0022484289f6';

