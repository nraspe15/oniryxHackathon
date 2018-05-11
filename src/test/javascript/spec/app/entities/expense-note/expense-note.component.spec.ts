/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { OniryxHackathonTestModule } from '../../../test.module';
import { ExpenseNoteComponent } from '../../../../../../main/webapp/app/entities/expense-note/expense-note.component';
import { ExpenseNoteService } from '../../../../../../main/webapp/app/entities/expense-note/expense-note.service';
import { ExpenseNote } from '../../../../../../main/webapp/app/entities/expense-note/expense-note.model';

describe('Component Tests', () => {

    describe('ExpenseNote Management Component', () => {
        let comp: ExpenseNoteComponent;
        let fixture: ComponentFixture<ExpenseNoteComponent>;
        let service: ExpenseNoteService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [OniryxHackathonTestModule],
                declarations: [ExpenseNoteComponent],
                providers: [
                    ExpenseNoteService
                ]
            })
            .overrideTemplate(ExpenseNoteComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ExpenseNoteComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ExpenseNoteService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new ExpenseNote(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.expenseNotes[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
