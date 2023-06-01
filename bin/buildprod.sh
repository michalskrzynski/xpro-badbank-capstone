#!/usr/bin/env bash

echo "Cleaning old builds"
rm -rf front-end/build
rm -rf public

echo "Building front-end!"
cd front-end
npm run build
cd ..

echo "Copying front-end/build to ../public"
cp -r front-end/build public
npm run build

echo "Building docker image"
docker build -t bad-bank:latest .
docker tag bad-bank:latest 798614671151.dkr.ecr.eu-west-1.amazonaws.com/bad-bank:latest

echo "Pushing image to ECR"
aws ecr get-login-password --region eu-west-1 --profile msk-personal | docker login --username AWS --password-stdin 798614671151.dkr.ecr.eu-west-1.amazonaws.com/bad-bank
docker push 798614671151.dkr.ecr.eu-west-1.amazonaws.com/bad-bank:latest

echo "DONE!"