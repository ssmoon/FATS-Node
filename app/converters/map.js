const _ = require('lodash');

module.exports = function (source, destination) {
    var sourceObj, desObj;
    var desKeys = _.keys(destination), functions;
    _.extend(destination, _.pick(source, desKeys));
    sourceObj = source;
    desObj = destination;

    functions = {
        forMember: function(sourceKey, desKey) {
            var keys = sourceKey.split('.'), sourceValue = sourceObj, index = 0;

            // incase sourceKey is a nested object like objectA.Value
            if (keys.length) {
                while (index < keys.length) {
                    sourceValue = sourceValue[keys[index]];
                    index++;
                }
                desObj[desKey] = sourceValue;
            }
            else {
                desObj[desKey] = sourceObj[sourceKey];
            }

            return functions;
        },
        
        directSetVal: function(desKey, val) {
            desObj[desKey] = val
            return functions;
        }
    };
    return functions;
}