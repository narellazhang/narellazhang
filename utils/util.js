/*
常用工具类库
author 陈小亮
date 2014/5/28
*/
define(function() {

var Util = {
	//本地存储方法
	saveData: function(key,value) {
		localStorage.setItem(key,JSON.stringify(value));
	},

	loadData: function(key,defaultValue) {
		var value = localStorage.getItem(key);
		if(defaultValue == undefined || defaultValue == 'undefined') defaultValue = null;
		return JSON.parse(value == null || value == 'undefined' ? defaultValue : value);
	},

	appendData: function(key,value) {
		var data = this.loadData(key);
		if(!data) return saveData(key, value);
		if(data instanceof Array) {
			data.push(value);
			this.saveData(key,data);
		}
		return data;
	},

	removeData: function(key) {
		localStorage.removeItem(key);
	},

	removeAll: function() {
		localStorage.clear();
	},

	isToday: function(date) {
		return new Date(date).format('yyyy-MM-dd') === new Date().format('yyyy-MM-dd') ? true :false;
	},

	getUrlParams: function() {
   var url = location.search ? location.search : location.hash; //获取url中"?"符后的字串
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(url.indexOf("?") + 1,url.length);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
   }
   return theRequest;
	},

	getObjectFirstKV: function(obj) {
		for(var first in obj) {
			if(typeof(obj[first]) != 'function') return {'key':first,'value':obj[first]};
		}
	},

	compareDate: function(date1,date2,ignore) {
		var value = Math.abs(date1.getTime() - date2.getTime()) / 1000;
		if(value < 3600 * 24 && date1.getDate() == date2.getDate() && !ignore)
			return 0;
		return date1.getTime() > date2.getTime() ? 1 : -1;
	},
	//生成一个过期时间
	genExpire: function(second) {
		return new Date(new Date().getTime() + second * 1000).getTime();
	},
	//判断是否超出有效期
	isExpire: function(expire) {
		return this.compareDate(new Date(),new Date(expire),true) >= 0;
	},

};

return Util;


});
