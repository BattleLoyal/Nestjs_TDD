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

	equals(object:Object):boolean {
		let dollar:Dollar = object as Dollar;
		return this.amount == dollar.amount;
	}
}

describe('DollarTest', () => {
	describe('test', () => {
		it('multiplydollar', () => {
			let num:number = 10;
        	let five:Dollar = new Dollar(5);
			let ten:Dollar = five.times(2);
			expect(num).toBe(ten.amount);
		});

		it('testMultipication', () => {
			let five:Dollar = new Dollar(5);
			let product:Dollar = five.times(2);
			expect(10).toBe(product.amount);
			product = five.times(3);
			expect(15).toBe(product.amount);
		});

		it('testEquality', () => {
			expect(new Dollar(5).equals(new Dollar(5))).toBe(true);
			expect(new Dollar(5).equals(new Dollar(6))).toBe(false);
		});
	});
});