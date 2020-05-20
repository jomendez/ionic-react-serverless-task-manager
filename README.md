# Serverless Task Manager


## How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `task-manager-client/src/config.ts` file to set correct parameters. And then run the following commands

```
cd task-manager-client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Task manager application.

# Remove serverless App

`serverless remove --stage dev --region us-east-1`


# Note

If you receive a node error complaining about memory `JavaScript heap out of memory`, you can use the following command to extend the nodejs memory 
```
export NODE_OPTIONS=--max-old-space-size=8192
```
