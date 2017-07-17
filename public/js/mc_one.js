var movements = [];
var movementsLimit = 100000;
var movementsStart = 0;
var movementCounter = 0;
var isRequesting = false;
var sleepTime = 10;
var refreshIntervalId;
var playing = false;
var groups_accordion_mapping = ['#collapseOne','#collapseTwo','#collapseThree','#collapseFour','#collapseFive','#collapseSix','#collapseSeven','#collapseEight','#collapseNine','#collapseTen','#collapseEleven','#collapseTwelve'];
var latestActivities = [0,0,0,0,0,0,0,0,0,0,0,0];
$(document).ready(function() {
  var position = $('#map-image').position();
  relativeX = position.left;
  relativeY = position.top + 800;

  //request_movements();
  /*$('#map-image').click(function(e) {
    var title = Math.floor((e.pageX - relativeX) / 8) + ',' + Math.floor((relativeY - e.pageY) / 8);
    $(this).attr('title', title);
  });*/
  init_map({
    parentSelector : '#map_container',
    pointHighlighterContainer : '#highliters-container'
  });
  $('a#play_pause_button').click(function() {
    play_pause_button_toggle();
  });
});

function request_movements() {
  var url = '/groups_movements';
  var data = {/* start : movementsStart, limit : movementsLimit*/};
  $.get(url, data, function(res) {
    if (res.num_rows > 0) {
      movements = res.rows;
      movementsStart += res.num_rows;
      startConsumeMovements();
    }
  }, 'json');
}

/*function request_timestamps() {
  var url = '/timestamps';
  $.get(url, data, function(res) {
    timestamps = res.rows;
    timestampCounter = 5000 - 1;
    request_movements(timestamps[timestampCounter]);
  }, 'json');
}*/

function startConsumeMovements() {
   refreshIntervalId = window.setInterval(
     function() {
        if (movementCounter < movements.length) {
          consume_movement(movementCounter);
          movementCounter++;
        } else {
          stopConsumeMovements();
          play_pause_button_toggle();
        }
     }, sleepTime);
}

function stopConsumeMovements() {
  clearInterval(refreshIntervalId);
}

function consume_movement(movementIndex) {
  var movement = movements[movementIndex];
  var time = movement.timestamp.split(' ')[1];
  $('#timestamp_display').html(time);

  var accordionSelector = groups_accordion_mapping[movement.group_number - 1];
  var activity = '';
  if (movement.type == 'check-in') {
    activity = '<div>' + movement.client_id + ' Checked-in at (<a class="map-point-highlight">' + movement.x + ',' + movement.y + '</a>)    (' + movement.timestamp + ')</div>';
    $(accordionSelector+' > div.panel-body').append(activity);
    latestActivities[movement.group_number - 1] = 1;
  } else if (movement.type == 'movement') {
    var isExit = is_exit(movement.x, movement.y);
    if (isExit) {
      activity = '<div>Exit at ' + movement.timestamp + ' from (<a class="map-point-highlight">' + movement.x + ',' + movement.y + '</a>)</div>';
    } else {
      activity = '<div>Walking...    (Start at ' + movement.timestamp + ')</div>';
    }
    if (latestActivities[movement.group_number - 1] == 1 || isExit) {
      $(accordionSelector+' > div.panel-body').append(activity);
    }
    latestActivities[movement.group_number - 1] = 2;
  }

  if (movement.client_id in clientMarkers) {
    move_marker_to(clientMarkers[movement.client_id], movement.x, movement.y);
  } else {
    var marker = add_marker_at(movement.x, movement.y, movement.group);
    clientMarkers[movement.client_id] = marker;
  }
}

function play_pause_button_toggle() {
  if (playing) {
    stopConsumeMovements();
    $('a#play_pause_button').html('Start <span class="glyphicon glyphicon-play"></span>');
    playing = false;
  } else {
    if (movements.length == 0) {
      request_movements();
    } else {
      startConsumeMovements();
    }
    $('a#play_pause_button').html('Pause <span class="glyphicon glyphicon-pause"></span>');
    playing = true;
  }
}
