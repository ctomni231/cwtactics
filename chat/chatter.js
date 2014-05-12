

//This object only exists to hold the XMLHttpRequest()
var request;
//This is the url to send all the data to
var url = "chatter.pl";
//This holds the stored time
var stored;

window.onload = function(){
	startSession();
	stored = new Date().getTime();
}

//Attempts to track when a user leaves the session
window.onunload = function(){
	deleteUser();
}

//This polls the server every second
function pollServer(){
	var time = new Date().getTime();
	if(time + 1000 > stored){
		getMessage();
		stored = time;
	}
}
 
//This function starts the session for the client computer
function startSession(){
    //encodeURIComponent(obj.value)
	var urlFrag = url + "?type=getID";
	httpRequest("GET", urlFrag, true);
}

function createUser(){
	var code = document.getElementById("code");
	var user = document.getElementById("user");
	var urlFrag = url + "?type=setUser" +
		"&code=" + encodeURIComponent(code.value) +
		"&user=" + encodeURIComponent(user.value);
	httpRequest("GET", urlFrag, true);
}

//Functionality for deleting a user
function deleteUser(){
	var code = document.getElementById("code");
	var user = document.getElementById("user");
	var urlFrag = url + "?type=delUser" +
		"&code=" + encodeURIComponent(code.value) +
		"&user=" + encodeURIComponent(user.value);
	httpRequest("GET", urlFrag, true);
}

//I'm writing the send message functionality for the server systemLanguage
//Almost finished with all of it :)
function sendMessage(){
	var code = document.getElementById("code");
	var user = document.getElementById("user");
	var message = document.getElementById("message");
	var urlFrag = url + "?type=sendChat" +
		"&code=" + encodeURIComponent(code.value) +
		"&user=" + encodeURIComponent(user.value) +
		"&message=" + encodeURIComponent(message.value);
	httpRequest("GET", urlFrag, true);
}

// This gets all messages from the chat log so far
function getMessage(){
	var urlFrag = url + "?type=getChat";
	httpRequest("GET", urlFrag, true);
}

//Event Handler for XMLHttpRequest
function handleResponse(){
	if(request.readyState == 4){
		if(request.status == 200){
			//request.responseText (Gets the response from the server and does something...)
			var resp = request.responseText;
			
			//Makes a function out of the JSON object
			var func = new Function("return "+resp);
			var objt = func();
			
			if(objt.type == "getID"){
				//Gets the data from chat...
				var code = document.getElementById("code");
				code.value = objt.value;
			}else if(objt.type == "setUser"){
				if(objt.error == undefined){
					var login = document.getElementById("login");
					//Two ways of displaying a hidden attribute
					//login.setAttribute("hidden", "hidden");
					login.setAttribute("style", "display:none;");
				
					var chat = document.getElementById("chatBox");
					chat.setAttribute("style", "float:left; border:1px #000 solid; height:500; display:block;");
					
					var users = document.getElementById("users");
					users.innerHTML = " ";
				}else{
					var users = document.getElementById("users");
					users.innerHTML = "<p><span style='color:red;'> " + objt.error + "</span></p>";
				}
			}else if(objt.type == "delUser"){
				var login = document.getElementById("login");
				login.setAttribute("style", "display:block;");
				
				var chat = document.getElementById("chatBox");
				chat.setAttribute("style", "display:none;");
				
				var users = document.getElementById("users");
				if(!(objt.error == undefined)){
					users.innerHTML = "<p><span style='color:red;'> " + objt.error + "</span></p>";
				}else{
					users.innerHTML = "<p><span style='color:red;'>Logout Successful</span></p>";
				}
			}else if(objt.type == "sendChat"){
				//Chat text will now display the real chat data
				var data = document.getElementById("chatText");
				data.innerHTML = objt.getText;
				
				//Clears the message value each time you input something
				var message = document.getElementById("message");
				message.value = "";
				
				var users = document.getElementById("users");
				users.innerHTML = objt.getUsers;
				
			}else if(objt.type == "getChat"){
				//Chat text will now display the real chat data
				var data = document.getElementById("chatText");
				data.innerHTML = objt.getText;
				
				var users = document.getElementById("users");
				users.innerHTML = objt.getUsers;
			}
			 
		}else
			alert("A problem occurred with communicating between " +
					"the XMLHttpRequest object and the server program.");
	}//end outer if...
}

//The code under here is the AJAX transaction code
//Make sure to include a handleResponse somewhere...

/* Initialize a request object that is already constructed
Parameters:
	reqType: the HTTP request type, such as GET or POST
	url: The URL of the server program
	isAsynch: Whether to send the data asynchronously or not */
function initReq(reqType, url, isAsynch){
	//Specify the function that will handle the HTTP response
	request.onreadystatechange = handleResponse;
	request.open(reqType, url, isAsynch);
	// Set the Content-Type header for a POST request
	request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	request.send(null);
}

/* Wrapper function for constructing a request object
Parameters:
	reqType: the HTTP request type, such as GET or POST
	url: The URL of the server program
	asynch: Whether to send the data asynchronously or not */
function httpRequest(reqType, url, asynch){
	//Mozilla-based browsers
	if(window.XMLHttpRequest){
		request = new XMLHttpRequest();
	}else if(window.ActiveXObject){
		request = newActiveXObject("Msxml2.XMLHTTP");
		if(!request)
			request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(request)
		initReq(reqType, url, asynch);
	else
		alert("There is a problem with the AJAX features in your browser");
}

