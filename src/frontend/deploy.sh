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

ng build --prod
python injector.py
yes | cp -rf dist/frontend/* ../../docs

git add -A
git commit -m"${1:-Nyt build}"
git pull
git push




# Pusher til gh-pages
# git add -A
# git commit -m"${1:-Påbegynder deploy}"
# git pull
# git push

# git branch gh-pages
# git checkout gh-pages

# ng build --prod
# yes | cp -rf dist/frontend/* ../..
# rm -rf dist

# git add -A
# git commit -m"${1:-Nyt build}"
# git push origin gh-pages -f
# git checkout master
# git branch -D gh-pages




