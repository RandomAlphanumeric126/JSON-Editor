/* Tasks:
   [X] - Refactor the element querySelectors to globals.js
   [ ] - Create a function to initialize the keyBrowser
   [ ] - Implement keyboard navigation for tile icons

*/

import addClickHandler from "./clickHandler.js";
import globals from "./globals.js";

import { arraysAreEquiv, changeSelection, getDataType } from "./helpers.js";
import { updateNavBar } from "./navBar.js";
import { navigateToBranch } from "./pathTree.js";
import { updateValuePanel } from "./valuePanel.js";


let selectionProps = null;



export function startKeyBrowserListeners() {

   // debugger;

   globals.keyBrowser.addEventListener('_click',
      (event) => {

         // Grab the wrapper element for the tile
         let tile = null;
         if (event.target.dataset?.type) { tile = event.target; }
         else if (event.target.parentNode.dataset?.type) { tile = event.target.parentNode; }


         // Highlight the selection
         globals.selectionProps.selectedTile = changeSelection(globals.selectionProps.selectedTile, tile);


         // Update the value panel with the data for the selected key
         if (tile) {
            const selectedKey = tile.children[1].textContent;
            updateValuePanel(globals.selectionProps, selectedKey);

         }
         else { updateValuePanel(null) }

      }
   );
   addClickHandler(globals.keyBrowser.parentElement, doSingleClick, doDoubleClick);

}



function doSingleClick(_event) {

   // Grab the wrapper element for the tile
   let tile = null;
   if (_event.target.dataset?.type) { tile = _event.target; }
   else if (_event.target.parentNode.dataset?.type) { tile = _event.target.parentNode; }


   // Highlight the selection
   globals.selectionProps.selectedTile = changeSelection(globals.selectionProps.selectedTile, tile);


   // Update the value panel with the data for the selected key
   if (tile) {
      const selectedKey = tile.children[1].textContent;
      updateValuePanel(globals.selectionProps, selectedKey);

   }
   else { updateValuePanel(null) }

}



function doDoubleClick(_event) {

   const target = _event.target.closest('.key-value');
   const label = target?.children[1].textContent;
   const dataType = target?.dataset?.type;

   if ( label == undefined ) return;


   // TODO: Find a more elegant solution to prevent entering (double clicking) leaf tiles
   if (! ['object','array'].includes(dataType)) {
      doSingleClick(_event);
      return;
   }
   
   navigateToBranch([...globals.selectionProps.path, label]);
   updateNavBar(globals.selectionProps.path);

}



// Create an entry point into this set of functions.
export function updateKeyBrowser(_selectionProps) {

   // TODO: Validate the selected node

   // Alert that no data was received
   if ( ! _selectionProps) { return console.error(`No node provided`); }

   // Update the properties of the currently selected branch
   selectionProps = _selectionProps;

   globals.keyBrowser.innerHTML = '';
   for (let value of selectionProps.jsonSubkeys) {
      globals.keyBrowser.appendChild(buildKeyTile(value));
   }

   // Update the navigation history with the new path
   // TODO: Refactor to a more appropriate 'history manager'
   if ( ! globals.navHistory.isHistoryPath) {

      const history = globals.navHistory;
      const index   = history.currentIndex;
      const oldPath = history.locations[index];
      const newPath = _selectionProps.path;

      // Don't update if arrays are equal
      if (arraysAreEquiv(oldPath, newPath)) return;

      history.locations.splice( index + 1, Infinity, newPath );

      ++globals.navHistory.currentIndex;
   }

}


function buildKeyTile(_keyName) {

   // TODO: Validate JSON Data

   const dataType = getDataType(selectionProps.jsonObject[_keyName]);

   // Build the icon
   const icon = document.createElement('img');
   icon.alt = `${dataType} icon`;
   icon.src = `../assets/icons/${dataType}.svg`


   // Build the label
   const label       = document.createElement('label');

   // Allow word-break on underscores
   const delimiters = ['_', '-', '.']
   const delimsRegex = new RegExp(
      `(${delimiters.map(char => (char === ".") ? "\\." : char).join("|")})`  // SOURCE: Luna 6 LLM
   );
   const keyNameWords = _keyName.split( delimsRegex );
   keyNameWords.forEach((e, i) => {

      if ( i > 0 && delimiters.includes(e) ) {
         label.appendChild(document.createElement('wbr'));
      }
      label.append(e);

   });

   // Build the wrapper
   const wrapper = document.createElement('div');
   wrapper.dataset.type = dataType;
   wrapper.title = dataType;
   wrapper.classList.add('key-value');
   wrapper.appendChild(icon);
   wrapper.appendChild(label);


   return wrapper;
}

