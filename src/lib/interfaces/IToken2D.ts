import { ICoord2D } from "./ICoord2D.js";
import { IToken } from "./IToken.js";

export interface IToken2D extends IToken{
    
    position: ICoord2D;

    getRelPos(): ICoord2D;    

    placeAt(position: ICoord2D): void;

    getCenter(): ICoord2D;
    
}



