import { moduleTest } from "../screentest.js"
import { input } from "../screenstate.js"
import { mapping, update } from "./input.js"

function fakeKeyDown(key) {
  document.onkeydown({ key: "A" , preventDefault : () => {} })
}

function fakeKeyUp(key) {
  document.onkeydown({ key: "A" , preventDefault : () => {} })
}

moduleTest("jsinput", (testCase, beforeEach) => {

  testCase("should not transfer key state before next update", (assertThat) => {
    mapping.keyboard.A = "ACTION"
    input.ACTION = false

    fakeKeyDown("A")

    assertThat(input.ACTION).is(false)
  })

  testCase("should register key click", (assertThat) => {
    mapping.keyboard.A = "ACTION"
    input.ACTION = false

    fakeKeyDown("A")

    update()

    assertThat(input.ACTION).is(true)
  })

  testCase("should deregister key click", (assertThat) => {
    mapping.keyboard.A = "ACTION"
    input.ACTION = false

    fakeKeyDown("A")

    update()

    fakeKeyUp("A")

    update()

    assertThat(input.ACTION).is(false)
  })

  testCase("should ignore repeated clicks", (assertThat) => {
    mapping.keyboard.A = "ACTION"
    input.ACTION = false

    fakeKeyDown("A")
    fakeKeyDown("A")

    update()

    assertThat(input.ACTION).is(true)
  })

  testCase("should not toggle the action when two keys trigger the action", (assertThat) => {
    mapping.keyboard.A = "ACTION"
    mapping.keyboard.B = "ACTION"
    input.ACTION = false

    fakeKeyDown("A")
    fakeKeyDown("B")

    update()

    assertThat(input.ACTION).is(true)
  })

  testCase("should not release action when still one key triggers the action", (assertThat) => {
    mapping.keyboard.A = "ACTION"
    mapping.keyboard.B = "ACTION"
    input.ACTION = false

    fakeKeyDown("A")
    fakeKeyDown("B")

    update()

    fakeKeyUp("A")

    update()

    assertThat(input.ACTION).is(true)
  })

  beforeEach(() => {
    delete mapping.keyboard.A
    delete mapping.keyboard.B
  })
})
