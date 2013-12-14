PAGE_PROG.registerSection({
  
  id: "legals",
  element: "sectionLegal",
  
  template: [
    "<h1>Legal Notice</h1>",

    "{{#legals}}",

      "<div class='legalEntry' >",
        "<div class='legalEntryHeader' >",
          "{{#link}} <a href='{{link}}' target='_blank' ",
                                         "title='Goto Homepage'>{{header}}</a> {{/link}}",
          "{{^link}} {{header}} {{/link}}",
        "</div>",
        "<div class='legalEntryText' >{{> textBlock}}</div>",
      "</div>",

    "{{/legals}}"
  ].join(""),
      
  partials:{
    textBlock: "{{#text}}<p>{{{.}}}</p>{{/text}}"
  },

  after:function(){ 
    $('#sectionLegal a[title]').qtip({
            position: { my: 'right middle', at: 'left middle' },
            style:    { classes: 'qtip-bootstrap' }
    }); 
  }
});