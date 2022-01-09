// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TreeNode, LogSetExplorer, LogSetsModel, LogSet, LogSource } from './logsets';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let model = new LogSetsModel();
	let explorer = new LogSetExplorer(model);
	let disposables = [];
	disposables.push(vscode.window.registerTreeDataProvider("logsets", explorer));
	disposables.push(vscode.commands.registerCommand("logsets.refresh", explorer.refresh, explorer));
	disposables.push(vscode.commands.registerCommand("logsets.add-logset", () => {
		vscode.window.showInputBox().then(
			(val?: string) => {
				if (val) { 
					model.addEmptyLogSet(val);
					explorer.refresh();
				}
			}
		);
	}));
	disposables.push(vscode.commands.registerCommand("logset.del-logset", (node: LogSet) => {
		node.dispose();
	}));
	disposables.push(vscode.commands.registerCommand("logset.open-doc", (node: LogSet) => {
		node.openDoc();
	}));
	disposables.push(vscode.commands.registerCommand("logset.add-logsource", (node: LogSet) => {
		vscode.window.showOpenDialog({
			canSelectMany: false,
			canSelectFolders: false,
			canSelectFiles: true,
		}).then(
			(uris?: vscode.Uri[]) => {
				if (uris) { 
					node.openLogSource(uris[0]);
					explorer.refresh();
				}
			}
		);
	}));
	disposables.push(vscode.commands.registerCommand("logsource.del-logsource", (node: LogSource) => {
		node.dispose();
	}));

	context.subscriptions.push(...disposables);
}

// this method is called when your extension is deactivated
export function deactivate() { }