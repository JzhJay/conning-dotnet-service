# FerretDB configuration
1. Setup FerretDB and PostgreSQL with docker compose
```
cd ferret && docker-compose up -d
```
2. Connect to FerretDB via a Mongo Client
```
mongosh mongodb://rwuser:Conning2026!@127.0.0.1:27018/ferretdb
```

# .NET Dev environment build
## Set AWS env variables 
add the following:
```
export AWS_ACCESS_KEY_ID=ID
export AWS_SECRET_ACCESS_KEY=key
export AWS_SESSION_TOKEN=token
export AWS_REGION=us-east-1
export ON_PREM_K8S=1
```
to ~/.bashrc, then run:
```
source ~/.bashrc
```

# .NET docker image build troubleshooting
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