import Storage from './Storage'

let configs = {};

let config = {
    create(name)
    {
        if (!configs[name]) configs[name] = new Storage(name);

        return configs[name];
    }
};

export default config;
