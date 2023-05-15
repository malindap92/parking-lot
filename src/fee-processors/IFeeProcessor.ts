import { CompletedTicket } from '../Ticket';

export interface IFeeProcessor {
  calculate: (ticket: CompletedTicket) => number;
}
