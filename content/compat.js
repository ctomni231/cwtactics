PAGE_DATA.compat = [

  { name:"Mobile Safari", data:[
    { version:"iOS5", stat:"warn", info:"No Music" },
    { version:"iOS6", stat:"fine" },
    { version:"iOS7", stat:"fine" }
  ]},

  { name:"Apple Safari", data:[
    { version:"7",     stat:"fine" }
  ]},

  /*
  { name:"Mozilla Firefox", data:[
  ]},

  { name:"Mozilla Firefox Mobile", data:[
  ]},
  */

  { name:"Google Chrome", data:[
    { version:"30",     stat:"fine" }
  ]},

  { name:"Google Chrome Mobile", data:[
    { version:"30",     stat:"fine", info:"Needs a current device. Tested on Nexus 7 (2013)" }
  ]},

  { name:"Internet Explorer", data:[
    { version:"10",     stat:"fine" }
  ]},

];

PAGE_DATA.report_link = "http://battle.customwars.com/report/index.php";

PAGE_DATA.compat_link = "mailto:ctomni231@gmail.com?"+
  "subject="+encodeURIComponent("Compatibility Report")+
  "&body="+encodeURIComponent("Hi I want to give you my compatibility report."+
  "\n "+
  "\n Date: "+
  "\n Used the \"Play CW:T\" button: Yes/No"+
  "\n "+
  "\n Browser: "+
  "\n Browser-Version: "+
  "\n OS: "+
  "\n OS-Version: "+
  "\n "+
  "\n Bugs:"+
  "\n "+
  "\n   1) Situation:"+
  "\n      Expected:"+
  "\n      Fix-Priority (for you):"+
  "\n "+
  "\n Notes / Wishes / Advises:"+
  "\n "+
  "\n "+
  "\n Do you cleared your cache?: Yes/No"+
  "\n "+
  "\n "+
  "\n Greets");
