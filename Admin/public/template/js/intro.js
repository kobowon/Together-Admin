(function($) {

    "use strict";

    $(document).ready(function() {
        var url="/api/intro";
        $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            error: function (request, status, error) {
                alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
            },
            success: function (data) {
                var i = 0, length = Object.keys(data).length;
                for (i; i <= length - 1; i++) {
                    $('#one-line-feedback').append(
                        '<div class="container">' +
                            '<div class="row justify-content-lg-center">' +
                                '<div class="col-lg-8">' +
                                    '<div class="testimonial text-center">' +
                                        '<div class="testimonial-image" id="img'+i+'">' +
                                            '<img src="template/images/testimonial-1.jpg" alt="김할머니" title="김할머니" class="rounded-circle">' +
                                        '</div>' +
                                        //'<h3>도와줘서 고마워요</h3>' +
                                        '<div class="separator"></div>' +
                                        '<div class="testimonial-body'+i+'">' +
                                            '<blockquote id="feedback'+i+'">' +
                                                //'<p>학생들 짐들어 줘서 너무 고마워요</p>' +
                                            '</blockquote>' +
                                                '<div id="vol_info'+i+'">' +
                                                '</div>' +
                                            //'<div class="testimonial-info-1">- 김 할머니</div>' +
                                            //'<div class="testimonial-info-2">2018-01-01</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>'+
                        '</div>');
                    //$('#img'+i).append('<img src="" alt="김할머니" title="김할머니" class="rounded-circle">');
                    //var imgUrl="http://210.89.191.125/photo/"+userData[i].profileImage;
                    $('#feedback'+i).append("<p>"+data[i].helpeeFeedbackContent+"</p>");
                    $('#vol_info'+i).append('<div class="testimonial-info-1">'+data[i].date+'</div>');
                }
            }
        });



    }); // End document ready

})(jQuery);