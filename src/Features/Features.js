import Tool from '../DevTools/Tool'
import util from '../lib/util'
import modernizr from './modernizr'

let featureList = require('./featureList.json');

let featureNames = featureList['feature-detects'],
    specialNames = featureList['special-names'];

export default class Features extends Tool
{
    constructor()
    {
        super();

        this._style = util.evalCss(require('./Features.scss'));

        this.name = 'features';
        this._tpl = require('./Features.hbs');
        this._features = {};
        this._isInit = false;
    }
    show()
    {
        super.show();

        if (!this._isInit) this._initFeatures();
    }
    destroy() 
    {
        super.destroy();

        util.evalCss.remove(this._style);
    }
    _initFeatures()
    {
        this._isInit = true;

        modernizr.testRunner();

        let i = 0,
            featureNum = featureNames.length;

        util.each(featureNames, (feature) =>
        {
            if (specialNames[feature]) feature = specialNames[feature];
            feature = feature.replace(/\//g, '');

            modernizr.on(feature, result =>
            {
                this._features[feature] = result;
                i++;
                if (i === featureNum) this._render();
            });
        });
    }
    _render()
    {
        this._$el.html(this._tpl({features: this._features}));
    }
}
