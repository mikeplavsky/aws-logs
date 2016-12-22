FROM node:6.7

RUN npm install serverless@1.4.0 -g

RUN npm install serverless-plugin-write-env-vars -g
RUN npm install serverless-run-function-plugin -g

RUN npm install aws-sdk -g 
ENV NODE_PATH=/usr/local/lib/node_modules
ENV AWS_REGION=us-east-1

RUN npm -g install js-beautify 

WORKDIR /aws-logs

