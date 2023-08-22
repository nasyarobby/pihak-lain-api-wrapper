#!/bin/sh

OPENAPIFILE=openapi.json

if [ -f ./src/swagger.yaml ]; then
    OPENAPIFILE=swagger.yaml
fi

if [ -f ./src/openapi.json ]; then
    OPENAPIFILE=openapi.json
fi

if [ -f ./src/swagger.json ]; then
    OPENAPIFILE=swagger.json
fi

if [ -f ./src/$OPENAPIFILE ]; then
    echo "Found $OPENAPIFILE"
else 
    echo "Error: Cannot find spec file"
    exit 1
fi

yarn tsc -p tsconfig.json && cp ./src/$OPENAPIFILE ./build/$OPENAPIFILE