(function($) {

    "use strict";

    $(document).ready(function() {
        var volID = location.href.substr(
            location.href.lastIndexOf('=') + 1
        );

        var url="/admin/location/";
        $.ajax({
            type: "GET",
            url: url+volID,
            dataType: "json",
            error: function (request, status, error) {
                alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (volLogData) {
                var length = Object.keys(volLogData).length;
                if(length>0) {
                    $('#vol_info').append('<p>봉사 시작 시간 : ' + volLogData[0].date + '<br>봉사 종료 시간 : ' + volLogData[length - 1].date + '</p>');
                }else alert("봉사 로그가 없습니다.");

            }
        });

    }); // End document ready

})(jQuery);