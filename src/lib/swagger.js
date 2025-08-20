import swaggerJsdoc from "swagger-jsdoc";


import path from "path";

export const swaggerSpec = swaggerJsdoc({
     definition: {
          openapi: "3.0.3",
          info: {
               title: "Api Tempête de Métal Russe",
               version: "1.0.0",
               description: "Documentation API",
          },
     },
     apis: [
         path.resolve(process.cwd(), "src/app/api/**/*.ts"),
     ],
});
