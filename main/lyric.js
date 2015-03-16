define(['spin', 'main/ajaxAPI','iscroll'], function(Spin, API,iScroll) {
	return {
		lrc: [],

		getlyric: function() {

			_this = this;
			var title = $(".song_title").text();
			var artist = $(".song_artist").text();
			if (localStorage.getItem(title)) return;

			var params = {};
			params.data = {
				from: "webapp_music",
				method: "baidu.ting.search.catalogSug",
				format: "jsonp",
				query: title
			};

			params.success = function(jsonp) {
					console.log("success");
					console.log(jsonp);
					if (jsonp.error_code == 22000) {
						if (jsonp.song.length == 0) {
							return;
						} else {
							console.log(jsonp.song[0]);
							localStorage.setItem(title, jsonp.song[0].songid);
							_this.getlrc();
						}
					} else return;
				},
			params.complete = function(e) {
				console.log(e);
			};
			params.error = function(obj) {
				console.log(obj);
			}
			API.getLyric(params);

		},

		getlrc: function() {
			var title = $(".song_title").text();
			var id = localStorage.getItem(title);
			$.ajax({
				url: "http://tingapi.ting.baidu.com/v1/restserver/ting",
				type: 'GET',
				data: {
					from: "webapp_music",
					method: "baidu.ting.song.lry",
					format: "json",
					songid: id
				},
				success: function(json) {
					console.log("success");
					console.log(json);
					localStorage.setItem(id, json.lrcContent);
					
				},
				error: function(obj) {
					console.log(obj);
				}

			});

		},

		parseLyric: function(id) {			
			var text = localStorage.getItem(id);
			var lyric = text.split("\n"); //先按行分割
			console.log(lyric);
			var _l = lyric.length; //获取歌词行数
			lrc = new Array(); //新建一个数组存放最后结果
			for (i = 0; i < _l; i++) {


				var d = lyric[i].match(/\[\d{2}:\d{2}((\.|\:)\d{2})\]/g); //正则匹配播放时间
				//var t = lyric[i].split(d); //以时间为分割点分割每行歌词，数组最后一个为歌词正文
				var t = lyric[i].substring(lyric[i].lastIndexOf("]") + 1);
				if (d != null) { //过滤掉空行等非歌词正文部分
					//换算时间，保留两位小数
					var dt = String(d).split(':');
				
					if (dt.length > 2) {
						var newdt = [];
						newdt.push(dt[0]);
						for (var j = 1; j < dt.length - 1; j++) {
							var tempdt = dt[j].split(',');
							newdt = newdt.concat(tempdt);
						}
						newdt.push(dt[dt.length - 1]);
						for (var k = 0; k < newdt.length; k = k + 2) {
							var _t = Math.round((parseInt(newdt[k].split('[')[1]) * 60 + parseFloat(newdt[k + 1].split(']')[0])) * 100) / 100;
							lrc.push([_t, t]);
						}


					} else {

						var _t = Math.round((parseInt(dt[0].split('[')[1]) * 60 + parseFloat(dt[1].split(']')[0])) * 100) / 100;
						lrc.push([_t, t]);
					}
				}

			}
			
			
			lrc.sort(function(a,b){
				return a[0]-b[0];
			});
			
			return lrc;


		},

		showLoadingPage: function() {
			var opts = {
				color: '#6bbd7a',
				top: '50%',
				left: '50%'
			};

			this.spinner = new Spin(opts);
			var target = $(".loading").get(0); //这里很特别，不知道是不是 butterfly 的问题，一定要带上.get()来
			this.spinner.spin(target); //选择元素，测试过用 $('.foo') 和 $('#foo') 都会把这个元素删除
		},

		showlyric: function() {
			$(".playpage").addClass('moveToLeft');
			$(".playpage").removeClass('moveFromTop');

			$("#lrc").removeClass('invisible moveToRight');
			$("#lrc").addClass('visible moveFromRight');

			this.showLoadingPage();

		},

		renderlyric: function() {
			$("#Lyrics").remove();
			$(".lrcerror").find("p").remove();
			
			var lrc;
			var title = $(".song_title").text();
			var id = localStorage.getItem(title);
			$("#lrc .title").text(title);
			if (id) {
				
				lrc = this.parseLyric(id);
				console.log(lrc);
				for (var i = 0; i < lrc.length; i++) {  
				    if (lrc[i][1] == "") {           
				      lrc[i][1] = "music~";
				  	}
				}  
				this.lrc = lrc;
				console.log(lrc);

			} else {
				$(".loading").remove();
				$(".lrcerror").show().append('<p>抱歉！暂时没有找到歌词。</p>');
				return;
			}
			var data = {
				lrc:lrc
			};
			var element = $("#lrccontent");
			var tpl = $("#lrctpl").html();
			// 解析模板, 返回解析后的内容
			var render = _.template(tpl);
			var html = render(data);
			// 将解析后的内容填充到渲染元素
			$(".loading").remove();
			
			element.append(html);
			var wrapper = document.getElementById('Lyrics');
	        //setTimeout(function() {
	            var myScroll = this.myScroll = new iScroll(wrapper, {
	              probeType: 3
	            });
	            // detailView.myScroll.refresh();
	       // }, 250)
		},

		hidelyricPage:function(){
			
			$("#lrc").addClass('invisible moveToRight');
			$("#lrc").removeClass('visible moveFromRight');
			$("#lrc").find(".Lyrics").remove();
			

			$(".playpage").removeClass('moveToLeft')
			$(".playpage").addClass('moveFromLeft');
			setTimeout(function() {
				$(".playpage").removeClass('moveFromLeft');
			}, 600);
			$(".lrcerror").find("p").remove();
			
		},
		

		
		  
		
	}

});