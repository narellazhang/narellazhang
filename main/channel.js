define(['main/ajaxAPI','main/song','iscroll'],function(API,Song,iScroll){
	return {
		

		getChannelList: function() {
			if (JSON.parse(localStorage.getItem('channels'))) return;
			else {
				var params = {};
				params.data = {
					start: 1,
					limit: 18
				}
				params.success = function(json) {
					console.log(json);

					localStorage.setItem('channels', JSON.stringify(json.data));
				};
				params.complete = function() {
					console.log("complete");
				};
				API.getChannelList(params);
			}
		},

		

		


		showChannels: function() {
			//var element = $(".channels");
			var that = this;
			var channels = JSON.parse(localStorage.getItem('channels'));
			var element = $("#chanellist");
			var tpl = $("#tpl").html();
			// 解析模板, 返回解析后的内容
			var render = _.template(tpl);
			var html = render(channels);
			// 将解析后的内容填充到渲染元素
			//element.html(html);
			element.append(html);
			var wrapper = document.getElementById('wrapper');
	   
	        var myScroll = that.myScroll = new iScroll(wrapper, {
	            probeType: 3
	        });
	          setTimeout(function(){
	          	that.myScroll.refresh();
	          },500);
			$(".playpage").removeClass('moveFromTop moveFromLeft');
			$(".playpage").addClass('moveToTop');
			$("#channelpage").removeClass('invisible moveToBottom')
			$("#channelpage").addClass('visible moveFromBottom');

		},

		switchChannels:function(event){
			this.hideChannels();

			Song.channelId = $(event.target).data("id");
			console.log(Song.channelId);
			Song.getSongList();

			Song.songIndex = 0;
			Song.playlovesong = false;
		},

		hideChannels:function(){
			
			$("#channelpage").addClass('visible moveToBottom');
			$("#channelpage").removeClass('invisible moveFromBottom');
			$("#channelpage").find(".channel").remove();
			$(".playpage").removeClass('moveToTop')
			$(".playpage").addClass('moveFromTop');
		},

	}

});