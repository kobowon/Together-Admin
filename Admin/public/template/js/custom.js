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
        	var url="/admin/getUserList/"
			var text= $("#search_text").text()
			$.ajax({
				type: "GET",
				url:url+text,
				dataType: "json",
				error:function () {
					alert('실패했습니다');
                },
				success: function (data) {
					alert(data);
                }
			})
        })
	}); // End document ready

})(jQuery);


