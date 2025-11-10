
CREATE USER IF NOT EXISTS 'sequelize_auto'@'%'
    IDENTIFIED WITH caching_sha2_password BY 'sequelize_auto';
CREATE DATABASE IF NOT EXISTS sequelize_auto_test;
GRANT ALL on sequelize_auto_test.* TO 'sequelize_auto'@'%';

-- allow connect from localhost & docker network 'canvasapp'@'172.22.0.1'
CREATE USER IF NOT EXISTS 'canvasapp'@'%'
    IDENTIFIED WITH caching_sha2_password BY 'GoMamdani2026!';
CREATE DATABASE IF NOT EXISTS canvas_app;
-- TODO: tighten permissions for 'canvasapp' user
--   ... want second 'canvasadmin' user for Vite admin app, if following up?
GRANT ALL on canvas_app.* TO 'canvasapp'@'%';
USE canvas_app;

CREATE TABLE IF NOT EXISTS canvasser
(
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(128) NOT NULL,
    mobile VARCHAR(32) NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_canvasser_name (name),
    UNIQUE INDEX idx_canvasser_email (email),
    PRIMARY KEY (id)
) ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS canvassee
(
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(128) NULL,
    mobile VARCHAR(32) NULL,
    sms_ok TINYINT NOT NULL DEFAULT 0,
    street_address VARCHAR(256) NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_canvassee_name (name),
    -- defined to be loose in what is required from canvassees,
    -- there will be ux workflow issues needing resolution/merging
    -- not sure if looser (non-UNIQUE) is a better fit for app
    -- (in case of shared email/mobile among family members, etc)
    UNIQUE INDEX idx_canvassee_email (email),
    UNIQUE INDEX idx_canvassee_mobile (mobile),
    PRIMARY KEY (id)
) ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS canvas_activity
(
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    canvasser_id MEDIUMINT NOT NULL,
    canvassee_id MEDIUMINT NOT NULL,
    notes TEXT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (canvasser_id) REFERENCES canvasser(id),
    FOREIGN KEY (canvassee_id) REFERENCES canvassee(id),
    INDEX idx_canvas_activity_created (created),  -- for sorting
    FULLTEXT INDEX idx_canvas_activity_notes (notes),
    PRIMARY KEY (id)
) ENGINE=INNODB;


INSERT INTO canvasser (name, email, mobile)
    VALUES ("Sam", "sam@example.com", "415-555-4145");
SET @sam_pkid = LAST_INSERT_ID();
INSERT INTO canvasser (name, email, mobile)
    VALUES ("Daryl", "daryl@example.com", "202-555-2020");
SET @daryl_pkid = LAST_INSERT_ID();
INSERT INTO canvasser (name, email, mobile)
    VALUES ("Lauren", "lauren@example.com", "206-555-2020");
SET @lauren_pkid = LAST_INSERT_ID();
INSERT INTO canvassee (name, email, mobile)
    VALUES ("Kenneth", "kenneth@example.com", "212-555-1212");
SET @kenneth_pkid = LAST_INSERT_ID();

INSERT INTO canvas_activity (canvasser_id, canvassee_id, notes) VALUES (
    @sam_pkid,
    @kenneth_pkid,
    "Spoke to Kenneth about NYC Mayoral election 2025"
);

INSERT INTO canvas_activity (canvasser_id, canvassee_id, notes) VALUES (
    @daryl_pkid,
    @kenneth_pkid,
    "Spoke to Kenneth about aspirations as an individual contributor"
);

INSERT INTO canvas_activity (canvasser_id, canvassee_id, notes) VALUES (
    @lauren_pkid,
    @kenneth_pkid,
    "Spoke to Kenneth about navigating between product/tech requirements"
);


