# build stage
FROM node:16.14.2-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g npm@8.5.5
COPY ./ .

# Build ứng dụng Vue.js
RUN npm run build
# production stage
FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

