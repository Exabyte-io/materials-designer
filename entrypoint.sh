#!/usr/bin/env bash

source $NVM_DIR/nvm.sh
nvm use ${NODE_VERSION}

if [[ "${BASE_DIR}" == "" ]]; then
    BASE_DIR=.
fi

export DEBUG_LEVEL=3
export DEBUG="exachimp:*"
export ROOT_URL="http://127.0.0.1:3001"

if [[ "$1" == "test" ]]; then
    # xvfb-run -s "-ac -screen 0 1920x1080x24" \
    ${BASE_DIR}/tests/node_modules/.bin/chimp \
        --serverHost="http://127.0.0.1" \
        --serverPort="3001" \
        --path=${BASE_DIR}/tests/cucumber/features/ \
        -r=${BASE_DIR}/tests/cucumber/support \
        --singleSnippetPerFile=1 \
        --screenshotsOnError=true \
        --captureAllStepScreenshots=false \
        --browser=chrome \
        --webdriverio.deprecationWarnings=false \
        --webdriverio.logLevel="silent" \
        --webdriverio.desiredCapabilities.chromeOptions.args="headless" \
        --webdriverio.desiredCapabilities.chromeOptions.args="disable-gpu" \
        --webdriverio.desiredCapabilities.chromeOptions.args="no-sandbox" \
        --webdriverio.desiredCapabilities.chromeOptions.args="window-size=1920,1080"
else
    npm start
fi
