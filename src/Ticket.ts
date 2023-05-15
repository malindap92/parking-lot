import { Vehicle } from './Vehicle';

export class Ticket {
  protected _exitDateTime: Date | null = null;

  constructor(
    private readonly _ticketId: string,
    private readonly _vehicle: Vehicle,
    private readonly _entryDateTime: Date,
    private readonly _spotNumber: number,
  ) {}

  get ticketId(): string {
    return this._ticketId;
  }

  get vehicle(): Vehicle {
    return this._vehicle;
  }

  get entryDateTime(): Date {
    return this._entryDateTime;
  }

  get spotNumber(): number {
    return this._spotNumber;
  }

  get exitDateTime(): Date | null {
    return this._exitDateTime;
  }

  set exitDateTime(date: Date | null) {
    this._exitDateTime = date;
  }
}

export class CompletedTicket extends Ticket {
  protected readonly _exitDateTime!: Date;

  get exitDateTime(): Date {
    return this._exitDateTime;
  }
}
