(function() {

	// browser type & version
	var ua = window.navigator.userAgent.toLowerCase();
	var mobile = /mobile|android|kindle|silk|midp|(windows nt 6\\.2.+arm|touch)/
			.test(ua);

	// http://www.zytrax.com/tech/web/browser_ids.htm
	// http://www.zytrax.com/tech/web/mobile_ids.dom

	// Chrome & Firefox
	var data = /(chrome|firefox)[ \/]([\w.]+)/.exec(ua) ||
	// Mobile IOS
	/(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
	// Mobile Webkit
	/(android)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
	// Safari & Opera
	/(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
	// Internet Explorer
	/(msie) ([\w.]+)/.exec(ua) || [];

	var browser = data[1], 
	var version = parseFloat(data[2]);

	switch (browser) {
	case 'msie':
		browser = 'ie';
		version = doc.documentMode || version;
		break;

	case 'firefox':
		browser = 'ff';
		break;

	case 'ipod':
	case 'ipad':
	case 'iphone':
		browser = 'ios';
		break;

	case 'webkit':
		browser = 'safari';
		break;
	}

	// Browser vendor and version
	Browser = {
		name : browser,
		mobile : mobile,
		version : version
	};

	// Shortcut
	Browser[browser] = true;
}());