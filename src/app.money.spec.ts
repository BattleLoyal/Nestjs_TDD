import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';

class Dollar {
	private amount:number;

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

class Franc {
	private amount:number;

	constructor(amount:number) {
		this.amount = amount;
	}

	times(multiplier:number):Franc {
		return new Franc(this.amount * multiplier);
	}

	equals(object:Object):boolean {
		let franc:Franc = object as Franc;
		return this.amount == franc.amount;
	}
}

describe('DollarTest', () => {
	describe('Dollar', () => {
		it('multiplydollar', () => {
			let num:number = 10;
        	let five:Dollar = new Dollar(5);
			let ten:Dollar = five.times(2);
			expect(new Dollar(10)).toStrictEqual(ten);
		});

		it('testMultipication', () => {
			let five:Dollar = new Dollar(5);
			expect(new Dollar(10)).toStrictEqual(five.times(2));
			expect(new Dollar(15)).toStrictEqual(five.times(3));
		});

		it('testEquality', () => {
			expect(new Dollar(5).equals(new Dollar(5))).toBe(true);
			expect(new Dollar(5).equals(new Dollar(6))).toBe(false);
		});
	});
});

describe('FrancTest', () => {
	describe('Franc', () => {
		it('multiplyfranc', () => {

		});

		it('testMultipication', () => {
			let five:Franc = new Franc(5);
			expect(new Franc(10)).toStrictEqual(five.times(2));
			expect(new Franc(15)).toStrictEqual(five.times(3));
		});

		it('testEquality', () => {

		});
	});
});