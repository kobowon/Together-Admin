/*
 * Version: 2.1
 */

// Notify Plugin - Code for the demo site of HtmlCoder
// You can delete the code below
//-----------------------------------------------
(function($) {

    "use strict";

    $(document).ready(function() {

        document.getElementById("approve_state_list").value=getSavedValue("approve_state_list");
        document.getElementById("user_search_text").value=getSavedValue("user_search_text");
        document.getElementById("date_search_text").value=getSavedValue("date_search_text");


        var url="/admin/volunteers/end";
        $.ajax({
            type: "GET",
            url:url,
            dataType: "json",
            error:function (request,status,error) {
                alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            },
            success: function (volData) {
                var i=0,length=Object.keys(volData).length;
                //sort_down_by_date(volData);
                for(i; i<=length-1;i++)
                {
                    var $vol_list_div= $(
                        '<div class="image-box style-3-b" id="vol_list'+i+'">' +
                            '<div class="row">' +
                                '<div class="col-md-12 col-lg-12 col-xl-12">' +
                                    '<div class="body" id = "vol_list_body'+i+'"></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>');
                    $('.main').prepend($vol_list_div);

/*                    var volunteerType;
                    var icon;
                    if(volData[i].type=='outside'){ //외출 봉사
                        volunteerType='외출';
                        icon= 'fa fa-street-view';
                    }else if(volData[i].type=='education'){ //교육 봉사
                        volunteerType='교육';
                        icon= 'fa fa-pencil-square-o';
                    }else if (volData[i].type=='talk'){ //말동무 봉사
                        volunteerType='말동무';
                        icon= 'fa fa-comments-o';
                    }else{ //가사 봉사
                        volunteerType='가사';
                        icon= 'fa fa-home';
                    }*/

                    var $list_header = $('<h3 class="margin-clear volID_header long_text">'+volData[i].content+'</h3>');
                    $('#vol_list_body'+i).append($list_header);

                    var wait_btn=
                        '<div class="elements-list clearfix">' +
                            '<a href="#" class="pull-right btn btn-sm btn-animated btn-danger btn-default-transparent" data-toggle="modal" data-target="#reject" data-volid = '+volData[i].volunteerId+'>승인 거부<i class="fa fa-times"></i></a>' +
                            '<a href="#" class="pull-right btn btn-sm btn-animated btn-danger btn-default-transparent" data-toggle="modal" data-target="#approve" data-volid = '+volData[i].volunteerId+'>승인<i class="fa fa-check"></i></a>' +
                        '</div>';

                    var accept_btn=
                        '<div class="elements-list clearfix pl-5">' +
                            '<a href="#" class="pull-right btn btn-sm btn-animated btn-danger btn-default-transparent" data-toggle="modal" data-target="#wait" data-volid = '+volData[i].volunteerId+'>승인 취소<i class="fa fa-reply"></i></a>' +
                        '</div>';

                    var reject_btn=
                        '<div class="elements-list clearfix">' +
                            '<a href="#" class="pull-right btn btn-sm btn-animated btn-danger btn-default-transparent" data-toggle="modal" data-target="#wait" data-volid = '+volData[i].volunteerId+'>승인거부 취소<i class="fa fa-reply"></i></a>' +
                        '</div>';
                    var approve_status;
                    var buttons;
                    if(volData[i].acceptStatus=='wait'){ //승인 대기 상태의 경우
                        approve_status='wait';
                        buttons=wait_btn;
                    }else if(volData[i].acceptStatus=='accept'){ //승인 완료 상태의 경우
                        approve_status='accept';
                        buttons=accept_btn;
                    }else if (volData[i].acceptStatus=='reject'){ //승인 거부 상태의 경우
                        approve_status='reject';
                        buttons=reject_btn;
                    }



                    var $in_body = $(
                        '<p small mb-10>'+
                            '봉사자 평점 : '+score_star(volData[i].helpeeScore)+' / 어르신 평점 : '+score_star(volData[i].helperScore)+
                            '<a href="/admin/volunteer-detail/'+volData[i].volunteerId+'" class="btn-sm-link"><i class="fa fa-search">상세보기</i></a>' +
                        '</p>'+
                        '<div class="separator-2"></div>'+
                        '<div class="mb-10">'+
                            '<p>' +
                                '<span class="userId_filter">'+
                                '봉사자 <i class="fa fa-phone"></i> : '  + volData[i].helperId +'<br>'+
                                '어르신 <i class="fa fa-phone"></i> : '  + volData[i].helpeeId +'<br>'+
                                '</span>'+
                                '봉사 인증시간 : '+ volData[i].realDuration+'시간<br>'+
                                '봉사 날짜 : <span class="vol_content_date">' + volData[i].date +'</span>'+
                            '</p>' +
                            buttons+
                        '</div>'
                    );
                    $('#vol_list'+i).addClass(approve_status);
                    $('#vol_list_body'+i).append($in_body);
                }
                state_filter();
                filter();
            }
        });

        $('#approve_state_list').change(function() {
            state_filter();
            filter();
        });

        //사용자 ID부분에 text 넣었을 때 필터 적용
        $("#user_search_text").keyup(function() {
            state_filter();
            filter();
        });

        //날짜 부분에 text 넣었을 때 필터 적용
        $("#date_search_text").keyup(function() {
            state_filter();
            filter();
        });

        //승인 버튼 눌렀을 때 모달 뜨고 리스트 업데이트하기
        $('#approve').on('show.bs.modal', function (event) {
            $('#approve_modal_header').empty();
            $('#approve_modal_body').empty();
            var button = $(event.relatedTarget); // Button that triggered the modal
            var volID = button.data('volid'); // Extract info from data-* attributes

            var modal = $(this);
            var url = "/admin/volunteer/accept";
            var approve_vol_info = {"volunteerId": volID};
            $.ajax({
                type: "PUT",
                url: url,
                data: approve_vol_info,
                dataType: "json",

                error:function (request,status,error) {
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                },
                success: function (xhr, desc, err) {
                    $('#approve_modal_header').append('<h4 class="modal-title" id="approveModalLabel">봉사 ID ' + volID + ' 승인하기</h4>' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
                    var $modal_body = $(
                        '<div class="col-lg-auto" id="approveModalContent">' +
                            '<p>봉사ID "' + volID + '"를 승인했습니다.</p>' +
                        '</div>');
                    $('#approve_modal_body').append($modal_body);
                }
            });
            //location.reload();
        });


        //거부 버튼 눌렀을 때 모달 뜨고 리스트 업데이트하기
        $('#reject').on('show.bs.modal', function (event) {
            $('#reject_modal_header').empty();
            $('#reject_modal_body').empty();
            var button = $(event.relatedTarget); // Button that triggered the modal
            var volID = button.data('volid'); // Extract info from data-* attributes

            var modal = $(this);
            var url = "/admin/volunteer/reject";
            var reject_vol_info = {"volunteerId": volID};
            $.ajax({
                type: "PUT",
                url: url,
                data: reject_vol_info,
                dataType: "json",

                error:function (request,status,error) {
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                },
                success: function (xhr, desc, err) {
                    $('#reject_modal_header').append('<h4 class="modal-title" id="rejectModalLabel">봉사 ID ' + volID + ' 승인거부하기</h4>' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
                    var $modal_body = $(
                        '<div class="col-lg-auto" id="rejectModalContent">' +
                            '<p>봉사ID "' + volID + '"를 승인거부했습니다.</p>' +
                        '</div>');
                    $('#reject_modal_body').append($modal_body);
                }
            });
            //location.reload();
        });

        //승인취소 버튼 or 승인거부 취소 버튼 눌렀을 때 모달 뜨고 리스트 업데이트하기
        $('#wait').on('show.bs.modal', function (event) {
            $('#wait_modal_header').empty();
            $('#wait_modal_body').empty();
            var button = $(event.relatedTarget); // Button that triggered the modal
            var volID = button.data('volid'); // Extract info from data-* attributes

            var modal = $(this);
            var url = "/admin/volunteer/wait";
            var wait_vol_info = {"volunteerId": volID};
            $.ajax({
                type: "PUT",
                url: url,
                data: wait_vol_info,
                dataType: "json",

                error:function (request,status,error) {
                    alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                },
                success: function (xhr, desc, err) {
                    $('#wait_modal_header').append('<h4 class="modal-title" id="approveModalLabel">봉사 ID ' + volID + ' 승인/거부 취소하기</h4>' +
                        '<button type="button" onclick="refresh()" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>');
                    var $modal_body = $(
                        '<div class="col-lg-auto" id="approveModalContent">' +
                            '<p>봉사ID "' + volID + '"를 대기상태로 전환했습니다.</p>' +
                        '</div>');
                    $('#wait_modal_body').append($modal_body);
                }
            });
            //location.reload();
        });

        //업데이트시 새로고침
        $(".refresh_parent").on('click',function () {
            parent.location.reload();
        });

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
    var i,j;
    for(i=1;i<=score;i++){
        score_star = score_star + '<i class="fa fa-star"></i>';
    }
    for(j=1;j<=5-score;j++){
        score_star= score_star + '<i class="fa fa-star-o"></i>'
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

function state_filter() {
    var state=$("#approve_state_list").val();

    if (state== 'all') {
        // Do something for option "전체"
        $(".image-box").show();
    }else if (state== 'wait') {
        // Do something for option "승인대기"
        $(".image-box").hide();
        $(".wait").show();
    }else if (state== 'accept') {
        // Do something for option "승인완료"
        $(".image-box").hide();
        $(".accept").show();
    }else if (state== 'reject') {
        // Do something for option "승인거부"
        $(".image-box").hide();
        $(".reject").show();
    }
}

function filter() {

    var userText= $("#user_search_text").val();
    var dateText= $("#date_search_text").val();
    //alert($('.vol_content_helperID:not(:contains('+ userText +'))').val());
    /*if($('.vol_content_helpeeID:not(:contains('+ userText +'))').val()!==undefined){
        if($('.vol_content_helperID:not(:contains('+ userText +'))').val()!==undefined)
            $('.vol_content_helperID:not(:contains('+ userText +'))').parent().parent().parent().parent().parent().parent().hide();
    }*/
    $('.userId_filter:not(:contains('+userText+'))').parent().parent().parent().parent().parent().parent().hide();
    $('.vol_content_date:not(:contains('+ dateText +'))').parent().parent().parent().parent().parent().parent().hide();
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

function refresh(){
    parent.location.reload();
}

function playAudio(src) {
    var audio = new Audio(src);
    audio.play();
}

function saveFeedback(volID) {
    var url = "/admin/one-line-feedback";
    var feedbackContent = {"helpeeFeedbackContent": $('#feedbackTextArea').val(),"volunteerId": volID};
    $.ajax({
        type: "PUT",
        url: url,
        data: feedbackContent,
        dataType: "json",

        error:function (request,status,error) {
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        },
        success: function (xhr, desc, err) {
            alert("녹음 내용이 저장되었습니다");
        }
    });
}