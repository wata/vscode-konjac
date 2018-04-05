'use strict';

import * as vscode from 'vscode';

const rp = require('request-promise-native');
const encodeUrl = require('encodeurl');

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('konjac.translate', () => {
        let apiUrl = vscode.workspace.getConfiguration('konjac')['apiUrl'];
        if (!apiUrl) {
			vscode.window.showErrorMessage('Go to user settings and edit "konjac.apiUrl".');
			return;
        }
        let target = vscode.workspace.getConfiguration('konjac')['target'];
        if (!target) {
			vscode.window.showErrorMessage('Go to user settings and edit "konjac.target".');
			return;
        }

        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Must select text to translate');
            return;
        }
        let text = editor.document.getText(editor.selection).trim();
        if (text === '') {
            vscode.window.showErrorMessage('Must select text to translate');
            return;
        }

        vscode.window.setStatusBarMessage('Translating...', rp({
            uri: encodeUrl(apiUrl),
            method: 'POST',
            json: true,
            followAllRedirects: true,
            formData: {
                text: text,
                target: target
            }
        }).then((body: any) => {
            // Google Apps Script always returns 200
            if (!body.data) {
                vscode.window.showErrorMessage(`Error: ${body.message}`);
            }
            vscode.window.showInformationMessage(`${body.data.translatedText}`);
        }).catch((err: Error) => {
            vscode.window.showErrorMessage(`Error: ${err.message}`);
        }));
    });
    context.subscriptions.push(disposable);
}
