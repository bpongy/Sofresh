<?php

function get_inline_image($src) {
	echo 'data:image/png;base64,'.base64_encode(file_get_contents(dirname(dirname(__FILE__)).'/img/'.$src));
}

// Copyright 2009 Google Inc. All Rights Reserved.
$GA_ACCOUNT = "MO-4571646-6";
$GA_PIXEL = "/php/ga.php";

function googleAnalyticsGetImageUrl() {
	global $GA_ACCOUNT, $GA_PIXEL;
	$url = "";
	$url .= $GA_PIXEL . "?";
	$url .= "utmac=" . $GA_ACCOUNT;
	$url .= "&utmn=" . rand(0, 0x7fffffff);
	
	$referer = $_SERVER["HTTP_REFERER"];
	$query = $_SERVER["QUERY_STRING"];
	$path = $_SERVER["REQUEST_URI"];
	
	if (empty($referer)) $referer = "-";
	$url .= "&utmr=" . urlencode($referer);
	
	if (!empty($path)) $url .= "&utmp=" . urlencode($path);
	$url .= "&guid=ON";
	
	return str_replace("&", "&amp;", $url);
}