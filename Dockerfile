FROM node:13.12.0-alpine AS build
WORKDIR /srv
ADD package.json .
RUN npm install
ADD . .

FROM node:13.12.0-alpine
COPY --from=build /srv .
EXPOSE 3000
CMD ["node", "index.js"]