package webpage.datatypes;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.annotation.SyntheticType;

@Namespace("cwt") @SyntheticType public class BloggerPostsDesc {

	@SyntheticType public class BloggerPostsItemDesc {
		public String title;
		public String url;
		public String published;
	}

	public Array<BloggerPostsItemDesc> items;
}
