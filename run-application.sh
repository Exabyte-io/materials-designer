#!/usr/bin/env bash

# ---------------------------------------------------------- #
#                       FUNCTIONS                            #
# ---------------------------------------------------------- #

NODE_VERSION="12.21.0"

#
# Print usage
#
usage () {
    echo "run-application.sh -o=OPTIONS"
    exit 1
}

#
# Check arguments passed to the script
#
#   Args:
#       $@: all arguments passed to the script
#
check_args () {
    OPTIONS=""
    for i in "$@"
    do
        case $i in
            -o=*|--options=*)
                OPTIONS="${i#*=} ${OPTIONS}"
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

source ~/.nvm/nvm.sh
nvm use ${NODE_VERSION}
npm install

npm start
