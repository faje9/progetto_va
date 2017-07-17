var communications = [];
var communicationsCounter = 0;
var refreshIntervalId;
var communicationsReceived = false;
var sleepTime = 10;
var playing = false;
var locationsCommunicationsCounter = {
  'Kiddie Land' : 0,
  'Entry Corridor' : 0,
  'Tundra Land' : 0,
  'Wet Land' : 0,
  'Coaster Alley' : 0
};
var locationsTextSelectors = {
  'Kiddie Land' : 'text.tundra-land',
  'Entry Corridor' : 'text.entry-corridor',
  'Tundra Land' : 'text.kiddie-land',
  'Wet Land' : 'text.wet-land',
  'Coaster Alley' : 'text.coaster-alley'
};

var locationsPanelSelectors = {
  'Kiddie Land' : 'tundra-land-messages',
  'Entry Corridor' : 'entry-corridor-messages',
  'Tundra Land' : 'kiddie-land-messages',
  'Wet Land' : 'wet-land-messages',
  'Coaster Alley' : 'coaster-alley-messages'
};

var fridayStatistics = {
  total : 0,
  inpark : 0,
  external : 0,
  locations : {
    'Kiddie Land' : 0,
    'Entry Corridor' : 0,
    'Tundra Land' : 0,
    'Wet Land' : 0,
    'Coaster Alley' : 0
  }
};
var saturdayStatistics = {
  total : 0,
  inpark : 0,
  external : 0,
  locations : {
    'Kiddie Land' : 0,
    'Entry Corridor' : 0,
    'Tundra Land' : 0,
    'Wet Land' : 0,
    'Coaster Alley' : 0
  }
};
var sundayStatistics = {
  total : 0,
  inpark : 0,
  external : 0,
  locations : {
    'Kiddie Land' : 0,
    'Entry Corridor' : 0,
    'Tundra Land' : 0,
    'Wet Land' : 0,
    'Coaster Alley' : 0
  }
};

$(document).ready(function() {
  $('a#play_pause_button').click(function() {
    play_pause_button_toggle();
  });
});

function request_communications() {
  var url = '/communications';
  var data = {};
  $.get(url, data, function(res) {
    if (res.num_rows > 0) {
      communications = res.rows;
      startConsumeCommunications();
    }
  }, 'json');
}

function startConsumeCommunications() {
  refreshIntervalId = window.setInterval(
    function() {
       if (communicationsCounter < communications.length) {
         consume_communication(communicationsCounter);
         communicationsCounter++;
       } else {
         stopConsumeCommunications();
         play_pause_button_toggle();
       }
    }, sleepTime);
}

function stopConsumeCommunications() {
  clearInterval(refreshIntervalId);
}

function consume_communication(communicationIndex) {
  var communication = communications[communicationIndex];
  var location = communication.location;
  locationsCommunicationsCounter[location] += 1;
  var textToUpdate = locationsTextSelectors[location];
  $(textToUpdate).html(locationsCommunicationsCounter[location]);

  var date = new Date(communication.timestamp);
  var hour = date.getHours();
  var day = date.getDay();
  var band = get_band(hour);
  switch (day) {
    case 5:
      fridayData[band] += 1;
      draw(fridayData, fridayChart, fridayX, fridayY, fridayXAxis, fridayYAxis);
      fridayStatistics.total += 1;
      $('#friday-total-messages').text(fridayStatistics.total);
      switch (communication.to) {
        case 'external':
          fridayStatistics.external += 1;
          $('#friday-external-messages').text(fridayStatistics.external);
          break;
        default:
          fridayStatistics.inpark += 1;
          $('#friday-inpark-messages').text(fridayStatistics.inpark);
          break;
      }
      fridayStatistics.locations[location] += 1;
      $('#friday-' + locationsPanelSelectors[location]).text(fridayStatistics.locations[location]);
      break;
    case 6:
      saturdayData[band] += 1;
      draw(saturdayData, saturdayChart, saturdayX, saturdayY, saturdayXAxis, saturdayYAxis);
      saturdayStatistics.total += 1;
      $('#saturday-total-messages').text(saturdayStatistics.total);
      switch (communication.to) {
        case 'external':
          saturdayStatistics.external += 1;
          $('#saturday-external-messages').text(saturdayStatistics.external);
          break;
        default:
          saturdayStatistics.inpark += 1;
          $('#saturday-inpark-messages').text(saturdayStatistics.inpark);
          break;
      }
      saturdayStatistics.locations[location] += 1;
      $('#saturday-' + locationsPanelSelectors[location]).text(saturdayStatistics.locations[location]);
      break;
    case 0:
      sundayData[band] += 1;
      draw(sundayData, sundayChart, sundayX, sundayY, sundayXAxis, sundayYAxis);
      sundayStatistics.total += 1;
      $('#sunday-total-messages').text(sundayStatistics.total);
      switch (communication.to) {
        case 'external':
          sundayStatistics.external += 1;
          $('#sunday-external-messages').text(sundayStatistics.external);
          break;
        default:
          sundayStatistics.inpark += 1;
          $('#sunday-inpark-messages').text(sundayStatistics.inpark);
          break;
      }
      sundayStatistics.locations[location] += 1;
      $('#sunday-' + locationsPanelSelectors[location]).text(sundayStatistics.locations[location]);
      break;
  }

  $('#timestamp_display').html(communication.timestamp);
}

function play_pause_button_toggle() {
  if (playing) {
    stopConsumeCommunications();
    $('a#play_pause_button').html('Start <span class="glyphicon glyphicon-play"></span>');
    playing = false;
  } else {
    if (communications.length == 0) {
      request_communications();
    } else {
      startConsumeCommunications();
    }
    $('a#play_pause_button').html('Pause <span class="glyphicon glyphicon-pause"></span>');
    playing = true;
  }
}

function get_band(hour) {
  switch (hour) {
    case 8:
    case 9:
      return '8-10';
    case 10:
    case 11:
      return '10-12';
    case 12:
    case 13:
      return '12-14';
    case 14:
    case 15:
      return '14-16';
    case 16:
    case 17:
      return '16-18';
    case 18:
    case 19:
      return '18-20';
    case 20:
    case 21:
      return '20-22';
    case 22:
    case 23:
      return '22-24';
  }
}
