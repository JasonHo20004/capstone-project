
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model NotificationType
 * 
 */
export type NotificationType = $Result.DefaultSelection<Prisma.$NotificationTypePayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model InAppNotification
 * 
 */
export type InAppNotification = $Result.DefaultSelection<Prisma.$InAppNotificationPayload>
/**
 * Model UserNotification
 * 
 */
export type UserNotification = $Result.DefaultSelection<Prisma.$UserNotificationPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more NotificationTypes
 * const notificationTypes = await prisma.notificationType.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more NotificationTypes
   * const notificationTypes = await prisma.notificationType.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.notificationType`: Exposes CRUD operations for the **NotificationType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationTypes
    * const notificationTypes = await prisma.notificationType.findMany()
    * ```
    */
  get notificationType(): Prisma.NotificationTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.inAppNotification`: Exposes CRUD operations for the **InAppNotification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InAppNotifications
    * const inAppNotifications = await prisma.inAppNotification.findMany()
    * ```
    */
  get inAppNotification(): Prisma.InAppNotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userNotification`: Exposes CRUD operations for the **UserNotification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserNotifications
    * const userNotifications = await prisma.userNotification.findMany()
    * ```
    */
  get userNotification(): Prisma.UserNotificationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    NotificationType: 'NotificationType',
    Notification: 'Notification',
    InAppNotification: 'InAppNotification',
    UserNotification: 'UserNotification'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "notificationType" | "notification" | "inAppNotification" | "userNotification"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      NotificationType: {
        payload: Prisma.$NotificationTypePayload<ExtArgs>
        fields: Prisma.NotificationTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>
          }
          findFirst: {
            args: Prisma.NotificationTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>
          }
          findMany: {
            args: Prisma.NotificationTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>[]
          }
          create: {
            args: Prisma.NotificationTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>
          }
          createMany: {
            args: Prisma.NotificationTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>[]
          }
          delete: {
            args: Prisma.NotificationTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>
          }
          update: {
            args: Prisma.NotificationTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>
          }
          deleteMany: {
            args: Prisma.NotificationTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>[]
          }
          upsert: {
            args: Prisma.NotificationTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationTypePayload>
          }
          aggregate: {
            args: Prisma.NotificationTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationType>
          }
          groupBy: {
            args: Prisma.NotificationTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationTypeCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationTypeCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      InAppNotification: {
        payload: Prisma.$InAppNotificationPayload<ExtArgs>
        fields: Prisma.InAppNotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InAppNotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InAppNotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InAppNotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InAppNotificationPayload>
          }
          findFirst: {
            args: Prisma.InAppNotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InAppNotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InAppNotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InAppNotificationPayload>
          }
          findMany: {
            args: Prisma.InAppNotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InAppNotificationPayload>[]
          }
          create: {
            args: Prisma.InAppNotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InAppNotificationPayload>
          }
          createMany: {
            args: Prisma.InAppNotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InAppNotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InAppNotificationPayload>[]
          }
          delete: {
            args: Prisma.InAppNotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InAppNotificationPayload>
          }
          update: {
            args: Prisma.InAppNotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InAppNotificationPayload>
          }
          deleteMany: {
            args: Prisma.InAppNotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InAppNotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InAppNotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InAppNotificationPayload>[]
          }
          upsert: {
            args: Prisma.InAppNotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InAppNotificationPayload>
          }
          aggregate: {
            args: Prisma.InAppNotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInAppNotification>
          }
          groupBy: {
            args: Prisma.InAppNotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<InAppNotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.InAppNotificationCountArgs<ExtArgs>
            result: $Utils.Optional<InAppNotificationCountAggregateOutputType> | number
          }
        }
      }
      UserNotification: {
        payload: Prisma.$UserNotificationPayload<ExtArgs>
        fields: Prisma.UserNotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserNotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserNotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPayload>
          }
          findFirst: {
            args: Prisma.UserNotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserNotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPayload>
          }
          findMany: {
            args: Prisma.UserNotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPayload>[]
          }
          create: {
            args: Prisma.UserNotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPayload>
          }
          createMany: {
            args: Prisma.UserNotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserNotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPayload>[]
          }
          delete: {
            args: Prisma.UserNotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPayload>
          }
          update: {
            args: Prisma.UserNotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPayload>
          }
          deleteMany: {
            args: Prisma.UserNotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserNotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserNotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPayload>[]
          }
          upsert: {
            args: Prisma.UserNotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserNotificationPayload>
          }
          aggregate: {
            args: Prisma.UserNotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserNotification>
          }
          groupBy: {
            args: Prisma.UserNotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserNotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserNotificationCountArgs<ExtArgs>
            result: $Utils.Optional<UserNotificationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    notificationType?: NotificationTypeOmit
    notification?: NotificationOmit
    inAppNotification?: InAppNotificationOmit
    userNotification?: UserNotificationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type NotificationTypeCountOutputType
   */

  export type NotificationTypeCountOutputType = {
    notifications: number
  }

  export type NotificationTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notifications?: boolean | NotificationTypeCountOutputTypeCountNotificationsArgs
  }

  // Custom InputTypes
  /**
   * NotificationTypeCountOutputType without action
   */
  export type NotificationTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationTypeCountOutputType
     */
    select?: NotificationTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NotificationTypeCountOutputType without action
   */
  export type NotificationTypeCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }


  /**
   * Count Type NotificationCountOutputType
   */

  export type NotificationCountOutputType = {
    userNotifications: number
  }

  export type NotificationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userNotifications?: boolean | NotificationCountOutputTypeCountUserNotificationsArgs
  }

  // Custom InputTypes
  /**
   * NotificationCountOutputType without action
   */
  export type NotificationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationCountOutputType
     */
    select?: NotificationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NotificationCountOutputType without action
   */
  export type NotificationCountOutputTypeCountUserNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserNotificationWhereInput
  }


  /**
   * Models
   */

  /**
   * Model NotificationType
   */

  export type AggregateNotificationType = {
    _count: NotificationTypeCountAggregateOutputType | null
    _min: NotificationTypeMinAggregateOutputType | null
    _max: NotificationTypeMaxAggregateOutputType | null
  }

  export type NotificationTypeMinAggregateOutputType = {
    id: string | null
    name: string | null
    isLocked: boolean | null
  }

  export type NotificationTypeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    isLocked: boolean | null
  }

  export type NotificationTypeCountAggregateOutputType = {
    id: number
    name: number
    isLocked: number
    _all: number
  }


  export type NotificationTypeMinAggregateInputType = {
    id?: true
    name?: true
    isLocked?: true
  }

  export type NotificationTypeMaxAggregateInputType = {
    id?: true
    name?: true
    isLocked?: true
  }

  export type NotificationTypeCountAggregateInputType = {
    id?: true
    name?: true
    isLocked?: true
    _all?: true
  }

  export type NotificationTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationType to aggregate.
     */
    where?: NotificationTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationTypes to fetch.
     */
    orderBy?: NotificationTypeOrderByWithRelationInput | NotificationTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationTypes
    **/
    _count?: true | NotificationTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationTypeMaxAggregateInputType
  }

  export type GetNotificationTypeAggregateType<T extends NotificationTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationType[P]>
      : GetScalarType<T[P], AggregateNotificationType[P]>
  }




  export type NotificationTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationTypeWhereInput
    orderBy?: NotificationTypeOrderByWithAggregationInput | NotificationTypeOrderByWithAggregationInput[]
    by: NotificationTypeScalarFieldEnum[] | NotificationTypeScalarFieldEnum
    having?: NotificationTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationTypeCountAggregateInputType | true
    _min?: NotificationTypeMinAggregateInputType
    _max?: NotificationTypeMaxAggregateInputType
  }

  export type NotificationTypeGroupByOutputType = {
    id: string
    name: string
    isLocked: boolean
    _count: NotificationTypeCountAggregateOutputType | null
    _min: NotificationTypeMinAggregateOutputType | null
    _max: NotificationTypeMaxAggregateOutputType | null
  }

  type GetNotificationTypeGroupByPayload<T extends NotificationTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationTypeGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationTypeGroupByOutputType[P]>
        }
      >
    >


  export type NotificationTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isLocked?: boolean
    notifications?: boolean | NotificationType$notificationsArgs<ExtArgs>
    _count?: boolean | NotificationTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificationType"]>

  export type NotificationTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isLocked?: boolean
  }, ExtArgs["result"]["notificationType"]>

  export type NotificationTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isLocked?: boolean
  }, ExtArgs["result"]["notificationType"]>

  export type NotificationTypeSelectScalar = {
    id?: boolean
    name?: boolean
    isLocked?: boolean
  }

  export type NotificationTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "isLocked", ExtArgs["result"]["notificationType"]>
  export type NotificationTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notifications?: boolean | NotificationType$notificationsArgs<ExtArgs>
    _count?: boolean | NotificationTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NotificationTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type NotificationTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $NotificationTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationType"
    objects: {
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      isLocked: boolean
    }, ExtArgs["result"]["notificationType"]>
    composites: {}
  }

  type NotificationTypeGetPayload<S extends boolean | null | undefined | NotificationTypeDefaultArgs> = $Result.GetResult<Prisma.$NotificationTypePayload, S>

  type NotificationTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationTypeCountAggregateInputType | true
    }

  export interface NotificationTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationType'], meta: { name: 'NotificationType' } }
    /**
     * Find zero or one NotificationType that matches the filter.
     * @param {NotificationTypeFindUniqueArgs} args - Arguments to find a NotificationType
     * @example
     * // Get one NotificationType
     * const notificationType = await prisma.notificationType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationTypeFindUniqueArgs>(args: SelectSubset<T, NotificationTypeFindUniqueArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NotificationType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationTypeFindUniqueOrThrowArgs} args - Arguments to find a NotificationType
     * @example
     * // Get one NotificationType
     * const notificationType = await prisma.notificationType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NotificationType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeFindFirstArgs} args - Arguments to find a NotificationType
     * @example
     * // Get one NotificationType
     * const notificationType = await prisma.notificationType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationTypeFindFirstArgs>(args?: SelectSubset<T, NotificationTypeFindFirstArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NotificationType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeFindFirstOrThrowArgs} args - Arguments to find a NotificationType
     * @example
     * // Get one NotificationType
     * const notificationType = await prisma.notificationType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NotificationTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationTypes
     * const notificationTypes = await prisma.notificationType.findMany()
     * 
     * // Get first 10 NotificationTypes
     * const notificationTypes = await prisma.notificationType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationTypeWithIdOnly = await prisma.notificationType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationTypeFindManyArgs>(args?: SelectSubset<T, NotificationTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NotificationType.
     * @param {NotificationTypeCreateArgs} args - Arguments to create a NotificationType.
     * @example
     * // Create one NotificationType
     * const NotificationType = await prisma.notificationType.create({
     *   data: {
     *     // ... data to create a NotificationType
     *   }
     * })
     * 
     */
    create<T extends NotificationTypeCreateArgs>(args: SelectSubset<T, NotificationTypeCreateArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NotificationTypes.
     * @param {NotificationTypeCreateManyArgs} args - Arguments to create many NotificationTypes.
     * @example
     * // Create many NotificationTypes
     * const notificationType = await prisma.notificationType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationTypeCreateManyArgs>(args?: SelectSubset<T, NotificationTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many NotificationTypes and returns the data saved in the database.
     * @param {NotificationTypeCreateManyAndReturnArgs} args - Arguments to create many NotificationTypes.
     * @example
     * // Create many NotificationTypes
     * const notificationType = await prisma.notificationType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many NotificationTypes and only return the `id`
     * const notificationTypeWithIdOnly = await prisma.notificationType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a NotificationType.
     * @param {NotificationTypeDeleteArgs} args - Arguments to delete one NotificationType.
     * @example
     * // Delete one NotificationType
     * const NotificationType = await prisma.notificationType.delete({
     *   where: {
     *     // ... filter to delete one NotificationType
     *   }
     * })
     * 
     */
    delete<T extends NotificationTypeDeleteArgs>(args: SelectSubset<T, NotificationTypeDeleteArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NotificationType.
     * @param {NotificationTypeUpdateArgs} args - Arguments to update one NotificationType.
     * @example
     * // Update one NotificationType
     * const notificationType = await prisma.notificationType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationTypeUpdateArgs>(args: SelectSubset<T, NotificationTypeUpdateArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NotificationTypes.
     * @param {NotificationTypeDeleteManyArgs} args - Arguments to filter NotificationTypes to delete.
     * @example
     * // Delete a few NotificationTypes
     * const { count } = await prisma.notificationType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationTypeDeleteManyArgs>(args?: SelectSubset<T, NotificationTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationTypes
     * const notificationType = await prisma.notificationType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationTypeUpdateManyArgs>(args: SelectSubset<T, NotificationTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationTypes and returns the data updated in the database.
     * @param {NotificationTypeUpdateManyAndReturnArgs} args - Arguments to update many NotificationTypes.
     * @example
     * // Update many NotificationTypes
     * const notificationType = await prisma.notificationType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more NotificationTypes and only return the `id`
     * const notificationTypeWithIdOnly = await prisma.notificationType.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one NotificationType.
     * @param {NotificationTypeUpsertArgs} args - Arguments to update or create a NotificationType.
     * @example
     * // Update or create a NotificationType
     * const notificationType = await prisma.notificationType.upsert({
     *   create: {
     *     // ... data to create a NotificationType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationType we want to update
     *   }
     * })
     */
    upsert<T extends NotificationTypeUpsertArgs>(args: SelectSubset<T, NotificationTypeUpsertArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NotificationTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeCountArgs} args - Arguments to filter NotificationTypes to count.
     * @example
     * // Count the number of NotificationTypes
     * const count = await prisma.notificationType.count({
     *   where: {
     *     // ... the filter for the NotificationTypes we want to count
     *   }
     * })
    **/
    count<T extends NotificationTypeCountArgs>(
      args?: Subset<T, NotificationTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationTypeAggregateArgs>(args: Subset<T, NotificationTypeAggregateArgs>): Prisma.PrismaPromise<GetNotificationTypeAggregateType<T>>

    /**
     * Group by NotificationType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationTypeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationTypeGroupByArgs['orderBy'] }
        : { orderBy?: NotificationTypeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationType model
   */
  readonly fields: NotificationTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    notifications<T extends NotificationType$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, NotificationType$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NotificationType model
   */
  interface NotificationTypeFieldRefs {
    readonly id: FieldRef<"NotificationType", 'String'>
    readonly name: FieldRef<"NotificationType", 'String'>
    readonly isLocked: FieldRef<"NotificationType", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * NotificationType findUnique
   */
  export type NotificationTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationType
     */
    omit?: NotificationTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * Filter, which NotificationType to fetch.
     */
    where: NotificationTypeWhereUniqueInput
  }

  /**
   * NotificationType findUniqueOrThrow
   */
  export type NotificationTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationType
     */
    omit?: NotificationTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * Filter, which NotificationType to fetch.
     */
    where: NotificationTypeWhereUniqueInput
  }

  /**
   * NotificationType findFirst
   */
  export type NotificationTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationType
     */
    omit?: NotificationTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * Filter, which NotificationType to fetch.
     */
    where?: NotificationTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationTypes to fetch.
     */
    orderBy?: NotificationTypeOrderByWithRelationInput | NotificationTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationTypes.
     */
    cursor?: NotificationTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationTypes.
     */
    distinct?: NotificationTypeScalarFieldEnum | NotificationTypeScalarFieldEnum[]
  }

  /**
   * NotificationType findFirstOrThrow
   */
  export type NotificationTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationType
     */
    omit?: NotificationTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * Filter, which NotificationType to fetch.
     */
    where?: NotificationTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationTypes to fetch.
     */
    orderBy?: NotificationTypeOrderByWithRelationInput | NotificationTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationTypes.
     */
    cursor?: NotificationTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationTypes.
     */
    distinct?: NotificationTypeScalarFieldEnum | NotificationTypeScalarFieldEnum[]
  }

  /**
   * NotificationType findMany
   */
  export type NotificationTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationType
     */
    omit?: NotificationTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * Filter, which NotificationTypes to fetch.
     */
    where?: NotificationTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationTypes to fetch.
     */
    orderBy?: NotificationTypeOrderByWithRelationInput | NotificationTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationTypes.
     */
    cursor?: NotificationTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationTypes.
     */
    skip?: number
    distinct?: NotificationTypeScalarFieldEnum | NotificationTypeScalarFieldEnum[]
  }

  /**
   * NotificationType create
   */
  export type NotificationTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationType
     */
    omit?: NotificationTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a NotificationType.
     */
    data: XOR<NotificationTypeCreateInput, NotificationTypeUncheckedCreateInput>
  }

  /**
   * NotificationType createMany
   */
  export type NotificationTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationTypes.
     */
    data: NotificationTypeCreateManyInput | NotificationTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationType createManyAndReturn
   */
  export type NotificationTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationType
     */
    omit?: NotificationTypeOmit<ExtArgs> | null
    /**
     * The data used to create many NotificationTypes.
     */
    data: NotificationTypeCreateManyInput | NotificationTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationType update
   */
  export type NotificationTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationType
     */
    omit?: NotificationTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a NotificationType.
     */
    data: XOR<NotificationTypeUpdateInput, NotificationTypeUncheckedUpdateInput>
    /**
     * Choose, which NotificationType to update.
     */
    where: NotificationTypeWhereUniqueInput
  }

  /**
   * NotificationType updateMany
   */
  export type NotificationTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationTypes.
     */
    data: XOR<NotificationTypeUpdateManyMutationInput, NotificationTypeUncheckedUpdateManyInput>
    /**
     * Filter which NotificationTypes to update
     */
    where?: NotificationTypeWhereInput
    /**
     * Limit how many NotificationTypes to update.
     */
    limit?: number
  }

  /**
   * NotificationType updateManyAndReturn
   */
  export type NotificationTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationType
     */
    omit?: NotificationTypeOmit<ExtArgs> | null
    /**
     * The data used to update NotificationTypes.
     */
    data: XOR<NotificationTypeUpdateManyMutationInput, NotificationTypeUncheckedUpdateManyInput>
    /**
     * Filter which NotificationTypes to update
     */
    where?: NotificationTypeWhereInput
    /**
     * Limit how many NotificationTypes to update.
     */
    limit?: number
  }

  /**
   * NotificationType upsert
   */
  export type NotificationTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationType
     */
    omit?: NotificationTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the NotificationType to update in case it exists.
     */
    where: NotificationTypeWhereUniqueInput
    /**
     * In case the NotificationType found by the `where` argument doesn't exist, create a new NotificationType with this data.
     */
    create: XOR<NotificationTypeCreateInput, NotificationTypeUncheckedCreateInput>
    /**
     * In case the NotificationType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationTypeUpdateInput, NotificationTypeUncheckedUpdateInput>
  }

  /**
   * NotificationType delete
   */
  export type NotificationTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationType
     */
    omit?: NotificationTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
    /**
     * Filter which NotificationType to delete.
     */
    where: NotificationTypeWhereUniqueInput
  }

  /**
   * NotificationType deleteMany
   */
  export type NotificationTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationTypes to delete
     */
    where?: NotificationTypeWhereInput
    /**
     * Limit how many NotificationTypes to delete.
     */
    limit?: number
  }

  /**
   * NotificationType.notifications
   */
  export type NotificationType$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * NotificationType without action
   */
  export type NotificationTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationType
     */
    select?: NotificationTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationType
     */
    omit?: NotificationTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationTypeInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    createdAt: Date | null
    seen: boolean | null
    notificationTypeId: string | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    title: string | null
    content: string | null
    createdAt: Date | null
    seen: boolean | null
    notificationTypeId: string | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    title: number
    content: number
    createdAt: number
    seen: number
    notificationTypeId: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    title?: true
    content?: true
    createdAt?: true
    seen?: true
    notificationTypeId?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    title?: true
    content?: true
    createdAt?: true
    seen?: true
    notificationTypeId?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    title?: true
    content?: true
    createdAt?: true
    seen?: true
    notificationTypeId?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    title: string
    content: string
    createdAt: Date
    seen: boolean
    notificationTypeId: string
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    seen?: boolean
    notificationTypeId?: boolean
    notificationType?: boolean | NotificationTypeDefaultArgs<ExtArgs>
    userNotifications?: boolean | Notification$userNotificationsArgs<ExtArgs>
    _count?: boolean | NotificationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    seen?: boolean
    notificationTypeId?: boolean
    notificationType?: boolean | NotificationTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    seen?: boolean
    notificationTypeId?: boolean
    notificationType?: boolean | NotificationTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    title?: boolean
    content?: boolean
    createdAt?: boolean
    seen?: boolean
    notificationTypeId?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "content" | "createdAt" | "seen" | "notificationTypeId", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notificationType?: boolean | NotificationTypeDefaultArgs<ExtArgs>
    userNotifications?: boolean | Notification$userNotificationsArgs<ExtArgs>
    _count?: boolean | NotificationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notificationType?: boolean | NotificationTypeDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notificationType?: boolean | NotificationTypeDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      notificationType: Prisma.$NotificationTypePayload<ExtArgs>
      userNotifications: Prisma.$UserNotificationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      content: string
      createdAt: Date
      seen: boolean
      notificationTypeId: string
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    notificationType<T extends NotificationTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NotificationTypeDefaultArgs<ExtArgs>>): Prisma__NotificationTypeClient<$Result.GetResult<Prisma.$NotificationTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    userNotifications<T extends Notification$userNotificationsArgs<ExtArgs> = {}>(args?: Subset<T, Notification$userNotificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly content: FieldRef<"Notification", 'String'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
    readonly seen: FieldRef<"Notification", 'Boolean'>
    readonly notificationTypeId: FieldRef<"Notification", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification.userNotifications
   */
  export type Notification$userNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationInclude<ExtArgs> | null
    where?: UserNotificationWhereInput
    orderBy?: UserNotificationOrderByWithRelationInput | UserNotificationOrderByWithRelationInput[]
    cursor?: UserNotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserNotificationScalarFieldEnum | UserNotificationScalarFieldEnum[]
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model InAppNotification
   */

  export type AggregateInAppNotification = {
    _count: InAppNotificationCountAggregateOutputType | null
    _min: InAppNotificationMinAggregateOutputType | null
    _max: InAppNotificationMaxAggregateOutputType | null
  }

  export type InAppNotificationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    content: string | null
    type: string | null
    isRead: boolean | null
    isArchived: boolean | null
    createdAt: Date | null
    readAt: Date | null
    archivedAt: Date | null
    contractId: string | null
    courseId: string | null
  }

  export type InAppNotificationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    content: string | null
    type: string | null
    isRead: boolean | null
    isArchived: boolean | null
    createdAt: Date | null
    readAt: Date | null
    archivedAt: Date | null
    contractId: string | null
    courseId: string | null
  }

  export type InAppNotificationCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    content: number
    type: number
    isRead: number
    isArchived: number
    createdAt: number
    readAt: number
    archivedAt: number
    contractId: number
    courseId: number
    metadata: number
    _all: number
  }


  export type InAppNotificationMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    content?: true
    type?: true
    isRead?: true
    isArchived?: true
    createdAt?: true
    readAt?: true
    archivedAt?: true
    contractId?: true
    courseId?: true
  }

  export type InAppNotificationMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    content?: true
    type?: true
    isRead?: true
    isArchived?: true
    createdAt?: true
    readAt?: true
    archivedAt?: true
    contractId?: true
    courseId?: true
  }

  export type InAppNotificationCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    content?: true
    type?: true
    isRead?: true
    isArchived?: true
    createdAt?: true
    readAt?: true
    archivedAt?: true
    contractId?: true
    courseId?: true
    metadata?: true
    _all?: true
  }

  export type InAppNotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InAppNotification to aggregate.
     */
    where?: InAppNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InAppNotifications to fetch.
     */
    orderBy?: InAppNotificationOrderByWithRelationInput | InAppNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InAppNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InAppNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InAppNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InAppNotifications
    **/
    _count?: true | InAppNotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InAppNotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InAppNotificationMaxAggregateInputType
  }

  export type GetInAppNotificationAggregateType<T extends InAppNotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateInAppNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInAppNotification[P]>
      : GetScalarType<T[P], AggregateInAppNotification[P]>
  }




  export type InAppNotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InAppNotificationWhereInput
    orderBy?: InAppNotificationOrderByWithAggregationInput | InAppNotificationOrderByWithAggregationInput[]
    by: InAppNotificationScalarFieldEnum[] | InAppNotificationScalarFieldEnum
    having?: InAppNotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InAppNotificationCountAggregateInputType | true
    _min?: InAppNotificationMinAggregateInputType
    _max?: InAppNotificationMaxAggregateInputType
  }

  export type InAppNotificationGroupByOutputType = {
    id: string
    userId: string
    title: string
    content: string
    type: string
    isRead: boolean
    isArchived: boolean
    createdAt: Date
    readAt: Date | null
    archivedAt: Date | null
    contractId: string | null
    courseId: string | null
    metadata: JsonValue | null
    _count: InAppNotificationCountAggregateOutputType | null
    _min: InAppNotificationMinAggregateOutputType | null
    _max: InAppNotificationMaxAggregateOutputType | null
  }

  type GetInAppNotificationGroupByPayload<T extends InAppNotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InAppNotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InAppNotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InAppNotificationGroupByOutputType[P]>
            : GetScalarType<T[P], InAppNotificationGroupByOutputType[P]>
        }
      >
    >


  export type InAppNotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    content?: boolean
    type?: boolean
    isRead?: boolean
    isArchived?: boolean
    createdAt?: boolean
    readAt?: boolean
    archivedAt?: boolean
    contractId?: boolean
    courseId?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["inAppNotification"]>

  export type InAppNotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    content?: boolean
    type?: boolean
    isRead?: boolean
    isArchived?: boolean
    createdAt?: boolean
    readAt?: boolean
    archivedAt?: boolean
    contractId?: boolean
    courseId?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["inAppNotification"]>

  export type InAppNotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    content?: boolean
    type?: boolean
    isRead?: boolean
    isArchived?: boolean
    createdAt?: boolean
    readAt?: boolean
    archivedAt?: boolean
    contractId?: boolean
    courseId?: boolean
    metadata?: boolean
  }, ExtArgs["result"]["inAppNotification"]>

  export type InAppNotificationSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    content?: boolean
    type?: boolean
    isRead?: boolean
    isArchived?: boolean
    createdAt?: boolean
    readAt?: boolean
    archivedAt?: boolean
    contractId?: boolean
    courseId?: boolean
    metadata?: boolean
  }

  export type InAppNotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "content" | "type" | "isRead" | "isArchived" | "createdAt" | "readAt" | "archivedAt" | "contractId" | "courseId" | "metadata", ExtArgs["result"]["inAppNotification"]>

  export type $InAppNotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InAppNotification"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      content: string
      type: string
      isRead: boolean
      isArchived: boolean
      createdAt: Date
      readAt: Date | null
      archivedAt: Date | null
      contractId: string | null
      courseId: string | null
      metadata: Prisma.JsonValue | null
    }, ExtArgs["result"]["inAppNotification"]>
    composites: {}
  }

  type InAppNotificationGetPayload<S extends boolean | null | undefined | InAppNotificationDefaultArgs> = $Result.GetResult<Prisma.$InAppNotificationPayload, S>

  type InAppNotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InAppNotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InAppNotificationCountAggregateInputType | true
    }

  export interface InAppNotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InAppNotification'], meta: { name: 'InAppNotification' } }
    /**
     * Find zero or one InAppNotification that matches the filter.
     * @param {InAppNotificationFindUniqueArgs} args - Arguments to find a InAppNotification
     * @example
     * // Get one InAppNotification
     * const inAppNotification = await prisma.inAppNotification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InAppNotificationFindUniqueArgs>(args: SelectSubset<T, InAppNotificationFindUniqueArgs<ExtArgs>>): Prisma__InAppNotificationClient<$Result.GetResult<Prisma.$InAppNotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InAppNotification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InAppNotificationFindUniqueOrThrowArgs} args - Arguments to find a InAppNotification
     * @example
     * // Get one InAppNotification
     * const inAppNotification = await prisma.inAppNotification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InAppNotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, InAppNotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InAppNotificationClient<$Result.GetResult<Prisma.$InAppNotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InAppNotification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InAppNotificationFindFirstArgs} args - Arguments to find a InAppNotification
     * @example
     * // Get one InAppNotification
     * const inAppNotification = await prisma.inAppNotification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InAppNotificationFindFirstArgs>(args?: SelectSubset<T, InAppNotificationFindFirstArgs<ExtArgs>>): Prisma__InAppNotificationClient<$Result.GetResult<Prisma.$InAppNotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InAppNotification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InAppNotificationFindFirstOrThrowArgs} args - Arguments to find a InAppNotification
     * @example
     * // Get one InAppNotification
     * const inAppNotification = await prisma.inAppNotification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InAppNotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, InAppNotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__InAppNotificationClient<$Result.GetResult<Prisma.$InAppNotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InAppNotifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InAppNotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InAppNotifications
     * const inAppNotifications = await prisma.inAppNotification.findMany()
     * 
     * // Get first 10 InAppNotifications
     * const inAppNotifications = await prisma.inAppNotification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inAppNotificationWithIdOnly = await prisma.inAppNotification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InAppNotificationFindManyArgs>(args?: SelectSubset<T, InAppNotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InAppNotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InAppNotification.
     * @param {InAppNotificationCreateArgs} args - Arguments to create a InAppNotification.
     * @example
     * // Create one InAppNotification
     * const InAppNotification = await prisma.inAppNotification.create({
     *   data: {
     *     // ... data to create a InAppNotification
     *   }
     * })
     * 
     */
    create<T extends InAppNotificationCreateArgs>(args: SelectSubset<T, InAppNotificationCreateArgs<ExtArgs>>): Prisma__InAppNotificationClient<$Result.GetResult<Prisma.$InAppNotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InAppNotifications.
     * @param {InAppNotificationCreateManyArgs} args - Arguments to create many InAppNotifications.
     * @example
     * // Create many InAppNotifications
     * const inAppNotification = await prisma.inAppNotification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InAppNotificationCreateManyArgs>(args?: SelectSubset<T, InAppNotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InAppNotifications and returns the data saved in the database.
     * @param {InAppNotificationCreateManyAndReturnArgs} args - Arguments to create many InAppNotifications.
     * @example
     * // Create many InAppNotifications
     * const inAppNotification = await prisma.inAppNotification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InAppNotifications and only return the `id`
     * const inAppNotificationWithIdOnly = await prisma.inAppNotification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InAppNotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, InAppNotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InAppNotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a InAppNotification.
     * @param {InAppNotificationDeleteArgs} args - Arguments to delete one InAppNotification.
     * @example
     * // Delete one InAppNotification
     * const InAppNotification = await prisma.inAppNotification.delete({
     *   where: {
     *     // ... filter to delete one InAppNotification
     *   }
     * })
     * 
     */
    delete<T extends InAppNotificationDeleteArgs>(args: SelectSubset<T, InAppNotificationDeleteArgs<ExtArgs>>): Prisma__InAppNotificationClient<$Result.GetResult<Prisma.$InAppNotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InAppNotification.
     * @param {InAppNotificationUpdateArgs} args - Arguments to update one InAppNotification.
     * @example
     * // Update one InAppNotification
     * const inAppNotification = await prisma.inAppNotification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InAppNotificationUpdateArgs>(args: SelectSubset<T, InAppNotificationUpdateArgs<ExtArgs>>): Prisma__InAppNotificationClient<$Result.GetResult<Prisma.$InAppNotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InAppNotifications.
     * @param {InAppNotificationDeleteManyArgs} args - Arguments to filter InAppNotifications to delete.
     * @example
     * // Delete a few InAppNotifications
     * const { count } = await prisma.inAppNotification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InAppNotificationDeleteManyArgs>(args?: SelectSubset<T, InAppNotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InAppNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InAppNotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InAppNotifications
     * const inAppNotification = await prisma.inAppNotification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InAppNotificationUpdateManyArgs>(args: SelectSubset<T, InAppNotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InAppNotifications and returns the data updated in the database.
     * @param {InAppNotificationUpdateManyAndReturnArgs} args - Arguments to update many InAppNotifications.
     * @example
     * // Update many InAppNotifications
     * const inAppNotification = await prisma.inAppNotification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more InAppNotifications and only return the `id`
     * const inAppNotificationWithIdOnly = await prisma.inAppNotification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InAppNotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, InAppNotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InAppNotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one InAppNotification.
     * @param {InAppNotificationUpsertArgs} args - Arguments to update or create a InAppNotification.
     * @example
     * // Update or create a InAppNotification
     * const inAppNotification = await prisma.inAppNotification.upsert({
     *   create: {
     *     // ... data to create a InAppNotification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InAppNotification we want to update
     *   }
     * })
     */
    upsert<T extends InAppNotificationUpsertArgs>(args: SelectSubset<T, InAppNotificationUpsertArgs<ExtArgs>>): Prisma__InAppNotificationClient<$Result.GetResult<Prisma.$InAppNotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InAppNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InAppNotificationCountArgs} args - Arguments to filter InAppNotifications to count.
     * @example
     * // Count the number of InAppNotifications
     * const count = await prisma.inAppNotification.count({
     *   where: {
     *     // ... the filter for the InAppNotifications we want to count
     *   }
     * })
    **/
    count<T extends InAppNotificationCountArgs>(
      args?: Subset<T, InAppNotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InAppNotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InAppNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InAppNotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InAppNotificationAggregateArgs>(args: Subset<T, InAppNotificationAggregateArgs>): Prisma.PrismaPromise<GetInAppNotificationAggregateType<T>>

    /**
     * Group by InAppNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InAppNotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InAppNotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InAppNotificationGroupByArgs['orderBy'] }
        : { orderBy?: InAppNotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InAppNotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInAppNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InAppNotification model
   */
  readonly fields: InAppNotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InAppNotification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InAppNotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InAppNotification model
   */
  interface InAppNotificationFieldRefs {
    readonly id: FieldRef<"InAppNotification", 'String'>
    readonly userId: FieldRef<"InAppNotification", 'String'>
    readonly title: FieldRef<"InAppNotification", 'String'>
    readonly content: FieldRef<"InAppNotification", 'String'>
    readonly type: FieldRef<"InAppNotification", 'String'>
    readonly isRead: FieldRef<"InAppNotification", 'Boolean'>
    readonly isArchived: FieldRef<"InAppNotification", 'Boolean'>
    readonly createdAt: FieldRef<"InAppNotification", 'DateTime'>
    readonly readAt: FieldRef<"InAppNotification", 'DateTime'>
    readonly archivedAt: FieldRef<"InAppNotification", 'DateTime'>
    readonly contractId: FieldRef<"InAppNotification", 'String'>
    readonly courseId: FieldRef<"InAppNotification", 'String'>
    readonly metadata: FieldRef<"InAppNotification", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * InAppNotification findUnique
   */
  export type InAppNotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InAppNotification
     */
    select?: InAppNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InAppNotification
     */
    omit?: InAppNotificationOmit<ExtArgs> | null
    /**
     * Filter, which InAppNotification to fetch.
     */
    where: InAppNotificationWhereUniqueInput
  }

  /**
   * InAppNotification findUniqueOrThrow
   */
  export type InAppNotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InAppNotification
     */
    select?: InAppNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InAppNotification
     */
    omit?: InAppNotificationOmit<ExtArgs> | null
    /**
     * Filter, which InAppNotification to fetch.
     */
    where: InAppNotificationWhereUniqueInput
  }

  /**
   * InAppNotification findFirst
   */
  export type InAppNotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InAppNotification
     */
    select?: InAppNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InAppNotification
     */
    omit?: InAppNotificationOmit<ExtArgs> | null
    /**
     * Filter, which InAppNotification to fetch.
     */
    where?: InAppNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InAppNotifications to fetch.
     */
    orderBy?: InAppNotificationOrderByWithRelationInput | InAppNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InAppNotifications.
     */
    cursor?: InAppNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InAppNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InAppNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InAppNotifications.
     */
    distinct?: InAppNotificationScalarFieldEnum | InAppNotificationScalarFieldEnum[]
  }

  /**
   * InAppNotification findFirstOrThrow
   */
  export type InAppNotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InAppNotification
     */
    select?: InAppNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InAppNotification
     */
    omit?: InAppNotificationOmit<ExtArgs> | null
    /**
     * Filter, which InAppNotification to fetch.
     */
    where?: InAppNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InAppNotifications to fetch.
     */
    orderBy?: InAppNotificationOrderByWithRelationInput | InAppNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InAppNotifications.
     */
    cursor?: InAppNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InAppNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InAppNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InAppNotifications.
     */
    distinct?: InAppNotificationScalarFieldEnum | InAppNotificationScalarFieldEnum[]
  }

  /**
   * InAppNotification findMany
   */
  export type InAppNotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InAppNotification
     */
    select?: InAppNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InAppNotification
     */
    omit?: InAppNotificationOmit<ExtArgs> | null
    /**
     * Filter, which InAppNotifications to fetch.
     */
    where?: InAppNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InAppNotifications to fetch.
     */
    orderBy?: InAppNotificationOrderByWithRelationInput | InAppNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InAppNotifications.
     */
    cursor?: InAppNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InAppNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InAppNotifications.
     */
    skip?: number
    distinct?: InAppNotificationScalarFieldEnum | InAppNotificationScalarFieldEnum[]
  }

  /**
   * InAppNotification create
   */
  export type InAppNotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InAppNotification
     */
    select?: InAppNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InAppNotification
     */
    omit?: InAppNotificationOmit<ExtArgs> | null
    /**
     * The data needed to create a InAppNotification.
     */
    data: XOR<InAppNotificationCreateInput, InAppNotificationUncheckedCreateInput>
  }

  /**
   * InAppNotification createMany
   */
  export type InAppNotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InAppNotifications.
     */
    data: InAppNotificationCreateManyInput | InAppNotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InAppNotification createManyAndReturn
   */
  export type InAppNotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InAppNotification
     */
    select?: InAppNotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InAppNotification
     */
    omit?: InAppNotificationOmit<ExtArgs> | null
    /**
     * The data used to create many InAppNotifications.
     */
    data: InAppNotificationCreateManyInput | InAppNotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InAppNotification update
   */
  export type InAppNotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InAppNotification
     */
    select?: InAppNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InAppNotification
     */
    omit?: InAppNotificationOmit<ExtArgs> | null
    /**
     * The data needed to update a InAppNotification.
     */
    data: XOR<InAppNotificationUpdateInput, InAppNotificationUncheckedUpdateInput>
    /**
     * Choose, which InAppNotification to update.
     */
    where: InAppNotificationWhereUniqueInput
  }

  /**
   * InAppNotification updateMany
   */
  export type InAppNotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InAppNotifications.
     */
    data: XOR<InAppNotificationUpdateManyMutationInput, InAppNotificationUncheckedUpdateManyInput>
    /**
     * Filter which InAppNotifications to update
     */
    where?: InAppNotificationWhereInput
    /**
     * Limit how many InAppNotifications to update.
     */
    limit?: number
  }

  /**
   * InAppNotification updateManyAndReturn
   */
  export type InAppNotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InAppNotification
     */
    select?: InAppNotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the InAppNotification
     */
    omit?: InAppNotificationOmit<ExtArgs> | null
    /**
     * The data used to update InAppNotifications.
     */
    data: XOR<InAppNotificationUpdateManyMutationInput, InAppNotificationUncheckedUpdateManyInput>
    /**
     * Filter which InAppNotifications to update
     */
    where?: InAppNotificationWhereInput
    /**
     * Limit how many InAppNotifications to update.
     */
    limit?: number
  }

  /**
   * InAppNotification upsert
   */
  export type InAppNotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InAppNotification
     */
    select?: InAppNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InAppNotification
     */
    omit?: InAppNotificationOmit<ExtArgs> | null
    /**
     * The filter to search for the InAppNotification to update in case it exists.
     */
    where: InAppNotificationWhereUniqueInput
    /**
     * In case the InAppNotification found by the `where` argument doesn't exist, create a new InAppNotification with this data.
     */
    create: XOR<InAppNotificationCreateInput, InAppNotificationUncheckedCreateInput>
    /**
     * In case the InAppNotification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InAppNotificationUpdateInput, InAppNotificationUncheckedUpdateInput>
  }

  /**
   * InAppNotification delete
   */
  export type InAppNotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InAppNotification
     */
    select?: InAppNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InAppNotification
     */
    omit?: InAppNotificationOmit<ExtArgs> | null
    /**
     * Filter which InAppNotification to delete.
     */
    where: InAppNotificationWhereUniqueInput
  }

  /**
   * InAppNotification deleteMany
   */
  export type InAppNotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InAppNotifications to delete
     */
    where?: InAppNotificationWhereInput
    /**
     * Limit how many InAppNotifications to delete.
     */
    limit?: number
  }

  /**
   * InAppNotification without action
   */
  export type InAppNotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InAppNotification
     */
    select?: InAppNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InAppNotification
     */
    omit?: InAppNotificationOmit<ExtArgs> | null
  }


  /**
   * Model UserNotification
   */

  export type AggregateUserNotification = {
    _count: UserNotificationCountAggregateOutputType | null
    _min: UserNotificationMinAggregateOutputType | null
    _max: UserNotificationMaxAggregateOutputType | null
  }

  export type UserNotificationMinAggregateOutputType = {
    notificationId: string | null
    userId: string | null
  }

  export type UserNotificationMaxAggregateOutputType = {
    notificationId: string | null
    userId: string | null
  }

  export type UserNotificationCountAggregateOutputType = {
    notificationId: number
    userId: number
    _all: number
  }


  export type UserNotificationMinAggregateInputType = {
    notificationId?: true
    userId?: true
  }

  export type UserNotificationMaxAggregateInputType = {
    notificationId?: true
    userId?: true
  }

  export type UserNotificationCountAggregateInputType = {
    notificationId?: true
    userId?: true
    _all?: true
  }

  export type UserNotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserNotification to aggregate.
     */
    where?: UserNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserNotifications to fetch.
     */
    orderBy?: UserNotificationOrderByWithRelationInput | UserNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserNotifications
    **/
    _count?: true | UserNotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserNotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserNotificationMaxAggregateInputType
  }

  export type GetUserNotificationAggregateType<T extends UserNotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateUserNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserNotification[P]>
      : GetScalarType<T[P], AggregateUserNotification[P]>
  }




  export type UserNotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserNotificationWhereInput
    orderBy?: UserNotificationOrderByWithAggregationInput | UserNotificationOrderByWithAggregationInput[]
    by: UserNotificationScalarFieldEnum[] | UserNotificationScalarFieldEnum
    having?: UserNotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserNotificationCountAggregateInputType | true
    _min?: UserNotificationMinAggregateInputType
    _max?: UserNotificationMaxAggregateInputType
  }

  export type UserNotificationGroupByOutputType = {
    notificationId: string
    userId: string
    _count: UserNotificationCountAggregateOutputType | null
    _min: UserNotificationMinAggregateOutputType | null
    _max: UserNotificationMaxAggregateOutputType | null
  }

  type GetUserNotificationGroupByPayload<T extends UserNotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserNotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserNotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserNotificationGroupByOutputType[P]>
            : GetScalarType<T[P], UserNotificationGroupByOutputType[P]>
        }
      >
    >


  export type UserNotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    notificationId?: boolean
    userId?: boolean
    notification?: boolean | NotificationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userNotification"]>

  export type UserNotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    notificationId?: boolean
    userId?: boolean
    notification?: boolean | NotificationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userNotification"]>

  export type UserNotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    notificationId?: boolean
    userId?: boolean
    notification?: boolean | NotificationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userNotification"]>

  export type UserNotificationSelectScalar = {
    notificationId?: boolean
    userId?: boolean
  }

  export type UserNotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"notificationId" | "userId", ExtArgs["result"]["userNotification"]>
  export type UserNotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notification?: boolean | NotificationDefaultArgs<ExtArgs>
  }
  export type UserNotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notification?: boolean | NotificationDefaultArgs<ExtArgs>
  }
  export type UserNotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notification?: boolean | NotificationDefaultArgs<ExtArgs>
  }

  export type $UserNotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserNotification"
    objects: {
      notification: Prisma.$NotificationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      notificationId: string
      userId: string
    }, ExtArgs["result"]["userNotification"]>
    composites: {}
  }

  type UserNotificationGetPayload<S extends boolean | null | undefined | UserNotificationDefaultArgs> = $Result.GetResult<Prisma.$UserNotificationPayload, S>

  type UserNotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserNotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserNotificationCountAggregateInputType | true
    }

  export interface UserNotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserNotification'], meta: { name: 'UserNotification' } }
    /**
     * Find zero or one UserNotification that matches the filter.
     * @param {UserNotificationFindUniqueArgs} args - Arguments to find a UserNotification
     * @example
     * // Get one UserNotification
     * const userNotification = await prisma.userNotification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserNotificationFindUniqueArgs>(args: SelectSubset<T, UserNotificationFindUniqueArgs<ExtArgs>>): Prisma__UserNotificationClient<$Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserNotification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserNotificationFindUniqueOrThrowArgs} args - Arguments to find a UserNotification
     * @example
     * // Get one UserNotification
     * const userNotification = await prisma.userNotification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserNotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, UserNotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserNotificationClient<$Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserNotification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationFindFirstArgs} args - Arguments to find a UserNotification
     * @example
     * // Get one UserNotification
     * const userNotification = await prisma.userNotification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserNotificationFindFirstArgs>(args?: SelectSubset<T, UserNotificationFindFirstArgs<ExtArgs>>): Prisma__UserNotificationClient<$Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserNotification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationFindFirstOrThrowArgs} args - Arguments to find a UserNotification
     * @example
     * // Get one UserNotification
     * const userNotification = await prisma.userNotification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserNotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, UserNotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserNotificationClient<$Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserNotifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserNotifications
     * const userNotifications = await prisma.userNotification.findMany()
     * 
     * // Get first 10 UserNotifications
     * const userNotifications = await prisma.userNotification.findMany({ take: 10 })
     * 
     * // Only select the `notificationId`
     * const userNotificationWithNotificationIdOnly = await prisma.userNotification.findMany({ select: { notificationId: true } })
     * 
     */
    findMany<T extends UserNotificationFindManyArgs>(args?: SelectSubset<T, UserNotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserNotification.
     * @param {UserNotificationCreateArgs} args - Arguments to create a UserNotification.
     * @example
     * // Create one UserNotification
     * const UserNotification = await prisma.userNotification.create({
     *   data: {
     *     // ... data to create a UserNotification
     *   }
     * })
     * 
     */
    create<T extends UserNotificationCreateArgs>(args: SelectSubset<T, UserNotificationCreateArgs<ExtArgs>>): Prisma__UserNotificationClient<$Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserNotifications.
     * @param {UserNotificationCreateManyArgs} args - Arguments to create many UserNotifications.
     * @example
     * // Create many UserNotifications
     * const userNotification = await prisma.userNotification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserNotificationCreateManyArgs>(args?: SelectSubset<T, UserNotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserNotifications and returns the data saved in the database.
     * @param {UserNotificationCreateManyAndReturnArgs} args - Arguments to create many UserNotifications.
     * @example
     * // Create many UserNotifications
     * const userNotification = await prisma.userNotification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserNotifications and only return the `notificationId`
     * const userNotificationWithNotificationIdOnly = await prisma.userNotification.createManyAndReturn({
     *   select: { notificationId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserNotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, UserNotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserNotification.
     * @param {UserNotificationDeleteArgs} args - Arguments to delete one UserNotification.
     * @example
     * // Delete one UserNotification
     * const UserNotification = await prisma.userNotification.delete({
     *   where: {
     *     // ... filter to delete one UserNotification
     *   }
     * })
     * 
     */
    delete<T extends UserNotificationDeleteArgs>(args: SelectSubset<T, UserNotificationDeleteArgs<ExtArgs>>): Prisma__UserNotificationClient<$Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserNotification.
     * @param {UserNotificationUpdateArgs} args - Arguments to update one UserNotification.
     * @example
     * // Update one UserNotification
     * const userNotification = await prisma.userNotification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserNotificationUpdateArgs>(args: SelectSubset<T, UserNotificationUpdateArgs<ExtArgs>>): Prisma__UserNotificationClient<$Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserNotifications.
     * @param {UserNotificationDeleteManyArgs} args - Arguments to filter UserNotifications to delete.
     * @example
     * // Delete a few UserNotifications
     * const { count } = await prisma.userNotification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserNotificationDeleteManyArgs>(args?: SelectSubset<T, UserNotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserNotifications
     * const userNotification = await prisma.userNotification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserNotificationUpdateManyArgs>(args: SelectSubset<T, UserNotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserNotifications and returns the data updated in the database.
     * @param {UserNotificationUpdateManyAndReturnArgs} args - Arguments to update many UserNotifications.
     * @example
     * // Update many UserNotifications
     * const userNotification = await prisma.userNotification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserNotifications and only return the `notificationId`
     * const userNotificationWithNotificationIdOnly = await prisma.userNotification.updateManyAndReturn({
     *   select: { notificationId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserNotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, UserNotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserNotification.
     * @param {UserNotificationUpsertArgs} args - Arguments to update or create a UserNotification.
     * @example
     * // Update or create a UserNotification
     * const userNotification = await prisma.userNotification.upsert({
     *   create: {
     *     // ... data to create a UserNotification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserNotification we want to update
     *   }
     * })
     */
    upsert<T extends UserNotificationUpsertArgs>(args: SelectSubset<T, UserNotificationUpsertArgs<ExtArgs>>): Prisma__UserNotificationClient<$Result.GetResult<Prisma.$UserNotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserNotifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationCountArgs} args - Arguments to filter UserNotifications to count.
     * @example
     * // Count the number of UserNotifications
     * const count = await prisma.userNotification.count({
     *   where: {
     *     // ... the filter for the UserNotifications we want to count
     *   }
     * })
    **/
    count<T extends UserNotificationCountArgs>(
      args?: Subset<T, UserNotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserNotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserNotificationAggregateArgs>(args: Subset<T, UserNotificationAggregateArgs>): Prisma.PrismaPromise<GetUserNotificationAggregateType<T>>

    /**
     * Group by UserNotification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserNotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserNotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserNotificationGroupByArgs['orderBy'] }
        : { orderBy?: UserNotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserNotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserNotification model
   */
  readonly fields: UserNotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserNotification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserNotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    notification<T extends NotificationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NotificationDefaultArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserNotification model
   */
  interface UserNotificationFieldRefs {
    readonly notificationId: FieldRef<"UserNotification", 'String'>
    readonly userId: FieldRef<"UserNotification", 'String'>
  }
    

  // Custom InputTypes
  /**
   * UserNotification findUnique
   */
  export type UserNotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationInclude<ExtArgs> | null
    /**
     * Filter, which UserNotification to fetch.
     */
    where: UserNotificationWhereUniqueInput
  }

  /**
   * UserNotification findUniqueOrThrow
   */
  export type UserNotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationInclude<ExtArgs> | null
    /**
     * Filter, which UserNotification to fetch.
     */
    where: UserNotificationWhereUniqueInput
  }

  /**
   * UserNotification findFirst
   */
  export type UserNotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationInclude<ExtArgs> | null
    /**
     * Filter, which UserNotification to fetch.
     */
    where?: UserNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserNotifications to fetch.
     */
    orderBy?: UserNotificationOrderByWithRelationInput | UserNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserNotifications.
     */
    cursor?: UserNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserNotifications.
     */
    distinct?: UserNotificationScalarFieldEnum | UserNotificationScalarFieldEnum[]
  }

  /**
   * UserNotification findFirstOrThrow
   */
  export type UserNotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationInclude<ExtArgs> | null
    /**
     * Filter, which UserNotification to fetch.
     */
    where?: UserNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserNotifications to fetch.
     */
    orderBy?: UserNotificationOrderByWithRelationInput | UserNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserNotifications.
     */
    cursor?: UserNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserNotifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserNotifications.
     */
    distinct?: UserNotificationScalarFieldEnum | UserNotificationScalarFieldEnum[]
  }

  /**
   * UserNotification findMany
   */
  export type UserNotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationInclude<ExtArgs> | null
    /**
     * Filter, which UserNotifications to fetch.
     */
    where?: UserNotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserNotifications to fetch.
     */
    orderBy?: UserNotificationOrderByWithRelationInput | UserNotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserNotifications.
     */
    cursor?: UserNotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserNotifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserNotifications.
     */
    skip?: number
    distinct?: UserNotificationScalarFieldEnum | UserNotificationScalarFieldEnum[]
  }

  /**
   * UserNotification create
   */
  export type UserNotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a UserNotification.
     */
    data: XOR<UserNotificationCreateInput, UserNotificationUncheckedCreateInput>
  }

  /**
   * UserNotification createMany
   */
  export type UserNotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserNotifications.
     */
    data: UserNotificationCreateManyInput | UserNotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserNotification createManyAndReturn
   */
  export type UserNotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * The data used to create many UserNotifications.
     */
    data: UserNotificationCreateManyInput | UserNotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserNotification update
   */
  export type UserNotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a UserNotification.
     */
    data: XOR<UserNotificationUpdateInput, UserNotificationUncheckedUpdateInput>
    /**
     * Choose, which UserNotification to update.
     */
    where: UserNotificationWhereUniqueInput
  }

  /**
   * UserNotification updateMany
   */
  export type UserNotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserNotifications.
     */
    data: XOR<UserNotificationUpdateManyMutationInput, UserNotificationUncheckedUpdateManyInput>
    /**
     * Filter which UserNotifications to update
     */
    where?: UserNotificationWhereInput
    /**
     * Limit how many UserNotifications to update.
     */
    limit?: number
  }

  /**
   * UserNotification updateManyAndReturn
   */
  export type UserNotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * The data used to update UserNotifications.
     */
    data: XOR<UserNotificationUpdateManyMutationInput, UserNotificationUncheckedUpdateManyInput>
    /**
     * Filter which UserNotifications to update
     */
    where?: UserNotificationWhereInput
    /**
     * Limit how many UserNotifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserNotification upsert
   */
  export type UserNotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the UserNotification to update in case it exists.
     */
    where: UserNotificationWhereUniqueInput
    /**
     * In case the UserNotification found by the `where` argument doesn't exist, create a new UserNotification with this data.
     */
    create: XOR<UserNotificationCreateInput, UserNotificationUncheckedCreateInput>
    /**
     * In case the UserNotification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserNotificationUpdateInput, UserNotificationUncheckedUpdateInput>
  }

  /**
   * UserNotification delete
   */
  export type UserNotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationInclude<ExtArgs> | null
    /**
     * Filter which UserNotification to delete.
     */
    where: UserNotificationWhereUniqueInput
  }

  /**
   * UserNotification deleteMany
   */
  export type UserNotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserNotifications to delete
     */
    where?: UserNotificationWhereInput
    /**
     * Limit how many UserNotifications to delete.
     */
    limit?: number
  }

  /**
   * UserNotification without action
   */
  export type UserNotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserNotification
     */
    select?: UserNotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserNotification
     */
    omit?: UserNotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserNotificationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const NotificationTypeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    isLocked: 'isLocked'
  };

  export type NotificationTypeScalarFieldEnum = (typeof NotificationTypeScalarFieldEnum)[keyof typeof NotificationTypeScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    title: 'title',
    content: 'content',
    createdAt: 'createdAt',
    seen: 'seen',
    notificationTypeId: 'notificationTypeId'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const InAppNotificationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    content: 'content',
    type: 'type',
    isRead: 'isRead',
    isArchived: 'isArchived',
    createdAt: 'createdAt',
    readAt: 'readAt',
    archivedAt: 'archivedAt',
    contractId: 'contractId',
    courseId: 'courseId',
    metadata: 'metadata'
  };

  export type InAppNotificationScalarFieldEnum = (typeof InAppNotificationScalarFieldEnum)[keyof typeof InAppNotificationScalarFieldEnum]


  export const UserNotificationScalarFieldEnum: {
    notificationId: 'notificationId',
    userId: 'userId'
  };

  export type UserNotificationScalarFieldEnum = (typeof UserNotificationScalarFieldEnum)[keyof typeof UserNotificationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type NotificationTypeWhereInput = {
    AND?: NotificationTypeWhereInput | NotificationTypeWhereInput[]
    OR?: NotificationTypeWhereInput[]
    NOT?: NotificationTypeWhereInput | NotificationTypeWhereInput[]
    id?: UuidFilter<"NotificationType"> | string
    name?: StringFilter<"NotificationType"> | string
    isLocked?: BoolFilter<"NotificationType"> | boolean
    notifications?: NotificationListRelationFilter
  }

  export type NotificationTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    isLocked?: SortOrder
    notifications?: NotificationOrderByRelationAggregateInput
  }

  export type NotificationTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: NotificationTypeWhereInput | NotificationTypeWhereInput[]
    OR?: NotificationTypeWhereInput[]
    NOT?: NotificationTypeWhereInput | NotificationTypeWhereInput[]
    isLocked?: BoolFilter<"NotificationType"> | boolean
    notifications?: NotificationListRelationFilter
  }, "id" | "name">

  export type NotificationTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    isLocked?: SortOrder
    _count?: NotificationTypeCountOrderByAggregateInput
    _max?: NotificationTypeMaxOrderByAggregateInput
    _min?: NotificationTypeMinOrderByAggregateInput
  }

  export type NotificationTypeScalarWhereWithAggregatesInput = {
    AND?: NotificationTypeScalarWhereWithAggregatesInput | NotificationTypeScalarWhereWithAggregatesInput[]
    OR?: NotificationTypeScalarWhereWithAggregatesInput[]
    NOT?: NotificationTypeScalarWhereWithAggregatesInput | NotificationTypeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"NotificationType"> | string
    name?: StringWithAggregatesFilter<"NotificationType"> | string
    isLocked?: BoolWithAggregatesFilter<"NotificationType"> | boolean
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: UuidFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    content?: StringFilter<"Notification"> | string
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    seen?: BoolFilter<"Notification"> | boolean
    notificationTypeId?: UuidFilter<"Notification"> | string
    notificationType?: XOR<NotificationTypeScalarRelationFilter, NotificationTypeWhereInput>
    userNotifications?: UserNotificationListRelationFilter
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    seen?: SortOrder
    notificationTypeId?: SortOrder
    notificationType?: NotificationTypeOrderByWithRelationInput
    userNotifications?: UserNotificationOrderByRelationAggregateInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    title?: StringFilter<"Notification"> | string
    content?: StringFilter<"Notification"> | string
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    seen?: BoolFilter<"Notification"> | boolean
    notificationTypeId?: UuidFilter<"Notification"> | string
    notificationType?: XOR<NotificationTypeScalarRelationFilter, NotificationTypeWhereInput>
    userNotifications?: UserNotificationListRelationFilter
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    seen?: SortOrder
    notificationTypeId?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    content?: StringWithAggregatesFilter<"Notification"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    seen?: BoolWithAggregatesFilter<"Notification"> | boolean
    notificationTypeId?: UuidWithAggregatesFilter<"Notification"> | string
  }

  export type InAppNotificationWhereInput = {
    AND?: InAppNotificationWhereInput | InAppNotificationWhereInput[]
    OR?: InAppNotificationWhereInput[]
    NOT?: InAppNotificationWhereInput | InAppNotificationWhereInput[]
    id?: UuidFilter<"InAppNotification"> | string
    userId?: UuidFilter<"InAppNotification"> | string
    title?: StringFilter<"InAppNotification"> | string
    content?: StringFilter<"InAppNotification"> | string
    type?: StringFilter<"InAppNotification"> | string
    isRead?: BoolFilter<"InAppNotification"> | boolean
    isArchived?: BoolFilter<"InAppNotification"> | boolean
    createdAt?: DateTimeFilter<"InAppNotification"> | Date | string
    readAt?: DateTimeNullableFilter<"InAppNotification"> | Date | string | null
    archivedAt?: DateTimeNullableFilter<"InAppNotification"> | Date | string | null
    contractId?: UuidNullableFilter<"InAppNotification"> | string | null
    courseId?: UuidNullableFilter<"InAppNotification"> | string | null
    metadata?: JsonNullableFilter<"InAppNotification">
  }

  export type InAppNotificationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    type?: SortOrder
    isRead?: SortOrder
    isArchived?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrderInput | SortOrder
    archivedAt?: SortOrderInput | SortOrder
    contractId?: SortOrderInput | SortOrder
    courseId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
  }

  export type InAppNotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InAppNotificationWhereInput | InAppNotificationWhereInput[]
    OR?: InAppNotificationWhereInput[]
    NOT?: InAppNotificationWhereInput | InAppNotificationWhereInput[]
    userId?: UuidFilter<"InAppNotification"> | string
    title?: StringFilter<"InAppNotification"> | string
    content?: StringFilter<"InAppNotification"> | string
    type?: StringFilter<"InAppNotification"> | string
    isRead?: BoolFilter<"InAppNotification"> | boolean
    isArchived?: BoolFilter<"InAppNotification"> | boolean
    createdAt?: DateTimeFilter<"InAppNotification"> | Date | string
    readAt?: DateTimeNullableFilter<"InAppNotification"> | Date | string | null
    archivedAt?: DateTimeNullableFilter<"InAppNotification"> | Date | string | null
    contractId?: UuidNullableFilter<"InAppNotification"> | string | null
    courseId?: UuidNullableFilter<"InAppNotification"> | string | null
    metadata?: JsonNullableFilter<"InAppNotification">
  }, "id">

  export type InAppNotificationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    type?: SortOrder
    isRead?: SortOrder
    isArchived?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrderInput | SortOrder
    archivedAt?: SortOrderInput | SortOrder
    contractId?: SortOrderInput | SortOrder
    courseId?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: InAppNotificationCountOrderByAggregateInput
    _max?: InAppNotificationMaxOrderByAggregateInput
    _min?: InAppNotificationMinOrderByAggregateInput
  }

  export type InAppNotificationScalarWhereWithAggregatesInput = {
    AND?: InAppNotificationScalarWhereWithAggregatesInput | InAppNotificationScalarWhereWithAggregatesInput[]
    OR?: InAppNotificationScalarWhereWithAggregatesInput[]
    NOT?: InAppNotificationScalarWhereWithAggregatesInput | InAppNotificationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"InAppNotification"> | string
    userId?: UuidWithAggregatesFilter<"InAppNotification"> | string
    title?: StringWithAggregatesFilter<"InAppNotification"> | string
    content?: StringWithAggregatesFilter<"InAppNotification"> | string
    type?: StringWithAggregatesFilter<"InAppNotification"> | string
    isRead?: BoolWithAggregatesFilter<"InAppNotification"> | boolean
    isArchived?: BoolWithAggregatesFilter<"InAppNotification"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"InAppNotification"> | Date | string
    readAt?: DateTimeNullableWithAggregatesFilter<"InAppNotification"> | Date | string | null
    archivedAt?: DateTimeNullableWithAggregatesFilter<"InAppNotification"> | Date | string | null
    contractId?: UuidNullableWithAggregatesFilter<"InAppNotification"> | string | null
    courseId?: UuidNullableWithAggregatesFilter<"InAppNotification"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"InAppNotification">
  }

  export type UserNotificationWhereInput = {
    AND?: UserNotificationWhereInput | UserNotificationWhereInput[]
    OR?: UserNotificationWhereInput[]
    NOT?: UserNotificationWhereInput | UserNotificationWhereInput[]
    notificationId?: UuidFilter<"UserNotification"> | string
    userId?: UuidFilter<"UserNotification"> | string
    notification?: XOR<NotificationScalarRelationFilter, NotificationWhereInput>
  }

  export type UserNotificationOrderByWithRelationInput = {
    notificationId?: SortOrder
    userId?: SortOrder
    notification?: NotificationOrderByWithRelationInput
  }

  export type UserNotificationWhereUniqueInput = Prisma.AtLeast<{
    notificationId_userId?: UserNotificationNotificationIdUserIdCompoundUniqueInput
    AND?: UserNotificationWhereInput | UserNotificationWhereInput[]
    OR?: UserNotificationWhereInput[]
    NOT?: UserNotificationWhereInput | UserNotificationWhereInput[]
    notificationId?: UuidFilter<"UserNotification"> | string
    userId?: UuidFilter<"UserNotification"> | string
    notification?: XOR<NotificationScalarRelationFilter, NotificationWhereInput>
  }, "notificationId_userId">

  export type UserNotificationOrderByWithAggregationInput = {
    notificationId?: SortOrder
    userId?: SortOrder
    _count?: UserNotificationCountOrderByAggregateInput
    _max?: UserNotificationMaxOrderByAggregateInput
    _min?: UserNotificationMinOrderByAggregateInput
  }

  export type UserNotificationScalarWhereWithAggregatesInput = {
    AND?: UserNotificationScalarWhereWithAggregatesInput | UserNotificationScalarWhereWithAggregatesInput[]
    OR?: UserNotificationScalarWhereWithAggregatesInput[]
    NOT?: UserNotificationScalarWhereWithAggregatesInput | UserNotificationScalarWhereWithAggregatesInput[]
    notificationId?: UuidWithAggregatesFilter<"UserNotification"> | string
    userId?: UuidWithAggregatesFilter<"UserNotification"> | string
  }

  export type NotificationTypeCreateInput = {
    id?: string
    name: string
    isLocked?: boolean
    notifications?: NotificationCreateNestedManyWithoutNotificationTypeInput
  }

  export type NotificationTypeUncheckedCreateInput = {
    id?: string
    name: string
    isLocked?: boolean
    notifications?: NotificationUncheckedCreateNestedManyWithoutNotificationTypeInput
  }

  export type NotificationTypeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    notifications?: NotificationUpdateManyWithoutNotificationTypeNestedInput
  }

  export type NotificationTypeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    notifications?: NotificationUncheckedUpdateManyWithoutNotificationTypeNestedInput
  }

  export type NotificationTypeCreateManyInput = {
    id?: string
    name: string
    isLocked?: boolean
  }

  export type NotificationTypeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationTypeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationCreateInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    seen?: boolean
    notificationType: NotificationTypeCreateNestedOneWithoutNotificationsInput
    userNotifications?: UserNotificationCreateNestedManyWithoutNotificationInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    seen?: boolean
    notificationTypeId: string
    userNotifications?: UserNotificationUncheckedCreateNestedManyWithoutNotificationInput
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seen?: BoolFieldUpdateOperationsInput | boolean
    notificationType?: NotificationTypeUpdateOneRequiredWithoutNotificationsNestedInput
    userNotifications?: UserNotificationUpdateManyWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seen?: BoolFieldUpdateOperationsInput | boolean
    notificationTypeId?: StringFieldUpdateOperationsInput | string
    userNotifications?: UserNotificationUncheckedUpdateManyWithoutNotificationNestedInput
  }

  export type NotificationCreateManyInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    seen?: boolean
    notificationTypeId: string
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seen?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seen?: BoolFieldUpdateOperationsInput | boolean
    notificationTypeId?: StringFieldUpdateOperationsInput | string
  }

  export type InAppNotificationCreateInput = {
    id?: string
    userId: string
    title: string
    content: string
    type: string
    isRead?: boolean
    isArchived?: boolean
    createdAt?: Date | string
    readAt?: Date | string | null
    archivedAt?: Date | string | null
    contractId?: string | null
    courseId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type InAppNotificationUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    content: string
    type: string
    isRead?: boolean
    isArchived?: boolean
    createdAt?: Date | string
    readAt?: Date | string | null
    archivedAt?: Date | string | null
    contractId?: string | null
    courseId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type InAppNotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contractId?: NullableStringFieldUpdateOperationsInput | string | null
    courseId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type InAppNotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contractId?: NullableStringFieldUpdateOperationsInput | string | null
    courseId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type InAppNotificationCreateManyInput = {
    id?: string
    userId: string
    title: string
    content: string
    type: string
    isRead?: boolean
    isArchived?: boolean
    createdAt?: Date | string
    readAt?: Date | string | null
    archivedAt?: Date | string | null
    contractId?: string | null
    courseId?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type InAppNotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contractId?: NullableStringFieldUpdateOperationsInput | string | null
    courseId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type InAppNotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isArchived?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    readAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    archivedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    contractId?: NullableStringFieldUpdateOperationsInput | string | null
    courseId?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserNotificationCreateInput = {
    userId: string
    notification: NotificationCreateNestedOneWithoutUserNotificationsInput
  }

  export type UserNotificationUncheckedCreateInput = {
    notificationId: string
    userId: string
  }

  export type UserNotificationUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    notification?: NotificationUpdateOneRequiredWithoutUserNotificationsNestedInput
  }

  export type UserNotificationUncheckedUpdateInput = {
    notificationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type UserNotificationCreateManyInput = {
    notificationId: string
    userId: string
  }

  export type UserNotificationUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type UserNotificationUncheckedUpdateManyInput = {
    notificationId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isLocked?: SortOrder
  }

  export type NotificationTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isLocked?: SortOrder
  }

  export type NotificationTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isLocked?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NotificationTypeScalarRelationFilter = {
    is?: NotificationTypeWhereInput
    isNot?: NotificationTypeWhereInput
  }

  export type UserNotificationListRelationFilter = {
    every?: UserNotificationWhereInput
    some?: UserNotificationWhereInput
    none?: UserNotificationWhereInput
  }

  export type UserNotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    seen?: SortOrder
    notificationTypeId?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    seen?: SortOrder
    notificationTypeId?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    seen?: SortOrder
    notificationTypeId?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type InAppNotificationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    type?: SortOrder
    isRead?: SortOrder
    isArchived?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrder
    archivedAt?: SortOrder
    contractId?: SortOrder
    courseId?: SortOrder
    metadata?: SortOrder
  }

  export type InAppNotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    type?: SortOrder
    isRead?: SortOrder
    isArchived?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrder
    archivedAt?: SortOrder
    contractId?: SortOrder
    courseId?: SortOrder
  }

  export type InAppNotificationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    type?: SortOrder
    isRead?: SortOrder
    isArchived?: SortOrder
    createdAt?: SortOrder
    readAt?: SortOrder
    archivedAt?: SortOrder
    contractId?: SortOrder
    courseId?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type NotificationScalarRelationFilter = {
    is?: NotificationWhereInput
    isNot?: NotificationWhereInput
  }

  export type UserNotificationNotificationIdUserIdCompoundUniqueInput = {
    notificationId: string
    userId: string
  }

  export type UserNotificationCountOrderByAggregateInput = {
    notificationId?: SortOrder
    userId?: SortOrder
  }

  export type UserNotificationMaxOrderByAggregateInput = {
    notificationId?: SortOrder
    userId?: SortOrder
  }

  export type UserNotificationMinOrderByAggregateInput = {
    notificationId?: SortOrder
    userId?: SortOrder
  }

  export type NotificationCreateNestedManyWithoutNotificationTypeInput = {
    create?: XOR<NotificationCreateWithoutNotificationTypeInput, NotificationUncheckedCreateWithoutNotificationTypeInput> | NotificationCreateWithoutNotificationTypeInput[] | NotificationUncheckedCreateWithoutNotificationTypeInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutNotificationTypeInput | NotificationCreateOrConnectWithoutNotificationTypeInput[]
    createMany?: NotificationCreateManyNotificationTypeInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutNotificationTypeInput = {
    create?: XOR<NotificationCreateWithoutNotificationTypeInput, NotificationUncheckedCreateWithoutNotificationTypeInput> | NotificationCreateWithoutNotificationTypeInput[] | NotificationUncheckedCreateWithoutNotificationTypeInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutNotificationTypeInput | NotificationCreateOrConnectWithoutNotificationTypeInput[]
    createMany?: NotificationCreateManyNotificationTypeInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NotificationUpdateManyWithoutNotificationTypeNestedInput = {
    create?: XOR<NotificationCreateWithoutNotificationTypeInput, NotificationUncheckedCreateWithoutNotificationTypeInput> | NotificationCreateWithoutNotificationTypeInput[] | NotificationUncheckedCreateWithoutNotificationTypeInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutNotificationTypeInput | NotificationCreateOrConnectWithoutNotificationTypeInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutNotificationTypeInput | NotificationUpsertWithWhereUniqueWithoutNotificationTypeInput[]
    createMany?: NotificationCreateManyNotificationTypeInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutNotificationTypeInput | NotificationUpdateWithWhereUniqueWithoutNotificationTypeInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutNotificationTypeInput | NotificationUpdateManyWithWhereWithoutNotificationTypeInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutNotificationTypeNestedInput = {
    create?: XOR<NotificationCreateWithoutNotificationTypeInput, NotificationUncheckedCreateWithoutNotificationTypeInput> | NotificationCreateWithoutNotificationTypeInput[] | NotificationUncheckedCreateWithoutNotificationTypeInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutNotificationTypeInput | NotificationCreateOrConnectWithoutNotificationTypeInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutNotificationTypeInput | NotificationUpsertWithWhereUniqueWithoutNotificationTypeInput[]
    createMany?: NotificationCreateManyNotificationTypeInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutNotificationTypeInput | NotificationUpdateWithWhereUniqueWithoutNotificationTypeInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutNotificationTypeInput | NotificationUpdateManyWithWhereWithoutNotificationTypeInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type NotificationTypeCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<NotificationTypeCreateWithoutNotificationsInput, NotificationTypeUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: NotificationTypeCreateOrConnectWithoutNotificationsInput
    connect?: NotificationTypeWhereUniqueInput
  }

  export type UserNotificationCreateNestedManyWithoutNotificationInput = {
    create?: XOR<UserNotificationCreateWithoutNotificationInput, UserNotificationUncheckedCreateWithoutNotificationInput> | UserNotificationCreateWithoutNotificationInput[] | UserNotificationUncheckedCreateWithoutNotificationInput[]
    connectOrCreate?: UserNotificationCreateOrConnectWithoutNotificationInput | UserNotificationCreateOrConnectWithoutNotificationInput[]
    createMany?: UserNotificationCreateManyNotificationInputEnvelope
    connect?: UserNotificationWhereUniqueInput | UserNotificationWhereUniqueInput[]
  }

  export type UserNotificationUncheckedCreateNestedManyWithoutNotificationInput = {
    create?: XOR<UserNotificationCreateWithoutNotificationInput, UserNotificationUncheckedCreateWithoutNotificationInput> | UserNotificationCreateWithoutNotificationInput[] | UserNotificationUncheckedCreateWithoutNotificationInput[]
    connectOrCreate?: UserNotificationCreateOrConnectWithoutNotificationInput | UserNotificationCreateOrConnectWithoutNotificationInput[]
    createMany?: UserNotificationCreateManyNotificationInputEnvelope
    connect?: UserNotificationWhereUniqueInput | UserNotificationWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NotificationTypeUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<NotificationTypeCreateWithoutNotificationsInput, NotificationTypeUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: NotificationTypeCreateOrConnectWithoutNotificationsInput
    upsert?: NotificationTypeUpsertWithoutNotificationsInput
    connect?: NotificationTypeWhereUniqueInput
    update?: XOR<XOR<NotificationTypeUpdateToOneWithWhereWithoutNotificationsInput, NotificationTypeUpdateWithoutNotificationsInput>, NotificationTypeUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserNotificationUpdateManyWithoutNotificationNestedInput = {
    create?: XOR<UserNotificationCreateWithoutNotificationInput, UserNotificationUncheckedCreateWithoutNotificationInput> | UserNotificationCreateWithoutNotificationInput[] | UserNotificationUncheckedCreateWithoutNotificationInput[]
    connectOrCreate?: UserNotificationCreateOrConnectWithoutNotificationInput | UserNotificationCreateOrConnectWithoutNotificationInput[]
    upsert?: UserNotificationUpsertWithWhereUniqueWithoutNotificationInput | UserNotificationUpsertWithWhereUniqueWithoutNotificationInput[]
    createMany?: UserNotificationCreateManyNotificationInputEnvelope
    set?: UserNotificationWhereUniqueInput | UserNotificationWhereUniqueInput[]
    disconnect?: UserNotificationWhereUniqueInput | UserNotificationWhereUniqueInput[]
    delete?: UserNotificationWhereUniqueInput | UserNotificationWhereUniqueInput[]
    connect?: UserNotificationWhereUniqueInput | UserNotificationWhereUniqueInput[]
    update?: UserNotificationUpdateWithWhereUniqueWithoutNotificationInput | UserNotificationUpdateWithWhereUniqueWithoutNotificationInput[]
    updateMany?: UserNotificationUpdateManyWithWhereWithoutNotificationInput | UserNotificationUpdateManyWithWhereWithoutNotificationInput[]
    deleteMany?: UserNotificationScalarWhereInput | UserNotificationScalarWhereInput[]
  }

  export type UserNotificationUncheckedUpdateManyWithoutNotificationNestedInput = {
    create?: XOR<UserNotificationCreateWithoutNotificationInput, UserNotificationUncheckedCreateWithoutNotificationInput> | UserNotificationCreateWithoutNotificationInput[] | UserNotificationUncheckedCreateWithoutNotificationInput[]
    connectOrCreate?: UserNotificationCreateOrConnectWithoutNotificationInput | UserNotificationCreateOrConnectWithoutNotificationInput[]
    upsert?: UserNotificationUpsertWithWhereUniqueWithoutNotificationInput | UserNotificationUpsertWithWhereUniqueWithoutNotificationInput[]
    createMany?: UserNotificationCreateManyNotificationInputEnvelope
    set?: UserNotificationWhereUniqueInput | UserNotificationWhereUniqueInput[]
    disconnect?: UserNotificationWhereUniqueInput | UserNotificationWhereUniqueInput[]
    delete?: UserNotificationWhereUniqueInput | UserNotificationWhereUniqueInput[]
    connect?: UserNotificationWhereUniqueInput | UserNotificationWhereUniqueInput[]
    update?: UserNotificationUpdateWithWhereUniqueWithoutNotificationInput | UserNotificationUpdateWithWhereUniqueWithoutNotificationInput[]
    updateMany?: UserNotificationUpdateManyWithWhereWithoutNotificationInput | UserNotificationUpdateManyWithWhereWithoutNotificationInput[]
    deleteMany?: UserNotificationScalarWhereInput | UserNotificationScalarWhereInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NotificationCreateNestedOneWithoutUserNotificationsInput = {
    create?: XOR<NotificationCreateWithoutUserNotificationsInput, NotificationUncheckedCreateWithoutUserNotificationsInput>
    connectOrCreate?: NotificationCreateOrConnectWithoutUserNotificationsInput
    connect?: NotificationWhereUniqueInput
  }

  export type NotificationUpdateOneRequiredWithoutUserNotificationsNestedInput = {
    create?: XOR<NotificationCreateWithoutUserNotificationsInput, NotificationUncheckedCreateWithoutUserNotificationsInput>
    connectOrCreate?: NotificationCreateOrConnectWithoutUserNotificationsInput
    upsert?: NotificationUpsertWithoutUserNotificationsInput
    connect?: NotificationWhereUniqueInput
    update?: XOR<XOR<NotificationUpdateToOneWithWhereWithoutUserNotificationsInput, NotificationUpdateWithoutUserNotificationsInput>, NotificationUncheckedUpdateWithoutUserNotificationsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NotificationCreateWithoutNotificationTypeInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    seen?: boolean
    userNotifications?: UserNotificationCreateNestedManyWithoutNotificationInput
  }

  export type NotificationUncheckedCreateWithoutNotificationTypeInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    seen?: boolean
    userNotifications?: UserNotificationUncheckedCreateNestedManyWithoutNotificationInput
  }

  export type NotificationCreateOrConnectWithoutNotificationTypeInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutNotificationTypeInput, NotificationUncheckedCreateWithoutNotificationTypeInput>
  }

  export type NotificationCreateManyNotificationTypeInputEnvelope = {
    data: NotificationCreateManyNotificationTypeInput | NotificationCreateManyNotificationTypeInput[]
    skipDuplicates?: boolean
  }

  export type NotificationUpsertWithWhereUniqueWithoutNotificationTypeInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutNotificationTypeInput, NotificationUncheckedUpdateWithoutNotificationTypeInput>
    create: XOR<NotificationCreateWithoutNotificationTypeInput, NotificationUncheckedCreateWithoutNotificationTypeInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutNotificationTypeInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutNotificationTypeInput, NotificationUncheckedUpdateWithoutNotificationTypeInput>
  }

  export type NotificationUpdateManyWithWhereWithoutNotificationTypeInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutNotificationTypeInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: UuidFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    content?: StringFilter<"Notification"> | string
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    seen?: BoolFilter<"Notification"> | boolean
    notificationTypeId?: UuidFilter<"Notification"> | string
  }

  export type NotificationTypeCreateWithoutNotificationsInput = {
    id?: string
    name: string
    isLocked?: boolean
  }

  export type NotificationTypeUncheckedCreateWithoutNotificationsInput = {
    id?: string
    name: string
    isLocked?: boolean
  }

  export type NotificationTypeCreateOrConnectWithoutNotificationsInput = {
    where: NotificationTypeWhereUniqueInput
    create: XOR<NotificationTypeCreateWithoutNotificationsInput, NotificationTypeUncheckedCreateWithoutNotificationsInput>
  }

  export type UserNotificationCreateWithoutNotificationInput = {
    userId: string
  }

  export type UserNotificationUncheckedCreateWithoutNotificationInput = {
    userId: string
  }

  export type UserNotificationCreateOrConnectWithoutNotificationInput = {
    where: UserNotificationWhereUniqueInput
    create: XOR<UserNotificationCreateWithoutNotificationInput, UserNotificationUncheckedCreateWithoutNotificationInput>
  }

  export type UserNotificationCreateManyNotificationInputEnvelope = {
    data: UserNotificationCreateManyNotificationInput | UserNotificationCreateManyNotificationInput[]
    skipDuplicates?: boolean
  }

  export type NotificationTypeUpsertWithoutNotificationsInput = {
    update: XOR<NotificationTypeUpdateWithoutNotificationsInput, NotificationTypeUncheckedUpdateWithoutNotificationsInput>
    create: XOR<NotificationTypeCreateWithoutNotificationsInput, NotificationTypeUncheckedCreateWithoutNotificationsInput>
    where?: NotificationTypeWhereInput
  }

  export type NotificationTypeUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: NotificationTypeWhereInput
    data: XOR<NotificationTypeUpdateWithoutNotificationsInput, NotificationTypeUncheckedUpdateWithoutNotificationsInput>
  }

  export type NotificationTypeUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationTypeUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserNotificationUpsertWithWhereUniqueWithoutNotificationInput = {
    where: UserNotificationWhereUniqueInput
    update: XOR<UserNotificationUpdateWithoutNotificationInput, UserNotificationUncheckedUpdateWithoutNotificationInput>
    create: XOR<UserNotificationCreateWithoutNotificationInput, UserNotificationUncheckedCreateWithoutNotificationInput>
  }

  export type UserNotificationUpdateWithWhereUniqueWithoutNotificationInput = {
    where: UserNotificationWhereUniqueInput
    data: XOR<UserNotificationUpdateWithoutNotificationInput, UserNotificationUncheckedUpdateWithoutNotificationInput>
  }

  export type UserNotificationUpdateManyWithWhereWithoutNotificationInput = {
    where: UserNotificationScalarWhereInput
    data: XOR<UserNotificationUpdateManyMutationInput, UserNotificationUncheckedUpdateManyWithoutNotificationInput>
  }

  export type UserNotificationScalarWhereInput = {
    AND?: UserNotificationScalarWhereInput | UserNotificationScalarWhereInput[]
    OR?: UserNotificationScalarWhereInput[]
    NOT?: UserNotificationScalarWhereInput | UserNotificationScalarWhereInput[]
    notificationId?: UuidFilter<"UserNotification"> | string
    userId?: UuidFilter<"UserNotification"> | string
  }

  export type NotificationCreateWithoutUserNotificationsInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    seen?: boolean
    notificationType: NotificationTypeCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateWithoutUserNotificationsInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    seen?: boolean
    notificationTypeId: string
  }

  export type NotificationCreateOrConnectWithoutUserNotificationsInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserNotificationsInput, NotificationUncheckedCreateWithoutUserNotificationsInput>
  }

  export type NotificationUpsertWithoutUserNotificationsInput = {
    update: XOR<NotificationUpdateWithoutUserNotificationsInput, NotificationUncheckedUpdateWithoutUserNotificationsInput>
    create: XOR<NotificationCreateWithoutUserNotificationsInput, NotificationUncheckedCreateWithoutUserNotificationsInput>
    where?: NotificationWhereInput
  }

  export type NotificationUpdateToOneWithWhereWithoutUserNotificationsInput = {
    where?: NotificationWhereInput
    data: XOR<NotificationUpdateWithoutUserNotificationsInput, NotificationUncheckedUpdateWithoutUserNotificationsInput>
  }

  export type NotificationUpdateWithoutUserNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seen?: BoolFieldUpdateOperationsInput | boolean
    notificationType?: NotificationTypeUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateWithoutUserNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seen?: BoolFieldUpdateOperationsInput | boolean
    notificationTypeId?: StringFieldUpdateOperationsInput | string
  }

  export type NotificationCreateManyNotificationTypeInput = {
    id?: string
    title: string
    content: string
    createdAt?: Date | string
    seen?: boolean
  }

  export type NotificationUpdateWithoutNotificationTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seen?: BoolFieldUpdateOperationsInput | boolean
    userNotifications?: UserNotificationUpdateManyWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateWithoutNotificationTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seen?: BoolFieldUpdateOperationsInput | boolean
    userNotifications?: UserNotificationUncheckedUpdateManyWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateManyWithoutNotificationTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    seen?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserNotificationCreateManyNotificationInput = {
    userId: string
  }

  export type UserNotificationUpdateWithoutNotificationInput = {
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type UserNotificationUncheckedUpdateWithoutNotificationInput = {
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type UserNotificationUncheckedUpdateManyWithoutNotificationInput = {
    userId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}