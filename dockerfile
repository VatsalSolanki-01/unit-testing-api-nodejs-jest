FROM node:18.19.1

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV MONGO_URL=mongodb://mongo:27017/JestDB
EXPOSE 5000

CMD ["npm", "start"]
