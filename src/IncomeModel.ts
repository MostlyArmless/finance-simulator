import { IncomeEndCondition, IncomeStartCondition, IIncome } from "./interfacesAndEnums";
import { addNMonthsToDate, addNYearsToDate } from "./helpers";

export interface IncomeModelInput
{
    name: string;
    monthlyValue: number;
    startCondition: IncomeStartCondition;
    endCondition: IncomeEndCondition;
    simulationStartDate: Date;
    incomeEndDate?: Date;
}

export class NullIncomeModelInput implements IncomeModelInput
{
    name: string;
    monthlyValue: number;
    startCondition: IncomeStartCondition;
    endCondition: IncomeEndCondition;
    simulationStartDate: Date;
    incomeEndDate?: Date;

    constructor()
    {
        this.name = "";
        this.monthlyValue = 0;
        this.startCondition = IncomeStartCondition.Immediate;
        this.endCondition = IncomeEndCondition.Retirement;
        this.simulationStartDate = new Date();
        this.incomeEndDate = addNYearsToDate( this.simulationStartDate, 20 );
    }
}

export class IncomeModel implements IIncome
{
    name: string;
    monthlyValue: number;
    startCondition: IncomeStartCondition;
    endCondition: IncomeEndCondition;
    private incomeStartDate: Date;
    endDate: Date;
    private simulationStartDate: Date; // This is when TIME starts (iMonth === 0), not when the income starts

    constructor( input: IncomeModelInput )
    {
        if ( input.simulationStartDate === undefined )
            throw new Error( "Undefined start date" );

        this.name = input.name;
        this.monthlyValue = input.monthlyValue;
        this.startCondition = input.startCondition;
        this.endCondition = input.endCondition;

        this.simulationStartDate = input.simulationStartDate;
        this.incomeStartDate = input.startCondition === IncomeStartCondition.Immediate ? input.simulationStartDate : new Date();
        this.endDate = ( input.endCondition === IncomeEndCondition.Date && input.incomeEndDate !== undefined ) ? input.incomeEndDate : new Date( input.simulationStartDate.getFullYear() + 150, 0 );
    }

    GetName(): string
    {
        return this.name;
    }

    GetStartCondition(): IncomeStartCondition
    {
        return this.startCondition;
    }

    GetEndCondition(): IncomeEndCondition
    {
        return this.endCondition;
    }

    GetIncomeStartDate(): Date
    {
        return this.incomeStartDate;
    }

    SetIncomeStartDate( incomeStartDate: Date ): void
    {
        if ( incomeStartDate < this.simulationStartDate )
            throw new Error( "Income can't start before the beginning month" );

        if ( this.endDate && incomeStartDate > this.endDate )
            throw new Error( "Income can't start after it ends" )

        this.incomeStartDate = incomeStartDate;
    }

    GetEndDate(): Date
    {
        return this.endDate;
    }

    SetEndDate( endDate: Date ): void
    {
        if ( endDate < this.simulationStartDate )
            throw new Error( "Income can't end before it begins." );

        this.endDate = endDate;
    }

    GetValueAtMonth( iMonth: number ): number
    {
        const date = addNMonthsToDate( this.simulationStartDate, iMonth );
        if ( this.incomeStartDate <= date && ( this.endDate === null || this.endDate === undefined || date <= this.endDate ) )
        {
            return this.monthlyValue;
        }
        return 0;
    }

    GetFixedAmount(): number
    {
        return this.monthlyValue;
    }
}