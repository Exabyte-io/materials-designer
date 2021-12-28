#!/usr/bin/env bash

source $NVM_DIR/nvm.sh
nvm use ${NODE_VERSION}

if [[ "$1" == "test" ]]; then
    xvfb-run -s "-ac -screen 0 1024x768x24" ./tests/node_modules/.bin/chimp \
        --serverHost="127.0.0.1" \
        --serverPort="3001" \
        --path=./tests/cucumber/features/ \
        -r=./tests/cucumber/support \
        --singleSnippetPerFile=1 \
        --screenshotsOnError=true \
        --captureAllStepScreenshots=false \
        --browser=chrome \
        --webdriverio.deprecationWarnings=false \
        --webdriverio.logLevel="silent" \
        --seleniumStandaloneOptions.drivers.chrome.version=2.35
else
    npm start
fi
