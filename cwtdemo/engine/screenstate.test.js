import { moduleTest } from "./screentest.js"
import { state, updateState as update } from "./screenstate.js"

moduleTest("statemachine", (testCase) => {

  testCase("should change state when next state is set", (assertThat) => {
    state.current = "A"
    state.next = "B"

    update()

    assertThat(state.current).is("B")
  })

  testCase("should not change state when no next state is set", (assertThat) => {
    state.current = "A"
    state.next = null

    update()

    assertThat(state.current).is("A")
  })
})
