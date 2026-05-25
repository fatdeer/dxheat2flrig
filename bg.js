const DEFAULT_OPTIONS = {
    'flrig-uri': 'http://127.0.0.1:12345/',
    'cw-mode': 'CW-L',
    'cw-bw': '500',
    'ssb-mode': 'USB',
    'ssb-bw': '2400',
    'digi-mode': 'DATA-U',
    'digi-bw': '3000'
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

/**
 * Send an XML-RPC call to FLRig and return the parsed response value.
 * Returns { ok: true, value: string } on success, { ok: false, error: string } on failure.
 */
async function xmlRpcCall(uri, methodName, params) {
    let paramsXml = '';
    if (params && params.length > 0) {
        paramsXml = '<params>' + params.map(p => '<param><value>' + p + '</value></param>').join('') + '</params>';
    }
    const body = '<?xml version="1.0"?><methodCall><methodName>' + methodName + '</methodName>' + paramsXml + '</methodCall>';

    console.log('[dxheat2flrig] XML-RPC call:', methodName, 'params:', params || []);

    try {
        const resp = await fetch(uri, {
            method: 'POST',
            headers: { 'Content-Type': 'text/xml' },
            body: body
        });
        const text = await resp.text();
        console.log('[dxheat2flrig] XML-RPC response for', methodName, ':', text);
        // Extract the value from XML-RPC response
        const match = text.match(/<value>([\s\S]*?)<\/value>/);
        if (match) {
            // Strip inner type tags like <string>, <double>, <i4> etc.
            const inner = match[1].replace(/<\/?[^>]+>/g, '').trim();
            return { ok: true, value: inner };
        }
        return { ok: true, value: text };
    } catch (err) {
        console.error('[dxheat2flrig] XML-RPC call failed for', methodName, ':', err.message || err);
        return { ok: false, error: err.message || String(err) };
    }
}

async function setVfo(uri, qrg) {
    console.log('[dxheat2flrig] Setting VFO frequency to', qrg, 'Hz');
    const result = await xmlRpcCall(uri, 'main.set_frequency', ['<double>' + Number(qrg) + '</double>']);
    if (!result.ok) {
        console.warn('[dxheat2flrig] setVfo failed for', uri, result.error);
    }
    return result;
}

async function setMode(uri, mode) {
    console.log('[dxheat2flrig] Setting mode to', mode);
    const result = await xmlRpcCall(uri, 'rig.set_modeA', [xmlEscape(mode)]);
    if (!result.ok) {
        console.warn('[dxheat2flrig] setMode failed for', uri, result.error);
    }
    return result;
}

async function setBandwidth(uri, bw) {
    if (!bw || bw === '0' || bw === '') return { ok: true, value: '' };
    console.log('[dxheat2flrig] Setting bandwidth to', bw, 'Hz');
    const result = await xmlRpcCall(uri, 'rig.set_bwA', ['<i4>' + parseInt(bw, 10) + '</i4>']);
    if (!result.ok) {
        console.warn('[dxheat2flrig] setBandwidth failed for', uri, result.error);
    }
    return result;
}

async function getVersion(uri) {
    return await xmlRpcCall(uri, 'main.get_version', []);
}

async function getFrequency(uri) {
    return await xmlRpcCall(uri, 'main.get_frequency', []);
}

async function getMode(uri) {
    return await xmlRpcCall(uri, 'rig.get_modeA', []);
}

/**
 * Update the toolbar badge to reflect FLRig connection status.
 */
async function updateBadge(uri) {
    console.log('[dxheat2flrig] Checking FLRig reachability at', uri);
    const result = await getVersion(uri);
    if (result.ok) {
        console.log('[dxheat2flrig] FLRig is reachable. Version:', result.value);
        chrome.action.setBadgeText({ text: 'OK' });
        chrome.action.setBadgeBackgroundColor({ color: '#33aa33' });
    } else {
        console.warn('[dxheat2flrig] FLRig is NOT reachable at', uri, '-', result.error);
        chrome.action.setBadgeText({ text: '!' });
        chrome.action.setBadgeBackgroundColor({ color: '#cc3333' });
    }
    return result;
}

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'setVfo') {
        (async () => {
            const opts = await getOptions();
            const uri = opts['flrig-uri'];
            let mode = request.mode;
            let bw = '';

            console.log('[dxheat2flrig] Received setVfo request: freq=', request.qrg, 'mode=', request.mode);

            if (mode === 'CW') {
                mode = opts['cw-mode'];
                bw = opts['cw-bw'];
            } else if (mode === 'DIGITAL') {
                mode = opts['digi-mode'];
                bw = opts['digi-bw'];
            } else if (mode === 'SSB' || mode === 'PHONE') {
                mode = opts['ssb-mode'];
                bw = opts['ssb-bw'];
            }

            console.log('[dxheat2flrig] Resolved mode:', mode, 'bandwidth:', bw);

            await setMode(uri, mode);
            if (bw) {
                await setBandwidth(uri, bw);
            }
            await setVfo(uri, request.qrg);
            await updateBadge(uri);

            console.log('[dxheat2flrig] setVfo sequence complete');
        })();
        return true;
    }

    if (request.message === 'testConnection') {
        (async () => {
            console.log('[dxheat2flrig] Test connection requested');
            const opts = await getOptions();
            const uri = opts['flrig-uri'];
            const result = await updateBadge(uri);
            sendResponse(result);
        })();
        return true;
    }

    if (request.message === 'getStatus') {
        (async () => {
            console.log('[dxheat2flrig] getStatus requested');
            const opts = await getOptions();
            const uri = opts['flrig-uri'];
            const [ver, freq, mode] = await Promise.all([
                getVersion(uri),
                getFrequency(uri),
                getMode(uri)
            ]);
            const status = {
                connected: ver.ok,
                version: ver.ok ? ver.value : ver.error,
                frequency: freq.ok ? freq.value : '',
                mode: mode.ok ? mode.value : ''
            };
            console.log('[dxheat2flrig] Status:', status);
            sendResponse(status);
        })();
        return true;
    }
});

// Check connection status on service worker startup
(async () => {
    console.log('[dxheat2flrig] Service worker starting, checking FLRig connection...');
    const opts = await getOptions();
    await updateBadge(opts['flrig-uri']);
})();
