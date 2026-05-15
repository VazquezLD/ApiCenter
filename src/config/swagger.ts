import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ApiCenter REST API",
      version: "1.0.0",
      description: "API para el monitoreo de endpoints y proyectos web",
    },
    servers: [
      {
        url: "/api/v1",
        description: "Servidor Local",
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
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], 
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app: Application, port: string | number) => {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Documentación disponible en http://localhost:${port}/api/v1/docs`);
};