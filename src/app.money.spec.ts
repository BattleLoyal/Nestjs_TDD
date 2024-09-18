import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';

abstract class Money {
	protected amount:number;

	public equals(object:Object):boolean {
		let money:Money = object as Money;
		return this.amount === money.amount && 
		(this.constructor.name === object.constructor.name);
	}

	// Dollar Factory method
	static dollar(amount:number):Money {
		return new Dollar(amount);
	}

	// Franc Factory method
	static franc(amount:number):Money {
		return new Franc(amount);
	}

	// abstract method
	abstract times(multiplier:number):Money;
}

class Dollar extends Money {
	constructor(amount:number) {
		super();
		this.amount = amount;
	}

	times(multiplier:number):Money {
		return new Dollar(this.amount * multiplier);
	}
}

class Franc extends Money {
	constructor(amount:number) {
		super();
		this.amount = amount;
	}

	times(multiplier:number):Money {
		return new Franc(this.amount * multiplier);
	}
}

describe('DollarTest', () => {
	describe('Dollar', () => {
		it('multiplydollar', () => {
			let num:number = 10;
        	let five:Dollar = Money.dollar(5);
			let ten:Dollar = five.times(2);
			expect(Money.dollar(10)).toStrictEqual(ten);
		});

		it('testMultipication', () => {
			let five:Money = Money.dollar(5);
			expect(Money.dollar(10)).toStrictEqual(five.times(2));
			expect(Money.dollar(15)).toStrictEqual(five.times(3));
		});

		it('testEquality', () => {
			expect(Money.dollar(5).equals(Money.dollar(5))).toBe(true);
			expect(Money.dollar(5).equals(Money.dollar(6))).toBe(false);
		});
	});
});

describe('FrancTest', () => {
	describe('Franc', () => {
		it('multiplyfranc', () => {
			let num:number = 10;
        	let five:Franc = Money.franc(5);
			let ten:Franc = five.times(2);
			expect(Money.franc(10)).toStrictEqual(ten);
		});

		it('testMultipication', () => {
			let five:Franc = Money.franc(5);
			expect(Money.franc(10)).toStrictEqual(five.times(2));
			expect(Money.franc(15)).toStrictEqual(five.times(3));
		});

		it('testEquality', () => {
			expect(Money.franc(5).equals(Money.franc(5))).toBe(true);
			expect(Money.franc(5).equals(Money.franc(6))).toBe(false);
			expect(Money.franc(5).equals(Money.dollar(5))).toBe(false);
		});
	});
});