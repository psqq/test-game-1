import { expect } from 'chai';

const helloMsg = "Hello, World!";

function hello() {
    return helloMsg;
}

describe('hello', () => {
    it('should return hello message', () => {
        expect(hello()).eq(helloMsg);
    });
});
