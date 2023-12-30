import {makeGenerateId} from '@split-common/split-auth';

import {makePropertyEntity} from './property';
import {makeDefaultPropertyDao} from '../dao';
import logger from '../logger';

export const propertyEntity = makePropertyEntity(
    makeDefaultPropertyDao(),
    makeGenerateId(logger),
);

export type PropertyEntity = typeof propertyEntity;
