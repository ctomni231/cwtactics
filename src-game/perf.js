doTest(10000)
doTest(100000000)

function doTest(N) {
	console.log('N : ' + N);

	const timeUse = start => Date.now() - start

	let start
	let obj = {}
	let theSet = new Set();
	
	start = Date.now();
	/***********************************/
	for (let i = 0; i < N; i++) {
		let v = i % 20;
		if (!theSet.has(v))
			theSet.add(v);
	}
	/***********************************/
	console.log('section 1 ADD : ' + timeUse(start));

	start = Date.now();
	/***********************************/
	for (let i = 0; i < N; i++) {
		let v = i % 20;
		theSet.has(v)
	}
	/***********************************/
	console.log('section 1 HAS : ' + timeUse(start));

	start = Date.now();
	/***********************************/
	for (let i = 0; i < N; i++) {
		let v = i % 20;
		if (!obj[v])
			obj[v] = 1;
	}
	/***********************************/
	console.log('section 2 SET : ' + timeUse(start));

	start = Date.now();
	/***********************************/
	for (let i = 0; i < N; i++) {
		let v = i % 20;
		obj[v]
	}
	/***********************************/
	console.log('section 2 GET : ' + timeUse(start));
}