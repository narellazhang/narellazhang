function addLoadEvent(func) { 
var oldonload = window.onload; 
if (typeof window.onload != 'function') { 
window.onload = func; 
} else { 
window.onload = function() { 
oldonload(); 
func(); 
} 
} 
}



function staticNav() { 
	var sidenavHeight = $("#mainnav").height();
	var winHeight = $(window).height();
	var browserIE6 = (navigator.userAgent.indexOf("MSIE 6")>=0) ? true : false;

	if (browserIE6) {
		$("#mainnav").css({'position' : 'absolute'});
	} else {
		$("#mainnav").css({'position' : 'fixed'});
	}

	if (sidenavHeight > winHeight) {
		$("#miannav").css({'position' : 'static'});
	}

	};
$(window).resize(function () { //Each time the viewport is adjusted/resized, execute the function
	staticNav();
});


addLoadEvent(staticNav);
function changedata(){
var jiayou=document.getElementById("jiayou");
var xunshu=document.getElementById("xunshu");
jiayou.onclick=function(){
jiayou.style.backgroundPosition="-0px -35px";
xunshu.style.backgroundPosition="-0px -65px";
var bt=baidu.template;
		//最简使用方法
		var html=bt('resultone',dataone);
		//渲染
		document.getElementById('result').innerHTML=html;
};

xunshu.onclick=function(){
xunshu.style.backgroundPosition="-0px -91px";
jiayou.style.backgroundPosition="-0px -0px";
var bt=baidu.template;
		//最简使用方法
		var html=bt('resulttwo',datatwo);
		//渲染
		document.getElementById('result').innerHTML=html;
};
}
function validform_re(){

		$("#registerform").Validform({
			tiptype:2
		});
}
function validform_per(){
	
		$("#perferform").Validform({
			tiptype:2
		});
}

function mybookbar(){
	var pList=$('#content').children('p');
	for(var i=0;i<pList.length;i++){
		pList[i].onclick=function(){
		   pList=$('#content').children('p').css("color", "#2c3b52");this.style.color="f00";
		  };
	  };
}



// javascript



