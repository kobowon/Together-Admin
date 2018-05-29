var FormAjaxHandler = function () {
}

FormAjaxHandler.send = function ($form , fnSuccess , fnError) {

    console.log($form.serializeObject());

    $.ajax({
        type: $form.attr('method'),
        url: $form.attr('action') ,
        data: JSON.stringify($form.serializeObject()),
        contentType: "application/json; charset=UTF-8",
        success: function () {
            if (fnSuccess) {
                fnSuccess();
            }
        },
        error : function(request , status , error) {
            if (fnError) {
                console.log(request , status , error);
                fnError(request , status , error);
            }
        }

    });
}

FormAjaxHandler.sendResult = function ($form , fnSuccess , fnError) {

    console.log($form.serializeObject());
    $.ajax({
        type: $form.attr('method'),
        url: $form.attr('action') ,
        data: JSON.stringify($form.serializeObject()),
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        success: function (result) {
            if (fnSuccess) {
                fnSuccess(result);
            }
        },
        error : function(request , status , error) {
            if (fnError) {
                fnError(request , status , error);
            }
        }

    });
}


var AjaxHandler = function () {
}

AjaxHandler.get = function (url  , fnSuccess , fnError) {

    $.ajax({
        type: 'get',
        url: url ,
        dataType: "json",
        success: function (result) {
            if (fnSuccess) {
                fnSuccess(result);
            }
        },
        error : function(request , status , error) {
            if (fnError) {
                fnError(request , status , error);
            }
        }

    });
}


AjaxHandler.post = function (url , dataObj , fnSuccess , fnError) {


    $.ajax({
        type: 'post',
        url: url,
        data: JSON.stringify(dataObj),
        dataType: "json",
        contentType: "application/json; charset=UTF-8",
        success: function (result) {
            if (fnSuccess) {
                fnSuccess(result);
            }
        },
        error : function(request , status , error) {
            if (fnError) {
                fnError(request , status , error);
            }
        }

    });


}

jQuery.fn.serializeObject = function () {
    var obj = null;
    try {
        if (this[0].tagName && this[0].tagName.toUpperCase() == "FORM") {
            var arr = this.serializeArray();
            if (arr) {
                obj = {};
                jQuery.each(arr, function () {
                    obj[this.name] = this.value;
                });
            }
        }
    } catch (e) {
        alert(e.message);
    } finally {
    }
    return obj;
};