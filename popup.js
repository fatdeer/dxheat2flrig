function formatFrequency(hz) {
    const num = parseFloat(hz);
    if (!isFinite(num) || num === 0) return '---';
    // FLRig returns frequency in Hz, display as kHz with decimals
    const khz = num / 1000;
    if (khz >= 1000) {
        // Display as MHz for VHF+
        return (khz / 1000).toFixed(4) + ' MHz';
    }
    return khz.toFixed(2) + ' kHz';
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ message: 'getStatus' }, (response) => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('info').style.display = 'block';

        const statusEl = document.getElementById('conn-status');
        if (response && response.connected) {
            statusEl.textContent = 'Connected';
            statusEl.className = 'value connected';
            document.getElementById('version').textContent = response.version || '---';
            document.getElementById('frequency').textContent = formatFrequency(response.frequency);
            document.getElementById('mode').textContent = response.mode || '---';
        } else {
            statusEl.textContent = 'Disconnected';
            statusEl.className = 'value disconnected';
            document.getElementById('version').textContent = response ? response.version : 'No response';
            document.getElementById('frequency').textContent = '---';
            document.getElementById('mode').textContent = '---';
        }
    });

    document.getElementById('options-link').addEventListener('click', (e) => {
        e.preventDefault();
        chrome.runtime.openOptionsPage();
    });
});
