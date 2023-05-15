import { IFeeProcessor } from './IFeeProcessor';
import { CompletedTicket } from '../Ticket';
import { Vehicle } from '../Vehicle';

export class StadiumFeeProcessor implements IFeeProcessor {
  calculate(ticket: CompletedTicket): number {
    const hours = Math.floor(
      (ticket.exitDateTime.getTime() - ticket.entryDateTime.getTime()) / 36e5,
    );

    switch (ticket.vehicle) {
      case Vehicle.MOTORCYCLE:
      case Vehicle.SCOOTER:
        return this.calculateForSmallVehicles(hours);
      case Vehicle.CAR:
      case Vehicle.SUV:
        return this.calculateForMediumVehicles(hours);
      default:
        throw new Error(`Unsupported vehicle type: ${ticket.vehicle}`);
    }
  }

  calculateForSmallVehicles(hours: number): number {
    if (hours >= 0 && hours < 4) {
      return 30;
    }

    if (hours >= 4 && hours < 12) {
      return 90; // 30 for first 4 hours, 60 for next 8 hours.
    }

    return 90 + (hours - 11) * 100; // 30 for first 4 hours, 60 for next 8 hours and 100 per following hour.
  }

  calculateForMediumVehicles(hours: number): number {
    if (hours >= 0 && hours < 4) {
      return 60;
    }

    if (hours >= 4 && hours < 12) {
      return 180; // 60 for first 4 hours, 120 for next 8 hours.
    }

    return 180 + (hours - 11) * 200; // 60 for first 4 hours, 120 for next 8 hours and 200 per following hour.
  }
}
