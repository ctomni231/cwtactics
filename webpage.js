stjs.ns("cwt");
cwt.GithubMilestoneDesc = function() {};
stjs.extend(cwt.GithubMilestoneDesc, null, [], null, {});

stjs.ns("cwt");
cwt.EventHandler = function() {};
stjs.extend(cwt.EventHandler, null, [], function(constructor, prototype) {
    /**
     *  Registers an event handler which will be invoked every time the event with
     *  the given name will be triggered.
     *  
     *  @param name
     *  @param callback
     */
    constructor.onEvent = function(name, callback) {
        $(window.document).on(name, callback);
    };
    /**
     *  Fires an event and invokes all event handlers.
     *  
     *  @param name
     *  @param data
     */
    constructor.fireEvent = function(name, data) {
        $(window.document).trigger(name, data);
    };
}, {});

stjs.ns("cwt");
cwt.Log = function() {};
stjs.extend(cwt.Log, null, [], function(constructor, prototype) {
    constructor.fine = function(msg) {
        console.log("INFO: " + msg);
    };
    constructor.warn = function(msg) {
        console.log("WARN: " + msg);
    };
    constructor.error = function(msg) {
        console.log("ERROR: " + msg);
    };
}, {});

var DomHelper = function() {};
stjs.extend(DomHelper, null, [], function(constructor, prototype) {
    constructor.createLink = function() {
        return window.document.createElement("a");
    };
    constructor.createList = function() {
        return window.document.createElement("ul");
    };
    constructor.createListEntry = function() {
        return window.document.createElement("li");
    };
}, {});

var ErrorHandler = function() {};
stjs.extend(ErrorHandler, null, [], function(constructor, prototype) {
    /**
     *  Writes an error message to the document body.
     *  
     *  @param e
     */
    constructor.doErrorHandling = function(e) {
        window.document.writeln("An error occurred.<br/><br/>" + e + "<br/><br/><br/>Please contact us about this fault (<a href='mailto:ctomni231@gmail.com'>ctomni231@gmail.com</a>).");
    };
}, {});

stjs.ns("cwt");
cwt.BloggerPostsDesc = function() {};
stjs.extend(cwt.BloggerPostsDesc, null, [], function(constructor, prototype) {
    constructor.BloggerPostsItemDesc = function() {};
    stjs.extend(cwt.BloggerPostsDesc.BloggerPostsItemDesc, null, [], function(constructor, prototype) {
        prototype.title = null;
        prototype.url = null;
        prototype.published = null;
    }, {});
    prototype.items = null;
}, {items: {name: "Array", arguments: ["cwt.BloggerPostsDesc.BloggerPostsItemDesc"]}});

stjs.ns("cwt");
cwt.DialogDesc = function() {};
stjs.extend(cwt.DialogDesc, null, [], function(constructor, prototype) {
    prototype.id = null;
    prototype.title = null;
    prototype.text = null;
}, {text: {name: "Array", arguments: [null]}});

stjs.ns("cwt");
cwt.NewsDesc = function() {};
stjs.extend(cwt.NewsDesc, null, [], function(constructor, prototype) {
    constructor.NewsItemDesc = function() {};
    stjs.extend(cwt.NewsDesc.NewsItemDesc, null, [], function(constructor, prototype) {
        prototype.title = null;
        prototype.url = null;
        prototype.date = null;
    }, {});
    prototype.news = null;
}, {news: {name: "Array", arguments: ["cwt.NewsDesc.NewsItemDesc"]}});

stjs.ns("cwt");
cwt.NavBarLinkDesc = function() {};
stjs.extend(cwt.NavBarLinkDesc, null, [], function(constructor, prototype) {
    prototype.id = null;
    prototype.link = null;
    prototype.label = null;
    prototype.title = null;
    prototype.sameWindow = false;
    prototype.isDialog = false;
}, {});

stjs.ns("cwt");
cwt.ContentPanelDesc = function() {};
stjs.extend(cwt.ContentPanelDesc, null, [], function(constructor, prototype) {
    constructor.ChangelogDesc = function() {};
    stjs.extend(cwt.ContentPanelDesc.ChangelogDesc, null, [], function(constructor, prototype) {
        prototype.NEW = null;
        prototype.CHANGED = null;
        prototype.FIXED = null;
    }, {NEW: {name: "Array", arguments: [null]}, CHANGED: {name: "Array", arguments: [null]}, FIXED: {name: "Array", arguments: [null]}});
    prototype.header = null;
    prototype.version = null;
    prototype.subHeaderT = null;
    prototype.subHeaderB = null;
    prototype.text = null;
    prototype.img = null;
    prototype.link = null;
    prototype.log = null;
}, {text: {name: "Array", arguments: [null]}, log: "cwt.ContentPanelDesc.ChangelogDesc"});

stjs.ns("cwt");
cwt.Dialog = function(desc) {
    cwt.Log.fine("Construct dialog " + desc.id);
    this.id = desc.id;
    var options = this.buildOptions(desc);
    $(cwt.Dialog.SECTION_NAME).append(this.buildContent(desc));
    $("#" + this.id).dialog(options);
};
stjs.extend(cwt.Dialog, null, [], function(constructor, prototype) {
    constructor.SECTION_NAME = "#dialogs";
    prototype.id = null;
    prototype.buildContent = function(desc) {
        var dialogDiv = window.document.createElement("div");
        dialogDiv.id = desc.id;
        for (var i = 0; i < desc.text.length; i++) {
            $(dialogDiv).append("<p>" + desc.text[i] + "</p>");
        }
        return dialogDiv;
    };
    prototype.buildOptions = function(desc) {
        var that = this;
        var options = {};
        options.modal = true;
        options.autoOpen = false;
        options.closeOnEscape = false;
        options.resizable = false;
        options.draggable = true;
        options.width = 500;
        options.title = desc.title;
        options.show = {};
        options.show.effect = "fade";
        options.show.duration = 250;
        options.hide = {};
        options.hide.effect = "fade";
        options.hide.duration = 250;
        options.buttons = {};
        options.buttons["Ok"] = function() {
            that.close();
        };
        return options;
    };
    /**
     *  Shows the dialog
     */
    prototype.show = function() {
        cwt.Log.fine("Opening dialog " + this.id);
        $("#" + this.id).dialog("open");
    };
    /**
     *  Hides the dialog
     */
    prototype.close = function() {
        cwt.Log.fine("Closing dialog " + this.id);
        $("#" + this.id).dialog("close");
    };
}, {});

stjs.ns("cwt");
cwt.NavBarLink = function(desc) {
    cwt.Log.fine("Generate navigation bar link " + desc.id);
    this.ref = "#" + desc.id;
    this.buildElement(desc);
};
stjs.extend(cwt.NavBarLink, null, [], function(constructor, prototype) {
    constructor.SECTION_NAME = "#navbar";
    prototype.ref = null;
    /**
     *  Builds the navigation bar.
     *  
     *  @param desc
     */
    prototype.buildElement = function(desc) {
        var link = DomHelper.createLink();
        if (desc.isDialog == true) {
            link.href = "#";
            link.onclick = function(ev) {
                cwt.EventHandler.fireEvent("openDialog", [desc.link]);
                return false;
            };
        } else {
            link.href = desc.link;
            if (desc.sameWindow != true) {
                link.target = "_blank";
            }
        }
        link.title = desc.label;
        link.innerHTML = desc.label;
        $(cwt.NavBarLink.SECTION_NAME).append(link);
    };
    prototype.click = function() {
        $(this.ref).click();
    };
}, {});

stjs.ns("cwt");
cwt.ContentPanel = function(desc) {
    this.buildElement(desc);
};
stjs.extend(cwt.ContentPanel, null, [], function(constructor, prototype) {
    constructor.SECTION_NAME = "#content";
    constructor.BLOGGER_GRAB_URL = "https://www.googleapis.com/blogger/v3/blogs/8771777547738195480/posts?fetchBodies=false&fetchImages=false&maxResults=4&key=AIzaSyBeLzkUGTUFQ0z5yEGeuF4c0d0i5Vhgc1Y";
    /**
     *  Builds the content panel. Some parts of it may initialize asynchrony.
     *  
     *  @param desc
     */
    prototype.buildElement = function(desc) {
        var tmpContent;
        tmpContent = "<p class='cwtHeaderImage'>";
        tmpContent += "<img src='images/cwTactics.png' />";
        tmpContent += "</p>";
        $(cwt.ContentPanel.SECTION_NAME).append(tmpContent);
        tmpContent = "<table class='prictureAndNewsTable' ><tbody><tr>";
        tmpContent += "<td><img class='currentVersionImage' src='" + desc.img + "'></td>";
        tmpContent += "<td class='newsBlock' ><img class='currentNewsWaitingImage' src='images/wait.gif'/></td>";
        tmpContent += "</tr></tbody></table>";
        $(cwt.ContentPanel.SECTION_NAME).append(tmpContent);
        $(cwt.ContentPanel.SECTION_NAME).append("<p class='uibuttonHolder'><a target='_blank' href='" + desc.link + "' class='uibutton'>Play v. " + desc.version + "</a></p>");
        tmpContent = "<div class='currentVersionText'>";
        for (var i = 0; i < desc.text.length; i++) {
            tmpContent += "<p>" + desc.text[i] + "</p>";
        }
        tmpContent += "</div>";
        $(cwt.ContentPanel.SECTION_NAME).append(tmpContent);
        $(cwt.ContentPanel.SECTION_NAME).append("<p class='currentVersionChangelogHeader'>Changelog</p>");
        tmpContent = "<table class='currentVersionChangelog'><tbody>";
        for (var i = 0; i < desc.log.NEW.length; i++) {
            tmpContent += "<tr><td class='new'>NEW: </td><td>" + desc.log.NEW[i] + "</td></tr>";
        }
        for (var i = 0; i < desc.log.CHANGED.length; i++) {
            tmpContent += "<tr><td class='changed'>CHANGED: </td><td>" + desc.log.CHANGED[i] + "</td></tr>";
        }
        for (var i = 0; i < desc.log.FIXED.length; i++) {
            tmpContent += "<tr><td class='fixed'>FIXED: </td><td>" + desc.log.FIXED[i] + "</td></tr>";
        }
        tmpContent += "</tbody></table>";
        $(cwt.ContentPanel.SECTION_NAME).append(tmpContent);
        this.buildNews($(".newsBlock"));
    };
    /**
     *  Grabs the latest blogger news (or cached ones) and sets them as content
     *  into the given container.
     *  
     *  @param container
     */
    prototype.buildNews = function(container) {
        cwt.Log.fine("Loading blogger posts");
        var renderNews = function(desc) {
            var ul = $(DomHelper.createList());
            for (var i = 0; i < desc.news.length; i++) {
                var item = desc.news[i];
                var li = $(DomHelper.createListEntry());
                li.html("<a target='_blank' title='Open article' href='" + item.url + "' >" + moment(item.date, "YYYY-MM-DD HH:mm:ss.SSS-Z,ZZ").fromNow() + "<br/><span>" + item.title + "</span></a>");
                ul.append(li);
            }
            $(".currentNewsWaitingImage").remove();
            container.append(ul);
        };
        if (localStorage["newsEndDate"] == undefined || moment().isAfter(localStorage["newsEndDate"])) {
            $.get(cwt.ContentPanel.BLOGGER_GRAB_URL, function(response) {
                try {
                    var desc = (response);
                    var cachEntry = {};
                    cachEntry.news = [];
                    for (var i = 0; i < desc.items.length; i++) {
                        var item = desc.items[i];
                        var newsItem = {};
                        newsItem.date = item.published;
                        newsItem.title = item.title;
                        newsItem.url = item.url;
                        cachEntry.news.push(newsItem);
                    }
                    localStorage["newsEndDate"] = moment().add("m", 360);
                    localStorage["newsData"] = JSON.stringify(cachEntry);
                    renderNews(cachEntry);
                }catch (e) {
                    ErrorHandler.doErrorHandling(e);
                }
            });
        } else {
            renderNews(JSON.parse(localStorage["newsData"]));
        }
    };
}, {});

stjs.ns("cwt");
cwt.DataLoader = function() {};
stjs.extend(cwt.DataLoader, null, [], function(constructor, prototype) {
    /**
     *  Loads and Renders the dialogs.
     *  
     *  @param callback
     */
    constructor.loadDialogs = function(callback) {
        cwt.Log.fine("Loading dialogs");
        $.get("data/dialogs.json", function(response) {
            try {
                var dialogs = {};
                var dialogDescs = (typeof response) == "string" ? JSON.parse(response) : (response);
                for (var i = 0; i < dialogDescs.length; i++) {
                    dialogs[dialogDescs[i].id] = new cwt.Dialog(dialogDescs[i]);
                }
                callback(dialogs);
            }catch (e) {
                ErrorHandler.doErrorHandling(e);
            }
        });
    };
    /**
     *  Loads and Renders the content panel.
     *  
     *  @param callback
     */
    constructor.loadContentPanel = function(callback) {
        cwt.Log.fine("Loading content panel");
        $.get("data/content.json", function(response) {
            try {
                var desc = (typeof response) == "string" ? JSON.parse(response) : (response);
                callback(new cwt.ContentPanel(desc));
            }catch (e) {
                ErrorHandler.doErrorHandling(e);
            }
        });
    };
    /**
     *  Loads and Renders the navigation bar.
     *  
     *  @param callback
     */
    constructor.loadNavigationBar = function(callback) {
        cwt.Log.fine("Loading navigation bar");
        $.get("data/navigation.json", function(response) {
            try {
                var navLinks = {};
                var descs = (typeof response) == "string" ? JSON.parse(response) : (response);
                for (var i = 0; i < descs.length; i++) {
                    var desc = descs[i];
                    navLinks[desc.id] = new cwt.NavBarLink(desc);
                }
                callback(navLinks);
            }catch (e) {
                ErrorHandler.doErrorHandling(e);
            }
        });
    };
}, {});

stjs.ns("cwt");
cwt.WebPage = function() {};
stjs.extend(cwt.WebPage, null, [], function(constructor, prototype) {
    constructor.navigationBar = null;
    constructor.mainContent = null;
    constructor.dialogs = null;
    constructor.main = function(args) {
        cwt.Log.fine("Initializing webpage");
        window.document.title = "Custom Wars: Tactics";
        cwt.WebPage.loadStuff();
        cwt.WebPage.registerEvents();
    };
    /**
     *  Registers some global events.
     */
    constructor.registerEvents = function() {
        cwt.EventHandler.onEvent("openDialog", function(event, dialogName) {
            cwt.WebPage.dialogs[dialogName].show();
        });
    };
    /**
     *  Loads the stuff asynchrony.
     */
    constructor.loadStuff = function() {
        var tasks = [];
        tasks.push(function(next) {
            cwt.DataLoader.loadDialogs(function(dialogs) {
                cwt.WebPage.dialogs = dialogs;
                next();
            });
        });
        tasks.push(function(next) {
            cwt.DataLoader.loadContentPanel(function(panel) {
                cwt.WebPage.mainContent = panel;
                next();
            });
        });
        tasks.push(function(next) {
            cwt.DataLoader.loadNavigationBar(function(bar) {
                cwt.WebPage.navigationBar = bar;
                next();
            });
        });
        var loadingDone = function() {
            cwt.Log.fine("Webpage initialized");
            $("body").css("display", "");
        };
        R.series(tasks, loadingDone);
    };
}, {navigationBar: {name: "Map", arguments: [null, "cwt.NavBarLink"]}, mainContent: "cwt.ContentPanel", dialogs: {name: "Map", arguments: [null, "cwt.Dialog"]}});
if (!stjs.mainCallDisabled) 
    cwt.WebPage.main();

