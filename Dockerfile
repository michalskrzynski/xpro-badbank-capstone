FROM node:16.0.0-slim

# Step 1 - Add container working directory
WORKDIR /app/front-end

# Step 2 - copy and compile front-end
COPY front-end /app/front-end
WORKDIR /app/front-end
RUN npm install
RUN npm run build

WORKDIR /app

# Step 3 - Copy npm dependencies
COPY package.json /app/package.json
COPY .babelrc /app/.babelrc
COPY .eslintrc.js /app/.eslintrc.js
# Step 3 - Install dependencies
RUN npm install
# Copy app source code
COPY server /app/server
COPY front-end/build /app/public

#Expose port and start application
EXPOSE 3001
CMD ["npm", "start"]


#outside needs to be deployed with --platform=linux/amd64