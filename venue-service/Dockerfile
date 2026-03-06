FROM eclipse-temurin:17-jre
WORKDIR /app
COPY target/*.jar app.jar
# Standard Spring Boot port, but Docker will handle internal routing
EXPOSE 8082 
#ENTRYPOINT ["java", "-jar", "app.jar","--spring.profiles.active=${SPRING_PROFILES_ACTIVE:-default}"]
ENTRYPOINT ["sh", "-c", "java -jar app.jar --spring.profiles.active=${SPRING_PROFILES_ACTIVE:-default}"]