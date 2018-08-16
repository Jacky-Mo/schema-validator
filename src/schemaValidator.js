import schemaDefinitionValidator from './schemaDefinitionValidator';

class SchemaValidator {
    validate(object, schemaDefinition) {
        const schemaValidationResult = schemaDefinitionValidator.isValid(schemaDefinition);

    }
}

export default SchemaValidator;
