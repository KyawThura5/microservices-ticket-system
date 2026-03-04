# Use an OpenJDK image for Java 17 (standard for Spring Boot 3)
FROM eclipse-temurin:17-jre

# Set the working directory inside the container
WORKDIR /app

# Copy the compiled JAR file from your target folder to the container
# We assume the JAR is named eureka-server-0.0.1-SNAPSHOT.jar 
# (Check your target folder to be sure!)
COPY target/*.jar app.jar

# Expose the Eureka default port
EXPOSE 8761

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]