/*
 * Version: 2.1
 */

// Notify Plugin - Code for the demo site of HtmlCoder
// You can delete the code below
//-----------------------------------------------
(function($) {

	"use strict";

	$(document).ready(function() {
        $("#search_btn").click(function () {
        	var url="http://localhost:9001/Admin/getUserList/";
			var text= $("#search_text").val();
			$.ajax({
				type: "GET",
				url:url+text,
				dataType: "json",
				error:function () {
					alert(url+text);
                },
				success: function (data) {
					alert(data);
                }
			});
        });

        $("#pill-1").click(function(){

        });
        $("#pill-2").click(function(){

        });
	}); // End document ready

})(jQuery);


