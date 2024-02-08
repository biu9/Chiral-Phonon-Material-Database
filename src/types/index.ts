export interface IElement {
    name: string;
    number: number;
}

export type Point = [number, number, number, string];

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
    symmetry: number;
}

export interface SearchResults {
    results: SearchResult[],
    total: number
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
        symmetry?: number[],
        types: {
            chiral: 'chiral' | 'achiral',
        }[],
        pam: boolean
    },
    page: number,
    ordered: string,
    asc: boolean
}

export interface DOSdata {
    xData: number[],
    yData: {
        label: string,
        data: number[],
        showMark?: boolean,
    }[],
}

export type generalResponse<T=any> = {
    data: T,
    errMsg: string
}

export type materialResponse = {
    String: string,
    valid: boolean
}

export type BriefSearchResult = {
    symmetry: number[],
    type: string,
    total: number
}
