# Project Title: Bad Bank Capstone

## Description/Motivation: 
The final submission project for my MIT xPro course.
The project is a simple banking application, that enables users to register, login, deposit money, withdraw... and (unusual) see other users.

Initial name "Bad Bank" comes from not having the security control in the V1. Nevertheless, soon it might be rebranded to Good Bank, as abovementioned has been introduced.

## Requirements:
1. AWS services with COGNITO pool configured to allow 'USER_PASSWORD_AUTH'
2. MONGO installed localy (docker instance possible as well) or through Atlas cloud solution

## Installation Guidelines: 

To start the project:
1. `git clone: git@github.com:michalskrzynski/xpro-badbank-capstone.git`
2. once cloned: `npm install`
3. change the `example.env` file name to `.env` and edit it, filling all the environmental variables
4. once all `.env` variables are set properly, run `npm start` 

## Deployment:
1. First copy the production env files from s3 to your local
`s3 cp s3://bad-bank-env/badbank.env .env.production --profile=msk-personal`

Please note you need to have a AWS credentials profile msk-profile to make it.
If you don't have access to that profile, create file .env.production based
on example.env filling all envs on your own.

2. Ensure all envs are correct for you to connect to all assets.
2. Run sh bin/env to export all envs to S3, they will be fetched during the deployment..

## Screenshots:

To be published soon. Cross your fingers.

## Technology used:

### Frontend 
> HTML
> CSS
> BootStrap
> React (generated with: `npx create-react-app`)

### Backend
> Express server (generated with `npx generate-express`)
> AWS Cognito for Authentication

### Persistance Layer
> MongoDB

### Testing
> JEST
> Postman

### Development
> VS Code (with: Emmet, LiveServer, Prettier, Docker)

## Features
| Function | Availability |
| ------ | ------ |
| Create User | Available |
| Login | Available |
| Deposit | Available |
| Withdraw | Available |
| All Users | Available |
| Wire Transfer | To be developed |

## License: 
Project under MIT License.
