export abstract class Entity<TFilter, TBody, TData, TTransformed> {
  protected body: TBody | undefined;

  protected constructor(body?: TBody | undefined) {
    this.body = body;
  }

  public abstract getBodyTransformed(): Promise<TData | undefined>;

  public abstract getOne(filter: TFilter): Promise<Entity<TFilter, TBody, TData, TTransformed> | null>;

  public abstract getOneTransformed(filter: TFilter): Promise<TTransformed | null>;

  public abstract getMany(filter: TFilter): Promise<Entity<TFilter, TBody, TData, TTransformed>[]>;

  public abstract getManyTransformed(filter: TFilter): Promise<TTransformed[]>;

  public abstract create(entityData: TData): Promise<Entity<TFilter, TBody, TData, TTransformed> | null>;

  public abstract createAndReturnTransformed(entityData: TData): Promise<TTransformed | null>;

  public abstract updateOne(entityData: TData): Promise<void>;

  public abstract updateOneAndReturnTransformed(entityData: TData): Promise<TTransformed | null>;
}
