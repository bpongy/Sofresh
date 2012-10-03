(function(){
	if (location.protocol == 'https:')
		alert('SoFresh does not provide support for HTTPS protocol yet :-( Read more at http://sofresh.redpik.net/');
	else {
		window.sofreshBookmarklet = { version: '1.0.0' };
		var script = document.createElement('script');
		script.setAttribute('src', 'http://sofresh.redpik.net/s/latest/sofresh.js');
		var head = document.getElementsByTagName('head');
		head[0].appendChild(script);
	}
})();