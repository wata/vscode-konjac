<p align="center"><img src="https://raw.githubusercontent.com/wata/vscode-konjac/master/icon.png" width="128"></p>
<h1 align="center">vscode-konjac</h1>
<h2 align="center">VSCode extension for Google Translate.</h2>
<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=wata.konjac"><img src="https://vsmarketplacebadge.apphb.com/version/wata.konjac.svg" alt="Current Version"></a>
<a href="https://marketplace.visualstudio.com/items?itemName=wata.konjac"><img src="https://vsmarketplacebadge.apphb.com/installs/wata.konjac.svg" alt="Install Count"></a>
<a href="https://marketplace.visualstudio.com/items?itemName=wata.konjac"><img src="https://vsmarketplacebadge.apphb.com/rating/wata.konjac.svg" alt="Open Issues"></a>
</p>

Google Cloud Translation API is a paid service. However, this extension is free because it uses [Google Apps Script](https://medium.com/@nagasawa/google-apps-script-%E3%81%A7%E4%BD%9C%E3%81%A3%E3%81%9F%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88%E3%82%92-apps-script-api-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E9%85%8D%E5%B8%83%E3%81%99%E3%82%8B-aa6daf6ae642).

## ⚠️ Requirements

This extension requires konjac-api.

You can install it from [**here**](https://wata.github.io/konjac-farm/).

## Features

- Translate This

![feature translate](images/feature-translate.gif)

- Translate This and Replace

![feature replace](images/feature-replace.gif)

- Translate This and Set clipboard

- Select the language to use for translation

![feature configure](images/feature-configure.gif)

- This extension also functions as a translation source for the [Comment Translate extension](https://marketplace.visualstudio.com/items?itemName=intellsmi.comment-translate) .

## Extension Settings

This extension contributes the following settings:

- `konjac.apiUrl`: your konjac-api url
- `konjac.target`: default target language

## Release Notes

### 0.3.0

- add setclipbord function [#9](https://github.com/wata/vscode-konjac/pull/9) - Thanks [@ShortArrow](https://github.com/ShortArrow)

### 0.2.4

- replace original position if the cursor moves during translation [#1](https://github.com/wata/vscode-konjac/pull/1) - Thanks [@nazoking](https://github.com/nazoking)

### 0.2.3

- Add command "Translate This and Replace"
- Add command "Select Target Language"
- Add commands to the editor context menu

### 0.1.0

Initial release!
