#!/usr/bin/env bash

# babel/runtime moved core-js into babel/runtime-corejs2, hence the below.
if [[ -d node_modules/@babel/runtime ]]; then
    echo "Creating symlink for @babel/core-js"
    cd node_modules/@babel/runtime
    ln -sf ../runtime-corejs2/core-js .
    cd -
fi