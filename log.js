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
    XLogEntry(entry);
  });
  $(entry).attr("toDelete", false);
  return entry;
}

function XLogEntry(entry) {
  //pressing the "X" button on a log entry, not same as deleting
  var cover = document.createElement("div");
  cover.className = "logEntry-cover";
  var undoDiv = document.createElement("div");
  undoDiv.innerHTML = "UNDO";
  undoDiv.className = "logEntry-undo";
  $(undoDiv).on("click", function(e, info) {
    entry.removeChild(cover);
    $(entry).attr("toDelete", false);
    checkForEntriesToRemove();
  });
  
  var removeDiv = document.createElement("div");
  removeDiv.innerHTML = "REMOVE";
  removeDiv.className = "logEntry-undo";
  $(removeDiv).on("click", function(e, info) {
    deleteLogEntry(entry);
    checkForEntriesToRemove();
  });
  
  cover.appendChild(undoDiv);
  cover.appendChild(removeDiv);
  entry.appendChild(cover);
  $(entry).attr("toDelete", true);
  displayRemoveAll("block");
}

function deleteLogEntry(entry) {
  log = document.getElementById("logTable");
  log.removeChild(entry);
}

function displayRemoveAll(displayType) {
  btn = document.getElementById("log-removeAllBtn");
  console.log(displayType);
  btn.style.display = displayType;
}

function checkForEntriesToRemove() {
  var childrenToDelete = [];
  log = document.getElementById("logTable");
  for (var i = 0; i < log.children.length; i++) {
    if ($(log.children[i]).attr("toDelete") == "true") {
      childrenToDelete.push(log.children[i]);
    }
  }
  console.log(childrenToDelete);
  if (childrenToDelete.length == 0) {
    displayRemoveAll("none");
  } else {
    displayRemoveAll("block");
  }
  return childrenToDelete;
}

function removeAll() {
  log = document.getElementById("logTable");
  var childrenToDelete = checkForEntriesToRemove();
  for (var i = 0; i < childrenToDelete.length; i++) {
    log.removeChild(childrenToDelete[i]);
  }
  displayRemoveAll("none");
}
  
