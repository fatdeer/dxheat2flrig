# DXHeat 一键调频 (dxheat2flrig)

在 [DXHeat.com](https://dxheat.com) 上点击频率，一键通过 [FLRig](http://www.w1hkj.com/flrig-help/) 控制电台调谐。

同时提供 Firefox 版本，请查看 [Releases](../../releases) 页面。

## 功能特性

- **一键调谐** - 点击 DXHeat 上任意频率，自动设置电台 VFO
- **自动切换模式** - CW / SSB / Digital 模式自动映射为你配置的 FLRig 模式名称
- **带宽控制** - 调谐时自动设置滤波器带宽（可配置，设为 0 跳过）
- **连接状态指示** - 工具栏图标显示绿色 "OK"（已连接）或红色 "!"（未连接）
- **状态弹窗** - 点击工具栏图标查看当前频率、模式和 FLRig 版本
- **测试连接** - 在设置页面验证 FLRig 是否可达
- **调试日志** - 所有 XML-RPC 通信过程都输出到浏览器控制台

## 工作原理

1. 扩展在 DXHeat.com 的频率单元格上注入点击事件监听器
2. 点击频率后，依次向本地 FLRig 发送 XML-RPC 命令：
   - `rig.set_modeA` - 设置工作模式
   - `rig.set_bwA` - 设置滤波器带宽（若已配置）
   - `main.set_frequency` - 设置 VFO 频率
3. 弹窗面板通过 `main.get_frequency`、`rig.get_modeA`、`main.get_version` 回读状态

## 环境要求

- 电台通过 FLRig 控制
- FLRig 已启动并开启 XML-RPC（默认端口 **12345**）
- Chrome 或 Chromium（v102+ 支持 Manifest V3）

## 安装方法

1. 下载或克隆本仓库
2. 打开 Chrome，进入 `chrome://extensions/`
3. 开启右上角的 **开发者模式**
4. 点击 **加载已解压的扩展程序**，选择本文件夹
5. 右键点击工具栏图标 > **选项**，配置 FLRig 连接信息

## 配置说明

| 选项 | 默认值 | 说明 |
|------|--------|------|
| FLRig 地址 | `http://127.0.0.1:12345/` | FLRig 的 XML-RPC 服务端点 |
| CW 模式 | `CW-L` | CW 频点对应的 FLRig 模式名 |
| CW 带宽 | `500` | CW 模式的滤波器带宽 (Hz)，0 = 不设置 |
| SSB 模式 | `USB` | SSB/话音频点对应的 FLRig 模式名 |
| SSB 带宽 | `2400` | SSB 模式的滤波器带宽 (Hz)，0 = 不设置 |
| Digital 模式 | `DATA-U` | 数字模式频点对应的 FLRig 模式名 |
| Digital 带宽 | `3000` | 数字模式的滤波器带宽 (Hz)，0 = 不设置 |

## 升级方法

在 `chrome://extensions/` 中移除旧版本，重新加载新版本即可。

## 故障排查

- **红色 "!" 徽标**：FLRig 不可达。检查 FLRig 是否运行、设置中的地址是否正确。
- **查看日志**：扩展页面 > 详情 > "检查视图: Service Worker"，查看所有 XML-RPC 调用和响应的详细日志。
- **非本机地址**：若 FLRig 运行在其他机器（如 `192.168.x.x`），需在 `manifest.json` 的 `host_permissions` 中添加对应地址，然后重新加载扩展。
- **测试连接**：在设置页面点击"测试连接"按钮验证配置。

## FLRig XML-RPC 接口

| 方法 | 用途 |
|------|------|
| `main.set_frequency` | 设置 VFO 频率 (Hz) |
| `main.get_frequency` | 读取当前 VFO 频率 |
| `main.get_version` | 检查 FLRig 连接和版本 |
| `rig.set_modeA` | 设置 VFO A 工作模式 |
| `rig.get_modeA` | 读取当前模式 |
| `rig.set_bwA` | 设置 VFO A 滤波器带宽 |

---

## English

A Chrome/Chromium extension that lets you click a frequency on [dxheat.com](https://dxheat.com) and instantly tune your radio via [FLRig](http://www.w1hkj.com/flrig-help/).

### Features

- One-click tuning from DXHeat spot list
- Automatic mode switching (CW / SSB / Digital)
- Per-mode filter bandwidth control
- Connection status badge (green OK / red !)
- Status popup showing frequency, mode, FLRig version
- Test Connection button in Options
- Full console logging for debugging

### Installation

1. Clone this repo
2. Go to `chrome://extensions/`, enable Developer mode
3. Click "Load unpacked" and select this folder
4. Configure via Options (right-click toolbar icon > Options)

### Configuration

| Option | Default | Description |
|--------|---------|-------------|
| FLRig URI | `http://127.0.0.1:12345/` | FLRig XML-RPC endpoint |
| CW Mode | `CW-L` | Mode for CW spots |
| CW Bandwidth | `500` | Filter BW in Hz (0 = skip) |
| SSB Mode | `USB` | Mode for SSB/Phone spots |
| SSB Bandwidth | `2400` | Filter BW in Hz (0 = skip) |
| Digital Mode | `DATA-U` | Mode for Digital spots |
| Digital Bandwidth | `3000` | Filter BW in Hz (0 = skip) |

### License

No explicit license. Originally by DJ7NT (Joerg). Use at your own risk.
