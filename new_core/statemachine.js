import { state } from "./state.js"

export function setup () {
  state.current = "INITIAL"
}

export function update () {
  const nextState = state.next
  
  if (nextState !== null){
    state.current = nextState
    state.next = null
  }
}