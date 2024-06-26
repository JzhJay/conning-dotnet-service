# docker args
ARG BASE_IMAGE
ARG TEST_IMAGE
ARG CI="false"

# interim image for staging work
FROM $TEST_IMAGE as stage_image
MAINTAINER Sephone Slattery <sephone.slattery@conning.com>

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ARG DEBIAN_FRONTEND=noninteractive
ARG CI="false"
ENV WHITESOURCE_LOG_LEVEL=error

# minify file
RUN if [ ! -f /ADVISE/dist/dotnet/wwwroot/ui/softwareNotices/softwareNotices.json ]; \
      then NODE_ENV=production node --max-old-space-size=4096 ./node_modules/.bin/gulp buildSoftwareNotices;  \
      if [ -f /ADVISE/dotnet/web-api/wwwroot/ui/softwareNotices/softwareNotices.json ]; \
        then mkdir -p /ADVISE/dist/dotnet/wwwroot/ui/softwareNotices \
          && cp /ADVISE/dotnet/web-api/wwwroot/ui/softwareNotices/softwareNotices.json /ADVISE/dist/dotnet/wwwroot/ui/softwareNotices/softwareNotices.json; \
      fi; \
      if [ ! -f /ADVISE/dist/dotnet/wwwroot/ui/softwareNotices/softwareNotices.json ]; \
        then exit 1; \
      fi; \
    fi \
    && echo "Generated software notice file successfully." || exit 1

# configure startup script
COPY aws-run-dotnet.sh /root/aws-run-dotnet.sh
RUN chmod 777 /root/aws-run-dotnet.sh

FROM $BASE_IMAGE as prod_image
MAINTAINER Sephone Slattery <sephone.slattery@conning.com>

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ARG DEBIAN_FRONTEND=noninteractive
ARG CI="false"

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
ARG DOTNET_SDK_VERSION=6.0
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

# update path with dotnet
ENV PATH "$PATH:/opt/dotnet"

# copy deploy from staging image
COPY --from=stage_image /ADVISE/dist/dotnet /dotnet

# startup
COPY --from=stage_image /root/aws-run-dotnet.sh /root/aws-run-dotnet.sh
CMD ["/root/aws-run-dotnet.sh"]
