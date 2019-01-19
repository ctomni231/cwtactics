import * as gamedata from "./state.js"
import { moduleTest } from "./test.js"

export function update () {
  const nextState = gamedata.state.next
  
  if (nextState !== null){
    gamedata.state.current = nextState
    gamedata.state.next = null
  }
}

moduleTest("statemachine", (testCase) => {

  testCase("should change state when next state is set", (assertThat) => {
    gamedata.state.current = "A"
    gamedata.state.next = "B"

    update()

    assertThat(gamedata.state.current).is("B")
  })

  testCase("should not change state when no next state is set", (assertThat) => {
    gamedata.state.current = "A"
    gamedata.state.next = null

    update()

    assertThat(gamedata.state.current).is("A")
  })
})