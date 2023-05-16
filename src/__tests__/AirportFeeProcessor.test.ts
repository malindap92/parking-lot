import { Vehicle } from '../Vehicle';
import { AirportFeeProcessor } from '../fee-processors/AirportFeeProcessor';

describe('AirportFeeProcessor', () => {
  it.each`
    hoursDiff | vehicle               | expected
    ${0.1}    | ${Vehicle.MOTORCYCLE} | ${0}
    ${0.1}    | ${Vehicle.SCOOTER}    | ${0}
    ${0.9}    | ${Vehicle.MOTORCYCLE} | ${0}
    ${0.9}    | ${Vehicle.SCOOTER}    | ${0}
    ${4}      | ${Vehicle.MOTORCYCLE} | ${40}
    ${4}      | ${Vehicle.SCOOTER}    | ${40}
    ${7.9}    | ${Vehicle.MOTORCYCLE} | ${40}
    ${7.9}    | ${Vehicle.SCOOTER}    | ${40}
    ${8}      | ${Vehicle.MOTORCYCLE} | ${60}
    ${8}      | ${Vehicle.SCOOTER}    | ${60}
    ${23.9}   | ${Vehicle.MOTORCYCLE} | ${60}
    ${23.9}   | ${Vehicle.SCOOTER}    | ${60}
    ${24}     | ${Vehicle.MOTORCYCLE} | ${80}
    ${24}     | ${Vehicle.SCOOTER}    | ${80}
    ${48}     | ${Vehicle.MOTORCYCLE} | ${160}
    ${48}     | ${Vehicle.SCOOTER}    | ${160}
    ${60}     | ${Vehicle.MOTORCYCLE} | ${240}
    ${60}     | ${Vehicle.SCOOTER}    | ${240}
    ${72}     | ${Vehicle.MOTORCYCLE} | ${240}
    ${72}     | ${Vehicle.SCOOTER}    | ${240}
    ${0.1}    | ${Vehicle.CAR}        | ${60}
    ${0.1}    | ${Vehicle.SUV}        | ${60}
    ${11.9}   | ${Vehicle.CAR}        | ${60}
    ${11.9}   | ${Vehicle.SUV}        | ${60}
    ${12}     | ${Vehicle.CAR}        | ${80}
    ${12}     | ${Vehicle.SUV}        | ${80}
    ${23.9}   | ${Vehicle.CAR}        | ${80}
    ${23.9}   | ${Vehicle.SUV}        | ${80}
    ${24}     | ${Vehicle.CAR}        | ${100}
    ${24}     | ${Vehicle.SUV}        | ${100}
    ${48}     | ${Vehicle.CAR}        | ${200}
    ${48}     | ${Vehicle.SUV}        | ${200}
    ${60}     | ${Vehicle.CAR}        | ${300}
    ${60}     | ${Vehicle.SUV}        | ${300}
    ${72}     | ${Vehicle.CAR}        | ${300}
    ${72}     | ${Vehicle.SUV}        | ${300}
  `(
    'should calculate fee and return $expected for $vehicle with a stay of $hoursDiff hours',
    ({
      hoursDiff,
      vehicle,
      expected,
    }: {
      hoursDiff: number;
      vehicle: Vehicle;
      expected: number;
    }) => {
      const feeProcessor = new AirportFeeProcessor();
      const fee = feeProcessor.calculate(hoursDiff, vehicle);

      expect(fee).toEqual(expected);
    },
  );

  it.each([[Vehicle.BUS, Vehicle.TRUCK]])(
    'should throw error if vehicle type is %s',
    (vehicle) => {
      const feeProcessor = new AirportFeeProcessor();

      expect(() => {
        feeProcessor.calculate(1, vehicle);
      }).toThrowError(`Unsupported vehicle type: ${vehicle}`);
    },
  );
});
