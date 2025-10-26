/*
 * JSON Library
 *
 * A class for helping to load in JSON files using the AJAX framework.
 * Also organizes it into an arraylist for easy extraction
 */

export const jsonlib = {

   request: undefined,
   busy: 0,
   tname: "",
   ctype: "application/json",

   fname: [],
   data: [],
   queue: [],
   ready: []
}

// Adds a JSON file to the class
export function addFile(fileurl) {

   // This will add things to the queue if things get busy
   if (jsonlib.busy == 1){
     jsonlib.queue.push(fileurl);
     return;
   }

   jsonlib.busy = 1;
   jsonlib.fname.push(fileurl);

   quickRequest("GET", fileurl, "", true, jsonlib.ctype)
}

// Checks to see if a file is Ready
export function isReady(id=jsonlib.data.length-1) {
  // console.log("JSONLIB", id, jsonlib.fname)
  if ( typeof id === 'string' || id instanceof String )
    id = (isNaN(id) ? jsonlib.fname.indexOf(id) : parseInt(id));
  if ( id >= 0 && id < jsonlib.ready.length )
    return jsonlib.ready[id]
  return 0
}

// Gets the raw file from this class
// You can use the file name or the index ID
export function getFile(id=jsonlib.data.length-1) {
  if ( typeof id === 'string' || id instanceof String )
    id = (isNaN(id) ? jsonlib.fname.indexOf(id) : parseInt(id));
  if ( id >= 0 && id < jsonlib.data.length )
    return jsonlib.data[id]
  return "{}"
}

// Returns a parsed JSON from files
export function getJSON(id=jsonlib.data.length-1){
  return JSON.parse(getFile(id));
}

// ----------------------------------
// PRIVATE FUNCTIONS
// ----------------------------------

// This stores the file into the class
function storeFile(data){

  jsonlib.data.push(data);
  jsonlib.ready.push(1);

  // This is queueNext, if ever needed
  jsonlib.busy = 0;
  if (jsonlib.queue.length > 0)
    addFile(jsonlib.queue.shift());
}


// -------------------------
// GENERIC SERVER CODE
// -------------------------

// Wrapper on Wrapper on Wrapper code
// Further simplifies the AJAX code to handle GET and POST requests
// In one quick and dirty function
function quickRequest(reqType, url, urlFrag="", asynch=true, ctype="application/x-www-form-urlencoded; charset=UTF-8"){
  if(reqType == "POST")
    httpRequest("POST", url, asynch, urlFrag, ctype);
  else{
    url += (urlFrag ? "?"+urlFrag : "")
    httpRequest("GET", url, asynch, null, ctype);
  }
}

// When the response is successful, it will run this function
function respondObj(objt){
  storeFile(objt);
}

// ----------------------
// AJAX Communication
// ----------------------

function handleResponse(){
	if(jsonlib.request.readyState == 4){

    //request.responseText (Gets the response from the server and does something...)
    let resp = "{}"

		if(jsonlib.request.status == 200 || jsonlib.request.status == 304){

      // --------------------
      // JSON response setup
      // --------------------

      //request.responseText (Gets the response from the server and does something...)
			resp = jsonlib.request.responseText;

      // -----------------------
      // Update Functions Here
      // -----------------------
			//setTimeout(runGame, stored);

		}else{
      //alert("A problem occurred with communicating between " +
			//		"the XMLHttpRequest object and the server program.");
      console.log("A problem occurred with communicating between " +
					"the XMLHttpRequest object and the server program.");

      // Let's just push an empty object here
			resp = "{}"

    }

    //Makes a function out of the JSON object
    let func = new Function("return "+resp);
    // Change into global if dealing with ajax, and check for null
    let objt = func();

    // -----------------------
    // JSON Function Response
    // -----------------------
    respondObj(objt);

	}//end outer if...
}

// -------------------------
// BASE SERVER FUNCTIONALITY
// -------------------------

/* Initialize a request object that is already constructed
Parameters:
 	reqType: the HTTP request type, such as GET or POST
 	url: The URL of the server program
 	isAsynch: Whether to send the data asynchronously or not */
function initReq(reqType, url, isAsynch, send, ctype="application/x-www-form-urlencoded; charset=UTF-8"){
 	//Specify the function that will handle the HTTP response
 	jsonlib.request.onreadystatechange = handleResponse;
 	jsonlib.request.open(reqType, url, isAsynch);
 	// Set the Content-Type header for a POST request
 	jsonlib.request.setRequestHeader("Content-Type", ctype);
 	jsonlib.request.send(send);
}

/* Wrapper function for constructing a request object
 Parameters:
 	reqType: the HTTP request type, such as GET or POST
 	url: The URL of the server program
 	asynch: Whether to send the data asynchronously or not */
function httpRequest(reqType, url, asynch, send, ctype="application/x-www-form-urlencoded; charset=UTF-8"){
 	//Mozilla-based browsers
 	if(window.XMLHttpRequest){
 		jsonlib.request = new XMLHttpRequest();
 	}else if(window.ActiveXObject){
 		jsonlib.request = newActiveXObject("Msxml2.XMLHTTP");
 		if(!jsonlib.request)
 			jsonlib.request = new ActiveXObject("Microsoft.XMLHTTP");
 	}
 	if(jsonlib.request)
 		initReq(reqType, url, asynch, send, ctype);
 	else
 		alert("There is a problem with the AJAX features in your browser");
}
