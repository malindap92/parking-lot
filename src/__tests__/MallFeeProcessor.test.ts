import { Vehicle } from '../Vehicle';
import { MallFeeProcessor } from '../fee-processors/MallFeeProcessor';

describe('MallFeeProcessor', () => {
  it.each`
    hoursDiff | vehicle               | expected
    ${0.5}    | ${Vehicle.MOTORCYCLE} | ${10}
    ${0.5}    | ${Vehicle.SCOOTER}    | ${10}
    ${0.5}    | ${Vehicle.CAR}        | ${20}
    ${0.5}    | ${Vehicle.SUV}        | ${20}
    ${0.5}    | ${Vehicle.BUS}        | ${50}
    ${0.5}    | ${Vehicle.TRUCK}      | ${50}
    ${1.5}    | ${Vehicle.MOTORCYCLE} | ${20}
    ${1.5}    | ${Vehicle.SCOOTER}    | ${20}
    ${1.5}    | ${Vehicle.CAR}        | ${40}
    ${1.5}    | ${Vehicle.SUV}        | ${40}
    ${1.5}    | ${Vehicle.BUS}        | ${100}
    ${1.5}    | ${Vehicle.TRUCK}      | ${100}
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
      const feeProcessor = new MallFeeProcessor();
      const fee = feeProcessor.calculate(hoursDiff, vehicle);

      expect(fee).toEqual(expected);
    },
  );
});
