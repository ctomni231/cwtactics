function x([x = 3, y = 2, ...rest] = []) {
	console.log(x + "-" + y + "-" + rest)
}

x()
x([1, 2, 3])