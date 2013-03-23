PAGE_PROG.sectionController.registerSection({
  
  id: "links",
  
  element: document.getElementById("sectionLinks"),
  
  template: [
    "<ul>",
      "{{#links}}",
        "<li>",  
            "<p class='buttonLink middleSide'>",
                "<a href='{{link}}' target='_blank'>",
                  "{{> aComplex}}",
                "</a>",
            "</p>",
        "</li>",
      "{{/links}}",
    "</ul>"
  ].join(""),
      
  partials:{
    aComplex: "<span>{{name}}</span> <span>{{desc}}</span>"
  }
});