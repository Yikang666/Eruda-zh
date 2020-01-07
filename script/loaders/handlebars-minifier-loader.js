module.exports = function (src) {
    return src.replace(/"loc":\{"start":\{"line":\d+,"column":\d+},"end":\{"line":\d+,"column":\d+\}\}/g, '')
}