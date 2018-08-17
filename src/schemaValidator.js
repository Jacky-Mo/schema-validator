import schemaDefinitionValidator from './schemaDefinitionValidator';
import valueParser from './valueParser';

class SchemaValidator {
    validate(object, schemaDefinition) {
        const keys = Object.keys(schemaDefinition);
        let definitionErrors = [];

        keys.forEach((key) => {
            const result = schemaDefinitionValidator.isValid(schemaDefinition[key], key);

            if(!result.isValid) {
                definitionErrors = definitionErrors.concat(result.errors);
            }
        });

        if(definitionErrors.length) {
            return {
                isValid: false,
                error: {
                    type: 'definition-error',
                    data: definitionErrors
                }
            };
        }

        let schemaErrors = [];
        const returnObj = {};

        keys.forEach((key) => {
            const result = valueParser.parse(key, object[key], schemaDefinition[key]);

            if(!result.isValid) {
                schemaErrors = schemaErrors.concat(result.errors);
            } else {
                returnObj[key] = result.value;
            }
        });

        if(schemaErrors.length) {
            return {
                isValid: false,
                error: {
                    type: 'schema-error',
                    data: schemaErrors
                }
            };
        }

        return {
            isValid: true,
            value: returnObj
        };
    }
}

export default new SchemaValidator();
