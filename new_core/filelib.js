/* Json File Library
 *
 * A library for handling files with helper function for JSON type files
 */

const json = {
	request: undefined,
	busy: 0,
	data: [],
	queue: []
}

export function addFile(fileurl) {

	// This will add things to the queue if things get busy
	if(json.busy == 1){
		json.queue.push(fileurl);
		return;
	}

	json.busy = 1

	// This will get the right object for XMLHttpRequest
	if(window.XMLHttpRequest){
		alert("Gets here")
		json.request = new XMLHttpRequest();
	}else if(window.ActiveXObject){
		json.request = newActiveXObject("Msxml2.XMLHTTP");
		if(!json.request)
			json.request = new ActiveXObject("Microsoft.XMLHTTP");
	}

	if(json.request){


		// Specify the function that will handle the HTTP response
		json.request.onreadystatechange = function(){
			storeFile(this)
		};
		json.request.open("GET", fileurl, true);
		json.request.send();
	}else
		alert("There is a problem with the AJAX features in your browser");
}

export function getFile(id) {
	if(id >= 0 && id < json.data.length){
		return json.data[id]
	}
	return undefined
}

export function getJson(id) {
	if(getFile(id) === undefined)
		return undefined
	return JSON.parse(getFile(id));
}

export function storeFile(request) {
	if(request.readyState == 4){
      if(request.status == 200 || request.status == 304){
				let data = request.responseText;
				alert(JSON.parse(data).up);
        json.data.push(data);
      }
	}

	// This is queueNext, if ever needed
	json.busy = 0;
	if(json.queue.length > 0){
		addFile(json.queue.shift());
	}
}

//export function quickGet(text){
//	var blah, xmlhttp = new XMLHttpRequest();
//	xmlhttp.onreadystatechange = function() {
//	  if (this.readyState == 4 && this.status == 200) {
//	    alert(JSON.parse(this.responseText).select);
//	  }
//	};
//	xmlhttp.open("GET", text, true);
//	xmlhttp.send();
//}

//var xmlhttp = new XMLHttpRequest();
//xmlhttp.onreadystatechange = function() {
//  if (this.readyState == 4 && this.status == 200) {
//    var myObj = JSON.parse(this.responseText);
//    document.getElementById("demo").innerHTML = myObj.name;
//  }
//};
//xmlhttp.open("GET", "json_demo.txt", true);
//xmlhttp.send();
