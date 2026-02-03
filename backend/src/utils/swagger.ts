import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "homemind API",
      version: "1.0.0",
      description:
        "API documentation for homemind chatbot - an AI assistant helping users find their dream homes in Chapel Hill, NC.",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
      contact: {
        name: "Sergio Sediq",
        email: "sediqsergio@gmail.com",
        url: "https://github.com/SergioSediq",
      },
    },
    servers: [
      {
        url: "https://homemind-backend.vercel.app/",
        description: "Production server",
      },
      {
        url: "http://localhost:3001",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // Uncomment below to apply global security to all endpoints
    // security: [
    //   {
    //     bearerAuth: [],
    //   },
    // ],
  },
  apis: [
    "./src/routes/*.ts",
    "./src/routes/*.js",
    "./src/models/*.ts",
    "./src/models/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
