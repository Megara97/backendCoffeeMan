import { connect } from "../database";

export const getCommands = async (req, res) => {
	const connection = await connect();
	try {
		const [rows] = await connection.query(
			//"SELECT command_id as id, total, paid_date FROM commands WHERE command_status = true"
			"SELECT command_id as id, total as subtotal, paid_date as date FROM commands"
		);
		//console.log(rows);
		res.json(rows);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
};

export const getCommandsCount = async (req, res) => {
	const connection = await connect();
	try {
		const [rows] = await connection.query("SELECT COUNT(*) FROM commands");
		//console.log(rows[0]["COUNT(*)"]);
		res.json(rows[0]["COUNT(*)"]);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
};

export const getCommandDetails = async (req, res) => {
	//console.log(req.params.id);
	const connection = await connect();
	try {
		// Inicia una transacción
		await connection.beginTransaction();
		const [rowsCommands] = await connection.query(
			"SELECT total as subtotal, tip, method, paid_date as date FROM commands WHERE command_id = ?",
			[req.params.id]
		);
		const [rowsDetails] = await connection.query(
			//"SELECT product_id as id, quantity FROM commandsDetails WHERE command_id = ?",
			"SELECT products.product_name, commandsDetails.product_id, quantity FROM commandsDetails JOIN products ON products.product_id = commandsDetails.product_id WHERE command_id = ?",
			[req.params.id]
		);
		const rows = {
			...rowsCommands[0],
			products: rowsDetails,
		};
		res.json(rows);
	} catch (error) {
		// Si ocurre un error, realiza un rollback para deshacer cualquier cambio realizado durante la transacción
		await connection.rollback();
		console.error(error);
		res.status(500).json({ error: "Error interno del servidor" });
	} finally {
		// Asegúrate de liberar la conexión después de la transacción
		if (connection) {
			await connection.end();
		}
	}
};

export const saveCommand = async (req, res) => {
	const connection = await connect();
	try {
		await connection.beginTransaction();
		const formattedDate = new Date(req.body.date)
			.toISOString()
			.slice(0, 19)
			.replace("T", " ");
		const commandResult = await connection.query(
			"INSERT INTO commands (total, tip, method, paid_date) VALUES (?,?,?,?)",
			[req.body.subtotal, req.body.tip, req.body.method, formattedDate]
		);
		const commandId = commandResult[0].insertId;
		for (const product of req.body.products) {
			await connection.query(
				"INSERT INTO commandsDetails (command_id, product_id, quantity) VALUES (?,?,?)",
				[commandId, product.id, product.quantity]
			);
		}
		await connection.commit();
		res.json(commandId);
	} catch (error) {
		await connection.rollback();
		console.error(error);
		res.status(500).json({ error: "Error interno del servidor" });
	} finally {
		if (connection) {
			await connection.end();
		}
	}
};

export const deleteCommand = async (req, res) => {
	const connection = await connect();
	try {
		await connection.beginTransaction();
		const detailsResult = await connection.query(
			"DELETE FROM commandsDetails WHERE command_id = ?;",
			[req.params.id]
		);
		const commandResult = await connection.query(
			"DELETE FROM commands WHERE command_id = ?;",
			[req.params.id]
		);
		await connection.commit();
		res.status(200).json({ message: "Registros eliminados exitosamente" });
	} catch (error) {
		await connection.rollback();
		console.error(error);
		res.status(500).json({ error: "Error interno del servidor" });
	} finally {
		if (connection) {
			await connection.end();
		}
	}
};

export const updateCommand = async (req, res) => {
	//console.log(req.params.id);
	const connection = await connect();
	try {
		const [result] = await connection.query(
			"UPDATE commands SET ? WHERE command_id = ?",
			[req.body, req.params.id]
		);
		res.status(200).json({ message: "Registros actualizados exitosamente" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error interno del servidor" });
	}
};

/*
export const updateDetails = async (req, res) => {
	//console.log(req.params.id);
	const connection = await connect();
	for (const product of req.body.products) {
		await connection.query(
			"UPDATE commandsDetails SET quantity = ? WHERE command_id = ? AND product_id = ? ",
			[product.quantity, req.params.id, product.id]
		);
	}
	res.status(200).json({ message: "Registros actualizados exitosamente" });
};*/
