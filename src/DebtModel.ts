import { IDebtForCalculator } from './interfacesAndEnums';

export interface IDebtModelInput
{
    name: string;
    initialBalance: number;
    interestRate: number;
    minPayment: number;
    isMortgage?: boolean;
}

export class NullDebtModelInput implements IDebtModelInput
{
  name: string;
  initialBalance: number;
  interestRate: number;
  minPayment: number;
  isMortgage?: boolean;

  constructor()
  {
    this.name = '';
    this.initialBalance = 0;
    this.interestRate = 0;
    this.minPayment = 0;
    this.isMortgage = false;
  }
}

export class DebtModel implements IDebtForCalculator
{
  name: string;
  interestRate: number;
  minPayment: number;
  initialBalance: number;
  isMortgage: boolean;

  private balances: number[];
  private mostRecentlyCompoundedMonth: number;

  constructor( input: IDebtModelInput )
  {
    this.name = input.name;
    this.interestRate = input.interestRate;
    this.minPayment = input.minPayment;

    this.initialBalance = input.initialBalance;
    this.balances = [input.initialBalance];
    this.mostRecentlyCompoundedMonth = -1;
    this.isMortgage = input.isMortgage === undefined ? false : input.isMortgage;
  }

  Print(): void
  {
    console.log( `${this.name} = $${this.GetCurrentBalance().toFixed( 2 )}` );
  }

  MakePayment( paymentAmount: number, iMonth: number ): number
  {
    this.throwIfInterestAlreadyApplied( iMonth );
    return this.subtractPaymentFromMonthlyBalance( iMonth, paymentAmount );
  }

  MakeMinPayment( iMonth: number ): number
  {
    return this.MakePayment( this.minPayment, iMonth );
  }

  private throwIfInterestAlreadyApplied( iMonth: number )
  {
    if ( this.mostRecentlyCompoundedMonth !== null && this.mostRecentlyCompoundedMonth >= iMonth )
      throw new Error( `Can't make a payment in month ${iMonth}, you've already applied interest as late as month ${this.mostRecentlyCompoundedMonth}` );
  }

  GetBalanceAtMonth( iMonth: number ): number
  {
    if ( iMonth < 0 )
      throw new Error( 'Can\'t get balance for negative month indices' );

    return this.balances[iMonth];
  }

  GetCurrentBalance(): number
  {
    return this.balances[this.balances.length - 1];
  }

  // Call this after all payments have been made in the given month. This will set the starting balance for the subsequent month.
  ApplyInterest( iMonth: number ): void
  {
    if ( iMonth < 0 )
      throw new Error( 'Can\'t apply interest to months with negative indices' );

    if ( iMonth !== 0 && this.mostRecentlyCompoundedMonth !== iMonth - 1 )
      throw new Error( `Attempted to apply interest to month ${iMonth} when the most recently compounded month was ${this.mostRecentlyCompoundedMonth}` );

    this.mostRecentlyCompoundedMonth = iMonth;

    if ( this.isMortgage )
    {
      // Mortgages don't compound interest, they're just fixed-payment amounts. Just carry forward whatever balance we have for this month (assumes all payments have already been made.)
      this.balances[iMonth + 1] = this.balances[iMonth];
      return;
    }

    const newBalance = this.GetCurrentBalance() * ( 1 + this.interestRate );
    this.balances[iMonth + 1] = newBalance;
  }

  private subtractPaymentFromMonthlyBalance( iMonth: number, paymentAmount: number ): number
  {
    const currentBalance = this.GetCurrentBalance();
    const actualPayment = Math.min( currentBalance, paymentAmount );
    this.balances[iMonth] = currentBalance - actualPayment;
    return actualPayment;
  }

  GetBalances(): number[]
  {
    const balancesCopy = this.balances.slice();
    balancesCopy.unshift( this.initialBalance );
    return balancesCopy;
  }

  getIsMortgage(): boolean
  {
    return this.isMortgage;
  }
}