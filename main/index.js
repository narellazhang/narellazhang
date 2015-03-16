define(['butterfly/view', 'main/ajaxAPI','main/channel','main/lyric','main/song','iscroll'], 
	function(View,API,Channel,Lyric,Song,iScroll) {

	return View.extend({	
		
		showMoreOperation:false,
		showrecord:false,

		fullPath:'',
		 
		events: {
			'click .mask': 'pause',
			'click .pause': 'play',

			//'touchstart .icon-last': 'hover',
			'click .icon-last': 'next',

			'click .channelname': 'showChannels',
			'click .imgbox': 'switchChannels',

			//'touchstart .icon-bin': 'hover',
			'click .icon-next': 'forward',
			'click .icon-previous': 'backward',

			//'touchstart .song_title': 'hover',
			'click .song_title': 'showlyric',

			//'touchstart .icon-plus':'hover',
			'click .icon-plus':'toggleMoreOperation',

			//'touchstart .icon-list2':'hover',
			'click .icon-list2':'togglelistrecord',

			//'touchstart .icon-arrow-left':'hover',
			'click .icon-arrow-left':'hidelyricPage',

			//'touchstart .icon-play':'hover',
			'click .icon-play':'playChosedsong',
			

			//'touchstart .icon-heart':'mark',
			'click .icon-heart':'togglemarksong',

			//'touchstart #hideChannels':'hover',
			'click #hideChannels':'hideChannels',
			'click .sure': 'hidetips',

		},

		initialize: function() {
			
			Channel.getChannelList();

		},

		render: function() {
			thisView = this;
		},

		onShow: function() {
			
			var channels = localStorage.getItem('channels');
			if(!channels){
				Channel.getChannelList();
			}
			
		
			localStorage.removeItem('songList');
			Song.channelId = 6;//默认粤语频道
			Song.getSongList();	

		},

		/*hover: function(event){
			$(event.target).addClass('hover');
		},

		mark:function(event){
			$(event.target).addClass('mark');
		},*/
	
		showChannels: function() {
			Channel.showChannels();
		},

		hideChannels:function(){			
			Channel.hideChannels();	
		},

		switchChannels:function(event){
			Channel.switchChannels(event);
			localStorage.removeItem('songList');
		},

		pause: function() {
			$(".pause").show();
			Song.pause();
		},

		play: function() {
			$(".pause").hide();
			Song.play();
		},

		next: function(event) {
			if(event){
				//$(event.target).removeClass('hover');
			}
			Song.next();
			
		},
		forward:function(){
			//$(event.target).removeClass('hover');
			Song.forward();
		},
		
		backward:function(){
			//$(event.target).removeClass('hover');
			Song.backward();
		},


		getlyric: function() {

			Lyric.getlyric();		
		},

		showlyric:function(event){
			//$(event.target).removeClass('hover');
			Lyric.showlyric();
			Lyric.renderlyric();
		},

		toggleMoreOperation:function(){
			if(!thisView.showMoreOperation){
				$('.operation').removeClass('invisible moveToBottom');
                $('.operation').addClass('visible moveFromBottom');
                $('.icon-plus').addClass('hover');
                thisView.showMoreOperation = !thisView.showMoreOperation;
              }else{
              	 $('.operation').removeClass('moveFromBottom');
                 $('.operation').addClass('moveToBottom');
                
                
                  thisView.showMoreOperation = !thisView.showMoreOperation;
                  $(".icon-plus").removeClass('hover');
              }
		},

		togglelistrecord:function(){
			if(!thisView.showrecord){
				$('#listrecord').removeClass('moveToLeft invisible');
                $('#listrecord').addClass('visible moveFromLeft');
                thisView.showsonglist();
                $(".icon-list2").addClass('hover');
                thisView.showrecord = !thisView.showrecord;
              }else{
              	$('#listrecord').removeClass('visible moveFromLeft');
              	$('#listrecord').addClass('moveToLeft');
                 
                thisView.showrecord = !thisView.showrecord;
                $(".icon-list2").removeClass('hover');
              }

		},

		showsonglist:function(){
			var songList = JSON.parse(localStorage.getItem('lovesongList'));
			if(!songList||songList.length==0){
				setTimeout(function(){$(".errortips").show();},800);
				return;
			}
			var data = {
				songlist:songList
			}
			var element = $("#songlist");
			var tpl = $("#songlistTpl").html();
			// 解析模板, 返回解析后的内容
			var render = _.template(tpl);
			var html = render(data);
			// 将解析后的内容填充到渲染元素
			
			element.html(html);
			var wrapper = document.getElementById('songlistwrap');
	   
	        var myScroll = thisView.myScroll = new iScroll(wrapper, {
	            probeType: 3
	        });
	          setTimeout(function(){
	          	thisView.myScroll.refresh();
	          },200)
		},
		hidetips:function(){
			$(".errortips").hide();
		},
		goBackPlaysong:function(event){
			$('#listrecord').removeClass('visible moveFromLeft');
          	$('#listrecord').addClass('moveToLeft');
             
            thisView.showrecord = !thisView.showrecord;
            $(".icon-list2").removeClass('hover');
			
		},

		playChosedsong:function(event){
			//$(event.target).removeClass('hover');
			var index = $(event.target).data("songindex");
			Song.playlovesong = true;
			Song.channelId = 0;
			Song.lovesongIndex = index
			Song.playsong(index);
			thisView.goBackPlaysong();
		},


		hidelyricPage:function(event){
			//$(event.target).removeClass('hover');
			Lyric.hidelyricPage();
			Song.lrcIndex = 0;
		},
		
		togglemarksong:function(event){
			if($(event.target).hasClass('mark')){
				$(event.target).removeClass('mark');
				Song.removemark(Song.lovesongIndex);
			}else{
				$(event.target).addClass('mark');
				Song.marksong();
			}
				
		},


	});
});