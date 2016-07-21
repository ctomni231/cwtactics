var CW = window.CW || (window.CW = {});

(function() {

  // String -> Promise
  const jsonIO = (path) => new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.onreadystatechange = () => {
      if (request.readyState == 4) {
        if (request.status == 200) {
          try {
            resolve(JSON.parse(request.responseText));
          } catch (error) {
            reject("JSONException: " + error);
          }
        } else {
          reject(request.statusText);
        }
      }
    };

    request.open("get", path + (path.indexOf("?") < 0 ? "?" : "&") + (parseInt(Math.random() * 100000, 10)), true);
    request.send();
  });

  // (String) -> Promise
  const cachedJsonIO = (path) => new Promise((resolve, reject) =>
    localforage
    .getItem(path)
    .then(value => {
      if (value == null) {
        jsonIO(path)
          .then(data => localforage.setItem(path, data))
          .then(data => resolve(data));
      } else {
        resolve(value);
      }
    })
    .catch(function(err) {
      reject(err);
    }));

}());