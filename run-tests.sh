#!/usr/bin/env bash

# ---------------------------------------------------------- #
#                       FUNCTIONS                            #
# ---------------------------------------------------------- #

NODE_VERSION="14.19.3"

#
# Print usage
#
usage () {
    echo "run-tests.sh -h=HOST -p=PORT -s=SKIP_INSTALL -f=FEATURES -o=OPTIONS"
    exit 1
}

#
# Check arguments passed to the script
#
#   Args:
#       $@: all arguments passed to the script
#
check_args () {
    HOST="http://127.0.0.1"
    PORT="3001"
    FEATURES="/"
    OPTIONS=""
    BROWSER="chrome"
    for i in "$@"
    do
        case $i in
            -h=*|--host=*)
                HOST="${i#*=}"
                shift
            ;;
            -s=*|--skip-install=*)
                SKIP_INSTALL="${i#*=}"
                shift
            ;;
            -p=*|--port=*)
                PORT="${i#*=}"
                shift
            ;;
            -f=*|--features-dir=*)
                FEATURES="${i#*=}"
                shift
            ;;
            -o=*|--options=*)
                OPTIONS="${i#*=} ${OPTIONS}"
                shift
            ;;
            -b=*|--browser=*)
                BROWSER="${i#*=}"
                shift
            ;;
            *)
                usage
            ;;
        esac
    done
}

# ---------------------------------------------------------- #
#                       MAIN BODY                            #
# ---------------------------------------------------------- #

check_args $@

SOURCE="${BASH_SOURCE[0]}"
THIS_SCRIPT_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

export DEBUG_LEVEL=3
export DEBUG="exachimp:*"

TESTS_DIR="${THIS_SCRIPT_DIR}/tests"
CUCUMBER_DIR="${TESTS_DIR}/cucumber"
SUPPORT_DIR="${CUCUMBER_DIR}/support"
SCREENSHOTS_DIR="${CUCUMBER_DIR}/screenshots"

export ROOT_URL="${HOST}:${PORT}"

cd ${TESTS_DIR}
DEFAULT_NVM_DIR="${HOME}/.nvm"
source ${NVM_DIR:-$DEFAULT_NVM_DIR}/nvm.sh
nvm use ${NODE_VERSION}
if [[ ${SKIP_INSTALL} != "true" ]]; then
    npm ci
fi

rm -rf ${SCREENSHOTS_DIR}

# Hotfix: change node debug option in cucumber
# This is actually useful for debugging the application in WebStorm
# https://www.jetbrains.com/help/webstorm/running-and-debugging-node-js.html#node_debugging_overview
# sed -ie 's/--debug/--inspect/g'  ${TESTS_DIR}/node_modules/chimp/dist/lib/cucumberjs/cucumber.js

${TESTS_DIR}/node_modules/.bin/chimp \
    --serverHost="${HOST}" \
    --serverPort="${PORT}" \
    --path=${CUCUMBER_DIR}/features/$FEATURES -r=${SUPPORT_DIR} \
    --singleSnippetPerFile=1 \
    --screenshotsOnError=true --captureAllStepScreenshots=false \
    --screenshotsPath=${SCREENSHOTS_DIR} \
    --browser=${BROWSER} \
    --webdriverio.deprecationWarnings=false \
    --webdriverio.logLevel="silent" \
    ${OPTIONS}
