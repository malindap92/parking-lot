import { IFeeProcessor } from './IFeeProcessor';

import { Vehicle } from '../Vehicle';

export class MallFeeProcessor implements IFeeProcessor {
  calculate(hoursDiff: number, vehicle: Vehicle): number {
    const hours = Math.ceil(hoursDiff);

    switch (vehicle) {
      case Vehicle.MOTORCYCLE:
      case Vehicle.SCOOTER:
        return hours * 10;
      case Vehicle.CAR:
      case Vehicle.SUV:
        return hours * 20;
      case Vehicle.BUS:
      case Vehicle.TRUCK:
        return hours * 50;
      default:
        throw new Error('Unsupported vehicle type');
    }
  }
}
