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
        showAlert('status', 'alert-success', '设置已保存');
    });
}

function testConnection() {
    const testEl = document.getElementById('test-status');
    testEl.className = 'alert alert-info show';
    testEl.textContent = '正在测试连接...';

    chrome.runtime.sendMessage({ message: 'testConnection' }, (response) => {
        if (response && response.ok) {
            testEl.className = 'alert alert-success show';
            testEl.textContent = '连接成功！FLRig 版本: ' + (response.value || '未知');
        } else {
            testEl.className = 'alert alert-error show';
            testEl.textContent = '连接失败: ' + (response ? response.error : '扩展无响应，请检查 Service Worker 是否正常运行。');
        }
        setTimeout(() => {
            testEl.classList.remove('show');
        }, 5000);
    });
}

function showAlert(id, cssClass, text) {
    const el = document.getElementById(id);
    el.className = 'alert ' + cssClass + ' show';
    el.textContent = text;
    setTimeout(() => {
        el.classList.remove('show');
    }, 2000);
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
