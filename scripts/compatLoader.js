PAGE_PROG.registerSection({

  id: "compatibility",
  element: "sectionCompatibility",

  template: [
    "<h1>Compatibility</h1>",
    "{{#compat}}",
      "<div class='compatEntryHeader'>{{name}}</div>",
      "<div class='compatEntry'>{{> entries}}</div>",
    "{{/compat}}",

    "<div class='linkCompa'><a href='{{compat_link}}'>Report Compatibility</a></div>"
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
