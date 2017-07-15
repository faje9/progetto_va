var movements = [];
var movementsLimit = 100000;
var movementsStart = 0;
var movementCounter = 0;
var sleepTime = 500;
var refreshIntervalId;

var firstGroup = {'1591741' : undefined, '825652' : undefined};
var secondGroup = {'2007598' : undefined, '455752' : undefined, '1881823' : undefined, '374745' : undefined, '422300' : undefined, '73216' : undefined, '1109689' : undefined, '1007202' : undefined};

$(document).ready(function() {
  var position = $('#map-image').position();
  relativeX = position.left;
  relativeY = position.top + 800;
  init_map({
    parentSelector : '.container',
  });
  request_movements();
  /*$('#map-image').click(function(e) {
    var title = Math.floor((e.pageX - relativeX) / 8) + ',' + Math.floor((relativeY - e.pageY) / 8);
    $(this).attr('title', title);
  });*/
});

function request_movements() {
  var url = '/user_movements';
  var data = { user : '657863', when : 'fri'};
  $.get(url, data, function(res) {
    if (res.num_rows > 0) {
      movements = movements.concat(res.rows);
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
          //request_movements();
        }
     }, sleepTime);
}

function stopConsumeMovements() {
  clearInterval(refreshIntervalId);
}

function consume_movement(movementIndex) {
  var movement = movements[movementIndex];
  $('#timestamp_display').html(movement.timestamp);
  //if (!(movement.client_id in firstGroup) && !(movement.client_id in secondGroup)) {
  //  return;
  //}
  if (movement.client_id in clientMarkers) {
    move_marker_to(clientMarkers[movement.client_id], movement.x, movement.y);
  } else {
    var marker = add_marker_at(movement.x, movement.y, 0);
    clientMarkers[movement.client_id] = marker;
  }
}
