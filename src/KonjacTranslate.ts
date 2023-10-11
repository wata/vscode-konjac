import type { ITranslate, ITranslateOptions } from "comment-translate-manager";
import { konjacFetch } from "./konjacFetch";
import * as vscode from 'vscode';

/** konjac for comment-translate-manager */
export class KonjacTranslate implements ITranslate{
  maxLen: number = 3000;
  translate(content: string, options: ITranslateOptions): Promise<string> {
    const apiUrl = vscode.workspace.getConfiguration('konjac')['apiUrl'];
    if (!apiUrl) {
      return Promise.reject(new Error('Go to user settings and edit "konjac.apiUrl".'));
    }
    return konjacFetch({
      apiUrl: apiUrl,
      text: content,
      target: options.to,
      source: options.from,
    });
  }
  link(content: string, { to='auto',from='auto' }: ITranslateOptions): string {
    const text = encodeURIComponent(content).replace(/[()]/g, (char) => `%${char.charCodeAt(0).toString(16)}`);
    return `[Konjac](https://translate.google.com/?op=translate&sl=${from}&tl=${to}&text=${text})`;
  }
  isSupported(): boolean {
    return true;
  }
};
