"use strict";siteType="yahoo";var url_base="//football.fantasysports.yahoo.com",url_nfl="f1";league_id=document.URL.match(new RegExp("/"+url_nfl+"/("+num_rgx+")"))[1],league_settings_url="//football.fantasysports.yahoo.com/"+url_nfl+"/"+league_id+"/settings",onMatchupPreviewPage=new RegExp("/"+url_nfl+"/"+num_rgx+"/matchup").test(document.URL),onClubhousePage=new RegExp("/"+url_nfl+"/"+num_rgx+"/"+num_rgx).test(document.URL),onFreeAgencyPage=new RegExp("/"+url_nfl+"/"+num_rgx+"/players").test(document.URL),hasProjTotals=onMatchupPreviewPage||onClubhousePage,hasPlayerTable=onClubhousePage||onFreeAgencyPage,hasProjectionTable=onMatchupPreviewPage||onClubhousePage||onFreeAgencyPage,base_table_selector="#team-roster",player_table_selector="table[id^=statTable]",player_table_body_selector="tbody",player_table_header_selector="thead tr",player_table_row_selector="tr:not(.empty-bench, empty-position)",player_name_selector="td.player",page_menu_selector="header div#full_stat_nav",pts_total_selector="span.proj-pts-week";var player_head,player_table_header_player_selector="th.player";onMatchupPreviewPage?(base_table_selector="#yspmaincontent",page_menu_selector="header span",pts_total_selector="section#matchup-header table tr:nth(1) td"):onFreeAgencyPage&&(base_table_selector="#players-table-wrapper",player_table_selector="table",page_menu_selector="",pts_total_selector=""),storageLeagueKey="fp_yahoo_league_data_"+league_id,storageLeagueUpdateKey="fp_yahoo_last_updated_league_"+league_id,storagePlayerKey="fp_yahoo_player_data_"+league_id,storageUpdateKey="fp_yahoo_last_updated_"+league_id,storageUpdateTypeKey="fp_yahoo_last_updated_type_"+league_id,storageTranslationKey="fp_yahoo_translation",storageTranslationUpdateKey="fp_yahoo_translation_updated",storageKeys.push(storageLeagueKey,storageLeagueUpdateKey,storagePlayerKey,storageUpdateKey,storageUpdateTypeKey,storageTranslationKey,storageTranslationUpdateKey),show_avg=!1,show_med=!1,show_current=!1,show_spark=!1,show_ros=!1,show_std=!1;var yahooIdsDone=jQuery.Deferred(),updated_translation=0,is_FA_current=!1;function fixPage(){remove_ads&&(jQuery(".df-ad").remove(),jQuery("#fantasyhero").remove(),jQuery("#gamepromo").remove(),jQuery("#survival-oneclick-promo").remove(),jQuery("#fantasytrophypromo, #fantasyshoppromo").remove(),jQuery(".Ad").parent().remove())}function setSelectors(){if(base_table=jQuery(base_table_selector),page_menu_selector&&(page_menu=base_table.find(page_menu_selector)),pts_total_selector&&(pts_total=base_table.find(pts_total_selector)),playerTable=base_table.find(player_table_selector),player_table_body=playerTable.find(player_table_body_selector),player_table_header=playerTable.find(player_table_header_selector),player_table_rows=player_table_body.find(player_table_row_selector),show_proj="undefined"==typeof user_settings.columns.proj||user_settings.columns.proj,show_rank="undefined"==typeof user_settings.columns.rank||user_settings.columns.rank,show_depth="undefined"==typeof user_settings.columns.depth||user_settings.columns.depth,onMatchupPreviewPage)player_table_header_proj_selector="th:contains(Proj)";else if(onFreeAgencyPage){is_FA_current=!1;var a=window.location.search,b=getParams(a),c=b.hasOwnProperty("stat1")?b.stat1[0]:"";if(!/^S_P/.test(c))player_table_header_proj_selector="th:contains(Nothing to see here)",show_proj=!1,show_rank=!1;else if(player_table_header_proj_selector="th:contains(Fan Pts)",/^S_PW_/.test(c)){var d=parseInt(c.split("_").reverse()[0]);isNaN(d)||d!==current_week||(is_FA_current=!0)}}else{player_table_header_proj_selector="th:contains(Proj Pts)";var e=page_menu.find("div.navlist:first li.Selected:first a").attr("id");if("P"===e||"GDD"===e){var f=page_menu.find("div#statsubnav ul#"+("subnav_"+e)+" li.Selected:first a").attr("href"),g=getParams(f),h=g.hasOwnProperty("stat2")?g.stat2[0]:"";"P"===e&&"PW"===h?player_table_header_proj_selector="th:contains(Fan Pts)":"GDD"===e&&"D"===h&&(player_table_header_proj_selector="th:contains(Rank)")}else"K"===e&&(show_proj=!1,player_table_header_proj_selector="th:contains(This Week)")}proj_head=player_table_header.find(player_table_header_proj_selector),player_head=player_table_header.find(player_table_header_player_selector),onMatchupPreviewPage&&(show_rank=!1,show_ros=!1,show_depth=!1,show_spark=!1,show_avg=!1,show_med=!1,show_current=!1);var i=proj_head.first();header_index=i.index(),i.prevAll("th, td").each(function(){header_index+=this.colSpan-1})}function getYahooIds(){storage_translation_data={},jQuery.getJSON(chrome.extension.getURL("data/yahoo_ids.json")).done(function(a){storage_translation_data=a,dlog.log("yahoo IDs done"),yahooIdsDone.resolve(),updated_translation=current_time;var b={};b[storageTranslationKey]=storage_translation_data,b[storageTranslationUpdateKey]=updated_translation,chrome.storage.local.set(b)}).fail(function(a,b,c){var d=b+", "+c;dlog.log("Could not fetch yahoo ID data"),dlog.log(d),chrome.runtime.sendMessage({request:"fetch_fail",value:d})})}override(assignDataFromStorage,"_resolve",applyBefore(function(){onMatchupPreviewPage||onFreeAgencyPage?(storage_translation_data=this.r[storageTranslationKey],isObj(storage_translation_data)?(updated_translation=this.r[storageTranslationUpdateKey],isDataCurrent("translation")?(dlog.log("Using cache for yahoo ID data"),dlog.log("yahoo IDs done"),yahooIdsDone.resolve()):(dlog.log("Yahoo ID data too old, Updated time: "+updated_translation+", Current Time: "+current_time),getYahooIds())):(dlog.log("Could not find yahoo ID data"),storage_translation_data={},updated_translation=0,getYahooIds())):(dlog.log("yahoo IDs done"),yahooIdsDone.resolve())})),override(runGetAllData,"run",function(a){return function(){jQuery.when(yahooIdsDone).done(function(){a.apply(this,arguments)})}});function addColumns(){if(canAddColumns()){var a=jQuery("<th class=\""+fp+" "+fp+"Projections "+fp+"ProjectionsHeader\" title=\"Consensus point projections from FantasyPros (via "+fp+")\"></th>"),b=jQuery("<td class=\"Ta-end "+fp+" "+fp+"Projections "+fp+"ProjectionsData\">"+loadingDiv+"</td>");if(onMatchupPreviewPage){if(!show_proj)return;a.css({width:"38px"}),a.addClass("Ta-end Va-top"),a.append("<div style=\"width: 40px;\">Proj (FP)</div>"),b.css({width:"38px"}),b.addClass("Alt F-shade Va-top");var c=jQuery("<td style=\"width: 38px;\" class=\"Alt Ta-end F-shade Va-top "+fp+" "+fp+"Projections "+fp+"ProjectionsTotal\">-</td>");playerTable.each(function(){var d=jQuery(this),e=d.find("thead th"),f=e.length,g=e.filter(function(){return"Proj"===jQuery(this).text()}),h=jQuery(g[0]),i=jQuery(g[1]),j=h.index(),k=i.index();h.after(a.clone()),i.before(a.clone());var m=b,l=d.find("tbody tr"),n=l.length;l.each(function(a){var b=jQuery(this),d=b.find("td"),e=f-d.length;a+1===n&&(m=c),d.eq(j).after(m.clone()),d.eq(k-e).before(m.clone())})})}else{a.css({width:"40px","text-align":"center"}),a.text("Proj (FP)");var d=jQuery("<th style=\"width: 40px; text-align: center;\" class=\""+fp+" "+fp+"Rankings "+fp+"RankingsHeader\" title=\"Projected position rank (lower is better) for *this week* from FantasyPros (via "+fp+")\">Rank (FP)</th>"),e=jQuery("<th style=\"width: 50px;\" class=\"Ta-c Bdrend "+fp+" "+fp+"Depth "+fp+"DepthHeader\" title=\"Depth chart information (via "+fp+")\">Depth</th>");b.addClass("Nowrap");var f=jQuery("<td class=\"Nowrap Ta-end "+fp+" "+fp+"Rankings "+fp+"RankingsData\">"+loadingDiv+"</td>"),g=jQuery("<td class=\"Nowrap Ta-c Bdrend "+fp+" "+fp+"Depth "+fp+"DepthData\">"+loadingDiv+"</td>");custom_cols=0;var h=jQuery();if(show_proj&&(custom_cols++,h=h.add(a)),show_rank&&(custom_cols++,h=h.add(d)),0===custom_cols&&!show_depth)return;player_table_header.each(function(){if(show_proj||show_rank){var a=jQuery(this).find("th").filter(function(){return /^\w/.test(jQuery(this).text())}).first(),b=parseInt(a.attr("colspan"));isNaN(b)||a.data("modified")||a.attr({colspan:b+custom_cols,"data-modified":!0})}if(show_depth){var c=jQuery(this).find("th").first(),d=parseInt(c.attr("colspan"));isNaN(d)||c.data("modified")||c.attr({colspan:d+1,"data-modified":!0})}}),0<custom_cols&&proj_head.after(h),show_depth&&player_head.after(e);var i=jQuery("<td class=\"Ta-end Nowrap\"></td>"),j=proj_head.first().text();player_table_rows.each(function(){var a=jQuery(this),c=a.find("td"),d=c.eq(header_index-1),e=c.eq(header_index),h=e,k=null;"Proj Pts"===j?(h=d,k="stats"):"Fan Pts"===j?(h=e,k="proj"):"Rank"===j?(h=d,k="gdd"):"This Week"===j&&(h=e,k="rank");var l="Bye"===h.text(),m=""===h.text();if(l){var n="stats"===k?3:2;h.attr("colspan",n+custom_cols)}else{var o=jQuery();show_proj&&(o=o.add(b.clone())),show_rank&&(o=o.add(f.clone())),m&&(h.attr("colspan",1),h.next().hasClass("Bdrstart")&&(o=o.add(i.clone()),"stats"===k?h.after(i.clone()):"rank"===k&&h.after(i.clone(),i.clone()))),e=0===a.find(".ysf-player-video-link").length&&"stats"===k?a.find("td").eq(header_index-1):a.find("td").eq(header_index),e.after(o)}if(show_depth){var p=a.find(player_name_selector).first();p.after(g.clone())}a.find("td:first").hasClass("Selected")&&a.find("td."+fp).addClass("Selected")})}}}override(parseLeagueSettings,"run",applyCompose(function(a){function b(a){var b=[],c=d.filter(function(){return this.childNodes[0].nodeValue===a});if(c&&0<c.length){var e=c.next().first().text(),f=e.split(";"),g={};jQuery.each(f,function(a,c){c=c.trim();var d;if(-1<c.indexOf("yards per point"))d=1/parseFloat(c.split(" ")[0]),b.push(d);else if(-1<c.indexOf("points at ")){var e=c.split(" "),f=parseFloat(e[0]),h=parseFloat(e[3]);g[h]=f}else d=parseFloat(c),b.push(d)}),b.push(g)}return b}var c=a;c.siteType="yahoo";var d=jQuery("#settings-stat-mod-table tbody td",this.league_data),e=b("Passing Yards");c.pass_yds=e[0]||0,c.pass_bonus={};var f=e[1];for(var g in f)f.hasOwnProperty(g)&&(c.pass_bonus[g]=f[g]);c.pass_tds=b("Passing Touchdowns")[0]||0,c.pass_ints=b("Interceptions")[0]||0,c.pass_cmp=b("Completions")[0]||0,c.pass_icmp=b("Incomplete Passes")[0]||0,c.pass_att=b("Passing Attempts")[0]||0,c.pass_firstdown=b("Passing 1st Downs")[0]||0;var h=b("Rushing Yards");c.rush_yds=h[0]||0,c.rush_bonus={};var i=h[1];for(var j in i)i.hasOwnProperty(j)&&(c.rush_bonus[j]=i[j]);c.rush_att=b("Rushing Attempts")[0]||0,c.rush_tds=b("Rushing Touchdowns")[0]||0,c.rush_firstdown=b("Rushing 1st Downs")[0]||0;var k=b("Receiving Yards");c.rec_yds=k[0]||0,c.rec_bonus={};var l=k[1];for(var m in l)l.hasOwnProperty(m)&&(c.rec_bonus[m]=l[m]);return c.rec_att=b("Receptions")[0]||0,c.rec_tds=b("Receiving Touchdowns")[0]||0,c.rec_firstdown=b("Receiving 1st Downs")[0]||0,c.xpt=b("Point After Attempt Made")[0]||0,c.fga=0,c.fg=.6*((b("Field Goals 0-19 Yards")[0]||0)+(b("Field Goals 20-29 Yards")[0]||0)+(b("Field Goals 30-39 Yards")[0]||0))/3+.3*(b("Field Goals 40-49 Yards")[0]||0)+.1*(b("Field Goals 50+ Yards")[0]||0),c.fgm=.6*((b("Field Goals Missed 0-19 Yards")[0]||0)+(b("Field Goals Missed 20-29 Yards")[0]||0)+(b("Field Goals Missed 30-39 Yards")[0]||0))/3+.3*(b("Field Goals Missed 40-49 Yards")[0]||0)+.1*(b("Field Goals Missed 50+ Yards")[0]||0),c.fumbles=b("Fumbles Lost")[0]||b("Fumbles")[0]||0,c.ff=b("Fumble Force")[0]||0,c.tka=b("Tackle Assist")[0]||0,c.tks=b("Tackle Solo")[0]||0,c.pd=b("Pass Defended")[0]||0,c.int=b("Interception")[0]||0,c.deftd=b("Touchdown")[0]||b("Defensive Touchdown")[0]||0,c.fr=b("Fumble Recovery")[0]||0,c.sk=b("Sack")[0]||0,c.sf=b("Safety")[0]||0,c.pa=0,c.pa0=b("Points Allowed 0 points")[0]||0,c.pa1=b("Points Allowed 1-6 points")[0]||0,c.pa7=b("Points Allowed 7-13 points")[0]||0,c.pa14=b("Points Allowed 14-20 points")[0]||0,c.pa21=b("Points Allowed 21-27 points")[0]||0,c.pa28=b("Points Allowed 28-34 points")[0]||0,c.pa35=b("Points Allowed 35+ points")[0]||0,c.ya=0,c.ya100=b("Defensive Yards Allowed 0-99")[0]||0,c.ya199=b("Defensive Yards Allowed 100-199")[0]||0,c.ya299=b("Defensive Yards Allowed 200-299")[0]||0,c.ya399=b("Defensive Yards Allowed 300-399")[0]||0,c.ya499=b("Defensive Yards Allowed 400-499")[0]||0,c.ya500=b("Defensive Yards Allowed 500+")[0]||0,this.league_settings=c,dlog.log(c),c}));function setDSTname(a){return team_abbrevs[a]}function calcBonus(a,c){var d=0,e=[],f=parseLeagueSettings.league_settings[a+"_bonus"];for(var g in f)f.hasOwnProperty(g)&&e.push(parseFloat(g));e=e.sort().reverse();for(var h=0;h<e.length;h++)parseFloat(e[h+1])&&parseFloat(e[h])?d+=f[e[h]]*(e[h]<=c[a+"_yds"]&&c[a+"_yds"]<e[h+1]):parseFloat(e[h])&&(d+=f[e[h]]*(c[a+"_yds"]>=e[h]));return d}function calcAdjProjections(a){return calcBonus("pass",a)+calcBonus("rush",a)+calcBonus("rec",a)+parseLeagueSettings.league_settings.pa0*(0===a.def_pa)+parseLeagueSettings.league_settings.pa1*(0<a.def_pa&&6>=a.def_pa)+parseLeagueSettings.league_settings.pa7*(6<a.def_pa&&13>=a.def_pa)+parseLeagueSettings.league_settings.pa14*(13<a.def_pa&&20>=a.def_pa)+parseLeagueSettings.league_settings.pa21*(20<a.def_pa&&27>=a.def_pa)+parseLeagueSettings.league_settings.pa28*(27<a.def_pa&&34>=a.def_pa)+parseLeagueSettings.league_settings.pa35*(34<a.def_pa)+parseLeagueSettings.league_settings.ya100*(0<=a.def_tyda&&100>a.def_tyda)+parseLeagueSettings.league_settings.ya199*(100<=a.def_tyda&&200>a.def_tyda)+parseLeagueSettings.league_settings.ya299*(200<=a.def_tyda&&300>a.def_tyda)+parseLeagueSettings.league_settings.ya399*(300<=a.def_tyda&&400>a.def_tyda)+parseLeagueSettings.league_settings.ya499*(400<=a.def_tyda&&500>a.def_tyda)+parseLeagueSettings.league_settings.ya500*(500<=a.def_tyda)}RowData.prototype._getPlayerInfo=function(){var a=this.player_cell.find(".ysf-player-name"),b=a.find("span").first().text().trim().split(" - "),c=b[0].toUpperCase();"JAX"===c&&(c="JAC");var d,e=b[1];-1<e.indexOf(",")?(d=e.split(","),e=[],d.forEach(function(a){e.push(a.trim())})):"DEF"===e&&(e="D/ST");var f=a.find("a").text().trim();"D/ST"===e&&(f=c,c="-");var g=null,h=null;return(onMatchupPreviewPage||onFreeAgencyPage)&&(g=this.player_cell.find(".ysf-player-name").find("a").attr("href"),h=g.split("/").pop()),{player_name:f,pos_name:e,team_name:c,player_href:g,player_id:h}},RowData.prototype._getPlayerCell=function(a){return function(){return onMatchupPreviewPage?this.cell.nearest("td.player"):a.apply(this,arguments)}}(RowData.prototype._getPlayerCell),override(getProjectionData,"_calcAndPop",applyBefore(function(a){if(onMatchupPreviewPage||onFreeAgencyPage){var b=storage_translation_data.hasOwnProperty("ID_"+a.player_id);dlog.info("id is "+a.player_id+", seen is "+b);var c=alldata.hasOwnProperty(a.player_name.toUpperCase()+"|"+a.pos_name+"|"+a.team_name);"D/ST"===a.pos_name||b||c?b&&(a.translation_name=storage_translation_data["ID_"+a.player_id]):dlog.log("Could not find player in yahoo database: "+a.player_href+", "+a.getPlayerName())}})),override(reDefer,"run",applyAfter(function(){(onMatchupPreviewPage||onFreeAgencyPage)&&(yahooIdsDone=jQuery.Deferred())})),isCurrentWeek=function(){if(onFreeAgencyPage)return is_FA_current;if(!page_menu||0===page_menu.length)return!0;var a;if(onMatchupPreviewPage){var b=page_menu.contents().filter(function(){return 3===this.nodeType}).text(),c=b.indexOf(":");a=b.substr(0,c).split(" ").reverse()[0]}else a=page_menu.find("#selectlist_nav span").text().replace(/\D/g,"");return!isNaN(a)&&a===current_week},addData.projTotals=function(){var a=Math.round;if(!show_proj)return dlog.log("totals done"),void totalsDone.resolve();var b=0;if(onClubhousePage){var c=player_table_body.find("tr:not(\".bench\") .FantasyPlusProjectionsData");if(0<c.length){c.each(function(){var a=parseFloat(jQuery(this).text());a&&(b+=a)});var d=a(100*b)/100,e=parseFloat(pts_total.first().text());if(!isNaN(e)){var f;e<d?f="green":e>d&&(f="red"),f&&(f=" style=\"color: "+f+"\""),pts_total.append("<span title=\"Total projected points (via FantasyPlus)\" class=\"FantasyPlus\""+f+"> ["+d+"]</span>")}}dlog.log("totals done"),totalsDone.resolve()}else onMatchupPreviewPage&&jQuery.when(yahooIdsDone).done(function(){var d=pts_total.parent().clone();d.addClass("FantasyPlus"),d.children().text(""),d.find("th").text("FP Proj");var e=d.find("td"),f=jQuery(playerTable.first()),g=jQuery(".FantasyPlusProjectionsTotal"),h=f.find(player_table_header_selector),i=h.find("th.FantasyPlusProjectionsHeader");i.each(function(d){b=0;var h=jQuery(this),i=h.index(),j=f.find("tbody tr"),k=jQuery(e[d]);if(c=j.find("td:nth-child("+(i+1)+")"),0<c.length){c.each(function(){var a=parseFloat(jQuery(this).text());a&&(b+=a)});var l=a(100*b)/100,m=parseFloat(jQuery(pts_total[d]).text());if(!isNaN(m)){var n;m<l?(n="green",k.addClass("F-positive")):m>l&&(n="red",k.addClass("F-negative")),n&&(n=" style=\"color: "+n+"\"");var o=jQuery(g[d]);o.html("<div title=\"Total projected points (via FantasyPlus)\" class=\"FantasyPlus\""+n+"> ["+l+"]</div>"),k.text(l)}else k.text("-")}else k.text("-")}),pts_total.parent().after(d),dlog.log("totals done"),totalsDone.resolve()})};function _resetTranslation(){(onMatchupPreviewPage||onFreeAgencyPage)&&(storage_translation_data={},updated_translation=0,getYahooIds())}watchForChanges._getAcceptedChange=function(a){var b=!0,c=a[0],d=c.target;if(d){var e=d.id,f=d.className;("selectlist_nav"===e||"flyout-title"===f)&&(b=!1)}return b},watchForChanges.target_selector=base_table_selector;