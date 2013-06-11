PAGE_PROG.sectionController.registerSection({
  
  id: "links",
  
  element: document.getElementById("sectionLinks"),
    
  template: [
    "<table>",
      "<tbody>",
        "{{#links}}",
          "<tr>",
            "<td>{{name}}</td>",
            "<td>{{desc}}</td>",
            "<td><a href=\"{{link}}\" target=\"_blank\">Visit It</a></td>",
          "</tr>",
        "{{/links}}",
      "</tbody>",
    "</table>"
  ].join(""),
  
  partials:{}
});