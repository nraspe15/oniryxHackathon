import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ExpenseNote } from './expense-note.model';
import { ExpenseNotePopupService } from './expense-note-popup.service';
import { ExpenseNoteService } from './expense-note.service';

@Component({
    selector: 'jhi-expense-note-delete-dialog',
    templateUrl: './expense-note-delete-dialog.component.html'
})
export class ExpenseNoteDeleteDialogComponent {

    expenseNote: ExpenseNote;

    constructor(
        private expenseNoteService: ExpenseNoteService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.expenseNoteService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'expenseNoteListModification',
                content: 'Deleted an expenseNote'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-expense-note-delete-popup',
    template: ''
})
export class ExpenseNoteDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private expenseNotePopupService: ExpenseNotePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.expenseNotePopupService
                .open(ExpenseNoteDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
