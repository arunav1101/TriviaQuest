$(function () {

    var database = firebase.database();
    let u;
    $('#btnSubmit').on('click', function (event) {
        event.preventDefault();
        u = $('.imgProfile').attr('src');
        var name = $('#userDisplayName').text().split(' ')[0];
        // console.log(name);
        // console.log(u);
        var m = $('#msginput').val();
        var t = Date();
        database.ref('/chat/').push({ name, text: m, time: t, img: u });
        $('#msginput').val('');
    });

    database.ref('/chat/').on('child_added', function (snapshot) {
        var msg = snapshot.val();
        var time = msg.time;
        var newTime = dateFns.format(new Date(time), 'HH:mm');
        displayMsg(msg.img, msg.text, newTime, msg.name);
    });

    function displayMsg(img, text, newTime, name ) {
        $('<div />').text(text).prepend($('<em/>').html(`<img src='${img}' class="rounded-circle chatPic mt-2"/> ${name} :   ${newTime} : `)).appendTo('#msgList');
        $('#msgList')[0].scrollTop = $('#msgList')[0].scrollHeight;
    };


});