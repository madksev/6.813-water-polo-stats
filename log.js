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
  //add edit button
  var editBtn = document.createElement("button");
  editBtn.className = "btn btn-secondary btn-sm logEntry-editBtn";
  editBtn.innerHTML = "Edit";
  entry.appendChild(editBtn);
  //add delete button
  var button = document.createElement("button");
  button.className = "btn btn-secondary btn-sm btn-danger logEntry-btn x-btn";
  button.innerHTML = "&#10006"
  entry.appendChild(button);
  $(button).on('click', function(e, info) {
    if (EDITING) {
      freezeEdits();
      EDITING = false;
    }
    XLogEntry(entry, "stat");
  });
  $(entry).attr("toDelete", false);
  return entry;
}

function editEntry(entry) {
  var selectedNum = $(entry).find('.logEntry-capNumber').text();
  var selectedPlayer = $(entry).find('.logEntry-player').text();
  var selectedAction = $(entry).find('.logEntry-action').text();
  var currentTime = $(entry).find('.logEntry-time').text();
  
  var editBtn = $(entry).find('.logEntry-editBtn');
  $(editBtn).addClass('logEntry-doneBtn');
  $(editBtn).removeClass('logEntry-editBtn');
  $(editBtn).text('Done');

  $(entry).find('.logEntry-time').remove();
  $(entry).prepend('<input type="text" class="form-control time-input" value='+currentTime+'>');

  $(entry).find('.logEntry-action').remove();
  $(entry).prepend('<select class=action-selector><option>'+selectedAction+'</option></select>');
  for (i=0; i<STATISTIC_TYPES.length; i++) {
    if (STATISTIC_TYPES[i] !== selectedAction) {
      $('.action-selector').append('<option>'+STATISTIC_TYPES[i]+'</option>');
    }
  }

  $(entry).find('.logEntry-capNumber').remove();
  $(entry).find('.logEntry-player').remove();
  $(entry).prepend('<select class="player-selector"><option>'+selectedNum+' '+selectedPlayer+'</option></select>');
  var goalie = game.getPlayersWithState('GOALKEEPER')[0];
  if (goalie.capNumber !== parseInt(selectedNum)) {
    $('.player-selector').append('<option>'+goalie.capNumber+' '+goalie.firstName+ ' '+goalie.lastName+'</option>');
  }
  var activePlayers = game.getPlayersWithState('ACTIVE');
  for (i=0; i<activePlayers.length; i++) {
    if (activePlayers[i].capNumber !== parseInt(selectedNum)) {
      $('.player-selector').append('<option>'+activePlayers[i].capNumber+' '+activePlayers[i].firstName+ ' '+activePlayers[i].lastName+'</option>');
    }
  }

}

function XLogEntry(entry, entryType) {
  //pressing the "X" button on a log entry, not same as deleting
  var cover = document.createElement("div");
  
  var undoDiv = document.createElement("div");
  undoDiv.innerHTML = "UNDO";
  $(undoDiv).on("click", function(e, info) {
    if (EDITING) {
      freezeEdits();
      EDITING = false;
    }
    entry.removeChild(cover);
    $(entry).attr("toDelete", false);
    checkForEntriesToRemove();
  });
  
  var removeDiv = document.createElement("div");
  removeDiv.innerHTML = "REMOVE";

  if (entryType == "stat") {
    cover.className = "logEntry-cover";
    undoDiv.className = "logEntry-undo";
    removeDiv.className = "logEntry-undo";
  } else {
    cover.className = "logEntry-switchCover";
    undoDiv.className = "logEntry-undoSwitch";
    removeDiv.className = "logEntry-undoSwitch";
  }

  $(removeDiv).on("click", function(e, info) {
    if (EDITING) {
      freezeEdits();
      EDITING = false;
    }
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

function addSwitchToLog(activePlayer, benchedPlayer, time) {
  var entry = document.createElement("div");
  //additional formatting goes here
  entry.className = "logEntry";
  //switch info
  var switchDiv = document.createElement("div");
  switchDiv.className = "logEntry-switch";
  switchDiv.innerHTML = benchedPlayer.capNumber+" "+benchedPlayer.lastName+
  " went in for "+activePlayer.capNumber+" "+activePlayer.lastName;
  entry.appendChild(switchDiv);
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
    if (EDITING) {
      freezeEdits();
      EDITING = false;
    }
    XLogEntry(entry, "switch");
  });
  $(entry).attr("toDelete", false);
  $('#logTable').prepend(entry);
}
  
