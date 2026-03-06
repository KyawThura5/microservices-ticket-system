FROM eclipse-temurin:17-jre
WORKDIR /app
# Make sure your JAR name matches what's in your target folder
COPY target/*.jar app.jar
EXPOSE 8030
#ENTRYPOINT ["java", "-jar", "app.jar","--spring.profiles.active=${SPRING_PROFILES_ACTIVE:-default}"]
ENTRYPOINT ["sh", "-c", "java -jar app.jar --spring.profiles.active=${SPRING_PROFILES_ACTIVE:-default}"]