/* Cleanup tables*/
DROP TABLE profile_upgrade;
DROP TABLE upgrade;
DROP TABLE profile;

/* Create tables*/
CREATE TABLE profile (
  id           VARCHAR(255) PRIMARY KEY,
  username     VARCHAR(255) NOT NULL UNIQUE,
  email        VARCHAR(255) NOT NULL UNIQUE,
  passwordHash VARCHAR(255) NOT NULL
  gems         INT          NOT NULL DEFAULT 0
);

CREATE TABLE upgrade (
  id   VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  cose INT          NOT NULL
);

CREATE TABLE profile_upgrade (
  profile_id VARCHAR(255) NOT NULL REFERENCES profile(id),
  upgrade_id VARCHAR(255) NOT NULL REFERENCES upgrade(id)
);

/* Create Data (when needed) */

