import { Router } from "express";
import {
	getCommandDetails,
	getCommandsCount,
	getCommands,
	saveCommand,
	deleteCommand,
	updateCommand,
} from "../controllers/commands";

const router = Router();

//Obtener todos lss comandas
router.get("/commands", getCommands);

//Contar comandas
router.get("/commands/count", getCommandsCount);

//Obtener una comanda proporcionando su id
router.get("/commands/:id", getCommandDetails);

//Crear una nuevo comanda
router.post("/commands", saveCommand);

//Borrar una comanda
router.delete("/commands/:id", deleteCommand);

//Actualizar un comanda
router.put("/commands/:id", updateCommand);

export default router;
