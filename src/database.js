import mysql from "mysql2/promise";
import { config } from "./config";

//La conexion es asincrona, debemos usar promesas o callbacks y mysql2 permite usar promesas, por lo tanto podemos usar async await
export const connect = async () => {
	return await mysql.createConnection(config);
	//const [rows] = await conn.query("SELECT 1+1");
	//console.log(rows);
};
