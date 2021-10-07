FROM node:14

WORKDIR /usr/share/app

COPY package*.json backend.js ./
RUN npm install
EXPOSE 80

CMD ["node", "backend.js"]
