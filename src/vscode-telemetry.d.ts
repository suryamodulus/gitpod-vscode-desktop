/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Gitpod. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

declare module 'vscode' {

    export interface TelemetryOptions {
        gitpodHost?: string;
        gitpodVersion?: string;

        workspaceId?: string;
        instanceId?: string;

        userId?: string

        [prop: string]: any
    }

    export interface FlowTelemetryOptions extends TelemetryOptions {
        flow: string
    }

    export interface FlowStatusTelemetryOptions extends FlowTelemetryOptions {
        status: string
    }

    export interface MessageOptions extends FlowStatusTelemetryOptions {
    }

}
