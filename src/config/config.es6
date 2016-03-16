import Storage from './Storage.es6'

var configs = {};

var config = {
    create(name)
    {
        if (!configs[name]) configs[name] = new Storage(name);

        return configs[name];
    }
};

export default config;