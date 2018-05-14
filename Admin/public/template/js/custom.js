/*
 * Version: 2.1
 */

// Notify Plugin - Code for the demo site of HtmlCoder
// You can delete the code below
//-----------------------------------------------
(function($) {

	"use strict";

	$(document).ready(function() {
	    $('#search_text').change(function () {
	        $('.listing-item').remove();
            $("#search_btn").one('click',function () {
                var url="http://localhost:9001/Admin/getUserList/";
                var text= $("#search_text").val();
                $.ajax({
                    type: "GET",
                    url:url+text,
                    dataType: "json",
                    error:function () {
                        alert("해당 사용자가 없거나 조회가 불가능 합니다");
                    },
                    success: function (userData) {
                        var i=0,length=Object.keys(userData).length;
                        sort_down_by_name(userData);
                        for(i; i<=length-1;i++)
                        {
                            var $list_div= $('<div class="listing-item mb-20" id="user_list'+i+'">' +
                                '<div class="row grid-space-0">' +
                                '<div class="col-md-6 col-lg-4 col-xl-2">' +
                                '<div class="overlay-container" id="img_container'+i+'"></div></div>' +
                                '<div class="col-md-6 col-lg-8 col-xl-9">' +
                                '<div class="body" id = "list_body'+i+'"></div>' +
                                '</div></div></div>');
                            $('#down_list').append($list_div);
                            var $img_src = $('<img src="template/images/product-1.jpg">');
                            $('#img_container'+i).append($img_src);/profile_image blob으로 읽힘*/
                            var $list_header = $('<h3 class="margin-clear">'+userData[i].userID+'</h3>');
                            var list_body_id='#list_body'+i;
                            $(list_body_id).append($list_header);
                            var score='';
                            var j;
                            for(j=1;j<=userData[i].userFeedbackScore;j++){
                                score = score + '<i class="fa fa-star text-default"></i>';
                            }
                            for(j=1;j<=5-userData[i].userFeedbackScore;j++){
                                score= score + '<i class="fa fa-star"></i>'
                            }
                            var $in_body = $('<p>'+score+'<a href="#" class="btn-sm-link"><i class="fa fa-search" data-toggle="modal" data-target="#user_detail" data-userid='+userData[i].userID+'>상세보기</i></a></p>'+'<div class="elements-list clearfix">' +
                                '<a href="#" class="pull-right btn btn-sm btn-animated btn-danger btn-default-transparent">탈퇴시키기<i class="fa fa-times"></i></a>' +
                                '</div>');
                            $(list_body_id).append($in_body);
                            $('#user_list'+i).clone().prependTo('#up_list');
                        }
                    }
                });
            });
        })
	}); // End document ready

    $('#user_detail').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var recipient = button.data('userid'); // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        $('#user_detailModalLabel').remove();
        $('#user_detail_modal_header').append('<h4 class="modal-title" id="user_detailModalLabel">'+recipient+'</h4>');
        modal.find('#user_detail_modal_body').text(recipient);
    });

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

function makeUserList(userData){
/*    var i=0,length=Object.keys(userData).length;;
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
        //var $img_src = $('<img src="template/images/product-1.jpg">');
        //$('#img_container'+i).append($img_src);/profile_image blob으로 읽힘*!/
        var $list_header = $('<h3 class="margin-clear">'+userData[i].userID+'</h3>');
        var list_body_id='#list_body'+i;
        $(list_body_id).append($list_header);
        var score='';
        var j;
        for(j=1;j<=userData[i].userFeedbackScore;j++){
            score = score + '<i class="fa fa-star text-default"></i>';
        }
        for(j=1;j<=5-userData[i].userFeedbackScore;j++){
            score= score + '<i class="fa fa-star"></i>'
        }
        var $feedbackScore_and_detail = $('<p>'+score+'<a href="#" class="btn-sm-link"><i class="fa fa-search" data-toggle="modal" data-target="#user_detail">상세보기</i></a></p>');
        var $dropOut = $('<div class="elements-list clearfix">' +
            '<a href="#" class="pull-right btn btn-sm btn-animated btn-danger btn-default-transparent" data-toggle="modal" data-target="#dropOut">탈퇴시키기<i class="fa fa-times"></i></a>' +
            '</div>');
        $(list_body_id).append($feedbackScore_and_detail);
        $(list_body_id).append($dropOut);
    }*/
}

function show_userDetailModal(userData){

}