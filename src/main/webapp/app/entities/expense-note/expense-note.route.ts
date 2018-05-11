import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { ExpenseNoteComponent } from './expense-note.component';
import { ExpenseNoteDetailComponent } from './expense-note-detail.component';
import { ExpenseNotePopupComponent } from './expense-note-dialog.component';
import { ExpenseNoteDeletePopupComponent } from './expense-note-delete-dialog.component';

export const expenseNoteRoute: Routes = [
    {
        path: 'expense-note',
        component: ExpenseNoteComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ExpenseNotes'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'expense-note/:id',
        component: ExpenseNoteDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ExpenseNotes'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const expenseNotePopupRoute: Routes = [
    {
        path: 'expense-note-new',
        component: ExpenseNotePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ExpenseNotes'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'expense-note/:id/edit',
        component: ExpenseNotePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ExpenseNotes'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'expense-note/:id/delete',
        component: ExpenseNoteDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'ExpenseNotes'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
