# homemind Chat â€“ VS Code Extension

Embed the homemind chatbot directly into your VS Code editor and get instant property insights without ever leaving your workspace!

## Features

- **Oneâ€‘click access** to your homemind chatbot via the Command Palette.
- **Persistent Webview panel** with retained context when hidden or reopened.
- **Sandboxed iframe** for secure, CSPâ€‘compliant loading of `https://homemind.vercel.app/chat`.
- **Customizable Webview options** (scripts enabled, context retention).
- **Zero backend code** in the extension â€” all logic lives in the homemind app itself.

## VS Code Marketplace

Don't want to build it yourself? Search for "homemind Chat" in the [VS Code Marketplace](https://marketplace.visualstudio.com/vscode) and install it directly!

**Here is the link to it, directly: [homemind Chat Extension](https://marketplace.visualstudio.com/items?itemName=sergiosediq.homemind-chat).**

## Launch with VS Code

We also provide a `.vscode/launch.json` configuration to easily run and debug the extension in a new Extension Development Host instance. This allows you to test changes live without needing to repackage every time.

To use it:

1. Open the extension folder in VS Code.
2. Press `F5` to launch the Extension Development Host. Alternatively, open the **Run and Debug** sidebar and select the "Run Extension" configuration.
3. In the new host, open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P) and run **homemind Chat: Open Chat**.
4. The homemind chatbot will load in a side panel, ready for your queries.
5. You can keep the panel open permanently or hide it; your chat context will be preserved.

This setup allows you to develop and test the extension interactively, making it easy to iterate on features and fixes.

## Prerequisites

- **VS Code** v1.50.0 or later  
- **Node.js** & **npm**  
- **vsce** packaging tool (install with `npm install â€‘g vsce`)

## VSIX Installation

1. **Clone this repo** and navigate into the extension folder:
  ```bash
   git clone https://github.com/SergioSediq/homemind.git
   cd homemind/extension
  ```

2. **Install dependencies**:

  ```bash
  npm install
  ```

3. **Compile** the TypeScript sources:

  ```bash
  npm run compile
  ```

4. **Package** as a VSIX:

  ```bash
  vsce package
  ```

   This generates `homemind-chat-0.0.1.vsix`.

5. **Install the VSIX**:

   * **CLI**:

     ```bash
     code --install-extension homemind-chat-0.0.1.vsix
     ```
   * **VS Code UI**:
     Open the Extensions view â†’ click the â€œ...â€ menu â†’ **Install from VSIX** â†’ select the generated `.vsix` file.

## Usage

1. Open the **Command Palette** (Ctrl+Shift+P / Cmd+Shift+P).
2. Type and run **homemind Chat: Open Chat**.
3. The homemind chatbot will load in a side panel.
4. Start typing your queriesâ€”everything runs through the hosted app at `https://homemind.vercel.app/chat`.

> **Tip:** You can keep the panel open permanently or hide it; your chat context will be preserved.

## Development

* **Watch mode**

  ```bash
  npm run watch
  ```

  Recompiles on file changes.

* **Debug in VS Code**

  1. Press F5 to launch a new Extension Development Host.
  2. In that host, open the Command Palette and run your command.

* **Reâ€‘package**

  ```bash
  npm run package
  ```

## Extension Settings

Open **Settings** â†’ **Extensions** â†’ **homemind Chat** to configure:

| Setting                       | Type     | Default       | Description                                                      |
|-------------------------------|----------|---------------|------------------------------------------------------------------|
| `homemindChat.panelTitle`   | string   | `homemind Chat`   | Title of the chat panel.                             |
| `homemindChat.viewColumn`   | number   | `1`           | Which editor column to open the panel in (0=Active, 1â€“3).        |
| `homemindChat.retainContext`| boolean  | `true`        | Keep chat context alive when the panel is hidden.               |
| `homemindChat.enableScripts`| boolean  | `true`        | Allow scripts to run inside the Webview.                       |
| `homemindChat.iframeWidth`  | string   | `100%`        | CSS width of the embedded chat iframe (e.g. `80%` or `600px`).  |
| `homemindChat.iframeHeight` | string   | `100%`        | CSS height of the embedded chat iframe (e.g. `80%` or `500px`). |
| `homemindChat.openOnStartup`| boolean  | `false`       | Open the chat panel automatically when VS Code starts.          |

## Troubleshooting

* **Blank panel**: ensure youâ€™re online and that `https://homemind.vercel.app/chat` is reachable.
* **CSP errors**: check that the URL in `getWebviewContent()` matches exactly the iframe `src` and the CSP frameâ€‘src directive.

## License

This extension is MITâ€‘licensed. See [LICENSE](../LICENSE) for details.

---

## About homemind

homemind is a fullâ€‘stack AI/ML chatbot and data analytics platform for Chapel Hill real estate. To learn more about the underlying appâ€”its architecture, AI techniques (RAG, Mixtureâ€‘ofâ€‘Experts, etc.), data analytics pipelines, and deploymentâ€”visit the main repo:

ðŸ‘‰ [SergioSediq/homemind](https://github.com/SergioSediq/homemind)
