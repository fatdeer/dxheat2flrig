# dxheat2flrig

A Chrome/Chromium extension that lets you click a frequency on [dxheat.com](https://dxheat.com) and instantly tune your radio via [FLRig](http://www.w1hkj.com/flrig-help/).

Also available as a Firefox extension — check the [Releases](../../releases) page.

## How it works

1. The extension adds a click handler to frequency cells on dxheat.com.
2. When you click a frequency, it sends an XML-RPC command to your local FLRig instance to:
   - Set the operating mode (CW, SSB, Digital — configurable)
   - Set the VFO frequency

## Prerequisites

- A transceiver connected to FLRig
- FLRig running with XML-RPC enabled (default port: **12345**)
- Chrome or Chromium (v102+ for Manifest V3 support)

## Installation

1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the upper right).
4. Click **Load unpacked** and select this folder.
5. Click the extension's **Options** (or right-click the toolbar icon > Options) to configure:
   - **FLRig URI** — default `http://127.0.0.1:12345/`
   - **CW Mode** — sent for CW spots (default: `CW-L`)
   - **SSB Mode** — sent for SSB/Phone spots (default: `USB`)
   - **Digital Mode** — sent for digital spots (default: `DATA-U`)

## Upgrading

Remove the old version from `chrome://extensions/` and load the new one.

## Troubleshooting

- Open the service worker console (Extensions page > Details > "Inspect views: service worker") to see error messages.
- Make sure FLRig's XML-RPC server is listening and accessible from `127.0.0.1` (or whichever address you configured).
- If you use a non-loopback address (e.g. `192.168.x.x`), you'll need to add it to the extension's `host_permissions` in `manifest.json` and reload.

## License

No explicit license. Originally by DJ7NT (Joerg). Use at your own risk.
