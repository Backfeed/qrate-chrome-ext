#! /bin/bash
sudo apt-get update

curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get update -y
sudo apt-get install -y nodejs git

sudo npm install -g gulp
sudo npm install -g bower
sudo chown -R `whoami` ~/.npm
