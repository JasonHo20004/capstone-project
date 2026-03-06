
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
 * Model PracticeTest
 * 
 */
export type PracticeTest = $Result.DefaultSelection<Prisma.$PracticeTestPayload>
/**
 * Model ExamSection
 * 
 */
export type ExamSection = $Result.DefaultSelection<Prisma.$ExamSectionPayload>
/**
 * Model ExamPart
 * 
 */
export type ExamPart = $Result.DefaultSelection<Prisma.$ExamPartPayload>
/**
 * Model QuestionGroup
 * 
 */
export type QuestionGroup = $Result.DefaultSelection<Prisma.$QuestionGroupPayload>
/**
 * Model Question
 * 
 */
export type Question = $Result.DefaultSelection<Prisma.$QuestionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const ExamType: {
  IELTS: 'IELTS',
  TOEFL: 'TOEFL',
  TOEIC: 'TOEIC'
};

export type ExamType = (typeof ExamType)[keyof typeof ExamType]


export const QuestionType: {
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  GAP_FILL: 'GAP_FILL',
  MATCHING: 'MATCHING',
  TRUE_FALSE_NOT_GIVEN: 'TRUE_FALSE_NOT_GIVEN',
  TOEIC_SINGLE_CHOICE: 'TOEIC_SINGLE_CHOICE',
  TOEIC_TEXT_COMPLETION: 'TOEIC_TEXT_COMPLETION'
};

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType]

}

export type ExamType = $Enums.ExamType

export const ExamType: typeof $Enums.ExamType

export type QuestionType = $Enums.QuestionType

export const QuestionType: typeof $Enums.QuestionType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more PracticeTests
 * const practiceTests = await prisma.practiceTest.findMany()
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
   * // Fetch zero or more PracticeTests
   * const practiceTests = await prisma.practiceTest.findMany()
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
   * `prisma.practiceTest`: Exposes CRUD operations for the **PracticeTest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PracticeTests
    * const practiceTests = await prisma.practiceTest.findMany()
    * ```
    */
  get practiceTest(): Prisma.PracticeTestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.examSection`: Exposes CRUD operations for the **ExamSection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExamSections
    * const examSections = await prisma.examSection.findMany()
    * ```
    */
  get examSection(): Prisma.ExamSectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.examPart`: Exposes CRUD operations for the **ExamPart** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExamParts
    * const examParts = await prisma.examPart.findMany()
    * ```
    */
  get examPart(): Prisma.ExamPartDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.questionGroup`: Exposes CRUD operations for the **QuestionGroup** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more QuestionGroups
    * const questionGroups = await prisma.questionGroup.findMany()
    * ```
    */
  get questionGroup(): Prisma.QuestionGroupDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.question`: Exposes CRUD operations for the **Question** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Questions
    * const questions = await prisma.question.findMany()
    * ```
    */
  get question(): Prisma.QuestionDelegate<ExtArgs, ClientOptions>;
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
    PracticeTest: 'PracticeTest',
    ExamSection: 'ExamSection',
    ExamPart: 'ExamPart',
    QuestionGroup: 'QuestionGroup',
    Question: 'Question'
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
      modelProps: "practiceTest" | "examSection" | "examPart" | "questionGroup" | "question"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      PracticeTest: {
        payload: Prisma.$PracticeTestPayload<ExtArgs>
        fields: Prisma.PracticeTestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PracticeTestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeTestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PracticeTestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeTestPayload>
          }
          findFirst: {
            args: Prisma.PracticeTestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeTestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PracticeTestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeTestPayload>
          }
          findMany: {
            args: Prisma.PracticeTestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeTestPayload>[]
          }
          create: {
            args: Prisma.PracticeTestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeTestPayload>
          }
          createMany: {
            args: Prisma.PracticeTestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PracticeTestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeTestPayload>[]
          }
          delete: {
            args: Prisma.PracticeTestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeTestPayload>
          }
          update: {
            args: Prisma.PracticeTestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeTestPayload>
          }
          deleteMany: {
            args: Prisma.PracticeTestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PracticeTestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PracticeTestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeTestPayload>[]
          }
          upsert: {
            args: Prisma.PracticeTestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeTestPayload>
          }
          aggregate: {
            args: Prisma.PracticeTestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePracticeTest>
          }
          groupBy: {
            args: Prisma.PracticeTestGroupByArgs<ExtArgs>
            result: $Utils.Optional<PracticeTestGroupByOutputType>[]
          }
          count: {
            args: Prisma.PracticeTestCountArgs<ExtArgs>
            result: $Utils.Optional<PracticeTestCountAggregateOutputType> | number
          }
        }
      }
      ExamSection: {
        payload: Prisma.$ExamSectionPayload<ExtArgs>
        fields: Prisma.ExamSectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExamSectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamSectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExamSectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamSectionPayload>
          }
          findFirst: {
            args: Prisma.ExamSectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamSectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExamSectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamSectionPayload>
          }
          findMany: {
            args: Prisma.ExamSectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamSectionPayload>[]
          }
          create: {
            args: Prisma.ExamSectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamSectionPayload>
          }
          createMany: {
            args: Prisma.ExamSectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExamSectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamSectionPayload>[]
          }
          delete: {
            args: Prisma.ExamSectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamSectionPayload>
          }
          update: {
            args: Prisma.ExamSectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamSectionPayload>
          }
          deleteMany: {
            args: Prisma.ExamSectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExamSectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExamSectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamSectionPayload>[]
          }
          upsert: {
            args: Prisma.ExamSectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamSectionPayload>
          }
          aggregate: {
            args: Prisma.ExamSectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExamSection>
          }
          groupBy: {
            args: Prisma.ExamSectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExamSectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExamSectionCountArgs<ExtArgs>
            result: $Utils.Optional<ExamSectionCountAggregateOutputType> | number
          }
        }
      }
      ExamPart: {
        payload: Prisma.$ExamPartPayload<ExtArgs>
        fields: Prisma.ExamPartFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExamPartFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPartPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExamPartFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPartPayload>
          }
          findFirst: {
            args: Prisma.ExamPartFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPartPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExamPartFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPartPayload>
          }
          findMany: {
            args: Prisma.ExamPartFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPartPayload>[]
          }
          create: {
            args: Prisma.ExamPartCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPartPayload>
          }
          createMany: {
            args: Prisma.ExamPartCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ExamPartCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPartPayload>[]
          }
          delete: {
            args: Prisma.ExamPartDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPartPayload>
          }
          update: {
            args: Prisma.ExamPartUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPartPayload>
          }
          deleteMany: {
            args: Prisma.ExamPartDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExamPartUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ExamPartUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPartPayload>[]
          }
          upsert: {
            args: Prisma.ExamPartUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExamPartPayload>
          }
          aggregate: {
            args: Prisma.ExamPartAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExamPart>
          }
          groupBy: {
            args: Prisma.ExamPartGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExamPartGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExamPartCountArgs<ExtArgs>
            result: $Utils.Optional<ExamPartCountAggregateOutputType> | number
          }
        }
      }
      QuestionGroup: {
        payload: Prisma.$QuestionGroupPayload<ExtArgs>
        fields: Prisma.QuestionGroupFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuestionGroupFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionGroupPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuestionGroupFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionGroupPayload>
          }
          findFirst: {
            args: Prisma.QuestionGroupFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionGroupPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuestionGroupFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionGroupPayload>
          }
          findMany: {
            args: Prisma.QuestionGroupFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionGroupPayload>[]
          }
          create: {
            args: Prisma.QuestionGroupCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionGroupPayload>
          }
          createMany: {
            args: Prisma.QuestionGroupCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuestionGroupCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionGroupPayload>[]
          }
          delete: {
            args: Prisma.QuestionGroupDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionGroupPayload>
          }
          update: {
            args: Prisma.QuestionGroupUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionGroupPayload>
          }
          deleteMany: {
            args: Prisma.QuestionGroupDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuestionGroupUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuestionGroupUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionGroupPayload>[]
          }
          upsert: {
            args: Prisma.QuestionGroupUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionGroupPayload>
          }
          aggregate: {
            args: Prisma.QuestionGroupAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestionGroup>
          }
          groupBy: {
            args: Prisma.QuestionGroupGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuestionGroupGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuestionGroupCountArgs<ExtArgs>
            result: $Utils.Optional<QuestionGroupCountAggregateOutputType> | number
          }
        }
      }
      Question: {
        payload: Prisma.$QuestionPayload<ExtArgs>
        fields: Prisma.QuestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QuestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QuestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          findFirst: {
            args: Prisma.QuestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QuestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          findMany: {
            args: Prisma.QuestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          create: {
            args: Prisma.QuestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          createMany: {
            args: Prisma.QuestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QuestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          delete: {
            args: Prisma.QuestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          update: {
            args: Prisma.QuestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          deleteMany: {
            args: Prisma.QuestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QuestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QuestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>[]
          }
          upsert: {
            args: Prisma.QuestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QuestionPayload>
          }
          aggregate: {
            args: Prisma.QuestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQuestion>
          }
          groupBy: {
            args: Prisma.QuestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<QuestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.QuestionCountArgs<ExtArgs>
            result: $Utils.Optional<QuestionCountAggregateOutputType> | number
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
    practiceTest?: PracticeTestOmit
    examSection?: ExamSectionOmit
    examPart?: ExamPartOmit
    questionGroup?: QuestionGroupOmit
    question?: QuestionOmit
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
   * Count Type PracticeTestCountOutputType
   */

  export type PracticeTestCountOutputType = {
    sections: number
  }

  export type PracticeTestCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sections?: boolean | PracticeTestCountOutputTypeCountSectionsArgs
  }

  // Custom InputTypes
  /**
   * PracticeTestCountOutputType without action
   */
  export type PracticeTestCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTestCountOutputType
     */
    select?: PracticeTestCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PracticeTestCountOutputType without action
   */
  export type PracticeTestCountOutputTypeCountSectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamSectionWhereInput
  }


  /**
   * Count Type ExamSectionCountOutputType
   */

  export type ExamSectionCountOutputType = {
    parts: number
  }

  export type ExamSectionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parts?: boolean | ExamSectionCountOutputTypeCountPartsArgs
  }

  // Custom InputTypes
  /**
   * ExamSectionCountOutputType without action
   */
  export type ExamSectionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSectionCountOutputType
     */
    select?: ExamSectionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExamSectionCountOutputType without action
   */
  export type ExamSectionCountOutputTypeCountPartsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamPartWhereInput
  }


  /**
   * Count Type ExamPartCountOutputType
   */

  export type ExamPartCountOutputType = {
    questionGroups: number
  }

  export type ExamPartCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questionGroups?: boolean | ExamPartCountOutputTypeCountQuestionGroupsArgs
  }

  // Custom InputTypes
  /**
   * ExamPartCountOutputType without action
   */
  export type ExamPartCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPartCountOutputType
     */
    select?: ExamPartCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExamPartCountOutputType without action
   */
  export type ExamPartCountOutputTypeCountQuestionGroupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionGroupWhereInput
  }


  /**
   * Count Type QuestionGroupCountOutputType
   */

  export type QuestionGroupCountOutputType = {
    questions: number
  }

  export type QuestionGroupCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | QuestionGroupCountOutputTypeCountQuestionsArgs
  }

  // Custom InputTypes
  /**
   * QuestionGroupCountOutputType without action
   */
  export type QuestionGroupCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroupCountOutputType
     */
    select?: QuestionGroupCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuestionGroupCountOutputType without action
   */
  export type QuestionGroupCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model PracticeTest
   */

  export type AggregatePracticeTest = {
    _count: PracticeTestCountAggregateOutputType | null
    _avg: PracticeTestAvgAggregateOutputType | null
    _sum: PracticeTestSumAggregateOutputType | null
    _min: PracticeTestMinAggregateOutputType | null
    _max: PracticeTestMaxAggregateOutputType | null
  }

  export type PracticeTestAvgAggregateOutputType = {
    duration: number | null
  }

  export type PracticeTestSumAggregateOutputType = {
    duration: number | null
  }

  export type PracticeTestMinAggregateOutputType = {
    id: string | null
    title: string | null
    examType: $Enums.ExamType | null
    status: string | null
    duration: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PracticeTestMaxAggregateOutputType = {
    id: string | null
    title: string | null
    examType: $Enums.ExamType | null
    status: string | null
    duration: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PracticeTestCountAggregateOutputType = {
    id: number
    title: number
    examType: number
    status: number
    duration: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PracticeTestAvgAggregateInputType = {
    duration?: true
  }

  export type PracticeTestSumAggregateInputType = {
    duration?: true
  }

  export type PracticeTestMinAggregateInputType = {
    id?: true
    title?: true
    examType?: true
    status?: true
    duration?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PracticeTestMaxAggregateInputType = {
    id?: true
    title?: true
    examType?: true
    status?: true
    duration?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PracticeTestCountAggregateInputType = {
    id?: true
    title?: true
    examType?: true
    status?: true
    duration?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PracticeTestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PracticeTest to aggregate.
     */
    where?: PracticeTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PracticeTests to fetch.
     */
    orderBy?: PracticeTestOrderByWithRelationInput | PracticeTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PracticeTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PracticeTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PracticeTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PracticeTests
    **/
    _count?: true | PracticeTestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PracticeTestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PracticeTestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PracticeTestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PracticeTestMaxAggregateInputType
  }

  export type GetPracticeTestAggregateType<T extends PracticeTestAggregateArgs> = {
        [P in keyof T & keyof AggregatePracticeTest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePracticeTest[P]>
      : GetScalarType<T[P], AggregatePracticeTest[P]>
  }




  export type PracticeTestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PracticeTestWhereInput
    orderBy?: PracticeTestOrderByWithAggregationInput | PracticeTestOrderByWithAggregationInput[]
    by: PracticeTestScalarFieldEnum[] | PracticeTestScalarFieldEnum
    having?: PracticeTestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PracticeTestCountAggregateInputType | true
    _avg?: PracticeTestAvgAggregateInputType
    _sum?: PracticeTestSumAggregateInputType
    _min?: PracticeTestMinAggregateInputType
    _max?: PracticeTestMaxAggregateInputType
  }

  export type PracticeTestGroupByOutputType = {
    id: string
    title: string
    examType: $Enums.ExamType
    status: string
    duration: number
    createdAt: Date
    updatedAt: Date
    _count: PracticeTestCountAggregateOutputType | null
    _avg: PracticeTestAvgAggregateOutputType | null
    _sum: PracticeTestSumAggregateOutputType | null
    _min: PracticeTestMinAggregateOutputType | null
    _max: PracticeTestMaxAggregateOutputType | null
  }

  type GetPracticeTestGroupByPayload<T extends PracticeTestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PracticeTestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PracticeTestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PracticeTestGroupByOutputType[P]>
            : GetScalarType<T[P], PracticeTestGroupByOutputType[P]>
        }
      >
    >


  export type PracticeTestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    examType?: boolean
    status?: boolean
    duration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sections?: boolean | PracticeTest$sectionsArgs<ExtArgs>
    _count?: boolean | PracticeTestCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practiceTest"]>

  export type PracticeTestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    examType?: boolean
    status?: boolean
    duration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["practiceTest"]>

  export type PracticeTestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    examType?: boolean
    status?: boolean
    duration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["practiceTest"]>

  export type PracticeTestSelectScalar = {
    id?: boolean
    title?: boolean
    examType?: boolean
    status?: boolean
    duration?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PracticeTestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "examType" | "status" | "duration" | "createdAt" | "updatedAt", ExtArgs["result"]["practiceTest"]>
  export type PracticeTestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sections?: boolean | PracticeTest$sectionsArgs<ExtArgs>
    _count?: boolean | PracticeTestCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PracticeTestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PracticeTestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PracticeTestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PracticeTest"
    objects: {
      sections: Prisma.$ExamSectionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      examType: $Enums.ExamType
      status: string
      duration: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["practiceTest"]>
    composites: {}
  }

  type PracticeTestGetPayload<S extends boolean | null | undefined | PracticeTestDefaultArgs> = $Result.GetResult<Prisma.$PracticeTestPayload, S>

  type PracticeTestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PracticeTestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PracticeTestCountAggregateInputType | true
    }

  export interface PracticeTestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PracticeTest'], meta: { name: 'PracticeTest' } }
    /**
     * Find zero or one PracticeTest that matches the filter.
     * @param {PracticeTestFindUniqueArgs} args - Arguments to find a PracticeTest
     * @example
     * // Get one PracticeTest
     * const practiceTest = await prisma.practiceTest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PracticeTestFindUniqueArgs>(args: SelectSubset<T, PracticeTestFindUniqueArgs<ExtArgs>>): Prisma__PracticeTestClient<$Result.GetResult<Prisma.$PracticeTestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PracticeTest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PracticeTestFindUniqueOrThrowArgs} args - Arguments to find a PracticeTest
     * @example
     * // Get one PracticeTest
     * const practiceTest = await prisma.practiceTest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PracticeTestFindUniqueOrThrowArgs>(args: SelectSubset<T, PracticeTestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PracticeTestClient<$Result.GetResult<Prisma.$PracticeTestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PracticeTest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeTestFindFirstArgs} args - Arguments to find a PracticeTest
     * @example
     * // Get one PracticeTest
     * const practiceTest = await prisma.practiceTest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PracticeTestFindFirstArgs>(args?: SelectSubset<T, PracticeTestFindFirstArgs<ExtArgs>>): Prisma__PracticeTestClient<$Result.GetResult<Prisma.$PracticeTestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PracticeTest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeTestFindFirstOrThrowArgs} args - Arguments to find a PracticeTest
     * @example
     * // Get one PracticeTest
     * const practiceTest = await prisma.practiceTest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PracticeTestFindFirstOrThrowArgs>(args?: SelectSubset<T, PracticeTestFindFirstOrThrowArgs<ExtArgs>>): Prisma__PracticeTestClient<$Result.GetResult<Prisma.$PracticeTestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PracticeTests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeTestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PracticeTests
     * const practiceTests = await prisma.practiceTest.findMany()
     * 
     * // Get first 10 PracticeTests
     * const practiceTests = await prisma.practiceTest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const practiceTestWithIdOnly = await prisma.practiceTest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PracticeTestFindManyArgs>(args?: SelectSubset<T, PracticeTestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PracticeTestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PracticeTest.
     * @param {PracticeTestCreateArgs} args - Arguments to create a PracticeTest.
     * @example
     * // Create one PracticeTest
     * const PracticeTest = await prisma.practiceTest.create({
     *   data: {
     *     // ... data to create a PracticeTest
     *   }
     * })
     * 
     */
    create<T extends PracticeTestCreateArgs>(args: SelectSubset<T, PracticeTestCreateArgs<ExtArgs>>): Prisma__PracticeTestClient<$Result.GetResult<Prisma.$PracticeTestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PracticeTests.
     * @param {PracticeTestCreateManyArgs} args - Arguments to create many PracticeTests.
     * @example
     * // Create many PracticeTests
     * const practiceTest = await prisma.practiceTest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PracticeTestCreateManyArgs>(args?: SelectSubset<T, PracticeTestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PracticeTests and returns the data saved in the database.
     * @param {PracticeTestCreateManyAndReturnArgs} args - Arguments to create many PracticeTests.
     * @example
     * // Create many PracticeTests
     * const practiceTest = await prisma.practiceTest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PracticeTests and only return the `id`
     * const practiceTestWithIdOnly = await prisma.practiceTest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PracticeTestCreateManyAndReturnArgs>(args?: SelectSubset<T, PracticeTestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PracticeTestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PracticeTest.
     * @param {PracticeTestDeleteArgs} args - Arguments to delete one PracticeTest.
     * @example
     * // Delete one PracticeTest
     * const PracticeTest = await prisma.practiceTest.delete({
     *   where: {
     *     // ... filter to delete one PracticeTest
     *   }
     * })
     * 
     */
    delete<T extends PracticeTestDeleteArgs>(args: SelectSubset<T, PracticeTestDeleteArgs<ExtArgs>>): Prisma__PracticeTestClient<$Result.GetResult<Prisma.$PracticeTestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PracticeTest.
     * @param {PracticeTestUpdateArgs} args - Arguments to update one PracticeTest.
     * @example
     * // Update one PracticeTest
     * const practiceTest = await prisma.practiceTest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PracticeTestUpdateArgs>(args: SelectSubset<T, PracticeTestUpdateArgs<ExtArgs>>): Prisma__PracticeTestClient<$Result.GetResult<Prisma.$PracticeTestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PracticeTests.
     * @param {PracticeTestDeleteManyArgs} args - Arguments to filter PracticeTests to delete.
     * @example
     * // Delete a few PracticeTests
     * const { count } = await prisma.practiceTest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PracticeTestDeleteManyArgs>(args?: SelectSubset<T, PracticeTestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PracticeTests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeTestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PracticeTests
     * const practiceTest = await prisma.practiceTest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PracticeTestUpdateManyArgs>(args: SelectSubset<T, PracticeTestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PracticeTests and returns the data updated in the database.
     * @param {PracticeTestUpdateManyAndReturnArgs} args - Arguments to update many PracticeTests.
     * @example
     * // Update many PracticeTests
     * const practiceTest = await prisma.practiceTest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PracticeTests and only return the `id`
     * const practiceTestWithIdOnly = await prisma.practiceTest.updateManyAndReturn({
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
    updateManyAndReturn<T extends PracticeTestUpdateManyAndReturnArgs>(args: SelectSubset<T, PracticeTestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PracticeTestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PracticeTest.
     * @param {PracticeTestUpsertArgs} args - Arguments to update or create a PracticeTest.
     * @example
     * // Update or create a PracticeTest
     * const practiceTest = await prisma.practiceTest.upsert({
     *   create: {
     *     // ... data to create a PracticeTest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PracticeTest we want to update
     *   }
     * })
     */
    upsert<T extends PracticeTestUpsertArgs>(args: SelectSubset<T, PracticeTestUpsertArgs<ExtArgs>>): Prisma__PracticeTestClient<$Result.GetResult<Prisma.$PracticeTestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PracticeTests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeTestCountArgs} args - Arguments to filter PracticeTests to count.
     * @example
     * // Count the number of PracticeTests
     * const count = await prisma.practiceTest.count({
     *   where: {
     *     // ... the filter for the PracticeTests we want to count
     *   }
     * })
    **/
    count<T extends PracticeTestCountArgs>(
      args?: Subset<T, PracticeTestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PracticeTestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PracticeTest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeTestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PracticeTestAggregateArgs>(args: Subset<T, PracticeTestAggregateArgs>): Prisma.PrismaPromise<GetPracticeTestAggregateType<T>>

    /**
     * Group by PracticeTest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeTestGroupByArgs} args - Group by arguments.
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
      T extends PracticeTestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PracticeTestGroupByArgs['orderBy'] }
        : { orderBy?: PracticeTestGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PracticeTestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPracticeTestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PracticeTest model
   */
  readonly fields: PracticeTestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PracticeTest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PracticeTestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sections<T extends PracticeTest$sectionsArgs<ExtArgs> = {}>(args?: Subset<T, PracticeTest$sectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the PracticeTest model
   */
  interface PracticeTestFieldRefs {
    readonly id: FieldRef<"PracticeTest", 'String'>
    readonly title: FieldRef<"PracticeTest", 'String'>
    readonly examType: FieldRef<"PracticeTest", 'ExamType'>
    readonly status: FieldRef<"PracticeTest", 'String'>
    readonly duration: FieldRef<"PracticeTest", 'Int'>
    readonly createdAt: FieldRef<"PracticeTest", 'DateTime'>
    readonly updatedAt: FieldRef<"PracticeTest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PracticeTest findUnique
   */
  export type PracticeTestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTest
     */
    select?: PracticeTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeTest
     */
    omit?: PracticeTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeTestInclude<ExtArgs> | null
    /**
     * Filter, which PracticeTest to fetch.
     */
    where: PracticeTestWhereUniqueInput
  }

  /**
   * PracticeTest findUniqueOrThrow
   */
  export type PracticeTestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTest
     */
    select?: PracticeTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeTest
     */
    omit?: PracticeTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeTestInclude<ExtArgs> | null
    /**
     * Filter, which PracticeTest to fetch.
     */
    where: PracticeTestWhereUniqueInput
  }

  /**
   * PracticeTest findFirst
   */
  export type PracticeTestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTest
     */
    select?: PracticeTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeTest
     */
    omit?: PracticeTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeTestInclude<ExtArgs> | null
    /**
     * Filter, which PracticeTest to fetch.
     */
    where?: PracticeTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PracticeTests to fetch.
     */
    orderBy?: PracticeTestOrderByWithRelationInput | PracticeTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PracticeTests.
     */
    cursor?: PracticeTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PracticeTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PracticeTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PracticeTests.
     */
    distinct?: PracticeTestScalarFieldEnum | PracticeTestScalarFieldEnum[]
  }

  /**
   * PracticeTest findFirstOrThrow
   */
  export type PracticeTestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTest
     */
    select?: PracticeTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeTest
     */
    omit?: PracticeTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeTestInclude<ExtArgs> | null
    /**
     * Filter, which PracticeTest to fetch.
     */
    where?: PracticeTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PracticeTests to fetch.
     */
    orderBy?: PracticeTestOrderByWithRelationInput | PracticeTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PracticeTests.
     */
    cursor?: PracticeTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PracticeTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PracticeTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PracticeTests.
     */
    distinct?: PracticeTestScalarFieldEnum | PracticeTestScalarFieldEnum[]
  }

  /**
   * PracticeTest findMany
   */
  export type PracticeTestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTest
     */
    select?: PracticeTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeTest
     */
    omit?: PracticeTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeTestInclude<ExtArgs> | null
    /**
     * Filter, which PracticeTests to fetch.
     */
    where?: PracticeTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PracticeTests to fetch.
     */
    orderBy?: PracticeTestOrderByWithRelationInput | PracticeTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PracticeTests.
     */
    cursor?: PracticeTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PracticeTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PracticeTests.
     */
    skip?: number
    distinct?: PracticeTestScalarFieldEnum | PracticeTestScalarFieldEnum[]
  }

  /**
   * PracticeTest create
   */
  export type PracticeTestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTest
     */
    select?: PracticeTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeTest
     */
    omit?: PracticeTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeTestInclude<ExtArgs> | null
    /**
     * The data needed to create a PracticeTest.
     */
    data: XOR<PracticeTestCreateInput, PracticeTestUncheckedCreateInput>
  }

  /**
   * PracticeTest createMany
   */
  export type PracticeTestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PracticeTests.
     */
    data: PracticeTestCreateManyInput | PracticeTestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PracticeTest createManyAndReturn
   */
  export type PracticeTestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTest
     */
    select?: PracticeTestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeTest
     */
    omit?: PracticeTestOmit<ExtArgs> | null
    /**
     * The data used to create many PracticeTests.
     */
    data: PracticeTestCreateManyInput | PracticeTestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PracticeTest update
   */
  export type PracticeTestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTest
     */
    select?: PracticeTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeTest
     */
    omit?: PracticeTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeTestInclude<ExtArgs> | null
    /**
     * The data needed to update a PracticeTest.
     */
    data: XOR<PracticeTestUpdateInput, PracticeTestUncheckedUpdateInput>
    /**
     * Choose, which PracticeTest to update.
     */
    where: PracticeTestWhereUniqueInput
  }

  /**
   * PracticeTest updateMany
   */
  export type PracticeTestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PracticeTests.
     */
    data: XOR<PracticeTestUpdateManyMutationInput, PracticeTestUncheckedUpdateManyInput>
    /**
     * Filter which PracticeTests to update
     */
    where?: PracticeTestWhereInput
    /**
     * Limit how many PracticeTests to update.
     */
    limit?: number
  }

  /**
   * PracticeTest updateManyAndReturn
   */
  export type PracticeTestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTest
     */
    select?: PracticeTestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeTest
     */
    omit?: PracticeTestOmit<ExtArgs> | null
    /**
     * The data used to update PracticeTests.
     */
    data: XOR<PracticeTestUpdateManyMutationInput, PracticeTestUncheckedUpdateManyInput>
    /**
     * Filter which PracticeTests to update
     */
    where?: PracticeTestWhereInput
    /**
     * Limit how many PracticeTests to update.
     */
    limit?: number
  }

  /**
   * PracticeTest upsert
   */
  export type PracticeTestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTest
     */
    select?: PracticeTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeTest
     */
    omit?: PracticeTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeTestInclude<ExtArgs> | null
    /**
     * The filter to search for the PracticeTest to update in case it exists.
     */
    where: PracticeTestWhereUniqueInput
    /**
     * In case the PracticeTest found by the `where` argument doesn't exist, create a new PracticeTest with this data.
     */
    create: XOR<PracticeTestCreateInput, PracticeTestUncheckedCreateInput>
    /**
     * In case the PracticeTest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PracticeTestUpdateInput, PracticeTestUncheckedUpdateInput>
  }

  /**
   * PracticeTest delete
   */
  export type PracticeTestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTest
     */
    select?: PracticeTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeTest
     */
    omit?: PracticeTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeTestInclude<ExtArgs> | null
    /**
     * Filter which PracticeTest to delete.
     */
    where: PracticeTestWhereUniqueInput
  }

  /**
   * PracticeTest deleteMany
   */
  export type PracticeTestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PracticeTests to delete
     */
    where?: PracticeTestWhereInput
    /**
     * Limit how many PracticeTests to delete.
     */
    limit?: number
  }

  /**
   * PracticeTest.sections
   */
  export type PracticeTest$sectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionInclude<ExtArgs> | null
    where?: ExamSectionWhereInput
    orderBy?: ExamSectionOrderByWithRelationInput | ExamSectionOrderByWithRelationInput[]
    cursor?: ExamSectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExamSectionScalarFieldEnum | ExamSectionScalarFieldEnum[]
  }

  /**
   * PracticeTest without action
   */
  export type PracticeTestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeTest
     */
    select?: PracticeTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeTest
     */
    omit?: PracticeTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeTestInclude<ExtArgs> | null
  }


  /**
   * Model ExamSection
   */

  export type AggregateExamSection = {
    _count: ExamSectionCountAggregateOutputType | null
    _avg: ExamSectionAvgAggregateOutputType | null
    _sum: ExamSectionSumAggregateOutputType | null
    _min: ExamSectionMinAggregateOutputType | null
    _max: ExamSectionMaxAggregateOutputType | null
  }

  export type ExamSectionAvgAggregateOutputType = {
    orderIndex: number | null
  }

  export type ExamSectionSumAggregateOutputType = {
    orderIndex: number | null
  }

  export type ExamSectionMinAggregateOutputType = {
    id: string | null
    practiceTestId: string | null
    name: string | null
    orderIndex: number | null
  }

  export type ExamSectionMaxAggregateOutputType = {
    id: string | null
    practiceTestId: string | null
    name: string | null
    orderIndex: number | null
  }

  export type ExamSectionCountAggregateOutputType = {
    id: number
    practiceTestId: number
    name: number
    orderIndex: number
    _all: number
  }


  export type ExamSectionAvgAggregateInputType = {
    orderIndex?: true
  }

  export type ExamSectionSumAggregateInputType = {
    orderIndex?: true
  }

  export type ExamSectionMinAggregateInputType = {
    id?: true
    practiceTestId?: true
    name?: true
    orderIndex?: true
  }

  export type ExamSectionMaxAggregateInputType = {
    id?: true
    practiceTestId?: true
    name?: true
    orderIndex?: true
  }

  export type ExamSectionCountAggregateInputType = {
    id?: true
    practiceTestId?: true
    name?: true
    orderIndex?: true
    _all?: true
  }

  export type ExamSectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamSection to aggregate.
     */
    where?: ExamSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamSections to fetch.
     */
    orderBy?: ExamSectionOrderByWithRelationInput | ExamSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExamSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExamSections
    **/
    _count?: true | ExamSectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExamSectionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExamSectionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExamSectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExamSectionMaxAggregateInputType
  }

  export type GetExamSectionAggregateType<T extends ExamSectionAggregateArgs> = {
        [P in keyof T & keyof AggregateExamSection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExamSection[P]>
      : GetScalarType<T[P], AggregateExamSection[P]>
  }




  export type ExamSectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamSectionWhereInput
    orderBy?: ExamSectionOrderByWithAggregationInput | ExamSectionOrderByWithAggregationInput[]
    by: ExamSectionScalarFieldEnum[] | ExamSectionScalarFieldEnum
    having?: ExamSectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExamSectionCountAggregateInputType | true
    _avg?: ExamSectionAvgAggregateInputType
    _sum?: ExamSectionSumAggregateInputType
    _min?: ExamSectionMinAggregateInputType
    _max?: ExamSectionMaxAggregateInputType
  }

  export type ExamSectionGroupByOutputType = {
    id: string
    practiceTestId: string
    name: string
    orderIndex: number
    _count: ExamSectionCountAggregateOutputType | null
    _avg: ExamSectionAvgAggregateOutputType | null
    _sum: ExamSectionSumAggregateOutputType | null
    _min: ExamSectionMinAggregateOutputType | null
    _max: ExamSectionMaxAggregateOutputType | null
  }

  type GetExamSectionGroupByPayload<T extends ExamSectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExamSectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExamSectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExamSectionGroupByOutputType[P]>
            : GetScalarType<T[P], ExamSectionGroupByOutputType[P]>
        }
      >
    >


  export type ExamSectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practiceTestId?: boolean
    name?: boolean
    orderIndex?: boolean
    test?: boolean | PracticeTestDefaultArgs<ExtArgs>
    parts?: boolean | ExamSection$partsArgs<ExtArgs>
    _count?: boolean | ExamSectionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examSection"]>

  export type ExamSectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practiceTestId?: boolean
    name?: boolean
    orderIndex?: boolean
    test?: boolean | PracticeTestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examSection"]>

  export type ExamSectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practiceTestId?: boolean
    name?: boolean
    orderIndex?: boolean
    test?: boolean | PracticeTestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examSection"]>

  export type ExamSectionSelectScalar = {
    id?: boolean
    practiceTestId?: boolean
    name?: boolean
    orderIndex?: boolean
  }

  export type ExamSectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "practiceTestId" | "name" | "orderIndex", ExtArgs["result"]["examSection"]>
  export type ExamSectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | PracticeTestDefaultArgs<ExtArgs>
    parts?: boolean | ExamSection$partsArgs<ExtArgs>
    _count?: boolean | ExamSectionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExamSectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | PracticeTestDefaultArgs<ExtArgs>
  }
  export type ExamSectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | PracticeTestDefaultArgs<ExtArgs>
  }

  export type $ExamSectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExamSection"
    objects: {
      test: Prisma.$PracticeTestPayload<ExtArgs>
      parts: Prisma.$ExamPartPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      practiceTestId: string
      name: string
      orderIndex: number
    }, ExtArgs["result"]["examSection"]>
    composites: {}
  }

  type ExamSectionGetPayload<S extends boolean | null | undefined | ExamSectionDefaultArgs> = $Result.GetResult<Prisma.$ExamSectionPayload, S>

  type ExamSectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExamSectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExamSectionCountAggregateInputType | true
    }

  export interface ExamSectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExamSection'], meta: { name: 'ExamSection' } }
    /**
     * Find zero or one ExamSection that matches the filter.
     * @param {ExamSectionFindUniqueArgs} args - Arguments to find a ExamSection
     * @example
     * // Get one ExamSection
     * const examSection = await prisma.examSection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExamSectionFindUniqueArgs>(args: SelectSubset<T, ExamSectionFindUniqueArgs<ExtArgs>>): Prisma__ExamSectionClient<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExamSection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExamSectionFindUniqueOrThrowArgs} args - Arguments to find a ExamSection
     * @example
     * // Get one ExamSection
     * const examSection = await prisma.examSection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExamSectionFindUniqueOrThrowArgs>(args: SelectSubset<T, ExamSectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExamSectionClient<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExamSection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamSectionFindFirstArgs} args - Arguments to find a ExamSection
     * @example
     * // Get one ExamSection
     * const examSection = await prisma.examSection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExamSectionFindFirstArgs>(args?: SelectSubset<T, ExamSectionFindFirstArgs<ExtArgs>>): Prisma__ExamSectionClient<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExamSection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamSectionFindFirstOrThrowArgs} args - Arguments to find a ExamSection
     * @example
     * // Get one ExamSection
     * const examSection = await prisma.examSection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExamSectionFindFirstOrThrowArgs>(args?: SelectSubset<T, ExamSectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExamSectionClient<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExamSections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamSectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExamSections
     * const examSections = await prisma.examSection.findMany()
     * 
     * // Get first 10 ExamSections
     * const examSections = await prisma.examSection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const examSectionWithIdOnly = await prisma.examSection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExamSectionFindManyArgs>(args?: SelectSubset<T, ExamSectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExamSection.
     * @param {ExamSectionCreateArgs} args - Arguments to create a ExamSection.
     * @example
     * // Create one ExamSection
     * const ExamSection = await prisma.examSection.create({
     *   data: {
     *     // ... data to create a ExamSection
     *   }
     * })
     * 
     */
    create<T extends ExamSectionCreateArgs>(args: SelectSubset<T, ExamSectionCreateArgs<ExtArgs>>): Prisma__ExamSectionClient<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExamSections.
     * @param {ExamSectionCreateManyArgs} args - Arguments to create many ExamSections.
     * @example
     * // Create many ExamSections
     * const examSection = await prisma.examSection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExamSectionCreateManyArgs>(args?: SelectSubset<T, ExamSectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExamSections and returns the data saved in the database.
     * @param {ExamSectionCreateManyAndReturnArgs} args - Arguments to create many ExamSections.
     * @example
     * // Create many ExamSections
     * const examSection = await prisma.examSection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExamSections and only return the `id`
     * const examSectionWithIdOnly = await prisma.examSection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExamSectionCreateManyAndReturnArgs>(args?: SelectSubset<T, ExamSectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExamSection.
     * @param {ExamSectionDeleteArgs} args - Arguments to delete one ExamSection.
     * @example
     * // Delete one ExamSection
     * const ExamSection = await prisma.examSection.delete({
     *   where: {
     *     // ... filter to delete one ExamSection
     *   }
     * })
     * 
     */
    delete<T extends ExamSectionDeleteArgs>(args: SelectSubset<T, ExamSectionDeleteArgs<ExtArgs>>): Prisma__ExamSectionClient<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExamSection.
     * @param {ExamSectionUpdateArgs} args - Arguments to update one ExamSection.
     * @example
     * // Update one ExamSection
     * const examSection = await prisma.examSection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExamSectionUpdateArgs>(args: SelectSubset<T, ExamSectionUpdateArgs<ExtArgs>>): Prisma__ExamSectionClient<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExamSections.
     * @param {ExamSectionDeleteManyArgs} args - Arguments to filter ExamSections to delete.
     * @example
     * // Delete a few ExamSections
     * const { count } = await prisma.examSection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExamSectionDeleteManyArgs>(args?: SelectSubset<T, ExamSectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamSections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamSectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExamSections
     * const examSection = await prisma.examSection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExamSectionUpdateManyArgs>(args: SelectSubset<T, ExamSectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamSections and returns the data updated in the database.
     * @param {ExamSectionUpdateManyAndReturnArgs} args - Arguments to update many ExamSections.
     * @example
     * // Update many ExamSections
     * const examSection = await prisma.examSection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExamSections and only return the `id`
     * const examSectionWithIdOnly = await prisma.examSection.updateManyAndReturn({
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
    updateManyAndReturn<T extends ExamSectionUpdateManyAndReturnArgs>(args: SelectSubset<T, ExamSectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExamSection.
     * @param {ExamSectionUpsertArgs} args - Arguments to update or create a ExamSection.
     * @example
     * // Update or create a ExamSection
     * const examSection = await prisma.examSection.upsert({
     *   create: {
     *     // ... data to create a ExamSection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExamSection we want to update
     *   }
     * })
     */
    upsert<T extends ExamSectionUpsertArgs>(args: SelectSubset<T, ExamSectionUpsertArgs<ExtArgs>>): Prisma__ExamSectionClient<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExamSections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamSectionCountArgs} args - Arguments to filter ExamSections to count.
     * @example
     * // Count the number of ExamSections
     * const count = await prisma.examSection.count({
     *   where: {
     *     // ... the filter for the ExamSections we want to count
     *   }
     * })
    **/
    count<T extends ExamSectionCountArgs>(
      args?: Subset<T, ExamSectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExamSectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExamSection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamSectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ExamSectionAggregateArgs>(args: Subset<T, ExamSectionAggregateArgs>): Prisma.PrismaPromise<GetExamSectionAggregateType<T>>

    /**
     * Group by ExamSection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamSectionGroupByArgs} args - Group by arguments.
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
      T extends ExamSectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExamSectionGroupByArgs['orderBy'] }
        : { orderBy?: ExamSectionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ExamSectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExamSectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExamSection model
   */
  readonly fields: ExamSectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExamSection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExamSectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    test<T extends PracticeTestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PracticeTestDefaultArgs<ExtArgs>>): Prisma__PracticeTestClient<$Result.GetResult<Prisma.$PracticeTestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    parts<T extends ExamSection$partsArgs<ExtArgs> = {}>(args?: Subset<T, ExamSection$partsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ExamSection model
   */
  interface ExamSectionFieldRefs {
    readonly id: FieldRef<"ExamSection", 'String'>
    readonly practiceTestId: FieldRef<"ExamSection", 'String'>
    readonly name: FieldRef<"ExamSection", 'String'>
    readonly orderIndex: FieldRef<"ExamSection", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ExamSection findUnique
   */
  export type ExamSectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionInclude<ExtArgs> | null
    /**
     * Filter, which ExamSection to fetch.
     */
    where: ExamSectionWhereUniqueInput
  }

  /**
   * ExamSection findUniqueOrThrow
   */
  export type ExamSectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionInclude<ExtArgs> | null
    /**
     * Filter, which ExamSection to fetch.
     */
    where: ExamSectionWhereUniqueInput
  }

  /**
   * ExamSection findFirst
   */
  export type ExamSectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionInclude<ExtArgs> | null
    /**
     * Filter, which ExamSection to fetch.
     */
    where?: ExamSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamSections to fetch.
     */
    orderBy?: ExamSectionOrderByWithRelationInput | ExamSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamSections.
     */
    cursor?: ExamSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamSections.
     */
    distinct?: ExamSectionScalarFieldEnum | ExamSectionScalarFieldEnum[]
  }

  /**
   * ExamSection findFirstOrThrow
   */
  export type ExamSectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionInclude<ExtArgs> | null
    /**
     * Filter, which ExamSection to fetch.
     */
    where?: ExamSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamSections to fetch.
     */
    orderBy?: ExamSectionOrderByWithRelationInput | ExamSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamSections.
     */
    cursor?: ExamSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamSections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamSections.
     */
    distinct?: ExamSectionScalarFieldEnum | ExamSectionScalarFieldEnum[]
  }

  /**
   * ExamSection findMany
   */
  export type ExamSectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionInclude<ExtArgs> | null
    /**
     * Filter, which ExamSections to fetch.
     */
    where?: ExamSectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamSections to fetch.
     */
    orderBy?: ExamSectionOrderByWithRelationInput | ExamSectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExamSections.
     */
    cursor?: ExamSectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamSections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamSections.
     */
    skip?: number
    distinct?: ExamSectionScalarFieldEnum | ExamSectionScalarFieldEnum[]
  }

  /**
   * ExamSection create
   */
  export type ExamSectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionInclude<ExtArgs> | null
    /**
     * The data needed to create a ExamSection.
     */
    data: XOR<ExamSectionCreateInput, ExamSectionUncheckedCreateInput>
  }

  /**
   * ExamSection createMany
   */
  export type ExamSectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExamSections.
     */
    data: ExamSectionCreateManyInput | ExamSectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExamSection createManyAndReturn
   */
  export type ExamSectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * The data used to create many ExamSections.
     */
    data: ExamSectionCreateManyInput | ExamSectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamSection update
   */
  export type ExamSectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionInclude<ExtArgs> | null
    /**
     * The data needed to update a ExamSection.
     */
    data: XOR<ExamSectionUpdateInput, ExamSectionUncheckedUpdateInput>
    /**
     * Choose, which ExamSection to update.
     */
    where: ExamSectionWhereUniqueInput
  }

  /**
   * ExamSection updateMany
   */
  export type ExamSectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExamSections.
     */
    data: XOR<ExamSectionUpdateManyMutationInput, ExamSectionUncheckedUpdateManyInput>
    /**
     * Filter which ExamSections to update
     */
    where?: ExamSectionWhereInput
    /**
     * Limit how many ExamSections to update.
     */
    limit?: number
  }

  /**
   * ExamSection updateManyAndReturn
   */
  export type ExamSectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * The data used to update ExamSections.
     */
    data: XOR<ExamSectionUpdateManyMutationInput, ExamSectionUncheckedUpdateManyInput>
    /**
     * Filter which ExamSections to update
     */
    where?: ExamSectionWhereInput
    /**
     * Limit how many ExamSections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamSection upsert
   */
  export type ExamSectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionInclude<ExtArgs> | null
    /**
     * The filter to search for the ExamSection to update in case it exists.
     */
    where: ExamSectionWhereUniqueInput
    /**
     * In case the ExamSection found by the `where` argument doesn't exist, create a new ExamSection with this data.
     */
    create: XOR<ExamSectionCreateInput, ExamSectionUncheckedCreateInput>
    /**
     * In case the ExamSection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExamSectionUpdateInput, ExamSectionUncheckedUpdateInput>
  }

  /**
   * ExamSection delete
   */
  export type ExamSectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionInclude<ExtArgs> | null
    /**
     * Filter which ExamSection to delete.
     */
    where: ExamSectionWhereUniqueInput
  }

  /**
   * ExamSection deleteMany
   */
  export type ExamSectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamSections to delete
     */
    where?: ExamSectionWhereInput
    /**
     * Limit how many ExamSections to delete.
     */
    limit?: number
  }

  /**
   * ExamSection.parts
   */
  export type ExamSection$partsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartInclude<ExtArgs> | null
    where?: ExamPartWhereInput
    orderBy?: ExamPartOrderByWithRelationInput | ExamPartOrderByWithRelationInput[]
    cursor?: ExamPartWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExamPartScalarFieldEnum | ExamPartScalarFieldEnum[]
  }

  /**
   * ExamSection without action
   */
  export type ExamSectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamSection
     */
    select?: ExamSectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamSection
     */
    omit?: ExamSectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamSectionInclude<ExtArgs> | null
  }


  /**
   * Model ExamPart
   */

  export type AggregateExamPart = {
    _count: ExamPartCountAggregateOutputType | null
    _avg: ExamPartAvgAggregateOutputType | null
    _sum: ExamPartSumAggregateOutputType | null
    _min: ExamPartMinAggregateOutputType | null
    _max: ExamPartMaxAggregateOutputType | null
  }

  export type ExamPartAvgAggregateOutputType = {
    orderIndex: number | null
  }

  export type ExamPartSumAggregateOutputType = {
    orderIndex: number | null
  }

  export type ExamPartMinAggregateOutputType = {
    id: string | null
    examSectionId: string | null
    name: string | null
    content: string | null
    mediaUrl: string | null
    orderIndex: number | null
  }

  export type ExamPartMaxAggregateOutputType = {
    id: string | null
    examSectionId: string | null
    name: string | null
    content: string | null
    mediaUrl: string | null
    orderIndex: number | null
  }

  export type ExamPartCountAggregateOutputType = {
    id: number
    examSectionId: number
    name: number
    content: number
    mediaUrl: number
    orderIndex: number
    _all: number
  }


  export type ExamPartAvgAggregateInputType = {
    orderIndex?: true
  }

  export type ExamPartSumAggregateInputType = {
    orderIndex?: true
  }

  export type ExamPartMinAggregateInputType = {
    id?: true
    examSectionId?: true
    name?: true
    content?: true
    mediaUrl?: true
    orderIndex?: true
  }

  export type ExamPartMaxAggregateInputType = {
    id?: true
    examSectionId?: true
    name?: true
    content?: true
    mediaUrl?: true
    orderIndex?: true
  }

  export type ExamPartCountAggregateInputType = {
    id?: true
    examSectionId?: true
    name?: true
    content?: true
    mediaUrl?: true
    orderIndex?: true
    _all?: true
  }

  export type ExamPartAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamPart to aggregate.
     */
    where?: ExamPartWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamParts to fetch.
     */
    orderBy?: ExamPartOrderByWithRelationInput | ExamPartOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExamPartWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamParts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamParts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExamParts
    **/
    _count?: true | ExamPartCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExamPartAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExamPartSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExamPartMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExamPartMaxAggregateInputType
  }

  export type GetExamPartAggregateType<T extends ExamPartAggregateArgs> = {
        [P in keyof T & keyof AggregateExamPart]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExamPart[P]>
      : GetScalarType<T[P], AggregateExamPart[P]>
  }




  export type ExamPartGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExamPartWhereInput
    orderBy?: ExamPartOrderByWithAggregationInput | ExamPartOrderByWithAggregationInput[]
    by: ExamPartScalarFieldEnum[] | ExamPartScalarFieldEnum
    having?: ExamPartScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExamPartCountAggregateInputType | true
    _avg?: ExamPartAvgAggregateInputType
    _sum?: ExamPartSumAggregateInputType
    _min?: ExamPartMinAggregateInputType
    _max?: ExamPartMaxAggregateInputType
  }

  export type ExamPartGroupByOutputType = {
    id: string
    examSectionId: string
    name: string
    content: string | null
    mediaUrl: string | null
    orderIndex: number
    _count: ExamPartCountAggregateOutputType | null
    _avg: ExamPartAvgAggregateOutputType | null
    _sum: ExamPartSumAggregateOutputType | null
    _min: ExamPartMinAggregateOutputType | null
    _max: ExamPartMaxAggregateOutputType | null
  }

  type GetExamPartGroupByPayload<T extends ExamPartGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExamPartGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExamPartGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExamPartGroupByOutputType[P]>
            : GetScalarType<T[P], ExamPartGroupByOutputType[P]>
        }
      >
    >


  export type ExamPartSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    examSectionId?: boolean
    name?: boolean
    content?: boolean
    mediaUrl?: boolean
    orderIndex?: boolean
    section?: boolean | ExamSectionDefaultArgs<ExtArgs>
    questionGroups?: boolean | ExamPart$questionGroupsArgs<ExtArgs>
    _count?: boolean | ExamPartCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examPart"]>

  export type ExamPartSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    examSectionId?: boolean
    name?: boolean
    content?: boolean
    mediaUrl?: boolean
    orderIndex?: boolean
    section?: boolean | ExamSectionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examPart"]>

  export type ExamPartSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    examSectionId?: boolean
    name?: boolean
    content?: boolean
    mediaUrl?: boolean
    orderIndex?: boolean
    section?: boolean | ExamSectionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["examPart"]>

  export type ExamPartSelectScalar = {
    id?: boolean
    examSectionId?: boolean
    name?: boolean
    content?: boolean
    mediaUrl?: boolean
    orderIndex?: boolean
  }

  export type ExamPartOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "examSectionId" | "name" | "content" | "mediaUrl" | "orderIndex", ExtArgs["result"]["examPart"]>
  export type ExamPartInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    section?: boolean | ExamSectionDefaultArgs<ExtArgs>
    questionGroups?: boolean | ExamPart$questionGroupsArgs<ExtArgs>
    _count?: boolean | ExamPartCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ExamPartIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    section?: boolean | ExamSectionDefaultArgs<ExtArgs>
  }
  export type ExamPartIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    section?: boolean | ExamSectionDefaultArgs<ExtArgs>
  }

  export type $ExamPartPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExamPart"
    objects: {
      section: Prisma.$ExamSectionPayload<ExtArgs>
      questionGroups: Prisma.$QuestionGroupPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      examSectionId: string
      name: string
      content: string | null
      mediaUrl: string | null
      orderIndex: number
    }, ExtArgs["result"]["examPart"]>
    composites: {}
  }

  type ExamPartGetPayload<S extends boolean | null | undefined | ExamPartDefaultArgs> = $Result.GetResult<Prisma.$ExamPartPayload, S>

  type ExamPartCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExamPartFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExamPartCountAggregateInputType | true
    }

  export interface ExamPartDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExamPart'], meta: { name: 'ExamPart' } }
    /**
     * Find zero or one ExamPart that matches the filter.
     * @param {ExamPartFindUniqueArgs} args - Arguments to find a ExamPart
     * @example
     * // Get one ExamPart
     * const examPart = await prisma.examPart.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExamPartFindUniqueArgs>(args: SelectSubset<T, ExamPartFindUniqueArgs<ExtArgs>>): Prisma__ExamPartClient<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExamPart that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExamPartFindUniqueOrThrowArgs} args - Arguments to find a ExamPart
     * @example
     * // Get one ExamPart
     * const examPart = await prisma.examPart.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExamPartFindUniqueOrThrowArgs>(args: SelectSubset<T, ExamPartFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExamPartClient<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExamPart that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamPartFindFirstArgs} args - Arguments to find a ExamPart
     * @example
     * // Get one ExamPart
     * const examPart = await prisma.examPart.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExamPartFindFirstArgs>(args?: SelectSubset<T, ExamPartFindFirstArgs<ExtArgs>>): Prisma__ExamPartClient<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExamPart that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamPartFindFirstOrThrowArgs} args - Arguments to find a ExamPart
     * @example
     * // Get one ExamPart
     * const examPart = await prisma.examPart.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExamPartFindFirstOrThrowArgs>(args?: SelectSubset<T, ExamPartFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExamPartClient<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExamParts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamPartFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExamParts
     * const examParts = await prisma.examPart.findMany()
     * 
     * // Get first 10 ExamParts
     * const examParts = await prisma.examPart.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const examPartWithIdOnly = await prisma.examPart.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExamPartFindManyArgs>(args?: SelectSubset<T, ExamPartFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExamPart.
     * @param {ExamPartCreateArgs} args - Arguments to create a ExamPart.
     * @example
     * // Create one ExamPart
     * const ExamPart = await prisma.examPart.create({
     *   data: {
     *     // ... data to create a ExamPart
     *   }
     * })
     * 
     */
    create<T extends ExamPartCreateArgs>(args: SelectSubset<T, ExamPartCreateArgs<ExtArgs>>): Prisma__ExamPartClient<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExamParts.
     * @param {ExamPartCreateManyArgs} args - Arguments to create many ExamParts.
     * @example
     * // Create many ExamParts
     * const examPart = await prisma.examPart.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExamPartCreateManyArgs>(args?: SelectSubset<T, ExamPartCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ExamParts and returns the data saved in the database.
     * @param {ExamPartCreateManyAndReturnArgs} args - Arguments to create many ExamParts.
     * @example
     * // Create many ExamParts
     * const examPart = await prisma.examPart.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ExamParts and only return the `id`
     * const examPartWithIdOnly = await prisma.examPart.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ExamPartCreateManyAndReturnArgs>(args?: SelectSubset<T, ExamPartCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ExamPart.
     * @param {ExamPartDeleteArgs} args - Arguments to delete one ExamPart.
     * @example
     * // Delete one ExamPart
     * const ExamPart = await prisma.examPart.delete({
     *   where: {
     *     // ... filter to delete one ExamPart
     *   }
     * })
     * 
     */
    delete<T extends ExamPartDeleteArgs>(args: SelectSubset<T, ExamPartDeleteArgs<ExtArgs>>): Prisma__ExamPartClient<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExamPart.
     * @param {ExamPartUpdateArgs} args - Arguments to update one ExamPart.
     * @example
     * // Update one ExamPart
     * const examPart = await prisma.examPart.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExamPartUpdateArgs>(args: SelectSubset<T, ExamPartUpdateArgs<ExtArgs>>): Prisma__ExamPartClient<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExamParts.
     * @param {ExamPartDeleteManyArgs} args - Arguments to filter ExamParts to delete.
     * @example
     * // Delete a few ExamParts
     * const { count } = await prisma.examPart.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExamPartDeleteManyArgs>(args?: SelectSubset<T, ExamPartDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamParts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamPartUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExamParts
     * const examPart = await prisma.examPart.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExamPartUpdateManyArgs>(args: SelectSubset<T, ExamPartUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExamParts and returns the data updated in the database.
     * @param {ExamPartUpdateManyAndReturnArgs} args - Arguments to update many ExamParts.
     * @example
     * // Update many ExamParts
     * const examPart = await prisma.examPart.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ExamParts and only return the `id`
     * const examPartWithIdOnly = await prisma.examPart.updateManyAndReturn({
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
    updateManyAndReturn<T extends ExamPartUpdateManyAndReturnArgs>(args: SelectSubset<T, ExamPartUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ExamPart.
     * @param {ExamPartUpsertArgs} args - Arguments to update or create a ExamPart.
     * @example
     * // Update or create a ExamPart
     * const examPart = await prisma.examPart.upsert({
     *   create: {
     *     // ... data to create a ExamPart
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExamPart we want to update
     *   }
     * })
     */
    upsert<T extends ExamPartUpsertArgs>(args: SelectSubset<T, ExamPartUpsertArgs<ExtArgs>>): Prisma__ExamPartClient<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExamParts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamPartCountArgs} args - Arguments to filter ExamParts to count.
     * @example
     * // Count the number of ExamParts
     * const count = await prisma.examPart.count({
     *   where: {
     *     // ... the filter for the ExamParts we want to count
     *   }
     * })
    **/
    count<T extends ExamPartCountArgs>(
      args?: Subset<T, ExamPartCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExamPartCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExamPart.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamPartAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ExamPartAggregateArgs>(args: Subset<T, ExamPartAggregateArgs>): Prisma.PrismaPromise<GetExamPartAggregateType<T>>

    /**
     * Group by ExamPart.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExamPartGroupByArgs} args - Group by arguments.
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
      T extends ExamPartGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExamPartGroupByArgs['orderBy'] }
        : { orderBy?: ExamPartGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ExamPartGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExamPartGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExamPart model
   */
  readonly fields: ExamPartFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExamPart.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExamPartClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    section<T extends ExamSectionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExamSectionDefaultArgs<ExtArgs>>): Prisma__ExamSectionClient<$Result.GetResult<Prisma.$ExamSectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    questionGroups<T extends ExamPart$questionGroupsArgs<ExtArgs> = {}>(args?: Subset<T, ExamPart$questionGroupsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ExamPart model
   */
  interface ExamPartFieldRefs {
    readonly id: FieldRef<"ExamPart", 'String'>
    readonly examSectionId: FieldRef<"ExamPart", 'String'>
    readonly name: FieldRef<"ExamPart", 'String'>
    readonly content: FieldRef<"ExamPart", 'String'>
    readonly mediaUrl: FieldRef<"ExamPart", 'String'>
    readonly orderIndex: FieldRef<"ExamPart", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * ExamPart findUnique
   */
  export type ExamPartFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartInclude<ExtArgs> | null
    /**
     * Filter, which ExamPart to fetch.
     */
    where: ExamPartWhereUniqueInput
  }

  /**
   * ExamPart findUniqueOrThrow
   */
  export type ExamPartFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartInclude<ExtArgs> | null
    /**
     * Filter, which ExamPart to fetch.
     */
    where: ExamPartWhereUniqueInput
  }

  /**
   * ExamPart findFirst
   */
  export type ExamPartFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartInclude<ExtArgs> | null
    /**
     * Filter, which ExamPart to fetch.
     */
    where?: ExamPartWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamParts to fetch.
     */
    orderBy?: ExamPartOrderByWithRelationInput | ExamPartOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamParts.
     */
    cursor?: ExamPartWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamParts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamParts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamParts.
     */
    distinct?: ExamPartScalarFieldEnum | ExamPartScalarFieldEnum[]
  }

  /**
   * ExamPart findFirstOrThrow
   */
  export type ExamPartFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartInclude<ExtArgs> | null
    /**
     * Filter, which ExamPart to fetch.
     */
    where?: ExamPartWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamParts to fetch.
     */
    orderBy?: ExamPartOrderByWithRelationInput | ExamPartOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExamParts.
     */
    cursor?: ExamPartWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamParts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamParts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExamParts.
     */
    distinct?: ExamPartScalarFieldEnum | ExamPartScalarFieldEnum[]
  }

  /**
   * ExamPart findMany
   */
  export type ExamPartFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartInclude<ExtArgs> | null
    /**
     * Filter, which ExamParts to fetch.
     */
    where?: ExamPartWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExamParts to fetch.
     */
    orderBy?: ExamPartOrderByWithRelationInput | ExamPartOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExamParts.
     */
    cursor?: ExamPartWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExamParts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExamParts.
     */
    skip?: number
    distinct?: ExamPartScalarFieldEnum | ExamPartScalarFieldEnum[]
  }

  /**
   * ExamPart create
   */
  export type ExamPartCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartInclude<ExtArgs> | null
    /**
     * The data needed to create a ExamPart.
     */
    data: XOR<ExamPartCreateInput, ExamPartUncheckedCreateInput>
  }

  /**
   * ExamPart createMany
   */
  export type ExamPartCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExamParts.
     */
    data: ExamPartCreateManyInput | ExamPartCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExamPart createManyAndReturn
   */
  export type ExamPartCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * The data used to create many ExamParts.
     */
    data: ExamPartCreateManyInput | ExamPartCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamPart update
   */
  export type ExamPartUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartInclude<ExtArgs> | null
    /**
     * The data needed to update a ExamPart.
     */
    data: XOR<ExamPartUpdateInput, ExamPartUncheckedUpdateInput>
    /**
     * Choose, which ExamPart to update.
     */
    where: ExamPartWhereUniqueInput
  }

  /**
   * ExamPart updateMany
   */
  export type ExamPartUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExamParts.
     */
    data: XOR<ExamPartUpdateManyMutationInput, ExamPartUncheckedUpdateManyInput>
    /**
     * Filter which ExamParts to update
     */
    where?: ExamPartWhereInput
    /**
     * Limit how many ExamParts to update.
     */
    limit?: number
  }

  /**
   * ExamPart updateManyAndReturn
   */
  export type ExamPartUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * The data used to update ExamParts.
     */
    data: XOR<ExamPartUpdateManyMutationInput, ExamPartUncheckedUpdateManyInput>
    /**
     * Filter which ExamParts to update
     */
    where?: ExamPartWhereInput
    /**
     * Limit how many ExamParts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ExamPart upsert
   */
  export type ExamPartUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartInclude<ExtArgs> | null
    /**
     * The filter to search for the ExamPart to update in case it exists.
     */
    where: ExamPartWhereUniqueInput
    /**
     * In case the ExamPart found by the `where` argument doesn't exist, create a new ExamPart with this data.
     */
    create: XOR<ExamPartCreateInput, ExamPartUncheckedCreateInput>
    /**
     * In case the ExamPart was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExamPartUpdateInput, ExamPartUncheckedUpdateInput>
  }

  /**
   * ExamPart delete
   */
  export type ExamPartDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartInclude<ExtArgs> | null
    /**
     * Filter which ExamPart to delete.
     */
    where: ExamPartWhereUniqueInput
  }

  /**
   * ExamPart deleteMany
   */
  export type ExamPartDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExamParts to delete
     */
    where?: ExamPartWhereInput
    /**
     * Limit how many ExamParts to delete.
     */
    limit?: number
  }

  /**
   * ExamPart.questionGroups
   */
  export type ExamPart$questionGroupsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupInclude<ExtArgs> | null
    where?: QuestionGroupWhereInput
    orderBy?: QuestionGroupOrderByWithRelationInput | QuestionGroupOrderByWithRelationInput[]
    cursor?: QuestionGroupWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuestionGroupScalarFieldEnum | QuestionGroupScalarFieldEnum[]
  }

  /**
   * ExamPart without action
   */
  export type ExamPartDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExamPart
     */
    select?: ExamPartSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExamPart
     */
    omit?: ExamPartOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExamPartInclude<ExtArgs> | null
  }


  /**
   * Model QuestionGroup
   */

  export type AggregateQuestionGroup = {
    _count: QuestionGroupCountAggregateOutputType | null
    _avg: QuestionGroupAvgAggregateOutputType | null
    _sum: QuestionGroupSumAggregateOutputType | null
    _min: QuestionGroupMinAggregateOutputType | null
    _max: QuestionGroupMaxAggregateOutputType | null
  }

  export type QuestionGroupAvgAggregateOutputType = {
    orderIndex: number | null
  }

  export type QuestionGroupSumAggregateOutputType = {
    orderIndex: number | null
  }

  export type QuestionGroupMinAggregateOutputType = {
    id: string | null
    examPartId: string | null
    instructions: string | null
    orderIndex: number | null
  }

  export type QuestionGroupMaxAggregateOutputType = {
    id: string | null
    examPartId: string | null
    instructions: string | null
    orderIndex: number | null
  }

  export type QuestionGroupCountAggregateOutputType = {
    id: number
    examPartId: number
    instructions: number
    imageUrls: number
    orderIndex: number
    _all: number
  }


  export type QuestionGroupAvgAggregateInputType = {
    orderIndex?: true
  }

  export type QuestionGroupSumAggregateInputType = {
    orderIndex?: true
  }

  export type QuestionGroupMinAggregateInputType = {
    id?: true
    examPartId?: true
    instructions?: true
    orderIndex?: true
  }

  export type QuestionGroupMaxAggregateInputType = {
    id?: true
    examPartId?: true
    instructions?: true
    orderIndex?: true
  }

  export type QuestionGroupCountAggregateInputType = {
    id?: true
    examPartId?: true
    instructions?: true
    imageUrls?: true
    orderIndex?: true
    _all?: true
  }

  export type QuestionGroupAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuestionGroup to aggregate.
     */
    where?: QuestionGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuestionGroups to fetch.
     */
    orderBy?: QuestionGroupOrderByWithRelationInput | QuestionGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuestionGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuestionGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuestionGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned QuestionGroups
    **/
    _count?: true | QuestionGroupCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuestionGroupAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuestionGroupSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuestionGroupMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuestionGroupMaxAggregateInputType
  }

  export type GetQuestionGroupAggregateType<T extends QuestionGroupAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestionGroup]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestionGroup[P]>
      : GetScalarType<T[P], AggregateQuestionGroup[P]>
  }




  export type QuestionGroupGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionGroupWhereInput
    orderBy?: QuestionGroupOrderByWithAggregationInput | QuestionGroupOrderByWithAggregationInput[]
    by: QuestionGroupScalarFieldEnum[] | QuestionGroupScalarFieldEnum
    having?: QuestionGroupScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuestionGroupCountAggregateInputType | true
    _avg?: QuestionGroupAvgAggregateInputType
    _sum?: QuestionGroupSumAggregateInputType
    _min?: QuestionGroupMinAggregateInputType
    _max?: QuestionGroupMaxAggregateInputType
  }

  export type QuestionGroupGroupByOutputType = {
    id: string
    examPartId: string
    instructions: string | null
    imageUrls: string[]
    orderIndex: number
    _count: QuestionGroupCountAggregateOutputType | null
    _avg: QuestionGroupAvgAggregateOutputType | null
    _sum: QuestionGroupSumAggregateOutputType | null
    _min: QuestionGroupMinAggregateOutputType | null
    _max: QuestionGroupMaxAggregateOutputType | null
  }

  type GetQuestionGroupGroupByPayload<T extends QuestionGroupGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuestionGroupGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuestionGroupGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuestionGroupGroupByOutputType[P]>
            : GetScalarType<T[P], QuestionGroupGroupByOutputType[P]>
        }
      >
    >


  export type QuestionGroupSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    examPartId?: boolean
    instructions?: boolean
    imageUrls?: boolean
    orderIndex?: boolean
    part?: boolean | ExamPartDefaultArgs<ExtArgs>
    questions?: boolean | QuestionGroup$questionsArgs<ExtArgs>
    _count?: boolean | QuestionGroupCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questionGroup"]>

  export type QuestionGroupSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    examPartId?: boolean
    instructions?: boolean
    imageUrls?: boolean
    orderIndex?: boolean
    part?: boolean | ExamPartDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questionGroup"]>

  export type QuestionGroupSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    examPartId?: boolean
    instructions?: boolean
    imageUrls?: boolean
    orderIndex?: boolean
    part?: boolean | ExamPartDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["questionGroup"]>

  export type QuestionGroupSelectScalar = {
    id?: boolean
    examPartId?: boolean
    instructions?: boolean
    imageUrls?: boolean
    orderIndex?: boolean
  }

  export type QuestionGroupOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "examPartId" | "instructions" | "imageUrls" | "orderIndex", ExtArgs["result"]["questionGroup"]>
  export type QuestionGroupInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    part?: boolean | ExamPartDefaultArgs<ExtArgs>
    questions?: boolean | QuestionGroup$questionsArgs<ExtArgs>
    _count?: boolean | QuestionGroupCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuestionGroupIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    part?: boolean | ExamPartDefaultArgs<ExtArgs>
  }
  export type QuestionGroupIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    part?: boolean | ExamPartDefaultArgs<ExtArgs>
  }

  export type $QuestionGroupPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "QuestionGroup"
    objects: {
      part: Prisma.$ExamPartPayload<ExtArgs>
      questions: Prisma.$QuestionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      examPartId: string
      instructions: string | null
      imageUrls: string[]
      orderIndex: number
    }, ExtArgs["result"]["questionGroup"]>
    composites: {}
  }

  type QuestionGroupGetPayload<S extends boolean | null | undefined | QuestionGroupDefaultArgs> = $Result.GetResult<Prisma.$QuestionGroupPayload, S>

  type QuestionGroupCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuestionGroupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuestionGroupCountAggregateInputType | true
    }

  export interface QuestionGroupDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['QuestionGroup'], meta: { name: 'QuestionGroup' } }
    /**
     * Find zero or one QuestionGroup that matches the filter.
     * @param {QuestionGroupFindUniqueArgs} args - Arguments to find a QuestionGroup
     * @example
     * // Get one QuestionGroup
     * const questionGroup = await prisma.questionGroup.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuestionGroupFindUniqueArgs>(args: SelectSubset<T, QuestionGroupFindUniqueArgs<ExtArgs>>): Prisma__QuestionGroupClient<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one QuestionGroup that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuestionGroupFindUniqueOrThrowArgs} args - Arguments to find a QuestionGroup
     * @example
     * // Get one QuestionGroup
     * const questionGroup = await prisma.questionGroup.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuestionGroupFindUniqueOrThrowArgs>(args: SelectSubset<T, QuestionGroupFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuestionGroupClient<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuestionGroup that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupFindFirstArgs} args - Arguments to find a QuestionGroup
     * @example
     * // Get one QuestionGroup
     * const questionGroup = await prisma.questionGroup.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuestionGroupFindFirstArgs>(args?: SelectSubset<T, QuestionGroupFindFirstArgs<ExtArgs>>): Prisma__QuestionGroupClient<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first QuestionGroup that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupFindFirstOrThrowArgs} args - Arguments to find a QuestionGroup
     * @example
     * // Get one QuestionGroup
     * const questionGroup = await prisma.questionGroup.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuestionGroupFindFirstOrThrowArgs>(args?: SelectSubset<T, QuestionGroupFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuestionGroupClient<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more QuestionGroups that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all QuestionGroups
     * const questionGroups = await prisma.questionGroup.findMany()
     * 
     * // Get first 10 QuestionGroups
     * const questionGroups = await prisma.questionGroup.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const questionGroupWithIdOnly = await prisma.questionGroup.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuestionGroupFindManyArgs>(args?: SelectSubset<T, QuestionGroupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a QuestionGroup.
     * @param {QuestionGroupCreateArgs} args - Arguments to create a QuestionGroup.
     * @example
     * // Create one QuestionGroup
     * const QuestionGroup = await prisma.questionGroup.create({
     *   data: {
     *     // ... data to create a QuestionGroup
     *   }
     * })
     * 
     */
    create<T extends QuestionGroupCreateArgs>(args: SelectSubset<T, QuestionGroupCreateArgs<ExtArgs>>): Prisma__QuestionGroupClient<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many QuestionGroups.
     * @param {QuestionGroupCreateManyArgs} args - Arguments to create many QuestionGroups.
     * @example
     * // Create many QuestionGroups
     * const questionGroup = await prisma.questionGroup.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuestionGroupCreateManyArgs>(args?: SelectSubset<T, QuestionGroupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many QuestionGroups and returns the data saved in the database.
     * @param {QuestionGroupCreateManyAndReturnArgs} args - Arguments to create many QuestionGroups.
     * @example
     * // Create many QuestionGroups
     * const questionGroup = await prisma.questionGroup.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many QuestionGroups and only return the `id`
     * const questionGroupWithIdOnly = await prisma.questionGroup.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuestionGroupCreateManyAndReturnArgs>(args?: SelectSubset<T, QuestionGroupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a QuestionGroup.
     * @param {QuestionGroupDeleteArgs} args - Arguments to delete one QuestionGroup.
     * @example
     * // Delete one QuestionGroup
     * const QuestionGroup = await prisma.questionGroup.delete({
     *   where: {
     *     // ... filter to delete one QuestionGroup
     *   }
     * })
     * 
     */
    delete<T extends QuestionGroupDeleteArgs>(args: SelectSubset<T, QuestionGroupDeleteArgs<ExtArgs>>): Prisma__QuestionGroupClient<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one QuestionGroup.
     * @param {QuestionGroupUpdateArgs} args - Arguments to update one QuestionGroup.
     * @example
     * // Update one QuestionGroup
     * const questionGroup = await prisma.questionGroup.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuestionGroupUpdateArgs>(args: SelectSubset<T, QuestionGroupUpdateArgs<ExtArgs>>): Prisma__QuestionGroupClient<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more QuestionGroups.
     * @param {QuestionGroupDeleteManyArgs} args - Arguments to filter QuestionGroups to delete.
     * @example
     * // Delete a few QuestionGroups
     * const { count } = await prisma.questionGroup.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuestionGroupDeleteManyArgs>(args?: SelectSubset<T, QuestionGroupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuestionGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many QuestionGroups
     * const questionGroup = await prisma.questionGroup.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuestionGroupUpdateManyArgs>(args: SelectSubset<T, QuestionGroupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more QuestionGroups and returns the data updated in the database.
     * @param {QuestionGroupUpdateManyAndReturnArgs} args - Arguments to update many QuestionGroups.
     * @example
     * // Update many QuestionGroups
     * const questionGroup = await prisma.questionGroup.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more QuestionGroups and only return the `id`
     * const questionGroupWithIdOnly = await prisma.questionGroup.updateManyAndReturn({
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
    updateManyAndReturn<T extends QuestionGroupUpdateManyAndReturnArgs>(args: SelectSubset<T, QuestionGroupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one QuestionGroup.
     * @param {QuestionGroupUpsertArgs} args - Arguments to update or create a QuestionGroup.
     * @example
     * // Update or create a QuestionGroup
     * const questionGroup = await prisma.questionGroup.upsert({
     *   create: {
     *     // ... data to create a QuestionGroup
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the QuestionGroup we want to update
     *   }
     * })
     */
    upsert<T extends QuestionGroupUpsertArgs>(args: SelectSubset<T, QuestionGroupUpsertArgs<ExtArgs>>): Prisma__QuestionGroupClient<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of QuestionGroups.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupCountArgs} args - Arguments to filter QuestionGroups to count.
     * @example
     * // Count the number of QuestionGroups
     * const count = await prisma.questionGroup.count({
     *   where: {
     *     // ... the filter for the QuestionGroups we want to count
     *   }
     * })
    **/
    count<T extends QuestionGroupCountArgs>(
      args?: Subset<T, QuestionGroupCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuestionGroupCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a QuestionGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuestionGroupAggregateArgs>(args: Subset<T, QuestionGroupAggregateArgs>): Prisma.PrismaPromise<GetQuestionGroupAggregateType<T>>

    /**
     * Group by QuestionGroup.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupGroupByArgs} args - Group by arguments.
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
      T extends QuestionGroupGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuestionGroupGroupByArgs['orderBy'] }
        : { orderBy?: QuestionGroupGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuestionGroupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionGroupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the QuestionGroup model
   */
  readonly fields: QuestionGroupFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for QuestionGroup.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuestionGroupClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    part<T extends ExamPartDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExamPartDefaultArgs<ExtArgs>>): Prisma__ExamPartClient<$Result.GetResult<Prisma.$ExamPartPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    questions<T extends QuestionGroup$questionsArgs<ExtArgs> = {}>(args?: Subset<T, QuestionGroup$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the QuestionGroup model
   */
  interface QuestionGroupFieldRefs {
    readonly id: FieldRef<"QuestionGroup", 'String'>
    readonly examPartId: FieldRef<"QuestionGroup", 'String'>
    readonly instructions: FieldRef<"QuestionGroup", 'String'>
    readonly imageUrls: FieldRef<"QuestionGroup", 'String[]'>
    readonly orderIndex: FieldRef<"QuestionGroup", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * QuestionGroup findUnique
   */
  export type QuestionGroupFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupInclude<ExtArgs> | null
    /**
     * Filter, which QuestionGroup to fetch.
     */
    where: QuestionGroupWhereUniqueInput
  }

  /**
   * QuestionGroup findUniqueOrThrow
   */
  export type QuestionGroupFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupInclude<ExtArgs> | null
    /**
     * Filter, which QuestionGroup to fetch.
     */
    where: QuestionGroupWhereUniqueInput
  }

  /**
   * QuestionGroup findFirst
   */
  export type QuestionGroupFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupInclude<ExtArgs> | null
    /**
     * Filter, which QuestionGroup to fetch.
     */
    where?: QuestionGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuestionGroups to fetch.
     */
    orderBy?: QuestionGroupOrderByWithRelationInput | QuestionGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuestionGroups.
     */
    cursor?: QuestionGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuestionGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuestionGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuestionGroups.
     */
    distinct?: QuestionGroupScalarFieldEnum | QuestionGroupScalarFieldEnum[]
  }

  /**
   * QuestionGroup findFirstOrThrow
   */
  export type QuestionGroupFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupInclude<ExtArgs> | null
    /**
     * Filter, which QuestionGroup to fetch.
     */
    where?: QuestionGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuestionGroups to fetch.
     */
    orderBy?: QuestionGroupOrderByWithRelationInput | QuestionGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for QuestionGroups.
     */
    cursor?: QuestionGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuestionGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuestionGroups.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of QuestionGroups.
     */
    distinct?: QuestionGroupScalarFieldEnum | QuestionGroupScalarFieldEnum[]
  }

  /**
   * QuestionGroup findMany
   */
  export type QuestionGroupFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupInclude<ExtArgs> | null
    /**
     * Filter, which QuestionGroups to fetch.
     */
    where?: QuestionGroupWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of QuestionGroups to fetch.
     */
    orderBy?: QuestionGroupOrderByWithRelationInput | QuestionGroupOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing QuestionGroups.
     */
    cursor?: QuestionGroupWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` QuestionGroups from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` QuestionGroups.
     */
    skip?: number
    distinct?: QuestionGroupScalarFieldEnum | QuestionGroupScalarFieldEnum[]
  }

  /**
   * QuestionGroup create
   */
  export type QuestionGroupCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupInclude<ExtArgs> | null
    /**
     * The data needed to create a QuestionGroup.
     */
    data: XOR<QuestionGroupCreateInput, QuestionGroupUncheckedCreateInput>
  }

  /**
   * QuestionGroup createMany
   */
  export type QuestionGroupCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many QuestionGroups.
     */
    data: QuestionGroupCreateManyInput | QuestionGroupCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * QuestionGroup createManyAndReturn
   */
  export type QuestionGroupCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * The data used to create many QuestionGroups.
     */
    data: QuestionGroupCreateManyInput | QuestionGroupCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuestionGroup update
   */
  export type QuestionGroupUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupInclude<ExtArgs> | null
    /**
     * The data needed to update a QuestionGroup.
     */
    data: XOR<QuestionGroupUpdateInput, QuestionGroupUncheckedUpdateInput>
    /**
     * Choose, which QuestionGroup to update.
     */
    where: QuestionGroupWhereUniqueInput
  }

  /**
   * QuestionGroup updateMany
   */
  export type QuestionGroupUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update QuestionGroups.
     */
    data: XOR<QuestionGroupUpdateManyMutationInput, QuestionGroupUncheckedUpdateManyInput>
    /**
     * Filter which QuestionGroups to update
     */
    where?: QuestionGroupWhereInput
    /**
     * Limit how many QuestionGroups to update.
     */
    limit?: number
  }

  /**
   * QuestionGroup updateManyAndReturn
   */
  export type QuestionGroupUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * The data used to update QuestionGroups.
     */
    data: XOR<QuestionGroupUpdateManyMutationInput, QuestionGroupUncheckedUpdateManyInput>
    /**
     * Filter which QuestionGroups to update
     */
    where?: QuestionGroupWhereInput
    /**
     * Limit how many QuestionGroups to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * QuestionGroup upsert
   */
  export type QuestionGroupUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupInclude<ExtArgs> | null
    /**
     * The filter to search for the QuestionGroup to update in case it exists.
     */
    where: QuestionGroupWhereUniqueInput
    /**
     * In case the QuestionGroup found by the `where` argument doesn't exist, create a new QuestionGroup with this data.
     */
    create: XOR<QuestionGroupCreateInput, QuestionGroupUncheckedCreateInput>
    /**
     * In case the QuestionGroup was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuestionGroupUpdateInput, QuestionGroupUncheckedUpdateInput>
  }

  /**
   * QuestionGroup delete
   */
  export type QuestionGroupDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupInclude<ExtArgs> | null
    /**
     * Filter which QuestionGroup to delete.
     */
    where: QuestionGroupWhereUniqueInput
  }

  /**
   * QuestionGroup deleteMany
   */
  export type QuestionGroupDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which QuestionGroups to delete
     */
    where?: QuestionGroupWhereInput
    /**
     * Limit how many QuestionGroups to delete.
     */
    limit?: number
  }

  /**
   * QuestionGroup.questions
   */
  export type QuestionGroup$questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    where?: QuestionWhereInput
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    cursor?: QuestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * QuestionGroup without action
   */
  export type QuestionGroupDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionGroup
     */
    select?: QuestionGroupSelect<ExtArgs> | null
    /**
     * Omit specific fields from the QuestionGroup
     */
    omit?: QuestionGroupOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionGroupInclude<ExtArgs> | null
  }


  /**
   * Model Question
   */

  export type AggregateQuestion = {
    _count: QuestionCountAggregateOutputType | null
    _avg: QuestionAvgAggregateOutputType | null
    _sum: QuestionSumAggregateOutputType | null
    _min: QuestionMinAggregateOutputType | null
    _max: QuestionMaxAggregateOutputType | null
  }

  export type QuestionAvgAggregateOutputType = {
    orderIndex: number | null
  }

  export type QuestionSumAggregateOutputType = {
    orderIndex: number | null
  }

  export type QuestionMinAggregateOutputType = {
    id: string | null
    questionGroupId: string | null
    type: $Enums.QuestionType | null
    explanation: string | null
    orderIndex: number | null
  }

  export type QuestionMaxAggregateOutputType = {
    id: string | null
    questionGroupId: string | null
    type: $Enums.QuestionType | null
    explanation: string | null
    orderIndex: number | null
  }

  export type QuestionCountAggregateOutputType = {
    id: number
    questionGroupId: number
    type: number
    content: number
    answer: number
    explanation: number
    orderIndex: number
    _all: number
  }


  export type QuestionAvgAggregateInputType = {
    orderIndex?: true
  }

  export type QuestionSumAggregateInputType = {
    orderIndex?: true
  }

  export type QuestionMinAggregateInputType = {
    id?: true
    questionGroupId?: true
    type?: true
    explanation?: true
    orderIndex?: true
  }

  export type QuestionMaxAggregateInputType = {
    id?: true
    questionGroupId?: true
    type?: true
    explanation?: true
    orderIndex?: true
  }

  export type QuestionCountAggregateInputType = {
    id?: true
    questionGroupId?: true
    type?: true
    content?: true
    answer?: true
    explanation?: true
    orderIndex?: true
    _all?: true
  }

  export type QuestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Question to aggregate.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Questions
    **/
    _count?: true | QuestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QuestionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QuestionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QuestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QuestionMaxAggregateInputType
  }

  export type GetQuestionAggregateType<T extends QuestionAggregateArgs> = {
        [P in keyof T & keyof AggregateQuestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQuestion[P]>
      : GetScalarType<T[P], AggregateQuestion[P]>
  }




  export type QuestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionWhereInput
    orderBy?: QuestionOrderByWithAggregationInput | QuestionOrderByWithAggregationInput[]
    by: QuestionScalarFieldEnum[] | QuestionScalarFieldEnum
    having?: QuestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QuestionCountAggregateInputType | true
    _avg?: QuestionAvgAggregateInputType
    _sum?: QuestionSumAggregateInputType
    _min?: QuestionMinAggregateInputType
    _max?: QuestionMaxAggregateInputType
  }

  export type QuestionGroupByOutputType = {
    id: string
    questionGroupId: string
    type: $Enums.QuestionType
    content: JsonValue
    answer: JsonValue
    explanation: string | null
    orderIndex: number
    _count: QuestionCountAggregateOutputType | null
    _avg: QuestionAvgAggregateOutputType | null
    _sum: QuestionSumAggregateOutputType | null
    _min: QuestionMinAggregateOutputType | null
    _max: QuestionMaxAggregateOutputType | null
  }

  type GetQuestionGroupByPayload<T extends QuestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QuestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QuestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QuestionGroupByOutputType[P]>
            : GetScalarType<T[P], QuestionGroupByOutputType[P]>
        }
      >
    >


  export type QuestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    questionGroupId?: boolean
    type?: boolean
    content?: boolean
    answer?: boolean
    explanation?: boolean
    orderIndex?: boolean
    group?: boolean | QuestionGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    questionGroupId?: boolean
    type?: boolean
    content?: boolean
    answer?: boolean
    explanation?: boolean
    orderIndex?: boolean
    group?: boolean | QuestionGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    questionGroupId?: boolean
    type?: boolean
    content?: boolean
    answer?: boolean
    explanation?: boolean
    orderIndex?: boolean
    group?: boolean | QuestionGroupDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectScalar = {
    id?: boolean
    questionGroupId?: boolean
    type?: boolean
    content?: boolean
    answer?: boolean
    explanation?: boolean
    orderIndex?: boolean
  }

  export type QuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "questionGroupId" | "type" | "content" | "answer" | "explanation" | "orderIndex", ExtArgs["result"]["question"]>
  export type QuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | QuestionGroupDefaultArgs<ExtArgs>
  }
  export type QuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | QuestionGroupDefaultArgs<ExtArgs>
  }
  export type QuestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    group?: boolean | QuestionGroupDefaultArgs<ExtArgs>
  }

  export type $QuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Question"
    objects: {
      group: Prisma.$QuestionGroupPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      questionGroupId: string
      type: $Enums.QuestionType
      content: Prisma.JsonValue
      answer: Prisma.JsonValue
      explanation: string | null
      orderIndex: number
    }, ExtArgs["result"]["question"]>
    composites: {}
  }

  type QuestionGetPayload<S extends boolean | null | undefined | QuestionDefaultArgs> = $Result.GetResult<Prisma.$QuestionPayload, S>

  type QuestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QuestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QuestionCountAggregateInputType | true
    }

  export interface QuestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Question'], meta: { name: 'Question' } }
    /**
     * Find zero or one Question that matches the filter.
     * @param {QuestionFindUniqueArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QuestionFindUniqueArgs>(args: SelectSubset<T, QuestionFindUniqueArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Question that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QuestionFindUniqueOrThrowArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QuestionFindUniqueOrThrowArgs>(args: SelectSubset<T, QuestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindFirstArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QuestionFindFirstArgs>(args?: SelectSubset<T, QuestionFindFirstArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Question that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindFirstOrThrowArgs} args - Arguments to find a Question
     * @example
     * // Get one Question
     * const question = await prisma.question.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QuestionFindFirstOrThrowArgs>(args?: SelectSubset<T, QuestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Questions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Questions
     * const questions = await prisma.question.findMany()
     * 
     * // Get first 10 Questions
     * const questions = await prisma.question.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const questionWithIdOnly = await prisma.question.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QuestionFindManyArgs>(args?: SelectSubset<T, QuestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Question.
     * @param {QuestionCreateArgs} args - Arguments to create a Question.
     * @example
     * // Create one Question
     * const Question = await prisma.question.create({
     *   data: {
     *     // ... data to create a Question
     *   }
     * })
     * 
     */
    create<T extends QuestionCreateArgs>(args: SelectSubset<T, QuestionCreateArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Questions.
     * @param {QuestionCreateManyArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const question = await prisma.question.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QuestionCreateManyArgs>(args?: SelectSubset<T, QuestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Questions and returns the data saved in the database.
     * @param {QuestionCreateManyAndReturnArgs} args - Arguments to create many Questions.
     * @example
     * // Create many Questions
     * const question = await prisma.question.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Questions and only return the `id`
     * const questionWithIdOnly = await prisma.question.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QuestionCreateManyAndReturnArgs>(args?: SelectSubset<T, QuestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Question.
     * @param {QuestionDeleteArgs} args - Arguments to delete one Question.
     * @example
     * // Delete one Question
     * const Question = await prisma.question.delete({
     *   where: {
     *     // ... filter to delete one Question
     *   }
     * })
     * 
     */
    delete<T extends QuestionDeleteArgs>(args: SelectSubset<T, QuestionDeleteArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Question.
     * @param {QuestionUpdateArgs} args - Arguments to update one Question.
     * @example
     * // Update one Question
     * const question = await prisma.question.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QuestionUpdateArgs>(args: SelectSubset<T, QuestionUpdateArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Questions.
     * @param {QuestionDeleteManyArgs} args - Arguments to filter Questions to delete.
     * @example
     * // Delete a few Questions
     * const { count } = await prisma.question.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QuestionDeleteManyArgs>(args?: SelectSubset<T, QuestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Questions
     * const question = await prisma.question.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QuestionUpdateManyArgs>(args: SelectSubset<T, QuestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Questions and returns the data updated in the database.
     * @param {QuestionUpdateManyAndReturnArgs} args - Arguments to update many Questions.
     * @example
     * // Update many Questions
     * const question = await prisma.question.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Questions and only return the `id`
     * const questionWithIdOnly = await prisma.question.updateManyAndReturn({
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
    updateManyAndReturn<T extends QuestionUpdateManyAndReturnArgs>(args: SelectSubset<T, QuestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Question.
     * @param {QuestionUpsertArgs} args - Arguments to update or create a Question.
     * @example
     * // Update or create a Question
     * const question = await prisma.question.upsert({
     *   create: {
     *     // ... data to create a Question
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Question we want to update
     *   }
     * })
     */
    upsert<T extends QuestionUpsertArgs>(args: SelectSubset<T, QuestionUpsertArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Questions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionCountArgs} args - Arguments to filter Questions to count.
     * @example
     * // Count the number of Questions
     * const count = await prisma.question.count({
     *   where: {
     *     // ... the filter for the Questions we want to count
     *   }
     * })
    **/
    count<T extends QuestionCountArgs>(
      args?: Subset<T, QuestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QuestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Question.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends QuestionAggregateArgs>(args: Subset<T, QuestionAggregateArgs>): Prisma.PrismaPromise<GetQuestionAggregateType<T>>

    /**
     * Group by Question.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QuestionGroupByArgs} args - Group by arguments.
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
      T extends QuestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QuestionGroupByArgs['orderBy'] }
        : { orderBy?: QuestionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, QuestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQuestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Question model
   */
  readonly fields: QuestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Question.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QuestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    group<T extends QuestionGroupDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuestionGroupDefaultArgs<ExtArgs>>): Prisma__QuestionGroupClient<$Result.GetResult<Prisma.$QuestionGroupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Question model
   */
  interface QuestionFieldRefs {
    readonly id: FieldRef<"Question", 'String'>
    readonly questionGroupId: FieldRef<"Question", 'String'>
    readonly type: FieldRef<"Question", 'QuestionType'>
    readonly content: FieldRef<"Question", 'Json'>
    readonly answer: FieldRef<"Question", 'Json'>
    readonly explanation: FieldRef<"Question", 'String'>
    readonly orderIndex: FieldRef<"Question", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Question findUnique
   */
  export type QuestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question findUniqueOrThrow
   */
  export type QuestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question findFirst
   */
  export type QuestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question findFirstOrThrow
   */
  export type QuestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Question to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Questions.
     */
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question findMany
   */
  export type QuestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter, which Questions to fetch.
     */
    where?: QuestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Questions to fetch.
     */
    orderBy?: QuestionOrderByWithRelationInput | QuestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Questions.
     */
    cursor?: QuestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Questions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Questions.
     */
    skip?: number
    distinct?: QuestionScalarFieldEnum | QuestionScalarFieldEnum[]
  }

  /**
   * Question create
   */
  export type QuestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The data needed to create a Question.
     */
    data: XOR<QuestionCreateInput, QuestionUncheckedCreateInput>
  }

  /**
   * Question createMany
   */
  export type QuestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Questions.
     */
    data: QuestionCreateManyInput | QuestionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Question createManyAndReturn
   */
  export type QuestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * The data used to create many Questions.
     */
    data: QuestionCreateManyInput | QuestionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Question update
   */
  export type QuestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The data needed to update a Question.
     */
    data: XOR<QuestionUpdateInput, QuestionUncheckedUpdateInput>
    /**
     * Choose, which Question to update.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question updateMany
   */
  export type QuestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
  }

  /**
   * Question updateManyAndReturn
   */
  export type QuestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * The data used to update Questions.
     */
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyInput>
    /**
     * Filter which Questions to update
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Question upsert
   */
  export type QuestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * The filter to search for the Question to update in case it exists.
     */
    where: QuestionWhereUniqueInput
    /**
     * In case the Question found by the `where` argument doesn't exist, create a new Question with this data.
     */
    create: XOR<QuestionCreateInput, QuestionUncheckedCreateInput>
    /**
     * In case the Question was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QuestionUpdateInput, QuestionUncheckedUpdateInput>
  }

  /**
   * Question delete
   */
  export type QuestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
    /**
     * Filter which Question to delete.
     */
    where: QuestionWhereUniqueInput
  }

  /**
   * Question deleteMany
   */
  export type QuestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Questions to delete
     */
    where?: QuestionWhereInput
    /**
     * Limit how many Questions to delete.
     */
    limit?: number
  }

  /**
   * Question without action
   */
  export type QuestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Question
     */
    select?: QuestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Question
     */
    omit?: QuestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QuestionInclude<ExtArgs> | null
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


  export const PracticeTestScalarFieldEnum: {
    id: 'id',
    title: 'title',
    examType: 'examType',
    status: 'status',
    duration: 'duration',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PracticeTestScalarFieldEnum = (typeof PracticeTestScalarFieldEnum)[keyof typeof PracticeTestScalarFieldEnum]


  export const ExamSectionScalarFieldEnum: {
    id: 'id',
    practiceTestId: 'practiceTestId',
    name: 'name',
    orderIndex: 'orderIndex'
  };

  export type ExamSectionScalarFieldEnum = (typeof ExamSectionScalarFieldEnum)[keyof typeof ExamSectionScalarFieldEnum]


  export const ExamPartScalarFieldEnum: {
    id: 'id',
    examSectionId: 'examSectionId',
    name: 'name',
    content: 'content',
    mediaUrl: 'mediaUrl',
    orderIndex: 'orderIndex'
  };

  export type ExamPartScalarFieldEnum = (typeof ExamPartScalarFieldEnum)[keyof typeof ExamPartScalarFieldEnum]


  export const QuestionGroupScalarFieldEnum: {
    id: 'id',
    examPartId: 'examPartId',
    instructions: 'instructions',
    imageUrls: 'imageUrls',
    orderIndex: 'orderIndex'
  };

  export type QuestionGroupScalarFieldEnum = (typeof QuestionGroupScalarFieldEnum)[keyof typeof QuestionGroupScalarFieldEnum]


  export const QuestionScalarFieldEnum: {
    id: 'id',
    questionGroupId: 'questionGroupId',
    type: 'type',
    content: 'content',
    answer: 'answer',
    explanation: 'explanation',
    orderIndex: 'orderIndex'
  };

  export type QuestionScalarFieldEnum = (typeof QuestionScalarFieldEnum)[keyof typeof QuestionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'ExamType'
   */
  export type EnumExamTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExamType'>
    


  /**
   * Reference to a field of type 'ExamType[]'
   */
  export type ListEnumExamTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ExamType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'QuestionType'
   */
  export type EnumQuestionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuestionType'>
    


  /**
   * Reference to a field of type 'QuestionType[]'
   */
  export type ListEnumQuestionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuestionType[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PracticeTestWhereInput = {
    AND?: PracticeTestWhereInput | PracticeTestWhereInput[]
    OR?: PracticeTestWhereInput[]
    NOT?: PracticeTestWhereInput | PracticeTestWhereInput[]
    id?: UuidFilter<"PracticeTest"> | string
    title?: StringFilter<"PracticeTest"> | string
    examType?: EnumExamTypeFilter<"PracticeTest"> | $Enums.ExamType
    status?: StringFilter<"PracticeTest"> | string
    duration?: IntFilter<"PracticeTest"> | number
    createdAt?: DateTimeFilter<"PracticeTest"> | Date | string
    updatedAt?: DateTimeFilter<"PracticeTest"> | Date | string
    sections?: ExamSectionListRelationFilter
  }

  export type PracticeTestOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    examType?: SortOrder
    status?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sections?: ExamSectionOrderByRelationAggregateInput
  }

  export type PracticeTestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PracticeTestWhereInput | PracticeTestWhereInput[]
    OR?: PracticeTestWhereInput[]
    NOT?: PracticeTestWhereInput | PracticeTestWhereInput[]
    title?: StringFilter<"PracticeTest"> | string
    examType?: EnumExamTypeFilter<"PracticeTest"> | $Enums.ExamType
    status?: StringFilter<"PracticeTest"> | string
    duration?: IntFilter<"PracticeTest"> | number
    createdAt?: DateTimeFilter<"PracticeTest"> | Date | string
    updatedAt?: DateTimeFilter<"PracticeTest"> | Date | string
    sections?: ExamSectionListRelationFilter
  }, "id">

  export type PracticeTestOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    examType?: SortOrder
    status?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PracticeTestCountOrderByAggregateInput
    _avg?: PracticeTestAvgOrderByAggregateInput
    _max?: PracticeTestMaxOrderByAggregateInput
    _min?: PracticeTestMinOrderByAggregateInput
    _sum?: PracticeTestSumOrderByAggregateInput
  }

  export type PracticeTestScalarWhereWithAggregatesInput = {
    AND?: PracticeTestScalarWhereWithAggregatesInput | PracticeTestScalarWhereWithAggregatesInput[]
    OR?: PracticeTestScalarWhereWithAggregatesInput[]
    NOT?: PracticeTestScalarWhereWithAggregatesInput | PracticeTestScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PracticeTest"> | string
    title?: StringWithAggregatesFilter<"PracticeTest"> | string
    examType?: EnumExamTypeWithAggregatesFilter<"PracticeTest"> | $Enums.ExamType
    status?: StringWithAggregatesFilter<"PracticeTest"> | string
    duration?: IntWithAggregatesFilter<"PracticeTest"> | number
    createdAt?: DateTimeWithAggregatesFilter<"PracticeTest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PracticeTest"> | Date | string
  }

  export type ExamSectionWhereInput = {
    AND?: ExamSectionWhereInput | ExamSectionWhereInput[]
    OR?: ExamSectionWhereInput[]
    NOT?: ExamSectionWhereInput | ExamSectionWhereInput[]
    id?: UuidFilter<"ExamSection"> | string
    practiceTestId?: UuidFilter<"ExamSection"> | string
    name?: StringFilter<"ExamSection"> | string
    orderIndex?: IntFilter<"ExamSection"> | number
    test?: XOR<PracticeTestScalarRelationFilter, PracticeTestWhereInput>
    parts?: ExamPartListRelationFilter
  }

  export type ExamSectionOrderByWithRelationInput = {
    id?: SortOrder
    practiceTestId?: SortOrder
    name?: SortOrder
    orderIndex?: SortOrder
    test?: PracticeTestOrderByWithRelationInput
    parts?: ExamPartOrderByRelationAggregateInput
  }

  export type ExamSectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExamSectionWhereInput | ExamSectionWhereInput[]
    OR?: ExamSectionWhereInput[]
    NOT?: ExamSectionWhereInput | ExamSectionWhereInput[]
    practiceTestId?: UuidFilter<"ExamSection"> | string
    name?: StringFilter<"ExamSection"> | string
    orderIndex?: IntFilter<"ExamSection"> | number
    test?: XOR<PracticeTestScalarRelationFilter, PracticeTestWhereInput>
    parts?: ExamPartListRelationFilter
  }, "id">

  export type ExamSectionOrderByWithAggregationInput = {
    id?: SortOrder
    practiceTestId?: SortOrder
    name?: SortOrder
    orderIndex?: SortOrder
    _count?: ExamSectionCountOrderByAggregateInput
    _avg?: ExamSectionAvgOrderByAggregateInput
    _max?: ExamSectionMaxOrderByAggregateInput
    _min?: ExamSectionMinOrderByAggregateInput
    _sum?: ExamSectionSumOrderByAggregateInput
  }

  export type ExamSectionScalarWhereWithAggregatesInput = {
    AND?: ExamSectionScalarWhereWithAggregatesInput | ExamSectionScalarWhereWithAggregatesInput[]
    OR?: ExamSectionScalarWhereWithAggregatesInput[]
    NOT?: ExamSectionScalarWhereWithAggregatesInput | ExamSectionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ExamSection"> | string
    practiceTestId?: UuidWithAggregatesFilter<"ExamSection"> | string
    name?: StringWithAggregatesFilter<"ExamSection"> | string
    orderIndex?: IntWithAggregatesFilter<"ExamSection"> | number
  }

  export type ExamPartWhereInput = {
    AND?: ExamPartWhereInput | ExamPartWhereInput[]
    OR?: ExamPartWhereInput[]
    NOT?: ExamPartWhereInput | ExamPartWhereInput[]
    id?: UuidFilter<"ExamPart"> | string
    examSectionId?: UuidFilter<"ExamPart"> | string
    name?: StringFilter<"ExamPart"> | string
    content?: StringNullableFilter<"ExamPart"> | string | null
    mediaUrl?: StringNullableFilter<"ExamPart"> | string | null
    orderIndex?: IntFilter<"ExamPart"> | number
    section?: XOR<ExamSectionScalarRelationFilter, ExamSectionWhereInput>
    questionGroups?: QuestionGroupListRelationFilter
  }

  export type ExamPartOrderByWithRelationInput = {
    id?: SortOrder
    examSectionId?: SortOrder
    name?: SortOrder
    content?: SortOrderInput | SortOrder
    mediaUrl?: SortOrderInput | SortOrder
    orderIndex?: SortOrder
    section?: ExamSectionOrderByWithRelationInput
    questionGroups?: QuestionGroupOrderByRelationAggregateInput
  }

  export type ExamPartWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ExamPartWhereInput | ExamPartWhereInput[]
    OR?: ExamPartWhereInput[]
    NOT?: ExamPartWhereInput | ExamPartWhereInput[]
    examSectionId?: UuidFilter<"ExamPart"> | string
    name?: StringFilter<"ExamPart"> | string
    content?: StringNullableFilter<"ExamPart"> | string | null
    mediaUrl?: StringNullableFilter<"ExamPart"> | string | null
    orderIndex?: IntFilter<"ExamPart"> | number
    section?: XOR<ExamSectionScalarRelationFilter, ExamSectionWhereInput>
    questionGroups?: QuestionGroupListRelationFilter
  }, "id">

  export type ExamPartOrderByWithAggregationInput = {
    id?: SortOrder
    examSectionId?: SortOrder
    name?: SortOrder
    content?: SortOrderInput | SortOrder
    mediaUrl?: SortOrderInput | SortOrder
    orderIndex?: SortOrder
    _count?: ExamPartCountOrderByAggregateInput
    _avg?: ExamPartAvgOrderByAggregateInput
    _max?: ExamPartMaxOrderByAggregateInput
    _min?: ExamPartMinOrderByAggregateInput
    _sum?: ExamPartSumOrderByAggregateInput
  }

  export type ExamPartScalarWhereWithAggregatesInput = {
    AND?: ExamPartScalarWhereWithAggregatesInput | ExamPartScalarWhereWithAggregatesInput[]
    OR?: ExamPartScalarWhereWithAggregatesInput[]
    NOT?: ExamPartScalarWhereWithAggregatesInput | ExamPartScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ExamPart"> | string
    examSectionId?: UuidWithAggregatesFilter<"ExamPart"> | string
    name?: StringWithAggregatesFilter<"ExamPart"> | string
    content?: StringNullableWithAggregatesFilter<"ExamPart"> | string | null
    mediaUrl?: StringNullableWithAggregatesFilter<"ExamPart"> | string | null
    orderIndex?: IntWithAggregatesFilter<"ExamPart"> | number
  }

  export type QuestionGroupWhereInput = {
    AND?: QuestionGroupWhereInput | QuestionGroupWhereInput[]
    OR?: QuestionGroupWhereInput[]
    NOT?: QuestionGroupWhereInput | QuestionGroupWhereInput[]
    id?: UuidFilter<"QuestionGroup"> | string
    examPartId?: UuidFilter<"QuestionGroup"> | string
    instructions?: StringNullableFilter<"QuestionGroup"> | string | null
    imageUrls?: StringNullableListFilter<"QuestionGroup">
    orderIndex?: IntFilter<"QuestionGroup"> | number
    part?: XOR<ExamPartScalarRelationFilter, ExamPartWhereInput>
    questions?: QuestionListRelationFilter
  }

  export type QuestionGroupOrderByWithRelationInput = {
    id?: SortOrder
    examPartId?: SortOrder
    instructions?: SortOrderInput | SortOrder
    imageUrls?: SortOrder
    orderIndex?: SortOrder
    part?: ExamPartOrderByWithRelationInput
    questions?: QuestionOrderByRelationAggregateInput
  }

  export type QuestionGroupWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuestionGroupWhereInput | QuestionGroupWhereInput[]
    OR?: QuestionGroupWhereInput[]
    NOT?: QuestionGroupWhereInput | QuestionGroupWhereInput[]
    examPartId?: UuidFilter<"QuestionGroup"> | string
    instructions?: StringNullableFilter<"QuestionGroup"> | string | null
    imageUrls?: StringNullableListFilter<"QuestionGroup">
    orderIndex?: IntFilter<"QuestionGroup"> | number
    part?: XOR<ExamPartScalarRelationFilter, ExamPartWhereInput>
    questions?: QuestionListRelationFilter
  }, "id">

  export type QuestionGroupOrderByWithAggregationInput = {
    id?: SortOrder
    examPartId?: SortOrder
    instructions?: SortOrderInput | SortOrder
    imageUrls?: SortOrder
    orderIndex?: SortOrder
    _count?: QuestionGroupCountOrderByAggregateInput
    _avg?: QuestionGroupAvgOrderByAggregateInput
    _max?: QuestionGroupMaxOrderByAggregateInput
    _min?: QuestionGroupMinOrderByAggregateInput
    _sum?: QuestionGroupSumOrderByAggregateInput
  }

  export type QuestionGroupScalarWhereWithAggregatesInput = {
    AND?: QuestionGroupScalarWhereWithAggregatesInput | QuestionGroupScalarWhereWithAggregatesInput[]
    OR?: QuestionGroupScalarWhereWithAggregatesInput[]
    NOT?: QuestionGroupScalarWhereWithAggregatesInput | QuestionGroupScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"QuestionGroup"> | string
    examPartId?: UuidWithAggregatesFilter<"QuestionGroup"> | string
    instructions?: StringNullableWithAggregatesFilter<"QuestionGroup"> | string | null
    imageUrls?: StringNullableListFilter<"QuestionGroup">
    orderIndex?: IntWithAggregatesFilter<"QuestionGroup"> | number
  }

  export type QuestionWhereInput = {
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    id?: UuidFilter<"Question"> | string
    questionGroupId?: UuidFilter<"Question"> | string
    type?: EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType
    content?: JsonFilter<"Question">
    answer?: JsonFilter<"Question">
    explanation?: StringNullableFilter<"Question"> | string | null
    orderIndex?: IntFilter<"Question"> | number
    group?: XOR<QuestionGroupScalarRelationFilter, QuestionGroupWhereInput>
  }

  export type QuestionOrderByWithRelationInput = {
    id?: SortOrder
    questionGroupId?: SortOrder
    type?: SortOrder
    content?: SortOrder
    answer?: SortOrder
    explanation?: SortOrderInput | SortOrder
    orderIndex?: SortOrder
    group?: QuestionGroupOrderByWithRelationInput
  }

  export type QuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    questionGroupId?: UuidFilter<"Question"> | string
    type?: EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType
    content?: JsonFilter<"Question">
    answer?: JsonFilter<"Question">
    explanation?: StringNullableFilter<"Question"> | string | null
    orderIndex?: IntFilter<"Question"> | number
    group?: XOR<QuestionGroupScalarRelationFilter, QuestionGroupWhereInput>
  }, "id">

  export type QuestionOrderByWithAggregationInput = {
    id?: SortOrder
    questionGroupId?: SortOrder
    type?: SortOrder
    content?: SortOrder
    answer?: SortOrder
    explanation?: SortOrderInput | SortOrder
    orderIndex?: SortOrder
    _count?: QuestionCountOrderByAggregateInput
    _avg?: QuestionAvgOrderByAggregateInput
    _max?: QuestionMaxOrderByAggregateInput
    _min?: QuestionMinOrderByAggregateInput
    _sum?: QuestionSumOrderByAggregateInput
  }

  export type QuestionScalarWhereWithAggregatesInput = {
    AND?: QuestionScalarWhereWithAggregatesInput | QuestionScalarWhereWithAggregatesInput[]
    OR?: QuestionScalarWhereWithAggregatesInput[]
    NOT?: QuestionScalarWhereWithAggregatesInput | QuestionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Question"> | string
    questionGroupId?: UuidWithAggregatesFilter<"Question"> | string
    type?: EnumQuestionTypeWithAggregatesFilter<"Question"> | $Enums.QuestionType
    content?: JsonWithAggregatesFilter<"Question">
    answer?: JsonWithAggregatesFilter<"Question">
    explanation?: StringNullableWithAggregatesFilter<"Question"> | string | null
    orderIndex?: IntWithAggregatesFilter<"Question"> | number
  }

  export type PracticeTestCreateInput = {
    id?: string
    title: string
    examType?: $Enums.ExamType
    status?: string
    duration: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sections?: ExamSectionCreateNestedManyWithoutTestInput
  }

  export type PracticeTestUncheckedCreateInput = {
    id?: string
    title: string
    examType?: $Enums.ExamType
    status?: string
    duration: number
    createdAt?: Date | string
    updatedAt?: Date | string
    sections?: ExamSectionUncheckedCreateNestedManyWithoutTestInput
  }

  export type PracticeTestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    examType?: EnumExamTypeFieldUpdateOperationsInput | $Enums.ExamType
    status?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: ExamSectionUpdateManyWithoutTestNestedInput
  }

  export type PracticeTestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    examType?: EnumExamTypeFieldUpdateOperationsInput | $Enums.ExamType
    status?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sections?: ExamSectionUncheckedUpdateManyWithoutTestNestedInput
  }

  export type PracticeTestCreateManyInput = {
    id?: string
    title: string
    examType?: $Enums.ExamType
    status?: string
    duration: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PracticeTestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    examType?: EnumExamTypeFieldUpdateOperationsInput | $Enums.ExamType
    status?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PracticeTestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    examType?: EnumExamTypeFieldUpdateOperationsInput | $Enums.ExamType
    status?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamSectionCreateInput = {
    id?: string
    name: string
    orderIndex: number
    test: PracticeTestCreateNestedOneWithoutSectionsInput
    parts?: ExamPartCreateNestedManyWithoutSectionInput
  }

  export type ExamSectionUncheckedCreateInput = {
    id?: string
    practiceTestId: string
    name: string
    orderIndex: number
    parts?: ExamPartUncheckedCreateNestedManyWithoutSectionInput
  }

  export type ExamSectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    test?: PracticeTestUpdateOneRequiredWithoutSectionsNestedInput
    parts?: ExamPartUpdateManyWithoutSectionNestedInput
  }

  export type ExamSectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    practiceTestId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    parts?: ExamPartUncheckedUpdateManyWithoutSectionNestedInput
  }

  export type ExamSectionCreateManyInput = {
    id?: string
    practiceTestId: string
    name: string
    orderIndex: number
  }

  export type ExamSectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type ExamSectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    practiceTestId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type ExamPartCreateInput = {
    id?: string
    name: string
    content?: string | null
    mediaUrl?: string | null
    orderIndex: number
    section: ExamSectionCreateNestedOneWithoutPartsInput
    questionGroups?: QuestionGroupCreateNestedManyWithoutPartInput
  }

  export type ExamPartUncheckedCreateInput = {
    id?: string
    examSectionId: string
    name: string
    content?: string | null
    mediaUrl?: string | null
    orderIndex: number
    questionGroups?: QuestionGroupUncheckedCreateNestedManyWithoutPartInput
  }

  export type ExamPartUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
    section?: ExamSectionUpdateOneRequiredWithoutPartsNestedInput
    questionGroups?: QuestionGroupUpdateManyWithoutPartNestedInput
  }

  export type ExamPartUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    examSectionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
    questionGroups?: QuestionGroupUncheckedUpdateManyWithoutPartNestedInput
  }

  export type ExamPartCreateManyInput = {
    id?: string
    examSectionId: string
    name: string
    content?: string | null
    mediaUrl?: string | null
    orderIndex: number
  }

  export type ExamPartUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type ExamPartUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    examSectionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type QuestionGroupCreateInput = {
    id?: string
    instructions?: string | null
    imageUrls?: QuestionGroupCreateimageUrlsInput | string[]
    orderIndex: number
    part: ExamPartCreateNestedOneWithoutQuestionGroupsInput
    questions?: QuestionCreateNestedManyWithoutGroupInput
  }

  export type QuestionGroupUncheckedCreateInput = {
    id?: string
    examPartId: string
    instructions?: string | null
    imageUrls?: QuestionGroupCreateimageUrlsInput | string[]
    orderIndex: number
    questions?: QuestionUncheckedCreateNestedManyWithoutGroupInput
  }

  export type QuestionGroupUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrls?: QuestionGroupUpdateimageUrlsInput | string[]
    orderIndex?: IntFieldUpdateOperationsInput | number
    part?: ExamPartUpdateOneRequiredWithoutQuestionGroupsNestedInput
    questions?: QuestionUpdateManyWithoutGroupNestedInput
  }

  export type QuestionGroupUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    examPartId?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrls?: QuestionGroupUpdateimageUrlsInput | string[]
    orderIndex?: IntFieldUpdateOperationsInput | number
    questions?: QuestionUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type QuestionGroupCreateManyInput = {
    id?: string
    examPartId: string
    instructions?: string | null
    imageUrls?: QuestionGroupCreateimageUrlsInput | string[]
    orderIndex: number
  }

  export type QuestionGroupUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrls?: QuestionGroupUpdateimageUrlsInput | string[]
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type QuestionGroupUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    examPartId?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrls?: QuestionGroupUpdateimageUrlsInput | string[]
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type QuestionCreateInput = {
    id?: string
    type: $Enums.QuestionType
    content: JsonNullValueInput | InputJsonValue
    answer: JsonNullValueInput | InputJsonValue
    explanation?: string | null
    orderIndex: number
    group: QuestionGroupCreateNestedOneWithoutQuestionsInput
  }

  export type QuestionUncheckedCreateInput = {
    id?: string
    questionGroupId: string
    type: $Enums.QuestionType
    content: JsonNullValueInput | InputJsonValue
    answer: JsonNullValueInput | InputJsonValue
    explanation?: string | null
    orderIndex: number
  }

  export type QuestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    content?: JsonNullValueInput | InputJsonValue
    answer?: JsonNullValueInput | InputJsonValue
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
    group?: QuestionGroupUpdateOneRequiredWithoutQuestionsNestedInput
  }

  export type QuestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionGroupId?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    content?: JsonNullValueInput | InputJsonValue
    answer?: JsonNullValueInput | InputJsonValue
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type QuestionCreateManyInput = {
    id?: string
    questionGroupId: string
    type: $Enums.QuestionType
    content: JsonNullValueInput | InputJsonValue
    answer: JsonNullValueInput | InputJsonValue
    explanation?: string | null
    orderIndex: number
  }

  export type QuestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    content?: JsonNullValueInput | InputJsonValue
    answer?: JsonNullValueInput | InputJsonValue
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type QuestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionGroupId?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    content?: JsonNullValueInput | InputJsonValue
    answer?: JsonNullValueInput | InputJsonValue
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
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

  export type EnumExamTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ExamType | EnumExamTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ExamType[] | ListEnumExamTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExamType[] | ListEnumExamTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumExamTypeFilter<$PrismaModel> | $Enums.ExamType
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
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

  export type ExamSectionListRelationFilter = {
    every?: ExamSectionWhereInput
    some?: ExamSectionWhereInput
    none?: ExamSectionWhereInput
  }

  export type ExamSectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PracticeTestCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    examType?: SortOrder
    status?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PracticeTestAvgOrderByAggregateInput = {
    duration?: SortOrder
  }

  export type PracticeTestMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    examType?: SortOrder
    status?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PracticeTestMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    examType?: SortOrder
    status?: SortOrder
    duration?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PracticeTestSumOrderByAggregateInput = {
    duration?: SortOrder
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

  export type EnumExamTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExamType | EnumExamTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ExamType[] | ListEnumExamTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExamType[] | ListEnumExamTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumExamTypeWithAggregatesFilter<$PrismaModel> | $Enums.ExamType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExamTypeFilter<$PrismaModel>
    _max?: NestedEnumExamTypeFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
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

  export type PracticeTestScalarRelationFilter = {
    is?: PracticeTestWhereInput
    isNot?: PracticeTestWhereInput
  }

  export type ExamPartListRelationFilter = {
    every?: ExamPartWhereInput
    some?: ExamPartWhereInput
    none?: ExamPartWhereInput
  }

  export type ExamPartOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExamSectionCountOrderByAggregateInput = {
    id?: SortOrder
    practiceTestId?: SortOrder
    name?: SortOrder
    orderIndex?: SortOrder
  }

  export type ExamSectionAvgOrderByAggregateInput = {
    orderIndex?: SortOrder
  }

  export type ExamSectionMaxOrderByAggregateInput = {
    id?: SortOrder
    practiceTestId?: SortOrder
    name?: SortOrder
    orderIndex?: SortOrder
  }

  export type ExamSectionMinOrderByAggregateInput = {
    id?: SortOrder
    practiceTestId?: SortOrder
    name?: SortOrder
    orderIndex?: SortOrder
  }

  export type ExamSectionSumOrderByAggregateInput = {
    orderIndex?: SortOrder
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

  export type ExamSectionScalarRelationFilter = {
    is?: ExamSectionWhereInput
    isNot?: ExamSectionWhereInput
  }

  export type QuestionGroupListRelationFilter = {
    every?: QuestionGroupWhereInput
    some?: QuestionGroupWhereInput
    none?: QuestionGroupWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type QuestionGroupOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExamPartCountOrderByAggregateInput = {
    id?: SortOrder
    examSectionId?: SortOrder
    name?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrder
    orderIndex?: SortOrder
  }

  export type ExamPartAvgOrderByAggregateInput = {
    orderIndex?: SortOrder
  }

  export type ExamPartMaxOrderByAggregateInput = {
    id?: SortOrder
    examSectionId?: SortOrder
    name?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrder
    orderIndex?: SortOrder
  }

  export type ExamPartMinOrderByAggregateInput = {
    id?: SortOrder
    examSectionId?: SortOrder
    name?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrder
    orderIndex?: SortOrder
  }

  export type ExamPartSumOrderByAggregateInput = {
    orderIndex?: SortOrder
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type ExamPartScalarRelationFilter = {
    is?: ExamPartWhereInput
    isNot?: ExamPartWhereInput
  }

  export type QuestionListRelationFilter = {
    every?: QuestionWhereInput
    some?: QuestionWhereInput
    none?: QuestionWhereInput
  }

  export type QuestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuestionGroupCountOrderByAggregateInput = {
    id?: SortOrder
    examPartId?: SortOrder
    instructions?: SortOrder
    imageUrls?: SortOrder
    orderIndex?: SortOrder
  }

  export type QuestionGroupAvgOrderByAggregateInput = {
    orderIndex?: SortOrder
  }

  export type QuestionGroupMaxOrderByAggregateInput = {
    id?: SortOrder
    examPartId?: SortOrder
    instructions?: SortOrder
    orderIndex?: SortOrder
  }

  export type QuestionGroupMinOrderByAggregateInput = {
    id?: SortOrder
    examPartId?: SortOrder
    instructions?: SortOrder
    orderIndex?: SortOrder
  }

  export type QuestionGroupSumOrderByAggregateInput = {
    orderIndex?: SortOrder
  }

  export type EnumQuestionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeFilter<$PrismaModel> | $Enums.QuestionType
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

  export type QuestionGroupScalarRelationFilter = {
    is?: QuestionGroupWhereInput
    isNot?: QuestionGroupWhereInput
  }

  export type QuestionCountOrderByAggregateInput = {
    id?: SortOrder
    questionGroupId?: SortOrder
    type?: SortOrder
    content?: SortOrder
    answer?: SortOrder
    explanation?: SortOrder
    orderIndex?: SortOrder
  }

  export type QuestionAvgOrderByAggregateInput = {
    orderIndex?: SortOrder
  }

  export type QuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    questionGroupId?: SortOrder
    type?: SortOrder
    explanation?: SortOrder
    orderIndex?: SortOrder
  }

  export type QuestionMinOrderByAggregateInput = {
    id?: SortOrder
    questionGroupId?: SortOrder
    type?: SortOrder
    explanation?: SortOrder
    orderIndex?: SortOrder
  }

  export type QuestionSumOrderByAggregateInput = {
    orderIndex?: SortOrder
  }

  export type EnumQuestionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel> | $Enums.QuestionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuestionTypeFilter<$PrismaModel>
    _max?: NestedEnumQuestionTypeFilter<$PrismaModel>
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

  export type ExamSectionCreateNestedManyWithoutTestInput = {
    create?: XOR<ExamSectionCreateWithoutTestInput, ExamSectionUncheckedCreateWithoutTestInput> | ExamSectionCreateWithoutTestInput[] | ExamSectionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: ExamSectionCreateOrConnectWithoutTestInput | ExamSectionCreateOrConnectWithoutTestInput[]
    createMany?: ExamSectionCreateManyTestInputEnvelope
    connect?: ExamSectionWhereUniqueInput | ExamSectionWhereUniqueInput[]
  }

  export type ExamSectionUncheckedCreateNestedManyWithoutTestInput = {
    create?: XOR<ExamSectionCreateWithoutTestInput, ExamSectionUncheckedCreateWithoutTestInput> | ExamSectionCreateWithoutTestInput[] | ExamSectionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: ExamSectionCreateOrConnectWithoutTestInput | ExamSectionCreateOrConnectWithoutTestInput[]
    createMany?: ExamSectionCreateManyTestInputEnvelope
    connect?: ExamSectionWhereUniqueInput | ExamSectionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumExamTypeFieldUpdateOperationsInput = {
    set?: $Enums.ExamType
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ExamSectionUpdateManyWithoutTestNestedInput = {
    create?: XOR<ExamSectionCreateWithoutTestInput, ExamSectionUncheckedCreateWithoutTestInput> | ExamSectionCreateWithoutTestInput[] | ExamSectionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: ExamSectionCreateOrConnectWithoutTestInput | ExamSectionCreateOrConnectWithoutTestInput[]
    upsert?: ExamSectionUpsertWithWhereUniqueWithoutTestInput | ExamSectionUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: ExamSectionCreateManyTestInputEnvelope
    set?: ExamSectionWhereUniqueInput | ExamSectionWhereUniqueInput[]
    disconnect?: ExamSectionWhereUniqueInput | ExamSectionWhereUniqueInput[]
    delete?: ExamSectionWhereUniqueInput | ExamSectionWhereUniqueInput[]
    connect?: ExamSectionWhereUniqueInput | ExamSectionWhereUniqueInput[]
    update?: ExamSectionUpdateWithWhereUniqueWithoutTestInput | ExamSectionUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: ExamSectionUpdateManyWithWhereWithoutTestInput | ExamSectionUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: ExamSectionScalarWhereInput | ExamSectionScalarWhereInput[]
  }

  export type ExamSectionUncheckedUpdateManyWithoutTestNestedInput = {
    create?: XOR<ExamSectionCreateWithoutTestInput, ExamSectionUncheckedCreateWithoutTestInput> | ExamSectionCreateWithoutTestInput[] | ExamSectionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: ExamSectionCreateOrConnectWithoutTestInput | ExamSectionCreateOrConnectWithoutTestInput[]
    upsert?: ExamSectionUpsertWithWhereUniqueWithoutTestInput | ExamSectionUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: ExamSectionCreateManyTestInputEnvelope
    set?: ExamSectionWhereUniqueInput | ExamSectionWhereUniqueInput[]
    disconnect?: ExamSectionWhereUniqueInput | ExamSectionWhereUniqueInput[]
    delete?: ExamSectionWhereUniqueInput | ExamSectionWhereUniqueInput[]
    connect?: ExamSectionWhereUniqueInput | ExamSectionWhereUniqueInput[]
    update?: ExamSectionUpdateWithWhereUniqueWithoutTestInput | ExamSectionUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: ExamSectionUpdateManyWithWhereWithoutTestInput | ExamSectionUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: ExamSectionScalarWhereInput | ExamSectionScalarWhereInput[]
  }

  export type PracticeTestCreateNestedOneWithoutSectionsInput = {
    create?: XOR<PracticeTestCreateWithoutSectionsInput, PracticeTestUncheckedCreateWithoutSectionsInput>
    connectOrCreate?: PracticeTestCreateOrConnectWithoutSectionsInput
    connect?: PracticeTestWhereUniqueInput
  }

  export type ExamPartCreateNestedManyWithoutSectionInput = {
    create?: XOR<ExamPartCreateWithoutSectionInput, ExamPartUncheckedCreateWithoutSectionInput> | ExamPartCreateWithoutSectionInput[] | ExamPartUncheckedCreateWithoutSectionInput[]
    connectOrCreate?: ExamPartCreateOrConnectWithoutSectionInput | ExamPartCreateOrConnectWithoutSectionInput[]
    createMany?: ExamPartCreateManySectionInputEnvelope
    connect?: ExamPartWhereUniqueInput | ExamPartWhereUniqueInput[]
  }

  export type ExamPartUncheckedCreateNestedManyWithoutSectionInput = {
    create?: XOR<ExamPartCreateWithoutSectionInput, ExamPartUncheckedCreateWithoutSectionInput> | ExamPartCreateWithoutSectionInput[] | ExamPartUncheckedCreateWithoutSectionInput[]
    connectOrCreate?: ExamPartCreateOrConnectWithoutSectionInput | ExamPartCreateOrConnectWithoutSectionInput[]
    createMany?: ExamPartCreateManySectionInputEnvelope
    connect?: ExamPartWhereUniqueInput | ExamPartWhereUniqueInput[]
  }

  export type PracticeTestUpdateOneRequiredWithoutSectionsNestedInput = {
    create?: XOR<PracticeTestCreateWithoutSectionsInput, PracticeTestUncheckedCreateWithoutSectionsInput>
    connectOrCreate?: PracticeTestCreateOrConnectWithoutSectionsInput
    upsert?: PracticeTestUpsertWithoutSectionsInput
    connect?: PracticeTestWhereUniqueInput
    update?: XOR<XOR<PracticeTestUpdateToOneWithWhereWithoutSectionsInput, PracticeTestUpdateWithoutSectionsInput>, PracticeTestUncheckedUpdateWithoutSectionsInput>
  }

  export type ExamPartUpdateManyWithoutSectionNestedInput = {
    create?: XOR<ExamPartCreateWithoutSectionInput, ExamPartUncheckedCreateWithoutSectionInput> | ExamPartCreateWithoutSectionInput[] | ExamPartUncheckedCreateWithoutSectionInput[]
    connectOrCreate?: ExamPartCreateOrConnectWithoutSectionInput | ExamPartCreateOrConnectWithoutSectionInput[]
    upsert?: ExamPartUpsertWithWhereUniqueWithoutSectionInput | ExamPartUpsertWithWhereUniqueWithoutSectionInput[]
    createMany?: ExamPartCreateManySectionInputEnvelope
    set?: ExamPartWhereUniqueInput | ExamPartWhereUniqueInput[]
    disconnect?: ExamPartWhereUniqueInput | ExamPartWhereUniqueInput[]
    delete?: ExamPartWhereUniqueInput | ExamPartWhereUniqueInput[]
    connect?: ExamPartWhereUniqueInput | ExamPartWhereUniqueInput[]
    update?: ExamPartUpdateWithWhereUniqueWithoutSectionInput | ExamPartUpdateWithWhereUniqueWithoutSectionInput[]
    updateMany?: ExamPartUpdateManyWithWhereWithoutSectionInput | ExamPartUpdateManyWithWhereWithoutSectionInput[]
    deleteMany?: ExamPartScalarWhereInput | ExamPartScalarWhereInput[]
  }

  export type ExamPartUncheckedUpdateManyWithoutSectionNestedInput = {
    create?: XOR<ExamPartCreateWithoutSectionInput, ExamPartUncheckedCreateWithoutSectionInput> | ExamPartCreateWithoutSectionInput[] | ExamPartUncheckedCreateWithoutSectionInput[]
    connectOrCreate?: ExamPartCreateOrConnectWithoutSectionInput | ExamPartCreateOrConnectWithoutSectionInput[]
    upsert?: ExamPartUpsertWithWhereUniqueWithoutSectionInput | ExamPartUpsertWithWhereUniqueWithoutSectionInput[]
    createMany?: ExamPartCreateManySectionInputEnvelope
    set?: ExamPartWhereUniqueInput | ExamPartWhereUniqueInput[]
    disconnect?: ExamPartWhereUniqueInput | ExamPartWhereUniqueInput[]
    delete?: ExamPartWhereUniqueInput | ExamPartWhereUniqueInput[]
    connect?: ExamPartWhereUniqueInput | ExamPartWhereUniqueInput[]
    update?: ExamPartUpdateWithWhereUniqueWithoutSectionInput | ExamPartUpdateWithWhereUniqueWithoutSectionInput[]
    updateMany?: ExamPartUpdateManyWithWhereWithoutSectionInput | ExamPartUpdateManyWithWhereWithoutSectionInput[]
    deleteMany?: ExamPartScalarWhereInput | ExamPartScalarWhereInput[]
  }

  export type ExamSectionCreateNestedOneWithoutPartsInput = {
    create?: XOR<ExamSectionCreateWithoutPartsInput, ExamSectionUncheckedCreateWithoutPartsInput>
    connectOrCreate?: ExamSectionCreateOrConnectWithoutPartsInput
    connect?: ExamSectionWhereUniqueInput
  }

  export type QuestionGroupCreateNestedManyWithoutPartInput = {
    create?: XOR<QuestionGroupCreateWithoutPartInput, QuestionGroupUncheckedCreateWithoutPartInput> | QuestionGroupCreateWithoutPartInput[] | QuestionGroupUncheckedCreateWithoutPartInput[]
    connectOrCreate?: QuestionGroupCreateOrConnectWithoutPartInput | QuestionGroupCreateOrConnectWithoutPartInput[]
    createMany?: QuestionGroupCreateManyPartInputEnvelope
    connect?: QuestionGroupWhereUniqueInput | QuestionGroupWhereUniqueInput[]
  }

  export type QuestionGroupUncheckedCreateNestedManyWithoutPartInput = {
    create?: XOR<QuestionGroupCreateWithoutPartInput, QuestionGroupUncheckedCreateWithoutPartInput> | QuestionGroupCreateWithoutPartInput[] | QuestionGroupUncheckedCreateWithoutPartInput[]
    connectOrCreate?: QuestionGroupCreateOrConnectWithoutPartInput | QuestionGroupCreateOrConnectWithoutPartInput[]
    createMany?: QuestionGroupCreateManyPartInputEnvelope
    connect?: QuestionGroupWhereUniqueInput | QuestionGroupWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type ExamSectionUpdateOneRequiredWithoutPartsNestedInput = {
    create?: XOR<ExamSectionCreateWithoutPartsInput, ExamSectionUncheckedCreateWithoutPartsInput>
    connectOrCreate?: ExamSectionCreateOrConnectWithoutPartsInput
    upsert?: ExamSectionUpsertWithoutPartsInput
    connect?: ExamSectionWhereUniqueInput
    update?: XOR<XOR<ExamSectionUpdateToOneWithWhereWithoutPartsInput, ExamSectionUpdateWithoutPartsInput>, ExamSectionUncheckedUpdateWithoutPartsInput>
  }

  export type QuestionGroupUpdateManyWithoutPartNestedInput = {
    create?: XOR<QuestionGroupCreateWithoutPartInput, QuestionGroupUncheckedCreateWithoutPartInput> | QuestionGroupCreateWithoutPartInput[] | QuestionGroupUncheckedCreateWithoutPartInput[]
    connectOrCreate?: QuestionGroupCreateOrConnectWithoutPartInput | QuestionGroupCreateOrConnectWithoutPartInput[]
    upsert?: QuestionGroupUpsertWithWhereUniqueWithoutPartInput | QuestionGroupUpsertWithWhereUniqueWithoutPartInput[]
    createMany?: QuestionGroupCreateManyPartInputEnvelope
    set?: QuestionGroupWhereUniqueInput | QuestionGroupWhereUniqueInput[]
    disconnect?: QuestionGroupWhereUniqueInput | QuestionGroupWhereUniqueInput[]
    delete?: QuestionGroupWhereUniqueInput | QuestionGroupWhereUniqueInput[]
    connect?: QuestionGroupWhereUniqueInput | QuestionGroupWhereUniqueInput[]
    update?: QuestionGroupUpdateWithWhereUniqueWithoutPartInput | QuestionGroupUpdateWithWhereUniqueWithoutPartInput[]
    updateMany?: QuestionGroupUpdateManyWithWhereWithoutPartInput | QuestionGroupUpdateManyWithWhereWithoutPartInput[]
    deleteMany?: QuestionGroupScalarWhereInput | QuestionGroupScalarWhereInput[]
  }

  export type QuestionGroupUncheckedUpdateManyWithoutPartNestedInput = {
    create?: XOR<QuestionGroupCreateWithoutPartInput, QuestionGroupUncheckedCreateWithoutPartInput> | QuestionGroupCreateWithoutPartInput[] | QuestionGroupUncheckedCreateWithoutPartInput[]
    connectOrCreate?: QuestionGroupCreateOrConnectWithoutPartInput | QuestionGroupCreateOrConnectWithoutPartInput[]
    upsert?: QuestionGroupUpsertWithWhereUniqueWithoutPartInput | QuestionGroupUpsertWithWhereUniqueWithoutPartInput[]
    createMany?: QuestionGroupCreateManyPartInputEnvelope
    set?: QuestionGroupWhereUniqueInput | QuestionGroupWhereUniqueInput[]
    disconnect?: QuestionGroupWhereUniqueInput | QuestionGroupWhereUniqueInput[]
    delete?: QuestionGroupWhereUniqueInput | QuestionGroupWhereUniqueInput[]
    connect?: QuestionGroupWhereUniqueInput | QuestionGroupWhereUniqueInput[]
    update?: QuestionGroupUpdateWithWhereUniqueWithoutPartInput | QuestionGroupUpdateWithWhereUniqueWithoutPartInput[]
    updateMany?: QuestionGroupUpdateManyWithWhereWithoutPartInput | QuestionGroupUpdateManyWithWhereWithoutPartInput[]
    deleteMany?: QuestionGroupScalarWhereInput | QuestionGroupScalarWhereInput[]
  }

  export type QuestionGroupCreateimageUrlsInput = {
    set: string[]
  }

  export type ExamPartCreateNestedOneWithoutQuestionGroupsInput = {
    create?: XOR<ExamPartCreateWithoutQuestionGroupsInput, ExamPartUncheckedCreateWithoutQuestionGroupsInput>
    connectOrCreate?: ExamPartCreateOrConnectWithoutQuestionGroupsInput
    connect?: ExamPartWhereUniqueInput
  }

  export type QuestionCreateNestedManyWithoutGroupInput = {
    create?: XOR<QuestionCreateWithoutGroupInput, QuestionUncheckedCreateWithoutGroupInput> | QuestionCreateWithoutGroupInput[] | QuestionUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutGroupInput | QuestionCreateOrConnectWithoutGroupInput[]
    createMany?: QuestionCreateManyGroupInputEnvelope
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
  }

  export type QuestionUncheckedCreateNestedManyWithoutGroupInput = {
    create?: XOR<QuestionCreateWithoutGroupInput, QuestionUncheckedCreateWithoutGroupInput> | QuestionCreateWithoutGroupInput[] | QuestionUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutGroupInput | QuestionCreateOrConnectWithoutGroupInput[]
    createMany?: QuestionCreateManyGroupInputEnvelope
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
  }

  export type QuestionGroupUpdateimageUrlsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type ExamPartUpdateOneRequiredWithoutQuestionGroupsNestedInput = {
    create?: XOR<ExamPartCreateWithoutQuestionGroupsInput, ExamPartUncheckedCreateWithoutQuestionGroupsInput>
    connectOrCreate?: ExamPartCreateOrConnectWithoutQuestionGroupsInput
    upsert?: ExamPartUpsertWithoutQuestionGroupsInput
    connect?: ExamPartWhereUniqueInput
    update?: XOR<XOR<ExamPartUpdateToOneWithWhereWithoutQuestionGroupsInput, ExamPartUpdateWithoutQuestionGroupsInput>, ExamPartUncheckedUpdateWithoutQuestionGroupsInput>
  }

  export type QuestionUpdateManyWithoutGroupNestedInput = {
    create?: XOR<QuestionCreateWithoutGroupInput, QuestionUncheckedCreateWithoutGroupInput> | QuestionCreateWithoutGroupInput[] | QuestionUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutGroupInput | QuestionCreateOrConnectWithoutGroupInput[]
    upsert?: QuestionUpsertWithWhereUniqueWithoutGroupInput | QuestionUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: QuestionCreateManyGroupInputEnvelope
    set?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    disconnect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    delete?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    update?: QuestionUpdateWithWhereUniqueWithoutGroupInput | QuestionUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: QuestionUpdateManyWithWhereWithoutGroupInput | QuestionUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
  }

  export type QuestionUncheckedUpdateManyWithoutGroupNestedInput = {
    create?: XOR<QuestionCreateWithoutGroupInput, QuestionUncheckedCreateWithoutGroupInput> | QuestionCreateWithoutGroupInput[] | QuestionUncheckedCreateWithoutGroupInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutGroupInput | QuestionCreateOrConnectWithoutGroupInput[]
    upsert?: QuestionUpsertWithWhereUniqueWithoutGroupInput | QuestionUpsertWithWhereUniqueWithoutGroupInput[]
    createMany?: QuestionCreateManyGroupInputEnvelope
    set?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    disconnect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    delete?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    update?: QuestionUpdateWithWhereUniqueWithoutGroupInput | QuestionUpdateWithWhereUniqueWithoutGroupInput[]
    updateMany?: QuestionUpdateManyWithWhereWithoutGroupInput | QuestionUpdateManyWithWhereWithoutGroupInput[]
    deleteMany?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
  }

  export type QuestionGroupCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<QuestionGroupCreateWithoutQuestionsInput, QuestionGroupUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: QuestionGroupCreateOrConnectWithoutQuestionsInput
    connect?: QuestionGroupWhereUniqueInput
  }

  export type EnumQuestionTypeFieldUpdateOperationsInput = {
    set?: $Enums.QuestionType
  }

  export type QuestionGroupUpdateOneRequiredWithoutQuestionsNestedInput = {
    create?: XOR<QuestionGroupCreateWithoutQuestionsInput, QuestionGroupUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: QuestionGroupCreateOrConnectWithoutQuestionsInput
    upsert?: QuestionGroupUpsertWithoutQuestionsInput
    connect?: QuestionGroupWhereUniqueInput
    update?: XOR<XOR<QuestionGroupUpdateToOneWithWhereWithoutQuestionsInput, QuestionGroupUpdateWithoutQuestionsInput>, QuestionGroupUncheckedUpdateWithoutQuestionsInput>
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

  export type NestedEnumExamTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ExamType | EnumExamTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ExamType[] | ListEnumExamTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExamType[] | ListEnumExamTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumExamTypeFilter<$PrismaModel> | $Enums.ExamType
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

  export type NestedEnumExamTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ExamType | EnumExamTypeFieldRefInput<$PrismaModel>
    in?: $Enums.ExamType[] | ListEnumExamTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.ExamType[] | ListEnumExamTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumExamTypeWithAggregatesFilter<$PrismaModel> | $Enums.ExamType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumExamTypeFilter<$PrismaModel>
    _max?: NestedEnumExamTypeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
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

  export type NestedEnumQuestionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeFilter<$PrismaModel> | $Enums.QuestionType
  }

  export type NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel> | $Enums.QuestionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuestionTypeFilter<$PrismaModel>
    _max?: NestedEnumQuestionTypeFilter<$PrismaModel>
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

  export type ExamSectionCreateWithoutTestInput = {
    id?: string
    name: string
    orderIndex: number
    parts?: ExamPartCreateNestedManyWithoutSectionInput
  }

  export type ExamSectionUncheckedCreateWithoutTestInput = {
    id?: string
    name: string
    orderIndex: number
    parts?: ExamPartUncheckedCreateNestedManyWithoutSectionInput
  }

  export type ExamSectionCreateOrConnectWithoutTestInput = {
    where: ExamSectionWhereUniqueInput
    create: XOR<ExamSectionCreateWithoutTestInput, ExamSectionUncheckedCreateWithoutTestInput>
  }

  export type ExamSectionCreateManyTestInputEnvelope = {
    data: ExamSectionCreateManyTestInput | ExamSectionCreateManyTestInput[]
    skipDuplicates?: boolean
  }

  export type ExamSectionUpsertWithWhereUniqueWithoutTestInput = {
    where: ExamSectionWhereUniqueInput
    update: XOR<ExamSectionUpdateWithoutTestInput, ExamSectionUncheckedUpdateWithoutTestInput>
    create: XOR<ExamSectionCreateWithoutTestInput, ExamSectionUncheckedCreateWithoutTestInput>
  }

  export type ExamSectionUpdateWithWhereUniqueWithoutTestInput = {
    where: ExamSectionWhereUniqueInput
    data: XOR<ExamSectionUpdateWithoutTestInput, ExamSectionUncheckedUpdateWithoutTestInput>
  }

  export type ExamSectionUpdateManyWithWhereWithoutTestInput = {
    where: ExamSectionScalarWhereInput
    data: XOR<ExamSectionUpdateManyMutationInput, ExamSectionUncheckedUpdateManyWithoutTestInput>
  }

  export type ExamSectionScalarWhereInput = {
    AND?: ExamSectionScalarWhereInput | ExamSectionScalarWhereInput[]
    OR?: ExamSectionScalarWhereInput[]
    NOT?: ExamSectionScalarWhereInput | ExamSectionScalarWhereInput[]
    id?: UuidFilter<"ExamSection"> | string
    practiceTestId?: UuidFilter<"ExamSection"> | string
    name?: StringFilter<"ExamSection"> | string
    orderIndex?: IntFilter<"ExamSection"> | number
  }

  export type PracticeTestCreateWithoutSectionsInput = {
    id?: string
    title: string
    examType?: $Enums.ExamType
    status?: string
    duration: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PracticeTestUncheckedCreateWithoutSectionsInput = {
    id?: string
    title: string
    examType?: $Enums.ExamType
    status?: string
    duration: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PracticeTestCreateOrConnectWithoutSectionsInput = {
    where: PracticeTestWhereUniqueInput
    create: XOR<PracticeTestCreateWithoutSectionsInput, PracticeTestUncheckedCreateWithoutSectionsInput>
  }

  export type ExamPartCreateWithoutSectionInput = {
    id?: string
    name: string
    content?: string | null
    mediaUrl?: string | null
    orderIndex: number
    questionGroups?: QuestionGroupCreateNestedManyWithoutPartInput
  }

  export type ExamPartUncheckedCreateWithoutSectionInput = {
    id?: string
    name: string
    content?: string | null
    mediaUrl?: string | null
    orderIndex: number
    questionGroups?: QuestionGroupUncheckedCreateNestedManyWithoutPartInput
  }

  export type ExamPartCreateOrConnectWithoutSectionInput = {
    where: ExamPartWhereUniqueInput
    create: XOR<ExamPartCreateWithoutSectionInput, ExamPartUncheckedCreateWithoutSectionInput>
  }

  export type ExamPartCreateManySectionInputEnvelope = {
    data: ExamPartCreateManySectionInput | ExamPartCreateManySectionInput[]
    skipDuplicates?: boolean
  }

  export type PracticeTestUpsertWithoutSectionsInput = {
    update: XOR<PracticeTestUpdateWithoutSectionsInput, PracticeTestUncheckedUpdateWithoutSectionsInput>
    create: XOR<PracticeTestCreateWithoutSectionsInput, PracticeTestUncheckedCreateWithoutSectionsInput>
    where?: PracticeTestWhereInput
  }

  export type PracticeTestUpdateToOneWithWhereWithoutSectionsInput = {
    where?: PracticeTestWhereInput
    data: XOR<PracticeTestUpdateWithoutSectionsInput, PracticeTestUncheckedUpdateWithoutSectionsInput>
  }

  export type PracticeTestUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    examType?: EnumExamTypeFieldUpdateOperationsInput | $Enums.ExamType
    status?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PracticeTestUncheckedUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    examType?: EnumExamTypeFieldUpdateOperationsInput | $Enums.ExamType
    status?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExamPartUpsertWithWhereUniqueWithoutSectionInput = {
    where: ExamPartWhereUniqueInput
    update: XOR<ExamPartUpdateWithoutSectionInput, ExamPartUncheckedUpdateWithoutSectionInput>
    create: XOR<ExamPartCreateWithoutSectionInput, ExamPartUncheckedCreateWithoutSectionInput>
  }

  export type ExamPartUpdateWithWhereUniqueWithoutSectionInput = {
    where: ExamPartWhereUniqueInput
    data: XOR<ExamPartUpdateWithoutSectionInput, ExamPartUncheckedUpdateWithoutSectionInput>
  }

  export type ExamPartUpdateManyWithWhereWithoutSectionInput = {
    where: ExamPartScalarWhereInput
    data: XOR<ExamPartUpdateManyMutationInput, ExamPartUncheckedUpdateManyWithoutSectionInput>
  }

  export type ExamPartScalarWhereInput = {
    AND?: ExamPartScalarWhereInput | ExamPartScalarWhereInput[]
    OR?: ExamPartScalarWhereInput[]
    NOT?: ExamPartScalarWhereInput | ExamPartScalarWhereInput[]
    id?: UuidFilter<"ExamPart"> | string
    examSectionId?: UuidFilter<"ExamPart"> | string
    name?: StringFilter<"ExamPart"> | string
    content?: StringNullableFilter<"ExamPart"> | string | null
    mediaUrl?: StringNullableFilter<"ExamPart"> | string | null
    orderIndex?: IntFilter<"ExamPart"> | number
  }

  export type ExamSectionCreateWithoutPartsInput = {
    id?: string
    name: string
    orderIndex: number
    test: PracticeTestCreateNestedOneWithoutSectionsInput
  }

  export type ExamSectionUncheckedCreateWithoutPartsInput = {
    id?: string
    practiceTestId: string
    name: string
    orderIndex: number
  }

  export type ExamSectionCreateOrConnectWithoutPartsInput = {
    where: ExamSectionWhereUniqueInput
    create: XOR<ExamSectionCreateWithoutPartsInput, ExamSectionUncheckedCreateWithoutPartsInput>
  }

  export type QuestionGroupCreateWithoutPartInput = {
    id?: string
    instructions?: string | null
    imageUrls?: QuestionGroupCreateimageUrlsInput | string[]
    orderIndex: number
    questions?: QuestionCreateNestedManyWithoutGroupInput
  }

  export type QuestionGroupUncheckedCreateWithoutPartInput = {
    id?: string
    instructions?: string | null
    imageUrls?: QuestionGroupCreateimageUrlsInput | string[]
    orderIndex: number
    questions?: QuestionUncheckedCreateNestedManyWithoutGroupInput
  }

  export type QuestionGroupCreateOrConnectWithoutPartInput = {
    where: QuestionGroupWhereUniqueInput
    create: XOR<QuestionGroupCreateWithoutPartInput, QuestionGroupUncheckedCreateWithoutPartInput>
  }

  export type QuestionGroupCreateManyPartInputEnvelope = {
    data: QuestionGroupCreateManyPartInput | QuestionGroupCreateManyPartInput[]
    skipDuplicates?: boolean
  }

  export type ExamSectionUpsertWithoutPartsInput = {
    update: XOR<ExamSectionUpdateWithoutPartsInput, ExamSectionUncheckedUpdateWithoutPartsInput>
    create: XOR<ExamSectionCreateWithoutPartsInput, ExamSectionUncheckedCreateWithoutPartsInput>
    where?: ExamSectionWhereInput
  }

  export type ExamSectionUpdateToOneWithWhereWithoutPartsInput = {
    where?: ExamSectionWhereInput
    data: XOR<ExamSectionUpdateWithoutPartsInput, ExamSectionUncheckedUpdateWithoutPartsInput>
  }

  export type ExamSectionUpdateWithoutPartsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    test?: PracticeTestUpdateOneRequiredWithoutSectionsNestedInput
  }

  export type ExamSectionUncheckedUpdateWithoutPartsInput = {
    id?: StringFieldUpdateOperationsInput | string
    practiceTestId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type QuestionGroupUpsertWithWhereUniqueWithoutPartInput = {
    where: QuestionGroupWhereUniqueInput
    update: XOR<QuestionGroupUpdateWithoutPartInput, QuestionGroupUncheckedUpdateWithoutPartInput>
    create: XOR<QuestionGroupCreateWithoutPartInput, QuestionGroupUncheckedCreateWithoutPartInput>
  }

  export type QuestionGroupUpdateWithWhereUniqueWithoutPartInput = {
    where: QuestionGroupWhereUniqueInput
    data: XOR<QuestionGroupUpdateWithoutPartInput, QuestionGroupUncheckedUpdateWithoutPartInput>
  }

  export type QuestionGroupUpdateManyWithWhereWithoutPartInput = {
    where: QuestionGroupScalarWhereInput
    data: XOR<QuestionGroupUpdateManyMutationInput, QuestionGroupUncheckedUpdateManyWithoutPartInput>
  }

  export type QuestionGroupScalarWhereInput = {
    AND?: QuestionGroupScalarWhereInput | QuestionGroupScalarWhereInput[]
    OR?: QuestionGroupScalarWhereInput[]
    NOT?: QuestionGroupScalarWhereInput | QuestionGroupScalarWhereInput[]
    id?: UuidFilter<"QuestionGroup"> | string
    examPartId?: UuidFilter<"QuestionGroup"> | string
    instructions?: StringNullableFilter<"QuestionGroup"> | string | null
    imageUrls?: StringNullableListFilter<"QuestionGroup">
    orderIndex?: IntFilter<"QuestionGroup"> | number
  }

  export type ExamPartCreateWithoutQuestionGroupsInput = {
    id?: string
    name: string
    content?: string | null
    mediaUrl?: string | null
    orderIndex: number
    section: ExamSectionCreateNestedOneWithoutPartsInput
  }

  export type ExamPartUncheckedCreateWithoutQuestionGroupsInput = {
    id?: string
    examSectionId: string
    name: string
    content?: string | null
    mediaUrl?: string | null
    orderIndex: number
  }

  export type ExamPartCreateOrConnectWithoutQuestionGroupsInput = {
    where: ExamPartWhereUniqueInput
    create: XOR<ExamPartCreateWithoutQuestionGroupsInput, ExamPartUncheckedCreateWithoutQuestionGroupsInput>
  }

  export type QuestionCreateWithoutGroupInput = {
    id?: string
    type: $Enums.QuestionType
    content: JsonNullValueInput | InputJsonValue
    answer: JsonNullValueInput | InputJsonValue
    explanation?: string | null
    orderIndex: number
  }

  export type QuestionUncheckedCreateWithoutGroupInput = {
    id?: string
    type: $Enums.QuestionType
    content: JsonNullValueInput | InputJsonValue
    answer: JsonNullValueInput | InputJsonValue
    explanation?: string | null
    orderIndex: number
  }

  export type QuestionCreateOrConnectWithoutGroupInput = {
    where: QuestionWhereUniqueInput
    create: XOR<QuestionCreateWithoutGroupInput, QuestionUncheckedCreateWithoutGroupInput>
  }

  export type QuestionCreateManyGroupInputEnvelope = {
    data: QuestionCreateManyGroupInput | QuestionCreateManyGroupInput[]
    skipDuplicates?: boolean
  }

  export type ExamPartUpsertWithoutQuestionGroupsInput = {
    update: XOR<ExamPartUpdateWithoutQuestionGroupsInput, ExamPartUncheckedUpdateWithoutQuestionGroupsInput>
    create: XOR<ExamPartCreateWithoutQuestionGroupsInput, ExamPartUncheckedCreateWithoutQuestionGroupsInput>
    where?: ExamPartWhereInput
  }

  export type ExamPartUpdateToOneWithWhereWithoutQuestionGroupsInput = {
    where?: ExamPartWhereInput
    data: XOR<ExamPartUpdateWithoutQuestionGroupsInput, ExamPartUncheckedUpdateWithoutQuestionGroupsInput>
  }

  export type ExamPartUpdateWithoutQuestionGroupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
    section?: ExamSectionUpdateOneRequiredWithoutPartsNestedInput
  }

  export type ExamPartUncheckedUpdateWithoutQuestionGroupsInput = {
    id?: StringFieldUpdateOperationsInput | string
    examSectionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type QuestionUpsertWithWhereUniqueWithoutGroupInput = {
    where: QuestionWhereUniqueInput
    update: XOR<QuestionUpdateWithoutGroupInput, QuestionUncheckedUpdateWithoutGroupInput>
    create: XOR<QuestionCreateWithoutGroupInput, QuestionUncheckedCreateWithoutGroupInput>
  }

  export type QuestionUpdateWithWhereUniqueWithoutGroupInput = {
    where: QuestionWhereUniqueInput
    data: XOR<QuestionUpdateWithoutGroupInput, QuestionUncheckedUpdateWithoutGroupInput>
  }

  export type QuestionUpdateManyWithWhereWithoutGroupInput = {
    where: QuestionScalarWhereInput
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyWithoutGroupInput>
  }

  export type QuestionScalarWhereInput = {
    AND?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
    OR?: QuestionScalarWhereInput[]
    NOT?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
    id?: UuidFilter<"Question"> | string
    questionGroupId?: UuidFilter<"Question"> | string
    type?: EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType
    content?: JsonFilter<"Question">
    answer?: JsonFilter<"Question">
    explanation?: StringNullableFilter<"Question"> | string | null
    orderIndex?: IntFilter<"Question"> | number
  }

  export type QuestionGroupCreateWithoutQuestionsInput = {
    id?: string
    instructions?: string | null
    imageUrls?: QuestionGroupCreateimageUrlsInput | string[]
    orderIndex: number
    part: ExamPartCreateNestedOneWithoutQuestionGroupsInput
  }

  export type QuestionGroupUncheckedCreateWithoutQuestionsInput = {
    id?: string
    examPartId: string
    instructions?: string | null
    imageUrls?: QuestionGroupCreateimageUrlsInput | string[]
    orderIndex: number
  }

  export type QuestionGroupCreateOrConnectWithoutQuestionsInput = {
    where: QuestionGroupWhereUniqueInput
    create: XOR<QuestionGroupCreateWithoutQuestionsInput, QuestionGroupUncheckedCreateWithoutQuestionsInput>
  }

  export type QuestionGroupUpsertWithoutQuestionsInput = {
    update: XOR<QuestionGroupUpdateWithoutQuestionsInput, QuestionGroupUncheckedUpdateWithoutQuestionsInput>
    create: XOR<QuestionGroupCreateWithoutQuestionsInput, QuestionGroupUncheckedCreateWithoutQuestionsInput>
    where?: QuestionGroupWhereInput
  }

  export type QuestionGroupUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: QuestionGroupWhereInput
    data: XOR<QuestionGroupUpdateWithoutQuestionsInput, QuestionGroupUncheckedUpdateWithoutQuestionsInput>
  }

  export type QuestionGroupUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrls?: QuestionGroupUpdateimageUrlsInput | string[]
    orderIndex?: IntFieldUpdateOperationsInput | number
    part?: ExamPartUpdateOneRequiredWithoutQuestionGroupsNestedInput
  }

  export type QuestionGroupUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    examPartId?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrls?: QuestionGroupUpdateimageUrlsInput | string[]
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type ExamSectionCreateManyTestInput = {
    id?: string
    name: string
    orderIndex: number
  }

  export type ExamSectionUpdateWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    parts?: ExamPartUpdateManyWithoutSectionNestedInput
  }

  export type ExamSectionUncheckedUpdateWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
    parts?: ExamPartUncheckedUpdateManyWithoutSectionNestedInput
  }

  export type ExamSectionUncheckedUpdateManyWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type ExamPartCreateManySectionInput = {
    id?: string
    name: string
    content?: string | null
    mediaUrl?: string | null
    orderIndex: number
  }

  export type ExamPartUpdateWithoutSectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
    questionGroups?: QuestionGroupUpdateManyWithoutPartNestedInput
  }

  export type ExamPartUncheckedUpdateWithoutSectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
    questionGroups?: QuestionGroupUncheckedUpdateManyWithoutPartNestedInput
  }

  export type ExamPartUncheckedUpdateManyWithoutSectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    content?: NullableStringFieldUpdateOperationsInput | string | null
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type QuestionGroupCreateManyPartInput = {
    id?: string
    instructions?: string | null
    imageUrls?: QuestionGroupCreateimageUrlsInput | string[]
    orderIndex: number
  }

  export type QuestionGroupUpdateWithoutPartInput = {
    id?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrls?: QuestionGroupUpdateimageUrlsInput | string[]
    orderIndex?: IntFieldUpdateOperationsInput | number
    questions?: QuestionUpdateManyWithoutGroupNestedInput
  }

  export type QuestionGroupUncheckedUpdateWithoutPartInput = {
    id?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrls?: QuestionGroupUpdateimageUrlsInput | string[]
    orderIndex?: IntFieldUpdateOperationsInput | number
    questions?: QuestionUncheckedUpdateManyWithoutGroupNestedInput
  }

  export type QuestionGroupUncheckedUpdateManyWithoutPartInput = {
    id?: StringFieldUpdateOperationsInput | string
    instructions?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrls?: QuestionGroupUpdateimageUrlsInput | string[]
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type QuestionCreateManyGroupInput = {
    id?: string
    type: $Enums.QuestionType
    content: JsonNullValueInput | InputJsonValue
    answer: JsonNullValueInput | InputJsonValue
    explanation?: string | null
    orderIndex: number
  }

  export type QuestionUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    content?: JsonNullValueInput | InputJsonValue
    answer?: JsonNullValueInput | InputJsonValue
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type QuestionUncheckedUpdateWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    content?: JsonNullValueInput | InputJsonValue
    answer?: JsonNullValueInput | InputJsonValue
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
  }

  export type QuestionUncheckedUpdateManyWithoutGroupInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    content?: JsonNullValueInput | InputJsonValue
    answer?: JsonNullValueInput | InputJsonValue
    explanation?: NullableStringFieldUpdateOperationsInput | string | null
    orderIndex?: IntFieldUpdateOperationsInput | number
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