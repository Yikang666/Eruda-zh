import util from '../util'

require('!style!css!sass!./style.scss');

export default class HomeBtn {
    constructor($parent)
    {
        this.$parent = $parent;

        this.appendTpl();
        this.bindEvent();
    }
    appendTpl()
    {
        var $parent = this.$parent;

        $parent.append(require('./template.hbs')());

        this.$el = $parent.find('.home-btn');
    }
    bindEvent()
    {
        this.$el.on('click', function ()
        {

        });
    }
};