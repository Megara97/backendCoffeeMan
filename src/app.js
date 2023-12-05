import express from "express";
import productsRoutes from "./routes/products";
import commandsRoutes from "./routes/commands";
import cors from "cors";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
const options = {};

const app = express();

app.use(cors()); //para que cualquier aplicaciòn de backend pueda conectarse (para desarrollo)
app.use(morgan("dev")); //ver en consola las peticiones que lllegan
app.use(express.json());
app.use(productsRoutes);
app.use(commandsRoutes);

export default app;
