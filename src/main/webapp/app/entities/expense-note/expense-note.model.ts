import { BaseEntity } from './../../shared';

export const enum Status {
    'ENCODED',
    'SUSPENDED',
    'PAID',
    'REJECTED'
}

export class ExpenseNote implements BaseEntity {
    constructor(
        public id?: number,
        public montant?: number,
        public label?: string,
        public justification?: string,
        public comment?: string,
        public provider?: string,
        public submitDate?: any,
        public paymentDate?: any,
        public status?: Status,
        public employee?: BaseEntity,
        public categories?: BaseEntity[],
    ) {
    }
}
