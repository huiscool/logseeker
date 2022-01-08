import * as fsprom from 'fs/promises';
import * as path from 'path';
import {nanoid} from 'nanoid';
import { PathLike } from 'fs';
import * as model from './model';

export class FileLogSource implements model.LogSource{
    id: string;
    constructor (pathLike: PathLike, id?: string) {
        this.id = id ? id : pathLike.toString() + nanoid(5);
    }

    activate(wf: model.WriteEntryFunc): void{
        throw new Error("");
    }
    
    deactivate(): void{
        throw new Error("");
    }
    
}