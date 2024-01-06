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

const promptRemovePropertyById = createAction(
    '[Property] Prompt Remove by ID',
    props<{property: PropertyDto}>(),
);

const promptedRemovePropertyById = createAction(
    '[Property] Prompted Remove by ID',
    props<{property: PropertyDto}>(),
);

const promptConfirmedRemovePropertyById = createAction(
    '[Property] Confirmed Prompt to Remove by ID',
    props<{propertyId: string}>(),
);

const removePropertyById = createAction(
    '[Property] Remove by ID',
    props<{propertyId: string}>());

const removePropertyByIdCanceled = createAction(
    '[Property] Remove by ID Canceled',
    props<{propertyId: string}>(),
);

const removedPropertyById = createAction(
    '[Property] Removed by ID',
    props<{propertyId: string}>());

export const PropertyActions = {
  getPropertyById,
  loadPropertyById,
  loadedPropertyById,
  promptRemovePropertyById,
  promptedRemovePropertyById,
  promptConfirmedRemovePropertyById,
  removePropertyById,
  removePropertyByIdCanceled,
  removedPropertyById,
} as const;
