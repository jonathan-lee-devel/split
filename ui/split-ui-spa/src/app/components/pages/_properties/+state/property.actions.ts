import {createAction, props} from '@ngrx/store';

import {PropertyDto} from '../../../../dtos/properties/PropertyDto';

const getPropertyById = createAction(
    '[Property] Get by ID',
    props<{propertyId: string}>());

const loadPropertyById = createAction(
    '[Property] Load by ID',
    props<{propertyId: string}>());

const loadedPropertyById = createAction(
    '[Property] Loaded by ID',
    props<{property: PropertyDto}>());

const removePropertyById = createAction(
    '[Property] Remove by ID',
    props<{propertyId: string, property: PropertyDto}>());

const removedPropertyById = createAction(
    '[Property] Removed by ID',
    props<{property: PropertyDto}>());

export const PropertyActions = {
  getPropertyById,
  loadPropertyById,
  loadedPropertyById,
  removePropertyById,
  removedPropertyById,
} as const;
