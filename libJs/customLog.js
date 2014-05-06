if (window.console) window.console = {};

(function (console) {
  var container = document.createElement("div");

  container.id = "customLogPanel";

  container.style.position = "absolute";
  container.style.display = "block";
  container.style.left = "5px";
  container.style.top = "5px";
  container.style.width = "50%";
  container.style.height = "50%";
  container.style.overflow = "hidden";
  container.style.color = "white";
  container.style.fontWeight = "bold";
  container.style.backgroundColor = "rgba(0,0,0,0.3)";
  container.style.border = "1px solid black";
  container.style.padding = "2px";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";

  document.getElementsByTagName("body")[0].appendChild(container);

  window.console.toggle = function () {
    container.style.display = (container.style.display === "block")? "none" : "block";
  };

  window.console.log = function (msg) {
    var el = document.createElement("p");
    el.innerHTML = " INFO:: "+msg;

    el.style.margin = "0";

    container.insertBefore(el,container.children[0]);

  };

  window.console.error = function (msg, where) {
    var el = document.createElement("p");
    el.innerHTML = "ERROR:: "+msg+((where)? "<br/>[at: "+where+"]" : "");

    el.style.color = "red";
    el.style.margin = "2";

    container.insertBefore(el,container.children[0]);
  };

})(window.console);