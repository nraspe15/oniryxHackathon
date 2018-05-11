/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { OniryxHackathonTestModule } from '../../../test.module';
import { ExpenseNoteDeleteDialogComponent } from '../../../../../../main/webapp/app/entities/expense-note/expense-note-delete-dialog.component';
import { ExpenseNoteService } from '../../../../../../main/webapp/app/entities/expense-note/expense-note.service';

describe('Component Tests', () => {

    describe('ExpenseNote Management Delete Component', () => {
        let comp: ExpenseNoteDeleteDialogComponent;
        let fixture: ComponentFixture<ExpenseNoteDeleteDialogComponent>;
        let service: ExpenseNoteService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [OniryxHackathonTestModule],
                declarations: [ExpenseNoteDeleteDialogComponent],
                providers: [
                    ExpenseNoteService
                ]
            })
            .overrideTemplate(ExpenseNoteDeleteDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ExpenseNoteDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ExpenseNoteService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        spyOn(service, 'delete').and.returnValue(Observable.of({}));

                        // WHEN
                        comp.confirmDelete(123);
                        tick();

                        // THEN
                        expect(service.delete).toHaveBeenCalledWith(123);
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
