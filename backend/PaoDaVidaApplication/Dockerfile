# syntax=docker/dockerfile:1

# ============================================================
# ESTÁGIO 1 (build): compila o JAR com Maven + JDK 21
# ============================================================
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Só o pom.xml primeiro → baixa as dependências em camada separada
# (cache válido enquanto o pom.xml não mudar)
COPY pom.xml .
RUN mvn -B -q dependency:go-offline -DskipTests || true

# Compila o código (testos pulados; rodam no CI/local com `mvn test`)
COPY src ./src
RUN mvn -B -q -DskipTests package

# ============================================================
# ESTÁGIO 2 (runner): JRE + o JAR executável
# ============================================================
FROM eclipse-temurin:21-jre-jammy

# curl é usado pelo healthcheck do docker-compose
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
