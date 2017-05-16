/**
  Creates a core module with functional tools. 
 */
const createCoreModule = (function() {

  const Stream = list => ({
    map: f => Stream(list.map(f)),
    filter: f => Stream(list.filter(f)),
    includes: n => list.includes(n),
    forEach: f => list.forEach(f),
    every: predicate => list.every(predicate),
    some: predicate => list.some(predicate),
    take: n => [],
    head: () => list[0],
    tail: () => list[list.length - 1],
    toObject: f => list.map(f).reduce(zip, {}),
    toList: () => list,
    toString: () => list.toString()
  })

  Stream.range = (from, to) => Stream(Array.from({
    length: (to - from)
  }, (v, k) => k + from))


  const validate = (spec, namespace = "") => 
    (value, root = value) => Object
      .keys(spec)
      .map(key => {
        switch (typeof spec[key]) {
          case "function":
            return !spec[key](value[key], value, root) ? namespace + key : null
          case "object":
            // TODO array support
            return validate(spec[key], namespace + key + ".")(value[key], root)
          default:
            return namespace + key + "(illegal)"
        }
      })
      .filter(v => !!v)
      .reduce((result, value) => result.concat(value), [])

  const guard = (expr, msg) => {
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

  // ==================================================================

  return {
    Stream, guard, validate
  }

}())