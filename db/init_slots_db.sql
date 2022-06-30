CREATE DATABASE IF NOT EXISTS slots;

CREATE USER IF NOT EXISTS 'slots-write'@'%' IDENTIFIED BY 'PqFglG46E0Dc';

USE slots;

CREATE TABLE IF NOT EXISTS service_type(
  service_type_id TINYINT NOT NULL PRIMARY KEY,
  display_name VARCHAR(50) NOT NULL
);

INSERT INTO service_type (service_type_id, display_name)
VALUES
  (1, 'Standard'),
  (2, 'Extended'),
  (3, 'Extra Time');

CREATE TABLE IF NOT EXISTS slot(
  slot_id VARCHAR(500) NOT NULL PRIMARY KEY,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  service VARCHAR(500) NOT NULL,
  service_type_id TINYINT NOT NULL REFERENCES service_type(service_type_id),
  test_centre VARCHAR(100) NOT NULL,
  price VARCHAR(10) NOT NULL,
  available BOOLEAN NOT NULL,
  FOREIGN KEY (service_type_id) REFERENCES service_type(service_type_id)
);

GRANT SELECT ON slots.* TO 'slots-write'@'%';
GRANT INSERT ON slots.* TO 'slots-write'@'%';
GRANT UPDATE ON slots.* TO 'slots-write'@'%';

