# Builds centos-7.9-node-14.11.4
ARG BASE_TAG=latest
FROM centos:7

# Setup
ENV HOME="/root"
ENV BASE_DIR="/opt/test"
# This is obviously insecure, to be used only for local setup, not production
ENV NODE_VERSION="14.19.3"
ENV NPM_VERSION="6.14.17"

RUN yum install -y \
    git \
    wget \
    bzip2 \
    yum install gcc-c++ \
    java-1.8.0-openjdk-headless
# Node dependencies
RUN yum install -y scl-utils scl-utils-build centos-release-scl
RUN yum update scl-utils
RUN yum install -y devtoolset-8

# NVM installation
ENV NVM_DIR="$HOME/.nvm"
RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default \
    && npm install -g npm@$NPM_VERSION
ENV NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

ENTRYPOINT ["npm start"]
