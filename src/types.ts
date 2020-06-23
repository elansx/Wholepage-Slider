export interface Options {
    colors?: string[];
}

export type Directions = 'up' | 'down' | 'left' | 'right';

export interface Translate {
    section: number;
    page: number[];
}

export interface Touches {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    differenceX: number;
    differenceY: number;
}
