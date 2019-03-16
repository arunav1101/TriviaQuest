$(function() {

    $(".title-letter").hover(function(){
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        var color = "rgb("+r+","+g+","+b+")"
        $(this).css("color", color);
    });

});
// listen for realtime scoreboard:
/*var triviaDatabase = firebase.database();
triviaDatabase.ref().on("value", function(snapshot) {
    // show score board

    triviaDatabase.ref('users/').on('child_added', function (snapshot) {
        var userInfo = snapshot.val();

        snapshot.forEach(function() {
             var displayName = userInfo.displayName;
             var profileImg = userInfo.profile_picture;
             var userPoints = userInfo.userPoints;
             $("#usersScoreBoard").html(`
             <div class="row ml-1">
                 <div class="col-2 text-center mt-3 mb-1"><img src='${profileImg}' class="rounded-circle"/></div>
                 <div class="col-6 text-center mt-3 mb-1">${displayName}</div>
                 <div class="col-4 text-center mt-3 mb-1">${userPoints}</div>
             </div>
             `);
        });
    });
    // end score board
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
*/
var rootRef = firebase.database().ref();
var urlRef = rootRef.child("users");
urlRef.on("value", function(snapshot) {
    $("#usersScoreBoard").html("");
  snapshot.forEach(function(child) {
    var userInfo = child.val();

    var displayName = userInfo.displayName;
    var profileImg = userInfo.profile_picture;
    var userPoints = userInfo.userPoints;
    $("#usersScoreBoard").append(`
    <div class="row ml-1">
        <div class="col-2 text-center mt-3 mb-1"><img src='${profileImg}' class="rounded-circle"/></div>
        <div class="col-6 text-center mt-3 mb-1">${displayName}</div>
        <div class="col-4 text-center mt-3 mb-1">${userPoints}</div>
    </div>
    `);

    $('#userScore').html(`<p>Your Score: ${userPoints}</p>`);
  });
});
  
