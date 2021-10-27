FROM node:12.18.3-alpine as build-stage
WORKDIR /app
COPY package*.json ./
ENV VUE_APP_API_HOST=https://api.freechannel.link
ENV NODE_ENV=production
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

RUN rm -f /etc/nginx/conf.d/*
ADD nginx.conf /etc/nginx/conf.d/app.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]