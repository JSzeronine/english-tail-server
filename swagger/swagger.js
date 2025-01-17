const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'English-tail API',
        description: 'API documentation automatically generated by swagger-autogen.',
    },
    basePath: '/',
    host: 'api.english-tail.com',
    schemes: ['https'],
};

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);