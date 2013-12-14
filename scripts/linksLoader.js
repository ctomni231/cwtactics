PAGE_PROG.registerSection({
  
  id: "links",
  name: "Links",
  
  element: "sectionLinks",
  
  template: [
    "<div id=\"shortLinksBarP\" >",
      "<ul id=\"shortLinksBar\" >",
        "{{#shortLinks}}",
          "<li>",
            "<a href=\"{{link}}\" ",
               "target=\"_blank\" ",
               "title=\"{{title}}\"><img src=\"{{imgLink}}\" />",
            "</a>",
          "</li>",
        "{{/shortLinks}}",
      "</ul>",
    "</div>"
  ].join(""),
      
  partials:{},

  after: function(){ 
    console.log("YEXY")
    $('#sectionLinks a[title]').qtip({
            position: { my: 'top middle', at: 'bottom middle' },
            style:    { classes: 'qtip-bootstrap' }
    }); 
  }
});