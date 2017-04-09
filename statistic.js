/**
 * This object represents a single statistic (such as a block, assist, or
 * ejection received) during a water polo game. Statistics have a period,
 * time, associated player, and type.
 */

var Statistic = function(id, statisticType, player, period, timeSincePeriod)
{
 ////////////////////////////////////////////////
 // Representation
 //

 // Immutable properties
 Object.defineProperty(this, 'id', {value: id, writable: false});
 Object.defineProperty(this, 'player', {value: player, writable: false});
 Object.defineProperty(
   this, 
   'statisticType', 
   {value: statisticType, writable: false}
 );

 // Mutable properties
 this.period = period;
 this.timeSincePeriod = timeSincePeriod;

 ////////////////////////////////////////////////
 // Public methods
 //
 this.toString = function()
 {
   var stringRep = this.statisticType + ' by ' + this.player + ' at period ' 
     + this.period + ', ' + this.timeSincePeriod;
   return stringRep;
 }
};

Statistic.types = [
  'goal',
  'shot',
  'assist',
  'block',
  'steal',
  'turnover',
  'ejection-received',
  'ejection-drawn'
];
