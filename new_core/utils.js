
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

export function iterateMatrix(width, height, handler) {
  for (let indexWidth = 0; indexWidth < width; indexWidth++) {
    for (let indexHeight = 0; indexHeight < height; indexHeight++) {
      handler(indexWidth, indexHeight)
    }
  }
}

export function numberOrBoundary(leftBoundary, rightBoundary, number) {
  return (number < leftBoundary ? leftBoundary : (number > rightBoundary ? rightBoundary : number))
}