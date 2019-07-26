// main js file
const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
// hide warning on console log
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
//init win
let win;

function createWindow(){
	// create nrpswer window
	win = new BrowserWindow({width:1100,height:700,icon:__dirname+'/img/icon.jpg',webPreferences:{webSecurity: false,nodeIntegration: true}});

	// load index.html
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	win.setMenu(null);

	// OPen devtool

	//win.webContents.openDevTools();

	win.on('closed',() =>{

		win = null;

	});
}

    


// Run crete window function 
app.on('ready', createWindow);


// Quit when all windows are closed

app.on('window-all-cloed',() =>{

	if(process.platform !== 'darwin'){
		app.quit();
	}
});
