import
{
  IForecastResult,
  IncomeEndCondition,
  IncomeStartCondition,
  IForecastInput,
  IDebtForCalculator,
  DebtContributionStrategy,
  IIncome,
  IIncomeForCalculator,
} from './interfacesAndEnums';
import { addNMonthsToDate } from './helpers';
import { DebtModel } from './DebtModel';
import { IncomeModel } from './IncomeModel';

function justSatisfiedRetirementConditions( isRetired: boolean, allDebtsArePaid: boolean, savingsOverTime: number[], iMonth: number, requiredSavingsToRetire: number )
{
  return !isRetired && allDebtsArePaid && savingsOverTime[iMonth] >= requiredSavingsToRetire;
}

const nullForecastResult: IForecastResult = {
  numMonthsToReachRetirementGoal: Number.POSITIVE_INFINITY,
  savingsOverTime: [],
  incomesOverTime: [],
  debts: [],
  totalDebtVsTime: [],
  requiredSavingsToRetire: Number.POSITIVE_INFINITY,
};

export function forecast( input: IForecastInput ): IForecastResult
{
  if ( input.incomes.length === 0 && input.debts.length === 0 )
  {
    return nullForecastResult;
  }

  let isRetired = false; // This flag should be set to true as soon as savings hits the 
  const remainingTotalDebt: number[] = Array( input.numMonthsToProject );
  let savingsOverTime: number[] = [];
  let debts: DebtModel[] = input.debts.map( debt =>
  {
    return new DebtModel( {
      name: debt.name,
      initialBalance: debt.initialBalance,
      interestRate: debt.interestRate,
      minPayment: debt.minPayment,
      isMortgage: debt.isMortgage,
    } );
  } );
  const incomes: IncomeModel[] = input.incomes.map( income =>
  {
    return new IncomeModel( {
      name: income.name,
      simulationStartDate: income.startDate || input.startDate,
      incomeEndDate: income.endDate,
      endCondition: income.endCondition,
      monthlyValue: income.monthlyValue,
      startCondition: income.startCondition
    } );
  } );
  savingsOverTime.push( input.initialSavings === undefined ? 0 : input.initialSavings );
  let iMonth = 0;
  let iRetirementMonth = -1; // Initialize to nonsense value

  const requiredSavingsToRetire = getRequiredSavingsToRetire( incomes, input.desiredMonthlyBudgetPostRetirement );

  for ( iMonth = 0; iMonth < input.numMonthsToProject; iMonth++ )
  {
    const currentDate: Date = addNMonthsToDate( input.startDate, iMonth );

    if ( currentDate >= input.deathDate )
      break; // Stop forecasting, you're dead.

    const allDebtsArePaid: boolean = AllDebtsArePaid( debts );

    if ( justSatisfiedRetirementConditions( isRetired, allDebtsArePaid, savingsOverTime, iMonth, requiredSavingsToRetire ) )
    {
      isRetired = true;
      iRetirementMonth = iMonth;
      incomes.forEach( ( income ) =>
      {
        if ( income.startCondition === IncomeStartCondition.Retirement )
          income.SetIncomeStartDate( currentDate );

        if ( income.endCondition === IncomeEndCondition.Retirement )
          income.endDate = currentDate;
      } );
    }

    const totalMonthlyIncome = calculateTotalMonthlyIncome( incomes, iMonth );

    let monthlySpendingPool = totalMonthlyIncome - input.essentialNonDebtSpendingPreRetirement;

    if ( !allDebtsArePaid )
    {
      const { updatedMonthlySpendingPool, updatedDebts } = contributeToDebts( monthlySpendingPool, debts, iMonth, input.debtContributionStrategy );
      ApplyInterestToDebts( updatedDebts, iMonth ); // Determines the next month's balance of each debt
      monthlySpendingPool = updatedMonthlySpendingPool;
      debts = updatedDebts;
    }

    // Any leftover money once debts are paid goes into savings
    savingsOverTime = contributeToSavings( savingsOverTime, iMonth, monthlySpendingPool );

    remainingTotalDebt[iMonth + 1] = debts.map( debt => debt.GetCurrentBalance() ).reduce( ( a, b ) => a + b );
  }

  const result: IForecastResult = {
    numMonthsToReachRetirementGoal: iRetirementMonth === -1 ? Number.POSITIVE_INFINITY : iRetirementMonth,
    savingsOverTime: savingsOverTime,
    incomesOverTime: incomes,
    debts: debts,
    totalDebtVsTime: remainingTotalDebt,
    requiredSavingsToRetire: requiredSavingsToRetire
  };

  return result;
}

export function getRequiredSavingsToRetire( incomes: IIncomeForCalculator[], desiredMonthlyBudgetPostRetirement: number ): number
{
  const contributionFromPensions = getContributionOfPensionsToPostRetirementSpending( incomes );

  if ( contributionFromPensions >= desiredMonthlyBudgetPostRetirement )
    return 0; // Don't return negative numbers.

  const monthlyAmountThatComesFromSavings = desiredMonthlyBudgetPostRetirement - contributionFromPensions;


  // source:
  // https://www.mrmoneymustache.com/2012/05/29/how-much-do-i-need-for-retirement/
  const requiredSavingsToRetire = ( monthlyAmountThatComesFromSavings ) * 12 * 25; // 25 year factor corresponds to a 4% safe withdrawal rate.
  return requiredSavingsToRetire;
}

export function getContributionOfPensionsToPostRetirementSpending( incomes: IIncomeForCalculator[] ): number
{
  let contributionFromPensions = 0;
  incomes.forEach( income =>
  {
    if ( income.GetStartCondition() === IncomeStartCondition.Retirement )
    {
      contributionFromPensions += income.getMonthlyValue();
    }
  } );

  return contributionFromPensions;
}

export function calculateTotalMonthlyIncome( incomes: IIncome[], iMonth: number ): number
{
  let totalMonthlyIncome = 0;

  incomes.forEach( income =>
  {
    totalMonthlyIncome += GetValueAtMonth( income, iMonth );
  } );

  return totalMonthlyIncome;
}

function GetValueAtMonth( income: IIncome, iMonth: number ): number
{
  const date = addNMonthsToDate( income.startDate as Date, iMonth );
  if ( ( income.startDate as Date ) <= date
    && ( income.endDate === null || income.endDate === undefined || date <= income.endDate ) )
  {
    return income.monthlyValue;
  }
  return 0;
}

export function contributeToDebts( monthlySpendingPool: number, debts: DebtModel[], iMonth: number, strategy: DebtContributionStrategy ): { updatedMonthlySpendingPool: number, updatedDebts: DebtModel[] }
{
  monthlySpendingPool = makeMinimumPaymentOnAllDebts( debts, iMonth, monthlySpendingPool );

  let priorityDebt: IDebtForCalculator | null;
  let allDebtsArePaid = false;
  while ( monthlySpendingPool > 0 )
  {
    switch ( strategy )
    {
      case DebtContributionStrategy.HighestInterestFirst:
        {
          priorityDebt = GetUnpaidDebtWithHighestInterest( debts );
          break;
        }
      case DebtContributionStrategy.LowestBalanceFirst:
        {
          priorityDebt = GetUnpaidDebtWithLowestBalance( debts );
          break;
        }
      default:
        throw new Error( `Unexpected DebtContributionStrategy "${strategy}"` );
    }

    if ( priorityDebt === null )
    {
      allDebtsArePaid = true;
      break;
    }

    const intendedPayment = Math.min( priorityDebt.GetCurrentBalance(), monthlySpendingPool );
    const actualPayment = priorityDebt.MakePayment( intendedPayment, iMonth );
    monthlySpendingPool -= actualPayment;

    if ( allDebtsArePaid )
      break;
  }

  return { updatedMonthlySpendingPool: monthlySpendingPool, updatedDebts: debts };
}

export function ApplyInterestToDebts( debts: DebtModel[], iMonth: number ): void
{
  debts.forEach( debt =>
  {
    debt.ApplyInterest( iMonth );
  } );
}

export function contributeToSavings( savings: number[], iMonth: number, amountToContribute: number ): number[]
{
  const nextMonthSavingsStartingBalance = savings[iMonth] += amountToContribute;

  savings[iMonth + 1] = nextMonthSavingsStartingBalance;
  return savings;
}

export function makeMinimumPaymentOnAllDebts( debts: DebtModel[], iMonth: number, monthlySpendingPool: number )
{
  debts.forEach( debt =>
  {
    if ( debt.GetCurrentBalance() > 0 )
    {
      const actualPayment = debt.MakeMinPayment( iMonth );
      monthlySpendingPool -= actualPayment;
    }
  } );

  return monthlySpendingPool;
}

export function GetUnpaidDebtWithLowestBalance( debts: IDebtForCalculator[] ): IDebtForCalculator | null
{
  let lowestBalanceDebt: IDebtForCalculator = debts[0];
  let minBalanceSoFar = Number.MAX_VALUE;

  debts.forEach( debt =>
  {
    if ( debt.GetCurrentBalance() === 0 )
      return;

    if ( debt.GetCurrentBalance() < minBalanceSoFar )
    {
      lowestBalanceDebt = debt;
      minBalanceSoFar = debt.GetCurrentBalance();
    }
  } );

  return ( lowestBalanceDebt.GetCurrentBalance() === 0 ) ? null : lowestBalanceDebt;
}

export function GetUnpaidDebtWithHighestInterest( debts: IDebtForCalculator[] ): IDebtForCalculator | null
{
  let highestInterestUnpaidDebt: IDebtForCalculator = debts[0];

  debts.forEach( debt =>
  {
    if ( ( debt.GetCurrentBalance() > 0 && debt.interestRate > highestInterestUnpaidDebt.interestRate ) )
    {
      highestInterestUnpaidDebt = debt;
    }
  } );

  if ( highestInterestUnpaidDebt === null )
    return null;
  else
  {
    return highestInterestUnpaidDebt.GetCurrentBalance() === 0 ? null : highestInterestUnpaidDebt;
  }
}

export function AllDebtsArePaid( debts: DebtModel[] ): boolean
{
  for ( let i = 0; i < debts.length; i++ )
  {
    if ( debts[i].GetCurrentBalance() > 0 )
      return false;
  }

  return true;
}