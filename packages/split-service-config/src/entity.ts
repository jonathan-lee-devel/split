export abstract class Entity<TFilter, TBody, TData> {
  protected body: TBody | undefined;

  protected constructor(body?: TBody | undefined) {
    this.body = body;
  }

  public abstract getBodyTransformed(): Promise<TData | undefined>;

  public abstract getOne(filter: TFilter): Promise<Entity<TFilter, TBody, TData> | null>;

  public abstract getOneTransformed(filter: TFilter): Promise<TData | null>;

  public abstract getMany(filter: TFilter): Promise<Entity<TFilter, TBody, TData>[]>;

  public abstract getManyTransformed(filter: TFilter): Promise<TData[]>;

  public abstract create(entityData: TData): Promise<Entity<TFilter, TBody, TData> | null>;

  public abstract createAndReturnTransformed(entityData: TData): Promise<TData | null>;

  public abstract updateOne(entityData: TData): Promise<void>;

  public abstract updateOneAndReturnTransformed(entityData: TData): Promise<TData | null>;
}
