import { connect } from "../database";

export const getProducts = async (req, res) => {
	const connection = await connect();
	const [rows] = await connection.query(
		"SELECT product_id as id ,product_name as product, product_price as price FROM products WHERE product_status = true"
	);
	//console.log(rows);
	res.json(rows);
};

export const getProductsCount = async (req, res) => {
	const connection = await connect();
	const [rows] = await connection.query(
		"SELECT COUNT(*) FROM products WHERE product_status = true"
	);
	//console.log(rows[0]["COUNT(*)"]);
	res.json(rows[0]["COUNT(*)"]);
};

export const getProduct = async (req, res) => {
	//console.log(req.params.id);
	const connection = await connect();
	const [rows] = await connection.query(
		"SELECT product_name as product, product_price as price FROM products WHERE product_id = ?",
		[req.params.id]
	);
	//console.log(rows[0]);
	res.json(rows[0]);
};

/*export const saveProduct = async (req, res) => {
	const connection = await connect();
	try {
		const [result] = await connection.query(
			"INSERT INTO products(product_name, product_price) VALUES (?,?)",
			[req.body.name, req.body.price]
		);
		//console.log(result["insertId"]); //id con el que se registro
		//res.json({
		//id: result.insertId,
		//...req.body,
		//});
		res.send(result.insertId);
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			// Este es el código de error específico para entradas duplicadas.
			res.json(-1);
			res.status(409).json({ error: "Nombre de producto duplicado" });
		} else {
			// Otro tipo de error
			res.json(-2);
			res.status(500).json({ error: "Error interno del servidor" });
		}
		console.log(error.code);
	}
};*/

export const saveProduct = async (req, res) => {
	const connection = await connect();
	try {
		const [existingProduct] = await connection.query(
			"SELECT COUNT(*) AS count FROM products WHERE product_name = ? AND product_status = true",
			[req.body.name]
		);
		if (existingProduct[0].count === 0) {
			const [result] = await connection.query(
				"INSERT INTO products(product_name, product_price) VALUES (?,?)",
				[req.body.name, req.body.price]
			);
			res.json(result.insertId);
		} else {
			res.json(-1);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
};

export const deleteProduct = async (req, res) => {
	const connection = await connect();
	const [result] = await connection.query(
		"DELETE FROM products WHERE product_id = ?;",
		[req.params.id]
	);
	//console.log(result.affectedRows == 1 ? "Borrado" : "No borrado");
	res.sendStatus(204); //Obtener status si ocurrio correctamente
};

export const updateProduct = async (req, res) => {
	//console.log(req.params.id);
	const connection = await connect();
	const [result] = await connection.query(
		"UPDATE products SET ? WHERE product_id = ?",
		[req.body, req.params.id]
	);
	//console.log(result.affectedRows == 1 ? "Actualizado" : "No actualizado");
	res.sendStatus(204); //Obtener status si ocurrio correctamente
};
