import { BaseEntity } from './../../shared';

export class Category implements BaseEntity {
    constructor(
        public id?: number,
        public label?: string,
        public template?: BaseEntity,
        public expenseNote?: BaseEntity,
    ) {
    }
}
