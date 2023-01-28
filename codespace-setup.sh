# Setup for a default GitHub codespace container (Linux/Ubuntu) circa 2022-12
# TODO: migrate to using `.devcontainer` setup per
# https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/introduction-to-dev-containers

# Application
nvm install 12.21.0
chmod +x run-application.sh
npm start

# Run Tests
sudo apt-get upgrade
sudo apt-get update
sudo apt-get install openjdk-8-jdk
sudo apt-get install git bzip2
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt-get --fix-broken install 
nvm use 8
cd tests
npm install
cd ..
export PATH=/usr/lib/jvm/java-1.8.0-openjdk-amd64/bin:$PATH
java -version
./run-tests.sh -s=true -hm=true -f=menu/edit/reset-clone-undo-redo.feature

