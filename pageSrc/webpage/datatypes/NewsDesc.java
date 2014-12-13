package webpage.datatypes;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.annotation.SyntheticType;

@Namespace("cwt") @SyntheticType public class NewsDesc {
	@SyntheticType public static class NewsItemDesc {
		public String title;
		public String url;
		public String date;
	}
	
	public Array<NewsItemDesc> news;
}
