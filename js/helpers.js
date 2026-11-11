/* Tasks:
      [ ] - enforceDataType should allow the expectation of multiple data types
            - isEmptyObject, for example, can take either an Object OR and Array
*/

'use strict';

/** Returns the data type of a given value which is more specific than the typeof operator.
 * 
 * @param {*} value The input value of which the data type should be determined.
 * @returns {string} The specific data type of the given value.
 */
export function getDataType(value) {
   let dataType = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();

   // Determine specific number type
   if ( dataType === 'number' ) {

      if (   Number.isNaN     (value) ) { dataType = 'NaN';      }
      
      else if ( ! Number.isFinite  (value) ) { dataType = 'infinity'; }

      else if (   Number.isInteger (value) ) {

         dataType = Number.isSafeInteger(value)
                  ? 'integer'
                  : 'unsafe integer';

      }

      else { dataType = 'double'; }

      
   }

   return dataType;
}


export function createSpring() {
   const spring = document.createElement('div');
   spring.classList.add('spring');

   return spring;
}


/** Updates the selection class for the given elements.
 *  The current selection is removed and the new selection is added.
 * 
 * @param   {HTMLElement | null} _currentSelection The element that will be de-selected
 * @param   {HTMLElement | null} _newSelection The element that will become the new selection
 * @returns {HTMLElement | null} the value of _newSelection
 */
export function changeSelection(_currentSelection, _newSelection) {

   if ( _currentSelection ) _currentSelection .classList .remove ('selected');
   if ( _newSelection     ) _newSelection     .classList .add    ('selected');

   return _newSelection;
   
}


/** Compare two arrays to determine if the values they contain are equivalent.
 * 
 *  This function compares the CONTENT of the arrays, in order, rather than only
 *  comparing the memory addresses where the arrays are stored.
 * @param   {Array  } _arr1 The first array to compare
 * @param   {Array  } _arr2 The second array to compare
 * @returns {boolean}  true if the arrays are equivalent,
 */
export function arraysAreEquiv(_arr1, _arr2) {
   // if the either array is a falsy value, return
    if (!_arr1 || !_arr2) return false;

    // if the argument is the same array, we can be sure the contents are same as well
    if(_arr1 === _arr2) return true;

    // compare lengths - can save a lot of time 
    if (_arr1.length !== _arr2.length) return false;


    for (var i = 0; i < _arr1.length; i++) {

        // Check if we have nested arrays
        if (_arr1[i] instanceof Array && _arr2[i] instanceof Array) {
            // recurse into the nested arrays
            if (! arraysAreEquiv(_arr1[i], _arr2[i]) ) return false;
        }      

        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        else if (_arr1[i] != _arr2[i]) return false;  
                
    } 
    
    
    return true;
}


/** Determine if an object or array is empty.
 * 
 * @param {Object | Array} _object The container to check
 * @returns true if the container is empty
 */
export function isEmptyObject(_object) {

   for (const key in _object) {
      if (key) return false;
   }

   return true;

}


/** Throw an error if the true data type of the given value is not the expected type.
 * 
 * @param {*} _value The value to check the type of
 * @param {String} _expectedType The expected type of the value
 * @throws TypeError if the value does not match the expected type.
 */
export function enforceDataType(_value, _expectedType) {

   const trueType = getDataType(_value)

   if ( _expectedType !== trueType ) {
      throw new TypeError(`Expected ${_expectedType}, received ${trueType}`);
   }

}