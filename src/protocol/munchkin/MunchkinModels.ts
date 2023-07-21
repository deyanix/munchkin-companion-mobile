export enum MunchkinGender {
	MALE = 'MALE',
	FEMALE = 'FEMALE',
}

export interface MunchkinPlayer {
	id: number;
	name: string;
	level: number;
	gear: number;
	gender: MunchkinGender;
	genderChanged: boolean;
}

export type MunchkinPlayerData = Omit<MunchkinPlayer, 'id'>;

export interface MunchkinDevice {
	name: string;
	manufacturer: string;
	system: string;
}

export interface WelcomeEvent {
	version: string;
	device: MunchkinDevice;
}

