
function cool(value){

  // Attacking values
  var ahp = parseInt(document.getElementById("ahp").value);
  var ats = parseInt(document.getElementById("ats").value);
  var abd = parseInt(document.getElementById("abd").value);
  var aav = parseInt(document.getElementById("aav").value);
  var adv = parseInt(document.getElementById("adv").value);
  var anl = parseInt(document.getElementById("anl").value);
  var apl = parseInt(document.getElementById("apl").value);

  // Defending values
  var dhp = parseInt(document.getElementById("dhp").value);
  var dts = parseInt(document.getElementById("dts").value);
  var dbd = parseInt(document.getElementById("dbd").value);
  var dav = parseInt(document.getElementById("dav").value);
  var ddv = parseInt(document.getElementById("ddv").value);
  var dnl = parseInt(document.getElementById("dnl").value);
  var dpl = parseInt(document.getElementById("dpl").value);

  // The fields
  var aw2dmgbase = document.getElementById("aw2dmgbase");
  var aw2dmgmin = document.getElementById("aw2dmgmin");
  var aw2dmgmax = document.getElementById("aw2dmgmax");
  var aw4dmgbase = document.getElementById("aw4dmgbase");
  var aw4dmgmin = document.getElementById("aw4dmgmin");
  var aw4dmgmax = document.getElementById("aw4dmgmax");
  var cwtdmgbase = document.getElementById("cwtdmgbase");
  var cwtdmgmin = document.getElementById("cwtdmgmin");
  var cwtdmgmax = document.getElementById("cwtdmgmax");

  // For testing
  console.log("----------")
  console.log("abd"+abd)
  console.log("aav"+aav)
  console.log("anl"+anl)
  console.log("ahp"+ahp)
  console.log("ddv"+ddv)
  console.log("dts"+dts)
  console.log("dhp"+dhp)
  console.log("----------")
  console.log(abd * (ahp / 10) * aav)
  console.log((ddv+dts*dhp))
  console.log("----------")

  // The Formula
  var aw2base = (((abd*aav)/100)) * (ahp/10) * ((200-(ddv+dts*dhp))/100)
  var aw2min = (((abd*aav)/100)+anl) * (ahp/10) * ((200-(ddv+dts*dhp))/100)
  var aw2max = (((abd*aav)/100)+apl) * (ahp/10) * ((200-(ddv+dts*dhp))/100)

  var aw4base = ((abd*(ahp/10)*aav)/(ddv+dts*dhp))
  var aw4min = (((abd+anl)*(ahp/10)*aav)/(ddv+dts*dhp))
  var aw4max = (((abd+apl)*(ahp/10)*aav)/(ddv+dts*dhp))

  // Error Checking
  if (aw2base < 0){
    aw2base = 0;
  }
  if (aw2min < 0) {
    aw2min = 0;
  }
  if (aw2max < 0) {
    aw2max = 0;
  }

  // CWT formula
  var cwtbase = (aw2base+aw4base)/2
  var cwtmin = (aw2min+aw4min)/2
  var cwtmax = (aw2max+aw4max)/2

  // Display the values
  aw2dmgbase.innerHTML = parseInt(aw2base)+"%";
  aw2dmgmin.innerHTML = parseInt(aw2min)+"%";
  aw2dmgmax.innerHTML = parseInt(aw2max)+"%";

  aw4dmgbase.innerHTML = parseInt(aw4base)+"%";
  aw4dmgmin.innerHTML = parseInt(aw4min)+"%";
  aw4dmgmax.innerHTML = parseInt(aw4max)+"%";

  cwtdmgbase.innerHTML = parseInt(cwtbase)+"%";
  cwtdmgmin.innerHTML = parseInt(cwtmin)+"%";
  cwtdmgmax.innerHTML = parseInt(cwtmax)+"%";
}
