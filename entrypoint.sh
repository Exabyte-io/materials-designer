#!/usr/bin/env bash

if [[ "$1" == "test" ]]; then
    # If "test" is passed as a parameter - run the chimpy tests
    source $NVM_DIR/nvm.sh
    nvm use ${NODE_VERSION}

    if [[ "${BASE_DIR}" == "" ]]; then
        BASE_DIR=.
    fi

    export DEBUG_LEVEL=3
    export DEBUG="exachimp:*"
    export ROOT_URL="http://host.docker.internal:3001"
    export DISPLAY=":99"

    echo "Starting Xvfb"
    Xvfb $DISPLAY -screen 0 1920x1280x16 &> Xvfb.log &

    echo "Starting x11vnc service"
    x11vnc -passwd 123 -display $DISPLAY -N -forever &> x11vnc.log &

    # If "test" is passed as a parameter - running tests/chimp
    ${BASE_DIR}/node_modules/.bin/chimp \
        --serverHost="http://host.docker.internal" \
        --serverPort="3001" \
        --path=${BASE_DIR}/tests/cucumber/features/ \
        -r=${BASE_DIR}/tests/cucumber/support \
        --screenshotsOnError=true \
        --singleSnippetPerFile=1 \
        --screenshotsOnError=true \
        --captureAllStepScreenshots=false \
        --browser chrome \
        --seleniumStandaloneOptions.drivers.chrome.version=109.0.5414.25 \
        --webdriverio.deprecationWarnings=false \
        --webdriverio.logLevel="silent" \
        --webdriverio.desiredCapabilities.chromeOptions.args=disable-gpu \
        --webdriverio.desiredCapabilities.chromeOptions.args=disable-dev-shm-usage \
        --webdriverio.desiredCapabilities.chromeOptions.args=no-sandbox \
        # --watch

else
    # If "test" is not passed as a parameter - running the application itself
    npm start
fi
