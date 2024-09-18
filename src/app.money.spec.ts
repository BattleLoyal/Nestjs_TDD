import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';

class Money {
	protected amount:number;
	protected currency:string;

	constructor(amount:number, currency:string) {
		this.amount = amount;
		this.currency = currency;
	}

	public equals(object:Object):boolean {
		let money:Money = object as Money;
		return this.amount === money.amount && 
		(this.getCurrency() === money.getCurrency());
	}

	// Dollar Factory method
	static dollar(amount:number):Money {
		return new Dollar(amount, "USD");
	}

	// Franc Factory method
	static franc(amount:number):Money {
		return new Franc(amount, "CHF");
	}

	times(multiplier:number):Money {
		return new Money(this.amount * multiplier, this.currency);
	}
	
	public getCurrency():string {
		return this.currency;
	}
}

// 아무것도 안 하는 하위 클래스들
class Dollar extends Money {
	constructor(amount:number, currency:string) {
		super(amount, currency);
	}
}

// 아무것도 안 하는 하위 클래스들
class Franc extends Money {
	constructor(amount:number, currency:string) {
		super(amount, currency);
	}
}

describe('MoneyTest', () => {
	// 통화 테스트
	it('testCurrency', () => {
		expect("USD").toStrictEqual(Money.dollar(1).getCurrency());
		expect("CHF").toStrictEqual(Money.franc(1).getCurrency());
	})

	it('testDifferentClass', () => {
		expect(new Money(10, "CHF").equals(new Franc(10, "CHF"))).toBe(true);
	})

	// Dollar 테스트
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

	// Franc 테스트
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
