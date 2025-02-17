const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Open external links in the default browser
    openExternal: (url) => ipcRenderer.send('open-external-link', url),

    // Trigger events for dark/light mode toggling
    toggleDarkMode: () => ipcRenderer.send('toggle-dark-mode'),
    toggleLightMode: () => ipcRenderer.send('toggle-light-mode'),
});
