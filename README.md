<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->

<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->

<br />
<div align="center">
  
  <img src="https://github.com/RandomAlphanumeric126/JSON-Browser/blob/main/docs/images/json-icon.svg">

<h3 align="center">JSON Browser</h3>
<br />

<p align="center" style="width:min(100%, 60ch)">
   A familiar and user-friendly graphical interface for exploring complex or deeply nested JSON data.
</p>

</div>

<br />
<br />
<br />

<!-- TABLE OF CONTENTS -->

<details>
<summary>Table of Contents</summary>

<ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![JSON Browser Screen Shot][product-screenshot]

Inspired by the layouts offered by many file browsers, this application allows users to open \*.json files and navigate their contained data using a navigational tree. This simplifies the potentially arduous task of manually navigating complex or deeply nested json data that which can easily grow to hundreds, or even thousands, of lines of data when viewed in a traditional text editor. 

Currently, the application is available as a read-only beta version. As I am a new developer working in my spare time, development of this app may, at times, be sporadic. There are still mant features planned, and as time permits, the application will continue to grow.

### Built With

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-%23663399?logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=222)

<!-- USAGE EXAMPLES -->

## Usage

Start by loading a json file by clicking the 'Select a file' button in the navigation bar. Once the file has loaded, the navigation tree will be populated and initialized with the root location. From there, users can begin navigating the JSON structure. Users can expand and collapse branches, or select one to display the value keys it contains. The navigation buttons located to the left of the address bar can be used for stepping through the navigation history or stepping out of the current node.

[ *The demonstration version also includes some test data that can be loaded so users may explore the app without having to provide their own file.* ]

Within the browser panel (center), where the slected node's keys are displayed, users can select the key with a single click to display the value for the selected key in the right-most panel. Objects and arrays, when selected, will display a table to quickly see what content is nested inside it. Otherwise, the direct value of the selected key is displayed. Selecting any row of the object table will display the associated value above the table.

Double clicking an object or array from within the browser panel allows users to step into the object/array, displaying it's content the browser panel. Clicking any empty space of the browser panel will de-select the currently selected key.

<!-- Planned Features -->

## Planned Features

- Open leaf nodes in larger panel with double-click
- Search the JSON data for desired keys
   - Filter results by depth and data type
- Edit values within the current JSON data
   - Export the edited data to a *.json file
- Add new keys/entries to the current JSON data
- Map the structure of the loaded JSON data for consistant additions

<!-- CONTRIBUTING -->

## Contributing

This is currenlty a solo project with the primary goal of helping me grow as a developer. As such, while appreciate any interest, I am not currently seeking contributors. However, if you would like to help, you may do so by submitting any issues you experience to the [issue tracker](https://github.com/RandomAlphanumeric126/JSON-Browser/issues). In the future, I may be open to taking on contributors. 

If you have any questions or need further assistance, please feel free to reach out to me.

<!-- CONTACT -->

## Contact

Jonathan Blue - contact@jon.blue

You can also find me at [https://jon.blue](https://jon.blue)


<!-- MARKDOWN LINKS & IMAGES -->

<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

<!-- Shields.io badges. You can a comprehensive list with many more badges at: https://github.com/inttter/md-badges -->

[contributors-shield]: https://img.shields.io/github/contributors/RandomAlphanumeric126/JSON-Browser.svg?style=for-the-badge

[contributors-url]: https://github.com/RandomAlphanumeric126/JSON-Browser/graphs/contributors

[forks-shield]: https://img.shields.io/github/forks/RandomAlphanumeric126/JSON-Browser.svg?style=for-the-badge

[forks-url]: https://github.com/RandomAlphanumeric126/JSON-Browser/network/members

[stars-shield]: https://img.shields.io/github/stars/RandomAlphanumeric126/JSON-Browser.svg?style=for-the-badge

[stars-url]: https://github.com/RandomAlphanumeric126/JSON-Browser/stargazers

[issues-shield]: https://img.shields.io/github/issues/RandomAlphanumeric126/JSON-Browser.svg?style=for-the-badge

[issues-url]: https://github.com/RandomAlphanumeric126/JSON-Browser/issues

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555

[linkedin-url]: https://linkedin.com/in/jonathan-blue

[product-screenshot]: docs/images/screenshot.png

