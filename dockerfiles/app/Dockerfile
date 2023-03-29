ARG BASE_IMAGE=node
ARG IMAGE_TAG=14-alpine
FROM ${BASE_IMAGE}:${IMAGE_TAG}

WORKDIR /opt/app

COPY . .

RUN npm install

EXPOSE 3001

ENTRYPOINT ["npm start"]

