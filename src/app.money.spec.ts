import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';

class Dollar {
	public amount:number;

	constructor(amount:number) {
		this.amount = amount;
	}

	times(multiplier:number):Dollar {
		return new Dollar(this.amount * multiplier);
	}
}

describe('DollarTest', () => {
	describe('test', () => {
		it('multiplydollar', () => {
			let num:number = 10;
        	let five:Dollar = new Dollar(5);
			five.times(2);
			expect(num).toBe(five.amount);
		});

		it('testMultipication', () => {
			let five:Dollar = new Dollar(5);
			let product:Dollar = five.times(2);
			expect(10).toBe(product.amount);
			product = five.times(3);
			expect(15).toBe(product.amount);
		});
	});
});