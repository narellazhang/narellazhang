define(['main/ajaxAPI','main/lyric','iscroll','underscore'], function(API,Lyric,iScroll,_) {
	return {
		
			channelId: 0,
			songIndex: 0,
			lrcIndex:0,
			audio: {},
			_that: {},
			playlovesong:false,
			lovesongIndex:0,
			
			
		
		getSongList: function() {
			var _that = this;
			var params = {};
			params.data = {
				user_id: 70083045,
				expire: 1434437635,
				token: '39117aaad6',
				type: 'n',
				channel:this.channelId,
			};
			params.success = function(json) {
				console.log(json);
				var songList = localStorage.getItem('songList');
				if(songList){	
					songList = JSON.parse(localStorage.getItem('songList')).concat(json.song);					
					localStorage.setItem('songList',JSON.stringify(songList));
				}else{					
					localStorage.setItem('songList',JSON.stringify(json.song));
					console.log(json.song);
				}
				
				_that.playsong(_that.songIndex);

			};
			params.complete = function() {
				console.log("complete");
			};

			API.getPlayList(params);
		},

		playsong: function(index) {

			_that = this;
			var lovesongList = JSON.parse(localStorage.getItem('lovesongList'));
			if(_that.playlovesong){
				var songList = lovesongList;
				$(".icon-heart").addClass('mark')
			}else{
				var songList = JSON.parse(localStorage.getItem('songList'));
			}
			var channelName = this.channelId == 0 ? "我的红心MHz (离线)" : this.getChannelName(this.channelId);
			$('.channelname').html(channelName);

			var element = $("#playing");
			var tpl = $("#playingTpl").html();
			var data = songList[index];
			console.log(songList[index]);

			// 解析模板, 返回解析后的内容
			var render = _.template(tpl);
			var html = render(data);
			// 将解析后的内容填充到渲染元素
			element.html(html);
			$('.icon-heart').removeClass('mark');
			console.log(lovesongList);
			if(lovesongList && lovesongList.length > 0){
				for(var i = 0;i<lovesongList.length;i++){
					if(data.title == lovesongList[i].title){
						$('.icon-heart').addClass('mark');
						this.lovesongIndex = i;
					}
				}
			}
			
			

			this.audio = document.getElementById("audio");

			this.audio.addEventListener("timeupdate", this.updateProgress, true);

			this.audio.addEventListener('ended', this.next, false);  
			this.audio.addEventListener('canplaythrough',setTimeout(this.preLoadChannelImg,1000));
			setTimeout(this.getlyric,500);
			var img = new Image();
			img.src = data.picture;
			img.onload = function() {
				$("#songcover").attr("src", img.src);
				console.log("complete");
			}
		},

		updateProgress: function() {
			_that.setProgress(this.currentTime);
			_that.setcurrentLrc(this.currentTime);
		},

		// Update progress
		setProgress: function(value) {
			var currentSec = parseInt(value % 60) < 10 ? '0' + parseInt(value % 60) : parseInt(value % 60);
			var ratio = value / this.audio.duration * 100;
			//console.log(value,this.audio.duration);
			
			var num = ratio * 3.6;
			if (Math.floor(num) <180 || !num) {
				$('.circle').addClass('circle_id');
				$('.circle').find('.right').addClass('right_id');
				$('.circle').find('.right').css('transform', "rotate(" + num + "deg)");
			} else {
				if (Math.floor(num) == 180) {
					
					$('.circle').find('.right').removeClass('right_id');
					$('.circle').find('.left').addClass('left_id');
				} else {

					$('.circle').find('.right').css('transform', "rotate(180deg)");
					$('.circle').find('.left').css('transform', "rotate(" + (num - 180) + "deg)");
				}
			}
		},

		setcurrentLrc: function(value) {
			
			var lrc = Lyric.lrc;
			if (lrc.length>0) {
				for (var i = 0; i < lrc.length; i++) {
					if (value > lrc[i][0]) {
						var lrcs = $('.Lyrics');
						
						$(lrcs[this.lrcIndex++]).addClass('current');
						$(lrcs[this.lrcIndex-2]).removeClass('current');
						lrc.shift();
						Lyric.myScroll.scrollToElement(document.querySelector('#Lyrics li:nth-child('+this.lrcIndex+')'), null, null, true);


					}
				}
			}else return;
			
		},

		
		pause: function() {
			$(".pause").show();
			this.audio.pause();
		},

		play: function() {
			$(".pause").hide();
			this.audio.play();
		},



		next: function() {
			if(_that.playlovesong){
				var lovesongList = JSON.parse(localStorage.getItem('lovesongList'));
			
				_that.lovesongIndex++;
				console.log(_that.lovesongIndex);
				console.log(lovesongList.length);
				if (_that.lovesongIndex  == lovesongList.length) {
					_that.lovesongIndex = 0;
				}
				_that.playsong(_that.lovesongIndex);
				$(".icon-heart").addClass('mark');
			}else{
				$(".icon-heart").removeClass('mark');
				var songList = JSON.parse(localStorage.getItem('songList'));
				
				_that.songIndex++;
				console.log(_that.songIndex);
				console.log(songList.length);
				if (_that.songIndex + 1 >= songList.length) {
					_that.sid = songList[songList.length - 1].sid
					_that.getSongList();
				}
				_that.playsong(_that.songIndex);
			}
			_that.lrcIndex = 0;
			Lyric.getlyric();
			Lyric.renderlyric();		
		},

		forward: function() {
			_that.audio.currentTime += 20;
			
		},

		backward:function(){
			_that.audio.currentTime -= 20;
		},

		preLoadChannelImg:function(){
			var channels = JSON.parse(localStorage.getItem('channels')).channels;
			var img = new Array();
			for (var i = 0; i < channels.length; i++) {
                img[i] = new Image();
                img[i].src = channels[i].banner;
            }	
		},
		getChannelName: function(id) {
			
			var channels = JSON.parse(localStorage.getItem('channels')).channels;
			for (var i = 0; i < channels.length; i++) {
				if (channels[i].id == id) {
					return channels[i].name;
				}
			}
		},

		marksong:function(){
			var songList = JSON.parse(localStorage.getItem('songList'));
			var lovesongList = localStorage.getItem('lovesongList');
			var song = [songList[this.songIndex]];
			
			lovesonglist = JSON.parse(lovesongList);
				if(lovesongList){	
					song = JSON.parse(lovesongList).concat(song);						
				}
				this.lovesongIndex = song.length-1;
				localStorage.setItem('lovesongList',JSON.stringify(song));
				console.log(lovesongList);
			
		},

		removemark:function(index){
			var lovesongList = JSON.parse(localStorage.getItem('lovesongList'));
			//todo:删除lovesonglist中的lovesongIndex的元素。
			
			/*for(var i = index;i<lovesongList.length-1;i++){
				lovesongList[i] = lovesongList[i+1]
			}
			lovesongList.pop();
			localStorage.setItem('lovesongList',JSON.stringify(lovesongLissplice()
				*/
			console.log(lovesongList);
			lovesongList.splice(index,1);
			console.log(lovesongList);

			/*_.compact(lovesongList);
			console.log(lovesongList);*/

			localStorage.setItem('lovesongList',JSON.stringify(lovesongList));


		},



	}
})