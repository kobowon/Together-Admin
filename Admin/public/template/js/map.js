(function($) {

    "use strict";

    $(document).ready(function() {
        var volID = location.href.substr(
            location.href.lastIndexOf('=') + 1
        );

        var ajou = {lat: 37.2821251, lng: 127.04635589999998};
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 18,
            center: ajou
        });
        var url="/admin/helpee/location/";
        $.ajax({
            type: "GET",
            url: url+volID,
            dataType: "json",
            error: function (request, status, error) {
                alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (helpeeLocationLog) {
                var length = Object.keys(helpeeLocationLog).length;
                if(length>0) {

                    var center = new google.maps.LatLng(helpeeLocationLog[0].lat,helpeeLocationLog[0].lng);
                    map.panTo(center);

                    $('#vol_info').append(
                        '<p>봉사 시작 시간 : ' + helpeeLocationLog[0].date + '<br>' +
                        '봉사 종료 시간 : ' + helpeeLocationLog[length - 1].date + '<br>' +
                        'Helper : <font color="#0000FF">파란선</font><br>' +
                        'Helpee : <font color="#FF0000">빨간선</font></p>');

                    var helpeeMovingPath = new google.maps.Polyline({
                        path: helpeeLocationLog,
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.5,
                        strokeWeight: 2
                    });
                    var helpeeStartmarker = new google.maps.Marker({
                        position: helpeeLocationLog[0],
                        map: map,
                        title: 'Helpee Start'
                    });
                    var helpeeFinishmarker = new google.maps.Marker({
                        position: helpeeLocationLog[length-1],
                        map: map,
                        title: 'Helpee Finish'
                    });
                    helpeeMovingPath.setMap(map);
                    helpeeStartmarker.setMap(map);
                    helpeeFinishmarker.setMap(map);
                }
            }
        });

        var url="/admin/helper/location/";
        $.ajax({
            type: "GET",
            url: url+volID,
            dataType: "json",
            error: function (request, status, error) {
                alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (helperLocationLog) {

                var length = Object.keys(helperLocationLog).length;
                if(length>0) {
                    var helperMovingPath = new google.maps.Polyline({
                        path: helperLocationLog,
                        geodesic: true,
                        strokeColor: '#0000FF',
                        strokeOpacity: 0.5,
                        strokeWeight: 2
                    });
                    var helperStartmarker = new google.maps.Marker({
                        position: helperLocationLog[0],
                        map: map,
                        title: 'Helper Start'
                    });
                    var helperFinishmarker = new google.maps.Marker({
                        position: helperLocationLog[length-1],
                        map: map,
                        title: 'Helper Finish'
                    });
                    helperMovingPath.setMap(map);
                    helperStartmarker.setMap(map);
                    helperFinishmarker.setMap(map);
                }
            }
        });
    }); // End document ready

})(jQuery);

function drawPathToMap(LocationLog) {
    //var helperLength = Object.keys(helperLocationLog).length;
    var helpeeLength = Object.keys(helpeeLocationLog).length;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: helperLocationLog[0]
    });
    var helperStartmarker = new google.maps.Marker({
        position: helperLocationLog[0],
        map: map,
        title: 'Helper Start'
    });
    var helperFinishmarker = new google.maps.Marker({
        position: helperLocationLog[helperLength-1],
        map: map,
        title: 'Helper Finish'
    });
    var helpeeStartmarker = new google.maps.Marker({
        position: helpeeLocationLog[0],
        map: map,
        title: 'Helpee Start'
    });
    var helpeeFinishmarker = new google.maps.Marker({
        position: helpeeLocationLog[helpeeLength-1],
        map: map,
        title: 'Helpee Finish'
    });
    var helperMovingPath = new google.maps.Polyline({
        path: helperLocationLog,
        geodesic: true,
        strokeColor: '#0000FF',
        strokeOpacity: 0.5,
        strokeWeight: 2
    });
    var helpeeMovingPath = new google.maps.Polyline({
        path: helpeeLocationLog,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 2
    });
    helperStartmarker.setMap(map);
    helperFinishmarker.setMap(map);
    helpeeStartmarker.setMap(map);
    helpeeFinishmarker.setMap(map);
    helperMovingPath.setMap(map);
    helpeeMovingPath.setMap(map);
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
