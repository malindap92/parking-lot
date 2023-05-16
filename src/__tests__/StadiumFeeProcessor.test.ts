import { Vehicle } from '../Vehicle';
import { StadiumFeeProcessor } from '../fee-processors/StadiumFeeProcessor';

describe('StadiumFeeProcessor', () => {
  it.each`
    hoursDiff | vehicle               | expected
    ${0.1}    | ${Vehicle.MOTORCYCLE} | ${30}
    ${0.1}    | ${Vehicle.SCOOTER}    | ${30}
    ${3.9}    | ${Vehicle.MOTORCYCLE} | ${30}
    ${3.9}    | ${Vehicle.SCOOTER}    | ${30}
    ${4}      | ${Vehicle.MOTORCYCLE} | ${90}
    ${4}      | ${Vehicle.SCOOTER}    | ${90}
    ${11.9}   | ${Vehicle.MOTORCYCLE} | ${90}
    ${11.9}   | ${Vehicle.SCOOTER}    | ${90}
    ${12}     | ${Vehicle.MOTORCYCLE} | ${190}
    ${12}     | ${Vehicle.SCOOTER}    | ${190}
    ${18}     | ${Vehicle.MOTORCYCLE} | ${790}
    ${18}     | ${Vehicle.SCOOTER}    | ${790}
    ${0.1}    | ${Vehicle.CAR}        | ${60}
    ${0.1}    | ${Vehicle.SUV}        | ${60}
    ${3.9}    | ${Vehicle.CAR}        | ${60}
    ${3.9}    | ${Vehicle.SUV}        | ${60}
    ${4}      | ${Vehicle.CAR}        | ${180}
    ${4}      | ${Vehicle.SUV}        | ${180}
    ${11.9}   | ${Vehicle.CAR}        | ${180}
    ${11.9}   | ${Vehicle.SUV}        | ${180}
    ${18}     | ${Vehicle.CAR}        | ${1580}
    ${18}     | ${Vehicle.SUV}        | ${1580}
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
      const feeProcessor = new StadiumFeeProcessor();
      const fee = feeProcessor.calculate(hoursDiff, vehicle);

      expect(fee).toEqual(expected);
    },
  );

  it.each([[Vehicle.BUS, Vehicle.TRUCK]])(
    'should throw error if vehicle type is %s',
    (vehicle) => {
      const feeProcessor = new StadiumFeeProcessor();

      expect(() => {
        feeProcessor.calculate(1, vehicle);
      }).toThrowError(`Unsupported vehicle type: ${vehicle}`);
    },
  );
});
