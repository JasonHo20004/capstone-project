
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
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model RefreshToken
 * 
 */
export type RefreshToken = $Result.DefaultSelection<Prisma.$RefreshTokenPayload>
/**
 * Model CourseSellerProfile
 * 
 */
export type CourseSellerProfile = $Result.DefaultSelection<Prisma.$CourseSellerProfilePayload>
/**
 * Model AdministratorProfile
 * 
 */
export type AdministratorProfile = $Result.DefaultSelection<Prisma.$AdministratorProfilePayload>
/**
 * Model CourseSellerApplication
 * 
 */
export type CourseSellerApplication = $Result.DefaultSelection<Prisma.$CourseSellerApplicationPayload>
/**
 * Model Policy
 * 
 */
export type Policy = $Result.DefaultSelection<Prisma.$PolicyPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserRole: {
  ADMINISTRATOR: 'ADMINISTRATOR',
  COURSESELLER: 'COURSESELLER'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const ApplicationStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus]

}

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type ApplicationStatus = $Enums.ApplicationStatus

export const ApplicationStatus: typeof $Enums.ApplicationStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
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
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
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
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.refreshToken`: Exposes CRUD operations for the **RefreshToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RefreshTokens
    * const refreshTokens = await prisma.refreshToken.findMany()
    * ```
    */
  get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.courseSellerProfile`: Exposes CRUD operations for the **CourseSellerProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CourseSellerProfiles
    * const courseSellerProfiles = await prisma.courseSellerProfile.findMany()
    * ```
    */
  get courseSellerProfile(): Prisma.CourseSellerProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.administratorProfile`: Exposes CRUD operations for the **AdministratorProfile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdministratorProfiles
    * const administratorProfiles = await prisma.administratorProfile.findMany()
    * ```
    */
  get administratorProfile(): Prisma.AdministratorProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.courseSellerApplication`: Exposes CRUD operations for the **CourseSellerApplication** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CourseSellerApplications
    * const courseSellerApplications = await prisma.courseSellerApplication.findMany()
    * ```
    */
  get courseSellerApplication(): Prisma.CourseSellerApplicationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.policy`: Exposes CRUD operations for the **Policy** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Policies
    * const policies = await prisma.policy.findMany()
    * ```
    */
  get policy(): Prisma.PolicyDelegate<ExtArgs, ClientOptions>;
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
    User: 'User',
    RefreshToken: 'RefreshToken',
    CourseSellerProfile: 'CourseSellerProfile',
    AdministratorProfile: 'AdministratorProfile',
    CourseSellerApplication: 'CourseSellerApplication',
    Policy: 'Policy'
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
      modelProps: "user" | "refreshToken" | "courseSellerProfile" | "administratorProfile" | "courseSellerApplication" | "policy"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      RefreshToken: {
        payload: Prisma.$RefreshTokenPayload<ExtArgs>
        fields: Prisma.RefreshTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findFirst: {
            args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findMany: {
            args: Prisma.RefreshTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          create: {
            args: Prisma.RefreshTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          createMany: {
            args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          delete: {
            args: Prisma.RefreshTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          update: {
            args: Prisma.RefreshTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          deleteMany: {
            args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RefreshTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          upsert: {
            args: Prisma.RefreshTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          aggregate: {
            args: Prisma.RefreshTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefreshToken>
          }
          groupBy: {
            args: Prisma.RefreshTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.RefreshTokenCountArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenCountAggregateOutputType> | number
          }
        }
      }
      CourseSellerProfile: {
        payload: Prisma.$CourseSellerProfilePayload<ExtArgs>
        fields: Prisma.CourseSellerProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CourseSellerProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CourseSellerProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerProfilePayload>
          }
          findFirst: {
            args: Prisma.CourseSellerProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CourseSellerProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerProfilePayload>
          }
          findMany: {
            args: Prisma.CourseSellerProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerProfilePayload>[]
          }
          create: {
            args: Prisma.CourseSellerProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerProfilePayload>
          }
          createMany: {
            args: Prisma.CourseSellerProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CourseSellerProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerProfilePayload>[]
          }
          delete: {
            args: Prisma.CourseSellerProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerProfilePayload>
          }
          update: {
            args: Prisma.CourseSellerProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerProfilePayload>
          }
          deleteMany: {
            args: Prisma.CourseSellerProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CourseSellerProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CourseSellerProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerProfilePayload>[]
          }
          upsert: {
            args: Prisma.CourseSellerProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerProfilePayload>
          }
          aggregate: {
            args: Prisma.CourseSellerProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCourseSellerProfile>
          }
          groupBy: {
            args: Prisma.CourseSellerProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<CourseSellerProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.CourseSellerProfileCountArgs<ExtArgs>
            result: $Utils.Optional<CourseSellerProfileCountAggregateOutputType> | number
          }
        }
      }
      AdministratorProfile: {
        payload: Prisma.$AdministratorProfilePayload<ExtArgs>
        fields: Prisma.AdministratorProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdministratorProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministratorProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdministratorProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministratorProfilePayload>
          }
          findFirst: {
            args: Prisma.AdministratorProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministratorProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdministratorProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministratorProfilePayload>
          }
          findMany: {
            args: Prisma.AdministratorProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministratorProfilePayload>[]
          }
          create: {
            args: Prisma.AdministratorProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministratorProfilePayload>
          }
          createMany: {
            args: Prisma.AdministratorProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdministratorProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministratorProfilePayload>[]
          }
          delete: {
            args: Prisma.AdministratorProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministratorProfilePayload>
          }
          update: {
            args: Prisma.AdministratorProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministratorProfilePayload>
          }
          deleteMany: {
            args: Prisma.AdministratorProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdministratorProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdministratorProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministratorProfilePayload>[]
          }
          upsert: {
            args: Prisma.AdministratorProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdministratorProfilePayload>
          }
          aggregate: {
            args: Prisma.AdministratorProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdministratorProfile>
          }
          groupBy: {
            args: Prisma.AdministratorProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdministratorProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdministratorProfileCountArgs<ExtArgs>
            result: $Utils.Optional<AdministratorProfileCountAggregateOutputType> | number
          }
        }
      }
      CourseSellerApplication: {
        payload: Prisma.$CourseSellerApplicationPayload<ExtArgs>
        fields: Prisma.CourseSellerApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CourseSellerApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CourseSellerApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerApplicationPayload>
          }
          findFirst: {
            args: Prisma.CourseSellerApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CourseSellerApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerApplicationPayload>
          }
          findMany: {
            args: Prisma.CourseSellerApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerApplicationPayload>[]
          }
          create: {
            args: Prisma.CourseSellerApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerApplicationPayload>
          }
          createMany: {
            args: Prisma.CourseSellerApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CourseSellerApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerApplicationPayload>[]
          }
          delete: {
            args: Prisma.CourseSellerApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerApplicationPayload>
          }
          update: {
            args: Prisma.CourseSellerApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerApplicationPayload>
          }
          deleteMany: {
            args: Prisma.CourseSellerApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CourseSellerApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CourseSellerApplicationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerApplicationPayload>[]
          }
          upsert: {
            args: Prisma.CourseSellerApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseSellerApplicationPayload>
          }
          aggregate: {
            args: Prisma.CourseSellerApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCourseSellerApplication>
          }
          groupBy: {
            args: Prisma.CourseSellerApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<CourseSellerApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.CourseSellerApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<CourseSellerApplicationCountAggregateOutputType> | number
          }
        }
      }
      Policy: {
        payload: Prisma.$PolicyPayload<ExtArgs>
        fields: Prisma.PolicyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PolicyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PolicyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>
          }
          findFirst: {
            args: Prisma.PolicyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PolicyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>
          }
          findMany: {
            args: Prisma.PolicyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>[]
          }
          create: {
            args: Prisma.PolicyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>
          }
          createMany: {
            args: Prisma.PolicyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PolicyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>[]
          }
          delete: {
            args: Prisma.PolicyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>
          }
          update: {
            args: Prisma.PolicyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>
          }
          deleteMany: {
            args: Prisma.PolicyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PolicyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PolicyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>[]
          }
          upsert: {
            args: Prisma.PolicyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PolicyPayload>
          }
          aggregate: {
            args: Prisma.PolicyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePolicy>
          }
          groupBy: {
            args: Prisma.PolicyGroupByArgs<ExtArgs>
            result: $Utils.Optional<PolicyGroupByOutputType>[]
          }
          count: {
            args: Prisma.PolicyCountArgs<ExtArgs>
            result: $Utils.Optional<PolicyCountAggregateOutputType> | number
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
    user?: UserOmit
    refreshToken?: RefreshTokenOmit
    courseSellerProfile?: CourseSellerProfileOmit
    administratorProfile?: AdministratorProfileOmit
    courseSellerApplication?: CourseSellerApplicationOmit
    policy?: PolicyOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    refreshTokens: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    refreshTokens?: boolean | UserCountOutputTypeCountRefreshTokensArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRefreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    fullName: string | null
    phoneNumber: string | null
    profilePicture: string | null
    dateOfBirth: Date | null
    createdAt: Date | null
    englishLevel: string | null
    role: $Enums.UserRole | null
    isEmailVerified: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password: string | null
    fullName: string | null
    phoneNumber: string | null
    profilePicture: string | null
    dateOfBirth: Date | null
    createdAt: Date | null
    englishLevel: string | null
    role: $Enums.UserRole | null
    isEmailVerified: boolean | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    fullName: number
    phoneNumber: number
    profilePicture: number
    dateOfBirth: number
    createdAt: number
    englishLevel: number
    learningGoals: number
    role: number
    isEmailVerified: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    fullName?: true
    phoneNumber?: true
    profilePicture?: true
    dateOfBirth?: true
    createdAt?: true
    englishLevel?: true
    role?: true
    isEmailVerified?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    fullName?: true
    phoneNumber?: true
    profilePicture?: true
    dateOfBirth?: true
    createdAt?: true
    englishLevel?: true
    role?: true
    isEmailVerified?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    fullName?: true
    phoneNumber?: true
    profilePicture?: true
    dateOfBirth?: true
    createdAt?: true
    englishLevel?: true
    learningGoals?: true
    role?: true
    isEmailVerified?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password: string
    fullName: string
    phoneNumber: string | null
    profilePicture: string | null
    dateOfBirth: Date
    createdAt: Date
    englishLevel: string | null
    learningGoals: string[]
    role: $Enums.UserRole | null
    isEmailVerified: boolean
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    fullName?: boolean
    phoneNumber?: boolean
    profilePicture?: boolean
    dateOfBirth?: boolean
    createdAt?: boolean
    englishLevel?: boolean
    learningGoals?: boolean
    role?: boolean
    isEmailVerified?: boolean
    administratorProfile?: boolean | User$administratorProfileArgs<ExtArgs>
    courseSellerApplication?: boolean | User$courseSellerApplicationArgs<ExtArgs>
    courseSellerProfile?: boolean | User$courseSellerProfileArgs<ExtArgs>
    policy?: boolean | User$policyArgs<ExtArgs>
    refreshTokens?: boolean | User$refreshTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    fullName?: boolean
    phoneNumber?: boolean
    profilePicture?: boolean
    dateOfBirth?: boolean
    createdAt?: boolean
    englishLevel?: boolean
    learningGoals?: boolean
    role?: boolean
    isEmailVerified?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    fullName?: boolean
    phoneNumber?: boolean
    profilePicture?: boolean
    dateOfBirth?: boolean
    createdAt?: boolean
    englishLevel?: boolean
    learningGoals?: boolean
    role?: boolean
    isEmailVerified?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    fullName?: boolean
    phoneNumber?: boolean
    profilePicture?: boolean
    dateOfBirth?: boolean
    createdAt?: boolean
    englishLevel?: boolean
    learningGoals?: boolean
    role?: boolean
    isEmailVerified?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "fullName" | "phoneNumber" | "profilePicture" | "dateOfBirth" | "createdAt" | "englishLevel" | "learningGoals" | "role" | "isEmailVerified", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    administratorProfile?: boolean | User$administratorProfileArgs<ExtArgs>
    courseSellerApplication?: boolean | User$courseSellerApplicationArgs<ExtArgs>
    courseSellerProfile?: boolean | User$courseSellerProfileArgs<ExtArgs>
    policy?: boolean | User$policyArgs<ExtArgs>
    refreshTokens?: boolean | User$refreshTokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      administratorProfile: Prisma.$AdministratorProfilePayload<ExtArgs> | null
      courseSellerApplication: Prisma.$CourseSellerApplicationPayload<ExtArgs> | null
      courseSellerProfile: Prisma.$CourseSellerProfilePayload<ExtArgs> | null
      policy: Prisma.$PolicyPayload<ExtArgs> | null
      refreshTokens: Prisma.$RefreshTokenPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password: string
      fullName: string
      phoneNumber: string | null
      profilePicture: string | null
      dateOfBirth: Date
      createdAt: Date
      englishLevel: string | null
      learningGoals: string[]
      role: $Enums.UserRole | null
      isEmailVerified: boolean
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    administratorProfile<T extends User$administratorProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$administratorProfileArgs<ExtArgs>>): Prisma__AdministratorProfileClient<$Result.GetResult<Prisma.$AdministratorProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    courseSellerApplication<T extends User$courseSellerApplicationArgs<ExtArgs> = {}>(args?: Subset<T, User$courseSellerApplicationArgs<ExtArgs>>): Prisma__CourseSellerApplicationClient<$Result.GetResult<Prisma.$CourseSellerApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    courseSellerProfile<T extends User$courseSellerProfileArgs<ExtArgs> = {}>(args?: Subset<T, User$courseSellerProfileArgs<ExtArgs>>): Prisma__CourseSellerProfileClient<$Result.GetResult<Prisma.$CourseSellerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    policy<T extends User$policyArgs<ExtArgs> = {}>(args?: Subset<T, User$policyArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    refreshTokens<T extends User$refreshTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$refreshTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly phoneNumber: FieldRef<"User", 'String'>
    readonly profilePicture: FieldRef<"User", 'String'>
    readonly dateOfBirth: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly englishLevel: FieldRef<"User", 'String'>
    readonly learningGoals: FieldRef<"User", 'String[]'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly isEmailVerified: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.administratorProfile
   */
  export type User$administratorProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileInclude<ExtArgs> | null
    where?: AdministratorProfileWhereInput
  }

  /**
   * User.courseSellerApplication
   */
  export type User$courseSellerApplicationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationInclude<ExtArgs> | null
    where?: CourseSellerApplicationWhereInput
  }

  /**
   * User.courseSellerProfile
   */
  export type User$courseSellerProfileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileInclude<ExtArgs> | null
    where?: CourseSellerProfileWhereInput
  }

  /**
   * User.policy
   */
  export type User$policyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    where?: PolicyWhereInput
  }

  /**
   * User.refreshTokens
   */
  export type User$refreshTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    cursor?: RefreshTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model RefreshToken
   */

  export type AggregateRefreshToken = {
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  export type RefreshTokenMinAggregateOutputType = {
    id: string | null
    hashedToken: string | null
    userId: string | null
    revoked: boolean | null
    createdAt: Date | null
  }

  export type RefreshTokenMaxAggregateOutputType = {
    id: string | null
    hashedToken: string | null
    userId: string | null
    revoked: boolean | null
    createdAt: Date | null
  }

  export type RefreshTokenCountAggregateOutputType = {
    id: number
    hashedToken: number
    userId: number
    revoked: number
    createdAt: number
    _all: number
  }


  export type RefreshTokenMinAggregateInputType = {
    id?: true
    hashedToken?: true
    userId?: true
    revoked?: true
    createdAt?: true
  }

  export type RefreshTokenMaxAggregateInputType = {
    id?: true
    hashedToken?: true
    userId?: true
    revoked?: true
    createdAt?: true
  }

  export type RefreshTokenCountAggregateInputType = {
    id?: true
    hashedToken?: true
    userId?: true
    revoked?: true
    createdAt?: true
    _all?: true
  }

  export type RefreshTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshToken to aggregate.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RefreshTokens
    **/
    _count?: true | RefreshTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RefreshTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type GetRefreshTokenAggregateType<T extends RefreshTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateRefreshToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefreshToken[P]>
      : GetScalarType<T[P], AggregateRefreshToken[P]>
  }




  export type RefreshTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithAggregationInput | RefreshTokenOrderByWithAggregationInput[]
    by: RefreshTokenScalarFieldEnum[] | RefreshTokenScalarFieldEnum
    having?: RefreshTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RefreshTokenCountAggregateInputType | true
    _min?: RefreshTokenMinAggregateInputType
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type RefreshTokenGroupByOutputType = {
    id: string
    hashedToken: string
    userId: string
    revoked: boolean
    createdAt: Date
    _count: RefreshTokenCountAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  type GetRefreshTokenGroupByPayload<T extends RefreshTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RefreshTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RefreshTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
            : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
        }
      >
    >


  export type RefreshTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hashedToken?: boolean
    userId?: boolean
    revoked?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hashedToken?: boolean
    userId?: boolean
    revoked?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hashedToken?: boolean
    userId?: boolean
    revoked?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectScalar = {
    id?: boolean
    hashedToken?: boolean
    userId?: boolean
    revoked?: boolean
    createdAt?: boolean
  }

  export type RefreshTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "hashedToken" | "userId" | "revoked" | "createdAt", ExtArgs["result"]["refreshToken"]>
  export type RefreshTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type RefreshTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $RefreshTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RefreshToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      hashedToken: string
      userId: string
      revoked: boolean
      createdAt: Date
    }, ExtArgs["result"]["refreshToken"]>
    composites: {}
  }

  type RefreshTokenGetPayload<S extends boolean | null | undefined | RefreshTokenDefaultArgs> = $Result.GetResult<Prisma.$RefreshTokenPayload, S>

  type RefreshTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RefreshTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RefreshTokenCountAggregateInputType | true
    }

  export interface RefreshTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RefreshToken'], meta: { name: 'RefreshToken' } }
    /**
     * Find zero or one RefreshToken that matches the filter.
     * @param {RefreshTokenFindUniqueArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RefreshTokenFindUniqueArgs>(args: SelectSubset<T, RefreshTokenFindUniqueArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RefreshToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RefreshTokenFindUniqueOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RefreshTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, RefreshTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RefreshTokenFindFirstArgs>(args?: SelectSubset<T, RefreshTokenFindFirstArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RefreshToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RefreshTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, RefreshTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany()
     * 
     * // Get first 10 RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RefreshTokenFindManyArgs>(args?: SelectSubset<T, RefreshTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RefreshToken.
     * @param {RefreshTokenCreateArgs} args - Arguments to create a RefreshToken.
     * @example
     * // Create one RefreshToken
     * const RefreshToken = await prisma.refreshToken.create({
     *   data: {
     *     // ... data to create a RefreshToken
     *   }
     * })
     * 
     */
    create<T extends RefreshTokenCreateArgs>(args: SelectSubset<T, RefreshTokenCreateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RefreshTokens.
     * @param {RefreshTokenCreateManyArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RefreshTokenCreateManyArgs>(args?: SelectSubset<T, RefreshTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RefreshTokens and returns the data saved in the database.
     * @param {RefreshTokenCreateManyAndReturnArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RefreshTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, RefreshTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RefreshToken.
     * @param {RefreshTokenDeleteArgs} args - Arguments to delete one RefreshToken.
     * @example
     * // Delete one RefreshToken
     * const RefreshToken = await prisma.refreshToken.delete({
     *   where: {
     *     // ... filter to delete one RefreshToken
     *   }
     * })
     * 
     */
    delete<T extends RefreshTokenDeleteArgs>(args: SelectSubset<T, RefreshTokenDeleteArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RefreshToken.
     * @param {RefreshTokenUpdateArgs} args - Arguments to update one RefreshToken.
     * @example
     * // Update one RefreshToken
     * const refreshToken = await prisma.refreshToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RefreshTokenUpdateArgs>(args: SelectSubset<T, RefreshTokenUpdateArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RefreshTokens.
     * @param {RefreshTokenDeleteManyArgs} args - Arguments to filter RefreshTokens to delete.
     * @example
     * // Delete a few RefreshTokens
     * const { count } = await prisma.refreshToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RefreshTokenDeleteManyArgs>(args?: SelectSubset<T, RefreshTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RefreshTokenUpdateManyArgs>(args: SelectSubset<T, RefreshTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens and returns the data updated in the database.
     * @param {RefreshTokenUpdateManyAndReturnArgs} args - Arguments to update many RefreshTokens.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.updateManyAndReturn({
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
    updateManyAndReturn<T extends RefreshTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, RefreshTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RefreshToken.
     * @param {RefreshTokenUpsertArgs} args - Arguments to update or create a RefreshToken.
     * @example
     * // Update or create a RefreshToken
     * const refreshToken = await prisma.refreshToken.upsert({
     *   create: {
     *     // ... data to create a RefreshToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RefreshToken we want to update
     *   }
     * })
     */
    upsert<T extends RefreshTokenUpsertArgs>(args: SelectSubset<T, RefreshTokenUpsertArgs<ExtArgs>>): Prisma__RefreshTokenClient<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenCountArgs} args - Arguments to filter RefreshTokens to count.
     * @example
     * // Count the number of RefreshTokens
     * const count = await prisma.refreshToken.count({
     *   where: {
     *     // ... the filter for the RefreshTokens we want to count
     *   }
     * })
    **/
    count<T extends RefreshTokenCountArgs>(
      args?: Subset<T, RefreshTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RefreshTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RefreshTokenAggregateArgs>(args: Subset<T, RefreshTokenAggregateArgs>): Prisma.PrismaPromise<GetRefreshTokenAggregateType<T>>

    /**
     * Group by RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenGroupByArgs} args - Group by arguments.
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
      T extends RefreshTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RefreshTokenGroupByArgs['orderBy'] }
        : { orderBy?: RefreshTokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RefreshTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRefreshTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RefreshToken model
   */
  readonly fields: RefreshTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RefreshToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RefreshTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the RefreshToken model
   */
  interface RefreshTokenFieldRefs {
    readonly id: FieldRef<"RefreshToken", 'String'>
    readonly hashedToken: FieldRef<"RefreshToken", 'String'>
    readonly userId: FieldRef<"RefreshToken", 'String'>
    readonly revoked: FieldRef<"RefreshToken", 'Boolean'>
    readonly createdAt: FieldRef<"RefreshToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RefreshToken findUnique
   */
  export type RefreshTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findUniqueOrThrow
   */
  export type RefreshTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findFirst
   */
  export type RefreshTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findFirstOrThrow
   */
  export type RefreshTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findMany
   */
  export type RefreshTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken create
   */
  export type RefreshTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a RefreshToken.
     */
    data: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
  }

  /**
   * RefreshToken createMany
   */
  export type RefreshTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RefreshToken createManyAndReturn
   */
  export type RefreshTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken update
   */
  export type RefreshTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a RefreshToken.
     */
    data: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
    /**
     * Choose, which RefreshToken to update.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken updateMany
   */
  export type RefreshTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
  }

  /**
   * RefreshToken updateManyAndReturn
   */
  export type RefreshTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RefreshToken upsert
   */
  export type RefreshTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the RefreshToken to update in case it exists.
     */
    where: RefreshTokenWhereUniqueInput
    /**
     * In case the RefreshToken found by the `where` argument doesn't exist, create a new RefreshToken with this data.
     */
    create: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
    /**
     * In case the RefreshToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
  }

  /**
   * RefreshToken delete
   */
  export type RefreshTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
    /**
     * Filter which RefreshToken to delete.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken deleteMany
   */
  export type RefreshTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshTokens to delete
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to delete.
     */
    limit?: number
  }

  /**
   * RefreshToken without action
   */
  export type RefreshTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RefreshTokenInclude<ExtArgs> | null
  }


  /**
   * Model CourseSellerProfile
   */

  export type AggregateCourseSellerProfile = {
    _count: CourseSellerProfileCountAggregateOutputType | null
    _min: CourseSellerProfileMinAggregateOutputType | null
    _max: CourseSellerProfileMaxAggregateOutputType | null
  }

  export type CourseSellerProfileMinAggregateOutputType = {
    id: string | null
    isActive: boolean | null
    userId: string | null
  }

  export type CourseSellerProfileMaxAggregateOutputType = {
    id: string | null
    isActive: boolean | null
    userId: string | null
  }

  export type CourseSellerProfileCountAggregateOutputType = {
    id: number
    certification: number
    expertise: number
    isActive: number
    userId: number
    _all: number
  }


  export type CourseSellerProfileMinAggregateInputType = {
    id?: true
    isActive?: true
    userId?: true
  }

  export type CourseSellerProfileMaxAggregateInputType = {
    id?: true
    isActive?: true
    userId?: true
  }

  export type CourseSellerProfileCountAggregateInputType = {
    id?: true
    certification?: true
    expertise?: true
    isActive?: true
    userId?: true
    _all?: true
  }

  export type CourseSellerProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CourseSellerProfile to aggregate.
     */
    where?: CourseSellerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseSellerProfiles to fetch.
     */
    orderBy?: CourseSellerProfileOrderByWithRelationInput | CourseSellerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CourseSellerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseSellerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseSellerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CourseSellerProfiles
    **/
    _count?: true | CourseSellerProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CourseSellerProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CourseSellerProfileMaxAggregateInputType
  }

  export type GetCourseSellerProfileAggregateType<T extends CourseSellerProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateCourseSellerProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCourseSellerProfile[P]>
      : GetScalarType<T[P], AggregateCourseSellerProfile[P]>
  }




  export type CourseSellerProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourseSellerProfileWhereInput
    orderBy?: CourseSellerProfileOrderByWithAggregationInput | CourseSellerProfileOrderByWithAggregationInput[]
    by: CourseSellerProfileScalarFieldEnum[] | CourseSellerProfileScalarFieldEnum
    having?: CourseSellerProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CourseSellerProfileCountAggregateInputType | true
    _min?: CourseSellerProfileMinAggregateInputType
    _max?: CourseSellerProfileMaxAggregateInputType
  }

  export type CourseSellerProfileGroupByOutputType = {
    id: string
    certification: string[]
    expertise: string[]
    isActive: boolean
    userId: string
    _count: CourseSellerProfileCountAggregateOutputType | null
    _min: CourseSellerProfileMinAggregateOutputType | null
    _max: CourseSellerProfileMaxAggregateOutputType | null
  }

  type GetCourseSellerProfileGroupByPayload<T extends CourseSellerProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CourseSellerProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CourseSellerProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CourseSellerProfileGroupByOutputType[P]>
            : GetScalarType<T[P], CourseSellerProfileGroupByOutputType[P]>
        }
      >
    >


  export type CourseSellerProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    certification?: boolean
    expertise?: boolean
    isActive?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courseSellerProfile"]>

  export type CourseSellerProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    certification?: boolean
    expertise?: boolean
    isActive?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courseSellerProfile"]>

  export type CourseSellerProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    certification?: boolean
    expertise?: boolean
    isActive?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courseSellerProfile"]>

  export type CourseSellerProfileSelectScalar = {
    id?: boolean
    certification?: boolean
    expertise?: boolean
    isActive?: boolean
    userId?: boolean
  }

  export type CourseSellerProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "certification" | "expertise" | "isActive" | "userId", ExtArgs["result"]["courseSellerProfile"]>
  export type CourseSellerProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CourseSellerProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CourseSellerProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CourseSellerProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CourseSellerProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      certification: string[]
      expertise: string[]
      isActive: boolean
      userId: string
    }, ExtArgs["result"]["courseSellerProfile"]>
    composites: {}
  }

  type CourseSellerProfileGetPayload<S extends boolean | null | undefined | CourseSellerProfileDefaultArgs> = $Result.GetResult<Prisma.$CourseSellerProfilePayload, S>

  type CourseSellerProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CourseSellerProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CourseSellerProfileCountAggregateInputType | true
    }

  export interface CourseSellerProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CourseSellerProfile'], meta: { name: 'CourseSellerProfile' } }
    /**
     * Find zero or one CourseSellerProfile that matches the filter.
     * @param {CourseSellerProfileFindUniqueArgs} args - Arguments to find a CourseSellerProfile
     * @example
     * // Get one CourseSellerProfile
     * const courseSellerProfile = await prisma.courseSellerProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourseSellerProfileFindUniqueArgs>(args: SelectSubset<T, CourseSellerProfileFindUniqueArgs<ExtArgs>>): Prisma__CourseSellerProfileClient<$Result.GetResult<Prisma.$CourseSellerProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CourseSellerProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CourseSellerProfileFindUniqueOrThrowArgs} args - Arguments to find a CourseSellerProfile
     * @example
     * // Get one CourseSellerProfile
     * const courseSellerProfile = await prisma.courseSellerProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourseSellerProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, CourseSellerProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CourseSellerProfileClient<$Result.GetResult<Prisma.$CourseSellerProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CourseSellerProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerProfileFindFirstArgs} args - Arguments to find a CourseSellerProfile
     * @example
     * // Get one CourseSellerProfile
     * const courseSellerProfile = await prisma.courseSellerProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourseSellerProfileFindFirstArgs>(args?: SelectSubset<T, CourseSellerProfileFindFirstArgs<ExtArgs>>): Prisma__CourseSellerProfileClient<$Result.GetResult<Prisma.$CourseSellerProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CourseSellerProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerProfileFindFirstOrThrowArgs} args - Arguments to find a CourseSellerProfile
     * @example
     * // Get one CourseSellerProfile
     * const courseSellerProfile = await prisma.courseSellerProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourseSellerProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, CourseSellerProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__CourseSellerProfileClient<$Result.GetResult<Prisma.$CourseSellerProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CourseSellerProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CourseSellerProfiles
     * const courseSellerProfiles = await prisma.courseSellerProfile.findMany()
     * 
     * // Get first 10 CourseSellerProfiles
     * const courseSellerProfiles = await prisma.courseSellerProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const courseSellerProfileWithIdOnly = await prisma.courseSellerProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CourseSellerProfileFindManyArgs>(args?: SelectSubset<T, CourseSellerProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseSellerProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CourseSellerProfile.
     * @param {CourseSellerProfileCreateArgs} args - Arguments to create a CourseSellerProfile.
     * @example
     * // Create one CourseSellerProfile
     * const CourseSellerProfile = await prisma.courseSellerProfile.create({
     *   data: {
     *     // ... data to create a CourseSellerProfile
     *   }
     * })
     * 
     */
    create<T extends CourseSellerProfileCreateArgs>(args: SelectSubset<T, CourseSellerProfileCreateArgs<ExtArgs>>): Prisma__CourseSellerProfileClient<$Result.GetResult<Prisma.$CourseSellerProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CourseSellerProfiles.
     * @param {CourseSellerProfileCreateManyArgs} args - Arguments to create many CourseSellerProfiles.
     * @example
     * // Create many CourseSellerProfiles
     * const courseSellerProfile = await prisma.courseSellerProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CourseSellerProfileCreateManyArgs>(args?: SelectSubset<T, CourseSellerProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CourseSellerProfiles and returns the data saved in the database.
     * @param {CourseSellerProfileCreateManyAndReturnArgs} args - Arguments to create many CourseSellerProfiles.
     * @example
     * // Create many CourseSellerProfiles
     * const courseSellerProfile = await prisma.courseSellerProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CourseSellerProfiles and only return the `id`
     * const courseSellerProfileWithIdOnly = await prisma.courseSellerProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CourseSellerProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, CourseSellerProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseSellerProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CourseSellerProfile.
     * @param {CourseSellerProfileDeleteArgs} args - Arguments to delete one CourseSellerProfile.
     * @example
     * // Delete one CourseSellerProfile
     * const CourseSellerProfile = await prisma.courseSellerProfile.delete({
     *   where: {
     *     // ... filter to delete one CourseSellerProfile
     *   }
     * })
     * 
     */
    delete<T extends CourseSellerProfileDeleteArgs>(args: SelectSubset<T, CourseSellerProfileDeleteArgs<ExtArgs>>): Prisma__CourseSellerProfileClient<$Result.GetResult<Prisma.$CourseSellerProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CourseSellerProfile.
     * @param {CourseSellerProfileUpdateArgs} args - Arguments to update one CourseSellerProfile.
     * @example
     * // Update one CourseSellerProfile
     * const courseSellerProfile = await prisma.courseSellerProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CourseSellerProfileUpdateArgs>(args: SelectSubset<T, CourseSellerProfileUpdateArgs<ExtArgs>>): Prisma__CourseSellerProfileClient<$Result.GetResult<Prisma.$CourseSellerProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CourseSellerProfiles.
     * @param {CourseSellerProfileDeleteManyArgs} args - Arguments to filter CourseSellerProfiles to delete.
     * @example
     * // Delete a few CourseSellerProfiles
     * const { count } = await prisma.courseSellerProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CourseSellerProfileDeleteManyArgs>(args?: SelectSubset<T, CourseSellerProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CourseSellerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CourseSellerProfiles
     * const courseSellerProfile = await prisma.courseSellerProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CourseSellerProfileUpdateManyArgs>(args: SelectSubset<T, CourseSellerProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CourseSellerProfiles and returns the data updated in the database.
     * @param {CourseSellerProfileUpdateManyAndReturnArgs} args - Arguments to update many CourseSellerProfiles.
     * @example
     * // Update many CourseSellerProfiles
     * const courseSellerProfile = await prisma.courseSellerProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CourseSellerProfiles and only return the `id`
     * const courseSellerProfileWithIdOnly = await prisma.courseSellerProfile.updateManyAndReturn({
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
    updateManyAndReturn<T extends CourseSellerProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, CourseSellerProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseSellerProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CourseSellerProfile.
     * @param {CourseSellerProfileUpsertArgs} args - Arguments to update or create a CourseSellerProfile.
     * @example
     * // Update or create a CourseSellerProfile
     * const courseSellerProfile = await prisma.courseSellerProfile.upsert({
     *   create: {
     *     // ... data to create a CourseSellerProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CourseSellerProfile we want to update
     *   }
     * })
     */
    upsert<T extends CourseSellerProfileUpsertArgs>(args: SelectSubset<T, CourseSellerProfileUpsertArgs<ExtArgs>>): Prisma__CourseSellerProfileClient<$Result.GetResult<Prisma.$CourseSellerProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CourseSellerProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerProfileCountArgs} args - Arguments to filter CourseSellerProfiles to count.
     * @example
     * // Count the number of CourseSellerProfiles
     * const count = await prisma.courseSellerProfile.count({
     *   where: {
     *     // ... the filter for the CourseSellerProfiles we want to count
     *   }
     * })
    **/
    count<T extends CourseSellerProfileCountArgs>(
      args?: Subset<T, CourseSellerProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CourseSellerProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CourseSellerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CourseSellerProfileAggregateArgs>(args: Subset<T, CourseSellerProfileAggregateArgs>): Prisma.PrismaPromise<GetCourseSellerProfileAggregateType<T>>

    /**
     * Group by CourseSellerProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerProfileGroupByArgs} args - Group by arguments.
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
      T extends CourseSellerProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CourseSellerProfileGroupByArgs['orderBy'] }
        : { orderBy?: CourseSellerProfileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CourseSellerProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourseSellerProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CourseSellerProfile model
   */
  readonly fields: CourseSellerProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CourseSellerProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CourseSellerProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the CourseSellerProfile model
   */
  interface CourseSellerProfileFieldRefs {
    readonly id: FieldRef<"CourseSellerProfile", 'String'>
    readonly certification: FieldRef<"CourseSellerProfile", 'String[]'>
    readonly expertise: FieldRef<"CourseSellerProfile", 'String[]'>
    readonly isActive: FieldRef<"CourseSellerProfile", 'Boolean'>
    readonly userId: FieldRef<"CourseSellerProfile", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CourseSellerProfile findUnique
   */
  export type CourseSellerProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileInclude<ExtArgs> | null
    /**
     * Filter, which CourseSellerProfile to fetch.
     */
    where: CourseSellerProfileWhereUniqueInput
  }

  /**
   * CourseSellerProfile findUniqueOrThrow
   */
  export type CourseSellerProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileInclude<ExtArgs> | null
    /**
     * Filter, which CourseSellerProfile to fetch.
     */
    where: CourseSellerProfileWhereUniqueInput
  }

  /**
   * CourseSellerProfile findFirst
   */
  export type CourseSellerProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileInclude<ExtArgs> | null
    /**
     * Filter, which CourseSellerProfile to fetch.
     */
    where?: CourseSellerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseSellerProfiles to fetch.
     */
    orderBy?: CourseSellerProfileOrderByWithRelationInput | CourseSellerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CourseSellerProfiles.
     */
    cursor?: CourseSellerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseSellerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseSellerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CourseSellerProfiles.
     */
    distinct?: CourseSellerProfileScalarFieldEnum | CourseSellerProfileScalarFieldEnum[]
  }

  /**
   * CourseSellerProfile findFirstOrThrow
   */
  export type CourseSellerProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileInclude<ExtArgs> | null
    /**
     * Filter, which CourseSellerProfile to fetch.
     */
    where?: CourseSellerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseSellerProfiles to fetch.
     */
    orderBy?: CourseSellerProfileOrderByWithRelationInput | CourseSellerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CourseSellerProfiles.
     */
    cursor?: CourseSellerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseSellerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseSellerProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CourseSellerProfiles.
     */
    distinct?: CourseSellerProfileScalarFieldEnum | CourseSellerProfileScalarFieldEnum[]
  }

  /**
   * CourseSellerProfile findMany
   */
  export type CourseSellerProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileInclude<ExtArgs> | null
    /**
     * Filter, which CourseSellerProfiles to fetch.
     */
    where?: CourseSellerProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseSellerProfiles to fetch.
     */
    orderBy?: CourseSellerProfileOrderByWithRelationInput | CourseSellerProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CourseSellerProfiles.
     */
    cursor?: CourseSellerProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseSellerProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseSellerProfiles.
     */
    skip?: number
    distinct?: CourseSellerProfileScalarFieldEnum | CourseSellerProfileScalarFieldEnum[]
  }

  /**
   * CourseSellerProfile create
   */
  export type CourseSellerProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a CourseSellerProfile.
     */
    data: XOR<CourseSellerProfileCreateInput, CourseSellerProfileUncheckedCreateInput>
  }

  /**
   * CourseSellerProfile createMany
   */
  export type CourseSellerProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CourseSellerProfiles.
     */
    data: CourseSellerProfileCreateManyInput | CourseSellerProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CourseSellerProfile createManyAndReturn
   */
  export type CourseSellerProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * The data used to create many CourseSellerProfiles.
     */
    data: CourseSellerProfileCreateManyInput | CourseSellerProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CourseSellerProfile update
   */
  export type CourseSellerProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a CourseSellerProfile.
     */
    data: XOR<CourseSellerProfileUpdateInput, CourseSellerProfileUncheckedUpdateInput>
    /**
     * Choose, which CourseSellerProfile to update.
     */
    where: CourseSellerProfileWhereUniqueInput
  }

  /**
   * CourseSellerProfile updateMany
   */
  export type CourseSellerProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CourseSellerProfiles.
     */
    data: XOR<CourseSellerProfileUpdateManyMutationInput, CourseSellerProfileUncheckedUpdateManyInput>
    /**
     * Filter which CourseSellerProfiles to update
     */
    where?: CourseSellerProfileWhereInput
    /**
     * Limit how many CourseSellerProfiles to update.
     */
    limit?: number
  }

  /**
   * CourseSellerProfile updateManyAndReturn
   */
  export type CourseSellerProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * The data used to update CourseSellerProfiles.
     */
    data: XOR<CourseSellerProfileUpdateManyMutationInput, CourseSellerProfileUncheckedUpdateManyInput>
    /**
     * Filter which CourseSellerProfiles to update
     */
    where?: CourseSellerProfileWhereInput
    /**
     * Limit how many CourseSellerProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CourseSellerProfile upsert
   */
  export type CourseSellerProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the CourseSellerProfile to update in case it exists.
     */
    where: CourseSellerProfileWhereUniqueInput
    /**
     * In case the CourseSellerProfile found by the `where` argument doesn't exist, create a new CourseSellerProfile with this data.
     */
    create: XOR<CourseSellerProfileCreateInput, CourseSellerProfileUncheckedCreateInput>
    /**
     * In case the CourseSellerProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CourseSellerProfileUpdateInput, CourseSellerProfileUncheckedUpdateInput>
  }

  /**
   * CourseSellerProfile delete
   */
  export type CourseSellerProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileInclude<ExtArgs> | null
    /**
     * Filter which CourseSellerProfile to delete.
     */
    where: CourseSellerProfileWhereUniqueInput
  }

  /**
   * CourseSellerProfile deleteMany
   */
  export type CourseSellerProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CourseSellerProfiles to delete
     */
    where?: CourseSellerProfileWhereInput
    /**
     * Limit how many CourseSellerProfiles to delete.
     */
    limit?: number
  }

  /**
   * CourseSellerProfile without action
   */
  export type CourseSellerProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerProfile
     */
    select?: CourseSellerProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerProfile
     */
    omit?: CourseSellerProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerProfileInclude<ExtArgs> | null
  }


  /**
   * Model AdministratorProfile
   */

  export type AggregateAdministratorProfile = {
    _count: AdministratorProfileCountAggregateOutputType | null
    _min: AdministratorProfileMinAggregateOutputType | null
    _max: AdministratorProfileMaxAggregateOutputType | null
  }

  export type AdministratorProfileMinAggregateOutputType = {
    id: string | null
    userId: string | null
  }

  export type AdministratorProfileMaxAggregateOutputType = {
    id: string | null
    userId: string | null
  }

  export type AdministratorProfileCountAggregateOutputType = {
    id: number
    userId: number
    _all: number
  }


  export type AdministratorProfileMinAggregateInputType = {
    id?: true
    userId?: true
  }

  export type AdministratorProfileMaxAggregateInputType = {
    id?: true
    userId?: true
  }

  export type AdministratorProfileCountAggregateInputType = {
    id?: true
    userId?: true
    _all?: true
  }

  export type AdministratorProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdministratorProfile to aggregate.
     */
    where?: AdministratorProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdministratorProfiles to fetch.
     */
    orderBy?: AdministratorProfileOrderByWithRelationInput | AdministratorProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdministratorProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdministratorProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdministratorProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdministratorProfiles
    **/
    _count?: true | AdministratorProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdministratorProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdministratorProfileMaxAggregateInputType
  }

  export type GetAdministratorProfileAggregateType<T extends AdministratorProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateAdministratorProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdministratorProfile[P]>
      : GetScalarType<T[P], AggregateAdministratorProfile[P]>
  }




  export type AdministratorProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdministratorProfileWhereInput
    orderBy?: AdministratorProfileOrderByWithAggregationInput | AdministratorProfileOrderByWithAggregationInput[]
    by: AdministratorProfileScalarFieldEnum[] | AdministratorProfileScalarFieldEnum
    having?: AdministratorProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdministratorProfileCountAggregateInputType | true
    _min?: AdministratorProfileMinAggregateInputType
    _max?: AdministratorProfileMaxAggregateInputType
  }

  export type AdministratorProfileGroupByOutputType = {
    id: string
    userId: string
    _count: AdministratorProfileCountAggregateOutputType | null
    _min: AdministratorProfileMinAggregateOutputType | null
    _max: AdministratorProfileMaxAggregateOutputType | null
  }

  type GetAdministratorProfileGroupByPayload<T extends AdministratorProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdministratorProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdministratorProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdministratorProfileGroupByOutputType[P]>
            : GetScalarType<T[P], AdministratorProfileGroupByOutputType[P]>
        }
      >
    >


  export type AdministratorProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["administratorProfile"]>

  export type AdministratorProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["administratorProfile"]>

  export type AdministratorProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["administratorProfile"]>

  export type AdministratorProfileSelectScalar = {
    id?: boolean
    userId?: boolean
  }

  export type AdministratorProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId", ExtArgs["result"]["administratorProfile"]>
  export type AdministratorProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AdministratorProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AdministratorProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AdministratorProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdministratorProfile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
    }, ExtArgs["result"]["administratorProfile"]>
    composites: {}
  }

  type AdministratorProfileGetPayload<S extends boolean | null | undefined | AdministratorProfileDefaultArgs> = $Result.GetResult<Prisma.$AdministratorProfilePayload, S>

  type AdministratorProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdministratorProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdministratorProfileCountAggregateInputType | true
    }

  export interface AdministratorProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdministratorProfile'], meta: { name: 'AdministratorProfile' } }
    /**
     * Find zero or one AdministratorProfile that matches the filter.
     * @param {AdministratorProfileFindUniqueArgs} args - Arguments to find a AdministratorProfile
     * @example
     * // Get one AdministratorProfile
     * const administratorProfile = await prisma.administratorProfile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdministratorProfileFindUniqueArgs>(args: SelectSubset<T, AdministratorProfileFindUniqueArgs<ExtArgs>>): Prisma__AdministratorProfileClient<$Result.GetResult<Prisma.$AdministratorProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AdministratorProfile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdministratorProfileFindUniqueOrThrowArgs} args - Arguments to find a AdministratorProfile
     * @example
     * // Get one AdministratorProfile
     * const administratorProfile = await prisma.administratorProfile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdministratorProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, AdministratorProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdministratorProfileClient<$Result.GetResult<Prisma.$AdministratorProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdministratorProfile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministratorProfileFindFirstArgs} args - Arguments to find a AdministratorProfile
     * @example
     * // Get one AdministratorProfile
     * const administratorProfile = await prisma.administratorProfile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdministratorProfileFindFirstArgs>(args?: SelectSubset<T, AdministratorProfileFindFirstArgs<ExtArgs>>): Prisma__AdministratorProfileClient<$Result.GetResult<Prisma.$AdministratorProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdministratorProfile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministratorProfileFindFirstOrThrowArgs} args - Arguments to find a AdministratorProfile
     * @example
     * // Get one AdministratorProfile
     * const administratorProfile = await prisma.administratorProfile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdministratorProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, AdministratorProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdministratorProfileClient<$Result.GetResult<Prisma.$AdministratorProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AdministratorProfiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministratorProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdministratorProfiles
     * const administratorProfiles = await prisma.administratorProfile.findMany()
     * 
     * // Get first 10 AdministratorProfiles
     * const administratorProfiles = await prisma.administratorProfile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const administratorProfileWithIdOnly = await prisma.administratorProfile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdministratorProfileFindManyArgs>(args?: SelectSubset<T, AdministratorProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdministratorProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AdministratorProfile.
     * @param {AdministratorProfileCreateArgs} args - Arguments to create a AdministratorProfile.
     * @example
     * // Create one AdministratorProfile
     * const AdministratorProfile = await prisma.administratorProfile.create({
     *   data: {
     *     // ... data to create a AdministratorProfile
     *   }
     * })
     * 
     */
    create<T extends AdministratorProfileCreateArgs>(args: SelectSubset<T, AdministratorProfileCreateArgs<ExtArgs>>): Prisma__AdministratorProfileClient<$Result.GetResult<Prisma.$AdministratorProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AdministratorProfiles.
     * @param {AdministratorProfileCreateManyArgs} args - Arguments to create many AdministratorProfiles.
     * @example
     * // Create many AdministratorProfiles
     * const administratorProfile = await prisma.administratorProfile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdministratorProfileCreateManyArgs>(args?: SelectSubset<T, AdministratorProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AdministratorProfiles and returns the data saved in the database.
     * @param {AdministratorProfileCreateManyAndReturnArgs} args - Arguments to create many AdministratorProfiles.
     * @example
     * // Create many AdministratorProfiles
     * const administratorProfile = await prisma.administratorProfile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AdministratorProfiles and only return the `id`
     * const administratorProfileWithIdOnly = await prisma.administratorProfile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdministratorProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, AdministratorProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdministratorProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AdministratorProfile.
     * @param {AdministratorProfileDeleteArgs} args - Arguments to delete one AdministratorProfile.
     * @example
     * // Delete one AdministratorProfile
     * const AdministratorProfile = await prisma.administratorProfile.delete({
     *   where: {
     *     // ... filter to delete one AdministratorProfile
     *   }
     * })
     * 
     */
    delete<T extends AdministratorProfileDeleteArgs>(args: SelectSubset<T, AdministratorProfileDeleteArgs<ExtArgs>>): Prisma__AdministratorProfileClient<$Result.GetResult<Prisma.$AdministratorProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AdministratorProfile.
     * @param {AdministratorProfileUpdateArgs} args - Arguments to update one AdministratorProfile.
     * @example
     * // Update one AdministratorProfile
     * const administratorProfile = await prisma.administratorProfile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdministratorProfileUpdateArgs>(args: SelectSubset<T, AdministratorProfileUpdateArgs<ExtArgs>>): Prisma__AdministratorProfileClient<$Result.GetResult<Prisma.$AdministratorProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AdministratorProfiles.
     * @param {AdministratorProfileDeleteManyArgs} args - Arguments to filter AdministratorProfiles to delete.
     * @example
     * // Delete a few AdministratorProfiles
     * const { count } = await prisma.administratorProfile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdministratorProfileDeleteManyArgs>(args?: SelectSubset<T, AdministratorProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdministratorProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministratorProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdministratorProfiles
     * const administratorProfile = await prisma.administratorProfile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdministratorProfileUpdateManyArgs>(args: SelectSubset<T, AdministratorProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdministratorProfiles and returns the data updated in the database.
     * @param {AdministratorProfileUpdateManyAndReturnArgs} args - Arguments to update many AdministratorProfiles.
     * @example
     * // Update many AdministratorProfiles
     * const administratorProfile = await prisma.administratorProfile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AdministratorProfiles and only return the `id`
     * const administratorProfileWithIdOnly = await prisma.administratorProfile.updateManyAndReturn({
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
    updateManyAndReturn<T extends AdministratorProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, AdministratorProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdministratorProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AdministratorProfile.
     * @param {AdministratorProfileUpsertArgs} args - Arguments to update or create a AdministratorProfile.
     * @example
     * // Update or create a AdministratorProfile
     * const administratorProfile = await prisma.administratorProfile.upsert({
     *   create: {
     *     // ... data to create a AdministratorProfile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdministratorProfile we want to update
     *   }
     * })
     */
    upsert<T extends AdministratorProfileUpsertArgs>(args: SelectSubset<T, AdministratorProfileUpsertArgs<ExtArgs>>): Prisma__AdministratorProfileClient<$Result.GetResult<Prisma.$AdministratorProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AdministratorProfiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministratorProfileCountArgs} args - Arguments to filter AdministratorProfiles to count.
     * @example
     * // Count the number of AdministratorProfiles
     * const count = await prisma.administratorProfile.count({
     *   where: {
     *     // ... the filter for the AdministratorProfiles we want to count
     *   }
     * })
    **/
    count<T extends AdministratorProfileCountArgs>(
      args?: Subset<T, AdministratorProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdministratorProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdministratorProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministratorProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AdministratorProfileAggregateArgs>(args: Subset<T, AdministratorProfileAggregateArgs>): Prisma.PrismaPromise<GetAdministratorProfileAggregateType<T>>

    /**
     * Group by AdministratorProfile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdministratorProfileGroupByArgs} args - Group by arguments.
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
      T extends AdministratorProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdministratorProfileGroupByArgs['orderBy'] }
        : { orderBy?: AdministratorProfileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AdministratorProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdministratorProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdministratorProfile model
   */
  readonly fields: AdministratorProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdministratorProfile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdministratorProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the AdministratorProfile model
   */
  interface AdministratorProfileFieldRefs {
    readonly id: FieldRef<"AdministratorProfile", 'String'>
    readonly userId: FieldRef<"AdministratorProfile", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AdministratorProfile findUnique
   */
  export type AdministratorProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileInclude<ExtArgs> | null
    /**
     * Filter, which AdministratorProfile to fetch.
     */
    where: AdministratorProfileWhereUniqueInput
  }

  /**
   * AdministratorProfile findUniqueOrThrow
   */
  export type AdministratorProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileInclude<ExtArgs> | null
    /**
     * Filter, which AdministratorProfile to fetch.
     */
    where: AdministratorProfileWhereUniqueInput
  }

  /**
   * AdministratorProfile findFirst
   */
  export type AdministratorProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileInclude<ExtArgs> | null
    /**
     * Filter, which AdministratorProfile to fetch.
     */
    where?: AdministratorProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdministratorProfiles to fetch.
     */
    orderBy?: AdministratorProfileOrderByWithRelationInput | AdministratorProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdministratorProfiles.
     */
    cursor?: AdministratorProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdministratorProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdministratorProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdministratorProfiles.
     */
    distinct?: AdministratorProfileScalarFieldEnum | AdministratorProfileScalarFieldEnum[]
  }

  /**
   * AdministratorProfile findFirstOrThrow
   */
  export type AdministratorProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileInclude<ExtArgs> | null
    /**
     * Filter, which AdministratorProfile to fetch.
     */
    where?: AdministratorProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdministratorProfiles to fetch.
     */
    orderBy?: AdministratorProfileOrderByWithRelationInput | AdministratorProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdministratorProfiles.
     */
    cursor?: AdministratorProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdministratorProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdministratorProfiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdministratorProfiles.
     */
    distinct?: AdministratorProfileScalarFieldEnum | AdministratorProfileScalarFieldEnum[]
  }

  /**
   * AdministratorProfile findMany
   */
  export type AdministratorProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileInclude<ExtArgs> | null
    /**
     * Filter, which AdministratorProfiles to fetch.
     */
    where?: AdministratorProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdministratorProfiles to fetch.
     */
    orderBy?: AdministratorProfileOrderByWithRelationInput | AdministratorProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdministratorProfiles.
     */
    cursor?: AdministratorProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdministratorProfiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdministratorProfiles.
     */
    skip?: number
    distinct?: AdministratorProfileScalarFieldEnum | AdministratorProfileScalarFieldEnum[]
  }

  /**
   * AdministratorProfile create
   */
  export type AdministratorProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a AdministratorProfile.
     */
    data: XOR<AdministratorProfileCreateInput, AdministratorProfileUncheckedCreateInput>
  }

  /**
   * AdministratorProfile createMany
   */
  export type AdministratorProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdministratorProfiles.
     */
    data: AdministratorProfileCreateManyInput | AdministratorProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdministratorProfile createManyAndReturn
   */
  export type AdministratorProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * The data used to create many AdministratorProfiles.
     */
    data: AdministratorProfileCreateManyInput | AdministratorProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AdministratorProfile update
   */
  export type AdministratorProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a AdministratorProfile.
     */
    data: XOR<AdministratorProfileUpdateInput, AdministratorProfileUncheckedUpdateInput>
    /**
     * Choose, which AdministratorProfile to update.
     */
    where: AdministratorProfileWhereUniqueInput
  }

  /**
   * AdministratorProfile updateMany
   */
  export type AdministratorProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdministratorProfiles.
     */
    data: XOR<AdministratorProfileUpdateManyMutationInput, AdministratorProfileUncheckedUpdateManyInput>
    /**
     * Filter which AdministratorProfiles to update
     */
    where?: AdministratorProfileWhereInput
    /**
     * Limit how many AdministratorProfiles to update.
     */
    limit?: number
  }

  /**
   * AdministratorProfile updateManyAndReturn
   */
  export type AdministratorProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * The data used to update AdministratorProfiles.
     */
    data: XOR<AdministratorProfileUpdateManyMutationInput, AdministratorProfileUncheckedUpdateManyInput>
    /**
     * Filter which AdministratorProfiles to update
     */
    where?: AdministratorProfileWhereInput
    /**
     * Limit how many AdministratorProfiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AdministratorProfile upsert
   */
  export type AdministratorProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the AdministratorProfile to update in case it exists.
     */
    where: AdministratorProfileWhereUniqueInput
    /**
     * In case the AdministratorProfile found by the `where` argument doesn't exist, create a new AdministratorProfile with this data.
     */
    create: XOR<AdministratorProfileCreateInput, AdministratorProfileUncheckedCreateInput>
    /**
     * In case the AdministratorProfile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdministratorProfileUpdateInput, AdministratorProfileUncheckedUpdateInput>
  }

  /**
   * AdministratorProfile delete
   */
  export type AdministratorProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileInclude<ExtArgs> | null
    /**
     * Filter which AdministratorProfile to delete.
     */
    where: AdministratorProfileWhereUniqueInput
  }

  /**
   * AdministratorProfile deleteMany
   */
  export type AdministratorProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdministratorProfiles to delete
     */
    where?: AdministratorProfileWhereInput
    /**
     * Limit how many AdministratorProfiles to delete.
     */
    limit?: number
  }

  /**
   * AdministratorProfile without action
   */
  export type AdministratorProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdministratorProfile
     */
    select?: AdministratorProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdministratorProfile
     */
    omit?: AdministratorProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdministratorProfileInclude<ExtArgs> | null
  }


  /**
   * Model CourseSellerApplication
   */

  export type AggregateCourseSellerApplication = {
    _count: CourseSellerApplicationCountAggregateOutputType | null
    _min: CourseSellerApplicationMinAggregateOutputType | null
    _max: CourseSellerApplicationMaxAggregateOutputType | null
  }

  export type CourseSellerApplicationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    message: string | null
    status: $Enums.ApplicationStatus | null
    rejectionReason: string | null
    createdAt: Date | null
  }

  export type CourseSellerApplicationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    message: string | null
    status: $Enums.ApplicationStatus | null
    rejectionReason: string | null
    createdAt: Date | null
  }

  export type CourseSellerApplicationCountAggregateOutputType = {
    id: number
    userId: number
    certification: number
    expertise: number
    message: number
    status: number
    rejectionReason: number
    createdAt: number
    _all: number
  }


  export type CourseSellerApplicationMinAggregateInputType = {
    id?: true
    userId?: true
    message?: true
    status?: true
    rejectionReason?: true
    createdAt?: true
  }

  export type CourseSellerApplicationMaxAggregateInputType = {
    id?: true
    userId?: true
    message?: true
    status?: true
    rejectionReason?: true
    createdAt?: true
  }

  export type CourseSellerApplicationCountAggregateInputType = {
    id?: true
    userId?: true
    certification?: true
    expertise?: true
    message?: true
    status?: true
    rejectionReason?: true
    createdAt?: true
    _all?: true
  }

  export type CourseSellerApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CourseSellerApplication to aggregate.
     */
    where?: CourseSellerApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseSellerApplications to fetch.
     */
    orderBy?: CourseSellerApplicationOrderByWithRelationInput | CourseSellerApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CourseSellerApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseSellerApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseSellerApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CourseSellerApplications
    **/
    _count?: true | CourseSellerApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CourseSellerApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CourseSellerApplicationMaxAggregateInputType
  }

  export type GetCourseSellerApplicationAggregateType<T extends CourseSellerApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateCourseSellerApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCourseSellerApplication[P]>
      : GetScalarType<T[P], AggregateCourseSellerApplication[P]>
  }




  export type CourseSellerApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourseSellerApplicationWhereInput
    orderBy?: CourseSellerApplicationOrderByWithAggregationInput | CourseSellerApplicationOrderByWithAggregationInput[]
    by: CourseSellerApplicationScalarFieldEnum[] | CourseSellerApplicationScalarFieldEnum
    having?: CourseSellerApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CourseSellerApplicationCountAggregateInputType | true
    _min?: CourseSellerApplicationMinAggregateInputType
    _max?: CourseSellerApplicationMaxAggregateInputType
  }

  export type CourseSellerApplicationGroupByOutputType = {
    id: string
    userId: string
    certification: string[]
    expertise: string[]
    message: string | null
    status: $Enums.ApplicationStatus
    rejectionReason: string | null
    createdAt: Date
    _count: CourseSellerApplicationCountAggregateOutputType | null
    _min: CourseSellerApplicationMinAggregateOutputType | null
    _max: CourseSellerApplicationMaxAggregateOutputType | null
  }

  type GetCourseSellerApplicationGroupByPayload<T extends CourseSellerApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CourseSellerApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CourseSellerApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CourseSellerApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], CourseSellerApplicationGroupByOutputType[P]>
        }
      >
    >


  export type CourseSellerApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    certification?: boolean
    expertise?: boolean
    message?: boolean
    status?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courseSellerApplication"]>

  export type CourseSellerApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    certification?: boolean
    expertise?: boolean
    message?: boolean
    status?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courseSellerApplication"]>

  export type CourseSellerApplicationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    certification?: boolean
    expertise?: boolean
    message?: boolean
    status?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courseSellerApplication"]>

  export type CourseSellerApplicationSelectScalar = {
    id?: boolean
    userId?: boolean
    certification?: boolean
    expertise?: boolean
    message?: boolean
    status?: boolean
    rejectionReason?: boolean
    createdAt?: boolean
  }

  export type CourseSellerApplicationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "certification" | "expertise" | "message" | "status" | "rejectionReason" | "createdAt", ExtArgs["result"]["courseSellerApplication"]>
  export type CourseSellerApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CourseSellerApplicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CourseSellerApplicationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CourseSellerApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CourseSellerApplication"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      certification: string[]
      expertise: string[]
      message: string | null
      status: $Enums.ApplicationStatus
      rejectionReason: string | null
      createdAt: Date
    }, ExtArgs["result"]["courseSellerApplication"]>
    composites: {}
  }

  type CourseSellerApplicationGetPayload<S extends boolean | null | undefined | CourseSellerApplicationDefaultArgs> = $Result.GetResult<Prisma.$CourseSellerApplicationPayload, S>

  type CourseSellerApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CourseSellerApplicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CourseSellerApplicationCountAggregateInputType | true
    }

  export interface CourseSellerApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CourseSellerApplication'], meta: { name: 'CourseSellerApplication' } }
    /**
     * Find zero or one CourseSellerApplication that matches the filter.
     * @param {CourseSellerApplicationFindUniqueArgs} args - Arguments to find a CourseSellerApplication
     * @example
     * // Get one CourseSellerApplication
     * const courseSellerApplication = await prisma.courseSellerApplication.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourseSellerApplicationFindUniqueArgs>(args: SelectSubset<T, CourseSellerApplicationFindUniqueArgs<ExtArgs>>): Prisma__CourseSellerApplicationClient<$Result.GetResult<Prisma.$CourseSellerApplicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CourseSellerApplication that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CourseSellerApplicationFindUniqueOrThrowArgs} args - Arguments to find a CourseSellerApplication
     * @example
     * // Get one CourseSellerApplication
     * const courseSellerApplication = await prisma.courseSellerApplication.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourseSellerApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, CourseSellerApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CourseSellerApplicationClient<$Result.GetResult<Prisma.$CourseSellerApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CourseSellerApplication that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerApplicationFindFirstArgs} args - Arguments to find a CourseSellerApplication
     * @example
     * // Get one CourseSellerApplication
     * const courseSellerApplication = await prisma.courseSellerApplication.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourseSellerApplicationFindFirstArgs>(args?: SelectSubset<T, CourseSellerApplicationFindFirstArgs<ExtArgs>>): Prisma__CourseSellerApplicationClient<$Result.GetResult<Prisma.$CourseSellerApplicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CourseSellerApplication that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerApplicationFindFirstOrThrowArgs} args - Arguments to find a CourseSellerApplication
     * @example
     * // Get one CourseSellerApplication
     * const courseSellerApplication = await prisma.courseSellerApplication.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourseSellerApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, CourseSellerApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__CourseSellerApplicationClient<$Result.GetResult<Prisma.$CourseSellerApplicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CourseSellerApplications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CourseSellerApplications
     * const courseSellerApplications = await prisma.courseSellerApplication.findMany()
     * 
     * // Get first 10 CourseSellerApplications
     * const courseSellerApplications = await prisma.courseSellerApplication.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const courseSellerApplicationWithIdOnly = await prisma.courseSellerApplication.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CourseSellerApplicationFindManyArgs>(args?: SelectSubset<T, CourseSellerApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseSellerApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CourseSellerApplication.
     * @param {CourseSellerApplicationCreateArgs} args - Arguments to create a CourseSellerApplication.
     * @example
     * // Create one CourseSellerApplication
     * const CourseSellerApplication = await prisma.courseSellerApplication.create({
     *   data: {
     *     // ... data to create a CourseSellerApplication
     *   }
     * })
     * 
     */
    create<T extends CourseSellerApplicationCreateArgs>(args: SelectSubset<T, CourseSellerApplicationCreateArgs<ExtArgs>>): Prisma__CourseSellerApplicationClient<$Result.GetResult<Prisma.$CourseSellerApplicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CourseSellerApplications.
     * @param {CourseSellerApplicationCreateManyArgs} args - Arguments to create many CourseSellerApplications.
     * @example
     * // Create many CourseSellerApplications
     * const courseSellerApplication = await prisma.courseSellerApplication.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CourseSellerApplicationCreateManyArgs>(args?: SelectSubset<T, CourseSellerApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CourseSellerApplications and returns the data saved in the database.
     * @param {CourseSellerApplicationCreateManyAndReturnArgs} args - Arguments to create many CourseSellerApplications.
     * @example
     * // Create many CourseSellerApplications
     * const courseSellerApplication = await prisma.courseSellerApplication.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CourseSellerApplications and only return the `id`
     * const courseSellerApplicationWithIdOnly = await prisma.courseSellerApplication.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CourseSellerApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, CourseSellerApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseSellerApplicationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CourseSellerApplication.
     * @param {CourseSellerApplicationDeleteArgs} args - Arguments to delete one CourseSellerApplication.
     * @example
     * // Delete one CourseSellerApplication
     * const CourseSellerApplication = await prisma.courseSellerApplication.delete({
     *   where: {
     *     // ... filter to delete one CourseSellerApplication
     *   }
     * })
     * 
     */
    delete<T extends CourseSellerApplicationDeleteArgs>(args: SelectSubset<T, CourseSellerApplicationDeleteArgs<ExtArgs>>): Prisma__CourseSellerApplicationClient<$Result.GetResult<Prisma.$CourseSellerApplicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CourseSellerApplication.
     * @param {CourseSellerApplicationUpdateArgs} args - Arguments to update one CourseSellerApplication.
     * @example
     * // Update one CourseSellerApplication
     * const courseSellerApplication = await prisma.courseSellerApplication.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CourseSellerApplicationUpdateArgs>(args: SelectSubset<T, CourseSellerApplicationUpdateArgs<ExtArgs>>): Prisma__CourseSellerApplicationClient<$Result.GetResult<Prisma.$CourseSellerApplicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CourseSellerApplications.
     * @param {CourseSellerApplicationDeleteManyArgs} args - Arguments to filter CourseSellerApplications to delete.
     * @example
     * // Delete a few CourseSellerApplications
     * const { count } = await prisma.courseSellerApplication.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CourseSellerApplicationDeleteManyArgs>(args?: SelectSubset<T, CourseSellerApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CourseSellerApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CourseSellerApplications
     * const courseSellerApplication = await prisma.courseSellerApplication.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CourseSellerApplicationUpdateManyArgs>(args: SelectSubset<T, CourseSellerApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CourseSellerApplications and returns the data updated in the database.
     * @param {CourseSellerApplicationUpdateManyAndReturnArgs} args - Arguments to update many CourseSellerApplications.
     * @example
     * // Update many CourseSellerApplications
     * const courseSellerApplication = await prisma.courseSellerApplication.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CourseSellerApplications and only return the `id`
     * const courseSellerApplicationWithIdOnly = await prisma.courseSellerApplication.updateManyAndReturn({
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
    updateManyAndReturn<T extends CourseSellerApplicationUpdateManyAndReturnArgs>(args: SelectSubset<T, CourseSellerApplicationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseSellerApplicationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CourseSellerApplication.
     * @param {CourseSellerApplicationUpsertArgs} args - Arguments to update or create a CourseSellerApplication.
     * @example
     * // Update or create a CourseSellerApplication
     * const courseSellerApplication = await prisma.courseSellerApplication.upsert({
     *   create: {
     *     // ... data to create a CourseSellerApplication
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CourseSellerApplication we want to update
     *   }
     * })
     */
    upsert<T extends CourseSellerApplicationUpsertArgs>(args: SelectSubset<T, CourseSellerApplicationUpsertArgs<ExtArgs>>): Prisma__CourseSellerApplicationClient<$Result.GetResult<Prisma.$CourseSellerApplicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CourseSellerApplications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerApplicationCountArgs} args - Arguments to filter CourseSellerApplications to count.
     * @example
     * // Count the number of CourseSellerApplications
     * const count = await prisma.courseSellerApplication.count({
     *   where: {
     *     // ... the filter for the CourseSellerApplications we want to count
     *   }
     * })
    **/
    count<T extends CourseSellerApplicationCountArgs>(
      args?: Subset<T, CourseSellerApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CourseSellerApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CourseSellerApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CourseSellerApplicationAggregateArgs>(args: Subset<T, CourseSellerApplicationAggregateArgs>): Prisma.PrismaPromise<GetCourseSellerApplicationAggregateType<T>>

    /**
     * Group by CourseSellerApplication.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseSellerApplicationGroupByArgs} args - Group by arguments.
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
      T extends CourseSellerApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CourseSellerApplicationGroupByArgs['orderBy'] }
        : { orderBy?: CourseSellerApplicationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CourseSellerApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourseSellerApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CourseSellerApplication model
   */
  readonly fields: CourseSellerApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CourseSellerApplication.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CourseSellerApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the CourseSellerApplication model
   */
  interface CourseSellerApplicationFieldRefs {
    readonly id: FieldRef<"CourseSellerApplication", 'String'>
    readonly userId: FieldRef<"CourseSellerApplication", 'String'>
    readonly certification: FieldRef<"CourseSellerApplication", 'String[]'>
    readonly expertise: FieldRef<"CourseSellerApplication", 'String[]'>
    readonly message: FieldRef<"CourseSellerApplication", 'String'>
    readonly status: FieldRef<"CourseSellerApplication", 'ApplicationStatus'>
    readonly rejectionReason: FieldRef<"CourseSellerApplication", 'String'>
    readonly createdAt: FieldRef<"CourseSellerApplication", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CourseSellerApplication findUnique
   */
  export type CourseSellerApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationInclude<ExtArgs> | null
    /**
     * Filter, which CourseSellerApplication to fetch.
     */
    where: CourseSellerApplicationWhereUniqueInput
  }

  /**
   * CourseSellerApplication findUniqueOrThrow
   */
  export type CourseSellerApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationInclude<ExtArgs> | null
    /**
     * Filter, which CourseSellerApplication to fetch.
     */
    where: CourseSellerApplicationWhereUniqueInput
  }

  /**
   * CourseSellerApplication findFirst
   */
  export type CourseSellerApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationInclude<ExtArgs> | null
    /**
     * Filter, which CourseSellerApplication to fetch.
     */
    where?: CourseSellerApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseSellerApplications to fetch.
     */
    orderBy?: CourseSellerApplicationOrderByWithRelationInput | CourseSellerApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CourseSellerApplications.
     */
    cursor?: CourseSellerApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseSellerApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseSellerApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CourseSellerApplications.
     */
    distinct?: CourseSellerApplicationScalarFieldEnum | CourseSellerApplicationScalarFieldEnum[]
  }

  /**
   * CourseSellerApplication findFirstOrThrow
   */
  export type CourseSellerApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationInclude<ExtArgs> | null
    /**
     * Filter, which CourseSellerApplication to fetch.
     */
    where?: CourseSellerApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseSellerApplications to fetch.
     */
    orderBy?: CourseSellerApplicationOrderByWithRelationInput | CourseSellerApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CourseSellerApplications.
     */
    cursor?: CourseSellerApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseSellerApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseSellerApplications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CourseSellerApplications.
     */
    distinct?: CourseSellerApplicationScalarFieldEnum | CourseSellerApplicationScalarFieldEnum[]
  }

  /**
   * CourseSellerApplication findMany
   */
  export type CourseSellerApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationInclude<ExtArgs> | null
    /**
     * Filter, which CourseSellerApplications to fetch.
     */
    where?: CourseSellerApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseSellerApplications to fetch.
     */
    orderBy?: CourseSellerApplicationOrderByWithRelationInput | CourseSellerApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CourseSellerApplications.
     */
    cursor?: CourseSellerApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseSellerApplications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseSellerApplications.
     */
    skip?: number
    distinct?: CourseSellerApplicationScalarFieldEnum | CourseSellerApplicationScalarFieldEnum[]
  }

  /**
   * CourseSellerApplication create
   */
  export type CourseSellerApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a CourseSellerApplication.
     */
    data: XOR<CourseSellerApplicationCreateInput, CourseSellerApplicationUncheckedCreateInput>
  }

  /**
   * CourseSellerApplication createMany
   */
  export type CourseSellerApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CourseSellerApplications.
     */
    data: CourseSellerApplicationCreateManyInput | CourseSellerApplicationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CourseSellerApplication createManyAndReturn
   */
  export type CourseSellerApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * The data used to create many CourseSellerApplications.
     */
    data: CourseSellerApplicationCreateManyInput | CourseSellerApplicationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CourseSellerApplication update
   */
  export type CourseSellerApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a CourseSellerApplication.
     */
    data: XOR<CourseSellerApplicationUpdateInput, CourseSellerApplicationUncheckedUpdateInput>
    /**
     * Choose, which CourseSellerApplication to update.
     */
    where: CourseSellerApplicationWhereUniqueInput
  }

  /**
   * CourseSellerApplication updateMany
   */
  export type CourseSellerApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CourseSellerApplications.
     */
    data: XOR<CourseSellerApplicationUpdateManyMutationInput, CourseSellerApplicationUncheckedUpdateManyInput>
    /**
     * Filter which CourseSellerApplications to update
     */
    where?: CourseSellerApplicationWhereInput
    /**
     * Limit how many CourseSellerApplications to update.
     */
    limit?: number
  }

  /**
   * CourseSellerApplication updateManyAndReturn
   */
  export type CourseSellerApplicationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * The data used to update CourseSellerApplications.
     */
    data: XOR<CourseSellerApplicationUpdateManyMutationInput, CourseSellerApplicationUncheckedUpdateManyInput>
    /**
     * Filter which CourseSellerApplications to update
     */
    where?: CourseSellerApplicationWhereInput
    /**
     * Limit how many CourseSellerApplications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CourseSellerApplication upsert
   */
  export type CourseSellerApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the CourseSellerApplication to update in case it exists.
     */
    where: CourseSellerApplicationWhereUniqueInput
    /**
     * In case the CourseSellerApplication found by the `where` argument doesn't exist, create a new CourseSellerApplication with this data.
     */
    create: XOR<CourseSellerApplicationCreateInput, CourseSellerApplicationUncheckedCreateInput>
    /**
     * In case the CourseSellerApplication was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CourseSellerApplicationUpdateInput, CourseSellerApplicationUncheckedUpdateInput>
  }

  /**
   * CourseSellerApplication delete
   */
  export type CourseSellerApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationInclude<ExtArgs> | null
    /**
     * Filter which CourseSellerApplication to delete.
     */
    where: CourseSellerApplicationWhereUniqueInput
  }

  /**
   * CourseSellerApplication deleteMany
   */
  export type CourseSellerApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CourseSellerApplications to delete
     */
    where?: CourseSellerApplicationWhereInput
    /**
     * Limit how many CourseSellerApplications to delete.
     */
    limit?: number
  }

  /**
   * CourseSellerApplication without action
   */
  export type CourseSellerApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseSellerApplication
     */
    select?: CourseSellerApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseSellerApplication
     */
    omit?: CourseSellerApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseSellerApplicationInclude<ExtArgs> | null
  }


  /**
   * Model Policy
   */

  export type AggregatePolicy = {
    _count: PolicyCountAggregateOutputType | null
    _min: PolicyMinAggregateOutputType | null
    _max: PolicyMaxAggregateOutputType | null
  }

  export type PolicyMinAggregateOutputType = {
    id: string | null
    content: string | null
    createdAt: Date | null
    userId: string | null
  }

  export type PolicyMaxAggregateOutputType = {
    id: string | null
    content: string | null
    createdAt: Date | null
    userId: string | null
  }

  export type PolicyCountAggregateOutputType = {
    id: number
    content: number
    createdAt: number
    userId: number
    _all: number
  }


  export type PolicyMinAggregateInputType = {
    id?: true
    content?: true
    createdAt?: true
    userId?: true
  }

  export type PolicyMaxAggregateInputType = {
    id?: true
    content?: true
    createdAt?: true
    userId?: true
  }

  export type PolicyCountAggregateInputType = {
    id?: true
    content?: true
    createdAt?: true
    userId?: true
    _all?: true
  }

  export type PolicyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Policy to aggregate.
     */
    where?: PolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Policies to fetch.
     */
    orderBy?: PolicyOrderByWithRelationInput | PolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Policies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Policies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Policies
    **/
    _count?: true | PolicyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PolicyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PolicyMaxAggregateInputType
  }

  export type GetPolicyAggregateType<T extends PolicyAggregateArgs> = {
        [P in keyof T & keyof AggregatePolicy]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePolicy[P]>
      : GetScalarType<T[P], AggregatePolicy[P]>
  }




  export type PolicyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PolicyWhereInput
    orderBy?: PolicyOrderByWithAggregationInput | PolicyOrderByWithAggregationInput[]
    by: PolicyScalarFieldEnum[] | PolicyScalarFieldEnum
    having?: PolicyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PolicyCountAggregateInputType | true
    _min?: PolicyMinAggregateInputType
    _max?: PolicyMaxAggregateInputType
  }

  export type PolicyGroupByOutputType = {
    id: string
    content: string
    createdAt: Date
    userId: string
    _count: PolicyCountAggregateOutputType | null
    _min: PolicyMinAggregateOutputType | null
    _max: PolicyMaxAggregateOutputType | null
  }

  type GetPolicyGroupByPayload<T extends PolicyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PolicyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PolicyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PolicyGroupByOutputType[P]>
            : GetScalarType<T[P], PolicyGroupByOutputType[P]>
        }
      >
    >


  export type PolicySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    createdAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["policy"]>

  export type PolicySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    createdAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["policy"]>

  export type PolicySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    createdAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["policy"]>

  export type PolicySelectScalar = {
    id?: boolean
    content?: boolean
    createdAt?: boolean
    userId?: boolean
  }

  export type PolicyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "createdAt" | "userId", ExtArgs["result"]["policy"]>
  export type PolicyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PolicyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PolicyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PolicyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Policy"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      createdAt: Date
      userId: string
    }, ExtArgs["result"]["policy"]>
    composites: {}
  }

  type PolicyGetPayload<S extends boolean | null | undefined | PolicyDefaultArgs> = $Result.GetResult<Prisma.$PolicyPayload, S>

  type PolicyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PolicyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PolicyCountAggregateInputType | true
    }

  export interface PolicyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Policy'], meta: { name: 'Policy' } }
    /**
     * Find zero or one Policy that matches the filter.
     * @param {PolicyFindUniqueArgs} args - Arguments to find a Policy
     * @example
     * // Get one Policy
     * const policy = await prisma.policy.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PolicyFindUniqueArgs>(args: SelectSubset<T, PolicyFindUniqueArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Policy that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PolicyFindUniqueOrThrowArgs} args - Arguments to find a Policy
     * @example
     * // Get one Policy
     * const policy = await prisma.policy.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PolicyFindUniqueOrThrowArgs>(args: SelectSubset<T, PolicyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Policy that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyFindFirstArgs} args - Arguments to find a Policy
     * @example
     * // Get one Policy
     * const policy = await prisma.policy.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PolicyFindFirstArgs>(args?: SelectSubset<T, PolicyFindFirstArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Policy that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyFindFirstOrThrowArgs} args - Arguments to find a Policy
     * @example
     * // Get one Policy
     * const policy = await prisma.policy.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PolicyFindFirstOrThrowArgs>(args?: SelectSubset<T, PolicyFindFirstOrThrowArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Policies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Policies
     * const policies = await prisma.policy.findMany()
     * 
     * // Get first 10 Policies
     * const policies = await prisma.policy.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const policyWithIdOnly = await prisma.policy.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PolicyFindManyArgs>(args?: SelectSubset<T, PolicyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Policy.
     * @param {PolicyCreateArgs} args - Arguments to create a Policy.
     * @example
     * // Create one Policy
     * const Policy = await prisma.policy.create({
     *   data: {
     *     // ... data to create a Policy
     *   }
     * })
     * 
     */
    create<T extends PolicyCreateArgs>(args: SelectSubset<T, PolicyCreateArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Policies.
     * @param {PolicyCreateManyArgs} args - Arguments to create many Policies.
     * @example
     * // Create many Policies
     * const policy = await prisma.policy.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PolicyCreateManyArgs>(args?: SelectSubset<T, PolicyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Policies and returns the data saved in the database.
     * @param {PolicyCreateManyAndReturnArgs} args - Arguments to create many Policies.
     * @example
     * // Create many Policies
     * const policy = await prisma.policy.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Policies and only return the `id`
     * const policyWithIdOnly = await prisma.policy.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PolicyCreateManyAndReturnArgs>(args?: SelectSubset<T, PolicyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Policy.
     * @param {PolicyDeleteArgs} args - Arguments to delete one Policy.
     * @example
     * // Delete one Policy
     * const Policy = await prisma.policy.delete({
     *   where: {
     *     // ... filter to delete one Policy
     *   }
     * })
     * 
     */
    delete<T extends PolicyDeleteArgs>(args: SelectSubset<T, PolicyDeleteArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Policy.
     * @param {PolicyUpdateArgs} args - Arguments to update one Policy.
     * @example
     * // Update one Policy
     * const policy = await prisma.policy.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PolicyUpdateArgs>(args: SelectSubset<T, PolicyUpdateArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Policies.
     * @param {PolicyDeleteManyArgs} args - Arguments to filter Policies to delete.
     * @example
     * // Delete a few Policies
     * const { count } = await prisma.policy.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PolicyDeleteManyArgs>(args?: SelectSubset<T, PolicyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Policies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Policies
     * const policy = await prisma.policy.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PolicyUpdateManyArgs>(args: SelectSubset<T, PolicyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Policies and returns the data updated in the database.
     * @param {PolicyUpdateManyAndReturnArgs} args - Arguments to update many Policies.
     * @example
     * // Update many Policies
     * const policy = await prisma.policy.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Policies and only return the `id`
     * const policyWithIdOnly = await prisma.policy.updateManyAndReturn({
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
    updateManyAndReturn<T extends PolicyUpdateManyAndReturnArgs>(args: SelectSubset<T, PolicyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Policy.
     * @param {PolicyUpsertArgs} args - Arguments to update or create a Policy.
     * @example
     * // Update or create a Policy
     * const policy = await prisma.policy.upsert({
     *   create: {
     *     // ... data to create a Policy
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Policy we want to update
     *   }
     * })
     */
    upsert<T extends PolicyUpsertArgs>(args: SelectSubset<T, PolicyUpsertArgs<ExtArgs>>): Prisma__PolicyClient<$Result.GetResult<Prisma.$PolicyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Policies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyCountArgs} args - Arguments to filter Policies to count.
     * @example
     * // Count the number of Policies
     * const count = await prisma.policy.count({
     *   where: {
     *     // ... the filter for the Policies we want to count
     *   }
     * })
    **/
    count<T extends PolicyCountArgs>(
      args?: Subset<T, PolicyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PolicyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Policy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PolicyAggregateArgs>(args: Subset<T, PolicyAggregateArgs>): Prisma.PrismaPromise<GetPolicyAggregateType<T>>

    /**
     * Group by Policy.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PolicyGroupByArgs} args - Group by arguments.
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
      T extends PolicyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PolicyGroupByArgs['orderBy'] }
        : { orderBy?: PolicyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PolicyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPolicyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Policy model
   */
  readonly fields: PolicyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Policy.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PolicyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Policy model
   */
  interface PolicyFieldRefs {
    readonly id: FieldRef<"Policy", 'String'>
    readonly content: FieldRef<"Policy", 'String'>
    readonly createdAt: FieldRef<"Policy", 'DateTime'>
    readonly userId: FieldRef<"Policy", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Policy findUnique
   */
  export type PolicyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * Filter, which Policy to fetch.
     */
    where: PolicyWhereUniqueInput
  }

  /**
   * Policy findUniqueOrThrow
   */
  export type PolicyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * Filter, which Policy to fetch.
     */
    where: PolicyWhereUniqueInput
  }

  /**
   * Policy findFirst
   */
  export type PolicyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * Filter, which Policy to fetch.
     */
    where?: PolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Policies to fetch.
     */
    orderBy?: PolicyOrderByWithRelationInput | PolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Policies.
     */
    cursor?: PolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Policies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Policies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Policies.
     */
    distinct?: PolicyScalarFieldEnum | PolicyScalarFieldEnum[]
  }

  /**
   * Policy findFirstOrThrow
   */
  export type PolicyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * Filter, which Policy to fetch.
     */
    where?: PolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Policies to fetch.
     */
    orderBy?: PolicyOrderByWithRelationInput | PolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Policies.
     */
    cursor?: PolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Policies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Policies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Policies.
     */
    distinct?: PolicyScalarFieldEnum | PolicyScalarFieldEnum[]
  }

  /**
   * Policy findMany
   */
  export type PolicyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * Filter, which Policies to fetch.
     */
    where?: PolicyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Policies to fetch.
     */
    orderBy?: PolicyOrderByWithRelationInput | PolicyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Policies.
     */
    cursor?: PolicyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Policies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Policies.
     */
    skip?: number
    distinct?: PolicyScalarFieldEnum | PolicyScalarFieldEnum[]
  }

  /**
   * Policy create
   */
  export type PolicyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * The data needed to create a Policy.
     */
    data: XOR<PolicyCreateInput, PolicyUncheckedCreateInput>
  }

  /**
   * Policy createMany
   */
  export type PolicyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Policies.
     */
    data: PolicyCreateManyInput | PolicyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Policy createManyAndReturn
   */
  export type PolicyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * The data used to create many Policies.
     */
    data: PolicyCreateManyInput | PolicyCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Policy update
   */
  export type PolicyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * The data needed to update a Policy.
     */
    data: XOR<PolicyUpdateInput, PolicyUncheckedUpdateInput>
    /**
     * Choose, which Policy to update.
     */
    where: PolicyWhereUniqueInput
  }

  /**
   * Policy updateMany
   */
  export type PolicyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Policies.
     */
    data: XOR<PolicyUpdateManyMutationInput, PolicyUncheckedUpdateManyInput>
    /**
     * Filter which Policies to update
     */
    where?: PolicyWhereInput
    /**
     * Limit how many Policies to update.
     */
    limit?: number
  }

  /**
   * Policy updateManyAndReturn
   */
  export type PolicyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * The data used to update Policies.
     */
    data: XOR<PolicyUpdateManyMutationInput, PolicyUncheckedUpdateManyInput>
    /**
     * Filter which Policies to update
     */
    where?: PolicyWhereInput
    /**
     * Limit how many Policies to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Policy upsert
   */
  export type PolicyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * The filter to search for the Policy to update in case it exists.
     */
    where: PolicyWhereUniqueInput
    /**
     * In case the Policy found by the `where` argument doesn't exist, create a new Policy with this data.
     */
    create: XOR<PolicyCreateInput, PolicyUncheckedCreateInput>
    /**
     * In case the Policy was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PolicyUpdateInput, PolicyUncheckedUpdateInput>
  }

  /**
   * Policy delete
   */
  export type PolicyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
    /**
     * Filter which Policy to delete.
     */
    where: PolicyWhereUniqueInput
  }

  /**
   * Policy deleteMany
   */
  export type PolicyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Policies to delete
     */
    where?: PolicyWhereInput
    /**
     * Limit how many Policies to delete.
     */
    limit?: number
  }

  /**
   * Policy without action
   */
  export type PolicyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Policy
     */
    select?: PolicySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Policy
     */
    omit?: PolicyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PolicyInclude<ExtArgs> | null
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


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    fullName: 'fullName',
    phoneNumber: 'phoneNumber',
    profilePicture: 'profilePicture',
    dateOfBirth: 'dateOfBirth',
    createdAt: 'createdAt',
    englishLevel: 'englishLevel',
    learningGoals: 'learningGoals',
    role: 'role',
    isEmailVerified: 'isEmailVerified'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RefreshTokenScalarFieldEnum: {
    id: 'id',
    hashedToken: 'hashedToken',
    userId: 'userId',
    revoked: 'revoked',
    createdAt: 'createdAt'
  };

  export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum]


  export const CourseSellerProfileScalarFieldEnum: {
    id: 'id',
    certification: 'certification',
    expertise: 'expertise',
    isActive: 'isActive',
    userId: 'userId'
  };

  export type CourseSellerProfileScalarFieldEnum = (typeof CourseSellerProfileScalarFieldEnum)[keyof typeof CourseSellerProfileScalarFieldEnum]


  export const AdministratorProfileScalarFieldEnum: {
    id: 'id',
    userId: 'userId'
  };

  export type AdministratorProfileScalarFieldEnum = (typeof AdministratorProfileScalarFieldEnum)[keyof typeof AdministratorProfileScalarFieldEnum]


  export const CourseSellerApplicationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    certification: 'certification',
    expertise: 'expertise',
    message: 'message',
    status: 'status',
    rejectionReason: 'rejectionReason',
    createdAt: 'createdAt'
  };

  export type CourseSellerApplicationScalarFieldEnum = (typeof CourseSellerApplicationScalarFieldEnum)[keyof typeof CourseSellerApplicationScalarFieldEnum]


  export const PolicyScalarFieldEnum: {
    id: 'id',
    content: 'content',
    createdAt: 'createdAt',
    userId: 'userId'
  };

  export type PolicyScalarFieldEnum = (typeof PolicyScalarFieldEnum)[keyof typeof PolicyScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'ApplicationStatus'
   */
  export type EnumApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStatus'>
    


  /**
   * Reference to a field of type 'ApplicationStatus[]'
   */
  export type ListEnumApplicationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ApplicationStatus[]'>
    


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


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    phoneNumber?: StringNullableFilter<"User"> | string | null
    profilePicture?: StringNullableFilter<"User"> | string | null
    dateOfBirth?: DateTimeFilter<"User"> | Date | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    englishLevel?: StringNullableFilter<"User"> | string | null
    learningGoals?: StringNullableListFilter<"User">
    role?: EnumUserRoleNullableFilter<"User"> | $Enums.UserRole | null
    isEmailVerified?: BoolFilter<"User"> | boolean
    administratorProfile?: XOR<AdministratorProfileNullableScalarRelationFilter, AdministratorProfileWhereInput> | null
    courseSellerApplication?: XOR<CourseSellerApplicationNullableScalarRelationFilter, CourseSellerApplicationWhereInput> | null
    courseSellerProfile?: XOR<CourseSellerProfileNullableScalarRelationFilter, CourseSellerProfileWhereInput> | null
    policy?: XOR<PolicyNullableScalarRelationFilter, PolicyWhereInput> | null
    refreshTokens?: RefreshTokenListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    profilePicture?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrder
    createdAt?: SortOrder
    englishLevel?: SortOrderInput | SortOrder
    learningGoals?: SortOrder
    role?: SortOrderInput | SortOrder
    isEmailVerified?: SortOrder
    administratorProfile?: AdministratorProfileOrderByWithRelationInput
    courseSellerApplication?: CourseSellerApplicationOrderByWithRelationInput
    courseSellerProfile?: CourseSellerProfileOrderByWithRelationInput
    policy?: PolicyOrderByWithRelationInput
    refreshTokens?: RefreshTokenOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    phoneNumber?: StringNullableFilter<"User"> | string | null
    profilePicture?: StringNullableFilter<"User"> | string | null
    dateOfBirth?: DateTimeFilter<"User"> | Date | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    englishLevel?: StringNullableFilter<"User"> | string | null
    learningGoals?: StringNullableListFilter<"User">
    role?: EnumUserRoleNullableFilter<"User"> | $Enums.UserRole | null
    isEmailVerified?: BoolFilter<"User"> | boolean
    administratorProfile?: XOR<AdministratorProfileNullableScalarRelationFilter, AdministratorProfileWhereInput> | null
    courseSellerApplication?: XOR<CourseSellerApplicationNullableScalarRelationFilter, CourseSellerApplicationWhereInput> | null
    courseSellerProfile?: XOR<CourseSellerProfileNullableScalarRelationFilter, CourseSellerProfileWhereInput> | null
    policy?: XOR<PolicyNullableScalarRelationFilter, PolicyWhereInput> | null
    refreshTokens?: RefreshTokenListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    profilePicture?: SortOrderInput | SortOrder
    dateOfBirth?: SortOrder
    createdAt?: SortOrder
    englishLevel?: SortOrderInput | SortOrder
    learningGoals?: SortOrder
    role?: SortOrderInput | SortOrder
    isEmailVerified?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    fullName?: StringWithAggregatesFilter<"User"> | string
    phoneNumber?: StringNullableWithAggregatesFilter<"User"> | string | null
    profilePicture?: StringNullableWithAggregatesFilter<"User"> | string | null
    dateOfBirth?: DateTimeWithAggregatesFilter<"User"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    englishLevel?: StringNullableWithAggregatesFilter<"User"> | string | null
    learningGoals?: StringNullableListFilter<"User">
    role?: EnumUserRoleNullableWithAggregatesFilter<"User"> | $Enums.UserRole | null
    isEmailVerified?: BoolWithAggregatesFilter<"User"> | boolean
  }

  export type RefreshTokenWhereInput = {
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    id?: UuidFilter<"RefreshToken"> | string
    hashedToken?: StringFilter<"RefreshToken"> | string
    userId?: UuidFilter<"RefreshToken"> | string
    revoked?: BoolFilter<"RefreshToken"> | boolean
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RefreshTokenOrderByWithRelationInput = {
    id?: SortOrder
    hashedToken?: SortOrder
    userId?: SortOrder
    revoked?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type RefreshTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    hashedToken?: string
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    userId?: UuidFilter<"RefreshToken"> | string
    revoked?: BoolFilter<"RefreshToken"> | boolean
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "hashedToken">

  export type RefreshTokenOrderByWithAggregationInput = {
    id?: SortOrder
    hashedToken?: SortOrder
    userId?: SortOrder
    revoked?: SortOrder
    createdAt?: SortOrder
    _count?: RefreshTokenCountOrderByAggregateInput
    _max?: RefreshTokenMaxOrderByAggregateInput
    _min?: RefreshTokenMinOrderByAggregateInput
  }

  export type RefreshTokenScalarWhereWithAggregatesInput = {
    AND?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    OR?: RefreshTokenScalarWhereWithAggregatesInput[]
    NOT?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"RefreshToken"> | string
    hashedToken?: StringWithAggregatesFilter<"RefreshToken"> | string
    userId?: UuidWithAggregatesFilter<"RefreshToken"> | string
    revoked?: BoolWithAggregatesFilter<"RefreshToken"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
  }

  export type CourseSellerProfileWhereInput = {
    AND?: CourseSellerProfileWhereInput | CourseSellerProfileWhereInput[]
    OR?: CourseSellerProfileWhereInput[]
    NOT?: CourseSellerProfileWhereInput | CourseSellerProfileWhereInput[]
    id?: UuidFilter<"CourseSellerProfile"> | string
    certification?: StringNullableListFilter<"CourseSellerProfile">
    expertise?: StringNullableListFilter<"CourseSellerProfile">
    isActive?: BoolFilter<"CourseSellerProfile"> | boolean
    userId?: UuidFilter<"CourseSellerProfile"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type CourseSellerProfileOrderByWithRelationInput = {
    id?: SortOrder
    certification?: SortOrder
    expertise?: SortOrder
    isActive?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type CourseSellerProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: CourseSellerProfileWhereInput | CourseSellerProfileWhereInput[]
    OR?: CourseSellerProfileWhereInput[]
    NOT?: CourseSellerProfileWhereInput | CourseSellerProfileWhereInput[]
    certification?: StringNullableListFilter<"CourseSellerProfile">
    expertise?: StringNullableListFilter<"CourseSellerProfile">
    isActive?: BoolFilter<"CourseSellerProfile"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type CourseSellerProfileOrderByWithAggregationInput = {
    id?: SortOrder
    certification?: SortOrder
    expertise?: SortOrder
    isActive?: SortOrder
    userId?: SortOrder
    _count?: CourseSellerProfileCountOrderByAggregateInput
    _max?: CourseSellerProfileMaxOrderByAggregateInput
    _min?: CourseSellerProfileMinOrderByAggregateInput
  }

  export type CourseSellerProfileScalarWhereWithAggregatesInput = {
    AND?: CourseSellerProfileScalarWhereWithAggregatesInput | CourseSellerProfileScalarWhereWithAggregatesInput[]
    OR?: CourseSellerProfileScalarWhereWithAggregatesInput[]
    NOT?: CourseSellerProfileScalarWhereWithAggregatesInput | CourseSellerProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"CourseSellerProfile"> | string
    certification?: StringNullableListFilter<"CourseSellerProfile">
    expertise?: StringNullableListFilter<"CourseSellerProfile">
    isActive?: BoolWithAggregatesFilter<"CourseSellerProfile"> | boolean
    userId?: UuidWithAggregatesFilter<"CourseSellerProfile"> | string
  }

  export type AdministratorProfileWhereInput = {
    AND?: AdministratorProfileWhereInput | AdministratorProfileWhereInput[]
    OR?: AdministratorProfileWhereInput[]
    NOT?: AdministratorProfileWhereInput | AdministratorProfileWhereInput[]
    id?: UuidFilter<"AdministratorProfile"> | string
    userId?: UuidFilter<"AdministratorProfile"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AdministratorProfileOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AdministratorProfileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: AdministratorProfileWhereInput | AdministratorProfileWhereInput[]
    OR?: AdministratorProfileWhereInput[]
    NOT?: AdministratorProfileWhereInput | AdministratorProfileWhereInput[]
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type AdministratorProfileOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    _count?: AdministratorProfileCountOrderByAggregateInput
    _max?: AdministratorProfileMaxOrderByAggregateInput
    _min?: AdministratorProfileMinOrderByAggregateInput
  }

  export type AdministratorProfileScalarWhereWithAggregatesInput = {
    AND?: AdministratorProfileScalarWhereWithAggregatesInput | AdministratorProfileScalarWhereWithAggregatesInput[]
    OR?: AdministratorProfileScalarWhereWithAggregatesInput[]
    NOT?: AdministratorProfileScalarWhereWithAggregatesInput | AdministratorProfileScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AdministratorProfile"> | string
    userId?: UuidWithAggregatesFilter<"AdministratorProfile"> | string
  }

  export type CourseSellerApplicationWhereInput = {
    AND?: CourseSellerApplicationWhereInput | CourseSellerApplicationWhereInput[]
    OR?: CourseSellerApplicationWhereInput[]
    NOT?: CourseSellerApplicationWhereInput | CourseSellerApplicationWhereInput[]
    id?: UuidFilter<"CourseSellerApplication"> | string
    userId?: UuidFilter<"CourseSellerApplication"> | string
    certification?: StringNullableListFilter<"CourseSellerApplication">
    expertise?: StringNullableListFilter<"CourseSellerApplication">
    message?: StringNullableFilter<"CourseSellerApplication"> | string | null
    status?: EnumApplicationStatusFilter<"CourseSellerApplication"> | $Enums.ApplicationStatus
    rejectionReason?: StringNullableFilter<"CourseSellerApplication"> | string | null
    createdAt?: DateTimeFilter<"CourseSellerApplication"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type CourseSellerApplicationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    certification?: SortOrder
    expertise?: SortOrder
    message?: SortOrderInput | SortOrder
    status?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type CourseSellerApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: CourseSellerApplicationWhereInput | CourseSellerApplicationWhereInput[]
    OR?: CourseSellerApplicationWhereInput[]
    NOT?: CourseSellerApplicationWhereInput | CourseSellerApplicationWhereInput[]
    certification?: StringNullableListFilter<"CourseSellerApplication">
    expertise?: StringNullableListFilter<"CourseSellerApplication">
    message?: StringNullableFilter<"CourseSellerApplication"> | string | null
    status?: EnumApplicationStatusFilter<"CourseSellerApplication"> | $Enums.ApplicationStatus
    rejectionReason?: StringNullableFilter<"CourseSellerApplication"> | string | null
    createdAt?: DateTimeFilter<"CourseSellerApplication"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type CourseSellerApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    certification?: SortOrder
    expertise?: SortOrder
    message?: SortOrderInput | SortOrder
    status?: SortOrder
    rejectionReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CourseSellerApplicationCountOrderByAggregateInput
    _max?: CourseSellerApplicationMaxOrderByAggregateInput
    _min?: CourseSellerApplicationMinOrderByAggregateInput
  }

  export type CourseSellerApplicationScalarWhereWithAggregatesInput = {
    AND?: CourseSellerApplicationScalarWhereWithAggregatesInput | CourseSellerApplicationScalarWhereWithAggregatesInput[]
    OR?: CourseSellerApplicationScalarWhereWithAggregatesInput[]
    NOT?: CourseSellerApplicationScalarWhereWithAggregatesInput | CourseSellerApplicationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"CourseSellerApplication"> | string
    userId?: UuidWithAggregatesFilter<"CourseSellerApplication"> | string
    certification?: StringNullableListFilter<"CourseSellerApplication">
    expertise?: StringNullableListFilter<"CourseSellerApplication">
    message?: StringNullableWithAggregatesFilter<"CourseSellerApplication"> | string | null
    status?: EnumApplicationStatusWithAggregatesFilter<"CourseSellerApplication"> | $Enums.ApplicationStatus
    rejectionReason?: StringNullableWithAggregatesFilter<"CourseSellerApplication"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CourseSellerApplication"> | Date | string
  }

  export type PolicyWhereInput = {
    AND?: PolicyWhereInput | PolicyWhereInput[]
    OR?: PolicyWhereInput[]
    NOT?: PolicyWhereInput | PolicyWhereInput[]
    id?: UuidFilter<"Policy"> | string
    content?: StringFilter<"Policy"> | string
    createdAt?: DateTimeFilter<"Policy"> | Date | string
    userId?: UuidFilter<"Policy"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PolicyOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PolicyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: PolicyWhereInput | PolicyWhereInput[]
    OR?: PolicyWhereInput[]
    NOT?: PolicyWhereInput | PolicyWhereInput[]
    content?: StringFilter<"Policy"> | string
    createdAt?: DateTimeFilter<"Policy"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type PolicyOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
    _count?: PolicyCountOrderByAggregateInput
    _max?: PolicyMaxOrderByAggregateInput
    _min?: PolicyMinOrderByAggregateInput
  }

  export type PolicyScalarWhereWithAggregatesInput = {
    AND?: PolicyScalarWhereWithAggregatesInput | PolicyScalarWhereWithAggregatesInput[]
    OR?: PolicyScalarWhereWithAggregatesInput[]
    NOT?: PolicyScalarWhereWithAggregatesInput | PolicyScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Policy"> | string
    content?: StringWithAggregatesFilter<"Policy"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Policy"> | Date | string
    userId?: UuidWithAggregatesFilter<"Policy"> | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
    administratorProfile?: AdministratorProfileCreateNestedOneWithoutUserInput
    courseSellerApplication?: CourseSellerApplicationCreateNestedOneWithoutUserInput
    courseSellerProfile?: CourseSellerProfileCreateNestedOneWithoutUserInput
    policy?: PolicyCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
    administratorProfile?: AdministratorProfileUncheckedCreateNestedOneWithoutUserInput
    courseSellerApplication?: CourseSellerApplicationUncheckedCreateNestedOneWithoutUserInput
    courseSellerProfile?: CourseSellerProfileUncheckedCreateNestedOneWithoutUserInput
    policy?: PolicyUncheckedCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    administratorProfile?: AdministratorProfileUpdateOneWithoutUserNestedInput
    courseSellerApplication?: CourseSellerApplicationUpdateOneWithoutUserNestedInput
    courseSellerProfile?: CourseSellerProfileUpdateOneWithoutUserNestedInput
    policy?: PolicyUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    administratorProfile?: AdministratorProfileUncheckedUpdateOneWithoutUserNestedInput
    courseSellerApplication?: CourseSellerApplicationUncheckedUpdateOneWithoutUserNestedInput
    courseSellerProfile?: CourseSellerProfileUncheckedUpdateOneWithoutUserNestedInput
    policy?: PolicyUncheckedUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RefreshTokenCreateInput = {
    id?: string
    hashedToken: string
    revoked?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutRefreshTokensInput
  }

  export type RefreshTokenUncheckedCreateInput = {
    id?: string
    hashedToken: string
    userId: string
    revoked?: boolean
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashedToken?: StringFieldUpdateOperationsInput | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRefreshTokensNestedInput
  }

  export type RefreshTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashedToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateManyInput = {
    id?: string
    hashedToken: string
    userId: string
    revoked?: boolean
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashedToken?: StringFieldUpdateOperationsInput | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashedToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseSellerProfileCreateInput = {
    id?: string
    certification?: CourseSellerProfileCreatecertificationInput | string[]
    expertise?: CourseSellerProfileCreateexpertiseInput | string[]
    isActive?: boolean
    user: UserCreateNestedOneWithoutCourseSellerProfileInput
  }

  export type CourseSellerProfileUncheckedCreateInput = {
    id?: string
    certification?: CourseSellerProfileCreatecertificationInput | string[]
    expertise?: CourseSellerProfileCreateexpertiseInput | string[]
    isActive?: boolean
    userId: string
  }

  export type CourseSellerProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    certification?: CourseSellerProfileUpdatecertificationInput | string[]
    expertise?: CourseSellerProfileUpdateexpertiseInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutCourseSellerProfileNestedInput
  }

  export type CourseSellerProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    certification?: CourseSellerProfileUpdatecertificationInput | string[]
    expertise?: CourseSellerProfileUpdateexpertiseInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CourseSellerProfileCreateManyInput = {
    id?: string
    certification?: CourseSellerProfileCreatecertificationInput | string[]
    expertise?: CourseSellerProfileCreateexpertiseInput | string[]
    isActive?: boolean
    userId: string
  }

  export type CourseSellerProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    certification?: CourseSellerProfileUpdatecertificationInput | string[]
    expertise?: CourseSellerProfileUpdateexpertiseInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CourseSellerProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    certification?: CourseSellerProfileUpdatecertificationInput | string[]
    expertise?: CourseSellerProfileUpdateexpertiseInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AdministratorProfileCreateInput = {
    id?: string
    user: UserCreateNestedOneWithoutAdministratorProfileInput
  }

  export type AdministratorProfileUncheckedCreateInput = {
    id?: string
    userId: string
  }

  export type AdministratorProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutAdministratorProfileNestedInput
  }

  export type AdministratorProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AdministratorProfileCreateManyInput = {
    id?: string
    userId: string
  }

  export type AdministratorProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type AdministratorProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CourseSellerApplicationCreateInput = {
    id?: string
    certification?: CourseSellerApplicationCreatecertificationInput | string[]
    expertise?: CourseSellerApplicationCreateexpertiseInput | string[]
    message?: string | null
    status?: $Enums.ApplicationStatus
    rejectionReason?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutCourseSellerApplicationInput
  }

  export type CourseSellerApplicationUncheckedCreateInput = {
    id?: string
    userId: string
    certification?: CourseSellerApplicationCreatecertificationInput | string[]
    expertise?: CourseSellerApplicationCreateexpertiseInput | string[]
    message?: string | null
    status?: $Enums.ApplicationStatus
    rejectionReason?: string | null
    createdAt?: Date | string
  }

  export type CourseSellerApplicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    certification?: CourseSellerApplicationUpdatecertificationInput | string[]
    expertise?: CourseSellerApplicationUpdateexpertiseInput | string[]
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCourseSellerApplicationNestedInput
  }

  export type CourseSellerApplicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    certification?: CourseSellerApplicationUpdatecertificationInput | string[]
    expertise?: CourseSellerApplicationUpdateexpertiseInput | string[]
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseSellerApplicationCreateManyInput = {
    id?: string
    userId: string
    certification?: CourseSellerApplicationCreatecertificationInput | string[]
    expertise?: CourseSellerApplicationCreateexpertiseInput | string[]
    message?: string | null
    status?: $Enums.ApplicationStatus
    rejectionReason?: string | null
    createdAt?: Date | string
  }

  export type CourseSellerApplicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    certification?: CourseSellerApplicationUpdatecertificationInput | string[]
    expertise?: CourseSellerApplicationUpdateexpertiseInput | string[]
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseSellerApplicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    certification?: CourseSellerApplicationUpdatecertificationInput | string[]
    expertise?: CourseSellerApplicationUpdateexpertiseInput | string[]
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PolicyCreateInput = {
    id?: string
    content: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPolicyInput
  }

  export type PolicyUncheckedCreateInput = {
    id?: string
    content: string
    createdAt?: Date | string
    userId: string
  }

  export type PolicyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPolicyNestedInput
  }

  export type PolicyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type PolicyCreateManyInput = {
    id?: string
    content: string
    createdAt?: Date | string
    userId: string
  }

  export type PolicyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PolicyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type StringNullableFilter<$PrismaModel = never> = {
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
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type EnumUserRoleNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserRoleNullableFilter<$PrismaModel> | $Enums.UserRole | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type AdministratorProfileNullableScalarRelationFilter = {
    is?: AdministratorProfileWhereInput | null
    isNot?: AdministratorProfileWhereInput | null
  }

  export type CourseSellerApplicationNullableScalarRelationFilter = {
    is?: CourseSellerApplicationWhereInput | null
    isNot?: CourseSellerApplicationWhereInput | null
  }

  export type CourseSellerProfileNullableScalarRelationFilter = {
    is?: CourseSellerProfileWhereInput | null
    isNot?: CourseSellerProfileWhereInput | null
  }

  export type PolicyNullableScalarRelationFilter = {
    is?: PolicyWhereInput | null
    isNot?: PolicyWhereInput | null
  }

  export type RefreshTokenListRelationFilter = {
    every?: RefreshTokenWhereInput
    some?: RefreshTokenWhereInput
    none?: RefreshTokenWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type RefreshTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    phoneNumber?: SortOrder
    profilePicture?: SortOrder
    dateOfBirth?: SortOrder
    createdAt?: SortOrder
    englishLevel?: SortOrder
    learningGoals?: SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    phoneNumber?: SortOrder
    profilePicture?: SortOrder
    dateOfBirth?: SortOrder
    createdAt?: SortOrder
    englishLevel?: SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    phoneNumber?: SortOrder
    profilePicture?: SortOrder
    dateOfBirth?: SortOrder
    createdAt?: SortOrder
    englishLevel?: SortOrder
    role?: SortOrder
    isEmailVerified?: SortOrder
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

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
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
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
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

  export type EnumUserRoleNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserRoleNullableWithAggregatesFilter<$PrismaModel> | $Enums.UserRole | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumUserRoleNullableFilter<$PrismaModel>
    _max?: NestedEnumUserRoleNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type RefreshTokenCountOrderByAggregateInput = {
    id?: SortOrder
    hashedToken?: SortOrder
    userId?: SortOrder
    revoked?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    hashedToken?: SortOrder
    userId?: SortOrder
    revoked?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMinOrderByAggregateInput = {
    id?: SortOrder
    hashedToken?: SortOrder
    userId?: SortOrder
    revoked?: SortOrder
    createdAt?: SortOrder
  }

  export type CourseSellerProfileCountOrderByAggregateInput = {
    id?: SortOrder
    certification?: SortOrder
    expertise?: SortOrder
    isActive?: SortOrder
    userId?: SortOrder
  }

  export type CourseSellerProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    isActive?: SortOrder
    userId?: SortOrder
  }

  export type CourseSellerProfileMinOrderByAggregateInput = {
    id?: SortOrder
    isActive?: SortOrder
    userId?: SortOrder
  }

  export type AdministratorProfileCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type AdministratorProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type AdministratorProfileMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type EnumApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusFilter<$PrismaModel> | $Enums.ApplicationStatus
  }

  export type CourseSellerApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    certification?: SortOrder
    expertise?: SortOrder
    message?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
  }

  export type CourseSellerApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
  }

  export type CourseSellerApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    message?: SortOrder
    status?: SortOrder
    rejectionReason?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumApplicationStatusFilter<$PrismaModel>
  }

  export type PolicyCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
  }

  export type PolicyMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
  }

  export type PolicyMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    userId?: SortOrder
  }

  export type UserCreatelearningGoalsInput = {
    set: string[]
  }

  export type AdministratorProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<AdministratorProfileCreateWithoutUserInput, AdministratorProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: AdministratorProfileCreateOrConnectWithoutUserInput
    connect?: AdministratorProfileWhereUniqueInput
  }

  export type CourseSellerApplicationCreateNestedOneWithoutUserInput = {
    create?: XOR<CourseSellerApplicationCreateWithoutUserInput, CourseSellerApplicationUncheckedCreateWithoutUserInput>
    connectOrCreate?: CourseSellerApplicationCreateOrConnectWithoutUserInput
    connect?: CourseSellerApplicationWhereUniqueInput
  }

  export type CourseSellerProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<CourseSellerProfileCreateWithoutUserInput, CourseSellerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: CourseSellerProfileCreateOrConnectWithoutUserInput
    connect?: CourseSellerProfileWhereUniqueInput
  }

  export type PolicyCreateNestedOneWithoutUserInput = {
    create?: XOR<PolicyCreateWithoutUserInput, PolicyUncheckedCreateWithoutUserInput>
    connectOrCreate?: PolicyCreateOrConnectWithoutUserInput
    connect?: PolicyWhereUniqueInput
  }

  export type RefreshTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type AdministratorProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<AdministratorProfileCreateWithoutUserInput, AdministratorProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: AdministratorProfileCreateOrConnectWithoutUserInput
    connect?: AdministratorProfileWhereUniqueInput
  }

  export type CourseSellerApplicationUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<CourseSellerApplicationCreateWithoutUserInput, CourseSellerApplicationUncheckedCreateWithoutUserInput>
    connectOrCreate?: CourseSellerApplicationCreateOrConnectWithoutUserInput
    connect?: CourseSellerApplicationWhereUniqueInput
  }

  export type CourseSellerProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<CourseSellerProfileCreateWithoutUserInput, CourseSellerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: CourseSellerProfileCreateOrConnectWithoutUserInput
    connect?: CourseSellerProfileWhereUniqueInput
  }

  export type PolicyUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<PolicyCreateWithoutUserInput, PolicyUncheckedCreateWithoutUserInput>
    connectOrCreate?: PolicyCreateOrConnectWithoutUserInput
    connect?: PolicyWhereUniqueInput
  }

  export type RefreshTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdatelearningGoalsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableEnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type AdministratorProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<AdministratorProfileCreateWithoutUserInput, AdministratorProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: AdministratorProfileCreateOrConnectWithoutUserInput
    upsert?: AdministratorProfileUpsertWithoutUserInput
    disconnect?: AdministratorProfileWhereInput | boolean
    delete?: AdministratorProfileWhereInput | boolean
    connect?: AdministratorProfileWhereUniqueInput
    update?: XOR<XOR<AdministratorProfileUpdateToOneWithWhereWithoutUserInput, AdministratorProfileUpdateWithoutUserInput>, AdministratorProfileUncheckedUpdateWithoutUserInput>
  }

  export type CourseSellerApplicationUpdateOneWithoutUserNestedInput = {
    create?: XOR<CourseSellerApplicationCreateWithoutUserInput, CourseSellerApplicationUncheckedCreateWithoutUserInput>
    connectOrCreate?: CourseSellerApplicationCreateOrConnectWithoutUserInput
    upsert?: CourseSellerApplicationUpsertWithoutUserInput
    disconnect?: CourseSellerApplicationWhereInput | boolean
    delete?: CourseSellerApplicationWhereInput | boolean
    connect?: CourseSellerApplicationWhereUniqueInput
    update?: XOR<XOR<CourseSellerApplicationUpdateToOneWithWhereWithoutUserInput, CourseSellerApplicationUpdateWithoutUserInput>, CourseSellerApplicationUncheckedUpdateWithoutUserInput>
  }

  export type CourseSellerProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<CourseSellerProfileCreateWithoutUserInput, CourseSellerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: CourseSellerProfileCreateOrConnectWithoutUserInput
    upsert?: CourseSellerProfileUpsertWithoutUserInput
    disconnect?: CourseSellerProfileWhereInput | boolean
    delete?: CourseSellerProfileWhereInput | boolean
    connect?: CourseSellerProfileWhereUniqueInput
    update?: XOR<XOR<CourseSellerProfileUpdateToOneWithWhereWithoutUserInput, CourseSellerProfileUpdateWithoutUserInput>, CourseSellerProfileUncheckedUpdateWithoutUserInput>
  }

  export type PolicyUpdateOneWithoutUserNestedInput = {
    create?: XOR<PolicyCreateWithoutUserInput, PolicyUncheckedCreateWithoutUserInput>
    connectOrCreate?: PolicyCreateOrConnectWithoutUserInput
    upsert?: PolicyUpsertWithoutUserInput
    disconnect?: PolicyWhereInput | boolean
    delete?: PolicyWhereInput | boolean
    connect?: PolicyWhereUniqueInput
    update?: XOR<XOR<PolicyUpdateToOneWithWhereWithoutUserInput, PolicyUpdateWithoutUserInput>, PolicyUncheckedUpdateWithoutUserInput>
  }

  export type RefreshTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type AdministratorProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<AdministratorProfileCreateWithoutUserInput, AdministratorProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: AdministratorProfileCreateOrConnectWithoutUserInput
    upsert?: AdministratorProfileUpsertWithoutUserInput
    disconnect?: AdministratorProfileWhereInput | boolean
    delete?: AdministratorProfileWhereInput | boolean
    connect?: AdministratorProfileWhereUniqueInput
    update?: XOR<XOR<AdministratorProfileUpdateToOneWithWhereWithoutUserInput, AdministratorProfileUpdateWithoutUserInput>, AdministratorProfileUncheckedUpdateWithoutUserInput>
  }

  export type CourseSellerApplicationUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<CourseSellerApplicationCreateWithoutUserInput, CourseSellerApplicationUncheckedCreateWithoutUserInput>
    connectOrCreate?: CourseSellerApplicationCreateOrConnectWithoutUserInput
    upsert?: CourseSellerApplicationUpsertWithoutUserInput
    disconnect?: CourseSellerApplicationWhereInput | boolean
    delete?: CourseSellerApplicationWhereInput | boolean
    connect?: CourseSellerApplicationWhereUniqueInput
    update?: XOR<XOR<CourseSellerApplicationUpdateToOneWithWhereWithoutUserInput, CourseSellerApplicationUpdateWithoutUserInput>, CourseSellerApplicationUncheckedUpdateWithoutUserInput>
  }

  export type CourseSellerProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<CourseSellerProfileCreateWithoutUserInput, CourseSellerProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: CourseSellerProfileCreateOrConnectWithoutUserInput
    upsert?: CourseSellerProfileUpsertWithoutUserInput
    disconnect?: CourseSellerProfileWhereInput | boolean
    delete?: CourseSellerProfileWhereInput | boolean
    connect?: CourseSellerProfileWhereUniqueInput
    update?: XOR<XOR<CourseSellerProfileUpdateToOneWithWhereWithoutUserInput, CourseSellerProfileUpdateWithoutUserInput>, CourseSellerProfileUncheckedUpdateWithoutUserInput>
  }

  export type PolicyUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<PolicyCreateWithoutUserInput, PolicyUncheckedCreateWithoutUserInput>
    connectOrCreate?: PolicyCreateOrConnectWithoutUserInput
    upsert?: PolicyUpsertWithoutUserInput
    disconnect?: PolicyWhereInput | boolean
    delete?: PolicyWhereInput | boolean
    connect?: PolicyWhereUniqueInput
    update?: XOR<XOR<PolicyUpdateToOneWithWhereWithoutUserInput, PolicyUpdateWithoutUserInput>, PolicyUncheckedUpdateWithoutUserInput>
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    upsert?: RefreshTokenUpsertWithWhereUniqueWithoutUserInput | RefreshTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    set?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    disconnect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    delete?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
    update?: RefreshTokenUpdateWithWhereUniqueWithoutUserInput | RefreshTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: RefreshTokenUpdateManyWithWhereWithoutUserInput | RefreshTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutRefreshTokensInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutRefreshTokensNestedInput = {
    create?: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefreshTokensInput
    upsert?: UserUpsertWithoutRefreshTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRefreshTokensInput, UserUpdateWithoutRefreshTokensInput>, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type CourseSellerProfileCreatecertificationInput = {
    set: string[]
  }

  export type CourseSellerProfileCreateexpertiseInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutCourseSellerProfileInput = {
    create?: XOR<UserCreateWithoutCourseSellerProfileInput, UserUncheckedCreateWithoutCourseSellerProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutCourseSellerProfileInput
    connect?: UserWhereUniqueInput
  }

  export type CourseSellerProfileUpdatecertificationInput = {
    set?: string[]
    push?: string | string[]
  }

  export type CourseSellerProfileUpdateexpertiseInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutCourseSellerProfileNestedInput = {
    create?: XOR<UserCreateWithoutCourseSellerProfileInput, UserUncheckedCreateWithoutCourseSellerProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutCourseSellerProfileInput
    upsert?: UserUpsertWithoutCourseSellerProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCourseSellerProfileInput, UserUpdateWithoutCourseSellerProfileInput>, UserUncheckedUpdateWithoutCourseSellerProfileInput>
  }

  export type UserCreateNestedOneWithoutAdministratorProfileInput = {
    create?: XOR<UserCreateWithoutAdministratorProfileInput, UserUncheckedCreateWithoutAdministratorProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdministratorProfileInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAdministratorProfileNestedInput = {
    create?: XOR<UserCreateWithoutAdministratorProfileInput, UserUncheckedCreateWithoutAdministratorProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdministratorProfileInput
    upsert?: UserUpsertWithoutAdministratorProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAdministratorProfileInput, UserUpdateWithoutAdministratorProfileInput>, UserUncheckedUpdateWithoutAdministratorProfileInput>
  }

  export type CourseSellerApplicationCreatecertificationInput = {
    set: string[]
  }

  export type CourseSellerApplicationCreateexpertiseInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutCourseSellerApplicationInput = {
    create?: XOR<UserCreateWithoutCourseSellerApplicationInput, UserUncheckedCreateWithoutCourseSellerApplicationInput>
    connectOrCreate?: UserCreateOrConnectWithoutCourseSellerApplicationInput
    connect?: UserWhereUniqueInput
  }

  export type CourseSellerApplicationUpdatecertificationInput = {
    set?: string[]
    push?: string | string[]
  }

  export type CourseSellerApplicationUpdateexpertiseInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumApplicationStatusFieldUpdateOperationsInput = {
    set?: $Enums.ApplicationStatus
  }

  export type UserUpdateOneRequiredWithoutCourseSellerApplicationNestedInput = {
    create?: XOR<UserCreateWithoutCourseSellerApplicationInput, UserUncheckedCreateWithoutCourseSellerApplicationInput>
    connectOrCreate?: UserCreateOrConnectWithoutCourseSellerApplicationInput
    upsert?: UserUpsertWithoutCourseSellerApplicationInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCourseSellerApplicationInput, UserUpdateWithoutCourseSellerApplicationInput>, UserUncheckedUpdateWithoutCourseSellerApplicationInput>
  }

  export type UserCreateNestedOneWithoutPolicyInput = {
    create?: XOR<UserCreateWithoutPolicyInput, UserUncheckedCreateWithoutPolicyInput>
    connectOrCreate?: UserCreateOrConnectWithoutPolicyInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPolicyNestedInput = {
    create?: XOR<UserCreateWithoutPolicyInput, UserUncheckedCreateWithoutPolicyInput>
    connectOrCreate?: UserCreateOrConnectWithoutPolicyInput
    upsert?: UserUpsertWithoutPolicyInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPolicyInput, UserUpdateWithoutPolicyInput>, UserUncheckedUpdateWithoutPolicyInput>
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

  export type NestedEnumUserRoleNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserRoleNullableFilter<$PrismaModel> | $Enums.UserRole | null
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

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
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
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
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

  export type NestedEnumUserRoleNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserRoleNullableWithAggregatesFilter<$PrismaModel> | $Enums.UserRole | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumUserRoleNullableFilter<$PrismaModel>
    _max?: NestedEnumUserRoleNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusFilter<$PrismaModel> | $Enums.ApplicationStatus
  }

  export type NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ApplicationStatus | EnumApplicationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ApplicationStatus[] | ListEnumApplicationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.ApplicationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumApplicationStatusFilter<$PrismaModel>
    _max?: NestedEnumApplicationStatusFilter<$PrismaModel>
  }

  export type AdministratorProfileCreateWithoutUserInput = {
    id?: string
  }

  export type AdministratorProfileUncheckedCreateWithoutUserInput = {
    id?: string
  }

  export type AdministratorProfileCreateOrConnectWithoutUserInput = {
    where: AdministratorProfileWhereUniqueInput
    create: XOR<AdministratorProfileCreateWithoutUserInput, AdministratorProfileUncheckedCreateWithoutUserInput>
  }

  export type CourseSellerApplicationCreateWithoutUserInput = {
    id?: string
    certification?: CourseSellerApplicationCreatecertificationInput | string[]
    expertise?: CourseSellerApplicationCreateexpertiseInput | string[]
    message?: string | null
    status?: $Enums.ApplicationStatus
    rejectionReason?: string | null
    createdAt?: Date | string
  }

  export type CourseSellerApplicationUncheckedCreateWithoutUserInput = {
    id?: string
    certification?: CourseSellerApplicationCreatecertificationInput | string[]
    expertise?: CourseSellerApplicationCreateexpertiseInput | string[]
    message?: string | null
    status?: $Enums.ApplicationStatus
    rejectionReason?: string | null
    createdAt?: Date | string
  }

  export type CourseSellerApplicationCreateOrConnectWithoutUserInput = {
    where: CourseSellerApplicationWhereUniqueInput
    create: XOR<CourseSellerApplicationCreateWithoutUserInput, CourseSellerApplicationUncheckedCreateWithoutUserInput>
  }

  export type CourseSellerProfileCreateWithoutUserInput = {
    id?: string
    certification?: CourseSellerProfileCreatecertificationInput | string[]
    expertise?: CourseSellerProfileCreateexpertiseInput | string[]
    isActive?: boolean
  }

  export type CourseSellerProfileUncheckedCreateWithoutUserInput = {
    id?: string
    certification?: CourseSellerProfileCreatecertificationInput | string[]
    expertise?: CourseSellerProfileCreateexpertiseInput | string[]
    isActive?: boolean
  }

  export type CourseSellerProfileCreateOrConnectWithoutUserInput = {
    where: CourseSellerProfileWhereUniqueInput
    create: XOR<CourseSellerProfileCreateWithoutUserInput, CourseSellerProfileUncheckedCreateWithoutUserInput>
  }

  export type PolicyCreateWithoutUserInput = {
    id?: string
    content: string
    createdAt?: Date | string
  }

  export type PolicyUncheckedCreateWithoutUserInput = {
    id?: string
    content: string
    createdAt?: Date | string
  }

  export type PolicyCreateOrConnectWithoutUserInput = {
    where: PolicyWhereUniqueInput
    create: XOR<PolicyCreateWithoutUserInput, PolicyUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenCreateWithoutUserInput = {
    id?: string
    hashedToken: string
    revoked?: boolean
    createdAt?: Date | string
  }

  export type RefreshTokenUncheckedCreateWithoutUserInput = {
    id?: string
    hashedToken: string
    revoked?: boolean
    createdAt?: Date | string
  }

  export type RefreshTokenCreateOrConnectWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenCreateManyUserInputEnvelope = {
    data: RefreshTokenCreateManyUserInput | RefreshTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AdministratorProfileUpsertWithoutUserInput = {
    update: XOR<AdministratorProfileUpdateWithoutUserInput, AdministratorProfileUncheckedUpdateWithoutUserInput>
    create: XOR<AdministratorProfileCreateWithoutUserInput, AdministratorProfileUncheckedCreateWithoutUserInput>
    where?: AdministratorProfileWhereInput
  }

  export type AdministratorProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: AdministratorProfileWhereInput
    data: XOR<AdministratorProfileUpdateWithoutUserInput, AdministratorProfileUncheckedUpdateWithoutUserInput>
  }

  export type AdministratorProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type AdministratorProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
  }

  export type CourseSellerApplicationUpsertWithoutUserInput = {
    update: XOR<CourseSellerApplicationUpdateWithoutUserInput, CourseSellerApplicationUncheckedUpdateWithoutUserInput>
    create: XOR<CourseSellerApplicationCreateWithoutUserInput, CourseSellerApplicationUncheckedCreateWithoutUserInput>
    where?: CourseSellerApplicationWhereInput
  }

  export type CourseSellerApplicationUpdateToOneWithWhereWithoutUserInput = {
    where?: CourseSellerApplicationWhereInput
    data: XOR<CourseSellerApplicationUpdateWithoutUserInput, CourseSellerApplicationUncheckedUpdateWithoutUserInput>
  }

  export type CourseSellerApplicationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    certification?: CourseSellerApplicationUpdatecertificationInput | string[]
    expertise?: CourseSellerApplicationUpdateexpertiseInput | string[]
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseSellerApplicationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    certification?: CourseSellerApplicationUpdatecertificationInput | string[]
    expertise?: CourseSellerApplicationUpdateexpertiseInput | string[]
    message?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumApplicationStatusFieldUpdateOperationsInput | $Enums.ApplicationStatus
    rejectionReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourseSellerProfileUpsertWithoutUserInput = {
    update: XOR<CourseSellerProfileUpdateWithoutUserInput, CourseSellerProfileUncheckedUpdateWithoutUserInput>
    create: XOR<CourseSellerProfileCreateWithoutUserInput, CourseSellerProfileUncheckedCreateWithoutUserInput>
    where?: CourseSellerProfileWhereInput
  }

  export type CourseSellerProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: CourseSellerProfileWhereInput
    data: XOR<CourseSellerProfileUpdateWithoutUserInput, CourseSellerProfileUncheckedUpdateWithoutUserInput>
  }

  export type CourseSellerProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    certification?: CourseSellerProfileUpdatecertificationInput | string[]
    expertise?: CourseSellerProfileUpdateexpertiseInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type CourseSellerProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    certification?: CourseSellerProfileUpdatecertificationInput | string[]
    expertise?: CourseSellerProfileUpdateexpertiseInput | string[]
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PolicyUpsertWithoutUserInput = {
    update: XOR<PolicyUpdateWithoutUserInput, PolicyUncheckedUpdateWithoutUserInput>
    create: XOR<PolicyCreateWithoutUserInput, PolicyUncheckedCreateWithoutUserInput>
    where?: PolicyWhereInput
  }

  export type PolicyUpdateToOneWithWhereWithoutUserInput = {
    where?: PolicyWhereInput
    data: XOR<PolicyUpdateWithoutUserInput, PolicyUncheckedUpdateWithoutUserInput>
  }

  export type PolicyUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PolicyUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    update: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    data: XOR<RefreshTokenUpdateWithoutUserInput, RefreshTokenUncheckedUpdateWithoutUserInput>
  }

  export type RefreshTokenUpdateManyWithWhereWithoutUserInput = {
    where: RefreshTokenScalarWhereInput
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type RefreshTokenScalarWhereInput = {
    AND?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    OR?: RefreshTokenScalarWhereInput[]
    NOT?: RefreshTokenScalarWhereInput | RefreshTokenScalarWhereInput[]
    id?: UuidFilter<"RefreshToken"> | string
    hashedToken?: StringFilter<"RefreshToken"> | string
    userId?: UuidFilter<"RefreshToken"> | string
    revoked?: BoolFilter<"RefreshToken"> | boolean
    createdAt?: DateTimeFilter<"RefreshToken"> | Date | string
  }

  export type UserCreateWithoutRefreshTokensInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
    administratorProfile?: AdministratorProfileCreateNestedOneWithoutUserInput
    courseSellerApplication?: CourseSellerApplicationCreateNestedOneWithoutUserInput
    courseSellerProfile?: CourseSellerProfileCreateNestedOneWithoutUserInput
    policy?: PolicyCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRefreshTokensInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
    administratorProfile?: AdministratorProfileUncheckedCreateNestedOneWithoutUserInput
    courseSellerApplication?: CourseSellerApplicationUncheckedCreateNestedOneWithoutUserInput
    courseSellerProfile?: CourseSellerProfileUncheckedCreateNestedOneWithoutUserInput
    policy?: PolicyUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRefreshTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
  }

  export type UserUpsertWithoutRefreshTokensInput = {
    update: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
    create: XOR<UserCreateWithoutRefreshTokensInput, UserUncheckedCreateWithoutRefreshTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRefreshTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRefreshTokensInput, UserUncheckedUpdateWithoutRefreshTokensInput>
  }

  export type UserUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    administratorProfile?: AdministratorProfileUpdateOneWithoutUserNestedInput
    courseSellerApplication?: CourseSellerApplicationUpdateOneWithoutUserNestedInput
    courseSellerProfile?: CourseSellerProfileUpdateOneWithoutUserNestedInput
    policy?: PolicyUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRefreshTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    administratorProfile?: AdministratorProfileUncheckedUpdateOneWithoutUserNestedInput
    courseSellerApplication?: CourseSellerApplicationUncheckedUpdateOneWithoutUserNestedInput
    courseSellerProfile?: CourseSellerProfileUncheckedUpdateOneWithoutUserNestedInput
    policy?: PolicyUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutCourseSellerProfileInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
    administratorProfile?: AdministratorProfileCreateNestedOneWithoutUserInput
    courseSellerApplication?: CourseSellerApplicationCreateNestedOneWithoutUserInput
    policy?: PolicyCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCourseSellerProfileInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
    administratorProfile?: AdministratorProfileUncheckedCreateNestedOneWithoutUserInput
    courseSellerApplication?: CourseSellerApplicationUncheckedCreateNestedOneWithoutUserInput
    policy?: PolicyUncheckedCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCourseSellerProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCourseSellerProfileInput, UserUncheckedCreateWithoutCourseSellerProfileInput>
  }

  export type UserUpsertWithoutCourseSellerProfileInput = {
    update: XOR<UserUpdateWithoutCourseSellerProfileInput, UserUncheckedUpdateWithoutCourseSellerProfileInput>
    create: XOR<UserCreateWithoutCourseSellerProfileInput, UserUncheckedCreateWithoutCourseSellerProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCourseSellerProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCourseSellerProfileInput, UserUncheckedUpdateWithoutCourseSellerProfileInput>
  }

  export type UserUpdateWithoutCourseSellerProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    administratorProfile?: AdministratorProfileUpdateOneWithoutUserNestedInput
    courseSellerApplication?: CourseSellerApplicationUpdateOneWithoutUserNestedInput
    policy?: PolicyUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCourseSellerProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    administratorProfile?: AdministratorProfileUncheckedUpdateOneWithoutUserNestedInput
    courseSellerApplication?: CourseSellerApplicationUncheckedUpdateOneWithoutUserNestedInput
    policy?: PolicyUncheckedUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAdministratorProfileInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
    courseSellerApplication?: CourseSellerApplicationCreateNestedOneWithoutUserInput
    courseSellerProfile?: CourseSellerProfileCreateNestedOneWithoutUserInput
    policy?: PolicyCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAdministratorProfileInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
    courseSellerApplication?: CourseSellerApplicationUncheckedCreateNestedOneWithoutUserInput
    courseSellerProfile?: CourseSellerProfileUncheckedCreateNestedOneWithoutUserInput
    policy?: PolicyUncheckedCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAdministratorProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAdministratorProfileInput, UserUncheckedCreateWithoutAdministratorProfileInput>
  }

  export type UserUpsertWithoutAdministratorProfileInput = {
    update: XOR<UserUpdateWithoutAdministratorProfileInput, UserUncheckedUpdateWithoutAdministratorProfileInput>
    create: XOR<UserCreateWithoutAdministratorProfileInput, UserUncheckedCreateWithoutAdministratorProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAdministratorProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAdministratorProfileInput, UserUncheckedUpdateWithoutAdministratorProfileInput>
  }

  export type UserUpdateWithoutAdministratorProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    courseSellerApplication?: CourseSellerApplicationUpdateOneWithoutUserNestedInput
    courseSellerProfile?: CourseSellerProfileUpdateOneWithoutUserNestedInput
    policy?: PolicyUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAdministratorProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    courseSellerApplication?: CourseSellerApplicationUncheckedUpdateOneWithoutUserNestedInput
    courseSellerProfile?: CourseSellerProfileUncheckedUpdateOneWithoutUserNestedInput
    policy?: PolicyUncheckedUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutCourseSellerApplicationInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
    administratorProfile?: AdministratorProfileCreateNestedOneWithoutUserInput
    courseSellerProfile?: CourseSellerProfileCreateNestedOneWithoutUserInput
    policy?: PolicyCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCourseSellerApplicationInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
    administratorProfile?: AdministratorProfileUncheckedCreateNestedOneWithoutUserInput
    courseSellerProfile?: CourseSellerProfileUncheckedCreateNestedOneWithoutUserInput
    policy?: PolicyUncheckedCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCourseSellerApplicationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCourseSellerApplicationInput, UserUncheckedCreateWithoutCourseSellerApplicationInput>
  }

  export type UserUpsertWithoutCourseSellerApplicationInput = {
    update: XOR<UserUpdateWithoutCourseSellerApplicationInput, UserUncheckedUpdateWithoutCourseSellerApplicationInput>
    create: XOR<UserCreateWithoutCourseSellerApplicationInput, UserUncheckedCreateWithoutCourseSellerApplicationInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCourseSellerApplicationInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCourseSellerApplicationInput, UserUncheckedUpdateWithoutCourseSellerApplicationInput>
  }

  export type UserUpdateWithoutCourseSellerApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    administratorProfile?: AdministratorProfileUpdateOneWithoutUserNestedInput
    courseSellerProfile?: CourseSellerProfileUpdateOneWithoutUserNestedInput
    policy?: PolicyUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCourseSellerApplicationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    administratorProfile?: AdministratorProfileUncheckedUpdateOneWithoutUserNestedInput
    courseSellerProfile?: CourseSellerProfileUncheckedUpdateOneWithoutUserNestedInput
    policy?: PolicyUncheckedUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPolicyInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
    administratorProfile?: AdministratorProfileCreateNestedOneWithoutUserInput
    courseSellerApplication?: CourseSellerApplicationCreateNestedOneWithoutUserInput
    courseSellerProfile?: CourseSellerProfileCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPolicyInput = {
    id?: string
    email: string
    password: string
    fullName: string
    phoneNumber?: string | null
    profilePicture?: string | null
    dateOfBirth: Date | string
    createdAt?: Date | string
    englishLevel?: string | null
    learningGoals?: UserCreatelearningGoalsInput | string[]
    role?: $Enums.UserRole | null
    isEmailVerified?: boolean
    administratorProfile?: AdministratorProfileUncheckedCreateNestedOneWithoutUserInput
    courseSellerApplication?: CourseSellerApplicationUncheckedCreateNestedOneWithoutUserInput
    courseSellerProfile?: CourseSellerProfileUncheckedCreateNestedOneWithoutUserInput
    refreshTokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPolicyInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPolicyInput, UserUncheckedCreateWithoutPolicyInput>
  }

  export type UserUpsertWithoutPolicyInput = {
    update: XOR<UserUpdateWithoutPolicyInput, UserUncheckedUpdateWithoutPolicyInput>
    create: XOR<UserCreateWithoutPolicyInput, UserUncheckedCreateWithoutPolicyInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPolicyInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPolicyInput, UserUncheckedUpdateWithoutPolicyInput>
  }

  export type UserUpdateWithoutPolicyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    administratorProfile?: AdministratorProfileUpdateOneWithoutUserNestedInput
    courseSellerApplication?: CourseSellerApplicationUpdateOneWithoutUserNestedInput
    courseSellerProfile?: CourseSellerProfileUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPolicyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    profilePicture?: NullableStringFieldUpdateOperationsInput | string | null
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    englishLevel?: NullableStringFieldUpdateOperationsInput | string | null
    learningGoals?: UserUpdatelearningGoalsInput | string[]
    role?: NullableEnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole | null
    isEmailVerified?: BoolFieldUpdateOperationsInput | boolean
    administratorProfile?: AdministratorProfileUncheckedUpdateOneWithoutUserNestedInput
    courseSellerApplication?: CourseSellerApplicationUncheckedUpdateOneWithoutUserNestedInput
    courseSellerProfile?: CourseSellerProfileUncheckedUpdateOneWithoutUserNestedInput
    refreshTokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type RefreshTokenCreateManyUserInput = {
    id?: string
    hashedToken: string
    revoked?: boolean
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashedToken?: StringFieldUpdateOperationsInput | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashedToken?: StringFieldUpdateOperationsInput | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    hashedToken?: StringFieldUpdateOperationsInput | string
    revoked?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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