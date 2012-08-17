var phpjs = {

	array_filter : function(arr, func) {
		var retObj = {};
		for(var k in arr ) {
			if(func(arr[k])) {
				retObj[k] = arr[k];
			}
		}
		return retObj;
	},
	filemtime : function(file) {
		var headers = this.get_headers(file, 1);
		return (headers && headers['Last-Modified'] && Date.parse(headers['Last-Modified']) / 1000 ) || false;
	},
	get_headers : function(url, format) {
		var req = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
		if(!req) {
			throw new Error('XMLHttpRequest not supported.');
		}

		var tmp, headers, pair, i, j = 0;

		try {
			req.open('HEAD', url, false);
			req.send(null);
			if(req.readyState < 3) {
				return false;
			}
			tmp = req.getAllResponseHeaders();
			tmp = tmp.split('\n');
			tmp = this.array_filter(tmp, function(value) {
				return value.toString().substring(1) !== '';
			});
			headers = format ? {} : [];

			for(i in tmp ) {
				if(format) {
					pair = tmp[i].toString().split(':');
					headers[ pair.splice(0, 1)] = pair.join(':').substring(1);
				} else {
					headers[j++] = tmp[i];
				}
			}

			return headers;
			
		} catch ( err ) {
			return false;
		}
	}
};