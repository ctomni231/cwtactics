import { moduleTest } from "./test.js"
import { input as inputData } from "./state.js"
import { update } from "./input.js"

function fakeKeyDown(key) {
  document.onkeydown({ key: "A" , preventDefault : () => {} })
}

function fakeKeyUp(key) {
  document.onkeydown({ key: "A" , preventDefault : () => {} })
}

moduleTest("input", (testCase, beforeEach) => {

  testCase("should not transfer key state before next update", (assertThat) => {
    inputData.mapping.keyboard.A = "ACTION"
    inputData.status.ACTION = false

    fakeKeyDown("A")

    assertThat(inputData.status.ACTION).is(false)
  })

  testCase("should register key click", (assertThat) => {
    inputData.mapping.keyboard.A = "ACTION"
    inputData.status.ACTION = false

    fakeKeyDown("A")

    update()

    assertThat(inputData.status.ACTION).is(true)
  })

  testCase("should deregister key click", (assertThat) => {
    inputData.mapping.keyboard.A = "ACTION"
    inputData.status.ACTION = false

    fakeKeyDown("A")

    update()

    fakeKeyUp("A")

    update()

    assertThat(inputData.status.ACTION).is(false)
  })

  testCase("should ignore repeated clicks", (assertThat) => {
    inputData.mapping.keyboard.A = "ACTION"
    inputData.status.ACTION = false

    fakeKeyDown("A")
    fakeKeyDown("A")

    update()

    assertThat(inputData.status.ACTION).is(true)
  })

  testCase("should not toggle the action when two keys trigger the action", (assertThat) => {
    inputData.mapping.keyboard.A = "ACTION"
    inputData.mapping.keyboard.B = "ACTION"
    inputData.status.ACTION = false

    fakeKeyDown("A")
    fakeKeyDown("B")

    update()

    assertThat(inputData.status.ACTION).is(true)
  })

  testCase("should not release action when still one key triggers the action", (assertThat) => {
    inputData.mapping.keyboard.A = "ACTION"
    inputData.mapping.keyboard.B = "ACTION"
    inputData.status.ACTION = false

    fakeKeyDown("A")
    fakeKeyDown("B")

    update()

    fakeKeyUp("A")
    
    update()

    assertThat(inputData.status.ACTION).is(true)
  })

  beforeEach(() => {
    delete inputData.mapping.keyboard.A
    delete inputData.mapping.keyboard.B
  })
})