import { ApexLegendsEvent, ApexLegendsEventType } from './apexevents';
import { ApexLegendsState } from './apexlegends';
export declare const parseCommonEventData: (event: ApexLegendsEvent, state: ApexLegendsState) => void;
export declare const parsers: {
	[key in ApexLegendsEventType]: (event: any, state: ApexLegendsState) => void;
};
