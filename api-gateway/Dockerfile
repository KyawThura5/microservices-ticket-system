FROM eclipse-temurin:17-jre
WORKDIR /app
# Make sure your JAR name matches what's in your target folder
COPY target/*.jar app.jar
EXPOSE 8030
ENTRYPOINT ["java", "-jar", "app.jar"]