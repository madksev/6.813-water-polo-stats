function addToLog(player, action, time) {
  /*
  Adds a log entry to the log as a new div
  player: string or player object
  action: string
  time: string
  */
  var log = document.getElementById("logTable");
  var entry = createLogEntry(player, action, time);
  $(log).prepend(entry);
}

function createLogEntry(player, action, time) {
  var entry = document.createElement("div");
  //additional formatting goes here
  entry.className = "logEntry";
  //number 
  var capNumberDiv = document.createElement("div");
  capNumberDiv.innerHTML = player.capNumber;
  capNumberDiv.className = "logEntry-capNumber";
  entry.appendChild(capNumberDiv);
  //player
  var playerDiv = document.createElement("div");
  playerDiv.innerHTML = player.firstName+" "+player.lastName;
  playerDiv.className = "logEntry-player";
  entry.appendChild(playerDiv);
  //action
  var actionDiv = document.createElement("div");
  actionDiv.innerHTML = action;
  actionDiv.className = "logEntry-action";
  entry.appendChild(actionDiv);
  //time
  var timeDiv = document.createElement("div");
  timeDiv.innerHTML = time;
  timeDiv.className = "logEntry-time";
  entry.appendChild(timeDiv);
  //add delete button
  var button = document.createElement("button");
  button.className = "btn btn-secondary btn-sm btn-danger logEntry-btn x-btn";
  button.innerHTML = "&#10006"
  entry.appendChild(button);
  $(button).on('click', function(e, info) {
    deleteLogEntry(entry);
  });
  return entry;
}

function deleteLogEntry(entry) {
  log = document.getElementById("logTable");
  log.removeChild(entry);
}
