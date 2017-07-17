var relativeX;
var relativeY;
var clientMarkers = {};
var parentSelector;
var pointHighlighter;
var pointHighlighterContainer;
$(document).ready(function() {
  var position = $('#map-image').position();
  relativeX = position.left;
  relativeY = position.top + 800;
});

function init_map(values) {
  parentSelector = values.parentSelector;
  pointHighlighter = $('<img />');
  pointHighlighter.attr('src', 'images/map-point-highlight.png');
  pointHighlighter.addClass('map-point-circle');
  pointHighlighter.appendTo(parentSelector);
  pointHighlighterContainer = values.pointHighlighterContainer;
  $(pointHighlighterContainer).on('click', '.map-point-highlight', function() {
    var text = $(this).text();
    var splitted = text.split(',');
    var x = parseInt(splitted[0]);
    var y = parseInt(splitted[1]);
    show_point_highlighter_at(x,y);
  });
}

function add_marker_at(x, y, group) {
  var img = $('<img />');
  var source = '';
  switch (group) {
    case 0:
      source = 'images/icon-point.png';
      break;
    case 1:
      source = 'images/icon-point-blue.png';
      break;
    case 2:
      source = 'images/icon-point-green.png';
      break;
  }
  img.attr('src', source);
  img.css('position', 'absolute');
  var left = relativeX + (x * 8) - 11;
  var top = relativeY - (y * 8) - 26;
  img.css('left', left+'px');

  img.css('top', top+'px');

  img.appendTo(parentSelector);
  img.mouseover(function(e) {
    var title = Math.floor((e.pageX - relativeX) / 8) + ',' + Math.floor((relativeY - e.pageY) / 8);
    $(this).attr('title', title);
  });

  return img;
}

function move_marker_to(marker, x, y) {
  $(marker).animate({
    left : (relativeX + (x * 8) - 11),
    top : (relativeY - (y * 8) - 26)
  }, 10);
}

function show_point_highlighter_at(x, y) {
  var left = relativeX + (x * 8) - 24;
  var top = relativeY - (y * 8) - 24;
  pointHighlighter.css('left', left+'px');
  pointHighlighter.css('top', top+'px');
  pointHighlighter.css('display', 'block');
  window.setTimeout(function() {
    pointHighlighter.css('display', 'none');
  }, 5000);
}

function is_exit(x, y) {
  if ((x == 63 && y == 99) || (x == 0 && y == 67) || (x == 99 && y == 77)) {
    return true;
  }
  return false;
}
