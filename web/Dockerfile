FROM node:24-alpine AS build
WORKDIR /src
COPY package.json pnpm-lock.yaml .npmrc ./
RUN npm install --global pnpm@10.33.0 && pnpm install --frozen-lockfile
COPY . ./
RUN pnpm run build

FROM nginx:1.31.8-alpine@sha256:fed7e14be83cbd2661a75cdc5b872d936cf155d46c327084d30b8df19ae88d72
COPY --from=build /src/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
