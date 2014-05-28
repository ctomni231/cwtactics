PAGE_PROG.registerSection({
  
  id: "navigation",
  name: "",
  
  element: "sectionNavbar",
  
  template: [
    "<ul class='navigationBar'>",
      "{{#navbarLinks}}",
        "<li class=\"{{#class}}{{class}}{{/class}}\">",
          "<span>",
            "<a target='_self' href='{{section}}'>{{name}} <span>&#160; &#10148;</span></a>",
          "</span>",
        "</li>",
      "{{/navbarLinks}}",
    "</ul>"
  ].join(""),
      
  partials:{}
});