import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OniryxHackathonSharedModule } from '../../shared';
import {
    ExpenseNoteService,
    ExpenseNotePopupService,
    ExpenseNoteComponent,
    ExpenseNoteDetailComponent,
    ExpenseNoteDialogComponent,
    ExpenseNotePopupComponent,
    ExpenseNoteDeletePopupComponent,
    ExpenseNoteDeleteDialogComponent,
    expenseNoteRoute,
    expenseNotePopupRoute,
} from './';

const ENTITY_STATES = [
    ...expenseNoteRoute,
    ...expenseNotePopupRoute,
];

@NgModule({
    imports: [
        OniryxHackathonSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ExpenseNoteComponent,
        ExpenseNoteDetailComponent,
        ExpenseNoteDialogComponent,
        ExpenseNoteDeleteDialogComponent,
        ExpenseNotePopupComponent,
        ExpenseNoteDeletePopupComponent,
    ],
    entryComponents: [
        ExpenseNoteComponent,
        ExpenseNoteDialogComponent,
        ExpenseNotePopupComponent,
        ExpenseNoteDeleteDialogComponent,
        ExpenseNoteDeletePopupComponent,
    ],
    providers: [
        ExpenseNoteService,
        ExpenseNotePopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OniryxHackathonExpenseNoteModule {}
