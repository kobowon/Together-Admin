/*
 * Version: 2.1
 */

// Notify Plugin - Code for the demo site of HtmlCoder
// You can delete the code below
//-----------------------------------------------
(function($) {

	"use strict";

	$(document).ready(function() {

        document.getElementById("search_text").value=getSavedValue("search_text");

        var url="/admin/users";
        $.ajax({
            type: "GET",
            url:url,
            dataType: "json",
            error:function (request,status,error) {
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            },
            success: function (userData) {
                var i=0,length=Object.keys(userData).length;
                sort_down_by_name(userData);
                for(i; i<=length-1;i++)
                {
                    var $list_div= $(
                        '<div class="image-box style-3-b" id="user_list'+i+'">' +
                            '<div class="row">' +
                                '<div class="col-md-6 col-lg-4 col-xl-2">' +
                                    '<div class="overlay-container" id="img_container'+i+'"></div>' +
                                '</div>' +
                                '<div class="col-md-6 col-lg-8 col-xl-9">' +
                                    '<div class="body" id = "list_body'+i+'"></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>');
                    $('#down_list').append($list_div);
                    var imgUrl="http://210.89.191.125/photo/"+userData[i].profileImage;
                    var $img_src = $('<img src='+imgUrl+'><a class="overlay-link popup-img-single" href='+imgUrl+'><i class="fa fa-search-plus"></i></a>');
                    $('#img_container'+i).append($img_src);
                    var $list_header = $('<h3 class="title userID_header">'+userData[i].userId+'</h3>');
                    var list_body_id='#list_body'+i;
                    $(list_body_id).append($list_header);
                    var $in_body = $(
                        '<p class="small mb-10">'+
                            score_star(userData[i].userFeedbackScore)+
                            '<a href="#" class="btn-sm-link"><i class="fa fa-search" data-toggle="modal" data-target="#user_detail" data-userid='+userData[i].userId+' data-usertype='+userData[i].userType+' data-score='+userData[i].userFeedbackScore+'>상세보기</i></a>' +
                        '</p>'+
                        '<div class="separator-2"></div>'+
                        '<div class="mb-10">' +
                            '<p>사용자 타입 : '+userData[i].userType+'</p>'+
                            '<a href="#" class="pull-right btn btn-sm btn-animated btn-danger btn-default-transparent" data-toggle="modal" data-target="#dropOut" data-userid = '+userData[i].userId+'>탈퇴시키기<i class="fa fa-user-times"></i></a>' +
                        '</div>');
                    $(list_body_id).append($in_body);
                    $('#user_list'+i).clone().prependTo('#up_list');
                }
                filter();
            }
        });

        //사용자 ID부분에 text 넣었을 때 필터 적용
        $("#search_text").keyup(function() {
            filter();
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

            var $modal_body = $(
                '<div class="col-lg-auto" id="user_detailModalContent">' +
                    '<h4><i class="fa fa-address-card-o"></i> 사용자 기본 정보</h4>'+
                    '<p>' +
                        '사용자 ID: '+userID+'<br>' +
                        '사용자 타입 : '+userType+'<br>' +
                        '사용자 총 평점 : '+score_star(userScore)+
                    '</p>'+
                    '<h4><i class="fa fa-handshake-o"></i>사용자 봉사 내역</h4>'+
                    '<p id="user_vol_list">' +
                    '</p>'+
                '</div>');

            $('#user_detail_modal_body').empty();
            $('#user_detail_modal_body').append($modal_body);
            var url="/admin/volunteers/user-id/";
            var text= userID;
            $.ajax({
                type: "GET",
                url:url+text,
                dataType: "json",
                error:function (request,status,error) {
                    //alert("봉사내역을 조회할 수 없습니다");
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                },
                success: function (userVolunteerData) {
                    //$('#user_detail_modal_body').empty();
                    var i=0,vol_list_length=Object.keys(userVolunteerData).length;
                    //sort_up_by_date(userVolunteerData); 날짜순 정렬 안되고있음!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    for(i; i<=vol_list_length-1;i++)
                    {
                        var $vol_list_div= $(
                            '<div class="listing-item mb-20" id="vol_list'+i+'">' +
                                '<div class="row grid-space-0">' +
                                    '<div class="col-md-6 col-lg-8 col-xl-12">' +
                                        '<div class="body" id = "vol_list_body'+i+'"></div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>');
                        $('#user_vol_list').append($vol_list_div);
                        var vol_score;
                        if(userType='helper') {
                            vol_score = score_star(userVolunteerData[i].helpeeScore);
                        }else {
                            vol_score = score_star(userVolunteerData[i].helperScore);
                        }
                        var $vol_list_body = $(
                            '<h4 class="margin-clear">봉사 번호 : '+userVolunteerData[i].volunteerId+'</h4>'+
                            '<p>'+
                                '봉사 종류 : '+userVolunteerData[i].type+'<br>'+
                                '받은 평점: '+vol_score+
                            '</p>'+
                            '<div class="elements-list clearfix">' +
                                '<a href="#" class="pull-right btn btn-sm btn-animated btn-default-transparent" data-toggle="modal" data-target="#vol_detail" data-volid="'+userVolunteerData[i].volunteerId+'">봉사 상세보기<i class="fa fa-search"></i></a>' +
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
            var modal = $(this);
            var url="/admin/volunteers/volunteer-id/";
            var text= volID;
            $.ajax({
                type: "GET",
                url: url + text,
                dataType: "json",
                error:function (request,status,error) {
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                },
                success: function (volData) {
                    $('#vol_detail_modal_header').append('<h4 class="modal-title" id="vol_detailModalLabel">봉사 '+volID+' 상세보기</h4>' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
                    var score = 'Helper 평점 :' + score_star(volData[0].helpeeScore) + ' / Helpee 평점 : ' + score_star(volData[0].helperScore);
                    var $modal_body = $(
                        '<div class="col-lg-auto" id="vol_detailModalContent">' +
                            '<p>'+
                                '<h4><i class="fa fa-handshake-o"></i> 봉사 정보</h4>'+
                                'Helper ID : '  + volData[0].helperId +'<br>'+
                                'Helpee ID : '  + volData[0].helpeeId +'<br>'+
                                '봉사 인증시간 : '+ volData[0].realDuration+'시간<br>'+
                                '봉사 날짜 : ' + (volData[0].date).substring(0,10) +'<br>'+
                                '봉사 위치 :' + getLocation(volData[0].longitude, volData[0].latitude)+'<br>'+
                                '봉사 종류 : '+ volData[0].type + '<br>'+
                                '봉사 상세 내용 : '+ volData[0].content+'<br>'+
                                '<a href="/map?volID='+volID+'">봉사 위치 로그 보기</a>'+
                            '</p>'+
                            '<p>' +
                                '<h4><i class="fa fa-newspaper-o"></i> Feedback</h4>'+
                                score +'<br>'+
                                'Helper의 feedback 상세 내용 : '+ volData[0].helperFeedbackContent +'<br>'+
                                'Helpee의 feedback 상세 내용 : ' +'' +
                                '<div class="form-group">' +
                                    '<textarea class="form-control feedbackTextArea" id="feedbackTextArea" rows="4" placeholder="녹음파일 내용을 입력하세요"></textarea>' +
                                    '<a id="feedbackModify" onclick="saveFeedback('+volID+')" class="pull-right btn btn-sm btn-animated btn-default-transparent">수정하기<i class="fa fa-pencil"></i></a>' +
                                    '<a id="feedbackSave" onclick="saveFeedback('+volID+')" class="pull-right btn btn-sm btn-animated btn-default-transparent">저장하기<i class="fa fa-save"></i></a>' +
                                '</div>'+
                                '<audio controls src="http://lim-bo.com/photo/'+volID+'.mp3">Your user agent does not support the HTML5 Audio element.</audio>'+
                            '</p>'+
                        '</div>');
                    $('#vol_detail_modal_body').append($modal_body);
                }
            });
        });


        //탛퇴 버튼 눌렀을 때 모달 뜨고 사용자 삭제하기
        $('#dropOut').on('show.bs.modal', function (event) {
            $('#dropOut_modal_header').empty();
            $('#dropOut_modal_body').empty();
            var button = $(event.relatedTarget); // Button that triggered the modal
            var userID = button.data('userid'); // Extract info from data-* attributes
            var modal = $(this);
            var url = "/Admin/user";
            var delete_user_info = {"userId": userID};
            $.ajax({
                type: "DELETE",
                url: url,
                data: delete_user_info,
                dataType: "json",

                error:function (request,status,error) {
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                },
                success: function (xhr, desc, err) {
                    $('#dropOut_modal_header').append('<h4 class="modal-title" id="dropOutModalLabel">사용자 ' + userID + ' 탈퇴시키기</h4>' +
                        '<button type="button" onclick="refresh()" class="close refresh_parent" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
                    var $modal_body = $(
                        '<div class="col-lg-auto" id="dropOutModalContent">' +
                            '<p>사용자 "' + userID + '"를 탈퇴시켰습니다.</p>' +
                        '</div>');
                    $('#dropOut_modal_body').append($modal_body);
                }
            });
        });///////////////////////////////////////////////////////////////////////새로고침 고려해보기

    }); // End document ready
})(jQuery);

/*//userId 오름차순으로 정렬
function sort_up_by_name(userObjects){
    userObjects.sort(function(a,b){
        return a.userId < b.userId ? -1 : a.userId > b.userId ? 1 : 0;
    })
}*/

//userId 내림차순으로 정렬
function sort_down_by_name(userObjects){
    userObjects.sort(function(a,b){
        return a.userId > b.userId ? -1 : a.userId < b.userId ? 1 : 0;
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

function refresh(){
    parent.location.reload();
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

function saveValue(e){
    var id = e.id;
    var val = e.value;
    localStorage.setItem(id, val);
}

function getSavedValue(v){
    if (localStorage.getItem(v) === null) {
        return "";
    }
    return localStorage.getItem(v);
}

function filter() {
    var text= $("#search_text").val();
    $(".image-box").hide();
    var temp = $(".userID_header:contains('" + text + "')");
    $(temp).parent().parent().parent().parent().show();
}

function getLocation(lng, lat){
    var geocode = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&key=AIzaSyCDIeArNwxnqoGn0ERABXrI3M6U-OMyIos&sensor=false";
    var address="";
    $.ajax({
        async: false,
        url: geocode,
        type: 'POST',
        success: function(locationResult){
            if(locationResult.status == 'OK') {
                address+= locationResult.results[1].formatted_address;
            } else{
                alert("봉사 위치를 가져올 수 없습니다.");
                address+="위치정보 오류";
            }
        }
    });
    return address;
}