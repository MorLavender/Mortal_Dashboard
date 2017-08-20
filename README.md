# Mortal_Dashboard
Monitor Dashboard

<B>How To satrt?</B>
1. Run `git clone` 
2. set the below params on your linux machine:

<p>`set PROXY_URL=http://<your_network_proxy>:8080`
`set http_proxy=$PROXY_URL`
`set https_proxy=$PROXY_URL`
`set HTTP_PROXY=$PROXY_URL`
`set HTTPS_PROXY=$PROXY_URL`<\p>
3. Run the below script
`#!/bin/bash`
`export NVM_DIR="/root/.nvm"`
`[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm`

`nvm use 6.9.5`
`#npm install -g forever`

`echo NPM INSTALL`

`cd server`
`npm install`

`cd ui`
`npm install`
`npm run build:prod`

4.Run the below script
`#!/bin/bash`
`echo Start Server`

`export NODE_ENV=production`
`cd server`
`npm run restart`

6.You are ready to go!good luck!
