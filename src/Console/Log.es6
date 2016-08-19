import util from '../lib/util'

export default class Log
{
    constructor(type, args)
    {
        this._args = args;
        this._timestamp = util.now();
    }
}

