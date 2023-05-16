import { IFeeProcessor } from './IFeeProcessor';
import { Vehicle } from '../Vehicle';

export class AirportFeeProcessor implements IFeeProcessor {
  calculate(hoursDiff: number, vehicle: Vehicle): number {
    const hours = Math.floor(hoursDiff);

    switch (vehicle) {
      case Vehicle.MOTORCYCLE:
      case Vehicle.SCOOTER:
        return this.calculateForSmallVehicles(hours);
      case Vehicle.CAR:
      case Vehicle.SUV:
        return this.calculateForMediumVehicles(hours);
      default:
        throw new Error(`Unsupported vehicle type: ${vehicle}`);
    }
  }

  private calculateForSmallVehicles(hours: number): number {
    if (hours >= 0 && hours < 1) {
      return 0;
    }

    if (hours >= 1 && hours < 8) {
      return 40;
    }

    if (hours >= 8 && hours < 24) {
      return 60;
    }

    return Math.ceil(hours / 24) * 80;
  }

  private calculateForMediumVehicles(hours: number): number {
    if (hours >= 0 && hours < 12) {
      return 60;
    }

    if (hours >= 12 && hours < 24) {
      return 80; // 60 for first 12 hours, 80 for next 12 hours.
    }

    return Math.ceil(hours / 24) * 100;
  }
}
