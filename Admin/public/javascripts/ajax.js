var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
        var resultJSON = JSON.parse(this.responseText);
        //추가

    }
}

function showList(location,id,title,content){
    var total_div = document.createElement('div');
    var img_div = document.createElement('div');
    var user_img = document.createElement('img');
    var content_div = document.createElement('div');
    var body_div = document.createElement('div');
    var userId_h3 = document.createElement('h3');
    var star_p = document.createElement('p');
    var text_p = document.createElement('p');
    var button_div =

}