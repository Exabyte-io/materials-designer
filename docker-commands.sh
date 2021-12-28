#!/usr/bin/env bash

if [[ "$1" == "build" ]]; then
    if [[ "$2" == "app" ]]; then
        echo "building app"
        docker build -t materials-designer:centos -f dockerfiles/centos/Dockerfile .
    elif [[ "$2" == "test" ]]; then
        echo "building test"
        docker build -t materials-designer:test -f dockerfiles/test/Dockerfile .
    fi
elif [[ "$1" == "run" ]]; then
    if [[ "$2" == "app" ]]; then
        echo "running app"
        docker run -it -p 3001:3001 -d --name=centos materials-designer:centos
    elif [[ "$2" == "test" ]]; then
        echo "running test"
        docker run -it --network=host --name=test materials-designer:test
    fi
elif [[ "$1" == "" ]]; then
    echo "Building app and test, then running app and tests"
    docker build -t materials-designer:centos -f dockerfiles/centos/Dockerfile .
    docker build -t materials-designer:test -f dockerfiles/test/Dockerfile .
    docker run -it -p 3001:3001 -d --name=centos materials-designer:centos
    sleep 30
    docker run -it --network=host --name=test materials-designer:test
else
    echo "Supports [build|run] [app|test] only"
fi
