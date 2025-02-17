const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
        },
    });

    // Load Gmail as the default URL
    mainWindow.loadURL('https://mail.google.com/mail/u/0/#inbox');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle `new-window` events to open links in a popup window
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        createPopupWindow(url); // Open external links in a new popup window
        return { action: 'deny' }; // Prevent the default behavior
    });

    // Prevent unexpected navigation in the main window
    mainWindow.webContents.on('will-navigate', (event, url) => {
        if (url !== mainWindow.webContents.getURL()) {
            event.preventDefault();
            createPopupWindow(url);
        }
    });

    // Create the application menu with a Navigation section
    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                { role: 'reload' },
                { role: 'quit' },
            ],
        },
        {
            label: 'Navigation',
            submenu: [
                {
                    label: 'Gmail',
                    click: () => mainWindow.webContents.loadURL('https://mail.google.com/mail/u/0/#inbox'),
                },
                {
                    label: 'Drive',
                    click: () => mainWindow.webContents.loadURL('https://drive.google.com/drive/my-drive'),
                },
                {
                    label: 'Calendar',
                    click: () => mainWindow.webContents.loadURL('https://calendar.google.com/calendar/u/0/r'),
                },
                {
                    label: 'Slack',
                    click: () => mainWindow.webContents.loadURL('https://kineticdata.slack.com'),
                },
            ],
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Dark Mode',
                    click: () => mainWindow.webContents.send('toggle-dark-mode'),
                },
                {
                    label: 'Toggle Light Mode',
                    click: () => mainWindow.webContents.send('toggle-light-mode'),
                },
            ],
        },
    ]);

    // Set the custom menu for the application
    Menu.setApplicationMenu(menu);
});

// Function to create a popup window for external links
const createPopupWindow = (url) => {
    const popup = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: true, // Allow resizing of the popup
        alwaysOnTop: true, // Ensure the popup stays on top
        webPreferences: {
            contextIsolation: true,
            sandbox: true,
        },
    });

    popup.loadURL(url);

    // Enable DevTools for debugging (optional)
    popup.webContents.openDevTools();

    popup.on('closed', () => {
        popup = null;
    });
};

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
