import { IToken } from "../../../tokens/interfaces/itoken";


/**
 * Representa todos los elementos de una escena
 */
export interface IScene {
    getXYPosition(token: IToken): {x:number, y:number};
    getXYViewPortPosition() : {x: number, y: number};
    add(token: IToken): void;    
    purge(): number;
}

export interface IScene {
    getXYPosition(token: IToken): {x:number, y:number};
    getXYViewPortPosition() : {x: number, y: number};
    add(token: IToken): void;    
    purge(): number;
}


/**
 * Contrato para renderizado.
 * Sólo aplica lo visible. Concretamente, lo que abarca el viewport.
 */
export interface ISceneRendering{        
    getViewPortTokens(): IToken[];    
}


/**
 * Contrato para el motor.
 * Se facilitan todos los tokens
 */
export interface ISceneEngine{

    getWorldTokens(): IToken[];

}