#!/bin/bash
redis-server &
./bin/node index.js &
echo Good to open in browser!
read PAUSE
