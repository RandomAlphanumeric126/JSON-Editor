'use strict';

/* Tasks:
   [X] - Create a separation between the object table and the preview table when both are displayed
   [X] - Add a class (or id) to each table to differentiate between them when styling
   [X] - Enable word wrapping for the valueCell in the preview table
   [X] - Erase the key table when the user clicks empty space (deselects current selection)
   [X] - Replace the instructions inside the preview table when user performs a de-selection
   [ ] - Highlight/outline or in some other way indicate which cell was selected to be displayed
         in the preview table.
   [ ] - Revert the preview table from a set of divs back to proper table elements
   [X] - Refactor the previewPanel querySelector to globals.js

*/

import globals from "./globals.js";

import { getDataType } from "./helpers.js";



export function updateValuePanel(_selectedData = null, _selectedKey = null) {

   // Handle case when args are undefined
   if ( !_selectedData || !_selectedKey ) {

      // Remove the object table
      if (globals.valuePanel.children[1]) globals.valuePanel.removeChild(globals.valuePanel.children[1]);

      resetPreviewSubpanel();

      return;
   }

   // Shortcut vars
   const valueAtKey  = _selectedData.jsonObject[_selectedKey];
   const valueIsNull = valueAtKey === null;


   // Clear the preview subpanel
   if (globals.valuePanel.children[1]) globals.valuePanel.removeChild(globals.valuePanel.children[1]);



   // Handle primitives and null
   if (valueIsNull || typeof valueAtKey !== 'object') {

      updatePreviewSubpanel(_selectedKey, valueAtKey);

   }

   else {
      // Clear the preview subpanel
      updatePreviewSubpanel(_selectedKey, valueAtKey);

      const objTable = buildObjectTable(valueAtKey);

      globals.valuePanel.appendChild(objTable);
   }



}


function updatePreviewSubpanel(_key = null, _value = null) {

   // Shortcuts
   const headerWrapper = globals.previewSubpanel.children[0];
   const valueWrapper  = globals.previewSubpanel.children[2];

   
   // Handle case: No active selection || Performed de-selection
   if (_key == null) {

      resetPreviewSubpanel();

      return;
   }


   // Clear content
   headerWrapper.innerHTML = '';
   valueWrapper.innerHTML  = '';


   // Create elements
   const dataTypeIcon = document.createElement('img');
   const headerText   = document.createElement('h4');
   const valueText    = document.createElement('p' );

   // Set appropriate icon
   const typeof_parent = getDataType(globals.selectionProps.jsonObject);
   const typeof_value  = getDataType(_value);
   dataTypeIcon.src    = `../assets/icons/${typeof_value}.svg`;

   
   // Update header
   headerText.textContent = ( typeof_parent === 'array' )
                        ? `Array index: ${_key}`
                        : _key ;

   // Update value
   valueText.textContent = ( ['array', 'object'].includes(typeof_value) )
                       ? `Number of children: ${Object.keys(_value).length}`
                       : _value;
   

   // Assemble elements
   headerWrapper.appendChild(headerText  );
   headerWrapper.appendChild(dataTypeIcon);
   valueWrapper.appendChild (valueText   );

}


function resetPreviewSubpanel() {

   // Shortcuts
   const headerWrapper = globals.previewSubpanel.children[0];
   const valueWrapper  = globals.previewSubpanel.children[2];


   // Clear content
   headerWrapper.innerHTML = '';
   valueWrapper.innerHTML  = '';


   // Create elements
   const instruction = document.createElement('h4');
   const description = document.createElement('p');
   const icon        = document.createElement('img');
   

   // Set properties
   instruction.textContent = "Make a selection";
   description.textContent = "The value of the current selection will be displayed here..."
   icon.src              = `../assets/icons/null.svg`;


   // Assemble the elements
   headerWrapper.appendChild(instruction);
   headerWrapper.appendChild(icon);
   valueWrapper.appendChild(description);

}


// FIXME: Refactor this to build the table properly with a thead and a tbody. Hopefully this will allow me to position sticky
function buildObjectTable(_keyValue) {

   const useHr = false;

   // Build the table's Skeleton
   const table = document.createElement('table');
   const thead = document.createElement('thead');
   const tbody = document.createElement('tbody');
   table.appendChild(thead);
   table.appendChild(tbody);

   // Zero-indexed or Key reference?
   const isArray = Array.isArray(_keyValue);
   const keyType = isArray ? 'Index' : 'Key';

   // Build the header
   const headerRow      = thead.insertRow();
   const headerSpacer   = document.createElement('hr');
   const keyType_th     = document.createElement('th');
   const value_th       = document.createElement('th');
   keyType_th.textContent = keyType;
   value_th.textContent   = 'Value';

   thead.appendChild(headerSpacer);
   headerRow.appendChild(keyType_th);
   headerRow.appendChild(value_th);

   // Populate the body with the entries of the object/array
   for (let [key, value] of Object.entries(_keyValue)) {

      // Indicate in the value cells if they are objects, arrays, or null
      if ( typeof value === 'object') value = getDataType(value).toUpperCase();

      useHr && tbody.appendChild(document.createElement('hr'));
      
      const row = tbody.insertRow();

      // Build the cell for the key
      const indexCell     = row.insertCell();
      indexCell.textContent = key;

      // Build the cell for the value
      const valueCell     = row.insertCell();
      valueCell.textContent = (value == null) ? 'NULL' : value;    // Report NULL in place of an empty string

   }


   table.classList.add('object-table');
   // headerSpacer.classList.add('table-separator');
   tbody.addEventListener('click', handleCellClick);

   // Build the table wrapper
   const div = document.createElement('div');
   div.appendChild(table);
   div.classList.add('object-table-wrapper');

   return div;



}

// FIXME: For demonstration only. Needs rewrite
function handleCellClick(e) {

   // Grab elements
   const targetRow     = e.target.parentNode;
   const table         = e.target.closest('table');
   const previewHeader = globals.valuePanel.querySelector('.preview-header-wrapper h4' );
   const previewIcon   = globals.valuePanel.querySelector('.preview-header-wrapper img');
   const previewValue  = globals.valuePanel.querySelector('.preview-value-wrapper p'   );
   
   
   // Shortcuts
   const targetKey     = targetRow.children[0].textContent;
   const tileName      = globals.selectionProps.selectedTile.textContent;
   const jsonObject    = globals.selectionProps.jsonObject;
   const jsonValue     = jsonObject[tileName][targetKey];
   const typeof_object = getDataType(jsonObject[targetKey]);
   const typeof_value  = getDataType(jsonValue);
   

   // Update header
   previewHeader.textContent = (typeof_object === 'array')
                           ? `Array index: ${targetKey}`
                           : targetKey;

   // Update value
   previewValue.textContent  = ( ['array', 'object'].includes(typeof_value) )
                           ? `Number of children: ${Object.keys(jsonValue).length}`
                           : jsonValue;

   // Update icon
   previewIcon.src = `../assets/icons/${typeof_value}.svg`;   

   
   // Toggle current selection
   table.querySelector('.selected')?.classList.remove('selected');   // TODO: Move to selectionProps
   targetRow.classList.add('selected');
}