#!/usr/bin/env bash
# ---------------------------------------------------------- #
# This script attempts to place the chromedriver
# for the target version of Chrome into the location expected
# By chimpy for the current version of Chrome.
# Meant to allow using Chrome versions past 115 that changes
# the install location/URL of the chromedriver.
# Below is example directory structure:
#   ➜  tests > ls -lthra node_modules/selenium-standalone/.selenium/
#   total 0
#   drwxr-xr-x  21 timur  staff   672B Nov 29 15:55 ..
#   drwxr-xr-x   4 timur  staff   128B Nov 29 15:55 .
#   drwxr-xr-x   3 timur  staff    96B Nov 29 15:55 selenium-server
#   drwxr-xr-x   6 timur  staff   192B Nov 29 15:55 chromedriver
#   ➜  tests > ls -lthra node_modules/selenium-standalone/.selenium/chromedriver
#   total 67648
#   -rwxr-xr-x  1 timur  staff    16M Oct 30 14:47 109.0.5414.25-x64-chromedriver
#   -rw-r--r--  1 timur  staff   8.4M Oct 30 14:55 chromedriver-mac-arm64.zip
#   drwxr-xr-x  4 timur  staff   128B Nov 29 15:55 ..
#   -rw-r--r--  1 timur  staff   8.8M Nov 29 15:55 109.0.5414.25-x64-chromedriver.zip
#   drwxr-xr-x  3 timur  staff    96B Nov 29 15:55 chromedriver-mac-arm64
#   drwxr-xr-x  6 timur  staff   192B Nov 29 15:55 .#
# ---------------------------------------------------------- #

ARCHITECTURE="mac-arm64"
CURRENT_BROWSER_VERSION="119.0.6045.105"
TARGET_BROWSER_VERSION="109.0.5414.25"
THIS_SCRIPT_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )" # https://stackoverflow.com/a/246128/1446847
SELENIUM_DIR="${THIS_SCRIPT_DIR}/node_modules/selenium-standalone/.selenium"

# Make sure the correct version of node is used first

# Install
npm install

# remove .selenium directory if it is empty, otherwise the logic in chimpy will not install the chromedriver
if [ "$(ls -A $SELENIUM_DIR)" ]; then
    echo "$SELENIUM_DIR is not empty, nothing to do"
else
    echo "$SELENIUM_DIR is empty, removing it"
    rm -rf $SELENIUM_DIR
fi

# Attempt to install the chromedriver for the target version of Chrome
# This should fail but still create the .selenium/{chromedriver,selenium-server} directories
cd ${THIS_SCRIPT_DIR}/../
sh run-tests.sh --browser=chrome --browser-version=${TARGET_BROWSER_VERSION} --skip-install=true
cd ${THIS_SCRIPT_DIR}

# Download the chromedriver for the current version of Chrome
cd node_modules/selenium-standalone/.selenium/chromedriver
wget https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/${CURRENT_BROWSER_VERSION}/${ARCHITECTURE}/chromedriver-${ARCHITECTURE}.zip
unzip chromedriver-${ARCHITECTURE}.zip

# Copy the chromedriver from the target version to the current version
# Note the "x-64" in the filename is required by chimpy
mv chromedriver-${ARCHITECTURE}/chromedriver ${TARGET_BROWSER_VERSION}-x64-chromedriver

# Print out the contents of the directory for debugging
pwd
ls -tlhra
