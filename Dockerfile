FROM node:19.7.0-slim

COPY front-end /app/front-end/
WORKDIR /app/front-end

RUN npm install
RUN npm ci
RUN npm run build
RUN ls -a 

WORKDIR /app
# Step 3 - copy the frontend to app/public
WORKDIR /app
RUN mkdir public
RUN ls -a
COPY /app/front-end/build /app/public

# Step 3 - Copy npm dependencies
COPY package.json /app/package.json
COPY .babelrc /app/.babelrc
COPY .eslintrc.js /app/.eslintrc.js
COPY ecosystem.config.js /app/ecosystem.config.js
COPY eu-west-1-bundle.pem /app/eu-west-1-bundle.pem
# Step 3 - Install dependencies
RUN npm install
RUN npm ci
# Copy app source code and build Backend
COPY server /app/server
RUN npm run build

#Expose port and start application
EXPOSE 3001
CMD ["npm", "run", "server"]
