PAGE_PROG.sectionController.registerSection({
  
  id: "legals",
  
  element: document.getElementById("sectionLegal"),
  
  template: [
    "<table>",
      "<tbody>",
        "{{#legals}}",
          "<tr>",
            "<td {{#headerAlert}}class=\"headerAlert\"{{/headerAlert}}>{{header}}</td>",
            "<td>{{> textBlock}}</td>",
            "<td>{{#link}}<a href=\"{{link}}\" target=\"_blank\">Homepage</a>{{/link}}</td>",
          "</tr>",
        "{{/legals}}",
      "</tbody>",
    "</table>"
  ].join(""),
      
  partials:{
    textBlock: "{{#text}}<p>{{{.}}}</p>{{/text}}"
  }
});