import { IToken } from '../../../tokens/interfaces/itoken';
export interface iWorld<T extends IToken>{

    setdDimesions(elementalItem:T): void;

    getDimesions(): Map<string, number>;

    addItem(item: T): void;

    purge(items: T[]): void;

}