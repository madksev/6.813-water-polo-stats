/**
 * Game represents an in-progress water polo game that statistics are being
 * collected for.
 *
 * The team is represented by a dictionary of players that map to their
 * state (either 'ACTIVE', 'GOALKEEPER', or 'BENCH').
 *
 * Statistics are represented as an array of Statistic objects.
 */

var Game = function()
{
  // A unique ID for each player.
  var playerCounter = 0;

  // A unique ID for each statistic.
  var statisticCounter = 0;

  // The players: a dictionary mapping players to their state (ACTIVE,
  // GOALKEEPER, BENCH).
  this.players = {};

  // The statistic events collected for this game.
  this.statistics = [];

  /*
   * Returns all players with some given state.
   */
  this.getPlayersWithState = function(state)
  {
    var playersWithState = [];
    for (player in this.players) {
      if (players[player] == state) {
        playersWithState.push(player);
      }
    }
    return playersWithState;
  }

  /*
   * Switches the states of two players (useful for making substitutions).
   * Both players must exist in the players list.
   */
  this.switchPlayerStatus = function(player1, player2)
  {
    var oldPlayer1Status = players[player1];
    players[player1] = players[player2];
    players[player2] = oldPlayer1Status;
  }

  /*
   * Add a player to the game. By default, this player is added in BENCH
   * state.
   */
  this.addPlayer = function(firstName, lastName, capNumber)
  {
    var newPlayer = new Player(playerCount, firstName, lastName, capNumber);
    this.players[newPlayer] = 'BENCH';
    playerCount++;
  }

  /*
   * Set the state of a player. The player must be in the players list and
   * the state must be one of 'ACTIVE', 'GOALKEEPER' or 'BENCH'.
   */
  this.setPlayerState = function(player, state)
  {
    this.players[player] = state;
  }

  /*
   * Returms true if the current team lineup is valid (i.e. there are 6 active
   * players, 1 goalkeeper, and all other players are bench players).
   */
  this.checkValidTeam = function()
  {
    var activeCount = this.getPlayersWithState('ACTIVE').length;
    var goalkeeperCount = this.getPlayersWithState('GOALKEEPER').length;
    var benchCount = this.getPlayersWithState('BENCH').length;
    var totalCount = activeCount + goalkeeperCount + benchCount;
    return (
      activeCount == 6
        && goalkeeperCount == 1
        && totalCount == this.players.length
    );
  }

  /*
   * Adds a statistic.
   */
  this.addStatistic = function(player, statisticType)
  {
    var newStatistic = new Statistic(
      statisticCounter,
      statisticType,
      player,
      null,
      null
    );
    this.statistics.push(newStatistic);
    statisticCounter++;
  }

  /**
   * Get a string representation for the game.
   */
  this.toString = function()
  {
    var result = "";
    result += "Active players:" + "<br/>";
    for (var player in this.getPlayersWithState('ACTIVE')) {
      result += player.toString() + "<br/>";
    }
    result += "Goalkeeper:" + "<br/>";
    for (var player in this.getPlayersWithState('GOALKEEPER')) {
      result += player.toString() + "<br/>";
    }
    result += "Bench players:" + "<br/>";
    for (var player in this.getPlayersWithState('BENCH')) {
      result += player.toString() + "<br/>";
    }
    result += "Statistics recorded:" + "<br/>";
    for (var i = 0; i < this.statistics.length; i++) {
      result += this.statistics[i].toString() + "<br/>";
    }
    return result.toString();
  }
}
