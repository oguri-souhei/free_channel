FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
ENV NODE_ENV=production
ENV VUE_APP_API_HOST=http://api.freechannel.link
RUN npm install
RUN npm install @vue/cli
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]