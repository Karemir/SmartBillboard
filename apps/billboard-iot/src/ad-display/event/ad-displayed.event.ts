export const AdDisplayedEventName = 'display.AdDisplayedEvent';
export class AdDisplayedEvent {
    constructor(
        public id: number,
        public durationSeconds: number,
    ) { }
}