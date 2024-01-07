import {createReducer, on} from '@ngrx/store';

import {PropertyActions} from './property.actions';
import {initialPropertyDto, PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {LoadStatus} from '../../../../types/load-status';

interface PropertyWithLoadStatus {
  property: PropertyDto;
  loadStatus: LoadStatus;
}

export interface PropertyState {
  propertiesById: PropertyWithLoadStatus[];
  propertiesWhereInvolved: PropertyWithLoadStatus[];
}

export const initialState: PropertyState = {
  propertiesById: [],
  propertiesWhereInvolved: [],
};

export const propertyReducer = createReducer(
    initialState,
    on(PropertyActions.getPropertyById, (state): PropertyState => {
      return {...state};
    }),
    on(PropertyActions.loadPropertyById, (state, {propertyId}): PropertyState => {
      return {
        ...state, propertiesById: [
          ...state.propertiesById,
          {property: {...initialPropertyDto, id: propertyId}, loadStatus: 'LOADING'},
        ],
      };
    }),
    on(PropertyActions.loadedPropertyById, (state, {property}): PropertyState => {
      return {
        ...state,
        propertiesById: state.propertiesById.map((existingPropertyInnerState) =>
        (existingPropertyInnerState.property.id === property.id) ?
          {property, loadStatus: 'LOADED'} :
          {...existingPropertyInnerState}),
      };
    }),
    on(PropertyActions.promptRemovePropertyById, (state, {property}): PropertyState => {
      return {
        ...state,
        propertiesById: state.propertiesById.map((existingPropertyInnerState) =>
        (existingPropertyInnerState.property.id === property.id) ?
          {property: existingPropertyInnerState.property, loadStatus: 'LOADING'} :
          {...existingPropertyInnerState}),
      };
    }),
    on(PropertyActions.removePropertyById, (state, {propertyId}): PropertyState => {
      return {
        ...state,
        propertiesById: state.propertiesById.filter((existingPropertyInnerState) =>
          (existingPropertyInnerState.property.id !== propertyId)),
        propertiesWhereInvolved: state.propertiesWhereInvolved.filter((existingPropertyInnerState) =>
          (existingPropertyInnerState.property.id !== propertyId)),
      };
    }),
    on(PropertyActions.removePropertyByIdCanceled, (state, {propertyId}): PropertyState => {
      return {
        ...state,
        propertiesById: state.propertiesById.map((existingPropertyInnerState) =>
        (existingPropertyInnerState.property.id === propertyId) ?
          {property: existingPropertyInnerState.property, loadStatus: 'LOADED'} :
          {...existingPropertyInnerState}),
      };
    }),
    on(PropertyActions.loadedPropertiesWhereInvolved, (state, {properties}): PropertyState => {
      return {
        ...state,
        propertiesWhereInvolved: [...properties
            .map((propertyToMap) =>
              ({property: propertyToMap, loadStatus: 'LOADED'} as PropertyWithLoadStatus)),
        ],
      };
    }),
);
