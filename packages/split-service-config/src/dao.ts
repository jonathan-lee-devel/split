export interface DAO<TFilter, TData, TTransformed> {
  getOneTransformed(filter: TFilter): Promise<TTransformed | null>;

  getManyTransformed(filter: TFilter): Promise<TTransformed[]>;

  createAndReturnTransformed(entityData: TData): Promise<TTransformed | null>;

  updateOne(entityData: TData): Promise<void>;

  updateOneAndReturnTransformed(entityData: TData): Promise<TTransformed | null>;

  deleteOne(filter: TFilter): Promise<void>;

  deleteOneAndReturnTransformed(filter: TFilter): Promise<TTransformed | null>;
}
