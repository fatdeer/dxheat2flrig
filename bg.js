const DEFAULT_OPTIONS = {
    'flrig-uri': 'http://127.0.0.1:12345/',
    'digi-mode': 'DATA-U',
    'cw-mode': 'CW-L'
};

function getOptions() {
    return new Promise((resolve) => {
        chrome.storage.sync.get({ options: DEFAULT_OPTIONS }, (items) => {
            resolve(Object.assign({}, DEFAULT_OPTIONS, items.options || {}));
        });
    });
}

function xmlEscape(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

async function setVfo(uri, qrg) {
    const body = '<?xml version="1.0"?><methodCall><methodName>main.set_frequency</methodName><params><param><value><double>' + Number(qrg) + '</double></value></param></params></methodCall>';
    try {
        await fetch(uri, {
            method: 'POST',
            headers: { 'Content-Type': 'text/xml' },
            body: body
        });
    } catch (err) {
        console.warn('[dxheat2flrig] setVfo failed for', uri, err);
    }
}

async function setMode(uri, mode) {
    const body = '<?xml version="1.0"?><methodCall><methodName>rig.set_modeA</methodName><params><param><value>' + xmlEscape(mode) + '</value></param></params></methodCall>';
    try {
        await fetch(uri, {
            method: 'POST',
            headers: { 'Content-Type': 'text/xml' },
            body: body
        });
    } catch (err) {
        console.warn('[dxheat2flrig] setMode failed for', uri, err);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'setVfo') {
        (async () => {
            const opts = await getOptions();
            const uri = opts['flrig-uri'];
            let mode = request.mode;
            if (mode === 'CW') {
                mode = opts['cw-mode'];
            } else if (mode === 'DIGITAL') {
                mode = opts['digi-mode'];
            }
            await setMode(uri, mode);
            await setVfo(uri, request.qrg);
        })();
        return true;
    }
});
