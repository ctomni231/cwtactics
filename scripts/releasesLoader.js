PAGE_DESC.fillReleaseSection = function( target ){
  
  var partials = {
    textBlock: "{{#text}}<p>{{{.}}}</p>{{/text}}",
    changeLog: "{{#changelog}}<li class=\"changelog\">{{{.}}}</li>{{/changelog}}"
  };
  
  var template = [
    "{{#milestones}}",
      "<table>",  
    
        "<thead>",
          "<tr>",
            "<td>",
              "{{header}} <span class=\"version\">{{version}}</span>",
              "</br>",
              "<span class=\"subdesc\"> {{subHeaderT}} {{subHeaderB}} </span>",
              "</br>",
              "<p class=\"buttonLink\"> <a class=\"play\" href=\"{{link}}\" target=\"_blank\">Play It</a> </p>",
            "</td>",
            "<td> {{#img}} <img src=\"{{img}}\" /> {{/img}} </td>",
          "</tr>",
        "</thead>",
        
        "<tbody>",
          "<tr> <td colspan=\"2\"> {{> textBlock}} </td> </tr>",
          "<tr> <td colspan=\"2\"> <p class=\"changelogBox\">",
            "<span>Changelog:</span>",
            "<ul>",
              "{{> changeLog}}",
            "</ul>",
          "</p> </td> </tr>",
        "</tbody>",
        
      "</table>",
    "{{/milestones}}"
  ].join("");
  
  var mEl = document.createElement("div");
  mEl.innerHTML = Mustache.render( template, PAGE_DATA, partials );
  target.appendChild( mEl );
};