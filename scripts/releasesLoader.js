  PAGE_PROG.releaseSelected = -1;
  
  PAGE_PROG.releases = null;

  PAGE_PROG.updateReleaseBox = function( mode ){
    if( !PAGE_PROG.releases ){
      PAGE_PROG.releases = document.getElementsByName("releaseBlock");
    }
    
    if( PAGE_PROG.releaseSelected !== -1 ){ 
      PAGE_PROG.releases[PAGE_PROG.releaseSelected].className="hidden"; 
    } 
    else PAGE_PROG.releaseSelected = 0;
      
    if( mode === -1 && PAGE_PROG.releaseSelected > 0 ) PAGE_PROG.releaseSelected--;
    if( mode === +1 && PAGE_PROG.releaseSelected < PAGE_PROG.releases.length-1 ) PAGE_PROG.releaseSelected++;
      
    PAGE_PROG.releases[PAGE_PROG.releaseSelected].className="visible"; 
  };

  PAGE_PROG.registerSection({
    
    id: "releases",
    name: "Releases",
    
    element: "sectionRelease",
    
    template: [
      
      // controls
      "<div class=\"releaseNav\" >",
        "<a class=\"releaseNavBt\" href='#' onClick='PAGE_PROG.updateReleaseBox(+1); return false;' > \<\< Older Releases -</a>",
        "<a class=\"releaseNavBt\" href='#' onClick='PAGE_PROG.updateReleaseBox(-1); return false;' >- Newer Releases \>\></a>",
      "</div>",
      
      // content
      "{{#milestones}}",
        "<table id='{{header}}-{{version}}' name='releaseBlock' class='hidden'>",  
          "<thead>",
            "<tr>",
              "<td colspan=\"2\">",
                "<span class=\"releaseDesc\">{{header}} {{version}}</span>",
                "</br>",
                "<span class=\"releaseDesc\"> {{subHeaderT}} {{subHeaderB}} </span>",
              "</td>",
            "</tr>",
            "<tr>",
              "<td  colspan=\"2\" class=\"releaseImg\">",
                "{{#img}} <img src=\"{{img}}\" /> {{/img}}",
                "<p class=\"buttonLink\">{{#link}}<a class=\"play\" href=\"{{link}}\" target=\"_blank\">Play It</a>{{/link}}</p>",
              "</td>",
            "</tr>",
          "</thead>",
          
          "<tbody>",
            "<tr> <td colspan=\"2\"> {{> textBlock}} </td> </tr>",
      /*
            "<tr> <td colspan=\"2\"> <p class=\"changelogBox\">",
              "<span>Changelog:</span>",
              "<ul>",
                "{{> changeLog}}",
              "</ul>",
            "</p> </td> </tr>",
      */
      
            "<tr>",
              "<td colspan=\"2\">",
                "<p class=\"changelogBox\"><span>Changelog:</span> </p>",
              "</td>",
            "</tr>",
            "{{> changeLog}}",
          "</tbody>",
          
        "</table>",
      "{{/milestones}}"
      
    ].join(""),
    
    partials:{
      textBlock: "{{#text}}<p>{{{.}}}</p>{{/text}}",
      changeLog: "{{#changelog}}<tr class=\"changelog\"><td class=\"changelogLeft\">→</td><td>{{{.}}}</td></tr>{{/changelog}}"
    }
  });
