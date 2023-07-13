import { PropsWithChildren, useCallback, useState } from 'react';
import { DialogCallback, DialogExecution, DialogExecutorContext, DialogProps } from './DialogExecutorContext';
import { Portal, Text } from 'react-native-paper';
import * as React from 'react';

export interface DialogExecutorItem<P extends DialogProps> {
	element: React.FC<P>;
	props?: P;
	execution: DialogInternalExecution;
}

export interface DialogInternalExecution {
	ok?: DialogCallback;
	cancel?: DialogCallback;
	dismiss?: DialogCallback;
}

export const DialogExecutorProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [dialogs, setDialogs] = useState<DialogExecutorItem<any>[]>([]);

	const create = useCallback(function <P extends DialogProps> (element: React.FC<P>, props?: P): DialogExecution {
		const internalExecution: DialogInternalExecution = {};

		const execution: DialogExecution = {
			onOk: cb => {
				internalExecution.ok = cb;
				return execution;
			},
			onCancel: cb => {
				internalExecution.cancel = cb;
				return execution;
			},
			onDismiss: cb => {
				internalExecution.dismiss = cb;
				return execution;
			},
		};

		setDialogs(previous => ([
			...previous,
			{
				element,
				props,
				execution: internalExecution,
			},
		]));
		return execution;
	}, []);

	return (
		<DialogExecutorContext.Provider value={{create}}>
			<Portal>
				{dialogs
					.map((d, index) =>
						<d.element
							{...d.props}
							visible={true}
							key={index}
							onOk={d.execution.ok}
							onDismiss={d.execution.dismiss}
							onCancel={d.execution.cancel}
						/>
					)
				}
			</Portal>
			{children}
		</DialogExecutorContext.Provider>
	);
}
