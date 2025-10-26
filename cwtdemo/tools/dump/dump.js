

// ----------------------
// GARBAGE DATA - JSON
// ----------------------

export function loadMap() {
  addFile(url);
  cwtmaplib.data = getJSON(0);

  console.log(cwtmaplib.data);

  //console.log(JSON.parse(cwtmaplib.data));
}

// Pulled this from Geek for Geeks
function fetchJSONData(urldata) {
  fetch(urldata)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Failed to fetch data:', error));

}

const fetchJson = async (urldata) => {
   try {
     const data = await fetch(urldata);
     const response = await data.json();
     return response;
   } catch (error) {
     console.log(error);
   }
};

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

		json.request = new XMLHttpRequest();
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

export function getJSON(id) {
	if(getFile(id) === undefined)
		return undefined
	return JSON.parse(getFile(id));
}

export function removeAllFiles(){
	json.data = [];
}

function storeFile(request) {
	if(request.readyState == 4){
      if(request.status == 200 || request.status == 304){
				let data = request.responseText;
        json.data.push(data);
      }
	}

	// This is queueNext, if ever needed
	json.busy = 0;
	if(json.queue.length > 0){
		addFile(json.queue.shift());
	}
}
