# docker args
ARG BASE_IMAGE
ARG CI="false"

# interim image for staging work (for building yarn)
FROM $BASE_IMAGE as stage_image
MAINTAINER Sephone Slattery <sephone.slattery@conning.com>

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ARG DEBIAN_FRONTEND=noninteractive

# curl nodejs and yarn and install them
RUN curl -sS https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -  \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" >> /etc/apt/sources.list.d/yarn.list \
    && curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs yarn


FROM $BASE_IMAGE as node_image
MAINTAINER Sephone Slattery <sephone.slattery@conning.com>

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ARG DEBIAN_FRONTEND=noninteractive
ARG CI="false"

# install nodejs and yarn
RUN curl -sS https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -  \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" >> /etc/apt/sources.list.d/yarn.list \
    && curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs yarn

# build yarn
COPY package.json /ADVISE/
COPY yarn.lock /ADVISE/
WORKDIR /ADVISE
RUN CI=$CI yarn install
COPY . /ADVISE

RUN CI=$CI yarn install
RUN dpkg -i /ADVISE/installers/libpcsclite1_1.9.5-3ubuntu1_amd64.deb
RUN dpkg -i /ADVISE/installers/java-common_0.72build2_all.deb
RUN dpkg -i /ADVISE/installers/libgif7_5.1.9-2build2_amd64.deb
RUN apt-get -y install default-jre-headless
RUN dpkg -i /ADVISE/installers/ca-certificates-java_20190909ubuntu1.2_all.deb
RUN dpkg -i /ADVISE/installers/openjdk-11-jre-headless_11.0.20.1+1-0ubuntu1-22.04_amd64.deb
RUN dpkg -i /ADVISE/installers/openjdk-11-jre_11.0.20.1+1-0ubuntu1~22.04_amd64.deb