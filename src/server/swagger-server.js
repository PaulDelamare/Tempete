import swaggerUi from "swagger-ui-express";
import express from "express";
import { swaggerSpec } from "../lib/swagger.js";

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Autres routes et configuration ici

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.info(`Swagger UI disponible sur http://localhost:${PORT}/api-docs`);
});
