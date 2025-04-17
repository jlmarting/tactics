export class TText{
    draw: () => void;
    id: string;
    x: number;
    y: number;
    msg: string;
    config: { color: string; };
    constructor(id: string, x: number, y: number, msg: string) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.msg = msg;
        this.config = { color: 'green' };
    }
    

}