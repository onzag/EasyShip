#!/bin/bash
sudo node nginx.js > /etc/nginx/sites-enabled/default
nginxpid=`cat /run/nginx.pid`
sudo kill -HUP "$nginxpid"
