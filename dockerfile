FROM node:12-alpine
COPY . /usr/app 
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]