ARG BASE_IMAGE=node
ARG IMAGE_TAG=14-alpine
FROM ${BASE_IMAGE}:${IMAGE_TAG}

WORKDIR /opt/app

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json package.json

RUN npm install

COPY . .

EXPOSE 3001

ENTRYPOINT ["npm", "start"]
