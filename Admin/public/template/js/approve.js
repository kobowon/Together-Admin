/*
 * Version: 2.1
 */

// Notify Plugin - Code for the demo site of HtmlCoder
// You can delete the code below
//-----------------------------------------------
(function($) {

    "use strict";

    $(document).ready(function() {

/*

*/
        /*document.getElementById("search_text").value=getSavedValue("search_text");*/

        var url="/admin/volunteers";
        $.ajax({
            type: "GET",
            url:url,
            dataType: "json",
            error:function () {
                alert("오류");
            },
            success: function (volData) {
                var i=0,length=Object.keys(volData).length;
                sort_down_by_date(volData);
                for(i; i<=length-1;i++)
                {
                    var $vol_list_div= $('<div class="listing-item mb-20" id="vol_list'+i+'">' +
                        '<div class="row grid-space-0">' +
                        '<div class="col-md-6 col-lg-8 col-xl-12">' +
                        '<div class="body" id = "vol_list_body'+i+'"></div>' +
                        '</div></div></div>');
                    $('#down_list').append($vol_list_div);



                    var $list_header = $('<h3 class="margin-clear volID_header">봉사 ID : '+volData[i].volunteerId+'</h3>');
                    var list_body_id='#vol_list_body'+i;
                    $(list_body_id).append($list_header);

                    var wait_btn=
                        '<div class="elements-list clearfix">' +
                            '<a href="#" class="pull-right btn btn-sm btn-animated btn-danger btn-default-transparent" data-toggle="modal" data-target="#reject" data-volid = '+volData[i].volunteerId+'>거부하기<i class="fa fa-times"></i></a>' +
                            '<a href="#" class="pull-right btn btn-sm btn-animated btn-danger btn-default-transparent" data-toggle="modal" data-target="#approve" data-volid = '+volData[i].volunteerId+'>승인하기<i class="fa fa-check"></i></a>' +
                        '</div>';

                    var accept_btn=
                        '<div class="elements-list clearfix pl-5">' +
                            '<a href="#" class="pull-right btn btn-sm btn-animated btn-danger btn-default-transparent" data-toggle="modal" data-target="#approve" data-volid = '+volData[i].volunteerId+'>승인 취소하기<i class="fa fa-reply"></i></a>' +
                        '</div>';

                    var reject_btn=
                        '<div class="elements-list clearfix">' +
                            '<a href="#" class="pull-right btn btn-sm btn-animated btn-danger btn-default-transparent" data-toggle="modal" data-target="#approve" data-volid = '+volData[i].volunteerId+'>승인거부 취소하기<i class="fa fa-reply"></i></a>' +
                        '</div>';
                    var approve_status;
                    var buttons;
                    if(volData[i].acceptStatus='wait'){ //승인 대기 상태의 경우
                        approve_status='wait';
                        buttons=wait_btn;
                    }else if(volData[i].acceptStatus='accept'){ //승인 완료 상태의 경우
                        approve_status='accept';
                        buttons=accept_btn;
                    }else{ //승인 거부 상태의 경우
                        approve_status='reject';
                        buttons=reject_btn;
                    }

                    var $in_body = $(
                        '<p>'+
                            'Helper 평점 : '+score_star(volData[i].helperScore)+' / Helpee 평점 : '+score_star(volData[i].helpeeScore)+
                            '<a href="#" class="btn-sm-link"><i class="fa fa-search" data-toggle="modal" data-target="#vol_detail" data-volid='+volData[i].volunteerId+' data-voltype=volData[i].type>상세보기</i></a>' +
                        '</p>'+
                        '<p>' +
                            'Helper ID : '  + volData[i].helperId +'<br>'+
                            'Helpee ID : '  + volData[i].helpeeId +'<br>'+
                            '봉사 인증시간 : '+ volData[i].duration+'시간<br>'+
                            '봉사 날짜 : ' + volData[i].date +'<br>'+
                            '봉사 종류 : '+ volData[i].type +
                        '</p>'+
                        buttons
                    );

                    $('#vol_list'+i).addClass(approve_status);
                    $(list_body_id).append($in_body);
                    $('#vol_list'+i).clone().prependTo('#up_list');
                }
                $('#approve_state_list').change(function() {
                    if ($(this).val() === 'all') {
                        // Do something for option "전체"
                        $(".listing-item").show();
                    }else if ($(this).val() === 'wait') {
                        // Do something for option "승인대기"
                        $(".listing-item").hide();
                        $(".wait").show();
                    }else if ($(this).val() === 'accept') {
                        // Do something for option "승인완료"
                        $(".listing-item").hide();
                        $(".accept").show();
                    }else if ($(this).val() === 'reject') {
                        // Do something for option "승인거부"
                        $(".listing-item").hide();
                        $(".reject").show();
                    }
                });
                //filter();
            }
        });

/*        //사용자 ID부분에 text 넣었을 때 필터 적용
        $("#search_text").keyup(function() {
            filter();
        });*/

        //사용자 상세보기 모달 내용 동적으로 넣기
 /*       $('#user_detail').on('show.bs.modal', function (event) {
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
            var url="/admin/get-volunteerlist-by-userid/";
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
        });*/


        //봉사상세보기 모달 내용 동적으로 넣기
        $('#vol_detail').on('show.bs.modal', function (event) {
            $('#vol_detail_modal_header').empty();
            $('#vol_detail_modal_body').empty();
            var button = $(event.relatedTarget); // Button that triggered the modal
            var volID = button.data('volid'); // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var modal = $(this);
            var url="/admin/volunteers/volunteer-id/";
            var text= volID;
            $.ajax({
                type: "GET",
                url: url + text,
                dataType: "json",
                error: function () {
                    alert("봉사상세정보를 조회할 수 없습니다");
                },
                success: function (volData) {
                    $('#vol_detail_modal_header').append('<h4 class="modal-title" id="vol_detailModalLabel">봉사 '+volID+' 상세보기</h4>' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
                    var score = 'Helper 평점 :' + score_star(volData[0].helperScore) + ' / Helpee 평점 : ' + score_star(volData[0].helpeeScore);
                    var $modal_body = $(
                        '<div class="col-lg-auto" id="vol_detailModalContent">' +
                            '<p>'+
                                '<h4><i class="fa fa-handshake-o"></i> 봉사 정보</h4>'+
                                'Helper ID : '  + volData[0].helperId +'<br>'+
                                'Helpee ID : '  + volData[0].helpeeId +'<br>'+
                                '봉사 인증시간 : '+ volData[0].duration+'시간<br>'+
                                '봉사 날짜 : ' + volData[0].date +'<br>'+
                                '봉사 위치 :' + getLocation(volData[0].longitude, volData[0].latitude)+'<br>'+
                                '봉사 종류 : '+ volData[0].type + '<br>'+
                                '봉사 상세 내용 : '+ volData[0].content +
                            '</p>'+
                            '<p>' +
                                '<h4><i class="fa fa-newspaper-o"></i> Feedback</h4>'+
                                score +'<br>'+
                                'Helper의 feedback 상세 내용 : '+ volData[0].helperFeedbackContent +'<br>'+
                                'Helpee의 feedback 상세 내용 : '+ volData[0].helpeeFeedbackContent +
                            '</p>'+
                        '</div>');
                    $('#vol_detail_modal_body').append($modal_body);
                }
            });
        });


        //탛퇴 버튼 눌렀을 때 모달 뜨고 사용자 삭제하기
       /* $('#dropOut').on('show.bs.modal', function (event) {
            $('#dropOut_modal_header').empty();
            $('#dropOut_modal_body').empty();
            var button = $(event.relatedTarget); // Button that triggered the modal
            var userID = button.data('userid'); // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var modal = $(this);
            var url = "/admin/remove-user";
            var delete_user_info = {"userID": userID};
            $.ajax({
                type: "DELETE",
                url: url,
                data: delete_user_info,
                dataType: "json",

                error: function () {
                    alert("실패했습니다.");
                },
                success: function (xhr, desc, err) {
                    $('#dropOut_modal_header').append('<h4 class="modal-title" id="dropOutModalLabel">사용자 ' + userID + ' 탈퇴시키기</h4>' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
                    var $modal_body = $(
                        '<div class="col-lg-auto" id="user_detailModalContent">' +
                        '<p>사용자 "' + userID + '"를 탈퇴시켰습니다,</p>' +
                        '</div>');
                    $('#dropOut_modal_body').append($modal_body);
                }
            });
            location.reload();
        });*/


    }); // End document ready
})(jQuery);

//봉사내역 날짜 최근순으로 정렬
function sort_down_by_date(volObjects){
    volObjects.sort(function(a,b){
        return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
    })
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
    var text= $("#user_search_text").val();
    $(".listing-item").hide();
    var temp = $(".volID_header:contains('" + text + "')");
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
    alert(address);
    return address;
}