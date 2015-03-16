define(["utils/util"], function (Util) {

    var server = "";

    return {

        server: "",
        //请勿随意修改本段代码
        request: function (params) {
            var _this = this;
            /*
            if (params.autoShowLoading) {
                this.showLoadingPage(params.spinDatas);
                params.complete = function () {
                    _this.spinner.stop();
                    $("#spin-load").addClass('hide');
                }
            }
            */
            var defaults = {
                url: this.server + params.path,
                type: 'GET',
                contentType: 'application/json; charset=utf-8', //raw; charset=utf-8
                // dataType:'json',
                timeout: 1000 * 60 * 5,
                complete: function (request, status) {
                }
            }

            params = _.extend(defaults, params); //附加上默认的请求参数

            // if (params.type.toUpperCase() === "POST" && params.contentType && params.contentType.indexOf("json") != -1) {
            //     params.data = JSON.stringify(params.data);
            // }

            var _preSuccessFunc = params.success;
            var _preCompeteFunc = params.complete;

            params.success = function (data) {
                if (params.cache && data) {
                    data.expires = new Date().getTime() + params.expires * 1000; //默认30秒缓存
                    Util.saveData(params.path+JSON.stringify(params.data), data);
                    //console.log('从缓存中读取数据');
                }
                _preSuccessFunc(data);
            }

            params.complete = function (request, status) {
                switch (status) {
                    case 'timeout':
                        console.error('api请求超时.');
                        break;
                }
                _preCompeteFunc(status, request);
            }
            console.log('调用接口:\n%s,\n参数列表:', params.url, params.data);

            if (params.cache) {
                var cache = Util.loadData(params.path+JSON.stringify(params.data));
                var currentTime = new Date().getTime();
                if (cache && cache.expires && (currentTime - cache.expires) < 0) {
                    console.log('从缓存中读取数据');
                    return params.success(cache);
                    
                }
            }
            $.ajax(params);
        },

        getChannelList:function(params){
            params.path = "http://douban.fm/j/explore/hot_channels";
            params.cache = true;
            params.expires = 3600 * 10;
            this.request(params);
        },
        getPlayList:function(params){
            params.path = "http://www.douban.com/j/app/radio/people";  
            params.data.app_name = 'radio_desktop_win';
            params.data.version = 100;
            this.request(params);
        },


        getLyric:function(params){
            params.path = "http://tingapi.ting.baidu.com/v1/restserver/ting";
            params.cache = true;
            params.expires = 3600 * 10;
            this.request(params);
        },
        
    }

});