# interim image for staging work (mostly getting files from aws with ephemeral creds)
ARG BASE_IMAGE
FROM $BASE_IMAGE as stage_image
MAINTAINER Sephone Slattery <sephone.slattery@conning.com>

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ARG DEBIAN_FRONTEND=noninteractive

# docker args
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG CI="false"

# install basic packages
RUN apt-get update
RUN apt-get install -y \
    curl \
    unzip  \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# install aws cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && echo "AWS_PAGER=" >> /etc/environment \
    && rm -rf ./aws \
    && rm awscliv2.zip \
    && aws --version

# get chrome installation

FROM $BASE_IMAGE as base_image
MAINTAINER Sephone Slattery <sephone.slattery@conning.com>

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ARG DEBIAN_FRONTEND=noninteractive

# docker args
ARG CI="false"

# get chrome deb installer from staging image
COPY google-chrome-stable_79.0.3945.130-1_amd64.deb /tmp/chrome/

# install basic packages
RUN apt-get update
RUN apt-get install -y \
    software-properties-common \
    && add-apt-repository -y "deb http://security.ubuntu.com/ubuntu jammy-security main" \
    && apt-get install -y \
    apt-utils  \
    apt-transport-https  \
    curl  \
    fonts-liberation  \
    libappindicator3-1 \
      libasound2  \
    libatk-bridge2.0-0  \
    libatk1.0-0  \
    libatspi2.0-0  \
    libcairo2  \
    libcups2  \
    libdbus-1-3 \
    liblttng-ust1  \
    libcurl4  \
    libnspr4  \
    libnss3  \
    libssl3  \
    libxss1  \
    libunwind8  \
    libuuid1  \
    libkrb5-3  \
    zlib1g  \
    libicu70  \
    xdg-utils \
    wget  \
    build-essential  \
    unzip  \
    git  \
    libpng-dev \
    libgdk-pixbuf2.0-0

# install dotnet
ARG DOTNET_SDK_VERSION
ENV DOTNET_CLI_TELEMETRY_OPTOUT=1
RUN wget https://dot.net/v1/dotnet-install.sh -O /tmp/dotnet-install.sh \
    && chmod +x ./tmp/dotnet-install.sh \
    && ./tmp/dotnet-install.sh --channel ${DOTNET_SDK_VERSION} --install-dir /opt/dotnet \
    && rm ./tmp/dotnet-install.sh
# expose the dotnet path in a few places
RUN echo "export PATH=$PATH:/opt/dotnet" >> /etc/profile.d/dotnet.sh \
    && chmod +x /etc/profile.d/dotnet.sh  \
    && sed -i "\$ s|\$|:/opt/dotnet|" /etc/environment \
    && cat /etc/environment \
    && echo ". /etc/profile.d/dotnet.sh" >> /root/.bashrc

# install chrome from deb (& cleanup apt)
RUN dpkg -i /tmp/chrome/*.deb \
    && apt-get install -f -y  \
    && rm -rf /tmp/chrome \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*
