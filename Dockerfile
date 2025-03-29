FROM denoland/deno:alpine

# Install curl for container healthcheck
RUN apk --no-cache add curl

# Restrict permissions to non-root user
USER deno

WORKDIR /app

COPY deno.json .
RUN deno install

COPY . .
RUN deno cache app.ts

CMD ["run", "-EN", "app.ts"]
