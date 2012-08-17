<?php
header('Content-Type: text/javascript; charset=UTF-8');
$baseUrl = 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['REQUEST_URI']);
?>
/*!
 * soFresh v0.2
 * Based on CSSrefresh v1.0.1
 * 
 * Features:
 *  - Refresh only local CSS files
 *  - Advanced bookmarklet with UI
 * 
 * jQuery:
 *  - Copyright (c) jquery.com
 *  - http://jquery.org/license
 * 
 * phpjs:
 *  - MIT + GPL: http://phpjs.org/pages/license
 *  - http://phpjs.org/
 * 
 * CSSrefresh:
 *  - Copyright (c) 2012 Fred Heusschen
 *  - http://www.frebsite.nl/
 *  
 * soFresh:
 *  - Copyright (c) 2012 Benjamin Pongy & Nicolas Sorosac & Sylvain Gougouzian
 *  - http://www.axome.com/
 * 
 * Dual licensed under the MIT and GPL licenses:
 *  - http://en.wikipedia.org/wiki/MIT_License
 *  - http://en.wikipedia.org/wiki/GNU_General_Public_License
 * 
 * TODO Refresh a file when checked
 * TODO List distant files (don't hide them, just use a different class)
 * TODO Add a custom CSS input text at the bottom of the widget
 */
(function(){
	
	<?php include_once dirname(__FILE__).'/js/jquery.js'; ?>

	<?php include_once dirname(__FILE__).'/js/php.js'; ?>
	
	$sf = jQuery.noConflict(true);
	
	// CSS
	$sf('head').append('<link rel="stylesheet" type="text/css" href="<?php echo $baseUrl; ?>/css/sofresh.css" />');
	
	var sofreshHTML = 
		'<div id="sofresh" class="expanded" style="display:none">'+ 
			'<div>'+
				'<div id="sofresh_header">'+
					'<span id="sofresh_check"></span>'+
					'<span id="sofresh_title"><i></i>soFresh!</span>'+
					'<span id="sofresh_content_toggler" class="arrow inverted">→</span>'+
				'</div>'+
				'<div id="sofresh_content">'+
					'<div id="sofresh_content_actions">'+
						'<a href="#" id="sofresh_check_all"><strong>☑</strong> all</a>'+
						' | '+
						'<a href="#" id="sofresh_uncheck_all"><strong>☒</strong> all</a>'+
						' | '+
						'<a href="#" id="sofresh_hide_inactive"><span class="show">show</span><span class="hide">hide</span> <strong>☒</strong></a>'+
					'</div>'+
				'</div>'+
				'<div id="sofresh_footer">'+
					'<a href="http://sofresh.redpik.net/">soFresh!</a> by <a href="http://nicolas.sorosac.fr/">Nico</a>, <a href="http://www.redpik.net/">Ben</a> &amp; <a href="http://sylvain.gougouzian.fr/">GouZ</a>'+
				'</div>'+
			'</div>'+
		'</div>';
	
	$sf(document.body).append(sofreshHTML);
	
	/**
	 * soFresh
	 */
	window.soFresh = function(){

		this.initialized = false;
		this.container = $sf('#sofresh');
		this.reloadTimeout = null;
		this.reloadDelay = 1000;
		this.links = [];
		this.active_files = [];
		this.expanded = true;
		this.hideInactive = false;
		this.position = { left: 0, top: 0 };

		this.reloadFile = function(links) {
			clearTimeout(this.reloadTimeout);
			for (var a = 0, l = links.length; a < l; a++) {
				var link = links[a], newTime = phpjs.filemtime(this.getRandom(link.href));
				// has been checked before or first try
				if (link.last || !this.initialized) {
					// has been changed or first try
					if (link.last != newTime || !this.initialized) {
						// reload
						link.elem.setAttribute('href', this.getRandom(this.getHref(link.elem)));
						if (this.initialized){
							elem = $sf('#sofresh_links label[for="sofresh_link_' + $sf(link.elem).data('sofresh-link') + '"]').parents('li');
							elem.addClass('sofresh-highlight');
							setTimeout(function(){ elem.removeClass('sofresh-highlight'); }, 500);
						}
					}
				}
				// set last time checked
				link.last = newTime;
			}
			if (!this.initialized) this.initialized = true;
			this.reloadTimeout = setTimeout(function(){
				this.reloadFile(links);
			}, this.reloadDelay);
		};

		this.getHref = function(f){
			return f.getAttribute('href');
		};

		this.isLocalHref = function(href){
			if (href == null) return false;
			var bootstrapRegexp = /bootstrap(-responsive)?(\.min)?\.css/i;
			return !(
				(href.indexOf('//') > -1 && href.indexOf('//') <= 6 && href.indexOf('//'+location.hostname+'/') == -1) ||
				href.indexOf('<?php echo $baseUrl; ?>') > -1 ||
				href.indexOf('chrome-extension://') > -1 ||
				href.indexOf('data:text/css') > -1 ||
				bootstrapRegexp.test(href)
			);
		};

		this.getFiletime = function (cssFile) {
			var time = 0;
			$.ajax({
				type: "HEAD",
				async: true,
				url:  cssFile,
				success: function(message,text,response){
					time = response.getResponseHeader('Last-Modified');
				}
			});
			return time;
		};

		this.getRandom = function(f){
			if (f.indexOf('?') > -1)
				return f + '&x=' + Math.random();
			else
				return f + '?x=' + Math.random();
		};

		this.setCookie = function(name, value){
			var argv    = this.setCookie.arguments;
			var argc    = this.setCookie.arguments.length;
			var expires = (argc > 2) ? argv[2] : null;
			var path    = (argc > 3) ? argv[3] : null;
			var domain  = (argc > 4) ? argv[4] : null;
			var secure  = (argc > 5) ? argv[5] : false;
			document.cookie = name+"="+escape(value) +
				(expires == null  ? "" : "; expires="+expires.toGMTString()) +
				(path    == null  ? "" : "; path="+path) +
				(domain  == null  ? "" : "; domain="+domain) +
				(secure  == false ? "" : "; secure");
		};

		this.getCookieVal = function(offset){
			var endstr = document.cookie.indexOf (";", offset);
			if (endstr==-1) endstr=document.cookie.length;
			return unescape(document.cookie.substring(offset, endstr));
		};

		this.getCookie = function(name){
			var arg  = name+"=";
			var alen = arg.length;
			var clen = document.cookie.length;
			var i = 0;
			while (i<clen) {
				var j = i+alen;
				if (document.cookie.substring(i, j)==arg) return this.getCookieVal(j);
				i = document.cookie.indexOf(" ",i)+1;
				if (i==0) break;
			}
			return null;
		};
		
		this.initDragAndDrop = function() {
			var self = this,
				initX = false,
				initY = false;
			$sf(document).bind('mousemove', function(event){
				if (self.container.hasClass('movable')) {
					event.preventDefault();
					if (!initX) initX = event.pageX;
					if (!initY) initY = event.pageY;
					var thisX = event.pageX - initX;
					var thisY = event.pageY - initY;
					initX = event.pageX;
					initY = event.pageY;
					$sf('.movable').css({ left: '+=' + thisX, top: '+=' + thisY });
				}
			});
			$sf('#sofresh_header').bind('mousedown', function(event){
				event.preventDefault();
				self.container.addClass('movable');
			}).bind('mouseup', function(){
				self.container.removeClass('movable');
				initX = false;
				initY = false;
				var position = self.container.position();
				self.position = {
					top:  position.top  - $sf(document).scrollTop(),
					left: position.left - $sf(document).scrollLeft()
				};
				self.saveState();
			});
		};
		
		this.toggleContent = function(){
			$sf('#sofresh_content').slideToggle(250, 'linear');
			this.container.toggleClass('expanded');
			this.container.toggleClass('collapsed');
			this.expanded = this.container.hasClass('expanded');
			this.saveState();
		};

		this.checkAll = function(){
			$sf('#sofresh_links input:checkbox').attr('checked', 'checked').first().trigger('change');
			return false;
		};

		this.uncheckAll = function(){
			$sf('#sofresh_links input:checkbox').removeAttr('checked').first().trigger('change');
			return false;
		};
		
		this.hideInactiveLinks = function(){
			if (this.hideInactive) {
				this.hideInactive = false;
				this.container.removeClass('hideInactive');
			} else {
				this.hideInactive = true;
				this.container.addClass('hideInactive');
			}
			return false;
		};

		this.saveState = function() {
			if (navigator.cookieEnabled) {
				var selected_files = [];
				$sf('#sofresh_links input:checked').each(function(){
					selected_files.push($sf(this).parents('li').attr('title'));
				});
				this.active_files = selected_files;
				var sofresh_state = {
					'active_files' : this.active_files.join(','),
					'expanded'     : this.expanded,
					'hideInactive' : this.hideInactive,
					'position'     : this.position
				};
				var date_exp = new Date();
				date_exp.setTime(date_exp.getTime()+(365*24*3600*1000));
				this.setCookie(
					'sofresh_state', JSON.stringify(sofresh_state), date_exp,
					location.pathname.substring(0, location.pathname.lastIndexOf('/')) +'/'
				);
			}
		};

		this.initState = function(){
			if (navigator.cookieEnabled) {
				var sofresh_state_cookie = this.getCookie('sofresh_state');
				if (sofresh_state_cookie !== null) {
					var sofresh_state = JSON.parse(sofresh_state_cookie);
					this.active_files = sofresh_state.active_files.split(',');
					this.expanded     = sofresh_state.expanded;
					this.hideInactive = sofresh_state.hideInactive;
					this.position     = sofresh_state.position;
				}
			}
			if (this.expanded === false) {
				this.container.removeClass('expanded').addClass('collapsed');
				$sf('#sofresh_content').hide();
			}
			if (this.hideInactive) {
				this.container.addClass('hideInactive');
			}
			this.container.css({ top: this.position.top, left: this.position.left });
		};

		// List CSS files and create the HTML list
		this.initFilesList = function(){
			
			var files = document.getElementsByTagName('link'), 
				html = '<ul id="sofresh_links">',
				baseUrl = location.protocol + '//' + location.host,
				i = 0;
			
			for (var a = 0, l = files.length; a < l; a++) {
				var elem = files[a], rel = elem.rel, filename = '', checked = '', liClass = '';
				if (typeof rel != 'string' || rel.length == 0 || rel == 'stylesheet') {
					var href = this.getHref(elem);
					if (href != null && this.isLocalHref(href)) {
						this.links.push({
							'elem' : elem,
							'href' : href,
							'last' : false
						});
						$sf(elem).data('sofresh-link', i);
						filename = href.split('/').pop();
						if (this.active_files !== null) {
							if ($sf.inArray(href, this.active_files) != -1) {
								checked = 'checked="checked"';
								liClass = 'sofresh-active';
							} else {
								checked = '';
								liClass = 'sofresh-inactive';
							}
						} else {
							checked = 'checked="checked"';
						}
						html += '<li title="' + href + '" class="' + liClass + '">';
							html += '<label for="sofresh_link_' + i + '">';
								html += '<input type="checkbox" name="sofresh_links_filters[]" id="sofresh_link_' + i + '" ' + checked + ' /> ';
								html += filename; 
							html += '</label>';
							html += '<a href="' + href + '" title="' + href + '" target="_blank" class="arrow">&rarr;</a>';
						html += '</li>';
						i++;
					} else {
						console.warn("[SoFresh] A non-local CSS file will not be resfreshed: " + href);
					}
				}
			}
			html += '</ul>';
			$sf('#sofresh_content').append(html);
		};

		this.initEvents = function(){
			$this = this;
			// - Update the array of CSS files to reload
			// - Define startup cookie
			$sf('#sofresh_links input:checkbox').on('change', function(){
				var inputs = $sf('#sofresh_links input');
				var checked_links = [];
				var $input;
				inputs.each(function(j,input){
					$input = $sf(input);
					if ($input.is(':checked')) {
						checked_links.push(links[j]);
						$input.parents('li').first().removeClass('sofresh-inactive').addClass('sofresh-active');
					} else {
						$input.parents('li').first().removeClass('sofresh-active').addClass('sofresh-inactive');
					}
				});
				$this.saveState();
				$this.reloadFile(checked_links);
			}).trigger('change');
			// UI events
			$sf('#sofresh_content_toggler').on('click', function(){ $this.toggleContent() });
			$sf('#sofresh_check_all').on('click', { links: this.links }, this.checkAll);
			$sf('#sofresh_uncheck_all').on('click', { links: this.links }, this.uncheckAll);
			$sf('#sofresh_hide_inactive').on('click', function(){ $this.hideInactiveLinks() });
		};
		
		this.initState();
		this.initFilesList();
		this.initEvents();
		this.initDragAndDrop();
	};

	window.soFresh();

})();
