import {User} from '@split-common/split-auth';
import * as core from 'express-serve-static-core';


declare module 'express' {
  export interface AuthenticatedRequest<
    P = core.ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = core.Query,
    Locals extends Record<string, any> = Record<string, any>
  > extends core.Request<P, ResBody, ReqBody, ReqQuery, Locals> {
    user: User
  }
}

declare module 'split-constants' {

}
