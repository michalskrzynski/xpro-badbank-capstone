FROM node:19.7.0-slim

COPY front-end /app/front-end/
WORKDIR /app/front-end

RUN npm install
RUN npm ci
RUN npm run build 
RUN ls -a 

# Step 3 - symlink to the built frontend
WORKDIR /app
RUN ln -s /app/front-end/build /app/public

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
