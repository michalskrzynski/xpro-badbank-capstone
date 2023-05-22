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