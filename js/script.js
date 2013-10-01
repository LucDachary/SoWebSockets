try
{
	//Assurons-nous que la classe WebSocket existe sur notre navigateur
	if(!window.WebSocket)
		throw "Impossible d'utiliser WebSocket. Votre navigateur ne l'implémente pas.";

	var host = "192.168.0.254";
	var host = "raspi.firefoxsupport.net";
	var port = 12345;
	var target = "/websocket/php/test.php";
	
	var url = "ws://" + host + ":" + port + target;
	//DEV
	console.log("Tentative de connexion à ");
	console.log(url);
	var ws = new WebSocket(url);

	if(undefined === ws)
		throw "Impossible de créer un point de sortie.";

	ws.onopen = function()
	{
		console.log("La communication est établie !");
	}
}
catch(str)
{
	console.log("Erreur inattendue : " + str);
}
