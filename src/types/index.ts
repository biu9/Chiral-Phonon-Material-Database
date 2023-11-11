export interface IElement {
    name: string;
    number: number;
}

export type Point = [number, number, string];

export enum bandType {
    'pam'=2,
    'sxy'=3,
    'syz'=4,
    'szx'=5,
}

export interface BandStructureProps {
    width: number;
    height: number;
    bandType: bandType;
}
