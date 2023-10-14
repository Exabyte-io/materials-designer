ARG BASE_TAG=latest
FROM materials-designer:${BASE_TAG}

# Assumes same dependencies as base materials-designer container
RUN yum install -y \
    git \
    java-1.8.0-openjdk-headless \
    bzip2

# Install a chrome binary
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm \
    && yum localinstall -y google-chrome-stable_current_x86_64.rpm

# Tests run on an older version of node currently
ENV NODE_VERSION 14.19.3
ENV NPM_VERSION 6.14.18
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm use $NODE_VERSION \
    && npm install -g npm@$NPM_VERSION
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Use a separate workdir to enable usage of git config.
# By default npm uses ssh to clone commit-ish pinned dependencies
# but we don't want to set up SSH and introduce security holes for tests.
WORKDIR /opt/test
RUN git init
COPY . .
RUN git config --global url."https://github.com".insteadOf git@github.com:
RUN git config --global url."https://".insteadOf git://
# Enabling devtoolset puts compilers like g++
# in the PATH so that node-gyp can build native
# compiled node modules as part of the install
RUN cd tests \
    && source scl_source enable devtoolset-8 \
    && npm install

# This is an interesting hack. There is a bug in the function
# to getLinuxChromeDriverArchitecture causing a comparison between
# a number and a string when two strings are expected.
RUN sed -i "s/if(compareVersions(version,/if(compareVersions(String(version),/" \
    tests/node_modules/selenium-standalone/lib/compute-download-urls.js

# Entrypoint was previously defined in /opt/app so overwrite
# it for easiest test container development and just pass along a flag
# to kick off the tests instead of running the application
ENV BASE_DIR=/opt/test
COPY entrypoint.sh /opt/app
CMD ["test"]
