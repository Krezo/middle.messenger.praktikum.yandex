FROM node:18-alpine
WORKDIR /var/www
COPY . .
RUN npm i
EXPOSE 3000
CMD npm run start
