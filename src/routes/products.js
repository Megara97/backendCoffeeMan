import { Router } from "express";
import {
	deleteProduct,
	getProduct,
	getProducts,
	getProductsCount,
	saveProduct,
	updateProduct,
} from "../controllers/products";

const router = Router();

//Obtener todos los productos
router.get("/products", getProducts);

//Contar productos
router.get("/products/count", getProductsCount);

//Obtener un producto proporcionando su id
router.get("/products/:id", getProduct);

//Crear un nuevo producto
router.post("/products", saveProduct);

//Borrar un producto
router.delete("/products/:id", deleteProduct);

//Actualizar un producto
router.put("/products/:id", updateProduct);

export default router;
