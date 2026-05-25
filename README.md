# dxheat2flrig

A Chrome/Chromium extension that lets you click a frequency on [dxheat.com](https://dxheat.com) and instantly tune your radio via [FLRig](http://www.w1hkj.com/flrig-help/).

Also available as a Firefox extension -- check the [Releases](../../releases) page.

## Features

- **One-click tuning** -- Click any frequency on dxheat.com to set your VFO
- **Automatic mode switching** -- CW, SSB/Phone, and Digital modes are mapped to your preferred FLRig mode names
- **Bandwidth control** -- Automatically sets filter bandwidth per mode (configurable, or set to 0 to skip)
- **Connection status** -- Toolbar badge shows green "OK" when FLRig is reachable, red "!" when not
- **Status popup** -- Click the toolbar icon to see current frequency, mode, and FLRig version
- **Test connection** -- Verify your setup from the Options page without leaving Chrome
- **Console logging** -- All XML-RPC calls and responses are logged to the browser console for debugging

## How it works

1. The extension injects a click handler on frequency cells at dxheat.com.
2. When you click a frequency, it sends XML-RPC commands to your local FLRig instance:
   - `rig.set_modeA` -- sets the operating mode
   - `rig.set_bwA` -- sets the filter bandwidth (if configured)
   - `main.set_frequency` -- tunes the VFO
3. The popup reads back `main.get_frequency`, `rig.get_modeA`, and `main.get_version` for status display.

## Prerequisites

- A transceiver controlled by FLRig
- FLRig running with XML-RPC enabled (default port: **12345**)
- Chrome or Chromium (v102+ for Manifest V3 support)

## Installation

1. Download or clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the upper right).
4. Click **Load unpacked** and select this folder.
5. Click the extension's **Options** (or right-click the toolbar icon > Options) to configure.

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| FLRig URI | `http://127.0.0.1:12345/` | XML-RPC endpoint of your FLRig instance |
| CW Mode | `CW-L` | Mode name sent for CW spots |
| CW Bandwidth | `500` | Filter bandwidth in Hz for CW (0 = don't change) |
| SSB Mode | `USB` | Mode name sent for SSB/Phone spots |
| SSB Bandwidth | `2400` | Filter bandwidth in Hz for SSB (0 = don't change) |
| Digital Mode | `DATA-U` | Mode name sent for Digital spots |
| Digital Bandwidth | `3000` | Filter bandwidth in Hz for Digital (0 = don't change) |

## Upgrading

Remove the old version from `chrome://extensions/` and load the new one.

## Troubleshooting

- **Red "!" badge**: FLRig is not reachable. Check that FLRig is running and the URI in Options is correct.
- **Service worker console**: Go to Extensions page > Details > "Inspect views: service worker" to see detailed log messages for every XML-RPC call and response.
- **Non-loopback address**: If FLRig runs on another machine (e.g. `192.168.x.x`), add that address pattern to `host_permissions` in `manifest.json` and reload the extension.
- **Test Connection**: Use the button in Options to verify connectivity before going to dxheat.

## FLRig XML-RPC Methods Used

| Method | Purpose |
|--------|---------|
| `main.set_frequency` | Set VFO frequency (Hz) |
| `main.get_frequency` | Read current VFO frequency |
| `main.get_version` | Check FLRig connectivity and version |
| `rig.set_modeA` | Set operating mode on VFO A |
| `rig.get_modeA` | Read current mode |
| `rig.set_bwA` | Set filter bandwidth on VFO A |

## License

No explicit license. Originally by DJ7NT (Joerg). Use at your own risk.
