#!/bin/bash

#give permission for everything in the nest-app directory
sudo chmod -R 777 /home/ec2-user/michal-demo

#navigate into our working directory where we have all our github files
cd /home/ec2-user/michal-demo

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
yarn install

#start our node app in the background
pm2 stop all
pm2 start main.js --name "SmartBillboard"
#node app.js > app.out.log 2> app.err.log < /dev/null & 