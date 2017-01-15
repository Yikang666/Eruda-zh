import highlight from './highlight.es6'
import beautify from 'js-beautify'
import config from './config.es6'

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
};
