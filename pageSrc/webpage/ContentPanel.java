package webpage;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback1;

import webpage.datatypes.BloggerPostsDesc;
import webpage.datatypes.BloggerPostsDesc.BloggerPostsItemDesc;
import webpage.datatypes.ContentPanelDesc;
import webpage.datatypes.NewsDesc;
import webpage.datatypes.NewsDesc.NewsItemDesc;
import bridge.Global;
import bridge.JQuery;

@Namespace("cwt") public class ContentPanel {

	public static final String SECTION_NAME = "#content";

	public static final String BLOGGER_GRAB_URL = "https://www.googleapis.com/blogger/v3/blogs/8771777547738195480/posts?fetchBodies=false&fetchImages=false&maxResults=4&key=AIzaSyBeLzkUGTUFQ0z5yEGeuF4c0d0i5Vhgc1Y";

	public ContentPanel(ContentPanelDesc desc) {
		buildElement(desc);
	}

	/**
	 * Builds the content panel. Some parts of it may initialize asynchrony.
	 * 
	 * @param desc
	 */
	private void buildElement(ContentPanelDesc desc) {
		String tmpContent;

		tmpContent = "<p class='cwtHeaderImage'>";
		tmpContent += "<img src='images/cwHoliday.png' />";
		tmpContent += "</p>";
		Global.$(SECTION_NAME).append(tmpContent);

		tmpContent = "<table class='prictureAndNewsTable' ><tbody><tr>";
		tmpContent += "<td><img class='currentVersionImage' src='" + desc.img + "'></td>";
		tmpContent += "<td class='newsBlock' ><img class='currentNewsWaitingImage' src='images/wait.gif'/></td>";
		tmpContent += "</tr></tbody></table>";
		Global.$(SECTION_NAME).append(tmpContent);

		Global.$(SECTION_NAME).append("<p class='uibuttonHolder'><a target='_blank' href='" + desc.link + "' class='uibutton'>Play v. " + desc.version + "</a></p>");

		// text section
		tmpContent = "<div class='currentVersionText'>";
		for (int i = 0; i < desc.text.$length(); i++) {
			tmpContent += "<p>" + desc.text.$get(i) + "</p>";
		}
		tmpContent += "</div>";
		Global.$(SECTION_NAME).append(tmpContent);

		// change log
		Global.$(SECTION_NAME).append("<p class='currentVersionChangelogHeader'>Changelog</p>");
		tmpContent = "<table class='currentVersionChangelog'><tbody>";
		for (int i = 0; i < desc.log.NEW.$length(); i++) {
			tmpContent += "<tr><td class='new'>NEW: </td><td>" + desc.log.NEW.$get(i) + "</td></tr>";
		}
		for (int i = 0; i < desc.log.CHANGED.$length(); i++) {
			tmpContent += "<tr><td class='changed'>CHANGED: </td><td>" + desc.log.CHANGED.$get(i) + "</td></tr>";
		}
		for (int i = 0; i < desc.log.FIXED.$length(); i++) {
			tmpContent += "<tr><td class='fixed'>FIXED: </td><td>" + desc.log.FIXED.$get(i) + "</td></tr>";
		}
		tmpContent += "</tbody></table>";
		Global.$(SECTION_NAME).append(tmpContent);

		// load blogger news asynchrony
		buildNews(Global.$(".newsBlock"));
	}

	/**
	 * Grabs the latest blogger news (or cached ones) and sets them as content
	 * into the given container.
	 * 
	 * @param container
	 */
	private void buildNews(final JQuery container) {
		Log.fine("Loading blogger posts");

		final Callback1<NewsDesc> renderNews = new Callback1<NewsDesc>() {
			public void $invoke(NewsDesc desc) {
				JQuery ul = Global.$(DomHelper.createList());
				for (int i = 0; i < desc.news.$length(); i++) {
					NewsItemDesc item = desc.news.$get(i);
					JQuery li = Global.$(DomHelper.createListEntry());
					li.html("<a target='_blank' title='Open article' href='" + item.url + "' >" + Global.moment(item.date, "YYYY-MM-DD HH:mm:ss.SSS-Z,ZZ").fromNow() + "<br/><span><i>" + item.title + "</i></span></a>");
					ul.append(li);
				}

				// remove waiting image and set content
				Global.$(".currentNewsWaitingImage").remove();
				container.append(ul);
			}
		};

		// check cache timestamp
		if (Global.localStorage.$get("newsEndDate") == JSGlobal.undefined || Global.moment().isAfter((String) Global.localStorage.$get("newsEndDate"))) {

			// get fresh news
			Global.$.get(BLOGGER_GRAB_URL, new Callback1<String>() {
				public void $invoke(String response) {
					try {
						BloggerPostsDesc desc = (BloggerPostsDesc) ((Object) response);

						// build cache entry
						NewsDesc cachEntry = new NewsDesc();
						cachEntry.news = JSCollections.$array();
						for (int i = 0; i < desc.items.$length(); i++) {
							BloggerPostsItemDesc item = desc.items.$get(i);
							NewsItemDesc newsItem = new NewsItemDesc();
							newsItem.date = item.published;
							newsItem.title = item.title;
							newsItem.url = item.url;

							cachEntry.news.push(newsItem);
						}

						// cache it
						Global.localStorage.$get("newsEndDate", Global.moment().add("m", 360));
						Global.localStorage.$get("newsData", JSGlobal.JSON.stringify(cachEntry));

						// render it
						renderNews.$invoke(cachEntry);

					} catch (Exception e) {
						ErrorHandler.doErrorHandling(e);
					}
				}
			});

		} else {
			// use cached news
			renderNews.$invoke((NewsDesc) JSGlobal.JSON.parse((String) Global.localStorage.$get("newsData")));
		}

	}
}
