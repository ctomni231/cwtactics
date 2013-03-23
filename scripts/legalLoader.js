PAGE_PROG.sectionController.registerSection({
  
  id: "legals",
  
  element: document.getElementById("sectionLegal"),
  
  template: [
    "<table>",
      "<tbody>",
        "{{#legals}}",
          "<tr>",
            "<td>{{header}}</td>",
            "<td>{{> textBlock}}</td>",
            "<td><a href=\"{{link}}\" target=\"_blank\">Homepage</a></td>",
          "</tr>",
        "{{/legals}}",
      "</tbody>",
    "</table>"
  ].join(""),
      
  partials:{
    textBlock: "{{#text}}<p>{{{.}}}</p>{{/text}}"
  }
});