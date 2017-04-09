/**
 * This object represents a water polo player. Players have a name and cap
 * number.
 */

var Player = function(firstName, lastName, capNumber)
{
 ////////////////////////////////////////////////
 // Representation
 //

 // Immutable properties
 Object.defineProperty(this, 'firstName', {value: firstName, writable: false});
 Object.defineProperty(this, 'lastName', {value: lastName, writable: false});

 // Mutable properties
 this.capNumber = capNumber;

 ////////////////////////////////////////////////
 // Public methods
 //
 this.toString = function()
 {
   var stringRep = this.capNumber + ": " + this.firstName + " " + this.lastName;
   return stringRep;
 }
};
