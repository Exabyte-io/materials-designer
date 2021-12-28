#!/usr/bin/env bash

# ---------------------------------------------------------- #
#                       FUNCTIONS                            #
# ---------------------------------------------------------- #

NODE_VERSION="8.11.4"

#
# Print usage
#
usage () {
    echo "run-tests.sh -h=HOST -p=PORT -f=FEATURES -o=OPTIONS"
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
source ${NVM_DIR}/nvm.sh
nvm use ${NODE_VERSION}
npm ci

rm -rf ${SCREENSHOTS_DIR}

# Hotfix: change node debug option in cucumber
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
