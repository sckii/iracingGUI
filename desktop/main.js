// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

try {
  require("electron-reloader")(module)
} catch(_) {}

const deltaBarWindow = () => {
  // Create the browser window.
  const loading = new BrowserWindow({
    width: 800,
    height: 200,
    webPreferences: {
      preload: path.join(__dirname, './widgets/splashScreen/preload.js'),
      nodeIntegration: true,
    },
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    frame: false
  })

  const deltaBar = new BrowserWindow({
    width: 800,
    height: 200,
    x: (2560 - 800) / 2,
    y: (200),
    webPreferences: {
      preload: path.join(__dirname, './widgets/deltaBar/preload.js'),
      nodeIntegration: true,
    },
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    frame: false,
    show: false,
  })

  const pedals = new BrowserWindow({
    width: 230,
    height: 200,
    x: (2560 - 230) / 2,
    y: (1000),
    webPreferences: {
      preload: path.join(__dirname, './widgets/pedals/preload.js'),
      nodeIntegration: true,
    },
    transparent: false,
    alwaysOnTop: true,
    resizable: false,
    frame: false,
    show: false,
  })

  const utilities = new BrowserWindow({
    width: 200,
    height: 230,
    x: 0,
    y: (1080 - 230),
    webPreferences: {
      preload: path.join(__dirname, './widgets/utilities/preload.js'),
      nodeIntegration: true,
    },
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    frame: false,
    show: false,
  })

  // and load the index.html of the app.
  loading.loadFile("./widgets/splashScreen/index.html")
  loading.center()
  loading.setIgnoreMouseEvents(true)

  setTimeout(() => {
    loading.close()

    deltaBar.loadFile('./widgets/deltaBar/deltaBar.html')
    deltaBar.setIgnoreMouseEvents(true)
    deltaBar.show()
  
    pedals.loadFile('./widgets/pedals/pedals.html')
    pedals.setIgnoreMouseEvents(true)  
    pedals.show()

    utilities.loadFile('./widgets/utilities/utilities.html')
    utilities.setIgnoreMouseEvents(true)
    utilities.show()

  }, 5000)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.whenReady().then(() => {
  deltaBarWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      deltaBarWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})