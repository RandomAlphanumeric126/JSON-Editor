/* Tasks:

   [ ] - Create JDocs for all functions
   [ ] - ?? Move history management to a dedicated module
   [ ] - Create a function for initializing the navbar
         [ ] - Assigns each global var to their associated elements. (Currenlty done in updateNavBar)
   [?] - ?? Clear the current value of the input[type='file'].value to remove loaded files
         - updateNavBar() --> fileSelect.value = '';
   [X] - Remove focus (blur) from navBar on submit address

*/


import addClickHandler from "./clickHandler.js";
import globals from "./globals.js";
import { initPathTree, navigateToBranch } from "./pathTree.js";


let pathForm   = null;
let pathInput  = null;
let fileSelect = null;
let filePickerBtn = null;


export function updateNavBar(_pathArr) {

   if (_pathArr == null) return;

   if (!pathForm) {
      pathForm   = globals.navBar.querySelector('form');
      pathInput  = pathForm.querySelector('input[type="text"]');
      fileSelect = pathForm.querySelector('input[type="file"]');
      fileSelect.value = '';     // TODO: Is this an appropriate way to clear the content/filelist?

   }
   if (Object.keys(globals.jsonRoot).length) pathInput.value = '/' + _pathArr.join('/');
}


export function startNavBarListeners() {
   pathForm.addEventListener( 'submit', delegateSubmitEvent );

   fileSelect.addEventListener( 'change', delegateFileSelectEvent );

   addClickHandler(globals.navBar, delegateClickEvent);

   // TODO: move to initializer function
   filePickerBtn = document.getElementById('file-picker-text');
}



// TODO: Implement a way to update navHistory on valid submission
function delegateSubmitEvent(e) {
   e.preventDefault();

   const path = getPathFromString(pathInput.value);
   navigateToBranch(path);
   
   document.activeElement.blur();
}


function delegateClickEvent(e) {

   const history = globals.navHistory;

   const isButton =  e.target.nodeName === 'BUTTON' || e.target.parentNode.nodeName === 'BUTTON';

   // Declare Buttons
   let isBackButton, isForwardButton, isUpButton;

   if (isButton) {

      isBackButton    =  e.target.classList.contains('btn-back') || e.target.parentNode.classList.contains('btn-back');
      isForwardButton =  ( ! isBackButton )
                           && (e.target.classList.contains('btn-forward') || e.target.parentNode.classList.contains('btn-forward'));
      isUpButton      = ( ! isForwardButton )
                           && (e.target.classList.contains('btn-up') || e.target.parentNode.classList.contains('btn-up'));
      

      document.activeElement.blur();
   }


   


   // Back Button Handler
   if (isBackButton) {


      if (history.currentIndex !== 0) {
         navigateHistory( --history.currentIndex );
      }
   }

   // Forward Button Handler
   else if (isForwardButton) {

      if (history.currentIndex !== history.locations.length - 1) {
         navigateHistory( ++history.currentIndex );
      }

   }

   // Up Button Handler
   else if (isUpButton) {

      navigateUp();

   }

}


function navigateHistory(_historyIndex) {

   const h = globals.navHistory;
      
   h.isHistoryPath = true;
   navigateToBranch(h.locations[_historyIndex]);
   updateNavBar(h.locations[_historyIndex]);
   h.isHistoryPath = false;

}


function navigateUp() {
   const parentPath = globals.selectionProps.path.slice(0, -1);
   navigateToBranch(parentPath);
   updateNavBar(parentPath);
}



// TODO: handle case: includes trailing delimiter
// TODO: handle case: '/  /' spaces as the location
// NOTE: Consider, if the user wants to navigat directly to a file.
   // Would this be indicated by omitting the end delimiter?
function getPathFromString(_pathStr) {
   // Determine the delimiter
      // There is no rule in the json syntax the barrs use of any one character within a string.
      // This means that any key could include any special characters, and still be legal.
   const delimiter = '/'
   let trimmedPath = _pathStr.trim();
   
   
   // Remove prefixed delimeter
   if (trimmedPath.startsWith(delimiter)) {
      // IF so, remove it.
      // This is safe because an empty array represents the root, and index 0 represents the first top level key inside the root
      trimmedPath = trimmedPath.slice(delimiter.length);
   }
   
   
   // Remove affixed delimeter
   if (trimmedPath.endsWith(delimiter)) {
      // IF so, remove it.
      trimmedPath = trimmedPath.slice(0, trimmedPath.length - delimiter.length);
   }
   
   
   // Convert the string to an array
   const pathArr = trimmedPath.split(delimiter);
   const cleanPath = [];
   
   
   // Trim each index in the array to remove excess whitespace
   // TODO: When scanning the path for a matching key in pathTree.js, trim the in memory key before comparison as whitespaces are legal in json keys
   for (let i = 0; i < pathArr.length; ++i) {
      let value = pathArr[i];
      value = value.trim();
      value && cleanPath.push(value);
   }


   return cleanPath;

}



function delegateFileSelectEvent(event) {

   // Get the file object
   const file = event.target.files[0];

   // read the file
   const reader  = new FileReader();
   reader.onload = function () {

      const filename = file.name.slice(0, -5);

      // Use the file content as the new jsonRoot
      globals.jsonRoot        = JSON.parse(reader.result);
      filePickerBtn.textContent = filename;
      initPathTree();
      globals.navHistory.locations = [];
      globals.navHistory.currentIndex = -1;

   }
   reader.onerror = () => {
      console.error("Error reading the file. Please try again.", "error");
   };
   reader.readAsText(file);


   document.activeElement.blur();

}