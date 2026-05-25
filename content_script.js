document.addEventListener('click', function (event) {
    if (!event.target.matches('.frequency')) return;
    event.preventDefault();

    const row = event.target.closest('tr');
    if (!row) {
        console.warn('[dxheat2flrig] could not find row for clicked frequency');
        return;
    }

    const rawQrg = event.target.innerText.replace(/[\s|,]/g, '');
    const qrg = parseFloat(rawQrg) * 100;
    if (!isFinite(qrg)) {
        console.warn('[dxheat2flrig] could not parse frequency:', event.target.innerText);
        return;
    }

    const mode = row.querySelector('.mode.hidden')?.innerText ?? '';
    const band = row.querySelector('.band.hidden')?.innerText ?? '';

    console.log("Frequency: ", qrg, " (", band, "m), Mode: ", mode);
    chrome.runtime.sendMessage({"message": "setVfo", "qrg": qrg, "mode": mode, "band": band});
}, false);
