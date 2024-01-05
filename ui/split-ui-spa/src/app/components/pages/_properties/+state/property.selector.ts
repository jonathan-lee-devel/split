import {createFeatureSelector, createSelector} from '@ngrx/store';

import {PropertyState} from './property.reducer';

export const PROPERTY_FEATURE_NAME = 'property';

const selectPropertyState = createFeatureSelector<PropertyState>(PROPERTY_FEATURE_NAME);

const selectLoadPropertyByIdStatus = createSelector(selectPropertyState,
    (state: PropertyState) => state.propertyLoadByIdStatus);

const selectPropertyById = createSelector(
    selectPropertyState,
    (state: PropertyState) => state.property,
);

export const PropertySelector = {
  selectLoadPropertyByIdStatus,
  selectPropertyById,
} as const;
