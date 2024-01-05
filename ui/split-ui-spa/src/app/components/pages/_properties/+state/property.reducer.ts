import {createReducer, on} from '@ngrx/store';

import {PropertyActions} from './property.actions';
import {initialPropertyDto, PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {LoadStatus} from '../../../../types/load-status';

export interface PropertyState {
  property: PropertyDto,
  propertyLoadByIdStatus: LoadStatus,
}

export const initialState: PropertyState = {
  property: initialPropertyDto,
  propertyLoadByIdStatus: 'NOT_LOADED',
};

export const propertyReducer = createReducer(
    initialState,
    on(PropertyActions.getPropertyById, (state): PropertyState => {
      return {...state};
    }),
    on(PropertyActions.loadPropertyById, (state): PropertyState => {
      return {...state, propertyLoadByIdStatus: 'LOADING'};
    }),
    on(PropertyActions.loadedPropertyById, (state, {property}): PropertyState => {
      return {...state, property, propertyLoadByIdStatus: 'LOADED'};
    }),
    on(PropertyActions.removePropertyById, (state): PropertyState => {
      return {...state};
    }),
);
