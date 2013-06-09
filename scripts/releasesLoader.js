var sectionRelease_selectBox_selected = null;

PAGE_PROG.sectionController.registerSection({
  
  id: "releases",
  
  element: document.getElementById("sectionRelease"),
  
  template: [
    "<select id='sectionRelease_selectBox' class='sectionReleaseBox' onchange='if(sectionRelease_selectBox_selected){ sectionRelease_selectBox_selected.className=\"hidden\"; } var box = document.getElementById(\"sectionRelease_selectBox\"); sectionRelease_selectBox_selected = document.getElementById(box.value); sectionRelease_selectBox_selected.className=\"visible\"; '>",
      "{{#milestones}}",
        "<option value='{{header}}-{{version}}'>{{header}} {{version}}</option>",
      "{{/milestones}}",
    "</select>",
    "{{#milestones}}",
      "<table id='{{header}}-{{version}}' class='hidden'>",  
        "<thead>",
          "<tr>",
            "<td>",
              "{{header}} <span class=\"version\">{{version}}</span>",
              "</br>",
              "<span class=\"subdesc\"> {{subHeaderT}} {{subHeaderB}} </span>",
              "</br>",
              "<p class=\"buttonLink\">{{#link}}<a class=\"play\" href=\"{{link}}\" target=\"_blank\">Download</a>{{/link}}</p>",
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
  ].join(""),
  
  onopen: function(){
    var box = document.getElementById("sectionRelease_selectBox");
    box.selectedIndex = 0;
    sectionRelease_selectBox_selected = document.getElementById(box.value);
    sectionRelease_selectBox_selected.className = "visible";
  },
  
  partials:{
    textBlock: "{{#text}}<p>{{{.}}}</p>{{/text}}",
    changeLog: "{{#changelog}}<li class=\"changelog\">{{{.}}}</li>{{/changelog}}"
  }
});