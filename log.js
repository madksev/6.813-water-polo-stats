$(".log").on( 'mousewheel', function ( e ) {
    var event = e.originalEvent,
        d = event.wheelDelta || -event.detail;

    this.scrollTop += ( d < 0 ? 1 : -1 ) * 30;
    e.preventDefault();
});


function addToLog(action, time) {
  var log = document.getElementById("logTable");
  var entry = createLogEntry(action, time);
  log.appendChild(entry);
}

function createLogEntry(action, time) {
  var entry = document.createElement("div");
  //additional formatting goes here
  entry.className = "logEntry";
  entry.innerHTML = action +" "+ time;
  //add delete button
  var button = document.createElement("button");
  button.className = "btn btn-secondary btn-sm logEntry-btn";
  button.innerHTML = "&#10006"
  entry.appendChild(button);
  $(entry).on('click', function(e, info) {
    deleteLogEntry(entry);
  });
  return entry;
}

function deleteLogEntry(entry) {
  log = document.getElementById("logTable");
  log.removeChild(entry);
}
  