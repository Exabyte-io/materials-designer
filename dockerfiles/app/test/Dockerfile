FROM ghcr.io/exabyte-io/centos-7.9-node-8.11.4-chimp-xvfb-x11vnc-chrome_x86_64:latest
WORKDIR /opt/test
RUN git init
COPY . .

ENV BASE_DIR /opt/test
ENTRYPOINT ["/opt/test/entrypoint.sh", "test"]

