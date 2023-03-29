ARG BASE_IMAGE=node
ARG IMAGE_TAG=14-alpine
FROM ${BASE_IMAGE}:${IMAGE_TAG}

WORKDIR /opt/app
# Per https://stackoverflow.com/questions/72695311/failure-starting-docker-container-failed-to-create-shim-task-oci-runtime-crea
RUN chown -R node /opt/app

COPY . .

RUN npm install

EXPOSE 3001

ENTRYPOINT ["npm start"]

