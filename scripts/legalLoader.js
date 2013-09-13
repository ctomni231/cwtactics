PAGE_PROG.registerSection({
  
  id: "legals",
  name: "Legal Notice",
  
  element: "sectionLegal",
  
  template: [
    "{{#legals}}",
      "<div class=\"legalEntry\" >",
        "<span class=\"legalEntryHeader\" >",
          "{{#link}}<a href=\"{{link}}\" target=\"_blank\">{{header}}</a>{{/link}}",
          "{{^link}} {{header}} {{/link}}",
        "</span>",
        "</br>",
        "<span>{{> textBlock}}</span>",
      "</div>",
    "{{/legals}}"
  ].join(""),
      
  partials:{
    textBlock: "{{#text}}<p class=\"legalEntryTextBlock\">{{{.}}}</p>{{/text}}"
  }
});