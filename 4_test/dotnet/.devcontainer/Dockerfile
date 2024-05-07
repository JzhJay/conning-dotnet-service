ARG DOTNET_NODE_IMAGE_TAG=develop
FROM 737922848153.dkr.ecr.us-east-1.amazonaws.com/dotnet-node-image:$DOTNET_NODE_IMAGE_TAG
LABEL maintainer="Kent chen <kent.chen@conning.com>"
RUN apt-get update && apt-get install dnsutils -y
