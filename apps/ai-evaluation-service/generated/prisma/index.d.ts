
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
 * Model WritingEvaluation
 * 
 */
export type WritingEvaluation = $Result.DefaultSelection<Prisma.$WritingEvaluationPayload>
/**
 * Model SpeakingEvaluation
 * 
 */
export type SpeakingEvaluation = $Result.DefaultSelection<Prisma.$SpeakingEvaluationPayload>
/**
 * Model UserSkillTree
 * 
 */
export type UserSkillTree = $Result.DefaultSelection<Prisma.$UserSkillTreePayload>
/**
 * Model UserLearningGoal
 * 
 */
export type UserLearningGoal = $Result.DefaultSelection<Prisma.$UserLearningGoalPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const EvaluationStatus: {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export type EvaluationStatus = (typeof EvaluationStatus)[keyof typeof EvaluationStatus]

}

export type EvaluationStatus = $Enums.EvaluationStatus

export const EvaluationStatus: typeof $Enums.EvaluationStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more WritingEvaluations
 * const writingEvaluations = await prisma.writingEvaluation.findMany()
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
   * // Fetch zero or more WritingEvaluations
   * const writingEvaluations = await prisma.writingEvaluation.findMany()
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
   * `prisma.writingEvaluation`: Exposes CRUD operations for the **WritingEvaluation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WritingEvaluations
    * const writingEvaluations = await prisma.writingEvaluation.findMany()
    * ```
    */
  get writingEvaluation(): Prisma.WritingEvaluationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.speakingEvaluation`: Exposes CRUD operations for the **SpeakingEvaluation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SpeakingEvaluations
    * const speakingEvaluations = await prisma.speakingEvaluation.findMany()
    * ```
    */
  get speakingEvaluation(): Prisma.SpeakingEvaluationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userSkillTree`: Exposes CRUD operations for the **UserSkillTree** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSkillTrees
    * const userSkillTrees = await prisma.userSkillTree.findMany()
    * ```
    */
  get userSkillTree(): Prisma.UserSkillTreeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userLearningGoal`: Exposes CRUD operations for the **UserLearningGoal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserLearningGoals
    * const userLearningGoals = await prisma.userLearningGoal.findMany()
    * ```
    */
  get userLearningGoal(): Prisma.UserLearningGoalDelegate<ExtArgs, ClientOptions>;
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
    WritingEvaluation: 'WritingEvaluation',
    SpeakingEvaluation: 'SpeakingEvaluation',
    UserSkillTree: 'UserSkillTree',
    UserLearningGoal: 'UserLearningGoal'
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
      modelProps: "writingEvaluation" | "speakingEvaluation" | "userSkillTree" | "userLearningGoal"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      WritingEvaluation: {
        payload: Prisma.$WritingEvaluationPayload<ExtArgs>
        fields: Prisma.WritingEvaluationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WritingEvaluationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WritingEvaluationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WritingEvaluationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WritingEvaluationPayload>
          }
          findFirst: {
            args: Prisma.WritingEvaluationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WritingEvaluationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WritingEvaluationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WritingEvaluationPayload>
          }
          findMany: {
            args: Prisma.WritingEvaluationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WritingEvaluationPayload>[]
          }
          create: {
            args: Prisma.WritingEvaluationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WritingEvaluationPayload>
          }
          createMany: {
            args: Prisma.WritingEvaluationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WritingEvaluationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WritingEvaluationPayload>[]
          }
          delete: {
            args: Prisma.WritingEvaluationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WritingEvaluationPayload>
          }
          update: {
            args: Prisma.WritingEvaluationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WritingEvaluationPayload>
          }
          deleteMany: {
            args: Prisma.WritingEvaluationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WritingEvaluationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WritingEvaluationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WritingEvaluationPayload>[]
          }
          upsert: {
            args: Prisma.WritingEvaluationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WritingEvaluationPayload>
          }
          aggregate: {
            args: Prisma.WritingEvaluationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWritingEvaluation>
          }
          groupBy: {
            args: Prisma.WritingEvaluationGroupByArgs<ExtArgs>
            result: $Utils.Optional<WritingEvaluationGroupByOutputType>[]
          }
          count: {
            args: Prisma.WritingEvaluationCountArgs<ExtArgs>
            result: $Utils.Optional<WritingEvaluationCountAggregateOutputType> | number
          }
        }
      }
      SpeakingEvaluation: {
        payload: Prisma.$SpeakingEvaluationPayload<ExtArgs>
        fields: Prisma.SpeakingEvaluationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpeakingEvaluationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingEvaluationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpeakingEvaluationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingEvaluationPayload>
          }
          findFirst: {
            args: Prisma.SpeakingEvaluationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingEvaluationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpeakingEvaluationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingEvaluationPayload>
          }
          findMany: {
            args: Prisma.SpeakingEvaluationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingEvaluationPayload>[]
          }
          create: {
            args: Prisma.SpeakingEvaluationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingEvaluationPayload>
          }
          createMany: {
            args: Prisma.SpeakingEvaluationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpeakingEvaluationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingEvaluationPayload>[]
          }
          delete: {
            args: Prisma.SpeakingEvaluationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingEvaluationPayload>
          }
          update: {
            args: Prisma.SpeakingEvaluationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingEvaluationPayload>
          }
          deleteMany: {
            args: Prisma.SpeakingEvaluationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SpeakingEvaluationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SpeakingEvaluationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingEvaluationPayload>[]
          }
          upsert: {
            args: Prisma.SpeakingEvaluationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpeakingEvaluationPayload>
          }
          aggregate: {
            args: Prisma.SpeakingEvaluationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpeakingEvaluation>
          }
          groupBy: {
            args: Prisma.SpeakingEvaluationGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpeakingEvaluationGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpeakingEvaluationCountArgs<ExtArgs>
            result: $Utils.Optional<SpeakingEvaluationCountAggregateOutputType> | number
          }
        }
      }
      UserSkillTree: {
        payload: Prisma.$UserSkillTreePayload<ExtArgs>
        fields: Prisma.UserSkillTreeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSkillTreeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillTreePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSkillTreeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillTreePayload>
          }
          findFirst: {
            args: Prisma.UserSkillTreeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillTreePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSkillTreeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillTreePayload>
          }
          findMany: {
            args: Prisma.UserSkillTreeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillTreePayload>[]
          }
          create: {
            args: Prisma.UserSkillTreeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillTreePayload>
          }
          createMany: {
            args: Prisma.UserSkillTreeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserSkillTreeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillTreePayload>[]
          }
          delete: {
            args: Prisma.UserSkillTreeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillTreePayload>
          }
          update: {
            args: Prisma.UserSkillTreeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillTreePayload>
          }
          deleteMany: {
            args: Prisma.UserSkillTreeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserSkillTreeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserSkillTreeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillTreePayload>[]
          }
          upsert: {
            args: Prisma.UserSkillTreeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSkillTreePayload>
          }
          aggregate: {
            args: Prisma.UserSkillTreeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserSkillTree>
          }
          groupBy: {
            args: Prisma.UserSkillTreeGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserSkillTreeGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSkillTreeCountArgs<ExtArgs>
            result: $Utils.Optional<UserSkillTreeCountAggregateOutputType> | number
          }
        }
      }
      UserLearningGoal: {
        payload: Prisma.$UserLearningGoalPayload<ExtArgs>
        fields: Prisma.UserLearningGoalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserLearningGoalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLearningGoalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserLearningGoalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLearningGoalPayload>
          }
          findFirst: {
            args: Prisma.UserLearningGoalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLearningGoalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserLearningGoalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLearningGoalPayload>
          }
          findMany: {
            args: Prisma.UserLearningGoalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLearningGoalPayload>[]
          }
          create: {
            args: Prisma.UserLearningGoalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLearningGoalPayload>
          }
          createMany: {
            args: Prisma.UserLearningGoalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserLearningGoalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLearningGoalPayload>[]
          }
          delete: {
            args: Prisma.UserLearningGoalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLearningGoalPayload>
          }
          update: {
            args: Prisma.UserLearningGoalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLearningGoalPayload>
          }
          deleteMany: {
            args: Prisma.UserLearningGoalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserLearningGoalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserLearningGoalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLearningGoalPayload>[]
          }
          upsert: {
            args: Prisma.UserLearningGoalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLearningGoalPayload>
          }
          aggregate: {
            args: Prisma.UserLearningGoalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserLearningGoal>
          }
          groupBy: {
            args: Prisma.UserLearningGoalGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserLearningGoalGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserLearningGoalCountArgs<ExtArgs>
            result: $Utils.Optional<UserLearningGoalCountAggregateOutputType> | number
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
    writingEvaluation?: WritingEvaluationOmit
    speakingEvaluation?: SpeakingEvaluationOmit
    userSkillTree?: UserSkillTreeOmit
    userLearningGoal?: UserLearningGoalOmit
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
   * Models
   */

  /**
   * Model WritingEvaluation
   */

  export type AggregateWritingEvaluation = {
    _count: WritingEvaluationCountAggregateOutputType | null
    _avg: WritingEvaluationAvgAggregateOutputType | null
    _sum: WritingEvaluationSumAggregateOutputType | null
    _min: WritingEvaluationMinAggregateOutputType | null
    _max: WritingEvaluationMaxAggregateOutputType | null
  }

  export type WritingEvaluationAvgAggregateOutputType = {
    overallBand: number | null
  }

  export type WritingEvaluationSumAggregateOutputType = {
    overallBand: number | null
  }

  export type WritingEvaluationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    sessionId: string | null
    questionId: string | null
    essayText: string | null
    overallBand: number | null
    overallFeedback: string | null
    status: $Enums.EvaluationStatus | null
    jobId: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type WritingEvaluationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    sessionId: string | null
    questionId: string | null
    essayText: string | null
    overallBand: number | null
    overallFeedback: string | null
    status: $Enums.EvaluationStatus | null
    jobId: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type WritingEvaluationCountAggregateOutputType = {
    id: number
    userId: number
    sessionId: number
    questionId: number
    essayText: number
    overallBand: number
    criteria: number
    highlightedErrors: number
    overallFeedback: number
    status: number
    jobId: number
    createdAt: number
    completedAt: number
    _all: number
  }


  export type WritingEvaluationAvgAggregateInputType = {
    overallBand?: true
  }

  export type WritingEvaluationSumAggregateInputType = {
    overallBand?: true
  }

  export type WritingEvaluationMinAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    questionId?: true
    essayText?: true
    overallBand?: true
    overallFeedback?: true
    status?: true
    jobId?: true
    createdAt?: true
    completedAt?: true
  }

  export type WritingEvaluationMaxAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    questionId?: true
    essayText?: true
    overallBand?: true
    overallFeedback?: true
    status?: true
    jobId?: true
    createdAt?: true
    completedAt?: true
  }

  export type WritingEvaluationCountAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    questionId?: true
    essayText?: true
    overallBand?: true
    criteria?: true
    highlightedErrors?: true
    overallFeedback?: true
    status?: true
    jobId?: true
    createdAt?: true
    completedAt?: true
    _all?: true
  }

  export type WritingEvaluationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WritingEvaluation to aggregate.
     */
    where?: WritingEvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WritingEvaluations to fetch.
     */
    orderBy?: WritingEvaluationOrderByWithRelationInput | WritingEvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WritingEvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WritingEvaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WritingEvaluations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WritingEvaluations
    **/
    _count?: true | WritingEvaluationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WritingEvaluationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WritingEvaluationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WritingEvaluationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WritingEvaluationMaxAggregateInputType
  }

  export type GetWritingEvaluationAggregateType<T extends WritingEvaluationAggregateArgs> = {
        [P in keyof T & keyof AggregateWritingEvaluation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWritingEvaluation[P]>
      : GetScalarType<T[P], AggregateWritingEvaluation[P]>
  }




  export type WritingEvaluationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WritingEvaluationWhereInput
    orderBy?: WritingEvaluationOrderByWithAggregationInput | WritingEvaluationOrderByWithAggregationInput[]
    by: WritingEvaluationScalarFieldEnum[] | WritingEvaluationScalarFieldEnum
    having?: WritingEvaluationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WritingEvaluationCountAggregateInputType | true
    _avg?: WritingEvaluationAvgAggregateInputType
    _sum?: WritingEvaluationSumAggregateInputType
    _min?: WritingEvaluationMinAggregateInputType
    _max?: WritingEvaluationMaxAggregateInputType
  }

  export type WritingEvaluationGroupByOutputType = {
    id: string
    userId: string
    sessionId: string | null
    questionId: string | null
    essayText: string
    overallBand: number | null
    criteria: JsonValue | null
    highlightedErrors: JsonValue | null
    overallFeedback: string | null
    status: $Enums.EvaluationStatus
    jobId: string | null
    createdAt: Date
    completedAt: Date | null
    _count: WritingEvaluationCountAggregateOutputType | null
    _avg: WritingEvaluationAvgAggregateOutputType | null
    _sum: WritingEvaluationSumAggregateOutputType | null
    _min: WritingEvaluationMinAggregateOutputType | null
    _max: WritingEvaluationMaxAggregateOutputType | null
  }

  type GetWritingEvaluationGroupByPayload<T extends WritingEvaluationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WritingEvaluationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WritingEvaluationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WritingEvaluationGroupByOutputType[P]>
            : GetScalarType<T[P], WritingEvaluationGroupByOutputType[P]>
        }
      >
    >


  export type WritingEvaluationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    questionId?: boolean
    essayText?: boolean
    overallBand?: boolean
    criteria?: boolean
    highlightedErrors?: boolean
    overallFeedback?: boolean
    status?: boolean
    jobId?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["writingEvaluation"]>

  export type WritingEvaluationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    questionId?: boolean
    essayText?: boolean
    overallBand?: boolean
    criteria?: boolean
    highlightedErrors?: boolean
    overallFeedback?: boolean
    status?: boolean
    jobId?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["writingEvaluation"]>

  export type WritingEvaluationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    questionId?: boolean
    essayText?: boolean
    overallBand?: boolean
    criteria?: boolean
    highlightedErrors?: boolean
    overallFeedback?: boolean
    status?: boolean
    jobId?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["writingEvaluation"]>

  export type WritingEvaluationSelectScalar = {
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    questionId?: boolean
    essayText?: boolean
    overallBand?: boolean
    criteria?: boolean
    highlightedErrors?: boolean
    overallFeedback?: boolean
    status?: boolean
    jobId?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }

  export type WritingEvaluationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "sessionId" | "questionId" | "essayText" | "overallBand" | "criteria" | "highlightedErrors" | "overallFeedback" | "status" | "jobId" | "createdAt" | "completedAt", ExtArgs["result"]["writingEvaluation"]>

  export type $WritingEvaluationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WritingEvaluation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      sessionId: string | null
      questionId: string | null
      essayText: string
      overallBand: number | null
      criteria: Prisma.JsonValue | null
      highlightedErrors: Prisma.JsonValue | null
      overallFeedback: string | null
      status: $Enums.EvaluationStatus
      jobId: string | null
      createdAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["writingEvaluation"]>
    composites: {}
  }

  type WritingEvaluationGetPayload<S extends boolean | null | undefined | WritingEvaluationDefaultArgs> = $Result.GetResult<Prisma.$WritingEvaluationPayload, S>

  type WritingEvaluationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WritingEvaluationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WritingEvaluationCountAggregateInputType | true
    }

  export interface WritingEvaluationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WritingEvaluation'], meta: { name: 'WritingEvaluation' } }
    /**
     * Find zero or one WritingEvaluation that matches the filter.
     * @param {WritingEvaluationFindUniqueArgs} args - Arguments to find a WritingEvaluation
     * @example
     * // Get one WritingEvaluation
     * const writingEvaluation = await prisma.writingEvaluation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WritingEvaluationFindUniqueArgs>(args: SelectSubset<T, WritingEvaluationFindUniqueArgs<ExtArgs>>): Prisma__WritingEvaluationClient<$Result.GetResult<Prisma.$WritingEvaluationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WritingEvaluation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WritingEvaluationFindUniqueOrThrowArgs} args - Arguments to find a WritingEvaluation
     * @example
     * // Get one WritingEvaluation
     * const writingEvaluation = await prisma.writingEvaluation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WritingEvaluationFindUniqueOrThrowArgs>(args: SelectSubset<T, WritingEvaluationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WritingEvaluationClient<$Result.GetResult<Prisma.$WritingEvaluationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WritingEvaluation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WritingEvaluationFindFirstArgs} args - Arguments to find a WritingEvaluation
     * @example
     * // Get one WritingEvaluation
     * const writingEvaluation = await prisma.writingEvaluation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WritingEvaluationFindFirstArgs>(args?: SelectSubset<T, WritingEvaluationFindFirstArgs<ExtArgs>>): Prisma__WritingEvaluationClient<$Result.GetResult<Prisma.$WritingEvaluationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WritingEvaluation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WritingEvaluationFindFirstOrThrowArgs} args - Arguments to find a WritingEvaluation
     * @example
     * // Get one WritingEvaluation
     * const writingEvaluation = await prisma.writingEvaluation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WritingEvaluationFindFirstOrThrowArgs>(args?: SelectSubset<T, WritingEvaluationFindFirstOrThrowArgs<ExtArgs>>): Prisma__WritingEvaluationClient<$Result.GetResult<Prisma.$WritingEvaluationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WritingEvaluations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WritingEvaluationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WritingEvaluations
     * const writingEvaluations = await prisma.writingEvaluation.findMany()
     * 
     * // Get first 10 WritingEvaluations
     * const writingEvaluations = await prisma.writingEvaluation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const writingEvaluationWithIdOnly = await prisma.writingEvaluation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WritingEvaluationFindManyArgs>(args?: SelectSubset<T, WritingEvaluationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WritingEvaluationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WritingEvaluation.
     * @param {WritingEvaluationCreateArgs} args - Arguments to create a WritingEvaluation.
     * @example
     * // Create one WritingEvaluation
     * const WritingEvaluation = await prisma.writingEvaluation.create({
     *   data: {
     *     // ... data to create a WritingEvaluation
     *   }
     * })
     * 
     */
    create<T extends WritingEvaluationCreateArgs>(args: SelectSubset<T, WritingEvaluationCreateArgs<ExtArgs>>): Prisma__WritingEvaluationClient<$Result.GetResult<Prisma.$WritingEvaluationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WritingEvaluations.
     * @param {WritingEvaluationCreateManyArgs} args - Arguments to create many WritingEvaluations.
     * @example
     * // Create many WritingEvaluations
     * const writingEvaluation = await prisma.writingEvaluation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WritingEvaluationCreateManyArgs>(args?: SelectSubset<T, WritingEvaluationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WritingEvaluations and returns the data saved in the database.
     * @param {WritingEvaluationCreateManyAndReturnArgs} args - Arguments to create many WritingEvaluations.
     * @example
     * // Create many WritingEvaluations
     * const writingEvaluation = await prisma.writingEvaluation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WritingEvaluations and only return the `id`
     * const writingEvaluationWithIdOnly = await prisma.writingEvaluation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WritingEvaluationCreateManyAndReturnArgs>(args?: SelectSubset<T, WritingEvaluationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WritingEvaluationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WritingEvaluation.
     * @param {WritingEvaluationDeleteArgs} args - Arguments to delete one WritingEvaluation.
     * @example
     * // Delete one WritingEvaluation
     * const WritingEvaluation = await prisma.writingEvaluation.delete({
     *   where: {
     *     // ... filter to delete one WritingEvaluation
     *   }
     * })
     * 
     */
    delete<T extends WritingEvaluationDeleteArgs>(args: SelectSubset<T, WritingEvaluationDeleteArgs<ExtArgs>>): Prisma__WritingEvaluationClient<$Result.GetResult<Prisma.$WritingEvaluationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WritingEvaluation.
     * @param {WritingEvaluationUpdateArgs} args - Arguments to update one WritingEvaluation.
     * @example
     * // Update one WritingEvaluation
     * const writingEvaluation = await prisma.writingEvaluation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WritingEvaluationUpdateArgs>(args: SelectSubset<T, WritingEvaluationUpdateArgs<ExtArgs>>): Prisma__WritingEvaluationClient<$Result.GetResult<Prisma.$WritingEvaluationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WritingEvaluations.
     * @param {WritingEvaluationDeleteManyArgs} args - Arguments to filter WritingEvaluations to delete.
     * @example
     * // Delete a few WritingEvaluations
     * const { count } = await prisma.writingEvaluation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WritingEvaluationDeleteManyArgs>(args?: SelectSubset<T, WritingEvaluationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WritingEvaluations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WritingEvaluationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WritingEvaluations
     * const writingEvaluation = await prisma.writingEvaluation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WritingEvaluationUpdateManyArgs>(args: SelectSubset<T, WritingEvaluationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WritingEvaluations and returns the data updated in the database.
     * @param {WritingEvaluationUpdateManyAndReturnArgs} args - Arguments to update many WritingEvaluations.
     * @example
     * // Update many WritingEvaluations
     * const writingEvaluation = await prisma.writingEvaluation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WritingEvaluations and only return the `id`
     * const writingEvaluationWithIdOnly = await prisma.writingEvaluation.updateManyAndReturn({
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
    updateManyAndReturn<T extends WritingEvaluationUpdateManyAndReturnArgs>(args: SelectSubset<T, WritingEvaluationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WritingEvaluationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WritingEvaluation.
     * @param {WritingEvaluationUpsertArgs} args - Arguments to update or create a WritingEvaluation.
     * @example
     * // Update or create a WritingEvaluation
     * const writingEvaluation = await prisma.writingEvaluation.upsert({
     *   create: {
     *     // ... data to create a WritingEvaluation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WritingEvaluation we want to update
     *   }
     * })
     */
    upsert<T extends WritingEvaluationUpsertArgs>(args: SelectSubset<T, WritingEvaluationUpsertArgs<ExtArgs>>): Prisma__WritingEvaluationClient<$Result.GetResult<Prisma.$WritingEvaluationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WritingEvaluations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WritingEvaluationCountArgs} args - Arguments to filter WritingEvaluations to count.
     * @example
     * // Count the number of WritingEvaluations
     * const count = await prisma.writingEvaluation.count({
     *   where: {
     *     // ... the filter for the WritingEvaluations we want to count
     *   }
     * })
    **/
    count<T extends WritingEvaluationCountArgs>(
      args?: Subset<T, WritingEvaluationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WritingEvaluationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WritingEvaluation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WritingEvaluationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends WritingEvaluationAggregateArgs>(args: Subset<T, WritingEvaluationAggregateArgs>): Prisma.PrismaPromise<GetWritingEvaluationAggregateType<T>>

    /**
     * Group by WritingEvaluation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WritingEvaluationGroupByArgs} args - Group by arguments.
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
      T extends WritingEvaluationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WritingEvaluationGroupByArgs['orderBy'] }
        : { orderBy?: WritingEvaluationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, WritingEvaluationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWritingEvaluationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WritingEvaluation model
   */
  readonly fields: WritingEvaluationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WritingEvaluation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WritingEvaluationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the WritingEvaluation model
   */
  interface WritingEvaluationFieldRefs {
    readonly id: FieldRef<"WritingEvaluation", 'String'>
    readonly userId: FieldRef<"WritingEvaluation", 'String'>
    readonly sessionId: FieldRef<"WritingEvaluation", 'String'>
    readonly questionId: FieldRef<"WritingEvaluation", 'String'>
    readonly essayText: FieldRef<"WritingEvaluation", 'String'>
    readonly overallBand: FieldRef<"WritingEvaluation", 'Float'>
    readonly criteria: FieldRef<"WritingEvaluation", 'Json'>
    readonly highlightedErrors: FieldRef<"WritingEvaluation", 'Json'>
    readonly overallFeedback: FieldRef<"WritingEvaluation", 'String'>
    readonly status: FieldRef<"WritingEvaluation", 'EvaluationStatus'>
    readonly jobId: FieldRef<"WritingEvaluation", 'String'>
    readonly createdAt: FieldRef<"WritingEvaluation", 'DateTime'>
    readonly completedAt: FieldRef<"WritingEvaluation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WritingEvaluation findUnique
   */
  export type WritingEvaluationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WritingEvaluation
     */
    select?: WritingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WritingEvaluation
     */
    omit?: WritingEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which WritingEvaluation to fetch.
     */
    where: WritingEvaluationWhereUniqueInput
  }

  /**
   * WritingEvaluation findUniqueOrThrow
   */
  export type WritingEvaluationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WritingEvaluation
     */
    select?: WritingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WritingEvaluation
     */
    omit?: WritingEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which WritingEvaluation to fetch.
     */
    where: WritingEvaluationWhereUniqueInput
  }

  /**
   * WritingEvaluation findFirst
   */
  export type WritingEvaluationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WritingEvaluation
     */
    select?: WritingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WritingEvaluation
     */
    omit?: WritingEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which WritingEvaluation to fetch.
     */
    where?: WritingEvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WritingEvaluations to fetch.
     */
    orderBy?: WritingEvaluationOrderByWithRelationInput | WritingEvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WritingEvaluations.
     */
    cursor?: WritingEvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WritingEvaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WritingEvaluations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WritingEvaluations.
     */
    distinct?: WritingEvaluationScalarFieldEnum | WritingEvaluationScalarFieldEnum[]
  }

  /**
   * WritingEvaluation findFirstOrThrow
   */
  export type WritingEvaluationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WritingEvaluation
     */
    select?: WritingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WritingEvaluation
     */
    omit?: WritingEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which WritingEvaluation to fetch.
     */
    where?: WritingEvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WritingEvaluations to fetch.
     */
    orderBy?: WritingEvaluationOrderByWithRelationInput | WritingEvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WritingEvaluations.
     */
    cursor?: WritingEvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WritingEvaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WritingEvaluations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WritingEvaluations.
     */
    distinct?: WritingEvaluationScalarFieldEnum | WritingEvaluationScalarFieldEnum[]
  }

  /**
   * WritingEvaluation findMany
   */
  export type WritingEvaluationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WritingEvaluation
     */
    select?: WritingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WritingEvaluation
     */
    omit?: WritingEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which WritingEvaluations to fetch.
     */
    where?: WritingEvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WritingEvaluations to fetch.
     */
    orderBy?: WritingEvaluationOrderByWithRelationInput | WritingEvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WritingEvaluations.
     */
    cursor?: WritingEvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WritingEvaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WritingEvaluations.
     */
    skip?: number
    distinct?: WritingEvaluationScalarFieldEnum | WritingEvaluationScalarFieldEnum[]
  }

  /**
   * WritingEvaluation create
   */
  export type WritingEvaluationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WritingEvaluation
     */
    select?: WritingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WritingEvaluation
     */
    omit?: WritingEvaluationOmit<ExtArgs> | null
    /**
     * The data needed to create a WritingEvaluation.
     */
    data: XOR<WritingEvaluationCreateInput, WritingEvaluationUncheckedCreateInput>
  }

  /**
   * WritingEvaluation createMany
   */
  export type WritingEvaluationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WritingEvaluations.
     */
    data: WritingEvaluationCreateManyInput | WritingEvaluationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WritingEvaluation createManyAndReturn
   */
  export type WritingEvaluationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WritingEvaluation
     */
    select?: WritingEvaluationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WritingEvaluation
     */
    omit?: WritingEvaluationOmit<ExtArgs> | null
    /**
     * The data used to create many WritingEvaluations.
     */
    data: WritingEvaluationCreateManyInput | WritingEvaluationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WritingEvaluation update
   */
  export type WritingEvaluationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WritingEvaluation
     */
    select?: WritingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WritingEvaluation
     */
    omit?: WritingEvaluationOmit<ExtArgs> | null
    /**
     * The data needed to update a WritingEvaluation.
     */
    data: XOR<WritingEvaluationUpdateInput, WritingEvaluationUncheckedUpdateInput>
    /**
     * Choose, which WritingEvaluation to update.
     */
    where: WritingEvaluationWhereUniqueInput
  }

  /**
   * WritingEvaluation updateMany
   */
  export type WritingEvaluationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WritingEvaluations.
     */
    data: XOR<WritingEvaluationUpdateManyMutationInput, WritingEvaluationUncheckedUpdateManyInput>
    /**
     * Filter which WritingEvaluations to update
     */
    where?: WritingEvaluationWhereInput
    /**
     * Limit how many WritingEvaluations to update.
     */
    limit?: number
  }

  /**
   * WritingEvaluation updateManyAndReturn
   */
  export type WritingEvaluationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WritingEvaluation
     */
    select?: WritingEvaluationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WritingEvaluation
     */
    omit?: WritingEvaluationOmit<ExtArgs> | null
    /**
     * The data used to update WritingEvaluations.
     */
    data: XOR<WritingEvaluationUpdateManyMutationInput, WritingEvaluationUncheckedUpdateManyInput>
    /**
     * Filter which WritingEvaluations to update
     */
    where?: WritingEvaluationWhereInput
    /**
     * Limit how many WritingEvaluations to update.
     */
    limit?: number
  }

  /**
   * WritingEvaluation upsert
   */
  export type WritingEvaluationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WritingEvaluation
     */
    select?: WritingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WritingEvaluation
     */
    omit?: WritingEvaluationOmit<ExtArgs> | null
    /**
     * The filter to search for the WritingEvaluation to update in case it exists.
     */
    where: WritingEvaluationWhereUniqueInput
    /**
     * In case the WritingEvaluation found by the `where` argument doesn't exist, create a new WritingEvaluation with this data.
     */
    create: XOR<WritingEvaluationCreateInput, WritingEvaluationUncheckedCreateInput>
    /**
     * In case the WritingEvaluation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WritingEvaluationUpdateInput, WritingEvaluationUncheckedUpdateInput>
  }

  /**
   * WritingEvaluation delete
   */
  export type WritingEvaluationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WritingEvaluation
     */
    select?: WritingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WritingEvaluation
     */
    omit?: WritingEvaluationOmit<ExtArgs> | null
    /**
     * Filter which WritingEvaluation to delete.
     */
    where: WritingEvaluationWhereUniqueInput
  }

  /**
   * WritingEvaluation deleteMany
   */
  export type WritingEvaluationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WritingEvaluations to delete
     */
    where?: WritingEvaluationWhereInput
    /**
     * Limit how many WritingEvaluations to delete.
     */
    limit?: number
  }

  /**
   * WritingEvaluation without action
   */
  export type WritingEvaluationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WritingEvaluation
     */
    select?: WritingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WritingEvaluation
     */
    omit?: WritingEvaluationOmit<ExtArgs> | null
  }


  /**
   * Model SpeakingEvaluation
   */

  export type AggregateSpeakingEvaluation = {
    _count: SpeakingEvaluationCountAggregateOutputType | null
    _avg: SpeakingEvaluationAvgAggregateOutputType | null
    _sum: SpeakingEvaluationSumAggregateOutputType | null
    _min: SpeakingEvaluationMinAggregateOutputType | null
    _max: SpeakingEvaluationMaxAggregateOutputType | null
  }

  export type SpeakingEvaluationAvgAggregateOutputType = {
    duration: number | null
    overallBand: number | null
    pronunciationScore: number | null
    fluencyScore: number | null
    vocabScore: number | null
    grammarScore: number | null
  }

  export type SpeakingEvaluationSumAggregateOutputType = {
    duration: number | null
    overallBand: number | null
    pronunciationScore: number | null
    fluencyScore: number | null
    vocabScore: number | null
    grammarScore: number | null
  }

  export type SpeakingEvaluationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    sessionId: string | null
    questionId: string | null
    audioUrl: string | null
    transcript: string | null
    duration: number | null
    overallBand: number | null
    pronunciationScore: number | null
    fluencyScore: number | null
    vocabScore: number | null
    grammarScore: number | null
    feedback: string | null
    status: $Enums.EvaluationStatus | null
    jobId: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type SpeakingEvaluationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    sessionId: string | null
    questionId: string | null
    audioUrl: string | null
    transcript: string | null
    duration: number | null
    overallBand: number | null
    pronunciationScore: number | null
    fluencyScore: number | null
    vocabScore: number | null
    grammarScore: number | null
    feedback: string | null
    status: $Enums.EvaluationStatus | null
    jobId: string | null
    createdAt: Date | null
    completedAt: Date | null
  }

  export type SpeakingEvaluationCountAggregateOutputType = {
    id: number
    userId: number
    sessionId: number
    questionId: number
    audioUrl: number
    transcript: number
    duration: number
    overallBand: number
    pronunciationScore: number
    fluencyScore: number
    vocabScore: number
    grammarScore: number
    feedback: number
    status: number
    jobId: number
    createdAt: number
    completedAt: number
    _all: number
  }


  export type SpeakingEvaluationAvgAggregateInputType = {
    duration?: true
    overallBand?: true
    pronunciationScore?: true
    fluencyScore?: true
    vocabScore?: true
    grammarScore?: true
  }

  export type SpeakingEvaluationSumAggregateInputType = {
    duration?: true
    overallBand?: true
    pronunciationScore?: true
    fluencyScore?: true
    vocabScore?: true
    grammarScore?: true
  }

  export type SpeakingEvaluationMinAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    questionId?: true
    audioUrl?: true
    transcript?: true
    duration?: true
    overallBand?: true
    pronunciationScore?: true
    fluencyScore?: true
    vocabScore?: true
    grammarScore?: true
    feedback?: true
    status?: true
    jobId?: true
    createdAt?: true
    completedAt?: true
  }

  export type SpeakingEvaluationMaxAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    questionId?: true
    audioUrl?: true
    transcript?: true
    duration?: true
    overallBand?: true
    pronunciationScore?: true
    fluencyScore?: true
    vocabScore?: true
    grammarScore?: true
    feedback?: true
    status?: true
    jobId?: true
    createdAt?: true
    completedAt?: true
  }

  export type SpeakingEvaluationCountAggregateInputType = {
    id?: true
    userId?: true
    sessionId?: true
    questionId?: true
    audioUrl?: true
    transcript?: true
    duration?: true
    overallBand?: true
    pronunciationScore?: true
    fluencyScore?: true
    vocabScore?: true
    grammarScore?: true
    feedback?: true
    status?: true
    jobId?: true
    createdAt?: true
    completedAt?: true
    _all?: true
  }

  export type SpeakingEvaluationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpeakingEvaluation to aggregate.
     */
    where?: SpeakingEvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpeakingEvaluations to fetch.
     */
    orderBy?: SpeakingEvaluationOrderByWithRelationInput | SpeakingEvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpeakingEvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpeakingEvaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpeakingEvaluations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SpeakingEvaluations
    **/
    _count?: true | SpeakingEvaluationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SpeakingEvaluationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SpeakingEvaluationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpeakingEvaluationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpeakingEvaluationMaxAggregateInputType
  }

  export type GetSpeakingEvaluationAggregateType<T extends SpeakingEvaluationAggregateArgs> = {
        [P in keyof T & keyof AggregateSpeakingEvaluation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpeakingEvaluation[P]>
      : GetScalarType<T[P], AggregateSpeakingEvaluation[P]>
  }




  export type SpeakingEvaluationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpeakingEvaluationWhereInput
    orderBy?: SpeakingEvaluationOrderByWithAggregationInput | SpeakingEvaluationOrderByWithAggregationInput[]
    by: SpeakingEvaluationScalarFieldEnum[] | SpeakingEvaluationScalarFieldEnum
    having?: SpeakingEvaluationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpeakingEvaluationCountAggregateInputType | true
    _avg?: SpeakingEvaluationAvgAggregateInputType
    _sum?: SpeakingEvaluationSumAggregateInputType
    _min?: SpeakingEvaluationMinAggregateInputType
    _max?: SpeakingEvaluationMaxAggregateInputType
  }

  export type SpeakingEvaluationGroupByOutputType = {
    id: string
    userId: string
    sessionId: string | null
    questionId: string | null
    audioUrl: string
    transcript: string | null
    duration: number | null
    overallBand: number | null
    pronunciationScore: number | null
    fluencyScore: number | null
    vocabScore: number | null
    grammarScore: number | null
    feedback: string | null
    status: $Enums.EvaluationStatus
    jobId: string | null
    createdAt: Date
    completedAt: Date | null
    _count: SpeakingEvaluationCountAggregateOutputType | null
    _avg: SpeakingEvaluationAvgAggregateOutputType | null
    _sum: SpeakingEvaluationSumAggregateOutputType | null
    _min: SpeakingEvaluationMinAggregateOutputType | null
    _max: SpeakingEvaluationMaxAggregateOutputType | null
  }

  type GetSpeakingEvaluationGroupByPayload<T extends SpeakingEvaluationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpeakingEvaluationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpeakingEvaluationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpeakingEvaluationGroupByOutputType[P]>
            : GetScalarType<T[P], SpeakingEvaluationGroupByOutputType[P]>
        }
      >
    >


  export type SpeakingEvaluationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    questionId?: boolean
    audioUrl?: boolean
    transcript?: boolean
    duration?: boolean
    overallBand?: boolean
    pronunciationScore?: boolean
    fluencyScore?: boolean
    vocabScore?: boolean
    grammarScore?: boolean
    feedback?: boolean
    status?: boolean
    jobId?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["speakingEvaluation"]>

  export type SpeakingEvaluationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    questionId?: boolean
    audioUrl?: boolean
    transcript?: boolean
    duration?: boolean
    overallBand?: boolean
    pronunciationScore?: boolean
    fluencyScore?: boolean
    vocabScore?: boolean
    grammarScore?: boolean
    feedback?: boolean
    status?: boolean
    jobId?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["speakingEvaluation"]>

  export type SpeakingEvaluationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    questionId?: boolean
    audioUrl?: boolean
    transcript?: boolean
    duration?: boolean
    overallBand?: boolean
    pronunciationScore?: boolean
    fluencyScore?: boolean
    vocabScore?: boolean
    grammarScore?: boolean
    feedback?: boolean
    status?: boolean
    jobId?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }, ExtArgs["result"]["speakingEvaluation"]>

  export type SpeakingEvaluationSelectScalar = {
    id?: boolean
    userId?: boolean
    sessionId?: boolean
    questionId?: boolean
    audioUrl?: boolean
    transcript?: boolean
    duration?: boolean
    overallBand?: boolean
    pronunciationScore?: boolean
    fluencyScore?: boolean
    vocabScore?: boolean
    grammarScore?: boolean
    feedback?: boolean
    status?: boolean
    jobId?: boolean
    createdAt?: boolean
    completedAt?: boolean
  }

  export type SpeakingEvaluationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "sessionId" | "questionId" | "audioUrl" | "transcript" | "duration" | "overallBand" | "pronunciationScore" | "fluencyScore" | "vocabScore" | "grammarScore" | "feedback" | "status" | "jobId" | "createdAt" | "completedAt", ExtArgs["result"]["speakingEvaluation"]>

  export type $SpeakingEvaluationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SpeakingEvaluation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      sessionId: string | null
      questionId: string | null
      audioUrl: string
      transcript: string | null
      duration: number | null
      overallBand: number | null
      pronunciationScore: number | null
      fluencyScore: number | null
      vocabScore: number | null
      grammarScore: number | null
      feedback: string | null
      status: $Enums.EvaluationStatus
      jobId: string | null
      createdAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["speakingEvaluation"]>
    composites: {}
  }

  type SpeakingEvaluationGetPayload<S extends boolean | null | undefined | SpeakingEvaluationDefaultArgs> = $Result.GetResult<Prisma.$SpeakingEvaluationPayload, S>

  type SpeakingEvaluationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SpeakingEvaluationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SpeakingEvaluationCountAggregateInputType | true
    }

  export interface SpeakingEvaluationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SpeakingEvaluation'], meta: { name: 'SpeakingEvaluation' } }
    /**
     * Find zero or one SpeakingEvaluation that matches the filter.
     * @param {SpeakingEvaluationFindUniqueArgs} args - Arguments to find a SpeakingEvaluation
     * @example
     * // Get one SpeakingEvaluation
     * const speakingEvaluation = await prisma.speakingEvaluation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SpeakingEvaluationFindUniqueArgs>(args: SelectSubset<T, SpeakingEvaluationFindUniqueArgs<ExtArgs>>): Prisma__SpeakingEvaluationClient<$Result.GetResult<Prisma.$SpeakingEvaluationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SpeakingEvaluation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SpeakingEvaluationFindUniqueOrThrowArgs} args - Arguments to find a SpeakingEvaluation
     * @example
     * // Get one SpeakingEvaluation
     * const speakingEvaluation = await prisma.speakingEvaluation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SpeakingEvaluationFindUniqueOrThrowArgs>(args: SelectSubset<T, SpeakingEvaluationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SpeakingEvaluationClient<$Result.GetResult<Prisma.$SpeakingEvaluationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpeakingEvaluation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingEvaluationFindFirstArgs} args - Arguments to find a SpeakingEvaluation
     * @example
     * // Get one SpeakingEvaluation
     * const speakingEvaluation = await prisma.speakingEvaluation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SpeakingEvaluationFindFirstArgs>(args?: SelectSubset<T, SpeakingEvaluationFindFirstArgs<ExtArgs>>): Prisma__SpeakingEvaluationClient<$Result.GetResult<Prisma.$SpeakingEvaluationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpeakingEvaluation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingEvaluationFindFirstOrThrowArgs} args - Arguments to find a SpeakingEvaluation
     * @example
     * // Get one SpeakingEvaluation
     * const speakingEvaluation = await prisma.speakingEvaluation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SpeakingEvaluationFindFirstOrThrowArgs>(args?: SelectSubset<T, SpeakingEvaluationFindFirstOrThrowArgs<ExtArgs>>): Prisma__SpeakingEvaluationClient<$Result.GetResult<Prisma.$SpeakingEvaluationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SpeakingEvaluations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingEvaluationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SpeakingEvaluations
     * const speakingEvaluations = await prisma.speakingEvaluation.findMany()
     * 
     * // Get first 10 SpeakingEvaluations
     * const speakingEvaluations = await prisma.speakingEvaluation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const speakingEvaluationWithIdOnly = await prisma.speakingEvaluation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SpeakingEvaluationFindManyArgs>(args?: SelectSubset<T, SpeakingEvaluationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakingEvaluationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SpeakingEvaluation.
     * @param {SpeakingEvaluationCreateArgs} args - Arguments to create a SpeakingEvaluation.
     * @example
     * // Create one SpeakingEvaluation
     * const SpeakingEvaluation = await prisma.speakingEvaluation.create({
     *   data: {
     *     // ... data to create a SpeakingEvaluation
     *   }
     * })
     * 
     */
    create<T extends SpeakingEvaluationCreateArgs>(args: SelectSubset<T, SpeakingEvaluationCreateArgs<ExtArgs>>): Prisma__SpeakingEvaluationClient<$Result.GetResult<Prisma.$SpeakingEvaluationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SpeakingEvaluations.
     * @param {SpeakingEvaluationCreateManyArgs} args - Arguments to create many SpeakingEvaluations.
     * @example
     * // Create many SpeakingEvaluations
     * const speakingEvaluation = await prisma.speakingEvaluation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SpeakingEvaluationCreateManyArgs>(args?: SelectSubset<T, SpeakingEvaluationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SpeakingEvaluations and returns the data saved in the database.
     * @param {SpeakingEvaluationCreateManyAndReturnArgs} args - Arguments to create many SpeakingEvaluations.
     * @example
     * // Create many SpeakingEvaluations
     * const speakingEvaluation = await prisma.speakingEvaluation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SpeakingEvaluations and only return the `id`
     * const speakingEvaluationWithIdOnly = await prisma.speakingEvaluation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SpeakingEvaluationCreateManyAndReturnArgs>(args?: SelectSubset<T, SpeakingEvaluationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakingEvaluationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SpeakingEvaluation.
     * @param {SpeakingEvaluationDeleteArgs} args - Arguments to delete one SpeakingEvaluation.
     * @example
     * // Delete one SpeakingEvaluation
     * const SpeakingEvaluation = await prisma.speakingEvaluation.delete({
     *   where: {
     *     // ... filter to delete one SpeakingEvaluation
     *   }
     * })
     * 
     */
    delete<T extends SpeakingEvaluationDeleteArgs>(args: SelectSubset<T, SpeakingEvaluationDeleteArgs<ExtArgs>>): Prisma__SpeakingEvaluationClient<$Result.GetResult<Prisma.$SpeakingEvaluationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SpeakingEvaluation.
     * @param {SpeakingEvaluationUpdateArgs} args - Arguments to update one SpeakingEvaluation.
     * @example
     * // Update one SpeakingEvaluation
     * const speakingEvaluation = await prisma.speakingEvaluation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SpeakingEvaluationUpdateArgs>(args: SelectSubset<T, SpeakingEvaluationUpdateArgs<ExtArgs>>): Prisma__SpeakingEvaluationClient<$Result.GetResult<Prisma.$SpeakingEvaluationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SpeakingEvaluations.
     * @param {SpeakingEvaluationDeleteManyArgs} args - Arguments to filter SpeakingEvaluations to delete.
     * @example
     * // Delete a few SpeakingEvaluations
     * const { count } = await prisma.speakingEvaluation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SpeakingEvaluationDeleteManyArgs>(args?: SelectSubset<T, SpeakingEvaluationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpeakingEvaluations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingEvaluationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SpeakingEvaluations
     * const speakingEvaluation = await prisma.speakingEvaluation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SpeakingEvaluationUpdateManyArgs>(args: SelectSubset<T, SpeakingEvaluationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpeakingEvaluations and returns the data updated in the database.
     * @param {SpeakingEvaluationUpdateManyAndReturnArgs} args - Arguments to update many SpeakingEvaluations.
     * @example
     * // Update many SpeakingEvaluations
     * const speakingEvaluation = await prisma.speakingEvaluation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SpeakingEvaluations and only return the `id`
     * const speakingEvaluationWithIdOnly = await prisma.speakingEvaluation.updateManyAndReturn({
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
    updateManyAndReturn<T extends SpeakingEvaluationUpdateManyAndReturnArgs>(args: SelectSubset<T, SpeakingEvaluationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpeakingEvaluationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SpeakingEvaluation.
     * @param {SpeakingEvaluationUpsertArgs} args - Arguments to update or create a SpeakingEvaluation.
     * @example
     * // Update or create a SpeakingEvaluation
     * const speakingEvaluation = await prisma.speakingEvaluation.upsert({
     *   create: {
     *     // ... data to create a SpeakingEvaluation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SpeakingEvaluation we want to update
     *   }
     * })
     */
    upsert<T extends SpeakingEvaluationUpsertArgs>(args: SelectSubset<T, SpeakingEvaluationUpsertArgs<ExtArgs>>): Prisma__SpeakingEvaluationClient<$Result.GetResult<Prisma.$SpeakingEvaluationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SpeakingEvaluations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingEvaluationCountArgs} args - Arguments to filter SpeakingEvaluations to count.
     * @example
     * // Count the number of SpeakingEvaluations
     * const count = await prisma.speakingEvaluation.count({
     *   where: {
     *     // ... the filter for the SpeakingEvaluations we want to count
     *   }
     * })
    **/
    count<T extends SpeakingEvaluationCountArgs>(
      args?: Subset<T, SpeakingEvaluationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpeakingEvaluationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SpeakingEvaluation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingEvaluationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SpeakingEvaluationAggregateArgs>(args: Subset<T, SpeakingEvaluationAggregateArgs>): Prisma.PrismaPromise<GetSpeakingEvaluationAggregateType<T>>

    /**
     * Group by SpeakingEvaluation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpeakingEvaluationGroupByArgs} args - Group by arguments.
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
      T extends SpeakingEvaluationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpeakingEvaluationGroupByArgs['orderBy'] }
        : { orderBy?: SpeakingEvaluationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SpeakingEvaluationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpeakingEvaluationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SpeakingEvaluation model
   */
  readonly fields: SpeakingEvaluationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SpeakingEvaluation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpeakingEvaluationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the SpeakingEvaluation model
   */
  interface SpeakingEvaluationFieldRefs {
    readonly id: FieldRef<"SpeakingEvaluation", 'String'>
    readonly userId: FieldRef<"SpeakingEvaluation", 'String'>
    readonly sessionId: FieldRef<"SpeakingEvaluation", 'String'>
    readonly questionId: FieldRef<"SpeakingEvaluation", 'String'>
    readonly audioUrl: FieldRef<"SpeakingEvaluation", 'String'>
    readonly transcript: FieldRef<"SpeakingEvaluation", 'String'>
    readonly duration: FieldRef<"SpeakingEvaluation", 'Float'>
    readonly overallBand: FieldRef<"SpeakingEvaluation", 'Float'>
    readonly pronunciationScore: FieldRef<"SpeakingEvaluation", 'Float'>
    readonly fluencyScore: FieldRef<"SpeakingEvaluation", 'Float'>
    readonly vocabScore: FieldRef<"SpeakingEvaluation", 'Float'>
    readonly grammarScore: FieldRef<"SpeakingEvaluation", 'Float'>
    readonly feedback: FieldRef<"SpeakingEvaluation", 'String'>
    readonly status: FieldRef<"SpeakingEvaluation", 'EvaluationStatus'>
    readonly jobId: FieldRef<"SpeakingEvaluation", 'String'>
    readonly createdAt: FieldRef<"SpeakingEvaluation", 'DateTime'>
    readonly completedAt: FieldRef<"SpeakingEvaluation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SpeakingEvaluation findUnique
   */
  export type SpeakingEvaluationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakingEvaluation
     */
    select?: SpeakingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpeakingEvaluation
     */
    omit?: SpeakingEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which SpeakingEvaluation to fetch.
     */
    where: SpeakingEvaluationWhereUniqueInput
  }

  /**
   * SpeakingEvaluation findUniqueOrThrow
   */
  export type SpeakingEvaluationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakingEvaluation
     */
    select?: SpeakingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpeakingEvaluation
     */
    omit?: SpeakingEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which SpeakingEvaluation to fetch.
     */
    where: SpeakingEvaluationWhereUniqueInput
  }

  /**
   * SpeakingEvaluation findFirst
   */
  export type SpeakingEvaluationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakingEvaluation
     */
    select?: SpeakingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpeakingEvaluation
     */
    omit?: SpeakingEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which SpeakingEvaluation to fetch.
     */
    where?: SpeakingEvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpeakingEvaluations to fetch.
     */
    orderBy?: SpeakingEvaluationOrderByWithRelationInput | SpeakingEvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpeakingEvaluations.
     */
    cursor?: SpeakingEvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpeakingEvaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpeakingEvaluations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpeakingEvaluations.
     */
    distinct?: SpeakingEvaluationScalarFieldEnum | SpeakingEvaluationScalarFieldEnum[]
  }

  /**
   * SpeakingEvaluation findFirstOrThrow
   */
  export type SpeakingEvaluationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakingEvaluation
     */
    select?: SpeakingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpeakingEvaluation
     */
    omit?: SpeakingEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which SpeakingEvaluation to fetch.
     */
    where?: SpeakingEvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpeakingEvaluations to fetch.
     */
    orderBy?: SpeakingEvaluationOrderByWithRelationInput | SpeakingEvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpeakingEvaluations.
     */
    cursor?: SpeakingEvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpeakingEvaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpeakingEvaluations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpeakingEvaluations.
     */
    distinct?: SpeakingEvaluationScalarFieldEnum | SpeakingEvaluationScalarFieldEnum[]
  }

  /**
   * SpeakingEvaluation findMany
   */
  export type SpeakingEvaluationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakingEvaluation
     */
    select?: SpeakingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpeakingEvaluation
     */
    omit?: SpeakingEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which SpeakingEvaluations to fetch.
     */
    where?: SpeakingEvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpeakingEvaluations to fetch.
     */
    orderBy?: SpeakingEvaluationOrderByWithRelationInput | SpeakingEvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SpeakingEvaluations.
     */
    cursor?: SpeakingEvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpeakingEvaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpeakingEvaluations.
     */
    skip?: number
    distinct?: SpeakingEvaluationScalarFieldEnum | SpeakingEvaluationScalarFieldEnum[]
  }

  /**
   * SpeakingEvaluation create
   */
  export type SpeakingEvaluationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakingEvaluation
     */
    select?: SpeakingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpeakingEvaluation
     */
    omit?: SpeakingEvaluationOmit<ExtArgs> | null
    /**
     * The data needed to create a SpeakingEvaluation.
     */
    data: XOR<SpeakingEvaluationCreateInput, SpeakingEvaluationUncheckedCreateInput>
  }

  /**
   * SpeakingEvaluation createMany
   */
  export type SpeakingEvaluationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SpeakingEvaluations.
     */
    data: SpeakingEvaluationCreateManyInput | SpeakingEvaluationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpeakingEvaluation createManyAndReturn
   */
  export type SpeakingEvaluationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakingEvaluation
     */
    select?: SpeakingEvaluationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpeakingEvaluation
     */
    omit?: SpeakingEvaluationOmit<ExtArgs> | null
    /**
     * The data used to create many SpeakingEvaluations.
     */
    data: SpeakingEvaluationCreateManyInput | SpeakingEvaluationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpeakingEvaluation update
   */
  export type SpeakingEvaluationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakingEvaluation
     */
    select?: SpeakingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpeakingEvaluation
     */
    omit?: SpeakingEvaluationOmit<ExtArgs> | null
    /**
     * The data needed to update a SpeakingEvaluation.
     */
    data: XOR<SpeakingEvaluationUpdateInput, SpeakingEvaluationUncheckedUpdateInput>
    /**
     * Choose, which SpeakingEvaluation to update.
     */
    where: SpeakingEvaluationWhereUniqueInput
  }

  /**
   * SpeakingEvaluation updateMany
   */
  export type SpeakingEvaluationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SpeakingEvaluations.
     */
    data: XOR<SpeakingEvaluationUpdateManyMutationInput, SpeakingEvaluationUncheckedUpdateManyInput>
    /**
     * Filter which SpeakingEvaluations to update
     */
    where?: SpeakingEvaluationWhereInput
    /**
     * Limit how many SpeakingEvaluations to update.
     */
    limit?: number
  }

  /**
   * SpeakingEvaluation updateManyAndReturn
   */
  export type SpeakingEvaluationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakingEvaluation
     */
    select?: SpeakingEvaluationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpeakingEvaluation
     */
    omit?: SpeakingEvaluationOmit<ExtArgs> | null
    /**
     * The data used to update SpeakingEvaluations.
     */
    data: XOR<SpeakingEvaluationUpdateManyMutationInput, SpeakingEvaluationUncheckedUpdateManyInput>
    /**
     * Filter which SpeakingEvaluations to update
     */
    where?: SpeakingEvaluationWhereInput
    /**
     * Limit how many SpeakingEvaluations to update.
     */
    limit?: number
  }

  /**
   * SpeakingEvaluation upsert
   */
  export type SpeakingEvaluationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakingEvaluation
     */
    select?: SpeakingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpeakingEvaluation
     */
    omit?: SpeakingEvaluationOmit<ExtArgs> | null
    /**
     * The filter to search for the SpeakingEvaluation to update in case it exists.
     */
    where: SpeakingEvaluationWhereUniqueInput
    /**
     * In case the SpeakingEvaluation found by the `where` argument doesn't exist, create a new SpeakingEvaluation with this data.
     */
    create: XOR<SpeakingEvaluationCreateInput, SpeakingEvaluationUncheckedCreateInput>
    /**
     * In case the SpeakingEvaluation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpeakingEvaluationUpdateInput, SpeakingEvaluationUncheckedUpdateInput>
  }

  /**
   * SpeakingEvaluation delete
   */
  export type SpeakingEvaluationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakingEvaluation
     */
    select?: SpeakingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpeakingEvaluation
     */
    omit?: SpeakingEvaluationOmit<ExtArgs> | null
    /**
     * Filter which SpeakingEvaluation to delete.
     */
    where: SpeakingEvaluationWhereUniqueInput
  }

  /**
   * SpeakingEvaluation deleteMany
   */
  export type SpeakingEvaluationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpeakingEvaluations to delete
     */
    where?: SpeakingEvaluationWhereInput
    /**
     * Limit how many SpeakingEvaluations to delete.
     */
    limit?: number
  }

  /**
   * SpeakingEvaluation without action
   */
  export type SpeakingEvaluationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpeakingEvaluation
     */
    select?: SpeakingEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpeakingEvaluation
     */
    omit?: SpeakingEvaluationOmit<ExtArgs> | null
  }


  /**
   * Model UserSkillTree
   */

  export type AggregateUserSkillTree = {
    _count: UserSkillTreeCountAggregateOutputType | null
    _min: UserSkillTreeMinAggregateOutputType | null
    _max: UserSkillTreeMaxAggregateOutputType | null
  }

  export type UserSkillTreeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type UserSkillTreeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type UserSkillTreeCountAggregateOutputType = {
    id: number
    userId: number
    nodes: number
    edges: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type UserSkillTreeMinAggregateInputType = {
    id?: true
    userId?: true
    updatedAt?: true
    createdAt?: true
  }

  export type UserSkillTreeMaxAggregateInputType = {
    id?: true
    userId?: true
    updatedAt?: true
    createdAt?: true
  }

  export type UserSkillTreeCountAggregateInputType = {
    id?: true
    userId?: true
    nodes?: true
    edges?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type UserSkillTreeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSkillTree to aggregate.
     */
    where?: UserSkillTreeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSkillTrees to fetch.
     */
    orderBy?: UserSkillTreeOrderByWithRelationInput | UserSkillTreeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSkillTreeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSkillTrees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSkillTrees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSkillTrees
    **/
    _count?: true | UserSkillTreeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSkillTreeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSkillTreeMaxAggregateInputType
  }

  export type GetUserSkillTreeAggregateType<T extends UserSkillTreeAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSkillTree]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSkillTree[P]>
      : GetScalarType<T[P], AggregateUserSkillTree[P]>
  }




  export type UserSkillTreeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSkillTreeWhereInput
    orderBy?: UserSkillTreeOrderByWithAggregationInput | UserSkillTreeOrderByWithAggregationInput[]
    by: UserSkillTreeScalarFieldEnum[] | UserSkillTreeScalarFieldEnum
    having?: UserSkillTreeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSkillTreeCountAggregateInputType | true
    _min?: UserSkillTreeMinAggregateInputType
    _max?: UserSkillTreeMaxAggregateInputType
  }

  export type UserSkillTreeGroupByOutputType = {
    id: string
    userId: string
    nodes: JsonValue
    edges: JsonValue
    updatedAt: Date
    createdAt: Date
    _count: UserSkillTreeCountAggregateOutputType | null
    _min: UserSkillTreeMinAggregateOutputType | null
    _max: UserSkillTreeMaxAggregateOutputType | null
  }

  type GetUserSkillTreeGroupByPayload<T extends UserSkillTreeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSkillTreeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSkillTreeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSkillTreeGroupByOutputType[P]>
            : GetScalarType<T[P], UserSkillTreeGroupByOutputType[P]>
        }
      >
    >


  export type UserSkillTreeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nodes?: boolean
    edges?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userSkillTree"]>

  export type UserSkillTreeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nodes?: boolean
    edges?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userSkillTree"]>

  export type UserSkillTreeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    nodes?: boolean
    edges?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userSkillTree"]>

  export type UserSkillTreeSelectScalar = {
    id?: boolean
    userId?: boolean
    nodes?: boolean
    edges?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }

  export type UserSkillTreeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "nodes" | "edges" | "updatedAt" | "createdAt", ExtArgs["result"]["userSkillTree"]>

  export type $UserSkillTreePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSkillTree"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      nodes: Prisma.JsonValue
      edges: Prisma.JsonValue
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["userSkillTree"]>
    composites: {}
  }

  type UserSkillTreeGetPayload<S extends boolean | null | undefined | UserSkillTreeDefaultArgs> = $Result.GetResult<Prisma.$UserSkillTreePayload, S>

  type UserSkillTreeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserSkillTreeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserSkillTreeCountAggregateInputType | true
    }

  export interface UserSkillTreeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSkillTree'], meta: { name: 'UserSkillTree' } }
    /**
     * Find zero or one UserSkillTree that matches the filter.
     * @param {UserSkillTreeFindUniqueArgs} args - Arguments to find a UserSkillTree
     * @example
     * // Get one UserSkillTree
     * const userSkillTree = await prisma.userSkillTree.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserSkillTreeFindUniqueArgs>(args: SelectSubset<T, UserSkillTreeFindUniqueArgs<ExtArgs>>): Prisma__UserSkillTreeClient<$Result.GetResult<Prisma.$UserSkillTreePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserSkillTree that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserSkillTreeFindUniqueOrThrowArgs} args - Arguments to find a UserSkillTree
     * @example
     * // Get one UserSkillTree
     * const userSkillTree = await prisma.userSkillTree.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserSkillTreeFindUniqueOrThrowArgs>(args: SelectSubset<T, UserSkillTreeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserSkillTreeClient<$Result.GetResult<Prisma.$UserSkillTreePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSkillTree that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillTreeFindFirstArgs} args - Arguments to find a UserSkillTree
     * @example
     * // Get one UserSkillTree
     * const userSkillTree = await prisma.userSkillTree.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserSkillTreeFindFirstArgs>(args?: SelectSubset<T, UserSkillTreeFindFirstArgs<ExtArgs>>): Prisma__UserSkillTreeClient<$Result.GetResult<Prisma.$UserSkillTreePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSkillTree that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillTreeFindFirstOrThrowArgs} args - Arguments to find a UserSkillTree
     * @example
     * // Get one UserSkillTree
     * const userSkillTree = await prisma.userSkillTree.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserSkillTreeFindFirstOrThrowArgs>(args?: SelectSubset<T, UserSkillTreeFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserSkillTreeClient<$Result.GetResult<Prisma.$UserSkillTreePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserSkillTrees that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillTreeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSkillTrees
     * const userSkillTrees = await prisma.userSkillTree.findMany()
     * 
     * // Get first 10 UserSkillTrees
     * const userSkillTrees = await prisma.userSkillTree.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSkillTreeWithIdOnly = await prisma.userSkillTree.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserSkillTreeFindManyArgs>(args?: SelectSubset<T, UserSkillTreeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSkillTreePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserSkillTree.
     * @param {UserSkillTreeCreateArgs} args - Arguments to create a UserSkillTree.
     * @example
     * // Create one UserSkillTree
     * const UserSkillTree = await prisma.userSkillTree.create({
     *   data: {
     *     // ... data to create a UserSkillTree
     *   }
     * })
     * 
     */
    create<T extends UserSkillTreeCreateArgs>(args: SelectSubset<T, UserSkillTreeCreateArgs<ExtArgs>>): Prisma__UserSkillTreeClient<$Result.GetResult<Prisma.$UserSkillTreePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserSkillTrees.
     * @param {UserSkillTreeCreateManyArgs} args - Arguments to create many UserSkillTrees.
     * @example
     * // Create many UserSkillTrees
     * const userSkillTree = await prisma.userSkillTree.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserSkillTreeCreateManyArgs>(args?: SelectSubset<T, UserSkillTreeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserSkillTrees and returns the data saved in the database.
     * @param {UserSkillTreeCreateManyAndReturnArgs} args - Arguments to create many UserSkillTrees.
     * @example
     * // Create many UserSkillTrees
     * const userSkillTree = await prisma.userSkillTree.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserSkillTrees and only return the `id`
     * const userSkillTreeWithIdOnly = await prisma.userSkillTree.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserSkillTreeCreateManyAndReturnArgs>(args?: SelectSubset<T, UserSkillTreeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSkillTreePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserSkillTree.
     * @param {UserSkillTreeDeleteArgs} args - Arguments to delete one UserSkillTree.
     * @example
     * // Delete one UserSkillTree
     * const UserSkillTree = await prisma.userSkillTree.delete({
     *   where: {
     *     // ... filter to delete one UserSkillTree
     *   }
     * })
     * 
     */
    delete<T extends UserSkillTreeDeleteArgs>(args: SelectSubset<T, UserSkillTreeDeleteArgs<ExtArgs>>): Prisma__UserSkillTreeClient<$Result.GetResult<Prisma.$UserSkillTreePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserSkillTree.
     * @param {UserSkillTreeUpdateArgs} args - Arguments to update one UserSkillTree.
     * @example
     * // Update one UserSkillTree
     * const userSkillTree = await prisma.userSkillTree.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserSkillTreeUpdateArgs>(args: SelectSubset<T, UserSkillTreeUpdateArgs<ExtArgs>>): Prisma__UserSkillTreeClient<$Result.GetResult<Prisma.$UserSkillTreePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserSkillTrees.
     * @param {UserSkillTreeDeleteManyArgs} args - Arguments to filter UserSkillTrees to delete.
     * @example
     * // Delete a few UserSkillTrees
     * const { count } = await prisma.userSkillTree.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserSkillTreeDeleteManyArgs>(args?: SelectSubset<T, UserSkillTreeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSkillTrees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillTreeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSkillTrees
     * const userSkillTree = await prisma.userSkillTree.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserSkillTreeUpdateManyArgs>(args: SelectSubset<T, UserSkillTreeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSkillTrees and returns the data updated in the database.
     * @param {UserSkillTreeUpdateManyAndReturnArgs} args - Arguments to update many UserSkillTrees.
     * @example
     * // Update many UserSkillTrees
     * const userSkillTree = await prisma.userSkillTree.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserSkillTrees and only return the `id`
     * const userSkillTreeWithIdOnly = await prisma.userSkillTree.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserSkillTreeUpdateManyAndReturnArgs>(args: SelectSubset<T, UserSkillTreeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSkillTreePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserSkillTree.
     * @param {UserSkillTreeUpsertArgs} args - Arguments to update or create a UserSkillTree.
     * @example
     * // Update or create a UserSkillTree
     * const userSkillTree = await prisma.userSkillTree.upsert({
     *   create: {
     *     // ... data to create a UserSkillTree
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSkillTree we want to update
     *   }
     * })
     */
    upsert<T extends UserSkillTreeUpsertArgs>(args: SelectSubset<T, UserSkillTreeUpsertArgs<ExtArgs>>): Prisma__UserSkillTreeClient<$Result.GetResult<Prisma.$UserSkillTreePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserSkillTrees.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillTreeCountArgs} args - Arguments to filter UserSkillTrees to count.
     * @example
     * // Count the number of UserSkillTrees
     * const count = await prisma.userSkillTree.count({
     *   where: {
     *     // ... the filter for the UserSkillTrees we want to count
     *   }
     * })
    **/
    count<T extends UserSkillTreeCountArgs>(
      args?: Subset<T, UserSkillTreeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSkillTreeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSkillTree.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillTreeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserSkillTreeAggregateArgs>(args: Subset<T, UserSkillTreeAggregateArgs>): Prisma.PrismaPromise<GetUserSkillTreeAggregateType<T>>

    /**
     * Group by UserSkillTree.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSkillTreeGroupByArgs} args - Group by arguments.
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
      T extends UserSkillTreeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSkillTreeGroupByArgs['orderBy'] }
        : { orderBy?: UserSkillTreeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserSkillTreeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSkillTreeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSkillTree model
   */
  readonly fields: UserSkillTreeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSkillTree.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSkillTreeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UserSkillTree model
   */
  interface UserSkillTreeFieldRefs {
    readonly id: FieldRef<"UserSkillTree", 'String'>
    readonly userId: FieldRef<"UserSkillTree", 'String'>
    readonly nodes: FieldRef<"UserSkillTree", 'Json'>
    readonly edges: FieldRef<"UserSkillTree", 'Json'>
    readonly updatedAt: FieldRef<"UserSkillTree", 'DateTime'>
    readonly createdAt: FieldRef<"UserSkillTree", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserSkillTree findUnique
   */
  export type UserSkillTreeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkillTree
     */
    select?: UserSkillTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSkillTree
     */
    omit?: UserSkillTreeOmit<ExtArgs> | null
    /**
     * Filter, which UserSkillTree to fetch.
     */
    where: UserSkillTreeWhereUniqueInput
  }

  /**
   * UserSkillTree findUniqueOrThrow
   */
  export type UserSkillTreeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkillTree
     */
    select?: UserSkillTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSkillTree
     */
    omit?: UserSkillTreeOmit<ExtArgs> | null
    /**
     * Filter, which UserSkillTree to fetch.
     */
    where: UserSkillTreeWhereUniqueInput
  }

  /**
   * UserSkillTree findFirst
   */
  export type UserSkillTreeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkillTree
     */
    select?: UserSkillTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSkillTree
     */
    omit?: UserSkillTreeOmit<ExtArgs> | null
    /**
     * Filter, which UserSkillTree to fetch.
     */
    where?: UserSkillTreeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSkillTrees to fetch.
     */
    orderBy?: UserSkillTreeOrderByWithRelationInput | UserSkillTreeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSkillTrees.
     */
    cursor?: UserSkillTreeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSkillTrees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSkillTrees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSkillTrees.
     */
    distinct?: UserSkillTreeScalarFieldEnum | UserSkillTreeScalarFieldEnum[]
  }

  /**
   * UserSkillTree findFirstOrThrow
   */
  export type UserSkillTreeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkillTree
     */
    select?: UserSkillTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSkillTree
     */
    omit?: UserSkillTreeOmit<ExtArgs> | null
    /**
     * Filter, which UserSkillTree to fetch.
     */
    where?: UserSkillTreeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSkillTrees to fetch.
     */
    orderBy?: UserSkillTreeOrderByWithRelationInput | UserSkillTreeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSkillTrees.
     */
    cursor?: UserSkillTreeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSkillTrees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSkillTrees.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSkillTrees.
     */
    distinct?: UserSkillTreeScalarFieldEnum | UserSkillTreeScalarFieldEnum[]
  }

  /**
   * UserSkillTree findMany
   */
  export type UserSkillTreeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkillTree
     */
    select?: UserSkillTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSkillTree
     */
    omit?: UserSkillTreeOmit<ExtArgs> | null
    /**
     * Filter, which UserSkillTrees to fetch.
     */
    where?: UserSkillTreeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSkillTrees to fetch.
     */
    orderBy?: UserSkillTreeOrderByWithRelationInput | UserSkillTreeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSkillTrees.
     */
    cursor?: UserSkillTreeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSkillTrees from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSkillTrees.
     */
    skip?: number
    distinct?: UserSkillTreeScalarFieldEnum | UserSkillTreeScalarFieldEnum[]
  }

  /**
   * UserSkillTree create
   */
  export type UserSkillTreeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkillTree
     */
    select?: UserSkillTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSkillTree
     */
    omit?: UserSkillTreeOmit<ExtArgs> | null
    /**
     * The data needed to create a UserSkillTree.
     */
    data: XOR<UserSkillTreeCreateInput, UserSkillTreeUncheckedCreateInput>
  }

  /**
   * UserSkillTree createMany
   */
  export type UserSkillTreeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSkillTrees.
     */
    data: UserSkillTreeCreateManyInput | UserSkillTreeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserSkillTree createManyAndReturn
   */
  export type UserSkillTreeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkillTree
     */
    select?: UserSkillTreeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSkillTree
     */
    omit?: UserSkillTreeOmit<ExtArgs> | null
    /**
     * The data used to create many UserSkillTrees.
     */
    data: UserSkillTreeCreateManyInput | UserSkillTreeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserSkillTree update
   */
  export type UserSkillTreeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkillTree
     */
    select?: UserSkillTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSkillTree
     */
    omit?: UserSkillTreeOmit<ExtArgs> | null
    /**
     * The data needed to update a UserSkillTree.
     */
    data: XOR<UserSkillTreeUpdateInput, UserSkillTreeUncheckedUpdateInput>
    /**
     * Choose, which UserSkillTree to update.
     */
    where: UserSkillTreeWhereUniqueInput
  }

  /**
   * UserSkillTree updateMany
   */
  export type UserSkillTreeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSkillTrees.
     */
    data: XOR<UserSkillTreeUpdateManyMutationInput, UserSkillTreeUncheckedUpdateManyInput>
    /**
     * Filter which UserSkillTrees to update
     */
    where?: UserSkillTreeWhereInput
    /**
     * Limit how many UserSkillTrees to update.
     */
    limit?: number
  }

  /**
   * UserSkillTree updateManyAndReturn
   */
  export type UserSkillTreeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkillTree
     */
    select?: UserSkillTreeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSkillTree
     */
    omit?: UserSkillTreeOmit<ExtArgs> | null
    /**
     * The data used to update UserSkillTrees.
     */
    data: XOR<UserSkillTreeUpdateManyMutationInput, UserSkillTreeUncheckedUpdateManyInput>
    /**
     * Filter which UserSkillTrees to update
     */
    where?: UserSkillTreeWhereInput
    /**
     * Limit how many UserSkillTrees to update.
     */
    limit?: number
  }

  /**
   * UserSkillTree upsert
   */
  export type UserSkillTreeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkillTree
     */
    select?: UserSkillTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSkillTree
     */
    omit?: UserSkillTreeOmit<ExtArgs> | null
    /**
     * The filter to search for the UserSkillTree to update in case it exists.
     */
    where: UserSkillTreeWhereUniqueInput
    /**
     * In case the UserSkillTree found by the `where` argument doesn't exist, create a new UserSkillTree with this data.
     */
    create: XOR<UserSkillTreeCreateInput, UserSkillTreeUncheckedCreateInput>
    /**
     * In case the UserSkillTree was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSkillTreeUpdateInput, UserSkillTreeUncheckedUpdateInput>
  }

  /**
   * UserSkillTree delete
   */
  export type UserSkillTreeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkillTree
     */
    select?: UserSkillTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSkillTree
     */
    omit?: UserSkillTreeOmit<ExtArgs> | null
    /**
     * Filter which UserSkillTree to delete.
     */
    where: UserSkillTreeWhereUniqueInput
  }

  /**
   * UserSkillTree deleteMany
   */
  export type UserSkillTreeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSkillTrees to delete
     */
    where?: UserSkillTreeWhereInput
    /**
     * Limit how many UserSkillTrees to delete.
     */
    limit?: number
  }

  /**
   * UserSkillTree without action
   */
  export type UserSkillTreeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSkillTree
     */
    select?: UserSkillTreeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSkillTree
     */
    omit?: UserSkillTreeOmit<ExtArgs> | null
  }


  /**
   * Model UserLearningGoal
   */

  export type AggregateUserLearningGoal = {
    _count: UserLearningGoalCountAggregateOutputType | null
    _min: UserLearningGoalMinAggregateOutputType | null
    _max: UserLearningGoalMaxAggregateOutputType | null
  }

  export type UserLearningGoalMinAggregateOutputType = {
    id: string | null
    userId: string | null
    currentLevel: string | null
    targetScore: string | null
    deadline: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type UserLearningGoalMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    currentLevel: string | null
    targetScore: string | null
    deadline: string | null
    updatedAt: Date | null
    createdAt: Date | null
  }

  export type UserLearningGoalCountAggregateOutputType = {
    id: number
    userId: number
    currentLevel: number
    targetScore: number
    deadline: number
    roadmap: number
    updatedAt: number
    createdAt: number
    _all: number
  }


  export type UserLearningGoalMinAggregateInputType = {
    id?: true
    userId?: true
    currentLevel?: true
    targetScore?: true
    deadline?: true
    updatedAt?: true
    createdAt?: true
  }

  export type UserLearningGoalMaxAggregateInputType = {
    id?: true
    userId?: true
    currentLevel?: true
    targetScore?: true
    deadline?: true
    updatedAt?: true
    createdAt?: true
  }

  export type UserLearningGoalCountAggregateInputType = {
    id?: true
    userId?: true
    currentLevel?: true
    targetScore?: true
    deadline?: true
    roadmap?: true
    updatedAt?: true
    createdAt?: true
    _all?: true
  }

  export type UserLearningGoalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserLearningGoal to aggregate.
     */
    where?: UserLearningGoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLearningGoals to fetch.
     */
    orderBy?: UserLearningGoalOrderByWithRelationInput | UserLearningGoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserLearningGoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLearningGoals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLearningGoals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserLearningGoals
    **/
    _count?: true | UserLearningGoalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserLearningGoalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserLearningGoalMaxAggregateInputType
  }

  export type GetUserLearningGoalAggregateType<T extends UserLearningGoalAggregateArgs> = {
        [P in keyof T & keyof AggregateUserLearningGoal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserLearningGoal[P]>
      : GetScalarType<T[P], AggregateUserLearningGoal[P]>
  }




  export type UserLearningGoalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserLearningGoalWhereInput
    orderBy?: UserLearningGoalOrderByWithAggregationInput | UserLearningGoalOrderByWithAggregationInput[]
    by: UserLearningGoalScalarFieldEnum[] | UserLearningGoalScalarFieldEnum
    having?: UserLearningGoalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserLearningGoalCountAggregateInputType | true
    _min?: UserLearningGoalMinAggregateInputType
    _max?: UserLearningGoalMaxAggregateInputType
  }

  export type UserLearningGoalGroupByOutputType = {
    id: string
    userId: string
    currentLevel: string | null
    targetScore: string | null
    deadline: string | null
    roadmap: JsonValue | null
    updatedAt: Date
    createdAt: Date
    _count: UserLearningGoalCountAggregateOutputType | null
    _min: UserLearningGoalMinAggregateOutputType | null
    _max: UserLearningGoalMaxAggregateOutputType | null
  }

  type GetUserLearningGoalGroupByPayload<T extends UserLearningGoalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserLearningGoalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserLearningGoalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserLearningGoalGroupByOutputType[P]>
            : GetScalarType<T[P], UserLearningGoalGroupByOutputType[P]>
        }
      >
    >


  export type UserLearningGoalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    currentLevel?: boolean
    targetScore?: boolean
    deadline?: boolean
    roadmap?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userLearningGoal"]>

  export type UserLearningGoalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    currentLevel?: boolean
    targetScore?: boolean
    deadline?: boolean
    roadmap?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userLearningGoal"]>

  export type UserLearningGoalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    currentLevel?: boolean
    targetScore?: boolean
    deadline?: boolean
    roadmap?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["userLearningGoal"]>

  export type UserLearningGoalSelectScalar = {
    id?: boolean
    userId?: boolean
    currentLevel?: boolean
    targetScore?: boolean
    deadline?: boolean
    roadmap?: boolean
    updatedAt?: boolean
    createdAt?: boolean
  }

  export type UserLearningGoalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "currentLevel" | "targetScore" | "deadline" | "roadmap" | "updatedAt" | "createdAt", ExtArgs["result"]["userLearningGoal"]>

  export type $UserLearningGoalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserLearningGoal"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      currentLevel: string | null
      targetScore: string | null
      deadline: string | null
      roadmap: Prisma.JsonValue | null
      updatedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["userLearningGoal"]>
    composites: {}
  }

  type UserLearningGoalGetPayload<S extends boolean | null | undefined | UserLearningGoalDefaultArgs> = $Result.GetResult<Prisma.$UserLearningGoalPayload, S>

  type UserLearningGoalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserLearningGoalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserLearningGoalCountAggregateInputType | true
    }

  export interface UserLearningGoalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserLearningGoal'], meta: { name: 'UserLearningGoal' } }
    /**
     * Find zero or one UserLearningGoal that matches the filter.
     * @param {UserLearningGoalFindUniqueArgs} args - Arguments to find a UserLearningGoal
     * @example
     * // Get one UserLearningGoal
     * const userLearningGoal = await prisma.userLearningGoal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserLearningGoalFindUniqueArgs>(args: SelectSubset<T, UserLearningGoalFindUniqueArgs<ExtArgs>>): Prisma__UserLearningGoalClient<$Result.GetResult<Prisma.$UserLearningGoalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserLearningGoal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserLearningGoalFindUniqueOrThrowArgs} args - Arguments to find a UserLearningGoal
     * @example
     * // Get one UserLearningGoal
     * const userLearningGoal = await prisma.userLearningGoal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserLearningGoalFindUniqueOrThrowArgs>(args: SelectSubset<T, UserLearningGoalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserLearningGoalClient<$Result.GetResult<Prisma.$UserLearningGoalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserLearningGoal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLearningGoalFindFirstArgs} args - Arguments to find a UserLearningGoal
     * @example
     * // Get one UserLearningGoal
     * const userLearningGoal = await prisma.userLearningGoal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserLearningGoalFindFirstArgs>(args?: SelectSubset<T, UserLearningGoalFindFirstArgs<ExtArgs>>): Prisma__UserLearningGoalClient<$Result.GetResult<Prisma.$UserLearningGoalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserLearningGoal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLearningGoalFindFirstOrThrowArgs} args - Arguments to find a UserLearningGoal
     * @example
     * // Get one UserLearningGoal
     * const userLearningGoal = await prisma.userLearningGoal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserLearningGoalFindFirstOrThrowArgs>(args?: SelectSubset<T, UserLearningGoalFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserLearningGoalClient<$Result.GetResult<Prisma.$UserLearningGoalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserLearningGoals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLearningGoalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserLearningGoals
     * const userLearningGoals = await prisma.userLearningGoal.findMany()
     * 
     * // Get first 10 UserLearningGoals
     * const userLearningGoals = await prisma.userLearningGoal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userLearningGoalWithIdOnly = await prisma.userLearningGoal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserLearningGoalFindManyArgs>(args?: SelectSubset<T, UserLearningGoalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLearningGoalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserLearningGoal.
     * @param {UserLearningGoalCreateArgs} args - Arguments to create a UserLearningGoal.
     * @example
     * // Create one UserLearningGoal
     * const UserLearningGoal = await prisma.userLearningGoal.create({
     *   data: {
     *     // ... data to create a UserLearningGoal
     *   }
     * })
     * 
     */
    create<T extends UserLearningGoalCreateArgs>(args: SelectSubset<T, UserLearningGoalCreateArgs<ExtArgs>>): Prisma__UserLearningGoalClient<$Result.GetResult<Prisma.$UserLearningGoalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserLearningGoals.
     * @param {UserLearningGoalCreateManyArgs} args - Arguments to create many UserLearningGoals.
     * @example
     * // Create many UserLearningGoals
     * const userLearningGoal = await prisma.userLearningGoal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserLearningGoalCreateManyArgs>(args?: SelectSubset<T, UserLearningGoalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserLearningGoals and returns the data saved in the database.
     * @param {UserLearningGoalCreateManyAndReturnArgs} args - Arguments to create many UserLearningGoals.
     * @example
     * // Create many UserLearningGoals
     * const userLearningGoal = await prisma.userLearningGoal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserLearningGoals and only return the `id`
     * const userLearningGoalWithIdOnly = await prisma.userLearningGoal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserLearningGoalCreateManyAndReturnArgs>(args?: SelectSubset<T, UserLearningGoalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLearningGoalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserLearningGoal.
     * @param {UserLearningGoalDeleteArgs} args - Arguments to delete one UserLearningGoal.
     * @example
     * // Delete one UserLearningGoal
     * const UserLearningGoal = await prisma.userLearningGoal.delete({
     *   where: {
     *     // ... filter to delete one UserLearningGoal
     *   }
     * })
     * 
     */
    delete<T extends UserLearningGoalDeleteArgs>(args: SelectSubset<T, UserLearningGoalDeleteArgs<ExtArgs>>): Prisma__UserLearningGoalClient<$Result.GetResult<Prisma.$UserLearningGoalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserLearningGoal.
     * @param {UserLearningGoalUpdateArgs} args - Arguments to update one UserLearningGoal.
     * @example
     * // Update one UserLearningGoal
     * const userLearningGoal = await prisma.userLearningGoal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserLearningGoalUpdateArgs>(args: SelectSubset<T, UserLearningGoalUpdateArgs<ExtArgs>>): Prisma__UserLearningGoalClient<$Result.GetResult<Prisma.$UserLearningGoalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserLearningGoals.
     * @param {UserLearningGoalDeleteManyArgs} args - Arguments to filter UserLearningGoals to delete.
     * @example
     * // Delete a few UserLearningGoals
     * const { count } = await prisma.userLearningGoal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserLearningGoalDeleteManyArgs>(args?: SelectSubset<T, UserLearningGoalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserLearningGoals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLearningGoalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserLearningGoals
     * const userLearningGoal = await prisma.userLearningGoal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserLearningGoalUpdateManyArgs>(args: SelectSubset<T, UserLearningGoalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserLearningGoals and returns the data updated in the database.
     * @param {UserLearningGoalUpdateManyAndReturnArgs} args - Arguments to update many UserLearningGoals.
     * @example
     * // Update many UserLearningGoals
     * const userLearningGoal = await prisma.userLearningGoal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserLearningGoals and only return the `id`
     * const userLearningGoalWithIdOnly = await prisma.userLearningGoal.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserLearningGoalUpdateManyAndReturnArgs>(args: SelectSubset<T, UserLearningGoalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLearningGoalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserLearningGoal.
     * @param {UserLearningGoalUpsertArgs} args - Arguments to update or create a UserLearningGoal.
     * @example
     * // Update or create a UserLearningGoal
     * const userLearningGoal = await prisma.userLearningGoal.upsert({
     *   create: {
     *     // ... data to create a UserLearningGoal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserLearningGoal we want to update
     *   }
     * })
     */
    upsert<T extends UserLearningGoalUpsertArgs>(args: SelectSubset<T, UserLearningGoalUpsertArgs<ExtArgs>>): Prisma__UserLearningGoalClient<$Result.GetResult<Prisma.$UserLearningGoalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserLearningGoals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLearningGoalCountArgs} args - Arguments to filter UserLearningGoals to count.
     * @example
     * // Count the number of UserLearningGoals
     * const count = await prisma.userLearningGoal.count({
     *   where: {
     *     // ... the filter for the UserLearningGoals we want to count
     *   }
     * })
    **/
    count<T extends UserLearningGoalCountArgs>(
      args?: Subset<T, UserLearningGoalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserLearningGoalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserLearningGoal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLearningGoalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserLearningGoalAggregateArgs>(args: Subset<T, UserLearningGoalAggregateArgs>): Prisma.PrismaPromise<GetUserLearningGoalAggregateType<T>>

    /**
     * Group by UserLearningGoal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLearningGoalGroupByArgs} args - Group by arguments.
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
      T extends UserLearningGoalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserLearningGoalGroupByArgs['orderBy'] }
        : { orderBy?: UserLearningGoalGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserLearningGoalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserLearningGoalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserLearningGoal model
   */
  readonly fields: UserLearningGoalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserLearningGoal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserLearningGoalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UserLearningGoal model
   */
  interface UserLearningGoalFieldRefs {
    readonly id: FieldRef<"UserLearningGoal", 'String'>
    readonly userId: FieldRef<"UserLearningGoal", 'String'>
    readonly currentLevel: FieldRef<"UserLearningGoal", 'String'>
    readonly targetScore: FieldRef<"UserLearningGoal", 'String'>
    readonly deadline: FieldRef<"UserLearningGoal", 'String'>
    readonly roadmap: FieldRef<"UserLearningGoal", 'Json'>
    readonly updatedAt: FieldRef<"UserLearningGoal", 'DateTime'>
    readonly createdAt: FieldRef<"UserLearningGoal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserLearningGoal findUnique
   */
  export type UserLearningGoalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLearningGoal
     */
    select?: UserLearningGoalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLearningGoal
     */
    omit?: UserLearningGoalOmit<ExtArgs> | null
    /**
     * Filter, which UserLearningGoal to fetch.
     */
    where: UserLearningGoalWhereUniqueInput
  }

  /**
   * UserLearningGoal findUniqueOrThrow
   */
  export type UserLearningGoalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLearningGoal
     */
    select?: UserLearningGoalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLearningGoal
     */
    omit?: UserLearningGoalOmit<ExtArgs> | null
    /**
     * Filter, which UserLearningGoal to fetch.
     */
    where: UserLearningGoalWhereUniqueInput
  }

  /**
   * UserLearningGoal findFirst
   */
  export type UserLearningGoalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLearningGoal
     */
    select?: UserLearningGoalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLearningGoal
     */
    omit?: UserLearningGoalOmit<ExtArgs> | null
    /**
     * Filter, which UserLearningGoal to fetch.
     */
    where?: UserLearningGoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLearningGoals to fetch.
     */
    orderBy?: UserLearningGoalOrderByWithRelationInput | UserLearningGoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserLearningGoals.
     */
    cursor?: UserLearningGoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLearningGoals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLearningGoals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserLearningGoals.
     */
    distinct?: UserLearningGoalScalarFieldEnum | UserLearningGoalScalarFieldEnum[]
  }

  /**
   * UserLearningGoal findFirstOrThrow
   */
  export type UserLearningGoalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLearningGoal
     */
    select?: UserLearningGoalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLearningGoal
     */
    omit?: UserLearningGoalOmit<ExtArgs> | null
    /**
     * Filter, which UserLearningGoal to fetch.
     */
    where?: UserLearningGoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLearningGoals to fetch.
     */
    orderBy?: UserLearningGoalOrderByWithRelationInput | UserLearningGoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserLearningGoals.
     */
    cursor?: UserLearningGoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLearningGoals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLearningGoals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserLearningGoals.
     */
    distinct?: UserLearningGoalScalarFieldEnum | UserLearningGoalScalarFieldEnum[]
  }

  /**
   * UserLearningGoal findMany
   */
  export type UserLearningGoalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLearningGoal
     */
    select?: UserLearningGoalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLearningGoal
     */
    omit?: UserLearningGoalOmit<ExtArgs> | null
    /**
     * Filter, which UserLearningGoals to fetch.
     */
    where?: UserLearningGoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLearningGoals to fetch.
     */
    orderBy?: UserLearningGoalOrderByWithRelationInput | UserLearningGoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserLearningGoals.
     */
    cursor?: UserLearningGoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLearningGoals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLearningGoals.
     */
    skip?: number
    distinct?: UserLearningGoalScalarFieldEnum | UserLearningGoalScalarFieldEnum[]
  }

  /**
   * UserLearningGoal create
   */
  export type UserLearningGoalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLearningGoal
     */
    select?: UserLearningGoalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLearningGoal
     */
    omit?: UserLearningGoalOmit<ExtArgs> | null
    /**
     * The data needed to create a UserLearningGoal.
     */
    data: XOR<UserLearningGoalCreateInput, UserLearningGoalUncheckedCreateInput>
  }

  /**
   * UserLearningGoal createMany
   */
  export type UserLearningGoalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserLearningGoals.
     */
    data: UserLearningGoalCreateManyInput | UserLearningGoalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserLearningGoal createManyAndReturn
   */
  export type UserLearningGoalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLearningGoal
     */
    select?: UserLearningGoalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserLearningGoal
     */
    omit?: UserLearningGoalOmit<ExtArgs> | null
    /**
     * The data used to create many UserLearningGoals.
     */
    data: UserLearningGoalCreateManyInput | UserLearningGoalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserLearningGoal update
   */
  export type UserLearningGoalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLearningGoal
     */
    select?: UserLearningGoalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLearningGoal
     */
    omit?: UserLearningGoalOmit<ExtArgs> | null
    /**
     * The data needed to update a UserLearningGoal.
     */
    data: XOR<UserLearningGoalUpdateInput, UserLearningGoalUncheckedUpdateInput>
    /**
     * Choose, which UserLearningGoal to update.
     */
    where: UserLearningGoalWhereUniqueInput
  }

  /**
   * UserLearningGoal updateMany
   */
  export type UserLearningGoalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserLearningGoals.
     */
    data: XOR<UserLearningGoalUpdateManyMutationInput, UserLearningGoalUncheckedUpdateManyInput>
    /**
     * Filter which UserLearningGoals to update
     */
    where?: UserLearningGoalWhereInput
    /**
     * Limit how many UserLearningGoals to update.
     */
    limit?: number
  }

  /**
   * UserLearningGoal updateManyAndReturn
   */
  export type UserLearningGoalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLearningGoal
     */
    select?: UserLearningGoalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserLearningGoal
     */
    omit?: UserLearningGoalOmit<ExtArgs> | null
    /**
     * The data used to update UserLearningGoals.
     */
    data: XOR<UserLearningGoalUpdateManyMutationInput, UserLearningGoalUncheckedUpdateManyInput>
    /**
     * Filter which UserLearningGoals to update
     */
    where?: UserLearningGoalWhereInput
    /**
     * Limit how many UserLearningGoals to update.
     */
    limit?: number
  }

  /**
   * UserLearningGoal upsert
   */
  export type UserLearningGoalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLearningGoal
     */
    select?: UserLearningGoalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLearningGoal
     */
    omit?: UserLearningGoalOmit<ExtArgs> | null
    /**
     * The filter to search for the UserLearningGoal to update in case it exists.
     */
    where: UserLearningGoalWhereUniqueInput
    /**
     * In case the UserLearningGoal found by the `where` argument doesn't exist, create a new UserLearningGoal with this data.
     */
    create: XOR<UserLearningGoalCreateInput, UserLearningGoalUncheckedCreateInput>
    /**
     * In case the UserLearningGoal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserLearningGoalUpdateInput, UserLearningGoalUncheckedUpdateInput>
  }

  /**
   * UserLearningGoal delete
   */
  export type UserLearningGoalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLearningGoal
     */
    select?: UserLearningGoalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLearningGoal
     */
    omit?: UserLearningGoalOmit<ExtArgs> | null
    /**
     * Filter which UserLearningGoal to delete.
     */
    where: UserLearningGoalWhereUniqueInput
  }

  /**
   * UserLearningGoal deleteMany
   */
  export type UserLearningGoalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserLearningGoals to delete
     */
    where?: UserLearningGoalWhereInput
    /**
     * Limit how many UserLearningGoals to delete.
     */
    limit?: number
  }

  /**
   * UserLearningGoal without action
   */
  export type UserLearningGoalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLearningGoal
     */
    select?: UserLearningGoalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLearningGoal
     */
    omit?: UserLearningGoalOmit<ExtArgs> | null
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


  export const WritingEvaluationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    sessionId: 'sessionId',
    questionId: 'questionId',
    essayText: 'essayText',
    overallBand: 'overallBand',
    criteria: 'criteria',
    highlightedErrors: 'highlightedErrors',
    overallFeedback: 'overallFeedback',
    status: 'status',
    jobId: 'jobId',
    createdAt: 'createdAt',
    completedAt: 'completedAt'
  };

  export type WritingEvaluationScalarFieldEnum = (typeof WritingEvaluationScalarFieldEnum)[keyof typeof WritingEvaluationScalarFieldEnum]


  export const SpeakingEvaluationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    sessionId: 'sessionId',
    questionId: 'questionId',
    audioUrl: 'audioUrl',
    transcript: 'transcript',
    duration: 'duration',
    overallBand: 'overallBand',
    pronunciationScore: 'pronunciationScore',
    fluencyScore: 'fluencyScore',
    vocabScore: 'vocabScore',
    grammarScore: 'grammarScore',
    feedback: 'feedback',
    status: 'status',
    jobId: 'jobId',
    createdAt: 'createdAt',
    completedAt: 'completedAt'
  };

  export type SpeakingEvaluationScalarFieldEnum = (typeof SpeakingEvaluationScalarFieldEnum)[keyof typeof SpeakingEvaluationScalarFieldEnum]


  export const UserSkillTreeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    nodes: 'nodes',
    edges: 'edges',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  };

  export type UserSkillTreeScalarFieldEnum = (typeof UserSkillTreeScalarFieldEnum)[keyof typeof UserSkillTreeScalarFieldEnum]


  export const UserLearningGoalScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    currentLevel: 'currentLevel',
    targetScore: 'targetScore',
    deadline: 'deadline',
    roadmap: 'roadmap',
    updatedAt: 'updatedAt',
    createdAt: 'createdAt'
  };

  export type UserLearningGoalScalarFieldEnum = (typeof UserLearningGoalScalarFieldEnum)[keyof typeof UserLearningGoalScalarFieldEnum]


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


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'EvaluationStatus'
   */
  export type EnumEvaluationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EvaluationStatus'>
    


  /**
   * Reference to a field of type 'EvaluationStatus[]'
   */
  export type ListEnumEvaluationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EvaluationStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


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


  export type WritingEvaluationWhereInput = {
    AND?: WritingEvaluationWhereInput | WritingEvaluationWhereInput[]
    OR?: WritingEvaluationWhereInput[]
    NOT?: WritingEvaluationWhereInput | WritingEvaluationWhereInput[]
    id?: UuidFilter<"WritingEvaluation"> | string
    userId?: UuidFilter<"WritingEvaluation"> | string
    sessionId?: UuidNullableFilter<"WritingEvaluation"> | string | null
    questionId?: UuidNullableFilter<"WritingEvaluation"> | string | null
    essayText?: StringFilter<"WritingEvaluation"> | string
    overallBand?: FloatNullableFilter<"WritingEvaluation"> | number | null
    criteria?: JsonNullableFilter<"WritingEvaluation">
    highlightedErrors?: JsonNullableFilter<"WritingEvaluation">
    overallFeedback?: StringNullableFilter<"WritingEvaluation"> | string | null
    status?: EnumEvaluationStatusFilter<"WritingEvaluation"> | $Enums.EvaluationStatus
    jobId?: StringNullableFilter<"WritingEvaluation"> | string | null
    createdAt?: DateTimeFilter<"WritingEvaluation"> | Date | string
    completedAt?: DateTimeNullableFilter<"WritingEvaluation"> | Date | string | null
  }

  export type WritingEvaluationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrderInput | SortOrder
    questionId?: SortOrderInput | SortOrder
    essayText?: SortOrder
    overallBand?: SortOrderInput | SortOrder
    criteria?: SortOrderInput | SortOrder
    highlightedErrors?: SortOrderInput | SortOrder
    overallFeedback?: SortOrderInput | SortOrder
    status?: SortOrder
    jobId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
  }

  export type WritingEvaluationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    jobId?: string
    AND?: WritingEvaluationWhereInput | WritingEvaluationWhereInput[]
    OR?: WritingEvaluationWhereInput[]
    NOT?: WritingEvaluationWhereInput | WritingEvaluationWhereInput[]
    userId?: UuidFilter<"WritingEvaluation"> | string
    sessionId?: UuidNullableFilter<"WritingEvaluation"> | string | null
    questionId?: UuidNullableFilter<"WritingEvaluation"> | string | null
    essayText?: StringFilter<"WritingEvaluation"> | string
    overallBand?: FloatNullableFilter<"WritingEvaluation"> | number | null
    criteria?: JsonNullableFilter<"WritingEvaluation">
    highlightedErrors?: JsonNullableFilter<"WritingEvaluation">
    overallFeedback?: StringNullableFilter<"WritingEvaluation"> | string | null
    status?: EnumEvaluationStatusFilter<"WritingEvaluation"> | $Enums.EvaluationStatus
    createdAt?: DateTimeFilter<"WritingEvaluation"> | Date | string
    completedAt?: DateTimeNullableFilter<"WritingEvaluation"> | Date | string | null
  }, "id" | "jobId">

  export type WritingEvaluationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrderInput | SortOrder
    questionId?: SortOrderInput | SortOrder
    essayText?: SortOrder
    overallBand?: SortOrderInput | SortOrder
    criteria?: SortOrderInput | SortOrder
    highlightedErrors?: SortOrderInput | SortOrder
    overallFeedback?: SortOrderInput | SortOrder
    status?: SortOrder
    jobId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: WritingEvaluationCountOrderByAggregateInput
    _avg?: WritingEvaluationAvgOrderByAggregateInput
    _max?: WritingEvaluationMaxOrderByAggregateInput
    _min?: WritingEvaluationMinOrderByAggregateInput
    _sum?: WritingEvaluationSumOrderByAggregateInput
  }

  export type WritingEvaluationScalarWhereWithAggregatesInput = {
    AND?: WritingEvaluationScalarWhereWithAggregatesInput | WritingEvaluationScalarWhereWithAggregatesInput[]
    OR?: WritingEvaluationScalarWhereWithAggregatesInput[]
    NOT?: WritingEvaluationScalarWhereWithAggregatesInput | WritingEvaluationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"WritingEvaluation"> | string
    userId?: UuidWithAggregatesFilter<"WritingEvaluation"> | string
    sessionId?: UuidNullableWithAggregatesFilter<"WritingEvaluation"> | string | null
    questionId?: UuidNullableWithAggregatesFilter<"WritingEvaluation"> | string | null
    essayText?: StringWithAggregatesFilter<"WritingEvaluation"> | string
    overallBand?: FloatNullableWithAggregatesFilter<"WritingEvaluation"> | number | null
    criteria?: JsonNullableWithAggregatesFilter<"WritingEvaluation">
    highlightedErrors?: JsonNullableWithAggregatesFilter<"WritingEvaluation">
    overallFeedback?: StringNullableWithAggregatesFilter<"WritingEvaluation"> | string | null
    status?: EnumEvaluationStatusWithAggregatesFilter<"WritingEvaluation"> | $Enums.EvaluationStatus
    jobId?: StringNullableWithAggregatesFilter<"WritingEvaluation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WritingEvaluation"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"WritingEvaluation"> | Date | string | null
  }

  export type SpeakingEvaluationWhereInput = {
    AND?: SpeakingEvaluationWhereInput | SpeakingEvaluationWhereInput[]
    OR?: SpeakingEvaluationWhereInput[]
    NOT?: SpeakingEvaluationWhereInput | SpeakingEvaluationWhereInput[]
    id?: UuidFilter<"SpeakingEvaluation"> | string
    userId?: UuidFilter<"SpeakingEvaluation"> | string
    sessionId?: UuidNullableFilter<"SpeakingEvaluation"> | string | null
    questionId?: UuidNullableFilter<"SpeakingEvaluation"> | string | null
    audioUrl?: StringFilter<"SpeakingEvaluation"> | string
    transcript?: StringNullableFilter<"SpeakingEvaluation"> | string | null
    duration?: FloatNullableFilter<"SpeakingEvaluation"> | number | null
    overallBand?: FloatNullableFilter<"SpeakingEvaluation"> | number | null
    pronunciationScore?: FloatNullableFilter<"SpeakingEvaluation"> | number | null
    fluencyScore?: FloatNullableFilter<"SpeakingEvaluation"> | number | null
    vocabScore?: FloatNullableFilter<"SpeakingEvaluation"> | number | null
    grammarScore?: FloatNullableFilter<"SpeakingEvaluation"> | number | null
    feedback?: StringNullableFilter<"SpeakingEvaluation"> | string | null
    status?: EnumEvaluationStatusFilter<"SpeakingEvaluation"> | $Enums.EvaluationStatus
    jobId?: StringNullableFilter<"SpeakingEvaluation"> | string | null
    createdAt?: DateTimeFilter<"SpeakingEvaluation"> | Date | string
    completedAt?: DateTimeNullableFilter<"SpeakingEvaluation"> | Date | string | null
  }

  export type SpeakingEvaluationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrderInput | SortOrder
    questionId?: SortOrderInput | SortOrder
    audioUrl?: SortOrder
    transcript?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    overallBand?: SortOrderInput | SortOrder
    pronunciationScore?: SortOrderInput | SortOrder
    fluencyScore?: SortOrderInput | SortOrder
    vocabScore?: SortOrderInput | SortOrder
    grammarScore?: SortOrderInput | SortOrder
    feedback?: SortOrderInput | SortOrder
    status?: SortOrder
    jobId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
  }

  export type SpeakingEvaluationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    jobId?: string
    AND?: SpeakingEvaluationWhereInput | SpeakingEvaluationWhereInput[]
    OR?: SpeakingEvaluationWhereInput[]
    NOT?: SpeakingEvaluationWhereInput | SpeakingEvaluationWhereInput[]
    userId?: UuidFilter<"SpeakingEvaluation"> | string
    sessionId?: UuidNullableFilter<"SpeakingEvaluation"> | string | null
    questionId?: UuidNullableFilter<"SpeakingEvaluation"> | string | null
    audioUrl?: StringFilter<"SpeakingEvaluation"> | string
    transcript?: StringNullableFilter<"SpeakingEvaluation"> | string | null
    duration?: FloatNullableFilter<"SpeakingEvaluation"> | number | null
    overallBand?: FloatNullableFilter<"SpeakingEvaluation"> | number | null
    pronunciationScore?: FloatNullableFilter<"SpeakingEvaluation"> | number | null
    fluencyScore?: FloatNullableFilter<"SpeakingEvaluation"> | number | null
    vocabScore?: FloatNullableFilter<"SpeakingEvaluation"> | number | null
    grammarScore?: FloatNullableFilter<"SpeakingEvaluation"> | number | null
    feedback?: StringNullableFilter<"SpeakingEvaluation"> | string | null
    status?: EnumEvaluationStatusFilter<"SpeakingEvaluation"> | $Enums.EvaluationStatus
    createdAt?: DateTimeFilter<"SpeakingEvaluation"> | Date | string
    completedAt?: DateTimeNullableFilter<"SpeakingEvaluation"> | Date | string | null
  }, "id" | "jobId">

  export type SpeakingEvaluationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrderInput | SortOrder
    questionId?: SortOrderInput | SortOrder
    audioUrl?: SortOrder
    transcript?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    overallBand?: SortOrderInput | SortOrder
    pronunciationScore?: SortOrderInput | SortOrder
    fluencyScore?: SortOrderInput | SortOrder
    vocabScore?: SortOrderInput | SortOrder
    grammarScore?: SortOrderInput | SortOrder
    feedback?: SortOrderInput | SortOrder
    status?: SortOrder
    jobId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: SpeakingEvaluationCountOrderByAggregateInput
    _avg?: SpeakingEvaluationAvgOrderByAggregateInput
    _max?: SpeakingEvaluationMaxOrderByAggregateInput
    _min?: SpeakingEvaluationMinOrderByAggregateInput
    _sum?: SpeakingEvaluationSumOrderByAggregateInput
  }

  export type SpeakingEvaluationScalarWhereWithAggregatesInput = {
    AND?: SpeakingEvaluationScalarWhereWithAggregatesInput | SpeakingEvaluationScalarWhereWithAggregatesInput[]
    OR?: SpeakingEvaluationScalarWhereWithAggregatesInput[]
    NOT?: SpeakingEvaluationScalarWhereWithAggregatesInput | SpeakingEvaluationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SpeakingEvaluation"> | string
    userId?: UuidWithAggregatesFilter<"SpeakingEvaluation"> | string
    sessionId?: UuidNullableWithAggregatesFilter<"SpeakingEvaluation"> | string | null
    questionId?: UuidNullableWithAggregatesFilter<"SpeakingEvaluation"> | string | null
    audioUrl?: StringWithAggregatesFilter<"SpeakingEvaluation"> | string
    transcript?: StringNullableWithAggregatesFilter<"SpeakingEvaluation"> | string | null
    duration?: FloatNullableWithAggregatesFilter<"SpeakingEvaluation"> | number | null
    overallBand?: FloatNullableWithAggregatesFilter<"SpeakingEvaluation"> | number | null
    pronunciationScore?: FloatNullableWithAggregatesFilter<"SpeakingEvaluation"> | number | null
    fluencyScore?: FloatNullableWithAggregatesFilter<"SpeakingEvaluation"> | number | null
    vocabScore?: FloatNullableWithAggregatesFilter<"SpeakingEvaluation"> | number | null
    grammarScore?: FloatNullableWithAggregatesFilter<"SpeakingEvaluation"> | number | null
    feedback?: StringNullableWithAggregatesFilter<"SpeakingEvaluation"> | string | null
    status?: EnumEvaluationStatusWithAggregatesFilter<"SpeakingEvaluation"> | $Enums.EvaluationStatus
    jobId?: StringNullableWithAggregatesFilter<"SpeakingEvaluation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SpeakingEvaluation"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"SpeakingEvaluation"> | Date | string | null
  }

  export type UserSkillTreeWhereInput = {
    AND?: UserSkillTreeWhereInput | UserSkillTreeWhereInput[]
    OR?: UserSkillTreeWhereInput[]
    NOT?: UserSkillTreeWhereInput | UserSkillTreeWhereInput[]
    id?: UuidFilter<"UserSkillTree"> | string
    userId?: UuidFilter<"UserSkillTree"> | string
    nodes?: JsonFilter<"UserSkillTree">
    edges?: JsonFilter<"UserSkillTree">
    updatedAt?: DateTimeFilter<"UserSkillTree"> | Date | string
    createdAt?: DateTimeFilter<"UserSkillTree"> | Date | string
  }

  export type UserSkillTreeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    nodes?: SortOrder
    edges?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserSkillTreeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserSkillTreeWhereInput | UserSkillTreeWhereInput[]
    OR?: UserSkillTreeWhereInput[]
    NOT?: UserSkillTreeWhereInput | UserSkillTreeWhereInput[]
    nodes?: JsonFilter<"UserSkillTree">
    edges?: JsonFilter<"UserSkillTree">
    updatedAt?: DateTimeFilter<"UserSkillTree"> | Date | string
    createdAt?: DateTimeFilter<"UserSkillTree"> | Date | string
  }, "id" | "userId">

  export type UserSkillTreeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    nodes?: SortOrder
    edges?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: UserSkillTreeCountOrderByAggregateInput
    _max?: UserSkillTreeMaxOrderByAggregateInput
    _min?: UserSkillTreeMinOrderByAggregateInput
  }

  export type UserSkillTreeScalarWhereWithAggregatesInput = {
    AND?: UserSkillTreeScalarWhereWithAggregatesInput | UserSkillTreeScalarWhereWithAggregatesInput[]
    OR?: UserSkillTreeScalarWhereWithAggregatesInput[]
    NOT?: UserSkillTreeScalarWhereWithAggregatesInput | UserSkillTreeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"UserSkillTree"> | string
    userId?: UuidWithAggregatesFilter<"UserSkillTree"> | string
    nodes?: JsonWithAggregatesFilter<"UserSkillTree">
    edges?: JsonWithAggregatesFilter<"UserSkillTree">
    updatedAt?: DateTimeWithAggregatesFilter<"UserSkillTree"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"UserSkillTree"> | Date | string
  }

  export type UserLearningGoalWhereInput = {
    AND?: UserLearningGoalWhereInput | UserLearningGoalWhereInput[]
    OR?: UserLearningGoalWhereInput[]
    NOT?: UserLearningGoalWhereInput | UserLearningGoalWhereInput[]
    id?: UuidFilter<"UserLearningGoal"> | string
    userId?: UuidFilter<"UserLearningGoal"> | string
    currentLevel?: StringNullableFilter<"UserLearningGoal"> | string | null
    targetScore?: StringNullableFilter<"UserLearningGoal"> | string | null
    deadline?: StringNullableFilter<"UserLearningGoal"> | string | null
    roadmap?: JsonNullableFilter<"UserLearningGoal">
    updatedAt?: DateTimeFilter<"UserLearningGoal"> | Date | string
    createdAt?: DateTimeFilter<"UserLearningGoal"> | Date | string
  }

  export type UserLearningGoalOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    currentLevel?: SortOrderInput | SortOrder
    targetScore?: SortOrderInput | SortOrder
    deadline?: SortOrderInput | SortOrder
    roadmap?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserLearningGoalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserLearningGoalWhereInput | UserLearningGoalWhereInput[]
    OR?: UserLearningGoalWhereInput[]
    NOT?: UserLearningGoalWhereInput | UserLearningGoalWhereInput[]
    currentLevel?: StringNullableFilter<"UserLearningGoal"> | string | null
    targetScore?: StringNullableFilter<"UserLearningGoal"> | string | null
    deadline?: StringNullableFilter<"UserLearningGoal"> | string | null
    roadmap?: JsonNullableFilter<"UserLearningGoal">
    updatedAt?: DateTimeFilter<"UserLearningGoal"> | Date | string
    createdAt?: DateTimeFilter<"UserLearningGoal"> | Date | string
  }, "id" | "userId">

  export type UserLearningGoalOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    currentLevel?: SortOrderInput | SortOrder
    targetScore?: SortOrderInput | SortOrder
    deadline?: SortOrderInput | SortOrder
    roadmap?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
    _count?: UserLearningGoalCountOrderByAggregateInput
    _max?: UserLearningGoalMaxOrderByAggregateInput
    _min?: UserLearningGoalMinOrderByAggregateInput
  }

  export type UserLearningGoalScalarWhereWithAggregatesInput = {
    AND?: UserLearningGoalScalarWhereWithAggregatesInput | UserLearningGoalScalarWhereWithAggregatesInput[]
    OR?: UserLearningGoalScalarWhereWithAggregatesInput[]
    NOT?: UserLearningGoalScalarWhereWithAggregatesInput | UserLearningGoalScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"UserLearningGoal"> | string
    userId?: UuidWithAggregatesFilter<"UserLearningGoal"> | string
    currentLevel?: StringNullableWithAggregatesFilter<"UserLearningGoal"> | string | null
    targetScore?: StringNullableWithAggregatesFilter<"UserLearningGoal"> | string | null
    deadline?: StringNullableWithAggregatesFilter<"UserLearningGoal"> | string | null
    roadmap?: JsonNullableWithAggregatesFilter<"UserLearningGoal">
    updatedAt?: DateTimeWithAggregatesFilter<"UserLearningGoal"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"UserLearningGoal"> | Date | string
  }

  export type WritingEvaluationCreateInput = {
    id?: string
    userId: string
    sessionId?: string | null
    questionId?: string | null
    essayText: string
    overallBand?: number | null
    criteria?: NullableJsonNullValueInput | InputJsonValue
    highlightedErrors?: NullableJsonNullValueInput | InputJsonValue
    overallFeedback?: string | null
    status?: $Enums.EvaluationStatus
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type WritingEvaluationUncheckedCreateInput = {
    id?: string
    userId: string
    sessionId?: string | null
    questionId?: string | null
    essayText: string
    overallBand?: number | null
    criteria?: NullableJsonNullValueInput | InputJsonValue
    highlightedErrors?: NullableJsonNullValueInput | InputJsonValue
    overallFeedback?: string | null
    status?: $Enums.EvaluationStatus
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type WritingEvaluationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: NullableStringFieldUpdateOperationsInput | string | null
    essayText?: StringFieldUpdateOperationsInput | string
    overallBand?: NullableFloatFieldUpdateOperationsInput | number | null
    criteria?: NullableJsonNullValueInput | InputJsonValue
    highlightedErrors?: NullableJsonNullValueInput | InputJsonValue
    overallFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumEvaluationStatusFieldUpdateOperationsInput | $Enums.EvaluationStatus
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WritingEvaluationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: NullableStringFieldUpdateOperationsInput | string | null
    essayText?: StringFieldUpdateOperationsInput | string
    overallBand?: NullableFloatFieldUpdateOperationsInput | number | null
    criteria?: NullableJsonNullValueInput | InputJsonValue
    highlightedErrors?: NullableJsonNullValueInput | InputJsonValue
    overallFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumEvaluationStatusFieldUpdateOperationsInput | $Enums.EvaluationStatus
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WritingEvaluationCreateManyInput = {
    id?: string
    userId: string
    sessionId?: string | null
    questionId?: string | null
    essayText: string
    overallBand?: number | null
    criteria?: NullableJsonNullValueInput | InputJsonValue
    highlightedErrors?: NullableJsonNullValueInput | InputJsonValue
    overallFeedback?: string | null
    status?: $Enums.EvaluationStatus
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type WritingEvaluationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: NullableStringFieldUpdateOperationsInput | string | null
    essayText?: StringFieldUpdateOperationsInput | string
    overallBand?: NullableFloatFieldUpdateOperationsInput | number | null
    criteria?: NullableJsonNullValueInput | InputJsonValue
    highlightedErrors?: NullableJsonNullValueInput | InputJsonValue
    overallFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumEvaluationStatusFieldUpdateOperationsInput | $Enums.EvaluationStatus
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type WritingEvaluationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: NullableStringFieldUpdateOperationsInput | string | null
    essayText?: StringFieldUpdateOperationsInput | string
    overallBand?: NullableFloatFieldUpdateOperationsInput | number | null
    criteria?: NullableJsonNullValueInput | InputJsonValue
    highlightedErrors?: NullableJsonNullValueInput | InputJsonValue
    overallFeedback?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumEvaluationStatusFieldUpdateOperationsInput | $Enums.EvaluationStatus
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SpeakingEvaluationCreateInput = {
    id?: string
    userId: string
    sessionId?: string | null
    questionId?: string | null
    audioUrl: string
    transcript?: string | null
    duration?: number | null
    overallBand?: number | null
    pronunciationScore?: number | null
    fluencyScore?: number | null
    vocabScore?: number | null
    grammarScore?: number | null
    feedback?: string | null
    status?: $Enums.EvaluationStatus
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type SpeakingEvaluationUncheckedCreateInput = {
    id?: string
    userId: string
    sessionId?: string | null
    questionId?: string | null
    audioUrl: string
    transcript?: string | null
    duration?: number | null
    overallBand?: number | null
    pronunciationScore?: number | null
    fluencyScore?: number | null
    vocabScore?: number | null
    grammarScore?: number | null
    feedback?: string | null
    status?: $Enums.EvaluationStatus
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type SpeakingEvaluationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: StringFieldUpdateOperationsInput | string
    transcript?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    overallBand?: NullableFloatFieldUpdateOperationsInput | number | null
    pronunciationScore?: NullableFloatFieldUpdateOperationsInput | number | null
    fluencyScore?: NullableFloatFieldUpdateOperationsInput | number | null
    vocabScore?: NullableFloatFieldUpdateOperationsInput | number | null
    grammarScore?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumEvaluationStatusFieldUpdateOperationsInput | $Enums.EvaluationStatus
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SpeakingEvaluationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: StringFieldUpdateOperationsInput | string
    transcript?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    overallBand?: NullableFloatFieldUpdateOperationsInput | number | null
    pronunciationScore?: NullableFloatFieldUpdateOperationsInput | number | null
    fluencyScore?: NullableFloatFieldUpdateOperationsInput | number | null
    vocabScore?: NullableFloatFieldUpdateOperationsInput | number | null
    grammarScore?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumEvaluationStatusFieldUpdateOperationsInput | $Enums.EvaluationStatus
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SpeakingEvaluationCreateManyInput = {
    id?: string
    userId: string
    sessionId?: string | null
    questionId?: string | null
    audioUrl: string
    transcript?: string | null
    duration?: number | null
    overallBand?: number | null
    pronunciationScore?: number | null
    fluencyScore?: number | null
    vocabScore?: number | null
    grammarScore?: number | null
    feedback?: string | null
    status?: $Enums.EvaluationStatus
    jobId?: string | null
    createdAt?: Date | string
    completedAt?: Date | string | null
  }

  export type SpeakingEvaluationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: StringFieldUpdateOperationsInput | string
    transcript?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    overallBand?: NullableFloatFieldUpdateOperationsInput | number | null
    pronunciationScore?: NullableFloatFieldUpdateOperationsInput | number | null
    fluencyScore?: NullableFloatFieldUpdateOperationsInput | number | null
    vocabScore?: NullableFloatFieldUpdateOperationsInput | number | null
    grammarScore?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumEvaluationStatusFieldUpdateOperationsInput | $Enums.EvaluationStatus
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SpeakingEvaluationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sessionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionId?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: StringFieldUpdateOperationsInput | string
    transcript?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableFloatFieldUpdateOperationsInput | number | null
    overallBand?: NullableFloatFieldUpdateOperationsInput | number | null
    pronunciationScore?: NullableFloatFieldUpdateOperationsInput | number | null
    fluencyScore?: NullableFloatFieldUpdateOperationsInput | number | null
    vocabScore?: NullableFloatFieldUpdateOperationsInput | number | null
    grammarScore?: NullableFloatFieldUpdateOperationsInput | number | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumEvaluationStatusFieldUpdateOperationsInput | $Enums.EvaluationStatus
    jobId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserSkillTreeCreateInput = {
    id?: string
    userId: string
    nodes: JsonNullValueInput | InputJsonValue
    edges: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type UserSkillTreeUncheckedCreateInput = {
    id?: string
    userId: string
    nodes: JsonNullValueInput | InputJsonValue
    edges: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type UserSkillTreeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nodes?: JsonNullValueInput | InputJsonValue
    edges?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSkillTreeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nodes?: JsonNullValueInput | InputJsonValue
    edges?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSkillTreeCreateManyInput = {
    id?: string
    userId: string
    nodes: JsonNullValueInput | InputJsonValue
    edges: JsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type UserSkillTreeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nodes?: JsonNullValueInput | InputJsonValue
    edges?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSkillTreeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    nodes?: JsonNullValueInput | InputJsonValue
    edges?: JsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLearningGoalCreateInput = {
    id?: string
    userId: string
    currentLevel?: string | null
    targetScore?: string | null
    deadline?: string | null
    roadmap?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type UserLearningGoalUncheckedCreateInput = {
    id?: string
    userId: string
    currentLevel?: string | null
    targetScore?: string | null
    deadline?: string | null
    roadmap?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type UserLearningGoalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currentLevel?: NullableStringFieldUpdateOperationsInput | string | null
    targetScore?: NullableStringFieldUpdateOperationsInput | string | null
    deadline?: NullableStringFieldUpdateOperationsInput | string | null
    roadmap?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLearningGoalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currentLevel?: NullableStringFieldUpdateOperationsInput | string | null
    targetScore?: NullableStringFieldUpdateOperationsInput | string | null
    deadline?: NullableStringFieldUpdateOperationsInput | string | null
    roadmap?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLearningGoalCreateManyInput = {
    id?: string
    userId: string
    currentLevel?: string | null
    targetScore?: string | null
    deadline?: string | null
    roadmap?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: Date | string
    createdAt?: Date | string
  }

  export type UserLearningGoalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currentLevel?: NullableStringFieldUpdateOperationsInput | string | null
    targetScore?: NullableStringFieldUpdateOperationsInput | string | null
    deadline?: NullableStringFieldUpdateOperationsInput | string | null
    roadmap?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLearningGoalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currentLevel?: NullableStringFieldUpdateOperationsInput | string | null
    targetScore?: NullableStringFieldUpdateOperationsInput | string | null
    deadline?: NullableStringFieldUpdateOperationsInput | string | null
    roadmap?: NullableJsonNullValueInput | InputJsonValue
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
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

  export type EnumEvaluationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EvaluationStatus | EnumEvaluationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EvaluationStatus[] | ListEnumEvaluationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvaluationStatus[] | ListEnumEvaluationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEvaluationStatusFilter<$PrismaModel> | $Enums.EvaluationStatus
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type WritingEvaluationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    questionId?: SortOrder
    essayText?: SortOrder
    overallBand?: SortOrder
    criteria?: SortOrder
    highlightedErrors?: SortOrder
    overallFeedback?: SortOrder
    status?: SortOrder
    jobId?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type WritingEvaluationAvgOrderByAggregateInput = {
    overallBand?: SortOrder
  }

  export type WritingEvaluationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    questionId?: SortOrder
    essayText?: SortOrder
    overallBand?: SortOrder
    overallFeedback?: SortOrder
    status?: SortOrder
    jobId?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type WritingEvaluationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    questionId?: SortOrder
    essayText?: SortOrder
    overallBand?: SortOrder
    overallFeedback?: SortOrder
    status?: SortOrder
    jobId?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type WritingEvaluationSumOrderByAggregateInput = {
    overallBand?: SortOrder
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

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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

  export type EnumEvaluationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EvaluationStatus | EnumEvaluationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EvaluationStatus[] | ListEnumEvaluationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvaluationStatus[] | ListEnumEvaluationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEvaluationStatusWithAggregatesFilter<$PrismaModel> | $Enums.EvaluationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEvaluationStatusFilter<$PrismaModel>
    _max?: NestedEnumEvaluationStatusFilter<$PrismaModel>
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

  export type SpeakingEvaluationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    questionId?: SortOrder
    audioUrl?: SortOrder
    transcript?: SortOrder
    duration?: SortOrder
    overallBand?: SortOrder
    pronunciationScore?: SortOrder
    fluencyScore?: SortOrder
    vocabScore?: SortOrder
    grammarScore?: SortOrder
    feedback?: SortOrder
    status?: SortOrder
    jobId?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type SpeakingEvaluationAvgOrderByAggregateInput = {
    duration?: SortOrder
    overallBand?: SortOrder
    pronunciationScore?: SortOrder
    fluencyScore?: SortOrder
    vocabScore?: SortOrder
    grammarScore?: SortOrder
  }

  export type SpeakingEvaluationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    questionId?: SortOrder
    audioUrl?: SortOrder
    transcript?: SortOrder
    duration?: SortOrder
    overallBand?: SortOrder
    pronunciationScore?: SortOrder
    fluencyScore?: SortOrder
    vocabScore?: SortOrder
    grammarScore?: SortOrder
    feedback?: SortOrder
    status?: SortOrder
    jobId?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type SpeakingEvaluationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionId?: SortOrder
    questionId?: SortOrder
    audioUrl?: SortOrder
    transcript?: SortOrder
    duration?: SortOrder
    overallBand?: SortOrder
    pronunciationScore?: SortOrder
    fluencyScore?: SortOrder
    vocabScore?: SortOrder
    grammarScore?: SortOrder
    feedback?: SortOrder
    status?: SortOrder
    jobId?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
  }

  export type SpeakingEvaluationSumOrderByAggregateInput = {
    duration?: SortOrder
    overallBand?: SortOrder
    pronunciationScore?: SortOrder
    fluencyScore?: SortOrder
    vocabScore?: SortOrder
    grammarScore?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
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

  export type UserSkillTreeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    nodes?: SortOrder
    edges?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserSkillTreeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserSkillTreeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
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
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type UserLearningGoalCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    currentLevel?: SortOrder
    targetScore?: SortOrder
    deadline?: SortOrder
    roadmap?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserLearningGoalMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    currentLevel?: SortOrder
    targetScore?: SortOrder
    deadline?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type UserLearningGoalMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    currentLevel?: SortOrder
    targetScore?: SortOrder
    deadline?: SortOrder
    updatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumEvaluationStatusFieldUpdateOperationsInput = {
    set?: $Enums.EvaluationStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
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

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
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

  export type NestedEnumEvaluationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.EvaluationStatus | EnumEvaluationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EvaluationStatus[] | ListEnumEvaluationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvaluationStatus[] | ListEnumEvaluationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEvaluationStatusFilter<$PrismaModel> | $Enums.EvaluationStatus
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

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
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

  export type NestedEnumEvaluationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EvaluationStatus | EnumEvaluationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.EvaluationStatus[] | ListEnumEvaluationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.EvaluationStatus[] | ListEnumEvaluationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumEvaluationStatusWithAggregatesFilter<$PrismaModel> | $Enums.EvaluationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEvaluationStatusFilter<$PrismaModel>
    _max?: NestedEnumEvaluationStatusFilter<$PrismaModel>
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
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
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