import highlight from './highlight'
import beautify from 'js-beautify'
import config from './config'

export default function (util)
{
     Object.assign(util, {
         highlight,
         beautify,
         createCfg(name)
         {
             return config.create('eruda-' + name);
         }
     });
}
