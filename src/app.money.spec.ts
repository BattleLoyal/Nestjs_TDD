import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';

// 계산을 위한 인터페이스
interface Expression {
	reduce(bank:Bank, to:string):Money;	// 환율은 은행에게서..
	plus(addend:Expression):Expression;	// 더하기
}

// 통화
class Money implements Expression {
	protected amount:number;	// 금액 정보
	protected currency:string;	// 통화 정보 (달러, 프랑)

	constructor(amount:number, currency:string) {
		this.amount = amount;
		this.currency = currency;
	}

	// 금액,통화단위가 전부 일치하는가
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
	public times(multiplier:number):Expression {
		return new Money(this.amount * multiplier, this.currency);
	}

	// 더하기, addend:더하는 인자
	public plus(addend:Expression):Expression {
		return new Sum(this, addend);
	}

	// 통화 변경
	public reduce(bank:Bank, to:string):Money {
		const rate = bank.rate(this.currency, to);
		return new Money(this.amount / rate, to);
	}
}

// 더하기
class Sum implements Expression {
	private augend:Expression;	// 덧셈의 첫번째 인자 (1+6의 1)
	private addend:Expression;	// 덧셈의 마지막 인자 (1+6의 6)

	constructor(augend:Expression, addend:Expression) {
		this.augend = augend;
		this.addend = addend;
	}

	// 통화 변경
	public reduce(bank:Bank, to:string):Money {
		// 은행에 하나의 통화로 각각 환전을 요구한 다음 더한다.
		const amount:number 
			= this.augend.reduce(bank, to).getAmount() 
			+ this.addend.reduce(bank, to).getAmount();
		return new Money(amount, to);
	}

	public plus(addend:Expression):Expression {
		return new Sum(this, addend);
	}
}

// 은행
class Bank {
	// 환율을 저장할 테이블
	private rates:Map<Pair, number> = new Map<Pair, number>();

	// 환율 추가
	public addRate(from:string, to:string, rate:number) {
		this.rates.set(new Pair(from, to), rate);
	}

	// 통화 변경
	public reduce(source:Expression, to:string):Money {
		return source.reduce(this, to);
	}
	
	// 환율 검색
	public rate(from:string, to:string):number {
		// 같은 통화라면 1로 반환
		if (from === to) return 1;

		// map에서 일치하는 것이 있으면 환율 리턴
		for (const [mapKey, value] of this.rates) {
			if (mapKey.equals(new Pair(from, to))) {
				return value;
			}
		}
		// 없으면 undefined
		return undefined;
	}
}

// 통화 쌍 (프랑, 달러)
class Pair {
	private from:string;	// 기존 통화
	private to:string;		// 변경할 통화

	constructor(from:string, to:string) {
		this.from = from;
		this.to = to;
	}

	public equals(object:Object):boolean {
		const pair:Pair = object as Pair;
		return this.from === pair.from && this.to === pair.to;
	}

	public hashCode():number {
		return 0;
	}
}

// 테스트
describe('MoneyTest', () => {
	// 항상 쓰이는 bank 객체
	let bank:Bank = new Bank();

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
			const reduced:Money = bank.reduce(sum, 'USD');
			expect(Money.dollar(10)).toStrictEqual(reduced);
		});

		it('reduce(sum)테스트', () => {
			const sum:Expression = new Sum(Money.dollar(3), Money.dollar(4));
			const result:Money = bank.reduce(sum, "USD");
			expect(Money.dollar(7)).toStrictEqual(result);
		});

		it('reduce(money)테스트', () => {
			const result:Money = bank.reduce(Money.dollar(1), "USD");
			expect(Money.dollar(1)).toStrictEqual(result);
		});

		// 서로 다른 통화 더하기
		it('10프랑과 5달러 더하기', () => {
			const fiveBucks:Expression = Money.dollar(5);
			const tenFrancs:Expression = Money.franc(10);
			// 환율
			bank.addRate("CHF", "USD", 2);
			const result = 
				bank.reduce(fiveBucks.plus(tenFrancs), "USD");

			expect(Money.dollar(10)).toStrictEqual(result);
		});

		// 이미 합친 통화에 또 더하기
		it('10프랑+5달러를 합하고 다시 5달러 합치기', () => {
			const fiveBucks:Expression = Money.dollar(5);
			const tenFrancs:Expression = Money.franc(10);
			// 환율
			bank.addRate("CHF", "USD", 2);
			const sum:Expression = new Sum(fiveBucks, tenFrancs).plus(fiveBucks);

			const result = 
				bank.reduce(sum, "USD");

			expect(Money.dollar(15)).toStrictEqual(result);
		});
	});

	// 환전
	describe('환전 테스트', () => {
		it('프랑을 달러로 변환', () => {
			bank.addRate("CHF", "USD", 2);
			const result:Money = bank.reduce(Money.franc(2), "USD");
			expect(Money.dollar(1)).toStrictEqual(result);
		});

		it('달러를 달러로 변환할 때의 환율', () => {
			expect(1).toStrictEqual(bank.rate("USD", "USD"));
		});
	});
});
