import { IForecastResult, IncomeEndCondition, IncomeStartCondition, IForecastInput, IIncome, IDebt, DebtContributionStrategy } from "./interfaces";
import { addNMonthsToDate } from "./helpers";

export function forecast( args: IForecastInput ): IForecastResult
{
    let isRetired: boolean = false; // This flag should be set to true as soon as savings hits the 
    let remainingTotalDebt: number[] = Array( args.numMonthsToProject );
    let savingsOverTime = [];
    savingsOverTime.push( args.initialSavings === undefined ? 0 : args.initialSavings );
    let iMonth = 0;
    let iRetirementMonth = -1; // Initialize to nonsense value
    let currentDate: Date;

    const requiredSavingsToRetire = getRequiredSavingsToRetire( args.incomes, args.desiredMonthlyBudgetPostRetirement );

    for ( iMonth = 0; iMonth < args.numMonthsToProject; iMonth++ )
    {
        currentDate = addNMonthsToDate( args.startDate, iMonth );

        if ( currentDate >= args.deathDate )
            break; // Stop forecasting, you're dead.

        const allDebtsArePaid: boolean = AllDebtsArePaid( args.debts );

        if ( !isRetired && allDebtsArePaid && savingsOverTime[iMonth] >= requiredSavingsToRetire )
        {
            // We JUST reached retirement
            isRetired = true;
            iRetirementMonth = iMonth;
            // eslint-disable-next-line no-loop-func
            args.incomes.forEach( ( income ) =>
            {
                if ( income.GetStartCondition() === IncomeStartCondition.Retirement )
                    income.SetIncomeStartDate( currentDate );

                if ( income.GetEndCondition() === IncomeEndCondition.Retirement )
                    income.SetEndDate( currentDate );
            } );
        }

        const totalMonthlyIncome = calculateTotalMonthlyIncome( args.incomes, iMonth );

        let monthlySpendingPool = totalMonthlyIncome - args.essentialNonDebtSpendingPreRetirement;

        if ( !allDebtsArePaid )
        {
            let { updatedMonthlySpendingPool, updatedDebts } = contributeToDebts( monthlySpendingPool, args.debts, iMonth, args.debtContributionStrategy );
            updatedDebts = ApplyInterestToDebts( updatedDebts, iMonth ); // Determines the next month's balance of each debt
            monthlySpendingPool = updatedMonthlySpendingPool;
            args.debts = updatedDebts;
        }

        // Any leftover money once debts are paid goes into savings
        savingsOverTime = contributeToSavings( savingsOverTime, iMonth, monthlySpendingPool );

        remainingTotalDebt[iMonth + 1] = args.debts.map( debt => debt.GetCurrentBalance() ).reduce( ( a, b ) => a + b );
    }

    const result: IForecastResult = {
        numMonthsToReachRetirementGoal: iRetirementMonth,
        savingsOverTime: savingsOverTime,
        incomesOverTime: args.incomes,
        debts: args.debts,
        totalDebtVsTime: remainingTotalDebt,
        requiredSavingsToRetire: requiredSavingsToRetire
    };

    return result;
}

export function getRequiredSavingsToRetire( incomes: IIncome[], desiredMonthlyBudgetPostRetirement: number ): number
{
    let contributionFromPensions = getContributionOfPensionsToPostRetirementSpending( incomes );

    if ( contributionFromPensions >= desiredMonthlyBudgetPostRetirement )
        return 0; // Don't return negative numbers.

    const monthlyAmountThatComesFromSavings = desiredMonthlyBudgetPostRetirement - contributionFromPensions;


    // source:
    // https://www.mrmoneymustache.com/2012/05/29/how-much-do-i-need-for-retirement/
    const requiredSavingsToRetire = ( monthlyAmountThatComesFromSavings ) * 12 * 25; // 25 year factor corresponds to a 4% safe withdrawal rate.
    return requiredSavingsToRetire;
}

export function getContributionOfPensionsToPostRetirementSpending( incomes: IIncome[] ): number
{
    let contributionFromPensions = 0;
    incomes.forEach( income =>
    {
        if ( income.GetStartCondition() === IncomeStartCondition.Retirement )
        {
            contributionFromPensions += income.GetFixedAmount();
        }
    } );

    return contributionFromPensions;
}

export function calculateTotalMonthlyIncome( incomes: IIncome[], iMonth: number ): number
{
    let totalMonthlyIncome = 0;

    incomes.forEach( income =>
    {
        totalMonthlyIncome += income.GetValueAtMonth( iMonth );
    } );

    return totalMonthlyIncome;
}

export function contributeToDebts( monthlySpendingPool: number, debts: IDebt[], iMonth: number, strategy: DebtContributionStrategy ): { updatedMonthlySpendingPool: number, updatedDebts: IDebt[] }
{
    monthlySpendingPool = makeMinimumPaymentOnAllDebts( debts, iMonth, monthlySpendingPool );

    let priorityDebt: IDebt | null;
    let allDebtsArePaid: boolean = false;
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

export function ApplyInterestToDebts( debts: IDebt[], iMonth: number ): IDebt[]
{
    debts.forEach( debt =>
    {
        debt.ApplyInterest( iMonth );
    } );

    return debts;
}

export function contributeToSavings( savings: number[], iMonth: number, amountToContribute: number ): number[]
{
    const nextMonthSavingsStartingBalance = savings[iMonth] += amountToContribute;

    savings[iMonth + 1] = nextMonthSavingsStartingBalance;
    return savings;
}

export function makeMinimumPaymentOnAllDebts( debts: IDebt[], iMonth: number, monthlySpendingPool: number )
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

export function GetUnpaidDebtWithLowestBalance( debts: IDebt[] ): IDebt | null
{
    let lowestBalanceDebt: IDebt = debts[0];
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

export function GetUnpaidDebtWithHighestInterest( debts: IDebt[] ): IDebt | null
{
    let highestInterestUnpaidDebt: IDebt = debts[0];

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

export function AllDebtsArePaid( debts: IDebt[] ): boolean
{
    for ( let i = 0; i < debts.length; i++ )
    {
        if ( debts[i].GetCurrentBalance() > 0 )
            return false;
    }

    return true;
}