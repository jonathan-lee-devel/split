import {createAction, props} from '@ngrx/store';

import {PropertyDto} from '../../../../dtos/properties/PropertyDto';

const getPropertyById = createAction('[Property] Get by ID', props<{propertyId: string}>());
const getPropertyByIdAndExpensesForProperty = createAction(
    '[Property/Expenses] Get by ID and for Property',
    props<{propertyId: string}>());
const loadPropertyById = createAction('[Property] Load by ID', props<{propertyId: string}>());
const loadedPropertyById = createAction('[Property] Loaded by ID', props<{property: PropertyDto}>());
const removePropertyById = createAction('[Property] Remove by ID', props<{propertyId: string}>());

export const PropertyActions = {
  getPropertyById,
  getPropertyByIdAndExpensesForProperty,
  loadPropertyById,
  loadedPropertyById,
  removePropertyById,
} as const;
