# 6.813-water-polo-stats
## 6813-project

Implementation of a semester-long project focused on user interface design.  The project went through a series of iterative steps focused on user-centered design:

1. Analysis
	* Problem definition and scope
	* Classify user groups
	* User interviews
2. Design
	* Several paper sketches
3. Paper Prototype
	* Large, interactive paper prototype
	* User testing
4. Computer Prototype
	* High fidelity in look and feel
	* Low fidelity in breadth and depth
5. Implementation
	* Final frontend contained here
6. User Testing
	* Controlled environment and procedure for target users


TODO GR5
===
Simpler:
+ ~~(Mary) Close menu by clicking outside of it (not just X)~~
+ ~~(Mary) label goalie, separate visually from other active players~~
+ ~~(Mary) organize stat buttons with more white space~~
+ ~~(Maddie) Format time in log as mm:ss~~
+ (Maddie) log should resort by time if time is edited
+ ~~(Maddie) have separate column for number & name in log (improve alignment)~~
+ ~~(Maddie) visible scroll bar on log?~~
+ ~~(Maddie) Log header should not scroll with entries~~
+ ~~(Mary) cursor change on hover over buttons~~
+ ~~(Mary) make all cancel buttons red circle w/ white X~~
+ ~~(Mary) stat buttons color change (needs to be more visible)~~
+ ~~(Mary) View Bench button change color when bench open and on hover~~
+ ~~(Mary) more distinction between hover & selected buttons~~ different enough?

Longer:
+ ~~(Michael) Mark Location should be bigger & gray out screen~~
+ ~~(Michael) have cancel button for Mark Location (bottom center of pool)~~
+ (Michael) mark location on mouseup instead of click
+ ~~(Parker) Undo button for deleting log entry~~
+ ~~(Maddie) Edit log entries (make text box editable)~~
+ ~~(Maddie) log player exchanges~~
+ ~~(Parker) Assist dialog box when mark shot/goal~~

Not Doing:
+ switch active player with goalie [could be confusing visually as is]
+ Add game clock display
+ Add play-pause button next to clock (default is paused)
+ Animation for switching players from bench to active
+ (if time) drag & drop to switch players
+ (if time) slide to delete like alarms on iPhone

For GR5 Presentation:
===
+ like the pool as is, don't need extra space for anything else
+ sorting the log by player/action is for viewing stats, not logging them
+ clear all log button is a safety issue
+ red/green color combo bad for color blind users, but we have the players in separate rows so it's OK
+ log switching sides suggested, but that only happens at half, and we included that button for visual feedback more than anything

