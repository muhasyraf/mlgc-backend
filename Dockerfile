FROM node:20-slim

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
