FROM centos:centos7.9.2009

# Install OS dependencies
RUN yum update -y && \
    yum install -y \
        libXext-devel \
        libXi-devel \
        mesa-libGL-devel \
        mesa-dri-drivers \
        xorg-x11-server-Xvfb \
        wget \
        which \
        make \
        scl-utils \
        centos-release-scl

# Broken into two steps so scl gpg key is available from above
RUN yum install -y \
        devtoolset-8-gcc \
        devtoolset-8-gcc-c++

# Install nvm with node and npm
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 12.21.0
RUN mkdir /usr/local/nvm
RUN curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Install application
WORKDIR /opt/app

COPY . .

# Enabling devtoolset puts compilers like g++
# in the PATH so that node-gyp can build native
# compiled node modules as part of the install
RUN source scl_source enable devtoolset-8 && \
    npm install

RUN bash core-js-fix.sh

EXPOSE 3001

ENTRYPOINT ["/opt/app/entrypoint.sh"]
