import validator from '../src/schemaDefinitionValidator';

describe('schema definition validator', () => {
    it('type property does not exist, return not valid with error', () => {
        const definition = {};

        const result = validator.isValid(definition);

        expect(result.isValid).toBeFalsy();
        expect(result.errors[0].key).toEqual('type');
    });
});
