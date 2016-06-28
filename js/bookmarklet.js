(function(){
	window.soFreshBookmarklet = { version: '1.1.0' };
	var script = document.createElement('script');
	script.setAttribute('src', location.protocol + '//sofresh.redpik.net/s/latest/sofresh.js');
	var head = document.getElementsByTagName('head');
	head[0].appendChild(script);
})();