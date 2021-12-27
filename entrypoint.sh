#!/usr/bin/env bash

source $NVM_DIR/nvm.sh
nvm use ${NODE_VERSION}

if [[ "$1" == "test" ]]; then
    ./tests/node_modules/.bin/chimp \
        --serverHost="${HOST}" \
        --serverPort="${PORT}" \
        --path=./cucumber/features/ \
        -r=./cucumber/support \
        --singleSnippetPerFile=1 \
        --screenshotsOnError=true \
        --captureAllStepScreenshots=false \
        --browser=chrome \
        --webdriverio.deprecationWarnings=false \
        --webdriverio.logLevel="silent" \
        --seleniumStandaloneOptions.drivers.chrome.version=${CHROME_VERSION} 
else 
    npm start
fi
