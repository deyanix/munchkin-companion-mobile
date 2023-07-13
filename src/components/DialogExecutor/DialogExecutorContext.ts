import { createContext, useContext } from 'react';
import * as React from 'react';

export type DialogCallback = () => void;

export interface DialogProps {
	visible: boolean;
	onOk?: () => void;
	onDismiss?: () => void;
	onCancel?: () => void;
}

export interface DialogExecution {
	onOk: (cb: DialogCallback) => DialogExecution;
	onDismiss: (cb: DialogCallback) => DialogExecution;
	onCancel: (cb: DialogCallback) => DialogExecution;
}

export interface DialogExecutorContextType {
	create<P extends DialogProps>(element: React.FC<P>, props?: P): DialogExecution;
}

export const DialogExecutorContext = createContext<DialogExecutorContextType>({
	create: () => {
		throw new Error('Not initialized context.');
	},
});

export const useDialogExecutor = () => useContext(DialogExecutorContext);
