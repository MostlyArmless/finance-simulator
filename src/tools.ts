import { incomeAndDebtNameCharacterLimit } from './constants';
import { IValidationResult } from './interfacesAndEnums';

export function LinSpace( startValue: number, increment: number, endValue: number ): number[]
{
  const result: number[] = [];

  for ( let i = startValue; i < endValue; i += increment )
  {
    result.push( i );
  }

  return result;
}

const currencyFormatter = new Intl.NumberFormat( undefined, {
  style: 'currency',
  currency: 'CAD',
  currencyDisplay: 'narrowSymbol'

} );

export function formatNumberAsDollars( val: number ): string
{
  return currencyFormatter.format( val );
}

export function validateName( name: string ): IValidationResult
{
  const isValid = name.length <= incomeAndDebtNameCharacterLimit;
  return {
    isValid: isValid,
    errorMessage: isValid ? '' : 'Character limit exceeded'
  };
}