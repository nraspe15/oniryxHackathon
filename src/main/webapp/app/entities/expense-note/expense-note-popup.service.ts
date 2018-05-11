import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { ExpenseNote } from './expense-note.model';
import { ExpenseNoteService } from './expense-note.service';

@Injectable()
export class ExpenseNotePopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private expenseNoteService: ExpenseNoteService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.expenseNoteService.find(id)
                    .subscribe((expenseNoteResponse: HttpResponse<ExpenseNote>) => {
                        const expenseNote: ExpenseNote = expenseNoteResponse.body;
                        if (expenseNote.submitDate) {
                            expenseNote.submitDate = {
                                year: expenseNote.submitDate.getFullYear(),
                                month: expenseNote.submitDate.getMonth() + 1,
                                day: expenseNote.submitDate.getDate()
                            };
                        }
                        if (expenseNote.paymentDate) {
                            expenseNote.paymentDate = {
                                year: expenseNote.paymentDate.getFullYear(),
                                month: expenseNote.paymentDate.getMonth() + 1,
                                day: expenseNote.paymentDate.getDate()
                            };
                        }
                        this.ngbModalRef = this.expenseNoteModalRef(component, expenseNote);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.expenseNoteModalRef(component, new ExpenseNote());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    expenseNoteModalRef(component: Component, expenseNote: ExpenseNote): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.expenseNote = expenseNote;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
