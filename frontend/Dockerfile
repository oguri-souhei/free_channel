# ビルド環境
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
# 環境変数にしたい。。。
ENV VUE_APP_API_URL=http://localhost:3000
RUN npm install
COPY . .
RUN npm run build

# 本番環境
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]