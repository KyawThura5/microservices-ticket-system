ALTER TABLE customer
ADD COLUMN keycloak_user_id VARCHAR(64) NULL,
ADD CONSTRAINT uk_customer_keycloak_user_id UNIQUE (keycloak_user_id);
