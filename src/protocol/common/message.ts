export interface MunchkinDevice {
	name: string;
	manufacturer: string;
	system: string;
}

export interface WelcomeEvent {
	version: string;
	device: MunchkinDevice;
}
