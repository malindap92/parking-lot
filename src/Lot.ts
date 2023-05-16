import { IFeeProcessor } from './fee-processors/IFeeProcessor';
import { Reciept } from './Reciept';
import { Spot } from './Spot';
import { Ticket } from './Ticket';
import { Vehicle } from './Vehicle';

export class Lot {
  private incrementalTicketNumber = 0;
  private incrementalReceiptNumber = 0;

  private constructor(
    private readonly spots: Spot[],
    private readonly feeProcessor: IFeeProcessor,
  ) {}

  park(vehicle: Vehicle): Ticket {
    for (const spot of this.spots) {
      if (spot.vehicleTypes.includes(vehicle) && spot.isAvailable) {
        spot.isAvailable = false;

        return new Ticket(
          (++this.incrementalTicketNumber).toString().padStart(3, '0'),
          vehicle,
          new Date(),
          spot.number,
        );
      }
    }

    throw new Error(`No available spots for ${vehicle}`);
  }

  unpark(ticket: Ticket): Reciept {
    const exitDateTime = new Date();
    ticket.exitDateTime = exitDateTime;

    const hoursDiff =
      (ticket.exitDateTime.getTime() - ticket.entryDateTime.getTime()) / 36e5;

    const fee = this.feeProcessor.calculate(hoursDiff, ticket.vehicle);

    for (const spot of this.spots) {
      if (spot.number === ticket.spotNumber) {
        spot.isAvailable = true;
        break;
      }
    }

    return new Reciept(
      `R-${(++this.incrementalReceiptNumber).toString().padStart(3, '0')}`,
      ticket,
      fee,
    );
  }

  static Builder = class Builder {
    private smallSpots = 0;
    private mediumSpots = 0;
    private largeSpots = 0;

    constructor(private readonly feeProcessor: IFeeProcessor) {}

    setSmallSpots(count: number): Builder {
      this.smallSpots = count;
      return this;
    }

    setMediumSpots(count: number): Builder {
      this.mediumSpots = count;
      return this;
    }

    setLargeSpots(count: number): Builder {
      this.largeSpots = count;
      return this;
    }

    build(): Lot {
      const spots = [
        ...Array.from(
          { length: this.smallSpots },
          (_, index) =>
            new Spot([Vehicle.MOTORCYCLE, Vehicle.SCOOTER], index + 1),
        ),
        ...Array.from(
          { length: this.mediumSpots },
          (_, index) => new Spot([Vehicle.CAR, Vehicle.SUV], index + 1),
        ),
        ...Array.from(
          { length: this.largeSpots },
          (_, index) => new Spot([Vehicle.BUS, Vehicle.TRUCK], index + 1),
        ),
      ];

      return new Lot(spots, this.feeProcessor);
    }
  };
}
