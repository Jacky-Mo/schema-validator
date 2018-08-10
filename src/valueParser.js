class ValueParser {
    _createReturnObj(error, value) {
        const obj = {
            isValid: error === null
        };

        if(error) {
            if(Array.isArray(error)) {
                obj.errors = [ ...error ];
            } else {
                obj.errors = [ error ];
            }
        } else {
            obj.value = value;
        }

        return obj;
    }

    _parseInt(fieldName, value) {
        if(typeof(value) === 'number' && Number.isInteger(value)) {
            return this._createReturnObj(null, value);
        }
        return this._createReturnObj(`${fieldName} is not valid interger`);
    }

    _parseFloat(fieldName, value) {
        if(typeof(value) === 'number' && !Number.isInteger(value)) {
            return this._createReturnObj(null, value);
        }
        return this._createReturnObj(`${fieldName} is not valid float`);
    }

    _parseBoolean(fieldName, value) {
        if(typeof(value) === 'boolean') {
            return this._createReturnObj(null, value);
        }
        return this._createReturnObj(`${fieldName} is not a valid boolean`);
    }

    _parseString(fieldName, value) {
        if(typeof(value) === 'string') {
            return this._createReturnObj(null, value);
        }
        return this._createReturnObj(`${fieldName} is not string`);
    }

    _parseArray(fieldName, value) {
        if(Array.isArray(value)) {
            return this._createReturnObj(null, value);
        }
        return this._createReturnObj(`${fieldName} is not Array`);
    }

    _parseEnum(fieldName, value, definition) {
        if(definition.enum.includes(value)) {
            return this._createReturnObj(null, value);
        }
        return this._createReturnObj(`${fieldName} is not one of pre-defined values [${definition.enum}]`);
    }

    _parseObject(fieldName, value, definition) {
        if(typeof(value) === 'object') {
            const props = Object.keys(definition);

            let obj = {};
            let errors = [];

            props.forEach((prop) => {
                const parsedValue = this.parse(prop, value[prop], definition[prop]);

                if(!parsedValue.isValid) {
                    errors = errors.concat(parsedValue.errors);
                } else {
                    obj[prop] = parsedValue.value;
                }
            });

            if(errors.length) {
                return this._createReturnObj(errors);
            }
            return this._createReturnObj(null, obj);
        }
        return this._createReturnObj(`${fieldName} is not Object`);
    }

    _parseMatch(fieldName, value, definition) {
        let isValid = false;
        if(typeof(definition.match) === 'function') {
            isValid = definition.match(value);
        } else {
            isValid = definition.match.test(value);
        }

        if(isValid) {
            return this._createReturnObj(null, value);
        }

        return this._createReturnObj(`${fieldName} is not valid based on the match property`);
    }

    parse(fieldName, value, definition) {
        // value does not exist
        // Handle require and default
        if(!value) {
            if(definition.require && definition.require === true) {
                return this._createReturnObj(`${fieldName} is required, but value is null`);
            } else if('default' in definition) {
                return this._createReturnObj(null, definition.default);
            }
        }

        switch(definition.type) {
        case 'int':
            return this._parseInt(fieldName, value);
        case 'float':
            return this._parseFloat(fieldName, value);
        case 'bool':
            return this._parseBoolean(fieldName, value);
        case 'string':
            return this._parseString(fieldName, value);
        case 'array':
            return this._parseArray(fieldName, value);
        case 'enum':
            return this._parseEnum(fieldName, value, definition);
        case 'object':
            return this._parseObject(fieldName, value, definition);
        case 'match':
            return this._parseMatch(fieldName, value, definition);
        default:
            return this._createReturnObj('not valid definition type');
        }
    }
}

export default new ValueParser();
