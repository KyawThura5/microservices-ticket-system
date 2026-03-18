# Microservices Architecture

This repository contains a **microservices architecture** with the following components:

- **Service Discovery:** `eureka-server` registers and monitors microservices.
- **API Gateway:** Routes external requests to microservices.
- **Message Broker:** Kafka (`kafka-broker`) for event-driven communication.
- **Databases:** Each microservice has its dedicated MySQL database.
- **Microservices:** Customer, Venue, Event, and Order services.

---

## Architecture Diagram

```mermaid
graph LR
  subgraph Service_Discovery
    EUREKA[eureka-server:8761]
  end

  subgraph API_Gateway
    APIGW[api-gateway:8030]
  end

  subgraph Kafka_Broker
    KAFKA[kafka-broker:9092/9094]
    KAFKAUI[kafka-ui:8090]
  end

  subgraph Databases
    CDB[customer-db:3307]
    VDB[venue-db:3308]
    EDB[event-db:3309]
    ODB[order-db:3310]
  end

  subgraph Microservices
    CUSTOMER[customer-service]
    VENUE[venue-service]
    EVENT[event-service]
    ORDER[order-service]
  end

  %% Connections
  APIGW --> EUREKA
  CUSTOMER --> EUREKA
  VENUE --> EUREKA
  EVENT --> EUREKA
  ORDER --> EUREKA

  CUSTOMER --> CDB
  VENUE --> VDB
  EVENT --> EDB
  ORDER --> ODB

  EVENT --> KAFKA
  ORDER --> KAFKA
  KAFKAUI --> KAFKA
