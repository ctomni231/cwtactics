package cwt_repo_tapsi

import com.jslix.debug.MemoryTest;

class Test {

	static main(args) 
	{
		def i = new I()
		MemoryTest.printMemoryUsage "=> "
		1000000000.times{ i.i = 10 }
		MemoryTest.printMemoryUsage "=> "
	}
}

class I
{
	int i
}