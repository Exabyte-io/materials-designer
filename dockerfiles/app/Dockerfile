FROM 889103812817.dkr.ecr.us-west-2.amazonaws.com/centos-7.9-base:latest

WORKDIR /opt/app

COPY . .

RUN source scl_source enable devtoolset-8 && \
    npm install

EXPOSE 3001

ENTRYPOINT ["/opt/app/entrypoint.sh"]

