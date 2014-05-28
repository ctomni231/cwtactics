(function(){

  var aEntry = "<div><a "+
      "{{#link}}href='{{link}}'  target='_blank' title='Redirect to document' {{/link}}"+
      "{{^link}}class='disabled'                 title='Coming soon!'         {{/link}}>{{name}}"+
    "</a></div>";

  PAGE_PROG.registerSection({

    id: "manuals",
      element: "sectionManual",

    template: [
      "<h1>Documentation</h1>",

      "{{#documentation_user}}",
        "<div class=\"manualEntry userEntry\">",
          "<div>Users :</div>",aEntry,
        "</div>",
      "{{/documentation_user}}",

      "{{#documentation_modding}}",
        "<div class=\"manualEntry modEntry\">",
          "<div>Modders :</div>",aEntry,
        "</div>",
      "{{/documentation_modding}}",

      "{{#documentation_dev}}",
        "<div class=\"manualEntry devEntry\">",
          "<div>Developers :</div>",aEntry,
        "</div>",
      "{{/documentation_dev}}"
    ].join(""),

    partials:{},

    after: function(){
      $('#sectionManual a[title]').qtip({
              position: { my: 'left middle', at: 'right middle' },
              style:    { classes: 'qtip-bootstrap' }
      });
    }
  });

})();
