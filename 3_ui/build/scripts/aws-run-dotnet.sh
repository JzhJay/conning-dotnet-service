#!/bin/bash
build_environment=$1
cd /dotnet
if [ "$build_environment" == "production" ]; then
	sed -i "s|{LOG_GROUP}|${LOG_GROUP}|g" appsettings.production.json
	export ASPNETCORE_ENVIRONMENT=production
fi
if [ "$build_environment" == "on-prem-k8s" ]; then
	export ASPNETCORE_ENVIRONMENT=OnPremK8S
fi
dotnet Conning.Website.dll
