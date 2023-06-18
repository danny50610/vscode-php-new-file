// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { join } from 'path';
import { Position, Uri, WorkspaceEdit, window, workspace } from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-php-new-file" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
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

// This method is called when your extension is deactivated
export function deactivate() {}
