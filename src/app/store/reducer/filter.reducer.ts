//import { Filter} from '../models/filter.model';
import { FilterAction, FilterActionTypes } from '../actions/filter.action';

//initial store data
const initialState  = 
{
category:'',
designer:'',
colour:'',
from_price:0,
to_price:1000

}

// The only reducer we are using for this example
export function FilterReducer(state = initialState,action :FilterAction){

switch(action.type) {
   case FilterActionTypes.ADD_FILTER :
       return {
           ...state,
           filter_config:action.payload
       };
   case FilterActionTypes.DELETE_FILTER:
       return {
           ...state,
           filter_config:initialState
       };
   default:
       return state;
}

};