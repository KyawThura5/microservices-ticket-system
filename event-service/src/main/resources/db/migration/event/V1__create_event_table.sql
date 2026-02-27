CREATE TABLE event (
    id BIGINT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    venue_id BIGINT NOT NULL,
    total_capacity BIGINT NOT NULL,
    left_capacity BIGINT NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    CONSTRAINT pk_event PRIMARY KEY (id)
);