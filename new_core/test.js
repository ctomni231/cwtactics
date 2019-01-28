const moduleTests = {}

function assert (errorPool, expression, msg) {
  if (!expression) {
    errorPool.push(msg)
  }
}

function assertThat (errorPool, value) {
  const assertWithPool = assert.bind(null, errorPool)
  return {
    is: (expected) => assertWithPool(value === expected, value + " expected to be " + expected) 
  }
}

export function executeModuleTests () {
  Object.keys(moduleTests).forEach(moduleName => {
    
    console.log("[TEST] start module test " + moduleName)
    
    moduleTests[moduleName].testCases.forEach(test => {
      const errorPool = []

      console.log("[TEST][" + moduleName + "] execute test case " + test.name)

      moduleTests[moduleName].beforeEach()
      test.func(assertThat.bind(null, errorPool))

      console.log("[TEST][" + moduleName + "]", errorPool.length === 0 ? "PASSED" : "FAILED")
      
      errorPool.forEach(err => console.log(" =>", err))
    })

    console.log("[TEST][" + moduleName + "] completed module test")
  })
}

export function moduleTest (moduleName, moduleTestFunction) {

  if (moduleTests[moduleName]) {
    throw new Error("module tests for " + moduleName + " already defined")
  }

  const testCases = []
  let beforeEach = () => {}

  moduleTests[moduleName] = { testCases , beforeEach }

  const defineTestCase = (testCaseName, testFunction) => {
    testCases.push({
      name: testCaseName,
      func: testFunction
    })
  }

  const defineBeforeEach = (beforeEachFunction) => {
    beforeEach = beforeEachFunction
  }

  moduleTestFunction(defineTestCase, defineBeforeEach)
}