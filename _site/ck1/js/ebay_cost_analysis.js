$(document).ready(function(){
    $(".nav-tabs li").click(function() {
            var tab = $(this);
            tab.addClass("active").siblings().removeClass("active");

            var content = tab.children("a").data("content");
            $("#sales_form").hide();
            $("#pricing_form").hide();
            $(content).show();
         });
  });
function addProduct(that){
        $(that).parent().parent().after($(that).parent().parent().clone());
        $(that).text('-');
        $(that).attr('class','delProduct btn');
        $(that).attr('onclick','delProduct(this);return false;');
        var newProductItem = $(that).parent().parent().next().children();

        var labelList =newProductItem.children("label");
        var inputList =newProductItem.children("div").children("input");

        //default : assert(labelList.length == inputList, 1);
        for (var i=0;i<labelList.length;i++)
        {
            var tmp_Array = null;

            var lfor = $(labelList[i]).attr("for");
            var lfor_len = lfor.length;
            var forid= parseInt(lfor[lfor_len-1])+ 1;
            
            tmp_Array = lfor.substr(0, lfor_len - 1) + forid;
            $(labelList[i]).attr('for', tmp_Array);

            var input_id = $(inputList[i]).attr("id");
            var input_id_len = input_id.length;
            var input_id_v = parseInt(input_id[input_id_len - 1])+1;

            tmp_Array = input_id.substr(0 , input_id_len - 1) + input_id_v;
            $(inputList[i]).attr('id' , tmp_Array);
        }
       
     }
     function delProduct(that){
        var _this = $(that).parent().parent().parent();
        $(that).parent().parent().remove();
        var productList = _this.children("div.product");      

        for(var i = 0 ; i < productList.length ; i ++){
            var labelList = $(productList[i]).children("div.control-group").children("label")
            var inputList = $(productList[i]).children("div.control-group").children("div").children("input");

            //default : assert(labelList.length == inputList, 1);
            for (var j = 0 ; j<labelList.length ; j++){
                var tmp_Array = null;

                var lfor = $(labelList[j]).attr("for");
                var lfor_len = lfor.length;
                tmp_Array = lfor.substr(0, lfor_len - 1) + i;
                $(labelList[j]).attr('for', tmp_Array);

                var input_id = $(inputList[j]).attr("id");
                var input_id_len = input_id.length;
                tmp_Array = input_id.substr(0 , input_id_len - 1) + i;
                $(inputList[j]).attr('id' , tmp_Array);
            }
        }
     }
   
