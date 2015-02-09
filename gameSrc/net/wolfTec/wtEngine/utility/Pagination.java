package net.wolfTec.wtEngine.utility;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;

public class Pagination {

	public int									page;
	public final Array<Object>	list;
	public final Array<Object>	entries;
	public final Callback0			updateFn;

	public Pagination(Array<Object> list, int pageSize, Callback0 updateFn) {
		this.page = 0;
		this.list = list;

		Object nullObj = null;
		this.entries = JSCollections.$array();
		while (pageSize > 0) {
			this.entries.push(nullObj);
			pageSize--;
		}

		this.updateFn = updateFn;
	}

	/**
	 * Selects a page from the list. The entries of the selected page will be
	 * saved in the **entries** property of the pagination object.
	 *
	 * @param index
	 */
	public void selectPage(int index) {
		int PAGE_SIZE = this.entries.$length();

		if (index < 0 || index * PAGE_SIZE >= this.list.$length()) {
			return;
		}

		this.page = index;

		index = (index * PAGE_SIZE);
		for (int n = 0; n < PAGE_SIZE; n++) {
			this.entries.$set(n, index + n >= this.list.$length() ? null : this.list.$get(index + n));
		}

		if (this.updateFn != null) {
			this.updateFn.$invoke();
		}
	}
}
