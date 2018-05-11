import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { ExpenseNote } from './expense-note.model';
import { ExpenseNoteService } from './expense-note.service';

@Component({
    selector: 'jhi-expense-note-detail',
    templateUrl: './expense-note-detail.component.html'
})
export class ExpenseNoteDetailComponent implements OnInit, OnDestroy {

    expenseNote: ExpenseNote;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private expenseNoteService: ExpenseNoteService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInExpenseNotes();
    }

    load(id) {
        this.expenseNoteService.find(id)
            .subscribe((expenseNoteResponse: HttpResponse<ExpenseNote>) => {
                this.expenseNote = expenseNoteResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInExpenseNotes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'expenseNoteListModification',
            (response) => this.load(this.expenseNote.id)
        );
    }
}
