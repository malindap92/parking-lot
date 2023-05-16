import { Vehicle } from '../Vehicle';

export interface IFeeProcessor {
  calculate: (hoursDiff: number, vehicle: Vehicle) => number;
}
