import { validDefinitionTypes } from './schemaDefinitionValidator';
import { createErrorMessage } from './utils';

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
        } else if(typeof(value) === 'string' && /^\d+$/.test(value)) {
            const integer = Number.parseInt(value);

            return this._createReturnObj(null, integer);
        }
        return this._createReturnObj(createErrorMessage(null, fieldName, 'not valid integer'));
    }

    _parseFloat(fieldName, value) {
        if(typeof(value) === 'number') {
            return this._createReturnObj(null, value);
        } else if(typeof(value) === 'string' && /^\d+[.]?\d*$/.test(value)) {
            const floatNumber = Number.parseFloat(value);

            return this._createReturnObj(null, floatNumber);
        }
        return this._createReturnObj(createErrorMessage(null, fieldName, 'not valid float'));
    }

    _parseBoolean(fieldName, value) {
        if(typeof(value) === 'boolean') {
            return this._createReturnObj(null, value);
        } else if(typeof(value) === 'string') {
            const strVal = value.toLowerCase();

            if(strVal === 'true') {
                return this._createReturnObj(null, true);
            } else if(strVal === 'false') {
                return this._createReturnObj(null, false);
            }
        }
        return this._createReturnObj(createErrorMessage(null, fieldName, 'not valid boolean'));
    }

    _parseString(fieldName, value) {
        if(typeof(value) === 'string') {
            return this._createReturnObj(null, value);
        }
        return this._createReturnObj(createErrorMessage(null, fieldName, 'not string type'));
    }

    _parseArray(fieldName, value) {
        if(Array.isArray(value)) {
            return this._createReturnObj(null, value);
        }
        return this._createReturnObj(createErrorMessage(null, fieldName, 'not Array type'));
    }

    _parseEnum(fieldName, value, definition) {
        if(definition.enum.includes(value)) {
            return this._createReturnObj(null, value);
        }
        return this._createReturnObj(createErrorMessage(null, fieldName, `(${value}) is not one of pre-defined values [${definition.enum}]`));
    }

    _parseObject(fieldName, value, definition) {
        if(typeof(value) === 'object' && definition.schema) {
            const props = Object.keys(definition.schema);

            let obj = {};
            let errors = [];

            props.forEach((prop) => {
                const parsedValue = this.parse(`${fieldName}.${prop}`, value[prop], definition.schema[prop]);

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
        return this._createReturnObj(createErrorMessage(null, fieldName, 'not Object type'));
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

        return this._createReturnObj(createErrorMessage(null, fieldName, 'not valid based on the match property'));
    }

    parse(fieldName, value, definition) {
        // Set default require to true if it is not provided in the definition
        if(!('require' in definition)) {
            definition.require = true;
        }

        // value does not exist
        // Handle require and default
        if(value === null || value === undefined) {
            if((definition.require && definition.require === true && !('default' in definition))) {
                return this._createReturnObj(createErrorMessage(null, fieldName, 'is required, but value is null or undefined'));
            } else {
                return this._createReturnObj(null, 'default' in definition ? definition.default: null);
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
            return this._createReturnObj(createErrorMessage(null, 'type', `${definition.type} is not one of the valid definition types [${validDefinitionTypes}]`));
        }
    }
}

export default new ValueParser();
