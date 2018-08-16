import { createErrorMessage } from '../src/utils';

describe('createErrorMessage', () => {
    it('has prefix, key is pre-appended with prefix', () => {
        const error = createErrorMessage('abc', 'prop', 'this is message');

        expect(error).toEqual({
            key: 'abc.prop',
            message: 'this is message'
        });
    });

    it('has NO prefix, key is not prefixed', () => {
        const error = createErrorMessage('', 'prop', 'this is message');

        expect(error).toEqual({
            key: 'prop',
            message: 'this is message'
        });
    });
});
