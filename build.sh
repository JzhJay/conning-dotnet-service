#!/usr/bin/env bash 
set -e -x

pushd 1_base
docker build --build-arg BASE_IMAGE=ubuntu:22.04 --build-arg DOTNET_SDK_VERSION=6.0 -t dotnet.base:latest .
popd

pushd 2_node
docker build --build-arg BASE_IMAGE=dotnet.base:latest -t dotnet.node:latest .
popd

pushd 3_ui
docker build --build-arg BASE_IMAGE=dotnet.node:latest -t dotnet.ui:latest .
popd

pushd 4_test
docker build --build-arg BASE_IMAGE=dotnet.ui:latest --build-arg DOTNET_SDK_VERSION=6.0 -t dotnet.test:latest .
popd

pushd 5_prod
docker build --build-arg BASE_IMAGE=ubuntu:22.04 --build-arg TEST_IMAGE=dotnet.test:latest -t dotnet.prod:latest .
popd
