#!/usr/bin/env bash

if [[ "$1" == "build" ]]; then
    if [[ "$2" == "application" ]]; then
        echo "building application container"
        docker build -t materials-designer:application -f dockerfiles/centos/Dockerfile .
    elif [[ "$2" == "test" ]]; then
        echo "building test"
        docker build -t materials-designer:test -f dockerfiles/test/Dockerfile .
    fi
elif [[ "$1" == "run" ]]; then
    if [[ "$2" == "application" ]]; then
        echo "running application container"
        docker run -it -p 3001:3001 -d --name=application materials-designer:application
    elif [[ "$2" == "test" ]]; then
        echo "running test"
        docker run -it --network=host --name=test materials-designer:test
    fi
elif [[ "$1" == "all" ]]; then
    echo "Building application and test containers, then running application and test containers"
    docker build -t materials-designer:application -f dockerfiles/centos/Dockerfile .
    docker build -t materials-designer:test -f dockerfiles/test/Dockerfile .
    docker run -it -p 3001:3001 -d --name=application materials-designer:application
    sleep 30
    docker run -it --network=host --name=test materials-designer:test
else
    echo "Supports [build|run] [application|test] containers only"
fi
