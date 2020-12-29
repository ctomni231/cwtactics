
/* ajax.js
 *
 * This is a module for performing XMLHTTPRequest and getting JSON files and
 * text files.
 */

// This is the way to access the functions
export const ajax = {
  request: undefined,
  resp: undefined,
  objt: undefined,
  list: [],

  urlArray: [],
  textArray: [],
  jsonArray: [],
  textReady: [],

  textQueue: [],
  busy: 0

}

// Put a filename in here, and wait
export function request(url){

	//This function has to be here to keep data integrity
	if(ajax.busy == 1){
		ajax.textQueue.push(url);
		return;
	}

  // If it exists already, don't do it at all
  if(ajax.urlArray.includes(url))
    return;

	ajax.busy = 1;

  // First, add things to the class
  ajax.urlArray.push(url);
  ajax.textArray.push("");
  ajax.jsonArray.push(JSON.parse("{}"));
  ajax.textReady.push(0);

  // Then, send the getRequest
  httpRequest("GET", url, true, "");
}

// Uses a URL reference to get the text
export function getRefText(url){
  return getText(getRefIndex(url));
}

// Uses a URL reference to get the Json Object
export function getRefJson(url){
  return getJson(getRefIndex(url));
}

// Uses a URL reference to check if a request has been fulfilled
export function isRefReady(url){
  return isReady(getRefIndex(url));
}


// Gets the url from the ajax object, or -1 if it doesn't exist
export function getRefIndex(url){
  for(let i = 0; i < ajax.urlArray.length; i++){
		if(ajax.urlArray[i] == url)
        return i;
	}
	return -1
}

// Gets the text from the httpRequestObject
export function getText(ind) {
  return isReady(ind) ? ajax.textArray[ind] : "";
}

// Gets the json from the ajax object
export function getJson(ind) {
  return isReady(ind) ? ajax.jsonArray[ind] : JSON.parse("{}");
}

// Gets the URL from an index
export function getUrl(ind) {
  return (ind < ajax.urlArray.length) ? ajax.urlArray[ind] : -1;
}

// Checks to see if a function is ready
export function isReady(ind) {
  return (ajax.textReady[ind] === 1);
}

// CLears all references from the lineup
export function removeAll(){
  ajax.urlArray = [];
  ajax.textArray = [];
  ajax.jsonArray = [];
  ajax.textReady = [];
}

// Generates a list of items from a JSON Object
export function generateList(json){
  ajax.list = [];
  return listGroup(json, 0);
}

// The heart and soul of generate List
// Loops through everything and makes a list
function listGroup(objt, level){

  Object.keys(objt).forEach( function(key) {

    var value = objt[key];

    if(typeof value === "object"){

      if(Array.isArray(value)){
        ajax.list.push([key, level, "array", value]);
      }else{
        ajax.list.push([key, level, typeof value, Object.keys(value)]);
        listGroup(value, level+1);
      }
    }else{
      ajax.list.push([key, level, typeof value, value]);
    }

  });

  return ajax.list;
}

// A wrapper function for drawing the next image since the calls are getting numerous
function queueNext(){
	ajax.busy = 0;
	if(ajax.textQueue.length > 0)
		addRequest(ajax.textQueue.shift());
}



// ----------------------
// AJAX Communication
// ----------------------

function handleResponse(){
	if(ajax.request.readyState == 4){
		if(ajax.request.status == 200){

      // --------------------
      // JSON response setup
      // --------------------

      //request.responseText (Gets the response from the server and does something...)
			ajax.resp = ajax.request.responseText;
			//Makes a function out of the JSON object
			var func = new Function("return "+ajax.resp);
      // Change into global if dealing with ajax, and check for null
			ajax.objt = func();

      // Store all the functions into the array before starting another one
      ajax.textArray[ajax.textArray.length-1] = ajax.resp;
      ajax.jsonArray[ajax.jsonArray.length-1] = ajax.objt;
      ajax.textReady[ajax.textReady.length-1] = 1;

		}else
      console.log("A problem occurred with communicating between " +
					       "the XMLHttpRequest object and the server program.");
	}//end outer if...
  queueNext();
}

// -------------------------
// Server Functionality
// -------------------------

//The code under here is the AJAX transaction code
//Make sure to include a handleResponse somewhere...

// Wrapper on Wrapper on Wrapper code
// Further simplifies the AJAX code to handle GET and POST requests
// In one quick and dirty function
export function quickRequest(reqType, url, urlFrag, asynch){
  // The actual request
  if(reqType.upper() == "POST")
    httpRequest("POST", url, asynch, urlFrag);
  else
    httpRequest("GET", url+"?"+urlFrag, asynch, null);
}

/* Initialize a request object that is already constructed
Parameters:
	reqType: the HTTP request type, such as GET or POST
	url: The URL of the server program
	isAsynch: Whether to send the data asynchronously or not */
function initReq(reqType, url, isAsynch, send){
	//Specify the function that will handle the HTTP response
	ajax.request.onreadystatechange = handleResponse;
	ajax.request.open(reqType, url, isAsynch);
	// Set the Content-Type header for a POST request
	ajax.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	ajax.request.send(send);
}

/* Wrapper function for constructing a request object
Parameters:
	reqType: the HTTP request type, such as GET or POST
	url: The URL of the server program
	asynch: Whether to send the data asynchronously or not */
function httpRequest(reqType, url, asynch, send){
	//Mozilla-based browsers
	if(window.XMLHttpRequest){
		ajax.request = new XMLHttpRequest();
	}else if(window.ActiveXObject){
		ajax.request = newActiveXObject("Msxml2.XMLHTTP");
		if(!ajax.request)
			ajax.request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(ajax.request)
		initReq(reqType, url, asynch, send);
	else
		console.log("There is a problem with the AJAX features in your browser");
}
