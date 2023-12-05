import { config as dotenv } from "dotenv";
dotenv(); //es una funcion que permite leer variables de entorno del archivo.env del proyecto, por si està en un repositorio publico (.env esta en .gitignore)
//console.log(process.env.NICKNAME); //Ejemplo

export const config = {
	host: "localhost", //process.env.DB_HOST,
	user: "root", //process.env.DB_USER,
	password: "1720", //process.env.DB_PASSWORD,
	database: "coffeeman_db", //process.env.DB_DATABASE,
};
