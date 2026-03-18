# Microservices Architecture

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