import { IncomeEndCondition, IncomeStartCondition, IIncome } from "./interfacesAndEnums";
import { addNMonthsToDate } from "./helpers";

export class Income implements IIncome
{
    private name: string;
    private monthlyValue: number;
    private startCondition: IncomeStartCondition;
    private endCondition: IncomeEndCondition;
    private simulationStartDate: Date; // This is when TIME starts (iMonth === 0), not when the income starts
    private incomeStartDate: Date;
    private endDate: Date;

    constructor( name: string, monthlyValue: number, startCondition: IncomeStartCondition, endCondition: IncomeEndCondition, simulationStartDate: Date, incomeEndDate?: Date )
    {
        if ( simulationStartDate === undefined )
            throw new Error( "Undefined start date" );

        this.name = name;
        this.monthlyValue = monthlyValue;
        this.startCondition = startCondition;
        this.endCondition = endCondition;

        this.simulationStartDate = simulationStartDate;
        this.incomeStartDate = startCondition === IncomeStartCondition.Immediate ? simulationStartDate : new Date();
        this.endDate = ( endCondition === IncomeEndCondition.Date && incomeEndDate !== undefined ) ? incomeEndDate : new Date( simulationStartDate.getFullYear() + 150, 0 );
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