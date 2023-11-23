export interface IElement {
    name: string;
    number: number;
}

export type Point = [number, number, string];

export enum bandType {
    'pam' = 2,
    'sxy' = 3,
    'syz' = 4,
    'szx' = 5,
}

export interface BandStructureProps {
    width: number;
    height: number;
    bandType: bandType;
}

export interface SearchResults {
    results: SearchResult[],
}

export interface SearchResult {
    compound_name: string,
    compound: {
        name: string,
        number: number
    }[],
    "mp-ID": string,
    symmetry: number,
    type: {
        chiral: 'chiral' | 'achiral',
    },
    uuid: string
    pam: boolean
}

export interface SearchProps {
    filter: {
        elements: {
            name: string,
            number: number
        }[],
        elementsExclude: {
            name: string,
            number: number
        }[],
        precisely: boolean,
        "mp-ID": string,
        symmetry: number[],
        types: {
            chiral: 'chiral' | 'achiral',
        }[],
        pam: boolean
    },
    page: number,
    ordered: string,
    asc: boolean
}
