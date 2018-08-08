const types = ['int', 'float', 'string', 'array', 'enum', 'object', 'match'];

const createMessage = (propertyPrefix, property, message) => {
    const key = propertyPrefix ? `${propertyPrefix}.${property}` : property;
    return {
        key,
        message
    };
};

const createValidationResult = (errors) => {
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validate schema definition
 *
 *  {
 *		type: pre-defined
 *    require: bool
 * 		enum: []
 * 		match: regex
 *		schema: object
 *  }
 */

class SchemaDefinitionValidator {
    constructor() {
        this.defintionQueue = [];
    }

    _validate(definition, propertyPrefix) {
        const errors = [];

        if(!definition.type || !types.includes(definition.type)) {
            errors.push(createMessage(propertyPrefix, 'type', `'type' property is required and can only contains these values [${types.join()}]`));
        }

        if(('require' in definition) && (typeof(definition.require) !== 'boolean')) {
            errors.push(createMessage(propertyPrefix, 'require', '\'require\' property must be a boolean type'));
        }

        if(definition.type === 'enum') {
            if(!('enum' in definition)) {
                errors.push(createMessage(propertyPrefix, 'enum', '\'enum\' property is required when type = \'enum\''));
            } else if (!Array.isArray(definition.enum)) {
                errors.push(createMessage(propertyPrefix, 'enum', '\'enum\' property must be an array'));
            }
        }

        if(definition.type === 'match') {
            if (!('match' in definition)) {
                errors.push(createMessage(propertyPrefix, 'match', '\'match\' property is required when type = \'match\''));
            } else if(typeof(definition.match) !== 'function' && !(definition.match instanceof RegExp)) {
                errors.push(createMessage(propertyPrefix, 'match', '\'match\' property can only be function or RegExp'));
            }
        }

        if(definition.type === 'object') {
            if(!('schema' in definition)) {
                errors.push(createMessage(propertyPrefix, 'schema', '\'schema\' property is required when type = \'object\''));
            } else if (typeof(definition.schema) !== 'object') {
                errors.push(createMessage(propertyPrefix, 'schema', '\'schema\' property must be an object'));
            } else {
                const keys = Object.keys(definition.schema);

                keys.forEach((key) => {
                    this.defintionQueue.push({
                        propertyPrefix: propertyPrefix ? `${propertyPrefix}.schema.${key}` : `schema.${key}`,
                        definition: definition.schema[key]
                    });
                });
            }
        }

        return createValidationResult(errors);
    }

    isValid(definition, propertyPrefix = null) {
        let errors = [];

        this.defintionQueue.push({ definition, propertyPrefix});

        while(this.defintionQueue.length > 0) {
            const nextDefinition = this.defintionQueue.shift();

            const result = this._validate(nextDefinition.definition, nextDefinition.propertyPrefix);

            if(!result.isValid) {
                errors = errors.concat(result.errors);
            }
        }

        return createValidationResult(errors);
    }
}

export default new SchemaDefinitionValidator();
