n = 10000000
console.log("Start Coffee Test");

time = null
mIt = 0
while mIt < 15
	mIt++
	
	time = (new Date()).getTime()
			
	i for i in [1..10000000]

	time = (new Date()).getTime() - time
	console.log("#{time}ms needed for #{n} iterations")