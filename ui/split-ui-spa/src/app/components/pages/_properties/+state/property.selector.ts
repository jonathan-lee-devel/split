import {createFeatureSelector, createSelector} from '@ngrx/store';

import {PropertyState} from './property.reducer';

export const PROPERTY_FEATURE_NAME = 'property';

const selectPropertyState = createFeatureSelector<PropertyState>(PROPERTY_FEATURE_NAME);

const selectLoadPropertyByIdStatus = (propertyId: string) => createSelector(selectPropertyState,
    (state: PropertyState) => {
      const propertyById = state.propertiesById
          .find((innerPropertyState) =>
            innerPropertyState.property.id === propertyId);
      return (propertyById) ? propertyById.loadStatus : 'NOT_LOADED';
    });

const selectPropertyById = (propertyId: string) => createSelector(selectPropertyState,
    (state: PropertyState) => {
      const propertyById = state.propertiesById
          .find((innerPropertyState) =>
            innerPropertyState.property.id === propertyId);
      return (propertyById) ? propertyById.property : null;
    },
);

export const PropertySelector = {
  selectLoadPropertyByIdStatus,
  selectPropertyById,
} as const;
