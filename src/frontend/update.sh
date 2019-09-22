#!/bin/bash

cd "$(dirname "$0")"

python ../backend/scrape/dtu_scrape.py
python ../backend/process/rate_courses.py

./deploy.sh "Opdateret kursusdatabase"

