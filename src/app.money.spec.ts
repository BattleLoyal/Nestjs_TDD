import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';

interface Expression {
	reduce(to:string):Money;
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

	// 통화 가져오기
	public getCurrency():string {
		return this.currency;
	}
	// 금액 가져오기
	public getAmount():number {
		return this.amount;
	}

	// 곱하기
	public times(multiplier:number):Money {
		return new Money(this.amount * multiplier, this.currency);
	}

	// 더하기, addend:더하는 인자
	public plus(addend:Money):Expression {
		return new Sum(this, addend);
	}

	public reduce(to:string):Money {
		return this;
	}
}

class Bank {
	public reduce(source:Expression, to:string):Money {
		return source.reduce(to);
	}
}

class Sum implements Expression {
	private augend:Money;	// 덧셈의 첫번째 인자 (1+6의 1)
	private addend:Money;	// 덧셈의 마지막 인자 (1+6의 6)

	constructor(augend:Money, addend:Money) {
		this.augend = augend;
		this.addend = addend;
	}

	public reduce(to:string):Money {
		const amount:number = this.augend.getAmount() + this.addend.getAmount();
		return new Money(amount, to);
	}
}

// 테스트
describe('MoneyTest', () => {
	it('환율', () => {
		expect("USD").toStrictEqual(Money.dollar(1).getCurrency());
		expect("CHF").toStrictEqual(Money.franc(1).getCurrency());
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

	// 더하기
	describe('더하기 테스트', () => {
		it('간단한 더하기', () => {
			const five:Money = Money.dollar(5);
			const sum:Expression = five.plus(five);
			const bank:Bank = new Bank();
			const reduced:Money = bank.reduce(sum, 'USD');
			expect(Money.dollar(10)).toStrictEqual(reduced);
		});

		it('reduce(sum)테스트', () => {
			const sum:Expression = new Sum(Money.dollar(3), Money.dollar(4));
			const bank:Bank = new Bank;
			const result:Money = bank.reduce(sum, "USD");
			expect(Money.dollar(7)).toStrictEqual(result);
		});

		it('reduce(money)테스트', () => {
			const bank:Bank = new Bank();
			const result:Money = bank.reduce(Money.dollar(1), "USD");
			expect(Money.dollar(1)).toStrictEqual(result);
		});
	});
});
