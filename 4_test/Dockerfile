# docker args
ARG BASE_IMAGE
ARG CI="false"

FROM $BASE_IMAGE as test_image

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
ARG DEBIAN_FRONTEND=noninteractive
ARG CI="false"

# install web advise client dependencies (node_modules)
WORKDIR /ADVISE
COPY . /ADVISE


# RUN rm -rf /tmp/installers

# build client and dotnet server
ENV PATH "$PATH:/opt/dotnet"
RUN cd dotnet
RUN dotnet publish -c Release dotnet/web-api -o dist/dotnet 
RUN cp -R dotnet/web-api/wwwroot/ui dist/dotnet/wwwroot/ui
