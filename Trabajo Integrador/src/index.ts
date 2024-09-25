import app from "./app";

function main(){
    console.log('Iniciando el servidor...');
	app.listen(4100, ()=>{
		console.log(`Servidor activo en puerto ${4100}`);
	})
}

main();