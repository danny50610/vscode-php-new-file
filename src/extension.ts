import * as vscode from 'vscode';
import { join } from 'path';
import { Position, Uri, WorkspaceEdit, window, workspace } from 'vscode';

// https://github.com/sveltejs/language-tools/blob/master/packages/svelte-vscode/src/sveltekit/generateFiles/index.ts


export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('vscode-php-new-file.create-php-file', async (uri: Uri) => {
		// TODO: window.withProgress

		const itemPath = await window.showInputBox({
			prompt: 'Enter the path of the resources, relative to current folder',
			value: '/'
		});

		if (itemPath === undefined) {
			return; // TODO
		}

		const edit = new WorkspaceEdit();
		const filepath = join(uri.fsPath, itemPath);

		const newFileUri = Uri.file(filepath);
        edit.createFile(newFileUri, {
            overwrite: false,
            ignoreIfExists: true
        });

		edit.insert(newFileUri, new Position(0, 0), '<?php'); // TODO: end new line

		await workspace.applyEdit(edit);

		// save documents and open the first
		await Promise.all(
			edit.entries().map(async ([uri], i) => {
				const doc = workspace.textDocuments.find((t) => t.uri.path === uri.path);
				if (doc) {
					await doc?.save();
					if (i === 0) {
						await workspace.openTextDocument(uri);
						await window.showTextDocument(doc);
					}
				}
			})
		);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
