/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { OniryxHackathonTestModule } from '../../../test.module';
import { ExpenseNoteDetailComponent } from '../../../../../../main/webapp/app/entities/expense-note/expense-note-detail.component';
import { ExpenseNoteService } from '../../../../../../main/webapp/app/entities/expense-note/expense-note.service';
import { ExpenseNote } from '../../../../../../main/webapp/app/entities/expense-note/expense-note.model';

describe('Component Tests', () => {

    describe('ExpenseNote Management Detail Component', () => {
        let comp: ExpenseNoteDetailComponent;
        let fixture: ComponentFixture<ExpenseNoteDetailComponent>;
        let service: ExpenseNoteService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [OniryxHackathonTestModule],
                declarations: [ExpenseNoteDetailComponent],
                providers: [
                    ExpenseNoteService
                ]
            })
            .overrideTemplate(ExpenseNoteDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ExpenseNoteDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ExpenseNoteService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new ExpenseNote(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.expenseNote).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
