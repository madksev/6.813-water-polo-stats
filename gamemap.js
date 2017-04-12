// Import file system utilities, hash map, and randomization library.
var fs = require("fs");
var HashMap = require("hashmap");

/**
 * Maintains a mapping from game IDs to corresponding games.
 */
var GameMap = function() {

  // Create private variables.
  var FILENAME = "gamemap.json";
  var games = new HashMap(); // Maps game IDs to games.
  var nextId = 0;

  // Try to read from the file and populate the mapping.
  // An exception is thrown (and ignored) if the file doesn't exist.
  try {
    JSON.parse(fs.readFileSync(FILENAME)).forEach(function(pair) {
      games.set(pair[0], pair[1]);
    });

    // If there are already games, set the next ID to be the max ID + 1.
    var maxId = -1;
    for (var id in games) {
      if (id > maxId) {
        maxId = id;
      }
    }
    nextId = maxId + 1;
  } catch (ex) {}

  /**
   * Add a mapping from a game ID to a game.
   * @param {int} id - The ID of the game.
   * @param {Game} game - The Game object corresponding to the ID. 
   */
  this.add = function(id, game) {
    games.set(id, game);
  }

  /**
   * Saves the mappings to the file.
   * @param {Function} callback - The function to execute after the saving is complete.
   */
  this.save = function(callback) {
    var pairs = games.keys().map(function(key) {
      return [key, links.get(key)];
    });

    fs.writeFile(FILENAME, JSON.stringify(pairs), callback ? callback : function() {});
  }

  /**
   * Get the game corresponding to some ID.
   * @param {int} id - The ID of a game.
   * @returns {Game} The Game object corresponding to the ID or undefined if
   * there is no such game.
   */
  this.get = function(id) {
    return games.has(id) ? links.get(id) : undefined;
  }
};
