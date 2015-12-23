#! /bin/bash
sudo apt-get update

curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -

sudo apt-get update -y
sudo apt-get install -y nodejs git
sudo apt-get install -y build-essential

sudo npm install --no-bin-links -g gulp
sudo npm install --no-bin-links -g bower
sudo chown -R `whoami` ~/.npm
cd /vagrant
npm install --no-bin-links
bower install -y
