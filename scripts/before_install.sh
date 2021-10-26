#!/bin/bash

#download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
npm install --global yarn
yarn install
yarn add pm2
#npm install -g @nestjs/cli

#create our working directory if it doesnt exist
DIR="/home/ec2-user/michal-demo"

if [ -d "$DIR"]; then
    echo "${DIR} exists"
    rm -r $DIR
else
    echo "Creating ${DIR} directory"
    mkdir ${DIR}
fi