import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { DialogCallback, DialogExecution, DialogExecutorContext, DialogProps } from './DialogExecutorContext';
import { Portal } from 'react-native-paper';
import * as React from 'react';

export interface DialogExecutorItem<P extends DialogProps> {
	element: React.FC<P>;
	props?: P;
	execution: DialogInternalExecution;
	visible: boolean;
}

export interface DialogInternalExecution {
	ok: DialogCallback[];
	cancel: DialogCallback[];
	dismiss: DialogCallback[];
}

export const DialogExecutorProvider: React.FC<PropsWithChildren> = ({children}) => {
	const [dialogs, setDialogs] = useState<DialogExecutorItem<any>[]>([]);

	const create = useCallback(function <P extends DialogProps> (element: React.FC<P>, props?: P): DialogExecution {
		const internalExecution: DialogInternalExecution = {
			ok: [],
			cancel: [],
			dismiss: [],
		};

		const hideDialog = () => {
			setDialogs(previous =>
				previous.filter(dialog => dialog.execution !== internalExecution)
			);
		};

		internalExecution.ok.push(hideDialog);
		internalExecution.cancel.push(hideDialog);
		internalExecution.dismiss.push(hideDialog);

		const execution: DialogExecution = {
			onOk: cb => {
				console.log('on ok');
				internalExecution.ok.push(cb);
				return execution;
			},
			onCancel: cb => {
				console.log('on cancel');
				internalExecution.cancel.push(cb);
				return execution;
			},
			onDismiss: cb => {
				console.log('on dismiss');
				internalExecution.dismiss.push(cb);
				return execution;
			},
		};

		setDialogs(previous => ([
			...previous,
			{
				element,
				props,
				execution: internalExecution,
				visible: false,
			},
		]));
		return execution;
	}, []);

	useEffect(() => {
		if (dialogs.some(dialog => !dialog.visible)) {
			setDialogs(dialogs.map(dialog => ({...dialog, visible: true})));
		}
	}, [dialogs]);

	return (
		<DialogExecutorContext.Provider value={{create}}>
			<Portal>
				{dialogs
					.map((d, index) =>
						<d.element
							{...d.props}
							visible={d.visible}
							key={index}
							onOk={() => d.execution.ok?.forEach(cb => cb())}
							onDismiss={() => d.execution.dismiss?.forEach(cb => cb())}
							onCancel={() => d.execution.cancel?.forEach(cb => cb())}
						/>
					)
				}
			</Portal>
			{children}
		</DialogExecutorContext.Provider>
	);
}
