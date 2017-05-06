# space-cash

## Setup
Install
```bash
yarn install # npm i yarn -g (if you don't have it)
brew install redis nvm
nvm install 6.10.3
npm install -g react-native-cli
```
Start server
```bash
redis-server
redis-cli ping # should print "PONG"
npm run start
curl http://localhost:8080 # should print "404!"
```
Start iOS
```bash
react-native run-ios
```
