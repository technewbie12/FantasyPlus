"use strict";chrome.runtime.onInstalled.addListener(function(a){if("install"===a.reason)ga("send","event","Install"),chrome.tabs.create({url:"install.html",active:!0},function(){});else if("update"===a.reason){var b=chrome.runtime.getManifest().version,c=b.split("."),d=c[0],e=c[1],f=a.previousVersion,g=f.split("."),h=g[0],i=g[1];(d>h||e>i)&&(ga("send","event","Update","from: "+f+" to: "+b),chrome.tabs.create({url:"settings.html",active:!0},function(){}))}}),chrome.runtime.onMessage.addListener(function(a,b){var c=a.request,d=a.value;"valid_site"===c?(ga("send","pageview",b.url),chrome.pageAction.show(b.tab.id)):"fetch_fail"===c&&ga("send","event","Fetch fail",d)}),jQuery.noConflict();function cleanHTML(a){var b=domParse.parseFromString(a,"text/html"),c=b.querySelectorAll("head, img, svg, link, style");return c.forEach(function(a){a.remove()}),b.documentElement.innerHTML}chrome.runtime.onMessage.addListener(function(a,b,c){var d=a.query,e=a.data;if("pos"===d){var f=e.url,g=e.custom_data.source_site;return jQuery.ajax(e).done(function(a){c(a)}).fail(function(){chrome.runtime.sendMessage({request:"fetch_fail",value:g}),c("error")}),!0}});