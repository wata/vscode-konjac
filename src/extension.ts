'use strict';

import * as vscode from 'vscode';
import type { ITranslateRegistry } from 'comment-translate-manager';
import { KonjacTranslate } from './KonjacTranslate';
import { konjacFetch } from './konjacFetch';

export function activate(context: vscode.ExtensionContext) {
    const konjac = new Konjac();
    context.subscriptions.push(konjac);
    context.subscriptions.push(vscode.commands.registerCommand('konjac.translate', () => konjac.translate()));
    context.subscriptions.push(vscode.commands.registerCommand('konjac.replace', () => konjac.replace()));
    context.subscriptions.push(vscode.commands.registerCommand('konjac.setclipboard', () => konjac.setclipboard()));
    context.subscriptions.push(vscode.commands.registerCommand('konjac.configure', () => konjac.configure()));
    return {
        //Expose the plug-in for comment-translate-manager
        extendTranslate: (registry: ITranslateRegistry) => {
            registry('konjac', KonjacTranslate);
        }
    };
}

class Konjac {

    private statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);

    // https://cloud.google.com/translate/docs/languages
    private supportedLanguageItems: vscode.QuickPickItem[] = [
        { label: 'Afrikaans', description: 'af' },
        { label: 'Albanian', description: 'sq' },
        { label: 'Amharic', description: 'am' },
        { label: 'Arabic', description: 'ar' },
        { label: 'Armenian', description: 'hy' },
        { label: 'Azeerbaijani', description: 'az' },
        { label: 'Basque', description: 'eu' },
        { label: 'Belarusian', description: 'be' },
        { label: 'Bengali', description: 'bn' },
        { label: 'Bosnian', description: 'bs' },
        { label: 'Bulgarian', description: 'bg' },
        { label: 'Catalan', description: 'ca' },
        { label: 'Cebuano', description: 'ceb' },
        { label: 'Chinese (Simplified)', description: 'zh-CN' },
        { label: 'Chinese (Traditional)', description: 'zh-TW' },
        { label: 'Corsican', description: 'co' },
        { label: 'Croatian', description: 'hr' },
        { label: 'Czech', description: 'cs' },
        { label: 'Danish', description: 'da' },
        { label: 'Dutch', description: 'nl' },
        { label: 'English', description: 'en' },
        { label: 'Esperanto', description: 'eo' },
        { label: 'Estonian', description: 'et' },
        { label: 'Finnish', description: 'fi' },
        { label: 'French', description: 'fr' },
        { label: 'Frisian', description: 'fy' },
        { label: 'Galician', description: 'gl' },
        { label: 'Georgian', description: 'ka' },
        { label: 'German', description: 'de' },
        { label: 'Greek', description: 'el' },
        { label: 'Gujarati', description: 'gu' },
        { label: 'Haitian Creole', description: 'ht' },
        { label: 'Hausa', description: 'ha' },
        { label: 'Hawaiian', description: 'haw' },
        { label: 'Hebrew', description: 'iw' },
        { label: 'Hindi', description: 'hi' },
        { label: 'Hmong', description: 'hmn' },
        { label: 'Hungarian', description: 'hu' },
        { label: 'Icelandic', description: 'is' },
        { label: 'Igbo', description: 'ig' },
        { label: 'Indonesian', description: 'id' },
        { label: 'Irish', description: 'ga' },
        { label: 'Italian', description: 'it' },
        { label: 'Japanese', description: 'ja' },
        { label: 'Javanese', description: 'jw' },
        { label: 'Kannada', description: 'kn' },
        { label: 'Kazakh', description: 'kk' },
        { label: 'Khmer', description: 'km' },
        { label: 'Korean', description: 'ko' },
        { label: 'Kurdish', description: 'ku' },
        { label: 'Kyrgyz', description: 'ky' },
        { label: 'Lao', description: 'lo' },
        { label: 'Latin', description: 'la' },
        { label: 'Latvian', description: 'lv' },
        { label: 'Lithuanian', description: 'lt' },
        { label: 'Luxembourgish', description: 'lb' },
        { label: 'Macedonian', description: 'mk' },
        { label: 'Malagasy', description: 'mg' },
        { label: 'Malay', description: 'ms' },
        { label: 'Malayalam', description: 'ml' },
        { label: 'Maltese', description: 'mt' },
        { label: 'Maori', description: 'mi' },
        { label: 'Marathi', description: 'mr' },
        { label: 'Mongolian', description: 'mn' },
        { label: 'Myanmar (Burmese)', description: 'my' },
        { label: 'Nepali', description: 'ne' },
        { label: 'Norwegian', description: 'no' },
        { label: 'Nyanja (Chichewa)', description: 'ny' },
        { label: 'Pashto', description: 'ps' },
        { label: 'Persian', description: 'fa' },
        { label: 'Polish', description: 'pl' },
        { label: 'Portuguese (Portugal, Brazil)', description: 'pt' },
        { label: 'Punjabi', description: 'pa' },
        { label: 'Romanian', description: 'ro' },
        { label: 'Russian', description: 'ru' },
        { label: 'Samoan', description: 'sm' },
        { label: 'Scots Gaelic', description: 'gd' },
        { label: 'Serbian', description: 'sr' },
        { label: 'Sesotho', description: 'st' },
        { label: 'Shona', description: 'sn' },
        { label: 'Sindhi', description: 'sd' },
        { label: 'Sinhala (Sinhalese)', description: 'si' },
        { label: 'Slovak', description: 'sk' },
        { label: 'Slovenian', description: 'sl' },
        { label: 'Somali', description: 'so' },
        { label: 'Spanish', description: 'es' },
        { label: 'Sundanese', description: 'su' },
        { label: 'Swahili', description: 'sw' },
        { label: 'Swedish', description: 'sv' },
        { label: 'Tagalog (Filipino)', description: 'tl' },
        { label: 'Tajik', description: 'tg' },
        { label: 'Tamil', description: 'ta' },
        { label: 'Telugu', description: 'te' },
        { label: 'Thai', description: 'th' },
        { label: 'Turkish', description: 'tr' },
        { label: 'Ukrainian', description: 'uk' },
        { label: 'Urdu', description: 'ur' },
        { label: 'Uzbek', description: 'uz' },
        { label: 'Vietnamese', description: 'vi' },
        { label: 'Welsh', description: 'cy' },
        { label: 'Xhosa', description: 'xh' },
        { label: 'Yiddish', description: 'yi' },
        { label: 'Yoruba', description: 'yo' },
        { label: 'Zulu', description: 'zu' },
    ];

    constructor() {
        this.updateStatus();
    }

    public configure() {
        vscode.window.showQuickPick(this.supportedLanguageItems, {
            placeHolder: 'Select the language to use for translation.',
            matchOnDescription: true
        }).then((pickedItem) => {
            if (!pickedItem) { return; }
            return vscode.workspace.getConfiguration().update('konjac.target', pickedItem.description, vscode.ConfigurationTarget.Global);
        }).then(() => {
            this.updateStatus();
        });
    }

    public translate() {
        const text = this.getSelectedText();
        if (!text) { return; }

        vscode.window.setStatusBarMessage('$(clock) Translating...', this.fetch(text).then((result: string) => {
            vscode.window.showInformationMessage(result);
        }).catch((error: Error) => {
			vscode.window.showErrorMessage(error.message);
        }));
    }

    public replace() {
        const text = this.getSelectedText();
        if (!text) { return; }
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        const selection = editor.selection;

        vscode.window.setStatusBarMessage('$(clock) Translating...', this.fetch(text).then((result: string) => {
            editor.edit(editBuilder => {
                editBuilder.replace(selection, result);
            });
        }).catch((error: Error) => {
			vscode.window.showErrorMessage(error.message);
        }));
    }

    public setclipboard() {
        const text = this.getSelectedText();
        if (!text) { return; }

        vscode.window.setStatusBarMessage('$(clock) Translating...', this.fetch(text).then( async (result: string) => {
            await vscode.env.clipboard.writeText(result);
        }).catch((error: Error) => {
			vscode.window.showErrorMessage(error.message);
        }));
    }

    private updateStatus() {
        const target = vscode.workspace.getConfiguration('konjac')['target'];
        this.statusBarItem.text = `$(globe) Konjac: ${target}`;
        this.statusBarItem.tooltip = 'Select Target Language';
        this.statusBarItem.command = 'konjac.configure';
        this.statusBarItem.show();
    }

    private getSelectedText(): string {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return ''; }
        return editor.document.getText(editor.selection).trim();
    }

    private fetch(text: string): Promise<string> {
        const apiUrl = vscode.workspace.getConfiguration('konjac')['apiUrl'];
        if (!apiUrl) {
			return Promise.reject(new Error('Go to user settings and edit "konjac.apiUrl".'));
        }
        const target = vscode.workspace.getConfiguration('konjac')['target'];
        if (!target) {
			return Promise.reject(new Error('Go to user settings and edit "konjac.target".'));
        }
        return konjacFetch({
            apiUrl,
            text,
            target,
        });
    }

    dispose() {
        this.statusBarItem.dispose();
    }
}
