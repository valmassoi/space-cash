# space-cash

## Setup
Install
```bash
yarn install # npm i yarn -g (if you don't have it)
brew install redis nvm
nvm install 6.10.3
```
Start
```bash
redis-server
redis-cli ping # should print "PONG"
npm run start
curl http://localhost:8081 # should print "404!"
```
