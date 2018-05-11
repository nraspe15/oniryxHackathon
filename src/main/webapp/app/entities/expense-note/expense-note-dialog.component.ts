import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ExpenseNote } from './expense-note.model';
import { ExpenseNotePopupService } from './expense-note-popup.service';
import { ExpenseNoteService } from './expense-note.service';
import { Employee, EmployeeService } from '../employee';

@Component({
    selector: 'jhi-expense-note-dialog',
    templateUrl: './expense-note-dialog.component.html'
})
export class ExpenseNoteDialogComponent implements OnInit {

    expenseNote: ExpenseNote;
    isSaving: boolean;

    employees: Employee[];
    submitDateDp: any;
    paymentDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private expenseNoteService: ExpenseNoteService,
        private employeeService: EmployeeService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.employeeService
            .query({filter: 'expensenote(id)-is-null'})
            .subscribe((res: HttpResponse<Employee[]>) => {
                if (!this.expenseNote.employee || !this.expenseNote.employee.id) {
                    this.employees = res.body;
                } else {
                    this.employeeService
                        .find(this.expenseNote.employee.id)
                        .subscribe((subRes: HttpResponse<Employee>) => {
                            this.employees = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.expenseNote.id !== undefined) {
            this.subscribeToSaveResponse(
                this.expenseNoteService.update(this.expenseNote));
        } else {
            this.subscribeToSaveResponse(
                this.expenseNoteService.create(this.expenseNote));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ExpenseNote>>) {
        result.subscribe((res: HttpResponse<ExpenseNote>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: ExpenseNote) {
        this.eventManager.broadcast({ name: 'expenseNoteListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackEmployeeById(index: number, item: Employee) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-expense-note-popup',
    template: ''
})
export class ExpenseNotePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private expenseNotePopupService: ExpenseNotePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.expenseNotePopupService
                    .open(ExpenseNoteDialogComponent as Component, params['id']);
            } else {
                this.expenseNotePopupService
                    .open(ExpenseNoteDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
