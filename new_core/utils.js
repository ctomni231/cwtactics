
export function createList(numberOfEntries, defaultValueSupplier) {
  const array = []

  for (let i = numberOfEntries - 1; i >= 0; i--) {
    array.push(defaultValueSupplier(i))
  }

  return array
}

export function zipLists(listA, listB, combiner) {
  const array = []

  for (let indexA = 0; indexA < listA.length; indexA++) {
    for (let indexB = 0; indexB < listB.length; indexB++) {
      array.push(combiner(listA[indexA], listB[indexB]))
    }
  }

  return array
}