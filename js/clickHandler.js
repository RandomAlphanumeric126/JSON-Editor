/* Tasks:
      [-] - Prevent a single click action from firing when click-holding on a second click
            - The intended behavior is to wait for the release of the mouse button before triggering an action
      [ ] - Handle cases where user clicks and drags away from the element
            - Currently there is a bug where a single click will always fire if the user drags away when holding the second click.
            - Handling mouse held state might solve this issue, so handle that first
      [ ] - Fix the issue with 'click' event starting timer (_clickDelay) on 'mouseup' instead of 'mousedown'
            - This is creating a lag between when the single click is expected, and when it is performed.
      [ ] - Implement a method of checking if mouse button is held, deferring the click action until AFTER it is released.
            - This will allow the delay between clicks to include the time it takes for users to release the button, making
              actions feel more responsive and 'faster'.
      [ ] - Modify parameters for addClickListener to take an array of click actions.
            [ ] - Takes either a callback function OR an array of callbacks
                  - if only a single callback is provided, the multiclick is unneeded, so action should fire as soon as possible.
      [?] - Uncaught TypeError: Node.appendChild: Argument 1 is not an object.
            - forces a double click state until a valid double click is performed. Only then can users return to a single click op.

*/

import globals from "./globals.js";

// document.addEventListener('mousedown', handleMouseDown);
// document.addEventListener('mouseup'  , handleMouseUp  );

function handleMouseDown(_event) { console.log('Implement mousedown action') }
function handleMouseUp  (_event) { console.log('Implement mouseup action'  ) }


/** A callback invoked in response to a click.
 *
 * @callback ClickAction
 * @param {MouseEvent} event - The click event received by the element's listener.
 * @returns {void}
 */
/** Registers handlers that distinguish single clicks from double clicks.
 *
 * If a callback is missing or is not a function, a warning is logged when this
 * function is called and that click action becomes a no-op.
 *
 * @param   { HTMLElement }   _targetElement       - Element to listen for click events on.
 * @param   { ClickAction } [ _singleClickAction ] - Callback for a single click.
 * @param   { ClickAction } [ _doubleClickAction ] - Callback for a double click.
 * @param   { number      } [ _clickDelay=150    ] - Milliseconds to wait for a possible second click.
 * @returns { void        }
 */
export default function addClickHandler(
   _targetElement,
   _singleClickAction,
   _doubleClickAction,
   _clickDelay = 200
) {


   // Alert devs that no callback was given without disrupting functionality
   _singleClickAction = _singleClickAction || (() => console.warn("Function 'addClickHandler' did not receive a callback function for the single click event.\nIf this was intentional, use an empty function instead."));
   _doubleClickAction = _doubleClickAction || (() => console.warn("Function 'addClickHandler' did not receive a callback function for the double click event.\nIf this was intentional, use an empty function instead."));

   // Place the actions into an array to simplify calling the appropriate action for the click count
   const clickActions = [_singleClickAction, _doubleClickAction];

   // Click management
   const MAXCLICKS  = clickActions.length;
   let   clickCount = 0;
   let   clickTimer = undefined;
   let   event      = null;

   // Add the event listener to the DOM
   _targetElement.addEventListener('click', (e)=>{

      event = e;

      if (clickCount < MAXCLICKS) clickCount++;
      
      // Reached the end of the click sequence, run action immediately
      if (clickCount === MAXCLICKS) {
         clearTimer();
         runCallback();
         return;
      }

      startTimer();

   });


   // Clears the timeout and nulls the id
   function clearTimer() {
      clearTimeout(clickTimer);
      clickTimer = null;
   }


   // Resets the timer
   function startTimer(_timerDelay = _clickDelay) {
      
      if (clickTimer !== null) { clearTimer(); }

      clickTimer = setTimeout(runCallback, _timerDelay);
   }


   // Performs the click action stored at the clickActions index location matching (clickCount - 1)
   // This approach allows new click actions to be added (tripleClick?) without requiring code overhaul.
   function runCallback() {

      const warnMsg = "Function 'doClickAction()' performed no operation after receiving an invalid click count.";
      
      if   ( clickCount && clickCount <= MAXCLICKS ) {
         clickActions[clickCount - 1](event);
      }
      else console.warn(warnMsg);

      clickCount = 0;

   }

}


