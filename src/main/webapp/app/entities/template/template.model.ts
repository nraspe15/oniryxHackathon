import { BaseEntity } from './../../shared';

export class Template implements BaseEntity {
    constructor(
        public id?: number,
        public montant?: number,
        public label?: string,
        public justification?: string,
        public comment?: string,
        public provider?: string,
        public employee?: BaseEntity,
        public categories?: BaseEntity[],
    ) {
    }
}
