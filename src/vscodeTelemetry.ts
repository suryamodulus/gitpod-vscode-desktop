/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Gitpod. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import TelemetryReporter from './telemetryReporter';

/**
 * Intruments telemetry for VS Code Extension API triggering or triggered by user actions.
 */
export function instrumentVSCodeTelemetry(telemetry: TelemetryReporter): void {
	function isMessageOptions(obj: any): obj is vscode.MessageOptions {
		return !!obj && typeof obj === 'object'
			&& 'flow' in obj && typeof obj['flow'] === 'string'
			&& 'status' in obj && typeof obj['status'] === 'string';
	}
	async function showMessage(severity: 'info' | 'warning' | 'error', fn: Function, fnThis: typeof vscode.window, fnArgs: IArguments) {
		if (!isMessageOptions(fnArgs[1])) {
			throw new Error('telemetry: please provide as complete as possible options')
		}
		const startTime = new Date().getTime();
		const flowOptions = { severity, ...fnArgs[1] };
		delete flowOptions['detail'];
		telemetry.sendFlowStatus({ ...flowOptions, status: 'show__' + flowOptions.status });
		let result: vscode.MessageItem | string | undefined;
		try {
			result = await fn.apply(fnThis, fnArgs);
		} finally {
			const duration = new Date().getTime() - startTime;
			let status = 'close';
			let action = undefined;
			if (typeof result === 'string') {
				status = 'select_action';
				action = result;
			} else if (!!result) {
				if (result.isCloseAffordance !== true) {
					status = 'select_action';
				}
				action = result.title;
			}
			telemetry.sendFlowStatus({ ...flowOptions, status: status + '__' + flowOptions.status, action, duration });
		}
		return result;
	}
	const showInformationMessage = vscode.window.showInformationMessage;
	vscode.window.showInformationMessage = function () {
		return showMessage('info', showInformationMessage, this, arguments);
	};
	const showWarningMessage = vscode.window.showWarningMessage;
	vscode.window.showWarningMessage = function () {
		return showMessage('warning', showWarningMessage, this, arguments);
	};
	const showErrorMessage = vscode.window.showErrorMessage;
	vscode.window.showErrorMessage = function () {
		return showMessage('error', showErrorMessage, this, arguments);
	};
}
