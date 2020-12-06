#!/bin/bash
shopt -s extglob

# Sikrer, at wd er øverst i Angular-applikationen
cd "$(dirname "$0")"

# Fjerner cache >:O
rm -rf node_modules/.cache

# Pusher til master
rm -rf ../../docs
mkdir ../../docs
# rm -rf !(.git|.gitignore|src|docs)

npm run-script build-prod
cp dist/frontend/index.html dist/frontend/404.html
yes | cp -r dist/frontend/* ../../docs
# python injector.py

git add -A
git commit -m"${1:-New build}"
git pull
git push
