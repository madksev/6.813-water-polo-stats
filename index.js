var GOALIE_LEFT = true;
var BENCH_OPEN = false;
var STATISTIC_TYPES = ['goal', 'shot', 'assist', 'block', 'steal', 'turnover', 'ejection-received', 'ejection-drawn'];
var game = new Game();
var newPlayers = [['Lily', 'Chen', 1], ['Beth', 'Gates', 3], ['Abby', 'Wilson', 4], ['Jane', 'Lee', 5], ['Grace','Jones', 7], ['Alex', 'Lange', 10], ['Danielle', 'Flowers', 11], ['Sarah', 'Hunt', 12], ['Marie', 'Knowles', 14], ['Claire', 'Davis', 15], ['Cindy', 'Xiang', 16]];
var ACTIVE_PLAYER = null;
var BENCHED_PLAYER = null;
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


$(document).ready(function() {

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
    if ( ACTIVE_PLAYER ) {
      $('#' + ACTIVE_PLAYER).removeClass('btn-success');
      $('#' + ACTIVE_PLAYER).addClass('btn-outline-success');
    }
    ACTIVE_PLAYER = null;
    $('#dockLabel').text('Bench');
    $('#dockContainer').empty();
    var inactivePlayers = game.getPlayersWithState('BENCH');
    for (i=0; i<inactivePlayers.length; i++) {
      $('#dockContainer').append('<button type="button" class="btn btn-outline-danger benched-player-btn"' +
        'id="player-' + inactivePlayers[i].capNumber + '-' + inactivePlayers[i].lastName + '"><span>'+
        inactivePlayers[i].capNumber+'</span><br><span class="player-name">'+
        inactivePlayers[i].lastName+'</span></button>');
    }
  } else {
    $('#closeDockBtn').trigger('click');
  }
});

$(document).on('click', '.player-btn', function(evt) {
  var playerId = evt.currentTarget.id;
  if ( ACTIVE_PLAYER && ACTIVE_PLAYER != playerId ) {
    $('#' + ACTIVE_PLAYER).removeClass('btn-success');
    $('#' + ACTIVE_PLAYER).addClass('btn-outline-success');
  }
  ACTIVE_PLAYER = playerId;
  $('#' + playerId).removeClass('btn-outline-success');
  $('#' + playerId).addClass('btn-success');
  var playerNumber = playerId.split('-')[1];
  var playerName = playerId.split('-')[2];
  if ( BENCH_OPEN ) {
    if ( BENCHED_PLAYER ) {
      // do something
    } // else do nothing b/c no benched player selected
  } else {
    $('#dock').show();
    $('#dockLabel').text(playerNumber + ' - ' + playerName);
    $('#dockContainer').empty();
    for (i=0; i<STATISTIC_TYPES.length; i++) {
      var statID;
      $('#dockContainer').append('<button type="button" class="btn btn-outline-info statistic-btn"' +
        'id="stat-' + STATISTIC_TYPES[i] + '"><span>' +
        STATISTIC_TYPES[i] + '</span></button>');
    }
  }
});

$(document).on('click', '.benched-player-btn', function(evt) {
  var playerId = evt.currentTarget.id;
  if ( BENCHED_PLAYER && BENCHED_PLAYER != playerId ) {
    $('#' + BENCHED_PLAYER).removeClass('btn-danger');
    $('#' + BENCHED_PLAYER).addClass('btn-outline-danger');
  }
  BENCHED_PLAYER = playerId;
  $('#' + playerId).removeClass('btn-outline-danger');
  $('#' + playerId).addClass('btn-danger');
});

$(document).on('click', '#closeDockBtn', function(evt) {
  $('#dock').hide();
  $('#dockContainer').empty();
  if ( ACTIVE_PLAYER ) {
    $('#' + ACTIVE_PLAYER).removeClass('btn-success');
    $('#' + ACTIVE_PLAYER).addClass('btn-outline-success');
  }
  ACTIVE_PLAYER = null;
  if ( BENCHED_PLAYER ) {
    $('#' + BENCHED_PLAYER).removeClass('btn-success');
    $('#' + BENCHED_PLAYER).addClass('btn-outline-success');
  }
  BENCHED_PLAYER = null;
  BENCH_OPEN = false;
});
