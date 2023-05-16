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
    // Check the next available spot for the vehicle type and generate a Ticket.
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

    // No available spots therefore throw an error.
    throw new Error(`No available spots for ${vehicle}`);
  }

  unpark(ticket: Ticket): Reciept {
    // Calculate number of hours from entry to exit date/time.
    const exitDateTime = new Date();
    ticket.exitDateTime = exitDateTime;

    const hoursDiff =
      (ticket.exitDateTime.getTime() - ticket.entryDateTime.getTime()) / 36e5;

    // Calculate fee.
    const fee = this.feeProcessor.calculate(hoursDiff, ticket.vehicle);

    // Free up the spot.
    for (const spot of this.spots) {
      if (spot.number === ticket.spotNumber) {
        spot.isAvailable = true;
        break;
      }
    }

    // Generate receipt.
    return new Reciept(
      `R-${(++this.incrementalReceiptNumber).toString().padStart(3, '0')}`,
      ticket,
      fee,
    );
  }

  /**
   * Builder class to create a parking lot with require vehicle spot allocations.
   */
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
