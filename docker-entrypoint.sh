#!/usr/bin/env sh
set -eu
envsubst '${API_IP}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
exec "$@"