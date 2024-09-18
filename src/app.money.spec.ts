import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';

class Money {
	protected amount:number;

	public equals(object:Object):boolean {
		let money:Money = object as Money;
		return this.amount === money.amount && 
		(this.constructor.name === object.constructor.name);
	}
}

class Dollar extends Money {
	constructor(amount:number) {
		super();
		this.amount = amount;
	}

	times(multiplier:number):Dollar {
		return new Dollar(this.amount * multiplier);
	}
}

class Franc extends Money {
	constructor(amount:number) {
		super();
		this.amount = amount;
	}

	times(multiplier:number):Franc {
		return new Franc(this.amount * multiplier);
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
			let num:number = 10;
        	let five:Franc = new Franc(5);
			let ten:Franc = five.times(2);
			expect(new Franc(10)).toStrictEqual(ten);
		});

		it('testMultipication', () => {
			let five:Franc = new Franc(5);
			expect(new Franc(10)).toStrictEqual(five.times(2));
			expect(new Franc(15)).toStrictEqual(five.times(3));
		});

		it('testEquality', () => {
			expect(new Franc(5).equals(new Franc(5))).toBe(true);
			expect(new Franc(5).equals(new Franc(6))).toBe(false);
			expect(new Franc(5).equals(new Dollar(5))).toBe(false);
		});
	});
});