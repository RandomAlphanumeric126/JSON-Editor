'use strict';

/* Tasks:
   [X] - Create simple navigation bar panel
   [X] - Create simple path tree panel
   [X] - Create simple browser panel
   [X] - Create simple value panel
   [ ] - Implement double click functionality for:
         [ ] - Expanding branches in the tree
         [X] - Stepping into keys (folders) in the browser
         [ ] - Display cell value in larger popup/modal
   [X] - Create and maintain a navigation history
   [X] - Implement forward, back, and step out navigation controls
   [X] - Refactor the element querySelectors to globals.js
   [ ] - Create a method for validating a pathArr
         - Each entry needs to be a valid, non-empty string.
         - Be sure to check for null and undefined
         - Empty arrays are treated as the root location.
*/

import {
         _getBranchNode,   
         startTreePanelListeners,
         initPathTree             } from './js/pathTree.js';
import { getJsonValue             } from './js/jsonHandler.js';
import { startKeyBrowserListeners } from './js/keyBrowser.js';
import { startNavBarListeners     } from './js/navBar.js';
import { arraysAreEquiv           } from './js/helpers.js';

import globals from './js/globals.js';



//////////////////////////////////////////////////////////////////////////////////////////
// Testable Data
//
//////////////////////////////////////////////////////////////////////////////////////////





// Define the structure of the navigation history
const navHistory = {
   locations     : [],
   currentIndex  : -1,
   isHistoryPath : false
};



// Define Immutable Global Variables
globals.addProp( 'pathTree'         ,  document.getElementById('path-tree'             )  ,  false);
globals.addProp( 'valuePanel'       ,  document.getElementById('value-panel'           )  ,  false);
globals.addProp( 'navBar'           ,  document.getElementById('nav-bar'               )  ,  false);
globals.addProp( 'keyBrowser'       ,  document.querySelector ('.key-browser-grid'          )  ,  false);
globals.addProp( 'previewSubpanel'  ,  document.querySelector ('.preview-table-wrapper')  ,  false);
globals.addProp( 'navHistory'       ,  navHistory                                         ,  false);

// Define Mutable Global Variables
globals.addProp( 'jsonRoot'    ,  []  ,  true);
globals.addProp( 'pathTreeRoot',  null,  true);




// Define selectionProps to be held in globals
const selectionProps = {
   path         : undefined,     // Array of strings - the path in
   branchNode   : undefined,     // Html <li> Element
   jsonObject   : undefined,     // Json Object
   jsonSubkeys  : undefined,     // Array of strings - the subkeys in jsonObject
   selectedTile : undefined,     // Html <div.key-value> Element

   get branchName() { return this.path[this.path.length - 1] ?? 'root' },

   update: function (_pathArr) {

      // Don't update if the _pathArr is the same as this.path
      if (_pathArr.length && arraysAreEquiv(_pathArr, this.path)) return;


      this.path         = _pathArr;
      this.branchNode   = _getBranchNode(_pathArr);
      this.jsonObject   = getJsonValue(_pathArr);
      this.jsonSubkeys  = Object.keys(this.jsonObject ?? []);
      this.selectedTile = null;

   },

}
// Add the selectionProps to the globals scope
globals.addProp('selectionProps', selectionProps, false);



// Initialize component states
globals.selectionProps.update([]);
initPathTree();
globals.navBar.querySelector('.address-bar').value = '';




// Start the event listeners
// TODO: create each event listener as a singleton??
startTreePanelListeners();
startKeyBrowserListeners();
startNavBarListeners();


// FOR TESTING: Button to load test data for demonstration.
const btn_loadTestData = document.getElementById('load-test-data');
btn_loadTestData.addEventListener(
   'click',
   ()=>{
      const testData = {
      "movie_001": {
         "title": "This is a ridiculously long title that is intneded to test how well the value preview box is handling overflow:auto.\n\nIf all goes as it should, then the box should remain the exact same size and only force it's content to overflow into a scroll box.\n\nThis has proven to be much more difficult than I ever could have anticipated due to how flexbox, grid, and tables handle long content. Hopefully I can get this sorted out. It's kinda important.",
         "release_date": "2024-03-15",
         "budget": 15000000,
         "rating": 7.8,
         "in_production": false,
         "director": {
            "name": "Elena Vasquez",
            "nationality": "Brazilian"
         },
         "cast": [
            "Marcus Chen",
            "Sarah Okafor",
            "Daniel Romano"
         ],
         "genres": ["Sci-Fi", "Thriller"],
         "box_office": null,
         "awards": {
            "nominations": [
               {
                  "category": "Best Visual Effects",
                  "won": true
               }
            ]
         }
      },
      "movie_002": {
         "title": "Echoes of Tomorrow",
         "release_date": "2024-05-22",
         "budget": 22000000,
         "rating": 8.1,
         "in_production": false,
         "director": {
            "name": "Kazuki Tanaka",
            "nationality": "Japanese"
         },
         "cast": [
            "Yuki Sato",
            "Ahmed Hassan",
            "Priya Sharma"
         ],
         "genres": ["Sci-Fi", "Drama"],
         "box_office": null,
         "awards": {
            "nominations": [
               {
                  "category": "Best Original Score",
                  "won": false
               }
            ]
         }
      },
      "series_003": {
         "title": "Neon City Chronicles",
         "episode_count": 12,
         "season": 2,
         "title": "Neon City Chronicles",
         "budget": 8500000,
         "rating": 7.2,
         "in_production": true,
         "genres": ["Cyberpunk"],
         "creators": ["James Liu", "Maria Santos"],
         "box_office": null,
         "awards": {
            "nominations": []
         }
      }
      }

      globals.jsonRoot = testData;
      
      document.getElementById('file-picker-text').textContent = "testData";
      initPathTree();
      navHistory.locations = [];
      navHistory.currentIndex = -1;
   }
);
