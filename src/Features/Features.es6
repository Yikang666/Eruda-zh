import Tool from '../DevTools/Tool.es6'
import util from '../util'
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
    }
    init($el)
    {
        super.init($el);

        this._initFeatures();
    }
    _initFeatures()
    {
        util.each(featureNames, (feature) =>
        {
            if (specialNames[feature]) feature = specialNames[feature];
            feature = feature.replace(/\//g, '');

            modernizr.on(feature, (result) =>
            {
                this._add(feature, result);
            });
        });
    }
    _add(name, result)
    {
        this._features[name] = result;

        this._render();
    }
    _render()
    {
        this._$el.html(this._tpl({
            features: this._features
        }));
    }
}