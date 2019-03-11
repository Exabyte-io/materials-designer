#!/usr/bin/env bash

# ---------------------------------------------------------- #
#                       FUNCTIONS                            #
# ---------------------------------------------------------- #

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

cd ${THIS_SCRIPT_DIR}
npm install

export DEBUG="exachimp:*"
export DEBUG_LEVEL=3

TESTS_DIR="${THIS_SCRIPT_DIR}/tests"
CUCUMBER_DIR="${TESTS_DIR}/cucumber"
SUPPORT_DIR="${CUCUMBER_DIR}/support"
SCREENSHOTS_DIR="${TESTS_DIR}/.screenshots"

rm -rf ${SCREENSHOTS_DIR}

# Hotfix: change node debug option in cucumber
sed -ie 's/--debug/--inspect/g'  ${THIS_SCRIPT_DIR}/node_modules/chimp/dist/lib/cucumberjs/cucumber.js

${THIS_SCRIPT_DIR}/node_modules/.bin/chimp \
    --ddp="${HOST}:${PORT}" \
    --path=${CUCUMBER_DIR}/features/$FEATURES -r=${SUPPORT_DIR} \
    --singleSnippetPerFile=1 \
    --screenshotsOnError=true --captureAllStepScreenshots=false \
    --screenshotsPath=${SCREENSHOTS_DIR} \
    --seleniumStandaloneOptions.drivers.chrome.version=2.35 \
    --browser=${BROWSER} \
    --serverExecuteTimeout=60000 \
    ${OPTIONS}
