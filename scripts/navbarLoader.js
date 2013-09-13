PAGE_PROG.registerSection({
  
  id: "navigation",
  name: "",
  
  element: "sectionNavbar",
  
  template: [
    "<ul class='navigationBar navigationBarTop'>",
      "{{#navbarLinks}}",
        
          "{{#header}}",
            "<li class=\"{{#class}}{{class}}{{/class}}\">",
              "<span>",
                "{{name}}",
              "</span>",
            "</li>",
          "{{/header}}",
    
          "{{^header}}",
            "<li class=\"{{#class}}{{class}}{{/class}}\">",
              "<a target='{{#link}}{{target}}{{/link}}' href=\"{{section}}\" >",
                "{{name}}",
              "</a>",
              "{{#icon}}<img class=\"iconBox\" src=\"{{icon}}\"></img>{{/icon}}",
            "</li>",
          "{{/header}}",
    
      "{{/navbarLinks}}",
      
      "<li class='highlightedButton gapTop' >",
        "<a target='_self' href='mailto:ctomni231@gmail.com'>Contact Us</a>",
      "</li>",
    
    "</ul>"
  ].join(""),
      
  partials:{}
});