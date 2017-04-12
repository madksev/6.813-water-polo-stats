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
  var playerCount = 0;

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
