var database;
var data = {};

$(document).ready(function () {
  // Initialize Firebase
  var config = {
    databaseURL: 'https://greatunihack-6f7cd.firebaseio.com',
    projectId: 'greatunihack-6f7cd',
  };

  firebase.initializeApp(config);
  database = firebase.database();
  var ref = database.ref('/');
  ref.on('value', gotData, errData);

  setInterval(updateSchedule, 60 * 1000); // update every minute
})

function getToday() {
  // always check for GMT+0.
  var timezone = 'Europe/London';

  var now = moment().tz(timezone);
  var time = now.format('HH:mm');
  var date = now.format('MMM D YYYY');

  return {
    time: time,
    date: date
  };
}

function gotData(newData) {
  data = newData.val();
  updateSchedule();
}

function updateSchedule() {
  var events = data.events;
  var eventImage = 'images/guh_honeycomb.png'
  var beeImage = 'images/guh_logo.png'

  var todayDate = getToday();
  var now = todayDate.time;
  var today = new Date(todayDate.date);

  var dates = {
    saturday: new Date('Nov 11 2017'),
    sunday: new Date('Nov 12 2017')
  };

  $('#saturday').html('');
  $('#sunday').html('');
  _.forEach(['saturday', 'sunday'], function (day) {
    var dayEvents = events[day];
    dayEvents = _.sortBy(dayEvents, function (event) {
      return event.time;
    });

    var activeEvents = _.filter(dayEvents, function (event, index) {
      var active = today.toDateString() === dates[day].toDateString();
      active = active && now >= event.time;
      if (index + 1 < dayEvents.length) { // do we have other events after this?
        var nextIndex = index + 1;
        while (dayEvents[nextIndex].time == event.time) { // let's find the first event that doesn't happen at this time!
          nextIndex++;
          if (nextIndex >= dayEvents.length)
            break;
        }
        if (nextIndex < dayEvents.length)
          active = active && now < dayEvents[nextIndex].time;
      }

      event.active = active;
      return event.active;
    });
    var firstActiveTime = activeEvents.length > 0 ? activeEvents[0].time : '00:00';

    _.forEach(dayEvents, function (event, index) {
      var imageSrc = event.active ? beeImage : eventImage

      var image = '<img src="' + imageSrc + '"style="width:30px;	vertical-align: middle; " />'
      if (!event.active) image = '';
      var label = event.label;
      var time = event.time;
      if (event.active) {
        label = '<b class="active">' + label + '</b>'
        time = '<b class="active">' + time + '</b>'
      } else if (event.time < firstActiveTime) {
        label = '<s>' + label + '</s>';
        time = '<s>' + time + '</s>';
      }
      if (!event.active) {
        label = '<span class="inactive">' + label + '</span>'
        time = '<span class="inactive">' + time + '</span>'
      }

      $('#' + day).append('<tr><td>' + image + '</td><td>' + time + '</td><td>' + label + '</td></tr>');
    })
  })
}

function errData(err) {
  console.log(err);
}
