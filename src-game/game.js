// encapsulates the given world and client for
// the returned game logic handler

const Guard = (expr, msg) => {
  if (!expr) {
    try {
      throw new Error()
    } catch (e) {
      const stack = e.stack
      if (!msg) {
        const lines = typeof stack == "string" ? stack.split("\n") : []
        const lastFunction = lines.length >= 3 ? lines[2] : "unknown"
        msg = "GuardFailed(" + lastFunction + ")"
      }
      throw new Error(msg)
    }
  }
}

const isValidType = (spec, namespace = "") => (value, root = value) =>
  Object
  .keys(spec)
  .map(key => {
    switch (typeof spec[key]) {
      case "function":
        return !spec[key](value[key], value, root) ? namespace + key : null
      case "object":
        // TODO array support
        return createValidator(spec[key], namespace + key + ".")(value[key], root)
      default:
        return namespace + key + "(illegal)"
    }
  })
  .filter(v => !!v)
  .reduce((result, value) => result.concat(value), [])

// =============================================================================

const Lists = {}

Lists.notEmpty = list => list.length > 0

// =============================================================================

const Logic = {}

// A => Boolean - returns true if a is truthy (object, non-empty list, true, ...) or else false
Logic.truthy = a => !!a

// A => Boolean - (complement of Logic.truthy)
Logic.falsy = a => !a

// A, A => A - either first A or second one when the first one is falsy   
Logic.either = (a, b) => !!a ? a : b

// A* => A || undefined
Logic.or = (...a) => a.reduce((result, current) => !result ? current : result, undefined)

// Any, Any => Boolean - returns true when a is not b
Logic.notEquals = (a,b) => a != b

// Boolean => Boolean 
Logic.complement = (a) => !a
  
// =============================================================================

const Maths = {}
  
// Int, Int => Int - random integer between the two numbers, returns 0 
// if second number is smaller than the first one
Maths.rndInt = (from, to) => to > from ? from + Math.trunc(Math.random() * (to - from)) : 

Maths.isInt = i => typeof i === "number" && Math.trunc(i) === i

Maths.between = (from, to, value) => from <= value && value <= to

// =============================================================================

//
//
// design decision - game logic is designed by it's contract and will not check 
//                   incoming data. this means Game stuff may not be accessable by
//                   user interaction layers directly. there should be a fail-fast 
//                   or fail-safe layer between both to handle input data
//
const Game = {}

Game.UnitType = {

}

// Actor? => Boolean - returns true when the given object is an actor object, else false
Game.ActorType = {
  position: {
    x: Maths.beetween.partial(0, 100),
    y: Maths.beetween.partial(0, 100)
  },
  unit: Game.UnitType
}

// Unit => Boolean - returns true when the unit is a supplier, else false
Game.isSupplier = (unit) => Logic.truthy(unit.type.supply)

Game.sliceRangeFromMap = (map, range, position) => {
  if (range == 0) return []

  const result = []

  const leftX = Math.max(0, position.x - range)
  const leftY = Math.max(0, position.y - range)
  const rightX = Math.max(map.length - 1, position.x + range)
  const rightY = Math.max(map[0].length - 1, position.y + range)

  for (let x = leftX; x <= rightX; x++) {
    for (let y = leftY; y <= rightY; y++) {
      const actualRange = Math.abs(position.x - x) + Math.abs(position.y - y)
      if (actualRange <= range) {
        result.push(map[x][y])
      }
    }
  }

  return result
}

// Map, Actor => [Unit] - returns a list of units which can be supplied
// by the given unit at a given position
Game.getSupplyTargets = (map, actor) => { 
  const belongsToUnitOwner = tile => !!tile.unit && tile.unit.owner == actor.unit.owner
  const area = Game.getTilesInRange(map, 1, actor.position)
  const tilesWithOwnUnits = area.filter(belongsToUnitOwner)
  
  return tilesWithOwnUnits 
}
  
// Map, Actor => Boolean - returns true if the unit can supply its neighbours
Game.canSupplyNeighbours = (map, actor) => Lists.notEmpty(Game.getSupplyTargets(map,actor))

// Unit => Unit - takes the unit, refills all of its ammo and fuel and returns it
Game.refillSupplies = (unit) => {
  unit.ammo = unit.type.maxAmmo
  unit.fuel = unit.type.maxFuel
  
  return unit
}

// Unit => Unit - takes the unit and supplies all of its neighbours and returns
// the unit
Game.supplyNeighbours = (map, actor) => {
  const targets = Game.getSupplyTargets(map, actor.unit, actor.position)
  const handler = Game.refillSupplies
  
  targets.forEach(handler)
  return actor
} 

// Unit, Int(1-99) => Int - refills the hp of an unit by amount and returns 
// the overfilled amount. when the refill would overfill and unit, then 
// the gap between max hp and the old hp plus amount will be added in 
// relation to the unit price to the units owner gold depot.
Game.refillHP = (unit, amount) => {  
  const aboveMaxHP = Math.max(0, unit.hp + amount - 99)
  const newhp = Math.min(99, unit.hp + amount)
  const overfillRefunds = Math.trunc(aboveMaxHP * unit.type.cost / 100)
    
  unit.owner.gold += overfillRefunds
  unit.hp = newhp
    
  return aboveMaxHP
}

// Property, Int => Property - takes the property and increases the gold depot of its
//                             owner and returns 
Game.raiseFunds = (property, amount) => property.owner.gold += amount
  
// Unit => Unit - drains the fuel of the unit, may drains more fuel when the 
// unit is in hidden status.
Game.drainFuel = unit => {
  const hidden = unit.hidden
  const drainDaily = Logic.either(unit.type.dailyFuelDrain, 0)
  const drainDailyHidden = Logic.either(unit.type.dailyFuelDrainHidden, 0)
  const drain = hidden ? Math.max(drainDaily, drainDailyHidden) : drainDaily
    
  unit.fuel = unit.fuel - drain
  return unit
}

// Turn, [Player] => Boolean - sets the next turn owner and returns true when
//                             when the day changes, otherwise false
Game.setNextTurnowner = (turn, players) => {
  const currentOwner = world.turn.owner
  const currentOwnerIndex = players.indexOf(currentOwner)
  const playersWithoutTurnOwner = rotateList(world.players.filter(p => p !=
    currentOwner), currentOwnerIndex)
  const restPlayers = filter(p => p.team != -1)
  const nextOwner = restPlayers[0]
  const nextOwnerIndex = players.indexOf(nextOwner)
  const dayChanged = nextOwnerIndex < currentOwnerIndex

  turn.day = turn.day + (dayChanged ? 1 : 0)
  turn.owner = nextOwner

  return dayChanged
}

Game.joinable = (sourceUnit, targetUnit, maxHP) => 
  sourceUnit.owner == targetUnit.owner &&
  sourceUnit.type == targetUnit.type &&
  targetUnit.hp < maxHP

Game.joinUnits = (sourceUnit, targetUnit, maxHP) => {
  const aboveFullHp = Math.max(0, sourceUnit.hp + targetUnit.hp - 99)

  targetUnit.hp = Math.min(targetUnit.hp + sourceUnit.hp, 99)
  targetUnit.fuel = Math.min(targetUnit.fuel + sourceUnit.fuel, targetUnit.type.fuel)
  targetUnit.ammo = Math.min(targetUnit.ammo + sourceUnit.ammo, targetUnit.type.ammo)
  sourceUnit.owner = null

  // TODO ?
  targetUnit.owner.gold = targetUnit.owner.gold + (sourceUnit.type.cost * 0.1)
}

// Unit => Boolean - returns true when the unit is a stealth unit, otherwise false
Game.isStealth = unit => !!unit.type.stealth

// Unit => Boolean - returns true when the unit is hidden, otherwise false
Game.isHidden = unit => !!unit.hidden

// Unit => Boolean - returns true when the unit can hide, otherwise false
Game.canHide = unit => !unit.hidden

// Unit => Boolean - returns true when the unit can reveal, otherwise true
Game.canReveal = unit => Logical.complement(Game.canHide(unit))

Game.hide = (unit) => unit.stealth.hidden = true

Game.reveal = (unit) => unit.hidden = false

// returns true when the current active day is in peace phase, false otherwise
Game.inPeacePhase = (cfg, turn) => turn.day < cfg.daysOfPeace

// returns true if the given unit has a primary weapon, false otherwise
Game.hasMainWeapon = unit => !!unit.type.attack.primary

// returns true if the given unit has a secondary weapon, false otherwise
Game.hasSecondaryWeapon = unit => !!unit.type.attack.secondary

// returns 'direct' if the unit attacks only surrounding units, 'indirect' when
// the unit has an attack range of 2 or greater, 'ballistic' when it's minimum
// attack range is 1 and maximum range 2 or greater, if nothing matches then
// 'nothing' will be returned
Game.getFireType = unit => {
  const hasMainWp = Game.hasMainWeapon(unit)
  const hasSecondaryWp = Game.hasSecondaryWeapon(unit)
  const hasWeapon = !!hasMainWp && !!hasSecondaryWp
  const longMaxRange = hasWeapon ? unit.type.attack.range.max > 1 : false
  const longMinRange = hasWeapon ? unit.type.attack.range.min > 1 : false

  if (!hasWeapon) return "nothing"
  if (longMaxRange) return longMinRange ? "indirect" : "ballistic"
  return "direct"
}

// returns true when the unit is a ballistic unit, false otherwise
Game.isBallisticUnit = unit => Game.getFireType(unit) == "ballistic"

// returns true when the unit is a indirect unit, false otherwise
Game.isIndirectUnit = unit => Game.getFireType(unit) == "indirect"

// returns true when the unit is a direct unit, false otherwise
Game.isDirectUnit = unit => Game.getFireType(unit) == "direct"

// returns true when the unit is a peaceful unit, false otherwise
Game.isPeacefulUnit = unit => Game.getFireType(unit) == "nothing"

Game.destroyUnit = unit => unit.owner = null

Game.damageUnit = (unit, amount, minRest = 0) => {
  unit.hp = Math.max(minRest, unit.hp - amount)
  if (unit.hp == 0) {
    Game.destroyUnit(unit)
  }
}

// returns true when the unit is a suicide unit, false otherwise
Game.isSuicideUnit = unit => !!unit.type.suicide

// damages all surrounding units at the position of the exploding unit
// and destroys the unit itself
Game.selfDestruct = (world, unit) => {
  const range = Game.sliceRangeFromMap(world.map, unit.type.suicide.damage, unit.position)
  const containsUnit = tile => !!tile.unit
  const unitsInRange = range.filter(containsUnit)
  const handler = tile => Game.damageUnit(tile.unit, unit.type.suicide.damage)
  
  unitsInRange.forEach(handler)
  Game.destroyUnit(unit)
}

// returns true if the property can be captured by the unit
Game.canBeCapturedBy = (property, unit) => 
  !!unit.type.capturer && unit.owner.team != property.owner.team

// let unit captures property which results in lowered property
// points. all properties and units of the property owner will
// be cleared when the points falls down to zero and the property
// is critical. otherwise only the property owner changes to
// the capturers owner.
Game.captureProperty = (property, unit) => {
  const capturedPoints = Math.trunc(world.cfg.capturePerStep / 100 * (unit.hp + 1))
  const pointsLeft = property.points - capturedPoints
  const newOwner = pointsLeft < 0
  const newPoints = newOwner ? world.cfg.capturePoints : pointsLeft
  const afterCaptureType = property.type.transformation.afterCaptured
  const isCriticalLoss = newOwner && property.type.isCriticalProperty
  const newType = newOwner && !!afterCaptureType ? afterCaptureType : property.type
  const belongsToPropertyOwner = ownable => property.owner == ownable.owner

  modifyVision(unit.position, newOwner ? 1 : 0, property.type.vision, property.owner.visionMap)
  modifyVision(unit.position, newOwner ? 1 : 0, newType.vision, unit.owner.visionMap)
  
  if (isCriticalLoss){
    world.units
      .filter(belongsToPropertyOwner)
      .forEach(Game.destroyUnit)
  
    world.properties
      .filter(belongsToPropertyOwner)
      .filter(p => p != property)
      .forEach(property => property.owner = null)
  }

  property.points = newPoints
  property.owner = newOwner ? unit.owner : property.owner
  property.type = newType
}

Game.isFactory = (property) => !!property.type.builds

Game.canProduce = (model, factory) => {
  const owner = factory.owner
  const hasManpower = owner.manpower > 0
  const notOccupied = !factory.tile.unit
  
  return hasManpower && notOccupied
}

// returns a list of types which can be produced by the given factory
Game.getProducableTypes = (types, factory) => {
  const buildable = factory.type.builds
  const owner = factory.owner
  
  return types
    .units
    .filter(sheet => buildable.includes(sheet.movetype))
    .filter(sheet => sheet.cost <= owner.gold)
    .map(sheet => sheet.ID)
}

Game.produce = (units, factory, type) => {

  // TODO change usable system

  const newUnit = units.find(u => !u.owner)
  const owner = factory.owner
  const newGold = owner.gold - type.cost
  const newManpower = owner.manpower - 1

  newUnit.hp = 99
  newUnit.owner = owner
  newUnit.type = type
  newUnit.ammo = type.ammo
  newUnit.fuel = type.fuel
  newUnit.loadedIn = -1
  newUnit.x = factory.x
  newUnit.y = factory.y
  newUnit.exp = 0
  newUnit.rank = 0
 
  owner.manpower = newManpower
  owner.gold = newGold
}

Game.isSilo = (property) => !!property.type.rocketsilo

// Unit, Property -> Boolean - returns true when the unit can 
//                             launch the silo rocket 
//
Game.isSiloFireableBy = (unit, property) => {
  return property.type.rocketsilo.fireable.includes(unit.type.ID)
}

// Map, Position, Position => Void - fires a rocket from the first position
//                                   to the second position. damages all units
//                                   in range at the second position, but always
//                                   leaves 1HP rest
Game.fireSilo = (map, siloPos, targetPos) => {
  const silo = map[siloPos.x][siloPos.y].property
  const range = silo.type.rocketsilo.range
  const damage = silo.type.rocketsilo.damage
  const tilesInRange = Game.sliceRangeFromMap(map, range, targetPos)
  const isOccupiedTile = t => !!t.unit
  const lensUnit = t => t.unit
  const unitsInRange = tilesInRange.filter(isOccupiedTile).map(lensUnit)
  
  unitsInRange.forEach(u => Game.damageUnit(u, damage, 9))
}

Game.emptifySilo = (types, silo) => {
  // TODO
  silo.type = types.find(t => t.id === "PSLE")
}

Game.refillSilo = (types, silo) => {
  // TODO
  silo.type = types.find(t => t.id === "PSLO")
}

// returns true if the unit is usable, false otherwise
Game.isUsable = (usables, unit) => usables.includes(unit.id)

// sets the given unit as usable in the given usability model
Game.markUsable = (usables, unit) => usables.push(unit.id)

// sets the given unit as unusable in the given usability model
Game.markUnusable = (usables, unit) => usables.splice(usables.indexOf(unit.id), 1)

// Player => Integer - returns the costs of one commander power star
Game.getCostOfOnePowerStar = (player) => {
  const STAR_COST = 9000
  const INCREASE_PER_USE = 1800
  const MAXIMUM_INCREASES = 10
  const timesUsed = Math.max(player.co.timesPowerUsed, MAXIMUM_INCREASES)
  
  return STAR_COST + timesUsed * INCREASE_PER_USE
}

// String, Player => Boolean - returns true when the player can activate the power 
//                             with its power depot
Game.isPowerActivatable = (power, player) => {
  const starsNeeded = player.co.type.stars[power]
  const powerNeeded = Game.getCostOfOnePowerStar(playerId) * starsNeeded
  
  return player.co.power >= powerNeeded 
}

// String, Player => Void
//
Game.activatePower = (power, player) => {
  player.co.power = 0
  player.co.level = powerLevel
  player.co.timesUsed++ 
}

// Player => {normal:Boolean,super:Boolean}
//
Game.getActivatablePowers = (player) => ({
  normal: Game.isPowerActivatable("cop", player),
  super: Game.isPowerActivatable("cop", player)
})

// $: Int, Position, Int, [[Int]] => Void
//
// modifies the vision values in a fog model by the modifier
//
Game.modifyVision = (by, position, range, fogModel) => {
  sliceRange(fogModel, range, position).map(x => Math.max(0, x + by))
}

Game.putVision = Game.modifyVision.bind(null, 1)

Game.popVision = Game.modifyVision.bind(null, -1)

Game.buildVision = (map, owner) => {
  const fog = owner.vision
  const belongsToOwner = x => !!x && x.owner == owner
  const isOwnUnit = t => belongsToOwner(t.unit)
  const isOwnProp = t => belongsToOwner(t.property) 
  const extractOwnUnit = col => col.filter(isOwnUnit).map(x => x.unit)
  const extractOwnProperties = col => col.filter(isOwnProp).map(x => x.property)
  const ownerUnits = map.reduce((arr, col) => arr.concat(extractOwnUnits(col)), [])
  const ownerProps = map.reduce((arr, col) => arr.concat(extractOwnProperties(col)), [])
  const changes = ownerUnits.concat(ownerProps).map(v => [v.position, v.type.vision])
  
  fog.forEach(col => col.map(_ => 0))
  changes.forEach(vdata => Game.putVision(vdata[0], vdata[1], fog))
}

Game.getMovemap = (map, unit, position = unit.position) => {
  const CHECK_RANGE = 15
  const toCheckData = (x,y,value) => ({ x , y , value })
  const movePoints = Math.min(unit.fuel, unit.type.moverange)
  const sideLength = CHECK_RANGE * 2 + 1
  
  let toBeChecked = []
  let movetargets = []
  
  const targetsX = Math.max(0, x - CHECK_RANGE)
  const targetsY = Math.max(0, y - CHECK_RANGE)
  const targetsRX = Math.min(targetsX + sideLength, map.length)
  const targetsRY = Math.min(targetsY + sideLength, map[0].length)
  
  for (let x = 0; x < sideLength; x++) {
    let arr = []
    for (let y = 0; y < sideLength; y++) {
      arr.push(-1)
    }
    movetargets.push(arr)
  }
    
  toBeChecked.push(toCheckData(position.x, position.y, movePoints))
  
  const isBetween = (left, right, value) => value >= left && value <= right
  
  const checkTile = (data) => {
    const x = data.x
    const y = data.y 
    const relativeX = x - targetsX
    const relativeY = y - targetsY
    const validPos = isBetween(targetsX, targetsRX, x) && isBetween(targetsY, targetsRY, y)
    const tile = validPos ? map[x][y] : null
    const currentValue = movetargets[relativeX][relativeY]
    const movecosts = Game.getCostsToMoveOn(unit, map[x][y])
    const leftMovePoints = data.value - movecosts
    const newIsBetter = leftExists.value < leftMovePoints
    
    if (newIsBetter) { 
      const newData = { x, y, value: leftMovePoints }
     
      toBeChecked.push(newData)
      movetargets[relativeX][relativeY] = value
    }
  } 
  
  while(toBeChecked.length > 0) {
    const positionToBeChecked = toBeChecked.pop()
    const x = positionToBeChecked.x
    const y = positionToBeChecked.y
    checkTile(x - 1, y)
    checkTile(x + 1, y)
    checkTile(x, y - 1)
    checkTile(x, y + 1)
  }
    
  return {
    topLeft: position,
    size: Game.toPosition(MAX_SIDE_LEN, MAX_SIDE_LEN),
    data: movetargets
  }
}

Game.getMoveway = (map, unit, source, target) => {
  const moveData = Game.getMovemap(map, unit, source)
  const moveMap = moveData.data
  
  const getHeuristic = (data, target) => Math.abs(data.x - target.x) + Math.abs(data.y - target.y)
  
  const toData = (position, way, points, heuristic) => ({ position, way, points, heuristic })
  
  const paths = [ toData(source) ]
  
  const checkTile = (oldData, dir) => {
    const x = oldData.x + (dir == "L" ? -1 : (dir == "R" ? +1 : 0))
    const y = oldData.y + (dir == "U" ? -1 : (dir == "D" ? +1 : 0))
    
    if (x < moveData.topLeft.x 
     || y < moveData.topLeft.y 
     || x > moveData.topLeft.x + moveData.size.x 
     || y > moveData.topLeft.y + moveData.size.y ) {
      return 
    }
    
    const costs = moveMap[x - moveData.topLeft.x][y - moveData.topLeft.y]
    const newPoints = oldData.points - costs
    
    if (newPoints < 0) {
      return 
    }
    
    const newWay = oldData.way.map(x => x)
    newWay.push(dir)
    
    const newData = toData(toPosition(x,y), newWay, newPoints, 0)
    const heuristic = getHeuristic(newData, target)
    newData.heuristic = heuristic
    
    paths.push(newData)
  } 
  
  while(paths.length > 0) {
    
    const entity = paths.reduce((best, current) => 
      !best || current.heuristic < best.heuristic ? current : best, null)
    
    const index = paths.indexOf(entity)
    
    checkTile(x - 1, y)
    checkTile(x + 1, y)
    checkTile(x, y - 1)
    checkTile(x, y + 1)
    
    paths.splice(index, 1)
    
    const matchData = paths.find(d => d.position.x == target.x && d.position.y == target.y)
    
    if (!!matchData) {
      return matchData.way
    }
  }
  
  return null
}

Game.getCostsToMoveOn = (unit, tile) => {
  const blocker = tile.type.moveBlocker
  if(!!blocker){
    return -1
  }
  
  const costMap = unit.type.movetype.costs
  const directCosts = Logic.or(costMap[tile.type.id], -1)
  const movetypeCosts = Logic.or(costMap[unit.type.movetype.id], -1)
  const wildcardCosts = Logic.or(costMap["*"], -1)
  const moveCosts = Logic.or(directCosts, movetypeCosts, wildcardCosts, -1)
  
  return moveCosts
}

Game.canMoveOntoTile = (unit, tile) => getCostsToMoveOn(unit, tile) > 0

Game.getFuelCosts = (map, unit, way) => {
  const dirToX = (dir) => dir == "L" ? -1 : ( dir == "R" ? +1 : 0)
  const dirToY = (dir) => dir == "U" ? -1 : ( dir == "D" ? +1 : 0)
  const addDirection = (dir, pos) => Game.toPosition(dirToX(dir, pos.x), dirToY(dir, pos.y))
  
  const positions = way.reduce((r, dir) => r.concat(addDirection(dir, Lists.empty(r) ? unit.position : Lists.last(r))))
  const accumulator = (c, pos) => c + Game.getCostsToMoveOn(unit, map[pos.x][pos.y])
  const consumption = positions.reduce(accumulator, 0)
  
  return consumption
}

Game.move = (map, unit, way) => {
  const dirToX = (dir) => dir == "L" ? -1 : ( dir == "R" ? +1 : 0)
  const dirToY = (dir) => dir == "U" ? -1 : ( dir == "D" ? +1 : 0)
  const addDirection = (dir, pos) => Game.toPosition(dirToX(dir, pos.x), dirToY(dir, pos.y))
  
  const fuelConsumption = Game.getFuelCosts(map, unit, way)
  const newFuel = unit.fuel - fuelConsumption
  const newPos = way.reduce((pos, dir) => addDirection(dir, pos),  unit.position)
  
  unit.position = newPos
  unit.fuel = newFuel
}

// [TansportModel], Unit => TransportModel?
//
Game.getTransporterModel = (loadModel, unit) => loadModel.find(m => m.transporter == unit)

// [TansportModel], Unit => Boolean
//
Game.isTransporter = (loadModel, unit) => !!Game.getTransporterModel(loadModel, unit)

// [TansportModel], Unit => Boolean
//
Game.hasLoads = (loadModel, unit) => {
  const model = Game.getTransporterModel(loadModel, unit)
  const hasModel = !!model
  
  return hasModel ? model.loads.length > 0 : false
}

Game.canLoad = (transporters, transporter, load) => {
  const model = Game.getTransporterModel(transporters, transporter)
  const fullyLoaded = model.loads.length == transporter.type.maxLoads
  const alreadyLoaded = model.loads.includes(load)
  const loadableType = transporter.type.canload.includes(transporter.type.movetype.id)
  
  return !fullyLoaded && !alreadyLoaded && loadableType
}

Game.loadUnit = (transporters, transporter, load) => {
  const model = Game.getTransporterModel(transporters, transporter)
  const loadPosition = Game.toPosition(-1, -1)
  
  model.loads.push(load)
  load.position = loadPosition
}

Game.getLoads = (transport) => transport.loads.splice(0) 

Game.getUnloadTargets = (transport, position = transport.unit.position) => {
  const loads = transport.loads
  const targets = loads.map(l => {
    const neighbours = Game.sliceRangeFromMap(map, 1, position)
    const movableNb = neighbours.filter(t => Game.canMoveOntoTile(transport, t))
    
    return movableNb
  })
  const targetList = targets.reduce((r, item) => r.concat(item), [])
  
  return targetList
}

const unload = (transport, load, direction) => {
  const dirToX = (dir) => dir == "L" ? -1 : ( dir == "R" ? +1 : 0)
  const dirToY = (dir) => dir == "U" ? -1 : ( dir == "D" ? +1 : 0)
  const addDirection = (dir, pos) => Game.toPosition(dirToX(dir, pos.x), dirToY(dir, pos.y))
  
  const newLoads = transport.loads.filter(u => u != load)
  const newPosition = addDirection(direction, transport.position)
   
  load.position = newPosition
  transport.loads = newLoads
}

// =============================================================================

// Unit => Actor
const toUnitActor = unit => ({
  position: unit.position,
  unit,
  property: null
})

// Property => Actor
const toPropertyActor = property => ({
  position: property.position,
  property,
  unit: null
})

// 
// design decision - all sequences are fail fast, they check the input data
//                   and will throw error as soon illegal data will be detected
//
const Sequences = {}

// attacks one unit with a unit. may introduces a counter attack when the attacker
// attacks directly and the defender has the ability to attack the attacker.
// furthermore this sequence will increase the power level of both unit owners.
Sequences.attack = (world, attackerID, defenderID) => {
  const attacker = world.units[attackerID]
  const defender = world.units[defenderID]
  
  Guard(!!attacker)
  Guard(!!defender)
  Guard(attacker != defender)
  Guard(!Game.isPeacefulUnit(attacker))
  
  // TODO 
}

Sequences.produce = (world, factoryID, type) => {
  const factory = world.properties[factoryID]
  const owner = factory.owner 
  const ownerUnitCount = world.units.filter(x => x.owner === owner).length
  
  Guard(ownerUnitCount < 50)
  
  const produced = Game.produce(world.units, factory, type)
  
  Guard(!!produced)
}

Sequences.drainAll = (world, playerID) => {
  const owner = world.player[playerID]
  const ownerUnits = world.units.filter(u => u.owner == owner)
  
  ownerUnits.forEach(Game.drainFuel)
}

Sequences.supplyAll = (world) => {
  const turnOwner = world.turn.owner
  const toUnits = world.units.filter(u => u.owner == turnOwner)
  const toSuppliers = toUnits.filter(Game.isSupplier)
  const toSuppliersWithTargets = toSuppliers.filter(u => Game.canSupplyNeighbours(world.map, toUnitActor(u)))
  
  toSuppliersWithTargets.forEach(u => Game.supplyNeighbours(world.map, toUnitActor(u)))
}

Sequences.repairAll = (world) => {
  const turnOwner = world.turn.owner
  const belongsToTurnOwner = tile => !!tile.unit && tile.unit.owner == turnOwner
  const standsOnAlliedProperty = tile => !!tile.property && tile.property.owner == turnOwner
  const predicate = tile => belongsToTurnOwner(tile) && standsOnAlliedProperty(tile)
  const tiles = world.units.filter(predicate)
  const repairAmount = world.config.propertyRepairAmount
  const handler = tile => Game.refillHp(tile.unit, repairAmount)
  
  Guard(repairAmount)
  
  tiles.forEach(handler)
} 

Sequences.nextTurn = (world) => {
  Game.pickNextTurnowner(world.turn, world.players)
  
  // TODO: necessary? should not when every player has its vision model
  world.players.forEach(p => Game.buildVision(world.map, p))
  
  Sequences.supplyAll(world, world.turn.owner.id)
  Sequences.repairAll(world, world.turn.owner.id)
  Sequences.drainAll(world, world.turn.owner.id)
  
  const turnOnwerUnits = world.units.filter(u => u.owner == world.turn.owner)
  
  world.turn.acitvatableUnits = []
  turnOnwerUnits.forEach(u => Game.markUsable(world.turn.acitvatableUnits, u))
}

Sequences.supply = (world, supplierID) => {
  const supplier = world.units[supplierID]
  Guard(!!supplier)
  
  const actor = toUnitActor(supplier)
  
  Guard(Game.canSupplyNeighbours(world.map, actor))
  
  Game.supplyNeighbours(world.map, actor)
  Game.markUnusable(world.usables, supplier)
}

Sequences.hide = (world, unitID) => {
  const unit = world.units[unitID]
  
  Guard(unit)
  Guard(Game.isStealth(unit))
  Guard(!Game.isHidden(unit))
  
  Game.hide(unit)
  
  Guard(Game.isHidden(unit))
}

Sequences.reveal = () => {
  const unit = world.units[unitID]
  
  Guard(unit)
  Guard(Game.isStealth(unit))
  Guard(Game.isHidden(unit))
  
  Game.reveal(unit)
  
  Guard(!Game.isHidden(unit))
}

Sequences.capture = (world, capturerID) => {
  const capturer = world.units[capturerID]
  Guard(!!capturer)
  
  const position = capturer.position
  const property = world.map[position.x, position.y].property
  Guard(!!property)

  Guard(Game.canBeCapturedBy(property, capturer))
  
  Game.captureProperty(property, capturer)
}

Sequences.launchSilo = (world, siloID, targetPos) => {
  const silo = world.properties[siloID]
  const siloPos = silo.position
  
  Game.fireSilo(world.map, siloPos, targetPos)
}

Sequences.load = () => null

Sequences.unload = () => null

Sequences.saveGame = () => null

Sequences.loadGame = () => {
}

Sequences.join = (world, unitA, unitB) => {
  Guard(Game.joinable(unitA, unitB))
  Guard(Game.isTransporter(unitA))
  Guard(Game.hasLoadedUnits(unitB))
  Guard(Logic.notEquals(unitA, unitB))
  
  Game.joinUnits(unitA, unitB)
  
  Guard(Logic.falsy(unitA.owner))
}

Sequences.activatePower = (world, power) => {
  const player = world.turn.owner

  Guard(Game.isPowerActivatable(power, player))
  
  Game.activatePower(power, player)
  
  Guard(player.co.power == power)
}

// =============================================================================

// the event dispatcher controlls the available sequences for a player instance
// and controls incoming events. modifies the game world.
//
// design decision - only validates the action data, world will be dispatched to 
//                   sequences
//
const EventDispatcher = {}

// action data type that contains information which will be shared 
// amoung the game clients to modify the world state
//
EventDispatcher.ActionData = {
  key: enum(Object.keys(Sequences)),
  args: [Maths.isInt]
}

EventDispatcher.availableSequences = (world, actor) => {
  const sequences = {}
  
  sequences.supply = false
  sequences.produce = !!actor.unit && Game.canSupplyNeighbours(world.map, actor)
  sequences.attack = false
  sequences.launchSilo = false
  sequences.reveal = false
  sequences.hide = false
  sequences.load = false
  sequences.unload = false
  sequences.join = false
  sequences.nextTurn = !actor.unit && !actor.property
  sequences.wait = !!actor.unit
  
  return sequences
}

EventDispatcher.dispatchSequence = (data) => {
  try {
    Guard("valid action object", validate(EventDispatcher.ActionData, data))
    
    const key = data.key
    
    Guard("action is usable", !!EventDispatcher.availableSequences()[key])
    
    const action = Sequences[key]
    const args = data.args
    
    Guard(!!action)
    
    action(...args)
    return undefined
    
  } catch (e) {
    return "action invocation exception ("+ e.message +")
  }
}






// =======================================================================
// =======================================================================
// =======================================================================


  // returns true when the buffer contains at least one command, false otherwise
  const hasCommands = (buffer) => buffer.length > 0

  // pushes a command into the buffer
  const pushCommand = (buffer, command) => {
    const MAX_SIZE = 200

    guard(_.size(buffer) < MAX_SIZE)
    return _.concat(buffer, command)
  }

  // pops a command from the buffer and returns it
  const popCommand = (buffer) => {
    guard(hasCommands(buffer))
    const next = _.first(buffer)
    const withoutNext = _.initial(buffer)
    return world.buffer.shift()
  }

             
  const tickAsyncEvents = model => {
    const events = model.events
    events.forEach(el => el.leftTicks--)
    model.events = events.filter(el => el.leftTicks > 0)
    return events.filter(el => el.leftTicks == 0)
  }

  const resetTurnTime = (model, cfg) => {
    model.leftTurnTime = or(cfg.turnTime, Number.POSITIVE_INFINITY)
  }

  const tickTurnTime = (model, time) => {
    model.leftTurnTime = Math.max(0, model.leftTurnTime - time)
    model.leftGameTime = Math.max(0, model.leftGameTime - time)

    return condition()
      .case(mode.leftGameTime <= 0, "end-game")
      .case(mode.leftTurnTime <= 0, "end-turn")
      .default("nothing")
  }

  
 
  const getTargets = (unit, position = unit.position) => {
    const minRange = unit.type.attack.range.min
    const maxRange = unit.type.attack.range.max
    const team = unit.owner.team
    const visionMap = unit.owner.visionMap

    return sliceRange(world.map, maxRange, position)
      .map(tile => tile.unit)
      .filter(u => !!u)
      .filter(unit => visionMap[unit.position.x][unit.position.y] > 0)
      .filter(unit => exports.model.distance(position, unit.position) >=
        minRange)
      .filter(unit => unit.owner.team != team)
  }

  const hasTargets = (model, unit, position) => getTargets(model, unit,
    position).length > 0

  const getBaseDamageAgainst = (e, t, o) => {
    var n = e.type.attack;
    if (!n) return -1;
    var a, r = t.type.ID;
    return "undefined" == typeof o && (o = !0), o && e.ammo > 0 && void 0 !==
      n.main_wp && (a = n.main_wp[r], "undefined" != typeof a) ? a : void 0 !==
      n.sec_wp && (a = n.sec_wp[r], "undefined" != typeof a) ? a : -1
  }

  const getBattleDamageAgainst = (e, t, o, n, a) => {
    "undefined" == typeof a && (a = !1), assert(util.intRange(o, 0, 100)),
      assert(util.isBoolean(n)), assert(util.isBoolean(a));
    var r = model.battle_getBaseDamageAgainst(e, t, n);
    if (-1 === r) return -1;
    var l = model.unit_convertHealthToPoints(e),
      i = model.unit_convertHealthToPoints(t);
    controller.prepareTags(e.x, e.y);
    var d = parseInt(o / 100 * controller.scriptedValue(e.owner, "luck", 10),
        10),
      s = controller.scriptedValue(e.owner, "att", 100);
    a && (s += controller.scriptedValue(t.owner, "counteratt", 0)),
      controller.prepareTags(t.x, t.y);
    var c = controller.scriptedValue(t.owner, "def", 100),
      m = model.map_data[t.x][t.y].defense,
      u = parseInt(controller.scriptedValue(t.owner, "terrainDefense", m) *
        controller.scriptedValue(t.owner, "terrainDefenseModifier", 100) /
        100, 10),
      _ = (r * s / 100 + d) * (l / 10) * ((200 - (c + u * i)) / 100);
    return _ = parseInt(_, 10)
  }

  const attack = (map, attacker, defender, attackerLuck, defenderLuck) => {

    exports.guard(model.unit_isValidUnitId(e.source.unitId))
    exports.guard(model.unit_isValidUnitId(e.targetselection.unitId))

    exports.guard(exports.isInteger(attackerLuck))
    exports.guard(exports.isBetween(0, 100, attackerLuck))
    exports.guard(exports.isInteger(defenderLuck))
    exports.guard(exports.isBetween(0, 100, defenderLuck))

    var a = model.unit_data[e],
      r = model.unit_data[t],
      l = model.battle_isIndirectUnit(e);
    if (!l && 1 === controller.scriptedValue(r.owner, "firstCounter", 0) &&
      !model.battle_isIndirectUnit(t)) {
      var i = r;
      r = a, a = i
    }
    var d, s = a.type,
      c = r.type,
      m = a.owner,
      u = r.owner,
      _ = model.unit_convertHealthToPoints(r),
      p = model.unit_convertHealthToPoints(a),
      f = model.battle_canUseMainWeapon(a, r);
    d = model.battle_getBattleDamageAgainst(a, r, o, f, !1) - 1 !== d && (
      model.events.damageUnit(t, d), _ -= model.unit_convertHealthToPoints(
        r) f && a.ammo--
      _ = parseInt(.1 * _ * c.cost, 10) model.events.co_modifyPowerLevel(
        m, parseInt(.5 * _, 10)) model.events.co_modifyPowerLevel(u, _))
    r.hp > 0 && !model.battle_isIndirectUnit(t) && (
      f = model.battle_canUseMainWeapon(r, a), d = model.battle_getBattleDamageAgainst(
        r, a, n, f, !0), -1 !== d && (model.events.damageUnit(e, d), p -=
        model.unit_convertHealthToPoints(a), f && r.ammo--, p = parseInt(
          .1 * p * s.cost, 10), model.events.co_modifyPowerLevel(u,
          parseInt(.5 * p, 10)), model.events.co_modifyPowerLevel(m, p)))
  }
  
  
  // TODO
  const doUpdateWeather = (newType, seed) => {
    world.weather.active = newType
    world.weather.leftDays = randomInteger(newType.duration.min, newType.duration
      .max)
    exports.client.events.onWeatherChanged(newType.id)
  }
  
  

  // TODO
  const pickRandomWeather = () => {
    const weatherModel = world.weather
    const weathers = model.types.weathers.filter(type => type.id !=
      weatherModel.active.id)
    const nextWeather = weathers[Math.trunc(Math.random() * weathers.length)]
    const nextDuration = nextWeather.duration.min + Math.trunc(Math.random() *
      nextWeather.duration.max)
    setActiveWeather(weatherModel, nextWeather)
  }

  return {}
}

