import schemaValidator from '../src/schemaValidator';

describe('SchemaValidator', () => {
    it('invalid definition, return errors', () => {
        const obj = {};
        const defintion = {
            name: { type: 'UNKNOWN' },
            id: { type: 'enum' }
        };

        const result = schemaValidator.validate(obj, defintion);

        expect(result.isValid).toBeFalsy();
        expect(result.error.type).toEqual('definition-error');
        expect(result.error.data).toHaveLength(2);
        expect(result.error.data).toEqual([
            {
                key: 'name.type',
                message: '\'type\' property is required and can only contains these values [int,float,bool,string,array,enum,object,match]'
            },
            {
                key: 'id.enum',
                message: '\'enum\' property is required when type = \'enum\''
            }]);
    });

    it('valid definition, but invalid values, return errors', () => {
        const obj = {
            name: 12,
            id: 'string',
            value: 32.4
        };

        const defintion = {
            name: { type: 'string' },
            id: { type: 'int' },
            description: { type: 'string' },
            value: { type: 'float' }
        };

        const result = schemaValidator.validate(obj, defintion);

        expect(result.isValid).toBeFalsy();
        expect(result.error.type).toEqual('schema-error');
        expect(result.error.data).toHaveLength(3);
        expect(result.error.data).toEqual([
            {
                key: 'name',
                message: 'not string type'
            },
            {
                key: 'id',
                message: 'not valid integer'
            },
            {
                key: 'description',
                message: 'is required, but value is null or undefined'
            }
        ]);
    });

    it('valid definition and valid values, return the correct object', () => {
        const obj = {
            description: 'Basket',
            id: 2,
            total: 32.4,
            items: {
                name: 'item 1',
                quantity: 2
            }
        };

        const defintion = {
            description: { type: 'string' },
            id: { type: 'int' },
            total: { type: 'float' },
            items: {
                type: 'object',
                schema: {
                    name: { type: 'string' },
                    quantity: { type: 'int' },
                    tag: { type: 'string', require: false }
                }
            }
        };

        const result = schemaValidator.validate(obj, defintion);

        const expected = { ...obj, items: { ...obj.items, tag: null }};

        expect(result.isValid).toBeTruthy();
        expect(result.value).toEqual(expected);
    });
});
