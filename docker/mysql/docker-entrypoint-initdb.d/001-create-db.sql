
CREATE USER IF NOT EXISTS 'canvasapp'@'localhost' IDENTIFIED BY 'GoMamdani2026!';
CREATE DATABASE IF NOT EXISTS canvas_app;
GRANT ALL on canvas_app.* TO 'canvasapp'@'localhost';
USE canvas_app;

CREATE TABLE IF NOT EXISTS canvasser
(
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(128) NULL,
    mobile VARCHAR(32) NULL,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_canvasser_name (name),
    PRIMARY KEY (id)
) ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS canvassee
(
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(128) NULL,
    mobile VARCHAR(32) NULL,
    sms_ok TINYINT NOT NULL DEFAULT 0,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_canvassee_name (name),
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


INSERT INTO canvasser (name) VALUES ("Sam");
SET @sam_pkid = LAST_INSERT_ID();
INSERT INTO canvasser (name) VALUES ("Daryl");
SET @daryl_pkid = LAST_INSERT_ID();
INSERT INTO canvasser (name) VALUES ("Lauren");
SET @lauren_pkid = LAST_INSERT_ID();
INSERT INTO canvassee (name) VALUES ("Kenneth");
SET @kenneth_pkid = LAST_INSERT_ID();

INSERT INTO canvas_activity (canvasser_id, canvassee_id, notes) VALUES (
    @sam_pkid,
    @kenneth_pkid,
    "Spoke to Kenneth about the NYC Mayoral election 2025; very excited about Mamdani"
);

INSERT INTO canvas_activity (canvasser_id, canvassee_id, notes) VALUES (
    @daryl_pkid,
    @kenneth_pkid,
    "Spoke to Kenneth about aspirations as an individual contributor"
);

INSERT INTO canvas_activity (canvasser_id, canvassee_id, notes) VALUES (
    @lauren_pkid,
    @kenneth_pkid,
    "Spoke to Kenneth about translating between product/tech requirements"
);


