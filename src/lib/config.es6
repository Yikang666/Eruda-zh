import Storage from './Storage.es6'

let configs = {};

let config = {
    create(name)
    {
        if (!configs[name]) configs[name] = new Storage(name);

        return configs[name];
    }
};

export default config;
