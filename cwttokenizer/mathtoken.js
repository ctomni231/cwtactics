
/* const alpha = Array.from(Array(26)).map((e, i) => i + 65);
const alphabet = alpha.map((x) => String.fromCharCode(x));
const lalpha = Array.from(Array(26)).map((e, i) => i + 97);
const lalphabet = alpha.map((x) => String.fromCharCode(x).toLowerCase());
console.log(lalphabet, alphabet);//*/

function cool(value){

  var val = document.getElementById("val").value;

  var res = document.getElementById("res");
  res.innerHTML = mathToken(val);
}

function mathToken(txtVal){

  let alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let astate = []
  let mathstack = []
  let mlevel = []

  let sym = ['^','**','^=','//','%','^^','__','~~',
             '/','*','-','+',
             '=','==','!=','<','<=','>','>=',
             '|~','|_','|^','|+','|-','|=','|%','|?',
             '|?~','|?_','|?^','|?+','|?-','|?=','|?%']
  let para = ['(',')']
  let ans = 0;


  // Split up the array into tiny pieces
  let txtArr = txtVal.split(" ");

  // Then grab out the legal pieces and put them into an array
  let tmpArr = []
  for (let i=0; i<txtArr.length; i++) {
    if (isNaN(txtArr[i])){
      for (let j=0; j<sym.length; j++){
        if (sym[j] == txtArr[i]){
          tmpArr.push(txtArr[i])
          break;
        }
      }
      for (let j=0; j<para.length; j++){
        if (para[j] == txtArr[i]){
          tmpArr.push(txtArr[i])
          break;
        }
      }
    }else{
      if (txtArr[i])
        tmpArr.push(txtArr[i])
    }
  }

  // Make sure there isn't two numbers or two symbols in a row
  let tmpcount = 0
  let tmpnum = 'a'
  for (let i=0; i<tmpArr.length; i++){
    if (isNaN(tmpArr[i])){
      console.log(tmpArr[i].includes('|'))
      if (!para.includes(tmpArr[i]) && !tmpArr[i].includes('|'))
        tmpcount -= 1
    }else{
      if (tmpnum == 'a')
        tmpnum = tmpArr[i]
      tmpcount += 1
    }
    if (tmpcount == 2 || tmpcount < 0)
      break;
  }
  if (tmpnum == 'a')
    tmpnum = 0

  console.log(tmpcount, tmpArr)

  // Let's turn the illegal into something legal
  let ansArray = []
  if (tmpcount == 0 || tmpcount == 1){

    // Deals with complex equations
    if (tmpArr.includes('(') || tmpArr.includes(')')){

      let level = 0

      for (let i=0; i<tmpArr.length; i++){

        // Deals with open parathesis logic
        if (tmpArr[i] == '('){
          if (level == 0){
            ansArray.push(alpha[astate.length])
            mathstack.push([])
          }else{
            for (let j=astate.length-1; j>=0; j--){
              if (astate[j] == 1){
                mathstack[j].push(alpha[astate.length])
                mathstack.push([])
                break;
              }
            }
          }
          astate.push(1)
          level += 1
          mlevel.push(level)
        }

        // Deals with closed parathesis logic
        else if (tmpArr[i] == ')'){
          if (level > 0){
            for (let j=astate.length-1; j>=0; j--){
              if (astate[j] == 1){
                astate[j] = 0;
                break;
              }
            }
            level -= 1;
          }
        }

        // Just fill numbers normally as you see them
        else {
          if (level > 0){
            for (let j=astate.length-1; j>=0; j--){
              if (astate[j] == 1){
                if (j >= mathstack.length)
                  mathstack.push([])
                mathstack[j].push(tmpArr[i])
                break;
              }
            }
          } else
            ansArray.push(tmpArr[i])
        }

        console.log("ASTATE", astate, level)
      }

      console.log("AnsArray", ansArray)
      console.log("StackArray", mathstack)

      // Now in reverse order, we go through the stack
      for (let i=mathstack.length-1; i>=0; i--){
        for (let j=0; j<mathstack[i].length; j++){
          if (alpha.includes(mathstack[i][j])){
            if (alpha.indexOf(mathstack[i][j]) < mathstack.length)
              mathstack[i][j] = mathstack[alpha.indexOf(mathstack[i][j])][0]
            // This should pop only if you opened a parathesis with nothing
            else
              mathstack[i].pop()
          }
        }
        mathstack[i] = evalArray(sym, mathstack[i])
      }

      for (let i=0; i<ansArray.length; i++){
        if (alpha.includes(ansArray[i])){
          if (alpha.indexOf(ansArray[i]) < mathstack.length)
            ansArray[i] = mathstack[alpha.indexOf(ansArray[i])][0]
          // This should pop only if you opened a parathesis with nothing
          else
            ansArray.pop()
        }
      }

      ansArray = evalArray(sym, ansArray)
      if (ansArray.length > 0)
        ans = ansArray[0]

      console.log("FinalArray", ansArray)
    }

    // Deals with normal equations
    else{
      ansArray = evalArray(sym, tmpArr)
      if (ansArray.length > 0)
        ans = ansArray[0]

      console.log("AnsArray", ansArray)
    }
  }else{
    ans = tmpnum
  }

  return ans
}

function evalArray(sym, tmpArr){

  let ansArray = []
  let pushed = 0

  for (let j=0; j<sym.length; j++){
    ansArray = []
    pushed = 0
    for (let i=0; i<tmpArr.length; i++){
      if (pushed > 0)
        pushed -= 1

      // Basic Arithmetic Functionality
      else if (tmpArr[i] == '+' && sym[j] == '+'){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] += parseFloat(tmpArr[i+1]);
        pushed = 1
      }else if (tmpArr[i] == '-' && sym[j] == '-'){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] -= parseFloat(tmpArr[i+1]);
        pushed = 1
      }else if (tmpArr[i] == '*' && sym[j] == '*'){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] *= parseFloat(tmpArr[i+1]);
        pushed = 1
      }else if (tmpArr[i] == '/' && sym[j] == '/'){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] /= parseFloat(tmpArr[i+1]);
        pushed = 1
      }

      // Advanced Arithmetic Functionality
      else if ((tmpArr[i] == '**' && sym[j] == '**') || (tmpArr[i] == '^' && sym[j] == '^')){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = Math.pow(ansArray[ansArray.length-1], parseFloat(tmpArr[i+1]));
        pushed = 1
      }else if (tmpArr[i] == '//' && sym[j] == '//'){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = Math.pow(ansArray[ansArray.length-1], parseFloat(1/tmpArr[i+1]));
        pushed = 1
      }else if (tmpArr[i] == '^=' && sym[j] == '^='){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = (Math.log(ansArray[ansArray.length-1]) / Math.log(parseFloat(tmpArr[i+1])));
        pushed = 1
      }else if (tmpArr[i] == '%' && sym[j] == '%'){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] %= parseFloat(tmpArr[i+1]);
        pushed = 1
      }else if (tmpArr[i] == '^^' && sym[j] == '^^'){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = Math.max(ansArray[ansArray.length-1], parseFloat(tmpArr[i+1]));
        pushed = 1
      }
      else if (tmpArr[i] == '__' && sym[j] == '__'){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = Math.min(ansArray[ansArray.length-1], parseFloat(tmpArr[i+1]));
        pushed = 1
      }else if (tmpArr[i] == '~~' && sym[j] == '~~'){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = ((ansArray[ansArray.length-1]+parseFloat(tmpArr[i+1]))/2);
        pushed = 1
      }

      // Rounding Logic (at the end only - for now)
      else if (tmpArr[i] == '|~' && sym[j] == '|~')
        ansArray[ansArray.length-1] = Math.round(ansArray[ansArray.length-1]);
      else if (tmpArr[i] == '|^' && sym[j] == '|^')
        ansArray[ansArray.length-1] = Math.ceil(ansArray[ansArray.length-1]);
      else if (tmpArr[i] == '|_' && sym[j] == '|_')
        ansArray[ansArray.length-1] = Math.floor(ansArray[ansArray.length-1]);
      else if (tmpArr[i] == '|+' && sym[j] == '|+')
        ansArray[ansArray.length-1] = Math.abs(ansArray[ansArray.length-1]);
      else if (tmpArr[i] == '|-' && sym[j] == '|-')
        ansArray[ansArray.length-1] = -Math.abs(ansArray[ansArray.length-1]);
      else if (tmpArr[i] == '|=' && sym[j] == '|=')
        ansArray[ansArray.length-1] = Math.log(ansArray[ansArray.length-1]);
      else if (tmpArr[i] == '|%' && sym[j] == '|%')
        ansArray[ansArray.length-1] = ansArray[ansArray.length-1]/100;

      // Random Logic (Quick and Dirty Random Numbers)
      else if (tmpArr[i] == '|?' && sym[j] == '|?')
        ansArray[ansArray.length-1] = ansArray[ansArray.length-1] * Math.random();
      else if (tmpArr[i] == '|?~' && sym[j] == '|?~')
        ansArray[ansArray.length-1] = Math.round(ansArray[ansArray.length-1] * Math.random());
      else if (tmpArr[i] == '|?^' && sym[j] == '|?^')
        ansArray[ansArray.length-1] = Math.ceil(ansArray[ansArray.length-1] * Math.random());
      else if (tmpArr[i] == '|?_' && sym[j] == '|?_')
        ansArray[ansArray.length-1] = Math.floor(ansArray[ansArray.length-1] * Math.random());
      else if (tmpArr[i] == '|?+' && sym[j] == '|?+')
        ansArray[ansArray.length-1] = Math.abs(ansArray[ansArray.length-1] * Math.random());
      else if (tmpArr[i] == '|?-' && sym[j] == '|?-')
        ansArray[ansArray.length-1] = -Math.abs(ansArray[ansArray.length-1] * Math.random());
      else if (tmpArr[i] == '|?=' && sym[j] == '|?=')
        ansArray[ansArray.length-1] = Math.log(ansArray[ansArray.length-1] * Math.random());
      else if (tmpArr[i] == '|?%' && sym[j] == '|?%')
        ansArray[ansArray.length-1] = ((ansArray[ansArray.length-1] * Math.random())/100);

      // Conditional Arithmetic Functionality
      else if (tmpArr[i] == '=' && sym[j] == '='){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = (ansArray[ansArray.length-1] == parseFloat(tmpArr[i+1])) ? 1 : 0;
        pushed = 1
      }else if (tmpArr[i] == '==' && sym[j] == '=='){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = (ansArray[ansArray.length-1] == parseFloat(tmpArr[i+1])) ? 1 : 0;
        pushed = 1
      }else if (tmpArr[i] == '!=' && sym[j] == '!='){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = (ansArray[ansArray.length-1] != parseFloat(tmpArr[i+1])) ? 1 : 0;
        pushed = 1
      }else if (tmpArr[i] == '>' && sym[j] == '>'){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = (ansArray[ansArray.length-1] > parseFloat(tmpArr[i+1])) ? 1 : 0;
        pushed = 1
      }else if (tmpArr[i] == '>=' && sym[j] == '>='){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = (ansArray[ansArray.length-1] >= parseFloat(tmpArr[i+1])) ? 1 : 0;
        pushed = 1
      }else if (tmpArr[i] == '<' && sym[j] == '<'){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = (ansArray[ansArray.length-1] < parseFloat(tmpArr[i+1])) ? 1 : 0;
        pushed = 1
      }else if (tmpArr[i] == '<=' && sym[j] == '<='){
        if (i+1 == tmpArr.length)
          break;
        ansArray[ansArray.length-1] = (ansArray[ansArray.length-1] <= parseFloat(tmpArr[i+1])) ? 1 : 0;
        pushed = 1
      }

      else{
        if(isNaN(tmpArr[i]))
          ansArray.push(tmpArr[i])
        else
          ansArray.push(parseFloat(tmpArr[i]))
      }
    }

    // Then this becomes the new array
    tmpArr = ansArray;
  }

  return ansArray
}
