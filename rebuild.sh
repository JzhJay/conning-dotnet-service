#!/usr/bin/env bash 
set -e -x

pushd 4_test
docker build --build-arg BASE_IMAGE=dotnet.ui:latest --build-arg DOTNET_SDK_VERSION=6.0 -t dotnet.test:latest .
popd

pushd 5_prod
docker build --build-arg BASE_IMAGE=ubuntu:22.04 --build-arg TEST_IMAGE=dotnet.test:latest -t conning/advise-ui:latest .
popd
