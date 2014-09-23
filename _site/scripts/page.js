$(function(){
	$(".nav li").click(function(){
		console.log(this);
		$('this').toggleClass("active");
		var liclass = $(this).attr("class").split(" ");
		console.log(liclass);
		// 
		for(var i=0;i<liclass.length;i++){
			if(liclass[i]!='icon'&&liclass[i]!='active'){
			    var bgPosition = $(liclass[i]).css('background-position');
			    if(typeof(bgPosition) == 'undefined') {
			     	bgPosition = $(liclass[i]).css('background-positionX') + ' ' + $(liclass[i]).css('background-positionY');
			    }
				bgPosition=bgPosition.split(" ") //转成字符串数组
				var x = bgPosition[0];
				var y = bgPosition[1];
				 
				var position = parseInt(x-50)+"px "+ y+"px";//右移50px
				    alert(position);
				    $(liclass[i]).css({backgroundPosition:position}); 
			}
		}
		
	});	
})