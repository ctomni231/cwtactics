neko.define("nekoJSON",function(){

   if( typeof JSON === 'undefined' ||
       typeof JSON.stringify === 'undefined' ||
       typeof JSON.parse === 'undefined'){

       throw new Error("nekoJSON needs the original JSON parser in JSON var");
   }

   return{
       stringify : JSON.stringify,
       parse : JSON.parse
   }
});