# Troubleshooting - Dotnet docker image build 
## Offline docker installation
```
tar xvf dokcer-installer.tar
cd docker-installer
dpkg -i *.dep
```
## Dockerfile COPY command cannot complete
Error message:
```
------
 > [test_image 7/9] COPY --from=stage_image /tmp/installers /tmp/installers:
------
test.dockerfile:59
--------------------
  57 |     
  58 |     # install whitesource deps
  59 | >>> COPY --from=stage_image /tmp/installers /tmp/installers
  60 |     RUN dpkg -i /tmp/installers/*.deb \
  61 |         && rm -rf /tmp/installers
--------------------
ERROR: failed to solve: failed to compute cache key: failed to calculate checksum of ref 74f7cbe5-916b-4a8a-a7e0-e151ce78d9fd::3714ivz9y97peauirtb9y1efp: "/tmp/installers": not found
```

COPY can only function in the current context
