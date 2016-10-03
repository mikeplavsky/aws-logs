FROM node:6.7

RUN npm install serverless@1.0.0-rc.2 -g

RUN npm install serverless-plugin-write-env-vars -g
RUN npm install serverless-run-function-plugin -g
RUN npm install aws-sdk -g

WORKDIR /aws-logs

