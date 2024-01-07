import {createFeatureSelector, createSelector} from '@ngrx/store';

import {PropertyState} from './property.reducer';
import {PropertyDto} from '../../../../dtos/properties/PropertyDto';
import {LoadStatus} from '../../../../types/load-status';

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

const selectLoadPropertiesWhereInvolvedStatus = () => createSelector(selectPropertyState,
    (state: PropertyState): LoadStatus => {
      const isAllLoaded = (state.propertiesWhereInvolved
          .every((propertyWhereInvolved) =>
            propertyWhereInvolved.loadStatus === 'LOADED'));
      return (isAllLoaded && state.propertiesWhereInvolved.length > 0) ? 'LOADED' : 'NOT_LOADED';
    });

const selectPropertiesWhereInvolved = () => createSelector(selectPropertyState,
    (state: PropertyState) => state.propertiesWhereInvolved
        .map((propertiesWhereInvolvedInner) => ({
          ...propertiesWhereInvolvedInner.property,
        }) as PropertyDto),
);

export const PropertySelector = {
  selectLoadPropertyByIdStatus,
  selectPropertyById,
  selectLoadPropertiesWhereInvolvedStatus,
  selectPropertiesWhereInvolved,
} as const;
