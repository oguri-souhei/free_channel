FROM node:12.18.3-alpine as build-stage
WORKDIR /app
COPY package*.json ./
ENV VUE_APP_API_HOST=http://api.freechannel.link
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]