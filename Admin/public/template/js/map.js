(function($) {

    "use strict";

    $(document).ready(function() {
        var volID = location.href.substr(
            location.href.lastIndexOf('=') + 1
        );

        var url="/admin/helpee/location/";
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
                    //reformLogData(volLogData);
                    drawPathToMap(volLogData);
                }else alert("봉사 로그가 없습니다.");
            }
        });

    }); // End document ready

})(jQuery);

function drawPathToMap(locationLog) {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: locationLog[1]
    });

    var movingPath = new google.maps.Polyline({
        path: locationLog,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 2
    });

    movingPath.setMap(map);
    //movingPath.setMap(null); //line 삭제시 사용
}

/*
function reformLogData(logData){
    var length = Object.keys(logData).length;
    var i;
    var locationList = new Array() ;

    for(i=0;i<length;i++){
        var location = new Object() ;
        location.lng=logData[i].helpeeLongitude;
        location.lat=logData[i].helpeeLatitude;
        locationList.push(location)
    }
    return locationList;
}*/
