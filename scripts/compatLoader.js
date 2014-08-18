PAGE_PROG.registerSection({

  id: "compatibility",
  element: "sectionCompatibility",

  template: [
    "<h1>Compatibility</h1>",

    "<div class='linkCompa'>",
      "<a class='uibutton' href='{{report_link}}'>Report Features/Bugs</a>",
    "</div>",

    "{{#compat}}",
      "<div class=\"compatHolder\">",
        "<div class='compatEntryHeader'>{{name}} :</div>",
        "<div class='compatEntry'>{{> entries}}</div>",
      "</div>",
    "{{/compat}}"
  ].join(""),

  partials:{
    entries:"{{#data}}<span class='{{stat}}' {{#info}}title='{{info}}'{{/info}}>{{version}}</span>{{/data}}"
  },

  after: function(){
    $('#sectionCompatibility span[title]').qtip({
            position: { my: 'top middle', at: 'bottom middle' },
            style:    { classes: 'qtip-bootstrap' }
    });
  }
});
