CoFly
=====

How to build CoFly GUI
----------------------

First of all you must have already Node.js install on your local machine. You can download it free from the following link (Linux,Windows,OSX):

`https://nodejs.org/en/download/`

Clone repository
----------------

when you have already install node.js clone CoFly GUI repository

`git clone git@bitbucket.org:cofly_ikh/cofly_gui.git`

Install all the necessary dependencies
--------------------------------------

Use node.js package manager in order to isntall the following dependencies

### Electron

To install prebuilt Electron binaries, use npm. The preferred method is to install Electron as a development dependency in your app:

`~PROJECT_PATH npm install electron --save-dev`

### Electron Packager

This module requires Node.js 8.0 or higher to run. On macOS/Linux, the unzip program is required. On Windows, both .NET Framework 4.5 or higher and Powershell 3 or higher are required.

`$ npm install electron-packager --save-dev`

### Electron Express

Node.js 0.10 or higher is required. Installation is done using the npm install command:

`$ npm install express`  
  
Now you are ready to build the executable doing that by typing the following  
  
`$ electron-packager ./`  
  
> If you want just to run the project you should run npm start when you are on project directory