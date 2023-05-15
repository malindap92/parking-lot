import { IFeeProcessor } from './IFeeProcessor';
import { CompletedTicket } from '../Ticket';
import { Vehicle } from '../Vehicle';

export class MallFeeProcessor implements IFeeProcessor {
  calculate(ticket: CompletedTicket): number {
    const hours = Math.ceil(
      (ticket.exitDateTime.getTime() - ticket.entryDateTime.getTime()) / 36e5,
    );

    switch (ticket.vehicle) {
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
