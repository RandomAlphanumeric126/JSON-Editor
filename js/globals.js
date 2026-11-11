/* Tasks:
   [X] - Convert globals proxy to an IIFE to enforce validation on all properties before returning the proxy.
   [X] - Refactor validateAll function to validateProp, so props can be validated individually.
   [X] - Create a means to template the internal properties restricting variable modification.
      [ ] - Create a method for defining the g_internalProps object from outside this module.
   [X] - Create a way to bypass the proxy and read the raw g_target object for logging/reference.
   [ ] - Consider moving the addProp calls to the index.js module instead of here.
   [ ] - Refactor handler.get() to check for non-exist props. Alert on occurance.
   [?] - Refactor handler.set() to check for non-exist props. Alert on occurance.
   [ ] - Implement use of Reflect.get() and Reflect.set() in getter setter.
   [ ] - Allow an optional validator callback function to be included when initializing a prop with addProp()
         - A function that will run whenever the value is updated to reject invalid assignments

*/

// Define empty global object to be used as a proxy
const g_target = {
   /*       This Object is Intentionally Blank       */
   /*  Let the addProp method do the hard work here  */
};

const g_handler = {
   get(target, prop) {

      if (typeof target[prop] !== 'function') {
         const trueProp = target[prop];
         return trueProp?.value;
      }

      else return target[prop];
   },


   set(target, prop, value) {
      const trueProp = target[prop];

      if ( ! trueProp ) {throw new ReferenceError(`Property ${prop} does not exist in the target`)}
      else if (trueProp?.isMutable) {
         trueProp.value = value;

         return true;
      }
      else {
         throw new TypeError(`Property ${prop} is not a mutable variable`);
      }
   }
}

// Define the internal structure of each prop.
//    Each key/value pair represents the name, and datatype of the internal prop, respectively.
//    This structure is abstracted away by the handler during real-world use.
const g_internalProps = {
   value     : 'any',
   isMutable : 'boolean'
}

// Create the globals proxy object.
// - Includes validation to ensure baked in variables are formatted correctly.
const globals = ( () => {
   for (let key in g_target) validateProp(key);

   return new Proxy(g_target, g_handler);
} )();


//////////////////////////////////////////////////
// BEGIN method definitions
//


   /** Validate that a given property exists within the target.
    * 
    * @param { string } _key The name of the property to validate.
    */
   function validateProp(_key) {
      
      for (let [varName, dataType] of Object.entries(g_internalProps)) {

         const propName = _key;
         const propObj  = g_target[propName];
         
         // Check that the key exists
         if ( ! Object.hasOwn(propObj, varName) ) {
            throw new ReferenceError(`Property '${varName}' does not exist in ${propName}`);
         }

         // Check that the variable is of the correct type
         if ( typeof propObj[varName] !== dataType  && dataType !== 'any' ) {
            throw new TypeError(`Property '${varName}' must be of type ${dataType}`);
         }

      }
   }


   /** Create a new global variable with the specified properties.
    *   @param { string  } _prop          The name of the new variable.
    *   @param { boolean } _isMutable     Indicates whether the variable is mutable. [Default: true]
    *   @param { any     } _initialValue  The initial value of the variable. [Default: null]
    */
   function addProp(_prop, _initialValue = null, _isMutable = true) {

      // Check if the property already exists in the globals object
      if (Object.hasOwn(g_target, _prop)) {
         throw new Error(`Property ${_prop} already exists`);
      }

      // Create a new property with the specified value and type
      Object.defineProperty(g_target, _prop, {
         value        : { value: _initialValue, isMutable: _isMutable },
         configurable : true,
         enumerable   : true,
         writable     : true
      })

   }

   /** Bypass the proxy to read the raw target object.
    *   @returns { object } The raw target object.
    */
   function getTarget() { return g_target; }


//
// END method definitions
//////////////////////////////////////////////////





// Define Global Methods
addProp( 'validateProp',  validateProp, false);
addProp( 'addProp'     ,  addProp     , false);
addProp( 'getTarget'   ,  getTarget   , false);



export default globals;