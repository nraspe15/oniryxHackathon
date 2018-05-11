import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ExpenseNote } from './expense-note.model';
import { ExpenseNoteService } from './expense-note.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-expense-note',
    templateUrl: './expense-note.component.html'
})
export class ExpenseNoteComponent implements OnInit, OnDestroy {
expenseNotes: ExpenseNote[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private expenseNoteService: ExpenseNoteService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.expenseNoteService.query().subscribe(
            (res: HttpResponse<ExpenseNote[]>) => {
                this.expenseNotes = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInExpenseNotes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ExpenseNote) {
        return item.id;
    }
    registerChangeInExpenseNotes() {
        this.eventSubscriber = this.eventManager.subscribe('expenseNoteListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
