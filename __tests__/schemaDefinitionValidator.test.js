import validator from '../src/schemaDefinitionValidator';

describe('schema definition validator', () => {
    it('type prop does not exist, return isValid = false and error', () => {
        const definition = {};

        const result = validator.isValid(definition, 'name');

        expect(result.isValid).toBeFalsy();
        expect(result.errors[0].key).toEqual('name.type');
        expect(result.errors[0].message).toEqual('\'type\' property is required and can only contains these values [int,float,bool,string,array,enum,object,match]');
    });

    it('type prop contains invalid value, return isValid = false and error', () => {
        const definition = { type: 'double' };

        const result = validator.isValid(definition);

        expect(result.isValid).toBeFalsy();
        expect(result.errors[0].key).toEqual('type');
        expect(result.errors[0].message).toEqual('\'type\' property is required and can only contains these values [int,float,bool,string,array,enum,object,match]');
    });

    it('require prop is not boolean type, return isValid = false and error', () => {
        const definition = { type: 'int', require: 1 };

        const result = validator.isValid(definition);

        expect(result.isValid).toBeFalsy();
        expect(result.errors[0].key).toEqual('require');
        expect(result.errors[0].message).toEqual('\'require\' property must be a boolean type');
    });

    it('type = enum and enum prop does not exist, return isValid = false and error', () => {
        const definition = { type: 'enum', require: true };

        const result = validator.isValid(definition);

        expect(result.isValid).toBeFalsy();
        expect(result.errors[0].key).toEqual('enum');
        expect(result.errors[0].message).toEqual('\'enum\' property is required when type = \'enum\'');
    });

    it('type = enum and enum prop is not Array, return isValid = false and error', () => {
        const definition = { type: 'enum', require: true, enum: 'invalid type' };

        const result = validator.isValid(definition);

        expect(result.isValid).toBeFalsy();
        expect(result.errors[0].key).toEqual('enum');
        expect(result.errors[0].message).toEqual('\'enum\' property must be an array');
    });

    it('type = match and match prop does not exist, return isValid = false and error', () => {
        const definition = { type: 'match', require: true };

        const result = validator.isValid(definition);

        expect(result.isValid).toBeFalsy();
        expect(result.errors[0].key).toEqual('match');
        expect(result.errors[0].message).toEqual('\'match\' property is required when type = \'match\'');
    });

    it('type = match and match prop is not function or RegeExp, return isValid = false and error', () => {
        const definition = { type: 'match', require: true, match: 'invalid' };

        const result = validator.isValid(definition);

        expect(result.isValid).toBeFalsy();
        expect(result.errors[0].key).toEqual('match');
        expect(result.errors[0].message).toEqual('\'match\' property can only be function or RegExp');
    });

    it('type = object and schema prop does not exist, return isValid = false and error', () => {
        const definition = { type: 'object', require: true };

        const result = validator.isValid(definition);

        expect(result.isValid).toBeFalsy();
        expect(result.errors[0].key).toEqual('schema');
        expect(result.errors[0].message).toEqual('\'schema\' property is required when type = \'object\'');
    });

    it('type = object and schema prop is not object, return isValid = false and error', () => {
        const definition = { type: 'object', require: true, schema: 'invalid'};

        const result = validator.isValid(definition);

        expect(result.isValid).toBeFalsy();
        expect(result.errors[0].key).toEqual('schema');
        expect(result.errors[0].message).toEqual('\'schema\' property must be an object');
    });

    it('type = object and schema is not valid, return isValid = false and error', () => {
        const definition = {
            type: 'object',
            require: true,
            schema: {
                color: {
                    type: 'not-define',
                    require: false
                },
                status: {
                    type: 'enum',
                    require: false
                },
                child: {
                    type: 'object',
                    require: false,
                    schema: {
                        name: {
                            require: false,
                            type: 'unknow'
                        }
                    }
                }
            }};

        const result = validator.isValid(definition);

        expect(result.isValid).toBeFalsy();
        expect(result.errors).toHaveLength(3);
        expect(result.errors[0].key).toEqual('schema.color.type');
        expect(result.errors[1].key).toEqual('schema.status.enum');
        expect(result.errors[2].key).toEqual('schema.child.schema.name.type');
    });
});


describe('Schema Definition Validator - valid schema definitions', () => {
    it('valid definitions, return true', () => {
        const definitions = [
            {
                type: 'int',
                require: true
            },
            {
                type: 'float',
                require: false
            },
            {
                type: 'string',
                require: true
            },
            {
                type: 'array',
                require: true
            },
            {
                type: 'enum',
                require: true,
                enum: ['a', 'b']
            },
            {
                type: 'match',
                require: true,
                match: function(value) {
                    return value !== null;
                }
            },
            {
                type: 'match',
                require: true,
                match: /ab/
            },
            {
                type: 'object',
                require: true,
                schema: {
                    name: {
                        type: 'string',
                        require: false
                    }
                }
            },
            {
                type: 'object',
                require: true,
                schema: {
                    name: {
                        type: 'string',
                        require: false
                    },
                    fields: {
                        type: 'object',
                        schema: {
                            a: {
                                type: 'int'
                            }
                        }
                    },
                    values: {
                        type: 'enum',
                        enum: [1, 2]
                    }
                }
            }
        ];

        definitions.forEach((definition) => {
            const result = validator.isValid(definition);
            expect(result.isValid).toBeTruthy();
        });
    });
});
