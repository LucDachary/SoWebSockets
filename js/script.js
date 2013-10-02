ws = null;

function ReadyState(int_val)
{
	switch(int_val)
	{
		case WebSocket.CONNECTING: return "Connexion en cours...";
		case WebSocket.OPEN : return "Connecté !";
		case WebSocket.CLOSING : return "Déconnexion en cours...";
		case WebSocket.CLOSED : return "Déconnecté.";
	}
}

function Log(str, class_attr)
{
	var list = document.getElementById("operations");
	var li = document.createElement("li");
	if(class_attr !== undefined)
		li.setAttribute("class", class_attr);
	li.innerHTML = str;

	list.insertBefore(li, list.firstChild);
}

/*
 * Creates a new WebSocket and try to open a connection with uri.
 */
function Connect(uri)
{
	if(null !== ws)
	{
		Log("Vous êtes déjà connecté.", "websocketerror");
		return;
	}

	try
	{
		//Assurons-nous que la classe WebSocket existe sur notre navigateur
		if(!window.WebSocket)
			throw "Impossible d'utiliser WebSocket. Votre navigateur ne l'implémente pas.";

		Log("Tentative de connexion à " + uri);
		ws = new WebSocket(uri);

		if(undefined === ws)
			throw "Impossible de créer un point de sortie.";

		Log(ReadyState(ws.readyState), "websocketstatus");

		ws.onopen = function()
		{
			Log(ReadyState(ws.readyState), "websocketstatus");
		}

		ws.onclose = function(e)
		{
			Log(ReadyState(ws.readyState), "websocketstatus");
			if(e.wasClean)
			{
				Log("Connexion proprement terminée.", "websocketstatus");
			}
			else
			{
				Log(e.reason, "websocketerror");
				Log("Connexion terminée.", "websocketstatus");
			}
			ws = null;
		}

		ws.onerror = function(e)
		{
			Log("Une erreur est survenue.", "websocketerror");
		}

		ws.onmessage = function(e)
		{
			Log("reçu&nbsp;&nbsp;> " + e.data, "websocketmsg");
		}
	}
	catch(str)
	{
		Log(str, "websocketerror");
	}
}

/**
 * \brief Ensures the form is ready to be sent.
 * \param f The form.
 * \return bool .
 */
function control(f)
{
	if(0 === f.msg.value.length)
	{
		Log("Vous n'avez rien saisi...", "websocketerror");
		return false;
	}
	else
		return true;
}

/*
 * Ends the connection on ws.
 * This function only calls WebSocket.close() method. It may take a few moments
 * until the connection is really closed.
 */
function Close()
{
	if(null === ws)
	{
		Log("Vous n'êtes pas connecté.", "websocketerror");
		return;
	}
	ws.close();
	Log(ReadyState(ws.readyState), "websocketstatus");
}

/**
 * \brief Send the text provided on the HTML form input.
 */
function Send()
{
	if(null === ws)
	{
		Log("Vous n'êtes pas connecté.", "websocketerror");
		return;
	}

	var f = document.forms["send_message"];
	if(!f)
	{
		console.log("Impossible de trouver le formulaire. Envoi annulé.");
		return;
	}

	ws.send(f.msg.value);
	Log("envoyé> " + f.msg.value, "websocketmsg");
}

var f = document.forms["send_message"];
if(!f)
{
	Log("Impossible de trouver le formulaire. Arrêt.");
}
f.msg.focus();

Connect("ws://echo.websocket.org");
