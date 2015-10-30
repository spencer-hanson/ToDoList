#!/bin/bash
redis-server &
./node index.js &
echo Good to open in browser!
read PAUSE
