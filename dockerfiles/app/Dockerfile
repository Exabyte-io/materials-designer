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

# Not using [] below to avoid `executable file not found in $PATH: unknown.`
# per https://stackoverflow.com/questions/27158840/docker-executable-file-not-found-in-path
# and https://jhooq.com/docker-error-executable-file/
ENTRYPOINT npm start
