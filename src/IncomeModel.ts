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

// TODO this is part of my attempt to convince TypeScript to let me create a single updater function. Not used right now.
export type PropTypes<Type> = {
    [Property in keyof Type]: Type[Property]
};

export type IncomeModelKeyTypes = keyof IncomeModel;
export type IncomeModelValTypes = IncomeModel[keyof IncomeModel];

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
    public name: string;
    public monthlyValue: number;
    public startCondition: IncomeStartCondition;
    public endCondition: IncomeEndCondition;
    public endDate: Date;
    public simulationStartDate: Date; // This is when TIME starts (iMonth === 0), not when the income starts
    public startDate: Date;

    constructor( input: IncomeModelInput )
    {
        if ( input.simulationStartDate === undefined )
            throw new Error( "Undefined start date" );

        this.name = input.name;
        this.monthlyValue = input.monthlyValue;
        this.startCondition = input.startCondition;
        this.endCondition = input.endCondition;

        this.simulationStartDate = input.simulationStartDate;
        this.startDate = input.startCondition === IncomeStartCondition.Immediate ? input.simulationStartDate : new Date();
        this.endDate = ( input.endCondition === IncomeEndCondition.Date && input.incomeEndDate !== undefined ) ? input.incomeEndDate : new Date( input.simulationStartDate.getFullYear() + 150, 0 );
    }

    GetName(): string
    {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    GetStartCondition(): IncomeStartCondition
    {
        return this.startCondition;
    }

    setStartCondition(condition: IncomeStartCondition): void {
        this.startCondition = condition;
    }

    GetEndCondition(): IncomeEndCondition
    {
        return this.endCondition;
    }

    setEndCondition(condition: IncomeEndCondition): void {
        this.endCondition = condition;
    }

    GetIncomeStartDate(): Date
    {
        return this.startDate;
    }

    SetIncomeStartDate( incomeStartDate: Date ): void
    {
        if ( incomeStartDate < this.simulationStartDate )
            throw new Error( "Income can't start before the beginning month" );

        if ( this.endDate && incomeStartDate > this.endDate )
            throw new Error( "Income can't start after it ends" )

        this.startDate = incomeStartDate;
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
        if ( this.startDate <= date && ( this.endDate === null || this.endDate === undefined || date <= this.endDate ) )
        {
            return this.monthlyValue;
        }
        return 0;
    }

    getMonthlyValue(): number
    {
        return this.monthlyValue;
    }

    setMonthlyValue(val: number): void {
        this.monthlyValue = val;
    }
}