// Add renderer logic for enhanced functionality
const iframe = document.getElementById('iframe');
if (!(iframe instanceof HTMLIFrameElement)) {
    throw new Error("Element with ID 'iframe' is not an <iframe> element.");
}

// Function to update the iframe and persist the state
const updateIframeSource = (url, description) => {
    iframe.src = url;
    localStorage.setItem('lastService', url);
    console.log(`Switched to ${description} (${url})`);
};

// Navigation Button Listeners
document.getElementById('btn-gmail').addEventListener('click', () => {
    updateIframeSource('https://mail.google.com/mail/u/0/#inbox', 'Gmail');
});

document.getElementById('btn-drive').addEventListener('click', () => {
    updateIframeSource('https://drive.google.com/drive/my-drive', 'Drive');
});

document.getElementById('btn-calendar').addEventListener('click', () => {
    updateIframeSource('https://calendar.google.com/calendar/u/0/r', 'Calendar');
});

document.getElementById('btn-slack').addEventListener('click', () => {
    updateIframeSource('https://kineticdata.slack.com', 'Slack');
});

// Load the last visited service on page load
const lastService = localStorage.getItem('lastService') || 'https://mail.google.com/mail/u/0/#inbox';
iframe.src = lastService;

// Handle keyboard shortcuts
document.addEventListener('keydown', (event) => {
    const activeElement = document.activeElement;

    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName)) {
        return; // Ignore shortcuts if the focus is on input/textarea/select
    }

    const isCtrlOrCmd = event.ctrlKey || event.metaKey;

    if (isCtrlOrCmd) {
        let url = '';
        switch (event.key) {
            case '1':
                url = 'https://mail.google.com/mail/u/0/#inbox';
                break;
            case '2':
                url = 'https://drive.google.com/drive/my-drive';
                break;
            case '3':
                url = 'https://calendar.google.com/calendar/u/0/r';
                break;
            case '4':
                url = 'https://kineticdata.slack.com';
                break;
            default:
                return;
        }

        if (url) {
            updateIframeSource(url, `Shortcut Ctrl+${event.key}`);
        }
    }
});

// Apply saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
} else if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}
