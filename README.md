CoFly
=====
Project Description
----------------------
This paper presents a novel, low-cost, user-friendly Precision Agriculture platform that attempts to alleviate the drawbacks of limited battery life by carefully designing missions tailored to each field's specific, time-changing characteristics. The proposed system is capable of designing coverage missions for any type of UAVs, integrating field characteristics inside the resulting trajectory, such as irregular field shape and obstacles. The collected images are automatically processed to create detailed orthomosaics of the field and extract the corresponding vegetation indices. A novel mechanism is then introduced that automatically extracts possible problematic areas of the field and subsequently designs a follow-up UAV mission to acquire extra information on these regions. The toolchain is completed by employing a specifically designed deep learning module to detect weeds in the close-examination flight. For the development of such a deep-learning module, a new weeds dataset from the UAV's perspective, which is publicly available for download, was collected and annotated. All
the above functionalities are enclosed into an open-source, end-to-end platform, named Cognitional Operations of micro Flying vehicles (CoFly). The effectiveness of the proposed system was tested and validated with extensive experimentation in
agricultural fields with cotton in Larissa, Greece during two different crop sessions.

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