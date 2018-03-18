#!/bin/bash

echo "Make sure to run 'npm run build' in ../generator/ first."

read -p "Continue with flashing data/ to SPIFFS? (y to continue)? " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Copying new data from ../generator/dist/data/"
    cp ../generator/dist/data/* ./data/
    echo "Flashing data to SPIFFS"
    pio run --target buildfs
    pio run --target uploadfs
fi