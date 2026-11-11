'use strict';

import globals from './globals.js';

import { getDataType } from './helpers.js';

/** Get a value from a JSON object located at the given path.
 * 
 * @param   { Array  } _pathArr 
 * @param   { Object } _jsonObject 
 * @returns { any    } The value found at the given path of the given JSON object
 * @throws  { Error  } If the given path is not an array
 */
// TODO: Handle when given path does not exist.
export function getJsonValue(_pathArr, _jsonObject = null) {

   // Verify the given path is an array.
   const typeof_pathArr = getDataType(_pathArr);
   if ( typeof_pathArr !== 'array' ) { console.error(`Expected array but recieved ${typeof_pathArr}`); }

   let currentJsonObject = _jsonObject ?? globals.jsonRoot;
   
   // Handle Case: pathArr is empty.
   if ( _pathArr.length === 0 ) { return currentJsonObject; }

   else for (const value of _pathArr) {
      currentJsonObject = currentJsonObject[value];
   }

   return currentJsonObject;

}


/** Retrieve all the subkeys from the given JSON data which contain object data.
 *  @param {Object} _jsonObject JSON data to be processed
 *  @returns {Array} 2d array of subkeys that hold object data
*/
export function getBranchingSubkeys(_jsonObject) {

   // TODO: Error handling in cases where there is no json data

   const branchingKeys = [];
   let   hasSubKeys    = false;

   // Iterate across all keys in given JSON data looking for objects
   for ( const key in _jsonObject ) {
      if (_jsonObject[key] && typeof _jsonObject[key] === 'object') {

         // Check if key's object value contains a nested object value
         for (const subKey in _jsonObject[key]) {

            // Only need to find a single occurrence.
            if ( typeof _jsonObject[key][subKey] === 'object') {

               hasSubKeys = true;
               break;

            }
         }

         // Add the key to return array, with a boolean indicating if it has sub-keys.
         branchingKeys.push([key, hasSubKeys]);
      }
   }

   return branchingKeys;

}