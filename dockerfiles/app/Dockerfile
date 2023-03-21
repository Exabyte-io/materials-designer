ARG BASE_IMAGE=ghcr.io/exabyte-io/centos-7.9-base
ARG IMAGE_TAG=latest
FROM ${BASE_IMAGE}:${IMAGE_TAG}

WORKDIR /opt/app

COPY . .

RUN source scl_source enable devtoolset-8 && \
    npm install

EXPOSE 3001

ENTRYPOINT ["/opt/app/entrypoint.sh"]

