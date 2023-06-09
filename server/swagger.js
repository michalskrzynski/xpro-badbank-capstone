const swaggerJSDoc = require('swagger-jsdoc');


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BadBank API',
      version: '1.0.0',
      description: 'API documentation for BadBank api',
    },
    servers: [
      {
        url: process.env.PUBLISH_URL, // Update the URL according to your server configuration
      },
    ],
  },
  apis: ['./server/routes/*.js'], // Path to your API routes folder
};


const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;