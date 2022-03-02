ARG BASE_IMAGE
ARG IMAGE_TAG=latest
FROM ${BASE_IMAGE}:${IMAGE_TAG}

ENV NODE_VERSION $TEST_NODE_VERSION
ENV NPM_VERSION  $TEST_NPM_VERSION

ARG NVM=${NVM_DIR}/nvm.sh
RUN . $NVM && \
    nvm use v$NODE_VERSION && \
    npm install -g npm@$NPM_VERSION
ENV NODE_PATH    $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH         $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

WORKDIR /opt/test
RUN git init
COPY . .

WORKDIR /opt/test/tests
RUN source scl_source enable devtoolset-8 && npm install


# This is an interesting hack. There is a bug in the function
# to getLinuxChromeDriverArchitecture causing a comparison between
# a number and a string when two strings are expected.
RUN sed -i "s/if(compareVersions(version,/if(compareVersions(String(version),/" \
    tests/node_modules/selenium-standalone/lib/compute-download-urls.js


# Entrypoint was previously defined in /opt/app so overwrite
# it for easiest test container development and just pass along a flag
# to kick off the tests instead of running the application
WORKDIR /opt/test
ENV BASE_DIR /opt/test
ENTRYPOINT ["/opt/test/entrypoint.sh", "test"]

