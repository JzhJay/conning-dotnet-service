# docker args
ARG BASE_IMAGE
ARG CI="false"

# get installer files from s3 (openjdk, libgif, javacommon, libpsc, etc. for testing)

FROM $BASE_IMAGE as ui_image
MAINTAINER Sephone Slattery <sephone.slattery@conning.com>

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ARG DEBIAN_FRONTEND=noninteractive
ARG CI="false"

# install web advise client dependencies (node_modules)
WORKDIR /ADVISE
COPY . /ADVISE


# build client and dotnet server
RUN NODE_ENV=production ./node_modules/.bin/babel-node -x .js,.jsx,.ts,.tsx --max-old-space-size=4096 ./node_modules/.bin/gulp client:webpack 
