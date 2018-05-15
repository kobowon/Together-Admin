/*
 * Version: 2.1
 */

// Notify Plugin - Code for the demo site of HtmlCoder
// You can delete the code below
//-----------------------------------------------
(function($) {

	"use strict";

	$(document).ready(function() {

	    //조회버튼 동작
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
                        alert("조회하실 아이디를 입력하세요.");
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
                            var $in_body = $(
                                '<p>'+
                                    score_star(userData[i].userFeedbackScore)+
                                    '<a href="#" class="btn-sm-link"><i class="fa fa-search" data-toggle="modal" data-target="#user_detail" data-userid='+userData[i].userID+' data-usertype='+userData[i].userType+' data-score='+userData[i].userFeedbackScore+'>상세보기</i></a>' +
                                '</p>'+
                                '<div class="elements-list clearfix">' +
                                    '<a href="#" class="pull-right btn btn-sm btn-animated btn-danger btn-default-transparent">탈퇴시키기<i class="fa fa-times"></i></a>' +
                                '</div>');
                            $(list_body_id).append($in_body);
                            $('#user_list'+i).clone().prependTo('#up_list');
                        }
                    }
                });
            });
        });

        //사용자 상세보기 모달 내용 동적으로 넣기
        $('#user_detail').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget); // Button that triggered the modal
            var userID = button.data('userid'); // Extract info from data-* attributes
            var userType = button.data('usertype');
            var userScore =button.data('score');
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var modal = $(this);
            $('#user_detail_modal_header').empty();
            $('#user_detail_modal_header').append('<h4 class="modal-title" id="user_detailModalLabel">사용자 '+userID+' 상세보기</h4>' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
            var score = '<p>'+score_star(userScore)+'</p>';
            var $modal_body = $(
                '<div class="col-lg-auto" id="user_detailModalContent">' +
                    '<p>사용자 타입 : '+userType+'</p>'+
                    score +
                '</div>');
            var url="http://localhost:9001/Admin/getVolunteerListByUserID/";
            var text= userID;
            $.ajax({
                type: "GET",
                url:url+text,
                dataType: "json",
                error:function () {
                    alert("봉사내역을 조회할 수 없습니다");
                },
                success: function (userVolunteerData) {
                    $('#user_detail_modal_body').empty();
                    var i=0,vol_list_length=Object.keys(userVolunteerData).length;
                    //sort_up_by_date(userVolunteerData); 날짜순 정렬 안되고있음!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    for(i; i<=vol_list_length-1;i++)
                    {
                        var $vol_list_div= $('<div class="listing-item mb-20" id="vol_list'+i+'">' +
                            '<div class="row grid-space-0">' +
                            '<div class="col-md-6 col-lg-8 col-xl-12">' +
                            '<div class="body" id = "vol_list_body'+i+'"></div>' +
                            '</div></div></div>');
                        $('#user_detail_modal_body').append($vol_list_div);
                        var $vol_list_header = $('<h3 class="margin-clear">봉사 번호 : '+userVolunteerData[i].volunteer_id+'</h3>');
                        $('#vol_list_body'+i).append($vol_list_header);
                        var vol_score;
                        if(userType='helper') {
                            vol_score = score_star(userVolunteerData[i].helper_Score);
                        }else {
                            vol_score = score_star(userVolunteerData[i].helpee_Score);
                        }
                        var $vol_list_body = $(
                            '<p>'+
                                '봉사 종류 : '+userVolunteerData[i].type+'<br>'+
                                '받은 평점: '+vol_score+
                            '</p>'+
                            '<div class="elements-list clearfix">' +
                                '<a href="#" class="pull-right btn btn-sm btn-animated btn-default-transparent" data-toggle="modal" data-target="#vol_detail" data-volid="'+userVolunteerData[i].volunteer_id+'">봉사 상세보기<i class="fa fa-search"></i></a>' +
                            '</div>');
                        $('#vol_list_body'+i).append($vol_list_body);
                    }
                }
            });
        });


        //봉사상세보기 모달 내용 동적으로 넣기
        $('#vol_detail').on('show.bs.modal', function (event) {
            $('#vol_detail_modal_header').empty();
            $('#vol_detail_modal_body').empty();
            var button = $(event.relatedTarget); // Button that triggered the modal
            var volID = button.data('volid'); // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var modal = $(this);
            var url="http://localhost:9001/Admin/getVolunteerListByVolunteerID/";
            var text= volID;
            $.ajax({
                type: "GET",
                url: url + text,
                dataType: "json",
                error: function () {
                    alert("봉사상세정보를 조회할 수 없습니다");
                },
                success: function (volData) {
                    $('#vol_detail_modal_header').append('<h4 class="modal-title" id="vol_detailModalLabel">봉사 상세보기</h4>' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
                    var score = '<p>Helper 평점 :' + score_star(volData[0].helper_Score) + '<br>Helpee 평점 : ' + score_star(volData[0].helpee_Score) + '</p>';
                    var $modal_body = $(
                        '<div class="col-lg-auto" id="user_detailModalContent">' +
                        score +
                        '</div>');
                    $('#vol_detail_modal_body').append($modal_body);
                }
            });
        });


    }); // End document ready
})(jQuery);

/*//userID 오름차순으로 정렬
function sort_up_by_name(userObjects){
    userObjects.sort(function(a,b){
        return a.userID < b.userID ? -1 : a.userID > b.userID ? 1 : 0;
    })
}*/

//userID 내림차순으로 정렬
function sort_down_by_name(userObjects){
    userObjects.sort(function(a,b){
        return a.userID > b.userID ? -1 : a.userID < b.userID ? 1 : 0;
    })
}

//봉사내역 날짜 최근순으로 정렬
function sort_up_by_date(volObjects){
    var date = volObjects.year+volObjects.month+volObjects.day;
    volObjects.date=date;
    volObjects.sort(function(a,b){
        return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
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

function score_star(score){
    var score_star='';
    var j;
    for(j=1;j<=score;j++){
        score_star = score_star + '<i class="fa fa-star text-default"></i>';
    }
    for(j=1;j<=5-score;j++){
        score_star= score_star + '<i class="fa fa-star"></i>'
    }
    return score_star;
}