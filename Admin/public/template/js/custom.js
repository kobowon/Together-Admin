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
				success: function (userData) {
				    var i=0,length=Object.keys(userData).length;;
				    sort_down_by_name(userData);
				    for(i; i<=length-1;i++)
                    {
                        var $list_div= $('<div class="listing-item mb-20">' +
                            '<div class="row grid-space-0">' +
                            '<div class="col-md-6 col-lg-4 col-xl-2">' +
                            '<div class="overlay-container id=img_container'+i+'"></div></div>' +
                            '<div class="col-md-6 col-lg-8 col-xl-9">' +
                            '<div class="body" id = "list_body'+i+'"></div>' +
                            '</div></div></div>');
                        $('#down_list').append($list_div);
                        /*$('img_container'+i).appendChild(<img src="")//profile_image blob으로 읽힘*/
                        var $list_header = $('<h3 class="margin-clear">'+userData[i].userID+'</h3>');
                        var list_body_id='#list_body'+i;
                        $(list_body_id).append($list_header);
                        /*$('up_list').appendChild($list_div);*/
                    }
                }
			});
        });


	}); // End document ready

})(jQuery);

//userID 오름차순으로 정렬
function sort_up_by_name_(userObjects){
    userObjects.sort(function(a,b){
        return a.userID < b.userID ? -1 : a.userID > b.userID ? 1 : 0;
    })
}

//userID 내림차순으로 정렬
function sort_down_by_name(userObjects){
    userObjects.sort(function(a,b){
        return a.userID > b.userID ? -1 : a.userID < b.userID ? 1 : 0;
    })
}

function makeUserList(htmlID,userID,userType,score){

}
