PAGE_PROG.sectionController.registerSection({
  
  id: "navigation",
  
  element: document.getElementById("navbar"),
  
  template: [
    "<ul class='navigationBar'>",
      "{{#navbarLinks}}",
        "<li>",
          "<a target='{{#generateTargetType}}{{target}}{{/generateTargetType}}' {{#link}}href=\"{{section}}\" {{/link}} {{^link}}onclick=\"return PAGE_PROG.sectionController.openSection( this, '{{section}}' );\"{{/link}} >",
            "{{name}}",
          "</a>",
        "</li>",
      "{{/navbarLinks}}",
    "</ul>"
  ].join(""),
      
  partials:{}
});