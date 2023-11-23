#!/usr/bin/env bash

source $HOME/.nvm/nvm.sh
nvm use ${NODE_VERSION}

export DEBUG_LEVEL=3
export DEBUG="exachimp:*"
export ROOT_URL="http://host.docker.internal:3001"

echo $BASE_DIR

DISPLAY=":99"
BROWSER_NAME="chrome"
OFFLINE=""
WATCH="--watch"
SKIP_XVFB="false"

# For log levels for webdriverio v4:
# http://v4.webdriver.io/guide/getstarted/configuration.html#logLevel

COMMAND_FIREFOX="${BASE_DIR}/node_modules/.bin/chimpy \
    --path=${BASE_DIR}/cucumber/features \
    -r=${BASE_DIR}/cucumber/support \
    --singleSnippetPerFile=1 \
    --screenshotsOnError=true \
    --captureAllStepScreenshots=false \
    --screenshotsPath=${BASE_DIR}/.screenshots \
    --browser firefox \
    --seleniumStandaloneOptions.version=3.11.0 \
    --seleniumStandaloneOptions.drivers.firefox.version=0.32.2 \
    --webdriverio.deprecationWarnings=true \
    --webdriverio.logLevel=silent \
    --webdriverio.desiredCapabilities.browserName=firefox \
    --watch ${OFFLINE}
    "

COMMAND_CHROME="${BASE_DIR}/node_modules/.bin/chimpy \
    --path=${BASE_DIR}/cucumber/features \
    -r=${BASE_DIR}/cucumber/support \
    --singleSnippetPerFile=1 \
    --screenshotsOnError=true \
    --captureAllStepScreenshots=false \
    --screenshotsPath=${BASE_DIR}/.screenshots \
    --browser chrome \
    --seleniumStandaloneOptions.drivers.chrome.version=109.0.5414.25 \
    --webdriverio.deprecationWarnings=false \
    --webdriverio.logLevel=silent \
    --webdriverio.desiredCapabilities.chromeOptions.args=disable-dev-shm-usage \
    --webdriverio.desiredCapabilities.chromeOptions.args=disable-gpu \
    --webdriverio.desiredCapabilities.chromeOptions.args=no-sandbox \
    --serverExecuteTimeout=60000
    ${WATCH} ${OFFLINE}
    "
COMMAND=$COMMAND_FIREFOX

if [[ $BROWSER_NAME != "firefox" ]]; then
  COMMAND=$COMMAND_CHROME
fi

if [[ $SKIP_XVFB == "false" ]]; then
  # From https://qxf2.com/blog/view-docker-container-display-using-vnc-viewer/
  echo "Starting Xvfb"
  Xvfb $DISPLAY -screen 0 1920x1280x16 &> Xvfb.log &

  echo "Starting x11vnc service"
  x11vnc -passwd $VNC_PASSWORD -display $DISPLAY -N -forever &> x11vnc.log &
fi

echo "Running chimp"
echo $COMMAND

$COMMAND
