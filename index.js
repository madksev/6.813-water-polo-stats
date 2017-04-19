var GOALIE_LEFT = true;
var BENCH_OPEN = false;
var STATISTIC_TYPES = ['goal', 'shot', 'assist', 'block', 'steal', 'turnover', 'ejection-received', 'ejection-drawn'];
var game = new Game();
var newPlayers = [['Lily', 'Chen', 1], ['Beth', 'Gates', 3], ['Abby', 'Wilson', 4], ['Jane', 'Lee', 5], ['Grace','Jones', 7], ['Alex', 'Lange', 10], ['Danielle', 'Flowers', 11], ['Sarah', 'Hunt', 12], ['Marie', 'Knowles', 14], ['Claire', 'Davis', 15], ['Cindy', 'Xiang', 16]];
var ACTIVE_PLAYER_ID = null;
var BENCHED_PLAYER_ID = null;
var STATISTIC_ID = null;
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
}

$(document).ready(function() {
  displayActivePlayers();
});

$(document).on('click', '#switchSidesBtn', function(evt) {
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
  if ( !BENCH_OPEN ) {
    $('#dock').show();
    BENCH_OPEN = true;
    if ( ACTIVE_PLAYER_ID ) {
      $('#' + ACTIVE_PLAYER_ID).removeClass('btn-success');
      $('#' + ACTIVE_PLAYER_ID).addClass('btn-outline-success');
    }
    ACTIVE_PLAYER_ID = null;
    $('#dockLabel').text('Bench');
    displayBenchedPlayers();
  } else {
    $('#closeDockBtn').trigger('click');
  }
});

$(document).on('click', '.player-btn', function(evt) {
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
    $('#dock').show();
    $('#dockLabel').text(playerNumber + ' - ' + playerName);
    $('#dockContainer').empty();
    var stat;
    for (i=0; i<STATISTIC_TYPES.length; i++) {
      var statButton = document.createElement("button");
      stat = STATISTIC_TYPES[i];
      statButton.innerHTML = '<span>' + STATISTIC_TYPES[i] + '</span></button>';
      statButton.className = 'btn btn-outline-info statistic-btn';
      statButton.id = 'stat-' + STATISTIC_TYPES[i];
      $(statButton).attr('stat', STATISTIC_TYPES[i]);
      $(statButton).on('click', function(evt) {
        //add to log (arbitrary time -- for now)
        addToLog(playerNumber + " " + playerName, $(this).attr('stat'), "4:30");
      });
//      console.log(statButton);
      $('#dockContainer').append(statButton);
//      $('#dockContainer').append('<button type="button" class="btn btn-outline-info statistic-btn"' +
//        'id="stat-' + STATISTIC_TYPES[i] + '"><span>' +
//        STATISTIC_TYPES[i] + '</span></button>');
    }
  }
});

$(document).on('click', '.benched-player-btn', function(evt) {

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

  var statisticId = evt.currentTarget.id;
  console.log(statisticId);
  if ( STATISTIC_ID && STATISTIC_ID != statisticId ) {
    $('#' + STATISTIC_ID).removeClass('btn-info');
    $('#' + STATISTIC_ID).addClass('btn-outline-info');
  }
  STATISTIC_ID = statisticId;
  $('#' + statisticId).addClass('btn-info');
  $('#' + statisticId).removeClass('btn-outline-info');

});

$(document).on('click', '#closeDockBtn', function(evt) {
  $('#dock').hide();
  $('#dockContainer').empty();
  if ( ACTIVE_PLAYER_ID ) {
    $('#' + ACTIVE_PLAYER_ID).removeClass('btn-success');
    $('#' + ACTIVE_PLAYER_ID).addClass('btn-outline-success');
  }
  ACTIVE_PLAYER_ID = null;
  if ( BENCHED_PLAYER_ID ) {
    $('#' + BENCHED_PLAYER_ID).removeClass('btn-success');
    $('#' + BENCHED_PLAYER_ID).addClass('btn-outline-success');
  }
  BENCHED_PLAYER_ID = null;
  BENCH_OPEN = false;
});
