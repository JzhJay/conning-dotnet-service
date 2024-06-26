#!/bin/bash
sed s/'<newip>'/`curl 169.254.169.254/latest/meta-data/public-ipv4`/ < ./update-dns.json > /tmp/update-dns.json
aws route53 change-resource-record-sets --hosted-zone-id ZBP9JPJR66WMN --change-batch file:///tmp/update-dns.json
