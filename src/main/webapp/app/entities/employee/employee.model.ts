import { BaseEntity } from './../../shared';

export class Employee implements BaseEntity {
    constructor(
        public id?: number,
        public trigram?: string,
        public template?: BaseEntity,
        public expenseNote?: BaseEntity,
    ) {
    }
}
