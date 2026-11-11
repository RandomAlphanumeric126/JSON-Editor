/* Tasks:
      [X] - Create tasks list to track tasks to be, and thus far, completed
      [ ] - Create a deque to manage the total number of generated branches being maintained
            in the DOM. We don't want to maintain too many at one time.
            [ ] - Determine if there is a way to buffer the tree based on scroll percent.
                  This way we can make sure that large json data won't overpopulate the DOM
                  when much of the data isn't even visible.
                  - Is there a way to reduce the amount stored in memory too?
      [X] - Refactor the element querySelectors to globals.js
      [ ] - Handle case in navigateToPath: Path does not exist
      [ ] - Fix TypeError when double clicking a leaf key.
      [ ] - Uncaught TypeError: Node.appendChild: Argument 1 is not an object.
            - Encountered when initializing the pathTree with an empty object/array (has no children at the root)
*/

'use strict';

import addClickHandler from './clickHandler.js';

import g from './globals.js';

import { changeSelection,     enforceDataType,     getDataType, isEmptyObject  } from './helpers.js';
import { getBranchingSubkeys, getJsonValue } from './jsonHandler.js';
import { updateKeyBrowser                  } from './keyBrowser.js';
import { updateNavBar                      } from './navBar.js';
import { updateValuePanel } from './valuePanel.js';



export function startTreePanelListeners() {

   // globals.pathTree.addEventListener( 'click', delegateClickEvent );
   addClickHandler(g.pathTree, delegateClickEvent);

}


export function initPathTree() {


   g.pathTree.innerHTML = '';


   const props = g.selectionProps;
   props.update([]);

   // Update the other panels
   updateKeyBrowser(props);
   updateNavBar(props.path);

   // Initialize the tree when no data is loaded
   if (isEmptyObject(g.jsonRoot)) {

      // Report a message to load a file
      g.pathTree.appendChild(browseForFileMsg());
      g.pathTreeRoot = null;

   }

   // Initialize the tree with available json data
   else {

      g.pathTree.appendChild(createRootBranch());
      
      g.pathTreeRoot = g.pathTree.querySelector ('[data-key="root"]');

      navigateToBranch([]);

   }

}


function createRootBranch() {
   // Create the elements
   const rootWrapper = document.createElement('ul');
   const root = document.createElement('li');
   const button = document.createElement('button');
   const label = document.createElement('span');

   // Put the pieces together
   rootWrapper.appendChild(root);
   root.appendChild(button);
   root.appendChild(label);

   // Initialize properties for each element
   root.dataset.key = 'root';
   button.classList = 'expand-button'
   button.textContent = "+";
   label.classList = 'branch-name'
   label.textContent = "root";

   return rootWrapper;
}


function browseForFileMsg() {
   const p = document.createElement('p');
   p.textContent = 'Please load a file using the browse button above.';

   return p;
}


function delegateClickEvent(event) {

   const currentBranch = event.target.parentElement;

   // Determine what was clicked
   const isExpandBtn   = currentBranch.nodeName ==='LI'
                      && event.target === currentBranch.children[0];
   const isBranchLabel = !isExpandBtn     // If we already know it's a button, then there is no need to keep looking
                      && currentBranch.nodeName ==='LI'
                      && event.target === currentBranch.children[1];


   // Shortcut vars
   let pathArr       = (isBranchLabel || isExpandBtn) ? getPathFromTree(currentBranch) : null;

   

   // Handle case: clicked expand button
   if (isExpandBtn) {

      if (currentBranch.children.length === 0) return;

      // Determine if the branch has been generated yet
      if (currentBranch.children.length < 3) {
         // Generate the branch and add it to the DOM
         const jsonObject = getJsonValue(pathArr);
         const subkeys    = getBranchingSubkeys(jsonObject);
         const subBranch  = generateBranch(subkeys);

         addBranch(currentBranch, subBranch);
      }
         
      // Toggle the branch collapsed state
      toggleExpandedState(currentBranch);
   }



   // Handle case: clicked branch name
   if (isBranchLabel) {

      // Toggle the highlighted branch from prev to new
      changeSelection(g.selectionProps.branchNode, currentBranch);

      // Update the selectionProps for the new path/branch
      g.selectionProps.update(pathArr);



      ////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////
      // TODO: Refactor these updaters
      //
      // Update the key browser
      updateKeyBrowser(g.selectionProps);
      //
      // Clear the peview panel
      updateValuePanel();
      updateNavBar(pathArr);
   }

}



// FIXME: [Incomplete] Navigate to a given path in the pathTree
   // TODO: Handle case: Allow navigation into objects only, disallow entry into primitives
      // This could be controlled by the trailing delimiter.
            // Included: Navigate to the 'folder' and display contents in keybrowser
            // Omitted: Navigat to the 'file', display the folder (index-1) in the browser, and
            //          set the 'file' as selected, display it's content in the preview box
/** Navigates the path-tree DOM to the node corresponding to the given JSON path.
 * 
 * If a branch in the path does not yet exist in the DOM, a new branch is
 * generated and appended. Existing branches are simply expanded.
 * 
 * After navigation, the selection UI, key browser, and value panel are updated
 * to reflect the new selection.
 *
 * @param _pathArr the ordered array of keys forming the path to navigate to;
 *                 an empty array targets the root node.
 * @throws ReferenceError if any key in the path does not exist in the
 *                        corresponding JSON object.
 */
export function navigateToBranch(_pathArr) {

   // Initialize the workers at the root
   let jsonObject  = g.jsonRoot;
   let parentNode  = null;
   let currentNode = g.pathTreeRoot;
   let nextNode    = null;
   const isRoot   = _pathArr?.length === 0;

   if (currentNode == null || _pathArr == null) return;

   let index = 0;
   do {

      // Throw an error if the path does not exist
      if ( _pathArr.length > 0  &&  ! jsonObject[_pathArr[index]] ) {
         throw new ReferenceError(`Location "/${_pathArr.splice(0, index+1).join('/')}" does not exist`)
      }
      
      // Expand existing branches
      if (currentNode.children.length === 3) {

         toggleExpandedState(currentNode, true);

         if (isRoot) break;
         
         // Prep the next dom node for iteration
         nextNode = currentNode.querySelector(`[data-key="${_pathArr[index]}"]`).parentNode;
      }

      // Generate new branch
      else {
         const subkeys = getBranchingSubkeys(jsonObject);
         nextNode      = generateBranch(subkeys);


         currentNode.appendChild(nextNode);
         toggleExpandedState(currentNode, true);
      }

      
      if (isRoot) break; 


      // Step into both the next node and the json subkey
      currentNode = nextNode.querySelector(`[data-key="${_pathArr[index]}"]`);
      jsonObject = jsonObject[_pathArr[index]];

      index++;

   } while ( index < _pathArr.length );


   // Update the highlighted selection and update it's props
   changeSelection(g.selectionProps.branchNode, currentNode);
   g.selectionProps.update(_pathArr);

   // Update the other panels
   updateKeyBrowser(g.selectionProps)
   updateValuePanel();

}


// [WORKING] Get the <li> node in the pathTree associated with a given path
   // This will be similar to navigation but does not expand touched branches, and returns the final branch node
export function _getBranchNode(_pathArr) {

   // Guard against incorrect arguments
   enforceDataType(_pathArr, 'array');

   // Start at the root node
   let currentNode = g.pathTreeRoot;

   // Traverse pathArr, updating currentNode at each step via [data-key]
   for ( const keyName of _pathArr ) {
      currentNode = currentNode.querySelector(`[data-key="${keyName}"]`);
   }

   return currentNode;
}


// [READY FOR TESTING] Get the path associated with a given domNode within the pathTree
function getPathFromTree(_liNode) {

   // Guard against incorrect arguments
   const dataType = getDataType(_liNode);
   if ( dataType !== 'htmllielement') { throw new TypeError(`Expected htmllielement, received ${dataType}`); }


   // Initialize local variables
   const inversePathArr = [];    // Builds in reverse order
   let   currentNode    = _liNode;


   // Traverse UP the pathTree adding each [data-key] to the inversePathArr
   while (currentNode.dataset?.key !== 'root') {

      // Make sure we are looking at a branch node
      if ( ! currentNode.dataset?.key ) { throw new Error(`Current node is not a branch node\n${currentNode}`); }

      inversePathArr.push(currentNode.dataset.key);
      currentNode = currentNode.parentElement.parentElement;   // Skip over the <ul> wrapper

   }


   return inversePathArr.reverse();
}


// Set currently selected path in globals
// Set the currently selected domNode in globals
   // Both setters are baked into the selectionProps object definition as a trap which updates it's internal
   // props whenever the path is updated

// [WORKING] Generate a <ul> containing an entry for each key, of a given object, which are typeof 'object'
   // Does not add the <ul> directly. This only returns the created <ul>
   // NOTE: The branching subkeys needs to be retrieved prior to this call so they can be passed in
function generateBranch(_branchingSubkeysArr) {

   // Guard against incorrect arguments
   const dataType = getDataType(_branchingSubkeysArr);
   if ( dataType !== 'array') { throw new TypeError(`Expected array, received ${dataType}`); }

   // Handle the case where the branchingSubkeysArr is empty
   if (_branchingSubkeysArr.length === 0) return null;

   // Build the element
   const wrapperUl = document.createElement('ul');

   // Loop through the array of subkeys, filling out the <ul>
   for ( const [keyName, hasSubKeys] of _branchingSubkeysArr  ) {

      // Build the elements for the current subkey in the array
      const li          = document.createElement('li'  );    // wraps the key and button/spacer
      const nameWrapper = document.createElement('span');    // wrap the key for styling
      let   expandBtn   = document.createElement('span');    // initialize as an empty spacer

      // Add a button for expanding/collapsing branches
      if (hasSubKeys) {

         expandBtn = document.createElement('button');  // convert the span to a button

         expandBtn.classList.add('expand-button');
         expandBtn.textContent = '+';
         
      }
      else {
         expandBtn.classList.add('button-spacer');
      }

      // Prep the key wrapper
      nameWrapper.classList.add('branch-name');
      nameWrapper.textContent = keyName;

      // Assemble the li
      li.dataset.key = keyName;
      li.appendChild(expandBtn);
      li.appendChild(nameWrapper);
      if (expandBtn.nodeName === "BUTTON") {
         li.classList.add('collapsed');
      }


      // Append the li to the ul
      wrapperUl.appendChild(li);

   }


   return wrapperUl;

}


// [READY FOR TESTING] Add a previously generated <ul> branch to the appropriate domNode in the pathTree
   // This should probably take a domNode as an argument
   // Is this function needed? It only performs a single action.
function addBranch(_targetBranch_li, _newBranch_ul) {

   if ( ! _newBranch_ul ) return;

   _targetBranch_li.appendChild(_newBranch_ul);

}

// [READY FOR TESTING] Toggle the expander of a branch in the pathTree
   // This is the replacement for both the collapse and expand functions
   // TODO: Requires that the <li> is created with a default state in the class
      // (currently it is generated without either)
function toggleExpandedState(_targetBranch_li, _forceExpand = false) {

   let isExpanded = false;

   if (_forceExpand) {
      _targetBranch_li.classList.remove('collapsed'); 
      _targetBranch_li.classList.add   ('expanded'); 
      isExpanded = true;
   }

   else {
      // Update the class to reflect the new state
      isExpanded = _targetBranch_li.classList.toggle( 'expanded' );
      (isExpanded) ? _targetBranch_li.classList.remove('collapsed')
                   : _targetBranch_li.classList.add   ('collapsed');
   }

   
   // Update the button to reflect the new state
   const button     = _targetBranch_li.querySelector('.expand-button');
   button.textContent = (isExpanded) ? '-' : '+';

}
