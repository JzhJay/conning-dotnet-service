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

# update path with dotnet
ENV PATH "$PATH:/opt/dotnet"

# copy deploy from staging image
COPY --from=stage_image /ADVISE/dist/dotnet /dotnet

# startup
COPY --from=stage_image /root/aws-run-dotnet.sh /root/aws-run-dotnet.sh
CMD ["/root/aws-run-dotnet.sh"]
