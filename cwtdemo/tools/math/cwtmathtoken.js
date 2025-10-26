/*
 * Custom Wars Tactics - Math Equation Tokenizer
 * By: Carr, Crecen C.
 *
 * This class accepts a string formula with space delimiters and evaluates
 * it using various tokens. More information about how this works can be
 * found in the README.md file
 *
 * Pretty sure there are some rounding error and Infinity issues in here
 * that will have to be dealt with sooner ot later. But this is good enough
 * for a first draft
 */

export const cwtmath = {

  alpha: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  para: ['(',')'],
  sym: ['^','**','^=','//','%','^^','__','~~',
        '/','*','-','+',
        '=','==','!=','<','<=','>','>=',
        '|~','|_','|^','|+','|-','|=','|%','|?',
        '|?~','|?_','|?^','|?+','|?-','|?=','|?%'],

  astate: [],
  ansArray: [],
  mathstack: [],
  mlevel: [],
  txtArr: [],

  ans: 0,
  count: 0,
  num: 'a'
}

// This main function handles equations whether you use groups or not
export function evalMathToken(txtVal){

  cwtmath.astate = []
  cwtmath.mathstack = []
  cwtmath.mlevel = []
  cwtmath.ans = 0

  // Split up the array into tiny pieces
  cwtmath.txtArr = txtVal.split(" ");

  // Then grab out the legal pieces and put them into an array
  let tmpArr = []

  // This will concat some arrays together
  let parasym = cwtmath.sym.concat(cwtmath.para)

  for (let i=0; i<cwtmath.txtArr.length; i++) {
    if (isNaN(cwtmath.txtArr[i])){
      for (let j=0; j<parasym.length; j++){
        if (parasym[j] == cwtmath.txtArr[i]){
          tmpArr.push(cwtmath.txtArr[i])
          break;
        }
      }
    }else{
      if (cwtmath.txtArr[i])
        tmpArr.push(cwtmath.txtArr[i])
    }
  }

  // Make sure there isn't two numbers or two symbols in a row
  cwtmath.count = 0;
  cwtmath.num = 'a';

  for (let i=0; i<tmpArr.length; i++){
    if (isNaN(tmpArr[i])){
      if (!cwtmath.para.includes(tmpArr[i]) && !tmpArr[i].includes('|'))
        cwtmath.count -= 1
    }else{
      if (cwtmath.num == 'a')
        cwtmath.num = tmpArr[i]
      cwtmath.count += 1
    }
    if (cwtmath.count >= 2 || cwtmath.count < 0)
      break;
  }

  if (cwtmath.num == 'a')
    cwtmath.num = 0

  // Let's turn something illegal into something legal
  cwtmath.ansArray = []
  if (cwtmath.count == 0 || cwtmath.count == 1){

    // Deals with complex equations
    if (tmpArr.includes('(') || tmpArr.includes(')')){

      let level = 0

      for (let i=0; i<tmpArr.length; i++){

        // Deals with open parathesis logic
        if (tmpArr[i] == '('){
          if (level == 0){
            cwtmath.ansArray.push(cwtmath.alpha[cwtmath.astate.length])
            cwtmath.mathstack.push([])
          }else{
            for (let j=cwtmath.astate.length-1; j>=0; j--){
              if (cwtmath.astate[j] == 1){
                cwtmath.mathstack[j].push(cwtmath.alpha[cwtmath.astate.length])
                cwtmath.mathstack.push([])
                break;
              }
            }
          }
          cwtmath.astate.push(1)
          level += 1
          cwtmath.mlevel.push(level)
        }

        // Deals with closed parathesis logic
        else if (tmpArr[i] == ')'){
          if (level > 0){
            for (let j=cwtmath.astate.length-1; j>=0; j--){
              if (cwtmath.astate[j] == 1){
                cwtmath.astate[j] = 0;
                break;
              }
            }
            level -= 1;
          }
        }

        // Just fill numbers normally as you see them
        else {
          if (level > 0){
            for (let j=cwtmath.astate.length-1; j>=0; j--){
              if (cwtmath.astate[j] == 1){
                if (j >= cwtmath.mathstack.length)
                  cwtmath.mathstack.push([])
                cwtmath.mathstack[j].push(tmpArr[i])
                break;
              }
            }
          } else
            cwtmath.ansArray.push(tmpArr[i])
        }
      }

      // Now in reverse order, we go through the stack
      for (let i=cwtmath.mathstack.length-1; i>=0; i--){
        for (let j=0; j<cwtmath.mathstack[i].length; j++){
          if (cwtmath.alpha.includes(cwtmath.mathstack[i][j])){
            if (cwtmath.alpha.indexOf(cwtmath.mathstack[i][j]) < cwtmath.mathstack.length)
              cwtmath.mathstack[i][j] = cwtmath.mathstack[cwtmath.alpha.indexOf(cwtmath.mathstack[i][j])][0]
            // This should pop only if you opened a parathesis with nothing
            else
              cwtmath.mathstack[i].pop()
          }
        }
        cwtmath.mathstack[i] = evalArray(cwtmath.sym, cwtmath.mathstack[i])
      }

      for (let i=0; i<cwtmath.ansArray.length; i++){
        if (cwtmath.alpha.includes(cwtmath.ansArray[i])){
          if (cwtmath.alpha.indexOf(cwtmath.ansArray[i]) < cwtmath.mathstack.length)
            cwtmath.ansArray[i] = cwtmath.mathstack[cwtmath.alpha.indexOf(cwtmath.ansArray[i])][0]
          // This should pop only if you opened a parathesis with nothing
          else
            cwtmath.ansArray.pop()
        }
      }

      cwtmath.ansArray = evalArray(cwtmath.sym, cwtmath.ansArray)
      if (cwtmath.ansArray.length > 0)
        cwtmath.ans = cwtmath.ansArray[0]
    }

    // Deals with normal equations
    else{
      cwtmath.ansArray = evalArray(cwtmath.sym, tmpArr)
      if (cwtmath.ansArray.length > 0)
        cwtmath.ans = cwtmath.ansArray[0]

    }
  }else{
    cwtmath.ans = cwtmath.num
  }

  return cwtmath.ans
}

// This support function does the Math on array pieces given to it
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
