CREATE TABLE venue (
    id BIGINT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255),
    address VARCHAR(255),
    total_capacity BIGINT,
    CONSTRAINT pk_venue PRIMARY KEY (id)
);