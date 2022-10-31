import { Action } from '@ngrx/store';
//import { Filter } from '../models/filter.model';

export enum FilterActionTypes  {
//add
ADD_FILTER = '[FILTER] ADD',
//delete
DELETE_FILTER = '[FILTER] DELETE',
}

export class AddFilterAction implements Action {
readonly type = FilterActionTypes.ADD_FILTER;
constructor(public payload : string) {}
}

export class DeleteFilterAction implements Action {
readonly type = FilterActionTypes.DELETE_FILTER;
constructor(public payload : string) {}
}

export type FilterAction = AddFilterAction | DeleteFilterAction;