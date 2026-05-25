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
        showAlert('status', 'alert-success', 'Options saved.');
    });
}

function testConnection() {
    const testEl = document.getElementById('test-status');
    testEl.className = 'alert alert-info show';
    testEl.textContent = 'Testing connection...';

    chrome.runtime.sendMessage({ message: 'testConnection' }, (response) => {
        if (response && response.ok) {
            testEl.className = 'alert alert-success show';
            testEl.textContent = 'Connected to FLRig ' + (response.value || '') + '.';
        } else {
            testEl.className = 'alert alert-error show';
            testEl.textContent = 'Connection failed: ' + (response ? response.error : 'No response from extension.');
        }
        setTimeout(() => {
            testEl.classList.remove('show');
        }, 4000);
    });
}

function showAlert(id, cssClass, text) {
    const el = document.getElementById(id);
    el.className = 'alert ' + cssClass + ' show';
    el.textContent = text;
    setTimeout(() => {
        el.classList.remove('show');
    }, 1500);
}

function restoreOptions() {
    let defaultOptions = {
        'flrig-uri': 'http://127.0.0.1:12345/',
        'cw-mode': 'CW-L',
        'cw-bw': '500',
        'ssb-mode': 'USB',
        'ssb-bw': '2400',
        'digi-mode': 'DATA-U',
        'digi-bw': '3000'
    };

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
document.getElementById('test-btn').addEventListener('click', testConnection);
