import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { ExpenseNote } from './expense-note.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ExpenseNote>;

@Injectable()
export class ExpenseNoteService {

    private resourceUrl =  SERVER_API_URL + 'api/expense-notes';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(expenseNote: ExpenseNote): Observable<EntityResponseType> {
        const copy = this.convert(expenseNote);
        return this.http.post<ExpenseNote>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(expenseNote: ExpenseNote): Observable<EntityResponseType> {
        const copy = this.convert(expenseNote);
        return this.http.put<ExpenseNote>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ExpenseNote>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ExpenseNote[]>> {
        const options = createRequestOption(req);
        return this.http.get<ExpenseNote[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ExpenseNote[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ExpenseNote = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ExpenseNote[]>): HttpResponse<ExpenseNote[]> {
        const jsonResponse: ExpenseNote[] = res.body;
        const body: ExpenseNote[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ExpenseNote.
     */
    private convertItemFromServer(expenseNote: ExpenseNote): ExpenseNote {
        const copy: ExpenseNote = Object.assign({}, expenseNote);
        copy.submitDate = this.dateUtils
            .convertLocalDateFromServer(expenseNote.submitDate);
        copy.paymentDate = this.dateUtils
            .convertLocalDateFromServer(expenseNote.paymentDate);
        return copy;
    }

    /**
     * Convert a ExpenseNote to a JSON which can be sent to the server.
     */
    private convert(expenseNote: ExpenseNote): ExpenseNote {
        const copy: ExpenseNote = Object.assign({}, expenseNote);
        copy.submitDate = this.dateUtils
            .convertLocalDateToServer(expenseNote.submitDate);
        copy.paymentDate = this.dateUtils
            .convertLocalDateToServer(expenseNote.paymentDate);
        return copy;
    }
}
