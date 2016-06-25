// () -> Int
cwt.random = (from, to) => cwt.just(from + parseInt(Math.random() * (to - from), 10));

// (a) -> just a | nothing
cwt.maybe = (value) => value == null || value == undefined ? nothing : cwt.just(value);

// (a) -> just a
cwt.just = (value) => ({
  map: (f) => cwt.just(f(value)),
  bind: (f) => f(value),
  filter(f) {
    return f(value) ? this : cwt.nothing();
  },
  isPresent: () => true,
  orElse: (v) => value,
  get: () => value,
  toString: () => "just(" + value + ")"
});

const nothing = cwt.immutable({
  map(f) {
      return this;
    },
    bind(f) {
      return this;
    },
    filter(f) {
      return this;
    },
    isPresent: () => false,
    orElse: (v) => v,
    get() {
      throw new Error("Nothing");
    },
    toString: () => "nothing"
});

// () -> nothing
cwt.nothing = () => nothing;
