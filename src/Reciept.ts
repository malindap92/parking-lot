import { Ticket } from './Ticket';

export class Reciept {
  constructor(
    private readonly _receiptId: string,
    private readonly _ticket: Ticket,
    private readonly _fee: number,
  ) {}

  get receiptId(): string {
    return this._receiptId;
  }

  get ticket(): Ticket {
    return this._ticket;
  }

  get fee(): number {
    return this._fee;
  }
}
