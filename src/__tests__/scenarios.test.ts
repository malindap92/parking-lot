import { AirportFeeProcessor } from '../fee-processors/AirportFeeProcessor';
import { MallFeeProcessor } from '../fee-processors/MallFeeProcessor';
import { StadiumFeeProcessor } from '../fee-processors/StadiumFeeProcessor';
import { Lot } from '../Lot';
import { Vehicle } from '../Vehicle';

describe('Scenarios', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should work for scenario 1 - small parking lot with mall fee model', () => {
    const feeProcessor = new MallFeeProcessor();
    const lot = new Lot.Builder(feeProcessor).setSmallSpots(2).build();

    // Park motorcycle 1.
    jest.setSystemTime(new Date('2022-05-29T14:04:07.000Z'));

    const ticket1 = lot.park(Vehicle.MOTORCYCLE);

    expect(ticket1.ticketId).toEqual('001');
    expect(ticket1.vehicle).toEqual(Vehicle.MOTORCYCLE);
    expect(ticket1.entryDateTime).toEqual(new Date('2022-05-29T14:04:07.000Z'));
    expect(ticket1.exitDateTime).toBeNull();
    expect(ticket1.spotNumber).toEqual(1);

    // Park scooter 1.
    jest.setSystemTime(new Date('2022-05-29T14:44:07.000Z'));

    const ticket2 = lot.park(Vehicle.SCOOTER);

    expect(ticket2.ticketId).toEqual('002');
    expect(ticket2.vehicle).toEqual(Vehicle.SCOOTER);
    expect(ticket2.entryDateTime).toEqual(new Date('2022-05-29T14:44:07.000Z'));
    expect(ticket1.exitDateTime).toBeNull();
    expect(ticket2.spotNumber).toEqual(2);

    // Park scooter 2.
    expect(() => {
      lot.park(Vehicle.SCOOTER);
    }).toThrowError(`No available spots for ${Vehicle.SCOOTER}`);

    // Unpark scooter 1, ticket number 002.
    jest.setSystemTime(new Date('2022-05-29T15:40:07.000Z'));

    const receipt1 = lot.unpark(ticket2);

    expect(receipt1.receiptId).toEqual('R-001');
    expect(receipt1.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T14:44:07.000Z'),
    );
    expect(receipt1.ticket.exitDateTime).toEqual(
      new Date('2022-05-29T15:40:07.000Z'),
    );
    expect(receipt1.fee).toEqual(10);

    // Park motorcycle 2.
    jest.setSystemTime(new Date('2022-05-29T15:59:07.000Z'));

    const ticket3 = lot.park(Vehicle.MOTORCYCLE);

    expect(ticket3.ticketId).toEqual('003');
    expect(ticket3.vehicle).toEqual(Vehicle.MOTORCYCLE);
    expect(ticket3.entryDateTime).toEqual(new Date('2022-05-29T15:59:07.000Z'));
    expect(ticket3.exitDateTime).toBeNull();
    expect(ticket3.spotNumber).toEqual(2);

    // Unpark motorcycle 1, ticket number 001.
    jest.setSystemTime(new Date('2022-05-29T17:44:07.000Z'));

    const receipt2 = lot.unpark(ticket1);

    expect(receipt2.receiptId).toEqual('R-002');
    expect(receipt2.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T14:04:07.000Z'),
    );
    expect(receipt2.ticket.exitDateTime).toEqual(
      new Date('2022-05-29T17:44:07.000Z'),
    );
    expect(receipt2.fee).toEqual(40);
  });

  it('should work for scenario 2 - mall parking lot', () => {
    const feeProcessor = new MallFeeProcessor();
    const lot = new Lot.Builder(feeProcessor)
      .setSmallSpots(100)
      .setMediumSpots(80)
      .setLargeSpots(10)
      .build();

    // Park motorcycle.
    jest.setSystemTime(new Date('2022-05-29T12:00:00.000Z'));

    const ticket1 = lot.park(Vehicle.MOTORCYCLE);

    expect(ticket1.ticketId).toEqual('001');
    expect(ticket1.vehicle).toEqual(Vehicle.MOTORCYCLE);
    expect(ticket1.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket1.exitDateTime).toBeNull();
    expect(ticket1.spotNumber).toEqual(1);

    // Park car.
    const ticket2 = lot.park(Vehicle.CAR);

    expect(ticket2.ticketId).toEqual('002');
    expect(ticket2.vehicle).toEqual(Vehicle.CAR);
    expect(ticket2.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket2.exitDateTime).toBeNull();
    expect(ticket2.spotNumber).toEqual(1);

    // Park truck.
    const ticket3 = lot.park(Vehicle.TRUCK);

    expect(ticket3.ticketId).toEqual('003');
    expect(ticket3.vehicle).toEqual(Vehicle.TRUCK);
    expect(ticket3.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket3.exitDateTime).toBeNull();
    expect(ticket3.spotNumber).toEqual(1);

    // Unpark motorcycle, ticket number 001.
    jest.setSystemTime(new Date('2022-05-29T15:30:00.000Z')); // 3 hours 30 mins.

    const receipt1 = lot.unpark(ticket1);

    expect(receipt1.receiptId).toEqual('R-001');
    expect(receipt1.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt1.ticket.exitDateTime).toEqual(
      new Date('2022-05-29T15:30:00.000Z'),
    );
    expect(receipt1.fee).toEqual(40);

    // Unpark car, ticket number 002.
    jest.setSystemTime(new Date('2022-05-29T18:01:00.000Z')); // 6 hours 1 min.

    const receipt2 = lot.unpark(ticket2);

    expect(receipt2.receiptId).toEqual('R-002');
    expect(receipt2.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt2.ticket.exitDateTime).toEqual(
      new Date('2022-05-29T18:01:00.000Z'),
    );
    expect(receipt2.fee).toEqual(140);

    // Unpark truck, ticket number 003.
    jest.setSystemTime(new Date('2022-05-29T13:59:00.000Z')); // 1 hour 59 mins.

    const receipt3 = lot.unpark(ticket3);

    expect(receipt3.receiptId).toEqual('R-003');
    expect(receipt3.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt3.ticket.exitDateTime).toEqual(
      new Date('2022-05-29T13:59:00.000Z'),
    );
    expect(receipt3.fee).toEqual(100);
  });

  it('should work for scenario 3 - stadium parking lot', () => {
    const feeProcessor = new StadiumFeeProcessor();
    const lot = new Lot.Builder(feeProcessor)
      .setSmallSpots(1000)
      .setMediumSpots(1500)
      .build();

    // Park motorcycle 1.
    jest.setSystemTime(new Date('2022-05-29T12:00:00.000Z'));

    const ticket1 = lot.park(Vehicle.MOTORCYCLE);

    expect(ticket1.ticketId).toEqual('001');
    expect(ticket1.vehicle).toEqual(Vehicle.MOTORCYCLE);
    expect(ticket1.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket1.exitDateTime).toBeNull();
    expect(ticket1.spotNumber).toEqual(1);

    // Park motorcycle 2.
    const ticket2 = lot.park(Vehicle.MOTORCYCLE);

    expect(ticket2.ticketId).toEqual('002');
    expect(ticket2.vehicle).toEqual(Vehicle.MOTORCYCLE);
    expect(ticket2.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket2.exitDateTime).toBeNull();
    expect(ticket2.spotNumber).toEqual(2);

    // Park SUV 1.
    const ticket3 = lot.park(Vehicle.SUV);

    expect(ticket3.ticketId).toEqual('003');
    expect(ticket3.vehicle).toEqual(Vehicle.SUV);
    expect(ticket3.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket3.exitDateTime).toBeNull();
    expect(ticket3.spotNumber).toEqual(1);

    // Park SUV 2.
    const ticket4 = lot.park(Vehicle.SUV);

    expect(ticket4.ticketId).toEqual('004');
    expect(ticket4.vehicle).toEqual(Vehicle.SUV);
    expect(ticket4.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket4.exitDateTime).toBeNull();
    expect(ticket4.spotNumber).toEqual(2);

    // Unpark motorcycle 1, ticket number 001.
    jest.setSystemTime(new Date('2022-05-29T15:40:00.000Z')); // 3 hours 40 mins.

    const receipt1 = lot.unpark(ticket1);

    expect(receipt1.receiptId).toEqual('R-001');
    expect(receipt1.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt1.ticket.exitDateTime).toEqual(
      new Date('2022-05-29T15:40:00.000Z'),
    );
    expect(receipt1.fee).toEqual(30);

    // Unpark motorcycle 2, ticket number 002.
    jest.setSystemTime(new Date('2022-05-30T02:59:00.000Z')); // 14 hours 59 mins.

    const receipt2 = lot.unpark(ticket2);

    expect(receipt2.receiptId).toEqual('R-002');
    expect(receipt2.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt2.ticket.exitDateTime).toEqual(
      new Date('2022-05-30T02:59:00.000Z'),
    );
    expect(receipt2.fee).toEqual(390);

    // Unpark SUV 1, ticket number 003.
    jest.setSystemTime(new Date('2022-05-29T23:30:00.000Z')); // 11 hours 30 mins.

    const receipt3 = lot.unpark(ticket3);

    expect(receipt3.receiptId).toEqual('R-003');
    expect(receipt3.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt3.ticket.exitDateTime).toEqual(
      new Date('2022-05-29T23:30:00.000Z'),
    );
    expect(receipt3.fee).toEqual(180);

    // Unpark SUV 2, ticket number 004.
    jest.setSystemTime(new Date('2022-05-30T01:05:00.000Z')); // 13 hours 5 min.

    const receipt4 = lot.unpark(ticket4);

    expect(receipt4.receiptId).toEqual('R-004');
    expect(receipt4.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt4.ticket.exitDateTime).toEqual(
      new Date('2022-05-30T01:05:00.000Z'),
    );
    expect(receipt4.fee).toEqual(580);
  });

  it('should work for scenario 4 - airport parking lot', () => {
    const feeProcessor = new AirportFeeProcessor();
    const lot = new Lot.Builder(feeProcessor)
      .setSmallSpots(200)
      .setMediumSpots(500)
      .build();

    // Park motorcycle 1.
    jest.setSystemTime(new Date('2022-05-29T12:00:00.000Z'));

    const ticket1 = lot.park(Vehicle.MOTORCYCLE);

    expect(ticket1.ticketId).toEqual('001');
    expect(ticket1.vehicle).toEqual(Vehicle.MOTORCYCLE);
    expect(ticket1.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket1.exitDateTime).toBeNull();
    expect(ticket1.spotNumber).toEqual(1);

    // Park motorcycle 2.
    const ticket2 = lot.park(Vehicle.MOTORCYCLE);

    expect(ticket2.ticketId).toEqual('002');
    expect(ticket2.vehicle).toEqual(Vehicle.MOTORCYCLE);
    expect(ticket2.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket2.exitDateTime).toBeNull();
    expect(ticket2.spotNumber).toEqual(2);

    // Park motorcycle 3.
    const ticket3 = lot.park(Vehicle.MOTORCYCLE);

    expect(ticket3.ticketId).toEqual('003');
    expect(ticket3.vehicle).toEqual(Vehicle.MOTORCYCLE);
    expect(ticket3.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket3.exitDateTime).toBeNull();
    expect(ticket3.spotNumber).toEqual(3);

    // Park car 1.
    const ticket4 = lot.park(Vehicle.CAR);

    expect(ticket4.ticketId).toEqual('004');
    expect(ticket4.vehicle).toEqual(Vehicle.CAR);
    expect(ticket4.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket4.exitDateTime).toBeNull();
    expect(ticket4.spotNumber).toEqual(1);

    // Park SUV.
    const ticket5 = lot.park(Vehicle.SUV);

    expect(ticket5.ticketId).toEqual('005');
    expect(ticket5.vehicle).toEqual(Vehicle.SUV);
    expect(ticket5.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket5.exitDateTime).toBeNull();
    expect(ticket5.spotNumber).toEqual(2);

    // Park car 3.
    const ticket6 = lot.park(Vehicle.CAR);

    expect(ticket6.ticketId).toEqual('006');
    expect(ticket6.vehicle).toEqual(Vehicle.CAR);
    expect(ticket6.entryDateTime).toEqual(new Date('2022-05-29T12:00:00.000Z'));
    expect(ticket6.exitDateTime).toBeNull();
    expect(ticket6.spotNumber).toEqual(3);

    // Unpark motorcycle 1, ticket number 001.
    jest.setSystemTime(new Date('2022-05-29T12:55:00.000Z')); // 55 mins.

    const receipt1 = lot.unpark(ticket1);

    expect(receipt1.receiptId).toEqual('R-001');
    expect(receipt1.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt1.ticket.exitDateTime).toEqual(
      new Date('2022-05-29T12:55:00.000Z'),
    );
    expect(receipt1.fee).toEqual(0);

    // Unpark motorcycle 2, ticket number 002.
    jest.setSystemTime(new Date('2022-05-30T02:59:00.000Z')); // 14 hours 59 mins.

    const receipt2 = lot.unpark(ticket2);

    expect(receipt2.receiptId).toEqual('R-002');
    expect(receipt2.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt2.ticket.exitDateTime).toEqual(
      new Date('2022-05-30T02:59:00.000Z'),
    );
    expect(receipt2.fee).toEqual(60);

    // Unpark motorcycle 3, ticket number 003.
    jest.setSystemTime(new Date('2022-05-31T00:00:00.000Z')); // 1 day 12 hours.

    const receipt3 = lot.unpark(ticket3);

    expect(receipt3.receiptId).toEqual('R-003');
    expect(receipt3.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt3.ticket.exitDateTime).toEqual(
      new Date('2022-05-31T00:00:00.000Z'),
    );
    expect(receipt3.fee).toEqual(160);

    // Unpark car 1, ticket number 004.
    jest.setSystemTime(new Date('2022-05-29T12:50:00.000Z')); // 50 mins.

    const receipt4 = lot.unpark(ticket4);

    expect(receipt4.receiptId).toEqual('R-004');
    expect(receipt4.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt4.ticket.exitDateTime).toEqual(
      new Date('2022-05-29T12:50:00.000Z'),
    );
    expect(receipt4.fee).toEqual(60);

    // Unpark SUV, ticket number 005.
    jest.setSystemTime(new Date('2022-05-30T11:59:00.000Z')); // 23 hours 59 mins.

    const receipt5 = lot.unpark(ticket5);

    expect(receipt5.receiptId).toEqual('R-005');
    expect(receipt5.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt5.ticket.exitDateTime).toEqual(
      new Date('2022-05-30T11:59:00.000Z'),
    );
    expect(receipt5.fee).toEqual(80);

    // Unpark car 2, ticket number 006.
    jest.setSystemTime(new Date('2022-06-01T13:00:00.000Z')); // 3 days 1 hour.

    const receipt6 = lot.unpark(ticket6);

    expect(receipt6.receiptId).toEqual('R-006');
    expect(receipt6.ticket.entryDateTime).toEqual(
      new Date('2022-05-29T12:00:00.000Z'),
    );
    expect(receipt6.ticket.exitDateTime).toEqual(
      new Date('2022-06-01T13:00:00.000Z'),
    );
    expect(receipt6.fee).toEqual(400);
  });
});
