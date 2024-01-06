import {createReducer, on} from '@ngrx/store';

import {PropertyActions} from './property.actions';
import {initialPropertyDto, PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {LoadStatus} from '../../../../types/load-status';

interface InnerPropertyState {
  property: PropertyDto;
  loadStatus: LoadStatus;
}

export interface PropertyState {
  propertiesById: InnerPropertyState[];
}

export const initialState: PropertyState = {
  propertiesById: [],
};

export const propertyReducer = createReducer(
    initialState,
    on(PropertyActions.getPropertyById, (state): PropertyState => {
      return {...state};
    }),
    on(PropertyActions.loadPropertyById, (state, {propertyId}): PropertyState => {
      return {...state, propertiesById: [
        ...state.propertiesById,
        {property: {...initialPropertyDto, id: propertyId}, loadStatus: 'LOADING'},
      ]};
    }),
    on(PropertyActions.loadedPropertyById, (state, {property}): PropertyState => {
      return {...state,
        propertiesById: state.propertiesById.map((existingPropertyInnerState) =>
                (existingPropertyInnerState.property.id === property.id) ?
                  {property, loadStatus: 'LOADED'} :
                  {...existingPropertyInnerState})};
    }),
    on(PropertyActions.removePropertyById, (state): PropertyState => {
      return {...state};
    }),
);
