FROM node:18.19.1
FROM mongo:7.0.25

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
 
