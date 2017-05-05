var GOALIE_LEFT = true;
var BENCH_OPEN = false;
var MARKING_LOCATION = false;
var STATISTIC_TYPES = ['goal', 'shot', 'assist', 'block', 'steal', 'turnover', 'ejection-drawn', 'ejection-received'];
var game = new Game();
var newPlayers = [['Lily', 'Chen', 1], ['Beth', 'Gates', 3], ['Abby', 'Wilson', 4], ['Jane', 'Lee', 5], ['Grace','Jones', 7], ['Alex', 'Lange', 10], ['Danielle', 'Flowers', 11], ['Sarah', 'Hunt', 12], ['Marie', 'Knowles', 14], ['Claire', 'Davis', 15], ['Cindy', 'Xiang', 16]];
var ACTIVE_PLAYER_ID = null;
var BENCHED_PLAYER_ID = null;
var START_TIME = new Date().getTime() / 1000;
var EDITING = false;
var ASSIST_FOR_PLAYER = null;
for (i=0; i<newPlayers.length; i++) {
  game.addPlayer(newPlayers[i][0], newPlayers[i][1], newPlayers[i][2]);
}

//make 6 players active and 1 player goalie
for (i=0; i<7; i++) {
  var inactivePlayers = game.getPlayersWithState('BENCH');
  if (i==0) {
    game.setPlayerState(inactivePlayers[0], 'BENCH', 'GOALKEEPER');
  } else {
    game.setPlayerState(inactivePlayers[0], 'BENCH', 'ACTIVE');
  }
}

if (!game.checkTeamIsValid) {
  alert('Error setting up game');
}

// helper function that displays active players
var displayActivePlayers = function() {
  $('#playersContainer').empty();
  var goalie = game.getPlayersWithState('GOALKEEPER')[0];
  $('#playersContainer').append('<button type="button" class="btn btn-outline-success player-btn"' +
    'id="player-' + goalie.capNumber + '-' + goalie.lastName + '"><span>'+
    goalie.capNumber+'</span><br><span class="player-name">'+
    goalie.lastName+'</span></button>');
  $('#playersContainer').append('<div id="verticalLine" width="2">');

  var activePlayers = game.getPlayersWithState('ACTIVE');
  for (i=0; i<activePlayers.length; i++) {
    $('#playersContainer').append('<button type="button" class="btn btn-outline-success player-btn"' +
      'id="player-' + activePlayers[i].capNumber + '-' + activePlayers[i].lastName + '"><span>'+
      activePlayers[i].capNumber+'</span><br><span class="player-name">'+
      activePlayers[i].lastName+'</span></button>');
  }
}

// helper function that displays benched players
var displayBenchedPlayers = function() {
  $('#dockContainer').empty();
  var inactivePlayers = game.getPlayersWithState('BENCH');
  for (i=0; i<inactivePlayers.length; i++) {
    $('#dockContainer').append('<button type="button" class="btn btn-outline-danger benched-player-btn"' +
      'id="player-' + inactivePlayers[i].capNumber + '-' + inactivePlayers[i].lastName + '"><span>'+
      inactivePlayers[i].capNumber+'</span><br><span class="player-name">'+
      inactivePlayers[i].lastName+'</span></button>');
  }
}

// helper function that switches the given active and benched players
var switchPlayers = function(activePlayer, activePlayerState, benchedPlayer) {
  game.switchPlayerStatus(activePlayer, activePlayerState, benchedPlayer, 'BENCH');
  displayActivePlayers();
  displayBenchedPlayers();
  ACTIVE_PLAYER_ID = null;
  BENCHED_PLAYER_ID = null;
  addSwitchToLog(activePlayer, benchedPlayer, calculateTime());
}

// helper function that sets up the view to mark a statistic's location
var markLocationReady = function() {
  console.log("showing location dialog");

  // disable the rest of the interface
  $('#players').children('*').css('opacity', 0.2);
  $('#log').children('*').css('opacity', 0.2);

  $('.btn').prop('disabled', true);

  $('#skipMarkLocationBtn').prop('disabled', false);
  $('#markLocationContainer').css('opacity', 1);


  $('#markLocationMessage').show();
  $('#skipMarkLocationBtn').show();

  $('#switchSidesBtn').hide();
}

var changeDockCloseButton = function(isX) {
  //switches dock close button between "X" to "None"
  var closeButton = document.getElementById("closeDockBtn")
  if (isX) {
    closeButton.className = "btn btn-secondary btn-sm btn-danger x-btn";
    closeButton.innerHTML = "&#10006";
  } else { //change to say "None"
    closeButton.className = "btn btn-secondary btn-sm btn-danger none-btn";
    closeButton.innerHTML = "None";
  }
}

// helper function that reverts the view after location marked/skipped
var markLocationFinished = function() {

  $('#markLocationMessage').hide();
  $('#skipMarkLocationBtn').hide();
  $('#switchSidesBtn').show();
  
  // enable the rest of the interface
  $('#players').children('*').css('opacity', 1);
  $('#log').children('*').css('opacity', 1);
  $('.btn').prop('disabled', false);
  
  //pulls up assist dialog if stat was goal
  if (ASSIST_FOR_PLAYER) {
    $('#dock').show();
    $('#dockLabel').text('Assist?');
    $('#dockContainer').empty();
    changeDockCloseButton(false);
    var activePlayers = game.getPlayersWithState('ACTIVE');
    for (i=0; i<activePlayers.length; i++) {
      if (activePlayers[i] != ASSIST_FOR_PLAYER) {
        $('#dockContainer').append('<button type="button" class="btn btn-outline-success player-btn player-assist-btn"' +
        'id="player-' + activePlayers[i].capNumber + '-' + activePlayers[i].lastName + '"><span>'+
        activePlayers[i].capNumber+'</span><br><span class="player-name">'+
        activePlayers[i].lastName+'</span></button>');
      }
    }
    ASSIST_FOR_PLAYER = false;
  }
  
}

$(document).ready(function() {
  displayActivePlayers();
});

$(document).on('click', function(evt) {
  if ( $('#dock').is(':visible') ) {
    var id = evt.target.id;
    var className = evt.target.className;
    var offsetParent = evt.target.offsetParent
    if (offsetParent) {
      var parentId = offsetParent.id;
      if ( !( parentId=="dockContainer" || parentId=="playersContainer" || id=='dock' || id=='dockContainer' || id=="dockLabel")) {
        $('#closeDockBtn').trigger('click');
      }
    } else {
      if ( !( id=="viewBenchBtn" )) {
        $('#closeDockBtn').trigger('click');
      }
    }
  }
});

$(document).on('click', '#switchSidesBtn', function(evt) {
  if (EDITING) {
    if (!freezeEdits()) {
      return;
    }
    EDITING = false;
  }
  if (GOALIE_LEFT) {
    $('#leftGoalieContainer').empty();
    $('#rightGoalieContainer').append('Your Goalie');
    GOALIE_LEFT = false;
  } else {
    $('#rightGoalieContainer').empty();
    $('#leftGoalieContainer').append('Your Goalie');
    GOALIE_LEFT = true;
  }
});

$(document).on('click', '#viewBenchBtn', function(evt) {
  if (EDITING) {
    if (!freezeEdits()) {
      return;
    }
    EDITING = false;
  }
  markLocationFinished();
  changeDockCloseButton(true);
  $('#dock').show();
  $('#viewBenchBtn').hide();
  BENCH_OPEN = true;
  if ( ACTIVE_PLAYER_ID ) {
    $('#' + ACTIVE_PLAYER_ID).removeClass('btn-success');
    $('#' + ACTIVE_PLAYER_ID).addClass('btn-outline-success');
  }
  ACTIVE_PLAYER_ID = null;
  $('#dockLabel').text('Bench');
  displayBenchedPlayers();
});

$(document).on('click', '.player-btn', function(evt) {
  if (EDITING) {
    if (!freezeEdits()) {
      return;
    }
    EDITING = false;
  }
  markLocationFinished();
  var playerId = evt.currentTarget.id;
  if ( ACTIVE_PLAYER_ID && ACTIVE_PLAYER_ID != playerId ) {
    $('#' + ACTIVE_PLAYER_ID).removeClass('btn-success');
    $('#' + ACTIVE_PLAYER_ID).addClass('btn-outline-success');
  }
  ACTIVE_PLAYER_ID = playerId;
  $('#' + playerId).removeClass('btn-outline-success');
  $('#' + playerId).addClass('btn-success');
  var playerNumber = playerId.split('-')[1];
  var playerName = playerId.split('-')[2];
  if ( BENCH_OPEN ) {
    if ( BENCHED_PLAYER_ID ) {
      var benchedPlayer = game.getPlayerWithCap(BENCHED_PLAYER_ID.split('-')[1], 'BENCH');
      var activePlayer = game.getPlayerWithCap(playerNumber, 'ACTIVE');
      if ( !activePlayer ) {
        activePlayer = game.getPlayerWithCap(playerNumber, 'GOALKEEPER');
        switchPlayers(activePlayer, 'GOALKEEPER', benchedPlayer);
      } else {
        switchPlayers(activePlayer, 'ACTIVE', benchedPlayer);
      }
    } // else do nothing b/c no benched player selected
  } else {
    changeDockCloseButton(true);
    $('#dock').show();
    $('#dockLabel').text('');
    $('#dockContainer').empty();
    var stat;
    var statContainer;
    for (i=0; i<STATISTIC_TYPES.length; i++) {
      var statButton = document.createElement("button");
      stat = STATISTIC_TYPES[i];
      statButton.innerHTML = '<span>' + STATISTIC_TYPES[i] + '</span></button>';
      statButton.className = 'btn btn-outline-primary statistic-btn';
      statButton.id = 'stat-' + STATISTIC_TYPES[i];

      if ( i/2 == Math.floor(i/2) ) {
        statContainer = '<div class= "statContainer" id="statContainer-' + Math.floor(i/2) + '"></div>';
        $( '#dockContainer' ).append(statContainer);
      }
      $( '#statContainer-' + Math.floor(i/2) ).append(statButton);
    }
  }
});

$(document).on('click', '.benched-player-btn', function(evt) {
  if (EDITING) {
    if (!freezeEdits()) {
      return;
    }
    EDITING = false;
  }
  var playerId = evt.currentTarget.id;
  if ( BENCHED_PLAYER_ID && BENCHED_PLAYER_ID != playerId ) {
    $('#' + BENCHED_PLAYER_ID).removeClass('btn-danger');
    $('#' + BENCHED_PLAYER_ID).addClass('btn-outline-danger');
  }
  BENCHED_PLAYER_ID = playerId;
  $('#' + playerId).removeClass('btn-outline-danger');
  $('#' + playerId).addClass('btn-danger');
  var playerNumber = playerId.split('-')[1];
  var playerName = playerId.split('-')[2];

  if ( ACTIVE_PLAYER_ID ) {
    var benchedPlayer = game.getPlayerWithCap(playerNumber, 'BENCH');
    var activePlayer = game.getPlayerWithCap(ACTIVE_PLAYER_ID.split('-')[1], 'ACTIVE');
    if ( !activePlayer ) {
      activePlayer = game.getPlayerWithCap(ACTIVE_PLAYER_ID.split('-')[1], 'GOALKEEPER');
      switchPlayers(activePlayer, 'GOALKEEPER', benchedPlayer);
    } else {
      switchPlayers(activePlayer, 'ACTIVE', benchedPlayer);
    }
  }

});

$(document).on('click', '.statistic-btn', function(evt) {
  if (EDITING) {
    if (!freezeEdits()) {
      return;
    }
    EDITING = false;
  }
  var statistic = evt.currentTarget.id.substring(5);
  var activePlayer = game.getPlayerWithCap(ACTIVE_PLAYER_ID.split('-')[1], 'ACTIVE');
  if ( !activePlayer ) {
    activePlayer = game.getPlayerWithCap(ACTIVE_PLAYER_ID.split('-')[1], 'GOALKEEPER');
  }
  game.addStatistic(activePlayer, statistic);
  $('#closeDockBtn').trigger('click');

  //add to log (arbitrary time -- for now)
  var timeString = calculateTime();
  addToLog(activePlayer, statistic, timeString);

  MARKING_LOCATION = true;
  markLocationReady();
  
  //pull up assist dialogue?
  if (statistic == "goal") {
    ASSIST_FOR_PLAYER = activePlayer;
  }
});

$(document).on('click', '.player-assist-btn', function(evt) {
  var playerId = evt.currentTarget.id;
  var playerNumber = playerId.split('-')[1];
  var playerName = playerId.split('-')[2];
  var player = new Player(playerId, playerName, "", playerNumber);
  var timeString = calculateTime();
  addToLog(player, "assist", timeString);
});

$(document).on('click', '#closeDockBtn', function(evt) {
  if (EDITING) {
    if (!freezeEdits()) {
      return;
    }
    EDITING = false;
  }
  $('#dock').hide();
  $('#dockContainer').empty();
  if ( ACTIVE_PLAYER_ID ) {
    $('#' + ACTIVE_PLAYER_ID).removeClass('btn-success');
    $('#' + ACTIVE_PLAYER_ID).addClass('btn-outline-success');
  }
  ACTIVE_PLAYER_ID = null;
  BENCHED_PLAYER_ID = null;
  BENCH_OPEN = false;
  $('#viewBenchBtn').show();
});

$(document).on('click', '#skipMarkLocationBtn', function(evt) {
  MARKING_LOCATION = false;
  markLocationFinished();
});

$(document).on('click', '#poolCanvas', function(evt) {
  if (MARKING_LOCATION) {
    evt.preventDefault();
    evt.stopPropagation();
    var ctx = document.getElementById("poolCanvas").getContext("2d");
    var canvas = $('#poolCanvas');
    ctx.lineWidth = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var canvasOffset = canvas.offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var scrollX = $(document).scrollLeft();
    var scrollY = $(document).scrollTop();
    var xCoord = (evt.clientX - offsetX + scrollX)/2;
    var yCoord = (evt.clientY - offsetY + scrollY)/2;

    console.log(evt);

    console.log('begin drawing');
    ctx.beginPath();
    ctx.arc(xCoord, yCoord, 10, 0, 2*Math.PI);
    ctx.closePath();
    ctx.stroke();
    console.log('finished drawing');

    MARKING_LOCATION = false;
    markLocationFinished();

    setTimeout(function() {
      ctx.clearRect(0, 0, 100000, 100000);
    }, 250)
  }
});

$(document).on('click', '.logEntry-editBtn', function(evt) {
  if (EDITING) {
    if (!freezeEdits()) {
      return;
    }
  }
  EDITING = true;
  editEntry($(evt.target).parent());
});

$(document).on('click', '.logEntry-doneBtn', function(evt) {
  if (!freezeEdits()) {
      return;
    }
  EDITING = false;
});

var freezeEdits = function() {
  var player = $('.player-selector option:selected').text();
  var playerNum = player.substr(0,player.indexOf(' '));
  var playerName = player.substr(player.indexOf(' ')+1);
  var action = $('.action-selector option:selected').text();
  var time = $('.time-input').val();
  var entry = $('.logEntry-doneBtn').parent();

  var timeArr = time.split(":");
  var minutes = parseInt(timeArr[0]);
  var seconds = parseInt(timeArr[1]);
  if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || minutes > 7 || seconds < 0 || seconds > 59) {
    $('.time-input').focus();
    $('.time-input:focus').css('border-color', 'red');
    return false;
  }

  var doneBtn = $(entry).find('.logEntry-doneBtn');
  $(doneBtn).addClass('logEntry-editBtn');
  $(doneBtn).removeClass('logEntry-doneBtn');
  $(doneBtn).text('Edit');

  $(entry).find('.time-input').remove();
  if (seconds < 10) {
    time = minutes+":0"+seconds;
  }
  $(entry).prepend('<div class="logEntry-time">'+time+'</div>');

  $(entry).find('.action-selector').remove();
  $(entry).prepend('<div class="logEntry-action">'+action+'</div>');

  $(entry).find('.player-selector').remove();
  $(entry).prepend('<div class="logEntry-player">'+playerName+'</div');
  $(entry).prepend('<div class="logEntry-capNumber">'+playerNum+'</div>');
  return true;

}

var calculateTime = function() {
  var secondsSinceStart = (new Date().getTime() / 1000) - START_TIME;
  var minutes = Math.floor(secondsSinceStart / 60);
  var seconds = Math.floor(secondsSinceStart - 60*minutes);
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  var timeString = minutes + ":" + seconds;
  return timeString;
}
