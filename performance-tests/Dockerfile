FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -g esbuild

COPY . .

RUN esbuild /app/load-test.ts --bundle --outfile=/app/load-test.js --format=esm --external:k6 --external:k6/*

FROM grafana/k6:latest

WORKDIR /k6

COPY --from=build /app/load-test.js .

CMD ["k6", "run", "load-test.js" "test.js"]
