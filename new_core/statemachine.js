import * as gamedata from "./state.js"

export function update () {
  const nextState = gamedata.state.next
  
  if (nextState !== null){
    gamedata.state.current = nextState
    gamedata.state.next = null
  }
}