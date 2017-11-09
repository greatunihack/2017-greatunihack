var database;

$(document).ready(function() {
  // Initialize Firebase
  var config = {
    databaseURL: "https://greatunihack-6f7cd.firebaseio.com",
    projectId: "greatunihack-6f7cd",
  };

  firebase.initializeApp(config);
  var database = firebase.database();
  var ref = database.ref('/');
  ref.on('value', gotData, errData);
})

function gotData(data) {
  data = data.val();
  console.log(data);
  var events = data.events;
  var eventImage = "images/guh_honeycomb.png"
  var beeImage = "images/guh_logo.png"

  
  $("#saturday").html("");
  $("#sunday").html("");
  _.forEach(["saturday", "sunday"], function(day) {
    var dayEvents = events[day];
    dayEvents = _.sortBy(dayEvents, function(event) {
      return event.time;
    });

    var activeEvents = _.filter(dayEvents, function(event) {
      return event.active;
    });
    var firstActiveTime = activeEvents.length > 0 ? activeEvents[0].time : "00:00";

    _.forEach(dayEvents, function(event, index) {
      var imageSrc = event.active ? beeImage : eventImage
  
      var image='<img src="'+imageSrc+'"style="width:30px;	vertical-align: middle; " />'
      if (!event.active) image = "";
      var label = event.label;
      var time = event.time;
      if (event.active) {
        label = "<b class='active'>" + label + "</b>"
        time = "<b class='active'>" + time + "</b>"
      } else if (event.time < firstActiveTime) {
        label = "<s>"+label+"</s>";
        time = "<s>"+time+"</s>";
      }
      if (!event.active) {
        label = "<span class='inactive'>" + label + "</span>"
        time = "<span class='inactive'>" + time + "</span>"
      }

      $("#"+day).append('<tr><td>'+image+'</td><td>'+time+'</td><td>'+label+'</td></tr>');
    })
  })
}

function errData(err) {
  console.log(err);
}
