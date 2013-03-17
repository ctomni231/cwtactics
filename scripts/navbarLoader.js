PAGE_DESC.fillNavbarSection = function( target ){
  var template = [
    "<ul class='navigationBar'>",
      "{{#navbarLinks}}",
        "<li>",
          "<a target='{{#generateTargetType}}{{target}}{{/generateTargetType}}' {{#link}}href=\"{{section}}\" {{/link}} {{^link}}onclick=\"return PAGE_PROG.openSection( this, '{{section}}' );\"{{/link}} >",
            "{{name}}",
          "</a>",
        "</li>",
      "{{/navbarLinks}}",
    "</ul>",
  ].join("");
  
  var el = document.createElement("div");
  el.innerHTML = Mustache.render( template, PAGE_DATA );
  target.appendChild(el);
};