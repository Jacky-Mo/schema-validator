import parser from '../src/valueParser';

describe('ValueParser', () => {
    it('isValid definition.type', () => {
        const value = 1234;
        const definition = { type: 'newType' };

        const result = parser.parse('field-name', value, definition);

        expect(result.isValid).toBeFalsy();
        expect(result.errors).toEqual([ {
            key: 'type',
            message: 'newType is not one of the valid definition types [int,float,bool,string,array,enum,object,match]'
        }]);
    });

    describe('require', () => {
        it('required and field is null, return isValid = false', () => {
            const value = null;
            const definition = { type: 'int', require: true };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([
                {
                    key: 'field-name',
                    message: 'is required, but value is null or undefined'
                }]);
        });

        it('required and field is undefined, return isValid = false', () => {
            const value = undefined;
            const definition = { type: 'int', require: true };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([{
                key: 'field-name',
                message: 'is required, but value is null or undefined'
            }]);
        });

        it('NOT required, field = null and HAS default value, return isValid = true with default value', () => {
            const value = null;
            const definition = { type: 'int', require: false, default: 1 };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.errors).toBeUndefined();
            expect(result.value).toEqual(1);
        });

        it('NOT required and field = null and NO default value, return isValid = true & value = null', () => {
            const value = null;
            const definition = { type: 'int', require: false };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.errors).toBeUndefined();
            expect(result.value).toBeNull();
        });
    });

    describe('int type', () => {
        it('not number, return isValid = false', () => {
            const value = '1';
            const definition = { type: 'int' };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([{
                key: 'field-name',
                message: 'not valid integer'
            }]);
        });

        it('valid number but not an integer, return isValid = false', () => {
            const value = 2.5;
            const definition = { type: 'int' };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([{
                key: 'field-name',
                message: 'not valid integer'
            }]);
        });

        it('valid integer, return isValid = true', () => {
            const value = 2;
            const definition = { type: 'int' };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.value).toEqual(2);
        });
    });

    describe('float type', () => {
        it('not number, return isValid = false', () => {
            const value = '1';
            const definition = { type: 'float' };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([{
                key: 'field-name',
                message: 'not valid float'
            }]);
        });

        it('integer, return isValid = true', () => {
            const value = 4;
            const definition = { type: 'float' };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.value).toEqual(4);
        });

        it('valid number, return isValid = true', () => {
            const value = 2.5;
            const definition = { type: 'float' };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.value).toEqual(2.5);
        });
    });

    describe('boolean type', () => {
        it('not boolean, return isValid = false', () => {
            const value = 'hello';
            const definition = { type: 'bool' };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([{
                key: 'field-name',
                message: 'not valid boolean'
            }]);
        });

        it('valid boolean, return isValid = true', () => {
            const value = false;
            const definition = { type: 'bool' };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.value).toEqual(false);
        });
    });

    describe('string type', () => {
        it('not string, return isValid = false', () => {
            const value = 123;
            const definition = { type: 'string' };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([{
                key: 'field-name',
                message: 'not string type'
            }]);
        });

        it('valid string, return isValid = true', () => {
            const value = 'hello';
            const definition = { type: 'string' };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.value).toEqual('hello');
        });
    });

    describe('array type', () => {
        it('not array, return isValid = false', () => {
            const value = 123;
            const definition = { type: 'array' };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([{
                key: 'field-name',
                message: 'not Array type'
            }]);
        });

        it('valid array, return isValid = true', () => {
            const value = [];
            const definition = { type: 'array' };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.value).toEqual([]);
        });
    });

    describe('enum type', () => {
        it('value not part of the enum, return isValid = false', () => {
            const value = 123;
            const definition = { type: 'enum', enum: ['ab', 'cd'] };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([{
                key: 'field-name',
                message: '(123) is not one of pre-defined values [ab,cd]'
            }]);
        });

        it('valid array, return isValid = true', () => {
            const value = 'cd';
            const definition = { type: 'enum', enum: ['ab', 'cd'] };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.value).toEqual('cd');
        });
    });

    describe('match type', () => {
        it('function return false, return isValid = false', () => {
            const value = 123;
            const definition = {
                type: 'match',
                match: function(val) {
                    return val === 888;
                }
            };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([{
                key: 'field-name',
                message: 'not valid based on the match property'
            }]);
        });

        it('function return true, return isValid = true', () => {
            const value = 123;
            const definition = {
                type: 'match',
                match: function(val) {
                    return val === 123;
                }
            };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.value).toEqual(123);
        });

        it('RegExp return false, return isValid = false', () => {
            const value = 'abc';
            const definition = {
                type: 'match',
                match: /[0-9]/
            };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([{
                key: 'field-name',
                message: 'not valid based on the match property'
            }]);
        });

        it('RegExp return true, return isValid = true', () => {
            const value = 123;
            const definition = {
                type: 'match',
                match: /\d/
            };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.value).toEqual(123);
        });
    });

    describe('object type', () => {
        it('not object, return isValid = false', () => {
            const value =  123;
            const definition = { type: 'object',
                schema: {
                    id: { type: 'int' },
                    isValid: { type: 'bool' }
                }
            };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([{
                key: 'field-name',
                message: 'not Object type'
            }]);
        });

        it('object graph has 1 level and all props are not valid, return isValid = false', () => {
            const value = {
                name: 'abc',
                value: 134.45,
                isValid: new Date()
            };
            const definition = {
                type: 'object',
                schema: {
                    name: { type: 'float' },
                    value: { type: 'int' },
                    isValid: { type: 'bool' }
                }
            };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([
                {
                    key: 'field-name.name',
                    message: 'not valid float'
                },
                {
                    key: 'field-name.value',
                    message: 'not valid integer'
                },
                {
                    key: 'field-name.isValid',
                    message: 'not valid boolean'
                }]);
        });

        it('object graph has 1 level and 1 prop is not valid, return isValid = false', () => {
            const value = {
                name: 'abc'
            };
            const definition = {
                type: 'object',
                schema: {
                    name: { type: 'string' },
                    value: { type: 'int', require: true }
                }
            };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([
                {
                    key: 'field-name.value',
                    message: 'is required, but value is null or undefined'
                }]);
        });

        it('object graph has 1 level and all props are valid, return isValid = true', () => {
            const value = {
                name: 'abc',
                value: 134.45,
                isValid: true
            };

            const definition = {
                type: 'object',
                schema: {
                    name: { type: 'string' },
                    value: { type: 'float' },
                    isValid: { type: 'bool' }
                }
            };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.value).toEqual(value);
        });

        it('object graph has 2 levels and 2 props at various levels are not valid, return isValid = false', () => {
            const value = {
                description: 'abc',
                child: {
                    id: '1',
                    age: 12
                }
            };
            const definition = {
                type: 'object',
                schema: {
                    description: { type: 'string' },
                    child: {
                        type: 'object',
                        schema: {
                            id: { type: 'int' },
                            age: { type: 'int' }
                        }
                    },
                    recordNo: { type: 'int', require: true },
                }
            };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([
                {
                    key: 'field-name.child.id',
                    message: 'not valid integer'
                },
                {
                    key: 'field-name.recordNo',
                    message: 'is required, but value is null or undefined'
                }]);
        });

        it('object graph has 2 levels and all props are valid, return isValid = true', () => {
            const value = {
                description: 'abc',
                child: {
                    id: 1,
                    age: 12
                }
            };
            const definition = {
                type: 'object',
                schema: {
                    description: { type: 'string' },
                    child: {
                        type: 'object',
                        schema: {
                            id: { type: 'int' },
                            age: { type: 'int' }
                        }
                    },
                    recordNo: { type: 'int', default: 1234 },
                }
            };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.value).toEqual({ ...value, recordNo: 1234 });
        });

        it('object graph has 3 levels and 4 props at various levels are not valid, return isValid = false', () => {
            const value = {
                description: 'abc',
                child: {
                    id: '1',
                    age: 12,
                    address: {
                        zipCode: 12233,
                        city: true,
                        state: new Date()
                    },
                    name: true
                }
            };
            const definition = {
                type: 'object',
                schema: {
                    description: { type: 'string' },
                    child: {
                        type: 'object',
                        schema: {
                            id: { type: 'int' },
                            age: { type: 'int' },
                            name: { type: 'string' },
                            address: {
                                type: 'object',
                                schema: {
                                    zipCode: { type: 'int' },
                                    city: { type: 'string' },
                                    state: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeFalsy();
            expect(result.errors).toEqual([
                {
                    key: 'field-name.child.id',
                    message: 'not valid integer'
                },
                {
                    key: 'field-name.child.name',
                    message: 'not string type'
                },
                {
                    key: 'field-name.child.address.city',
                    message: 'not string type'
                },
                {
                    key: 'field-name.child.address.state',
                    message: 'not string type'
                }]);
        });


        it('object graph has 3 levels and all props are VALID, return isValid = true', () => {
            const value = {
                description: 'abc',
                child: {
                    id: 1,
                    age: 12,
                    address: {
                        zipCode: 12233,
                        city: 'New York',
                        state: 'NY'
                    },
                    name: 'John Doe'
                }
            };
            const definition = {
                type: 'object',
                schema: {
                    description: { type: 'string' },
                    child: {
                        type: 'object',
                        schema: {
                            id: { type: 'int' },
                            age: { type: 'int' },
                            name: { type: 'string' },
                            address: {
                                type: 'object',
                                schema: {
                                    zipCode: { type: 'int' },
                                    city: { type: 'string' },
                                    state: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            };

            const result = parser.parse('field-name', value, definition);

            expect(result.isValid).toBeTruthy();
            expect(result.value).toEqual(value);
        });
    });
});
