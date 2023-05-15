import { Vehicle } from './Vehicle';

export class Spot {
  private _isAvailable = true;

  constructor(
    private readonly _vehicleTypes: Vehicle[],
    private readonly _number: number,
  ) {}

  get isAvailable(): boolean {
    return this._isAvailable;
  }

  set isAvailable(isAvailable: boolean) {
    this._isAvailable = isAvailable;
  }

  get vehicleTypes(): Vehicle[] {
    return this._vehicleTypes;
  }

  get number(): number {
    return this._number;
  }
}
