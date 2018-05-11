import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { OniryxHackathonTemplateModule } from './template/template.module';
import { OniryxHackathonCategoryModule } from './category/category.module';
import { OniryxHackathonEmployeeModule } from './employee/employee.module';
import { OniryxHackathonExpenseNoteModule } from './expense-note/expense-note.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        OniryxHackathonTemplateModule,
        OniryxHackathonCategoryModule,
        OniryxHackathonEmployeeModule,
        OniryxHackathonExpenseNoteModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OniryxHackathonEntityModule {}
