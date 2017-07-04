const game = {}

{
  
  // core section
  
  const negate = f => v => !f(v)
  
  const is = (a,b) => a === b 
  
  const when = (prop, comparator, value) => object => comparator(object[prop], value)
  
  const read = prop => object => object[prop]
  
  const head = list => list[0]
  const tail = list => list[list.length]
  
  // properties
  
  const isFactory = property => false
  
  // units
  
  const getUnitClass = read("class")
  
  const isInFullMode = when("hp", greaterEq, 4)
  
  const isInReducedMode = negate(isInFullMode)
  
  // battle
  
  const getDamage = (attacker, defender) => {
    const damageList = attacker.battle[defender.clazz]
    const damageGrabber = isInFullMode(attacker) ? head : tail
    const damage = damageGrabber(damageList)
    
    return damage
  }
  
  // sequences
  
  const battleSequence = (attacker, defender) => {
    const damageFromAttacker = getDamage(attacker, defender)
    const reducedDefender = isInReducedMode(defender)
    const damageFromDefender = getDamage(defender, attacker)
    const reducedAttacker = isInReducedMode(attacker)
    
  }
}

{
  
  const units = []
  
  units.push({
    id: "infantry",
    clazz: "foot",
    battle: {
      "foot": [5, 3]
    }
  })
}