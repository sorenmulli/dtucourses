#!/bin/bash

cd "$(dirname "$0")"

/usr/local/bin/python3 ../backend/scrape/dtu_scrape.py
/usr/local/bin/python3 ../backend/process/rate_courses.py
/usr/local/bin/python3 ../backend/process/stats.py

./deploy.sh "Update course database"

