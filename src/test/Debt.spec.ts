import { DebtModel } from '../DebtModel';
import { IDebtForCalculator } from '../interfacesAndEnums';

describe( 'Debt', () =>
{
  let testSubject: IDebtForCalculator;

  beforeEach( () =>
  {
    testSubject = new DebtModel( {
      name: 'Credit Card',
      initialBalance: 100,
      interestRate: 0.05,
      minPayment: 20
    } );
  } );

  it( 'Initializes correctly', () =>
  {
    expect( testSubject.GetCurrentBalance() ).toEqual( 100 );
    expect( testSubject.GetBalanceAtMonth( 0 ) ).toEqual( 100 );
    expect( testSubject.interestRate ).toEqual( 0.05 );
    expect( testSubject.name ).toEqual( 'Credit Card' );
    expect( testSubject.minPayment ).toEqual( 20 );
  } );

  it( 'Should throw error when asked to get a balance at a negative month index', () =>
  {
    expect( () => testSubject.GetBalanceAtMonth( -1 ) ).toThrow();
  } );

  it( 'MakeMinPayment', () =>
  {
    testSubject.MakeMinPayment( 0 );

    expect( testSubject.GetCurrentBalance() ).toEqual( 80 );
    expect( testSubject.GetBalanceAtMonth( 0 ) ).toEqual( 80 );
  } );

  it( 'MakePayment', () =>
  {
    testSubject.MakePayment( 60, 0 );

    expect( testSubject.GetCurrentBalance() ).toEqual( 40 );
    expect( testSubject.GetBalanceAtMonth( 0 ) ).toEqual( 40 );
  } );

  it( 'Making a payment larger than the remaining balance reduces balance to zero and returns the actual payment amount', () =>
  {
    const creditCardDebt = new DebtModel( {
      name: 'Almost paid-off card',
      initialBalance: 20,
      interestRate: 0.05,
      minPayment: 50,
      isMortgage: false
    } );
    const mortgage = new DebtModel( {
      name: 'Almost paid-off mortgage',
      initialBalance: 20,
      interestRate: 0.05,
      minPayment: 50,
      isMortgage: true
    } );

    let actualPayment = creditCardDebt.MakeMinPayment( 0 );
    expect( actualPayment ).toEqual( 20 );
    expect( creditCardDebt.GetCurrentBalance() ).toEqual( 0 );

    actualPayment = mortgage.MakeMinPayment( 0 );
    expect( actualPayment ).toEqual( 20 );
    expect( mortgage.GetCurrentBalance() ).toEqual( 0 );
  } );

  it( 'Not allowed to MakePayment after calling ApplyInterest for a given month', () =>
  {
    testSubject.ApplyInterest( 0 );
    expect( () => testSubject.MakeMinPayment( 0 ) ).toThrow();
  } );

  it( 'Not allowed to MakeMinPayment after calling ApplyInterest for a given month', () =>
  {
    testSubject.ApplyInterest( 0 );
    expect( () => { testSubject.MakePayment( 10, 0 ); } ).toThrow();
  } );

  it( 'ApplyInterest after making payment correctly calculates next month\'s interest', () =>
  {
    testSubject.MakePayment( 50, 0 );
    testSubject.ApplyInterest( 0 );
    expect( testSubject.GetBalanceAtMonth( 1 ) ).toEqual( 50 * 1.05 );
  } );

  it( 'Can call ApplyInterest and get the correct next balance without ever making a payment', () =>
  {
    testSubject.ApplyInterest( 0 );
    expect( testSubject.GetBalanceAtMonth( 1 ) ).toEqual( 100 * 1.05 );
  } );

  it( 'Compounding interest across months works correctly', () =>
  {
    const expectedMonth1Balance = 70 * 1.05;
    const expectedMonth2Balance = ( expectedMonth1Balance - 20 ) * 1.05;

    testSubject.MakeMinPayment( 0 );
    testSubject.MakePayment( 10, 0 );
    testSubject.ApplyInterest( 0 );
    expect( testSubject.GetBalanceAtMonth( 1 ) ).toEqual( expectedMonth1Balance );
    testSubject.MakeMinPayment( 1 );
    testSubject.ApplyInterest( 1 );
    expect( testSubject.GetBalanceAtMonth( 2 ) ).toEqual( expectedMonth2Balance );
  } );

  it( 'Getting balance of month beyond where most recent interest has been applied return undefined', () =>
  {
    expect( testSubject.GetBalanceAtMonth( 1 ) ).toBeUndefined();
    testSubject.ApplyInterest( 0 );
    expect( testSubject.GetBalanceAtMonth( 1 ) ).toEqual( 100 * 1.05 );
  } );

  it( 'Can\'t ApplyInterest to any month other than the one after the last month to which to you applied interest', () =>
  {
    expect( () => testSubject.ApplyInterest( 1 ) ).toThrow();
    testSubject.ApplyInterest( 0 );
    expect( () => testSubject.ApplyInterest( 1 ) ).not.toThrow();
    expect( () => testSubject.ApplyInterest( 3 ) ).toThrow();
  } );

  it( 'Calling ApplyInterest on a mortgage just copies the current balance to next month', () =>
  {
    testSubject = new DebtModel( {
      name: 'Mortgage',
      initialBalance: 250000,
      interestRate: 0.05,
      minPayment: 2000,
      isMortgage: true
    } );
    expect( testSubject.GetBalanceAtMonth( 0 ) ).toEqual( 250000 );

    testSubject.MakeMinPayment( 0 );
    expect( testSubject.GetBalanceAtMonth( 1 ) ).toBeUndefined; // No balance has carried forward yet

    testSubject.ApplyInterest( 0 );

    expect( testSubject.GetBalanceAtMonth( 0 ) ).toEqual( 250000 - 2000 );
    expect( testSubject.GetBalanceAtMonth( 1 ) ).toEqual( 250000 - 2000 );
  } );
} );