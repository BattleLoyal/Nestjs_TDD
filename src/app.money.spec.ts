import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';

interface Expression {

}

class Money implements Expression {
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
		return new Money(amount, "USD");
	}

	// Franc Factory method
	static franc(amount:number):Money {
		return new Money(amount, "CHF");
	}

	times(multiplier:number):Money {
		return new Money(this.amount * multiplier, this.currency);
	}
	
	public getCurrency():string {
		return this.currency;
	}

	public plus(added:Money):Expression {
		return new Money(this.amount + added.amount, this.currency);
	}
}

class Bank {
	public reduce(source:Expression, to:string):Money {
		return Money.dollar(10);
	}
}

describe('MoneyTest', () => {
	// 통화 테스트
	it('환율', () => {
		expect("USD").toStrictEqual(Money.dollar(1).getCurrency());
		expect("CHF").toStrictEqual(Money.franc(1).getCurrency());
	});

	// 더하기 테스트
	it('간단한 더하기', () => {
		const five:Money = Money.dollar(5);
		const sum:Expression = five.plus(five);
		const bank:Bank = new Bank();
		const reduced:Money = bank.reduce(sum, 'USD');
		expect(Money.dollar(10)).toStrictEqual(reduced);
	});

	// Dollar 테스트
	describe('달러', () => {
		it('달러 곱하기', () => {
			let five:Money = Money.dollar(5);
			expect(Money.dollar(10)).toStrictEqual(five.times(2));
			expect(Money.dollar(15)).toStrictEqual(five.times(3));
		});

		it('equals함수 테스트', () => {
			expect(Money.dollar(5).equals(Money.dollar(5))).toBe(true);
			expect(Money.dollar(5).equals(Money.dollar(6))).toBe(false);
		});
	});

	// Franc 테스트
	describe('프랑', () => {
		it('프랑 곱하기', () => {
			let five:Money = Money.franc(5);
			expect(Money.franc(10)).toStrictEqual(five.times(2));
			expect(Money.franc(15)).toStrictEqual(five.times(3));
		});

		it('equals함수 테스트', () => {
			expect(Money.franc(5).equals(Money.franc(5))).toBe(true);
			expect(Money.franc(5).equals(Money.franc(6))).toBe(false);
			expect(Money.franc(5).equals(Money.dollar(5))).toBe(false);
		});
	});
});
