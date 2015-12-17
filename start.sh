#!/bin/bash
for subdomain in $(ls ./sub); do
	echo "$subdomain"
	if forever list | grep " $subdomain"; then
		echo "$subdomain is already up and running"	
	else
		forever start --uid "$subdomain" -a --minUptime 1000 --spinSleepTime 100 start.js "./sub/$subdomain"
	fi
done
