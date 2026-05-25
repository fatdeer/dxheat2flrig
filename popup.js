function formatFrequency(hz) {
    const num = parseFloat(hz);
    if (!isFinite(num) || num === 0) return '--';
    const khz = num / 1000;
    if (khz >= 1000) {
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
            statusEl.textContent = '已连接';
            statusEl.className = 'value connected';
            document.getElementById('version').textContent = response.version || '--';
            document.getElementById('frequency').textContent = formatFrequency(response.frequency);
            document.getElementById('mode').textContent = response.mode || '--';
        } else {
            statusEl.textContent = '未连接';
            statusEl.className = 'value disconnected';
            document.getElementById('version').textContent = response ? response.version : '无响应';
            document.getElementById('frequency').textContent = '--';
            document.getElementById('mode').textContent = '--';
        }
    });

    document.getElementById('options-link').addEventListener('click', (e) => {
        e.preventDefault();
        chrome.runtime.openOptionsPage();
    });
});
