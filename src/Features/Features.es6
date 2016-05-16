import Tool from '../DevTools/Tool.es6'
import util from '../lib/util'
import modernizr from './modernizr'

require('./Features.scss');

var featureList = require('./featureList.json');

var featureNames = featureList['feature-detects'],
    specialNames = featureList['special-names'];

export default class Features extends Tool
{
    constructor()
    {
        super();
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
    _initFeatures()
    {
        this._isInit = true;

        modernizr.testRunner();

        util.each(featureNames, (feature) =>
        {
            if (specialNames[feature]) feature = specialNames[feature];
            feature = feature.replace(/\//g, '');

            modernizr.on(feature, (result) => this._add(feature, result));
        });
    }
    _add(name, result)
    {
        this._features[name] = result;

        this._render();
    }
    _render()
    {
        this._$el.html(this._tpl({features: this._features}));
    }
}