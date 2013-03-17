PAGE_DESC.fillLegalsSection = function( target ){
  
  var partials = {
    textBlock: "{{#text}}<p>{{{.}}}</p>{{/text}}"
  };
  
  var template = [
    "<table>",
    
      /*
      "<thead>",
        "<tr>",
          "<td>Name</td>",
          //"<td>Used For</td>",
          "<td>Description</td>",
          "<td>Link</td>",
        "</tr>",
      "</thead>",*/
      
      "<tbody>",
        "{{#legals}}",
          "<tr>",
            "<td>{{header}}</td>",
            //"<td>{{subHeaderT}} {{subHeaderB}}</td>",
            "<td>{{> textBlock}}</td>",
            // "<td><p class=\"buttonLink leftSide\"><a href=\"{{link}}\" target=\"_blank\">Homepage</p></td>",
            "<td><a href=\"{{link}}\" target=\"_blank\">Homepage</a></td>",
          "</tr>",
        "{{/legals}}",
      "</tbody>",
    
    "</table>"
  ].join("");
  
  var el = document.createElement("div");
  el.innerHTML = Mustache.render( template, PAGE_DATA, partials );
  target.appendChild(el);
};