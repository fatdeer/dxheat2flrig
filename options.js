function saveOptions() {
    let options = {};
    document.querySelectorAll('input').forEach(input => {
        if (!input.classList.contains('option')) {
            return;
        }
        options[input.id] = input.value;
    });

    chrome.storage.sync.set({
        options: options
    }, () => {
        let statusElement = document.getElementById('status');
        statusElement.classList.add('show');
        setTimeout(function () {
            statusElement.classList.remove('show');
        }, 750);
    })

}

function restoreOptions() {
    let defaultOptions = {
        'flrig-uri': 'http://127.0.0.1:12345/',
        'digi-mode': 'DATA-U',
        'cw-mode': 'CW-L',
        'ssb-mode': 'USB'
    }

    chrome.storage.sync.get({
        options: defaultOptions,
    }, (items) => {
        for (const [key, value] of Object.entries(items.options)) {
            const el = document.getElementById(key);
            if (el) el.value = value;
        }
    });

}


document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save-btn').addEventListener('click', saveOptions);
