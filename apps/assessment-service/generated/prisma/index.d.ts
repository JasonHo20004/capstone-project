
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
 * Model EnglishTestType
 * 
 */
export type EnglishTestType = $Result.DefaultSelection<Prisma.$EnglishTestTypePayload>
/**
 * Model Test
 * 
 */
export type Test = $Result.DefaultSelection<Prisma.$TestPayload>
/**
 * Model CourseTest
 * 
 */
export type CourseTest = $Result.DefaultSelection<Prisma.$CourseTestPayload>
/**
 * Model Section
 * 
 */
export type Section = $Result.DefaultSelection<Prisma.$SectionPayload>
/**
 * Model Passage
 * 
 */
export type Passage = $Result.DefaultSelection<Prisma.$PassagePayload>
/**
 * Model Question
 * 
 */
export type Question = $Result.DefaultSelection<Prisma.$QuestionPayload>
/**
 * Model PracticeSession
 * 
 */
export type PracticeSession = $Result.DefaultSelection<Prisma.$PracticeSessionPayload>
/**
 * Model UserAnswer
 * 
 */
export type UserAnswer = $Result.DefaultSelection<Prisma.$UserAnswerPayload>
/**
 * Model ScoreConversion
 * 
 */
export type ScoreConversion = $Result.DefaultSelection<Prisma.$ScoreConversionPayload>
/**
 * Model TestSkill
 * 
 */
export type TestSkill = $Result.DefaultSelection<Prisma.$TestSkillPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const SessionStatus: {
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED'
};

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus]


export const QuestionType: {
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  ESSAY: 'ESSAY',
  FILL_IN_THE_BLANK: 'FILL_IN_THE_BLANK'
};

export type QuestionType = (typeof QuestionType)[keyof typeof QuestionType]


export const SkillType: {
  READING: 'READING',
  LISTENING: 'LISTENING',
  WRITING: 'WRITING',
  SPEAKING: 'SPEAKING'
};

export type SkillType = (typeof SkillType)[keyof typeof SkillType]


export const TestType: {
  FINAL: 'FINAL'
};

export type TestType = (typeof TestType)[keyof typeof TestType]

}

export type SessionStatus = $Enums.SessionStatus

export const SessionStatus: typeof $Enums.SessionStatus

export type QuestionType = $Enums.QuestionType

export const QuestionType: typeof $Enums.QuestionType

export type SkillType = $Enums.SkillType

export const SkillType: typeof $Enums.SkillType

export type TestType = $Enums.TestType

export const TestType: typeof $Enums.TestType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more EnglishTestTypes
 * const englishTestTypes = await prisma.englishTestType.findMany()
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
   * // Fetch zero or more EnglishTestTypes
   * const englishTestTypes = await prisma.englishTestType.findMany()
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
   * `prisma.englishTestType`: Exposes CRUD operations for the **EnglishTestType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EnglishTestTypes
    * const englishTestTypes = await prisma.englishTestType.findMany()
    * ```
    */
  get englishTestType(): Prisma.EnglishTestTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.test`: Exposes CRUD operations for the **Test** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tests
    * const tests = await prisma.test.findMany()
    * ```
    */
  get test(): Prisma.TestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.courseTest`: Exposes CRUD operations for the **CourseTest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CourseTests
    * const courseTests = await prisma.courseTest.findMany()
    * ```
    */
  get courseTest(): Prisma.CourseTestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.section`: Exposes CRUD operations for the **Section** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sections
    * const sections = await prisma.section.findMany()
    * ```
    */
  get section(): Prisma.SectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passage`: Exposes CRUD operations for the **Passage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Passages
    * const passages = await prisma.passage.findMany()
    * ```
    */
  get passage(): Prisma.PassageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.question`: Exposes CRUD operations for the **Question** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Questions
    * const questions = await prisma.question.findMany()
    * ```
    */
  get question(): Prisma.QuestionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.practiceSession`: Exposes CRUD operations for the **PracticeSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PracticeSessions
    * const practiceSessions = await prisma.practiceSession.findMany()
    * ```
    */
  get practiceSession(): Prisma.PracticeSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userAnswer`: Exposes CRUD operations for the **UserAnswer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserAnswers
    * const userAnswers = await prisma.userAnswer.findMany()
    * ```
    */
  get userAnswer(): Prisma.UserAnswerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scoreConversion`: Exposes CRUD operations for the **ScoreConversion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScoreConversions
    * const scoreConversions = await prisma.scoreConversion.findMany()
    * ```
    */
  get scoreConversion(): Prisma.ScoreConversionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.testSkill`: Exposes CRUD operations for the **TestSkill** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TestSkills
    * const testSkills = await prisma.testSkill.findMany()
    * ```
    */
  get testSkill(): Prisma.TestSkillDelegate<ExtArgs, ClientOptions>;
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
    EnglishTestType: 'EnglishTestType',
    Test: 'Test',
    CourseTest: 'CourseTest',
    Section: 'Section',
    Passage: 'Passage',
    Question: 'Question',
    PracticeSession: 'PracticeSession',
    UserAnswer: 'UserAnswer',
    ScoreConversion: 'ScoreConversion',
    TestSkill: 'TestSkill'
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
      modelProps: "englishTestType" | "test" | "courseTest" | "section" | "passage" | "question" | "practiceSession" | "userAnswer" | "scoreConversion" | "testSkill"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      EnglishTestType: {
        payload: Prisma.$EnglishTestTypePayload<ExtArgs>
        fields: Prisma.EnglishTestTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EnglishTestTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnglishTestTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EnglishTestTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnglishTestTypePayload>
          }
          findFirst: {
            args: Prisma.EnglishTestTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnglishTestTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EnglishTestTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnglishTestTypePayload>
          }
          findMany: {
            args: Prisma.EnglishTestTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnglishTestTypePayload>[]
          }
          create: {
            args: Prisma.EnglishTestTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnglishTestTypePayload>
          }
          createMany: {
            args: Prisma.EnglishTestTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EnglishTestTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnglishTestTypePayload>[]
          }
          delete: {
            args: Prisma.EnglishTestTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnglishTestTypePayload>
          }
          update: {
            args: Prisma.EnglishTestTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnglishTestTypePayload>
          }
          deleteMany: {
            args: Prisma.EnglishTestTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EnglishTestTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EnglishTestTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnglishTestTypePayload>[]
          }
          upsert: {
            args: Prisma.EnglishTestTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EnglishTestTypePayload>
          }
          aggregate: {
            args: Prisma.EnglishTestTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEnglishTestType>
          }
          groupBy: {
            args: Prisma.EnglishTestTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<EnglishTestTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.EnglishTestTypeCountArgs<ExtArgs>
            result: $Utils.Optional<EnglishTestTypeCountAggregateOutputType> | number
          }
        }
      }
      Test: {
        payload: Prisma.$TestPayload<ExtArgs>
        fields: Prisma.TestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>
          }
          findFirst: {
            args: Prisma.TestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>
          }
          findMany: {
            args: Prisma.TestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>[]
          }
          create: {
            args: Prisma.TestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>
          }
          createMany: {
            args: Prisma.TestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>[]
          }
          delete: {
            args: Prisma.TestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>
          }
          update: {
            args: Prisma.TestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>
          }
          deleteMany: {
            args: Prisma.TestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>[]
          }
          upsert: {
            args: Prisma.TestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestPayload>
          }
          aggregate: {
            args: Prisma.TestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTest>
          }
          groupBy: {
            args: Prisma.TestGroupByArgs<ExtArgs>
            result: $Utils.Optional<TestGroupByOutputType>[]
          }
          count: {
            args: Prisma.TestCountArgs<ExtArgs>
            result: $Utils.Optional<TestCountAggregateOutputType> | number
          }
        }
      }
      CourseTest: {
        payload: Prisma.$CourseTestPayload<ExtArgs>
        fields: Prisma.CourseTestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CourseTestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseTestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CourseTestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseTestPayload>
          }
          findFirst: {
            args: Prisma.CourseTestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseTestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CourseTestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseTestPayload>
          }
          findMany: {
            args: Prisma.CourseTestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseTestPayload>[]
          }
          create: {
            args: Prisma.CourseTestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseTestPayload>
          }
          createMany: {
            args: Prisma.CourseTestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CourseTestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseTestPayload>[]
          }
          delete: {
            args: Prisma.CourseTestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseTestPayload>
          }
          update: {
            args: Prisma.CourseTestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseTestPayload>
          }
          deleteMany: {
            args: Prisma.CourseTestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CourseTestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CourseTestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseTestPayload>[]
          }
          upsert: {
            args: Prisma.CourseTestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourseTestPayload>
          }
          aggregate: {
            args: Prisma.CourseTestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCourseTest>
          }
          groupBy: {
            args: Prisma.CourseTestGroupByArgs<ExtArgs>
            result: $Utils.Optional<CourseTestGroupByOutputType>[]
          }
          count: {
            args: Prisma.CourseTestCountArgs<ExtArgs>
            result: $Utils.Optional<CourseTestCountAggregateOutputType> | number
          }
        }
      }
      Section: {
        payload: Prisma.$SectionPayload<ExtArgs>
        fields: Prisma.SectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>
          }
          findFirst: {
            args: Prisma.SectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>
          }
          findMany: {
            args: Prisma.SectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>[]
          }
          create: {
            args: Prisma.SectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>
          }
          createMany: {
            args: Prisma.SectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>[]
          }
          delete: {
            args: Prisma.SectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>
          }
          update: {
            args: Prisma.SectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>
          }
          deleteMany: {
            args: Prisma.SectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>[]
          }
          upsert: {
            args: Prisma.SectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SectionPayload>
          }
          aggregate: {
            args: Prisma.SectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSection>
          }
          groupBy: {
            args: Prisma.SectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SectionCountArgs<ExtArgs>
            result: $Utils.Optional<SectionCountAggregateOutputType> | number
          }
        }
      }
      Passage: {
        payload: Prisma.$PassagePayload<ExtArgs>
        fields: Prisma.PassageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PassageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PassageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassagePayload>
          }
          findFirst: {
            args: Prisma.PassageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PassageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassagePayload>
          }
          findMany: {
            args: Prisma.PassageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassagePayload>[]
          }
          create: {
            args: Prisma.PassageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassagePayload>
          }
          createMany: {
            args: Prisma.PassageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PassageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassagePayload>[]
          }
          delete: {
            args: Prisma.PassageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassagePayload>
          }
          update: {
            args: Prisma.PassageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassagePayload>
          }
          deleteMany: {
            args: Prisma.PassageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PassageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PassageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassagePayload>[]
          }
          upsert: {
            args: Prisma.PassageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PassagePayload>
          }
          aggregate: {
            args: Prisma.PassageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePassage>
          }
          groupBy: {
            args: Prisma.PassageGroupByArgs<ExtArgs>
            result: $Utils.Optional<PassageGroupByOutputType>[]
          }
          count: {
            args: Prisma.PassageCountArgs<ExtArgs>
            result: $Utils.Optional<PassageCountAggregateOutputType> | number
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
      PracticeSession: {
        payload: Prisma.$PracticeSessionPayload<ExtArgs>
        fields: Prisma.PracticeSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PracticeSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PracticeSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeSessionPayload>
          }
          findFirst: {
            args: Prisma.PracticeSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PracticeSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeSessionPayload>
          }
          findMany: {
            args: Prisma.PracticeSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeSessionPayload>[]
          }
          create: {
            args: Prisma.PracticeSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeSessionPayload>
          }
          createMany: {
            args: Prisma.PracticeSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PracticeSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeSessionPayload>[]
          }
          delete: {
            args: Prisma.PracticeSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeSessionPayload>
          }
          update: {
            args: Prisma.PracticeSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeSessionPayload>
          }
          deleteMany: {
            args: Prisma.PracticeSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PracticeSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PracticeSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeSessionPayload>[]
          }
          upsert: {
            args: Prisma.PracticeSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PracticeSessionPayload>
          }
          aggregate: {
            args: Prisma.PracticeSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePracticeSession>
          }
          groupBy: {
            args: Prisma.PracticeSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PracticeSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PracticeSessionCountArgs<ExtArgs>
            result: $Utils.Optional<PracticeSessionCountAggregateOutputType> | number
          }
        }
      }
      UserAnswer: {
        payload: Prisma.$UserAnswerPayload<ExtArgs>
        fields: Prisma.UserAnswerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserAnswerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnswerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserAnswerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnswerPayload>
          }
          findFirst: {
            args: Prisma.UserAnswerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnswerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserAnswerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnswerPayload>
          }
          findMany: {
            args: Prisma.UserAnswerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnswerPayload>[]
          }
          create: {
            args: Prisma.UserAnswerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnswerPayload>
          }
          createMany: {
            args: Prisma.UserAnswerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserAnswerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnswerPayload>[]
          }
          delete: {
            args: Prisma.UserAnswerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnswerPayload>
          }
          update: {
            args: Prisma.UserAnswerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnswerPayload>
          }
          deleteMany: {
            args: Prisma.UserAnswerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserAnswerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserAnswerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnswerPayload>[]
          }
          upsert: {
            args: Prisma.UserAnswerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAnswerPayload>
          }
          aggregate: {
            args: Prisma.UserAnswerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserAnswer>
          }
          groupBy: {
            args: Prisma.UserAnswerGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserAnswerGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserAnswerCountArgs<ExtArgs>
            result: $Utils.Optional<UserAnswerCountAggregateOutputType> | number
          }
        }
      }
      ScoreConversion: {
        payload: Prisma.$ScoreConversionPayload<ExtArgs>
        fields: Prisma.ScoreConversionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScoreConversionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreConversionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScoreConversionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreConversionPayload>
          }
          findFirst: {
            args: Prisma.ScoreConversionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreConversionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScoreConversionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreConversionPayload>
          }
          findMany: {
            args: Prisma.ScoreConversionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreConversionPayload>[]
          }
          create: {
            args: Prisma.ScoreConversionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreConversionPayload>
          }
          createMany: {
            args: Prisma.ScoreConversionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScoreConversionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreConversionPayload>[]
          }
          delete: {
            args: Prisma.ScoreConversionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreConversionPayload>
          }
          update: {
            args: Prisma.ScoreConversionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreConversionPayload>
          }
          deleteMany: {
            args: Prisma.ScoreConversionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScoreConversionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScoreConversionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreConversionPayload>[]
          }
          upsert: {
            args: Prisma.ScoreConversionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreConversionPayload>
          }
          aggregate: {
            args: Prisma.ScoreConversionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScoreConversion>
          }
          groupBy: {
            args: Prisma.ScoreConversionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScoreConversionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScoreConversionCountArgs<ExtArgs>
            result: $Utils.Optional<ScoreConversionCountAggregateOutputType> | number
          }
        }
      }
      TestSkill: {
        payload: Prisma.$TestSkillPayload<ExtArgs>
        fields: Prisma.TestSkillFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TestSkillFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestSkillPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TestSkillFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestSkillPayload>
          }
          findFirst: {
            args: Prisma.TestSkillFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestSkillPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TestSkillFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestSkillPayload>
          }
          findMany: {
            args: Prisma.TestSkillFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestSkillPayload>[]
          }
          create: {
            args: Prisma.TestSkillCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestSkillPayload>
          }
          createMany: {
            args: Prisma.TestSkillCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TestSkillCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestSkillPayload>[]
          }
          delete: {
            args: Prisma.TestSkillDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestSkillPayload>
          }
          update: {
            args: Prisma.TestSkillUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestSkillPayload>
          }
          deleteMany: {
            args: Prisma.TestSkillDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TestSkillUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TestSkillUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestSkillPayload>[]
          }
          upsert: {
            args: Prisma.TestSkillUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TestSkillPayload>
          }
          aggregate: {
            args: Prisma.TestSkillAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTestSkill>
          }
          groupBy: {
            args: Prisma.TestSkillGroupByArgs<ExtArgs>
            result: $Utils.Optional<TestSkillGroupByOutputType>[]
          }
          count: {
            args: Prisma.TestSkillCountArgs<ExtArgs>
            result: $Utils.Optional<TestSkillCountAggregateOutputType> | number
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
    englishTestType?: EnglishTestTypeOmit
    test?: TestOmit
    courseTest?: CourseTestOmit
    section?: SectionOmit
    passage?: PassageOmit
    question?: QuestionOmit
    practiceSession?: PracticeSessionOmit
    userAnswer?: UserAnswerOmit
    scoreConversion?: ScoreConversionOmit
    testSkill?: TestSkillOmit
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
   * Count Type EnglishTestTypeCountOutputType
   */

  export type EnglishTestTypeCountOutputType = {
    scoreConversions: number
    tests: number
  }

  export type EnglishTestTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scoreConversions?: boolean | EnglishTestTypeCountOutputTypeCountScoreConversionsArgs
    tests?: boolean | EnglishTestTypeCountOutputTypeCountTestsArgs
  }

  // Custom InputTypes
  /**
   * EnglishTestTypeCountOutputType without action
   */
  export type EnglishTestTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestTypeCountOutputType
     */
    select?: EnglishTestTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EnglishTestTypeCountOutputType without action
   */
  export type EnglishTestTypeCountOutputTypeCountScoreConversionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScoreConversionWhereInput
  }

  /**
   * EnglishTestTypeCountOutputType without action
   */
  export type EnglishTestTypeCountOutputTypeCountTestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TestWhereInput
  }


  /**
   * Count Type TestCountOutputType
   */

  export type TestCountOutputType = {
    courseTests: number
    practiceSessions: number
    questions: number
    sections: number
    testSkills: number
  }

  export type TestCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courseTests?: boolean | TestCountOutputTypeCountCourseTestsArgs
    practiceSessions?: boolean | TestCountOutputTypeCountPracticeSessionsArgs
    questions?: boolean | TestCountOutputTypeCountQuestionsArgs
    sections?: boolean | TestCountOutputTypeCountSectionsArgs
    testSkills?: boolean | TestCountOutputTypeCountTestSkillsArgs
  }

  // Custom InputTypes
  /**
   * TestCountOutputType without action
   */
  export type TestCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestCountOutputType
     */
    select?: TestCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TestCountOutputType without action
   */
  export type TestCountOutputTypeCountCourseTestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourseTestWhereInput
  }

  /**
   * TestCountOutputType without action
   */
  export type TestCountOutputTypeCountPracticeSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PracticeSessionWhereInput
  }

  /**
   * TestCountOutputType without action
   */
  export type TestCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionWhereInput
  }

  /**
   * TestCountOutputType without action
   */
  export type TestCountOutputTypeCountSectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SectionWhereInput
  }

  /**
   * TestCountOutputType without action
   */
  export type TestCountOutputTypeCountTestSkillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TestSkillWhereInput
  }


  /**
   * Count Type SectionCountOutputType
   */

  export type SectionCountOutputType = {
    passages: number
    questions: number
  }

  export type SectionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    passages?: boolean | SectionCountOutputTypeCountPassagesArgs
    questions?: boolean | SectionCountOutputTypeCountQuestionsArgs
  }

  // Custom InputTypes
  /**
   * SectionCountOutputType without action
   */
  export type SectionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SectionCountOutputType
     */
    select?: SectionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SectionCountOutputType without action
   */
  export type SectionCountOutputTypeCountPassagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PassageWhereInput
  }

  /**
   * SectionCountOutputType without action
   */
  export type SectionCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionWhereInput
  }


  /**
   * Count Type PassageCountOutputType
   */

  export type PassageCountOutputType = {
    questions: number
  }

  export type PassageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    questions?: boolean | PassageCountOutputTypeCountQuestionsArgs
  }

  // Custom InputTypes
  /**
   * PassageCountOutputType without action
   */
  export type PassageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PassageCountOutputType
     */
    select?: PassageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PassageCountOutputType without action
   */
  export type PassageCountOutputTypeCountQuestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QuestionWhereInput
  }


  /**
   * Count Type QuestionCountOutputType
   */

  export type QuestionCountOutputType = {
    userAnswers: number
  }

  export type QuestionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAnswers?: boolean | QuestionCountOutputTypeCountUserAnswersArgs
  }

  // Custom InputTypes
  /**
   * QuestionCountOutputType without action
   */
  export type QuestionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QuestionCountOutputType
     */
    select?: QuestionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QuestionCountOutputType without action
   */
  export type QuestionCountOutputTypeCountUserAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAnswerWhereInput
  }


  /**
   * Count Type PracticeSessionCountOutputType
   */

  export type PracticeSessionCountOutputType = {
    userAnswers: number
  }

  export type PracticeSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAnswers?: boolean | PracticeSessionCountOutputTypeCountUserAnswersArgs
  }

  // Custom InputTypes
  /**
   * PracticeSessionCountOutputType without action
   */
  export type PracticeSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSessionCountOutputType
     */
    select?: PracticeSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PracticeSessionCountOutputType without action
   */
  export type PracticeSessionCountOutputTypeCountUserAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAnswerWhereInput
  }


  /**
   * Models
   */

  /**
   * Model EnglishTestType
   */

  export type AggregateEnglishTestType = {
    _count: EnglishTestTypeCountAggregateOutputType | null
    _min: EnglishTestTypeMinAggregateOutputType | null
    _max: EnglishTestTypeMaxAggregateOutputType | null
  }

  export type EnglishTestTypeMinAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type EnglishTestTypeMaxAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type EnglishTestTypeCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type EnglishTestTypeMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type EnglishTestTypeMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type EnglishTestTypeCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type EnglishTestTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EnglishTestType to aggregate.
     */
    where?: EnglishTestTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnglishTestTypes to fetch.
     */
    orderBy?: EnglishTestTypeOrderByWithRelationInput | EnglishTestTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EnglishTestTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnglishTestTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnglishTestTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EnglishTestTypes
    **/
    _count?: true | EnglishTestTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EnglishTestTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EnglishTestTypeMaxAggregateInputType
  }

  export type GetEnglishTestTypeAggregateType<T extends EnglishTestTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateEnglishTestType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEnglishTestType[P]>
      : GetScalarType<T[P], AggregateEnglishTestType[P]>
  }




  export type EnglishTestTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EnglishTestTypeWhereInput
    orderBy?: EnglishTestTypeOrderByWithAggregationInput | EnglishTestTypeOrderByWithAggregationInput[]
    by: EnglishTestTypeScalarFieldEnum[] | EnglishTestTypeScalarFieldEnum
    having?: EnglishTestTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EnglishTestTypeCountAggregateInputType | true
    _min?: EnglishTestTypeMinAggregateInputType
    _max?: EnglishTestTypeMaxAggregateInputType
  }

  export type EnglishTestTypeGroupByOutputType = {
    id: string
    name: string
    _count: EnglishTestTypeCountAggregateOutputType | null
    _min: EnglishTestTypeMinAggregateOutputType | null
    _max: EnglishTestTypeMaxAggregateOutputType | null
  }

  type GetEnglishTestTypeGroupByPayload<T extends EnglishTestTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EnglishTestTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EnglishTestTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EnglishTestTypeGroupByOutputType[P]>
            : GetScalarType<T[P], EnglishTestTypeGroupByOutputType[P]>
        }
      >
    >


  export type EnglishTestTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    scoreConversions?: boolean | EnglishTestType$scoreConversionsArgs<ExtArgs>
    tests?: boolean | EnglishTestType$testsArgs<ExtArgs>
    _count?: boolean | EnglishTestTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["englishTestType"]>

  export type EnglishTestTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["englishTestType"]>

  export type EnglishTestTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["englishTestType"]>

  export type EnglishTestTypeSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type EnglishTestTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name", ExtArgs["result"]["englishTestType"]>
  export type EnglishTestTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scoreConversions?: boolean | EnglishTestType$scoreConversionsArgs<ExtArgs>
    tests?: boolean | EnglishTestType$testsArgs<ExtArgs>
    _count?: boolean | EnglishTestTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EnglishTestTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type EnglishTestTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $EnglishTestTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EnglishTestType"
    objects: {
      scoreConversions: Prisma.$ScoreConversionPayload<ExtArgs>[]
      tests: Prisma.$TestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
    }, ExtArgs["result"]["englishTestType"]>
    composites: {}
  }

  type EnglishTestTypeGetPayload<S extends boolean | null | undefined | EnglishTestTypeDefaultArgs> = $Result.GetResult<Prisma.$EnglishTestTypePayload, S>

  type EnglishTestTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EnglishTestTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EnglishTestTypeCountAggregateInputType | true
    }

  export interface EnglishTestTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EnglishTestType'], meta: { name: 'EnglishTestType' } }
    /**
     * Find zero or one EnglishTestType that matches the filter.
     * @param {EnglishTestTypeFindUniqueArgs} args - Arguments to find a EnglishTestType
     * @example
     * // Get one EnglishTestType
     * const englishTestType = await prisma.englishTestType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EnglishTestTypeFindUniqueArgs>(args: SelectSubset<T, EnglishTestTypeFindUniqueArgs<ExtArgs>>): Prisma__EnglishTestTypeClient<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EnglishTestType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EnglishTestTypeFindUniqueOrThrowArgs} args - Arguments to find a EnglishTestType
     * @example
     * // Get one EnglishTestType
     * const englishTestType = await prisma.englishTestType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EnglishTestTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, EnglishTestTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EnglishTestTypeClient<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EnglishTestType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnglishTestTypeFindFirstArgs} args - Arguments to find a EnglishTestType
     * @example
     * // Get one EnglishTestType
     * const englishTestType = await prisma.englishTestType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EnglishTestTypeFindFirstArgs>(args?: SelectSubset<T, EnglishTestTypeFindFirstArgs<ExtArgs>>): Prisma__EnglishTestTypeClient<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EnglishTestType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnglishTestTypeFindFirstOrThrowArgs} args - Arguments to find a EnglishTestType
     * @example
     * // Get one EnglishTestType
     * const englishTestType = await prisma.englishTestType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EnglishTestTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, EnglishTestTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__EnglishTestTypeClient<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EnglishTestTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnglishTestTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EnglishTestTypes
     * const englishTestTypes = await prisma.englishTestType.findMany()
     * 
     * // Get first 10 EnglishTestTypes
     * const englishTestTypes = await prisma.englishTestType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const englishTestTypeWithIdOnly = await prisma.englishTestType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EnglishTestTypeFindManyArgs>(args?: SelectSubset<T, EnglishTestTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EnglishTestType.
     * @param {EnglishTestTypeCreateArgs} args - Arguments to create a EnglishTestType.
     * @example
     * // Create one EnglishTestType
     * const EnglishTestType = await prisma.englishTestType.create({
     *   data: {
     *     // ... data to create a EnglishTestType
     *   }
     * })
     * 
     */
    create<T extends EnglishTestTypeCreateArgs>(args: SelectSubset<T, EnglishTestTypeCreateArgs<ExtArgs>>): Prisma__EnglishTestTypeClient<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EnglishTestTypes.
     * @param {EnglishTestTypeCreateManyArgs} args - Arguments to create many EnglishTestTypes.
     * @example
     * // Create many EnglishTestTypes
     * const englishTestType = await prisma.englishTestType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EnglishTestTypeCreateManyArgs>(args?: SelectSubset<T, EnglishTestTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EnglishTestTypes and returns the data saved in the database.
     * @param {EnglishTestTypeCreateManyAndReturnArgs} args - Arguments to create many EnglishTestTypes.
     * @example
     * // Create many EnglishTestTypes
     * const englishTestType = await prisma.englishTestType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EnglishTestTypes and only return the `id`
     * const englishTestTypeWithIdOnly = await prisma.englishTestType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EnglishTestTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, EnglishTestTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EnglishTestType.
     * @param {EnglishTestTypeDeleteArgs} args - Arguments to delete one EnglishTestType.
     * @example
     * // Delete one EnglishTestType
     * const EnglishTestType = await prisma.englishTestType.delete({
     *   where: {
     *     // ... filter to delete one EnglishTestType
     *   }
     * })
     * 
     */
    delete<T extends EnglishTestTypeDeleteArgs>(args: SelectSubset<T, EnglishTestTypeDeleteArgs<ExtArgs>>): Prisma__EnglishTestTypeClient<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EnglishTestType.
     * @param {EnglishTestTypeUpdateArgs} args - Arguments to update one EnglishTestType.
     * @example
     * // Update one EnglishTestType
     * const englishTestType = await prisma.englishTestType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EnglishTestTypeUpdateArgs>(args: SelectSubset<T, EnglishTestTypeUpdateArgs<ExtArgs>>): Prisma__EnglishTestTypeClient<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EnglishTestTypes.
     * @param {EnglishTestTypeDeleteManyArgs} args - Arguments to filter EnglishTestTypes to delete.
     * @example
     * // Delete a few EnglishTestTypes
     * const { count } = await prisma.englishTestType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EnglishTestTypeDeleteManyArgs>(args?: SelectSubset<T, EnglishTestTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EnglishTestTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnglishTestTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EnglishTestTypes
     * const englishTestType = await prisma.englishTestType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EnglishTestTypeUpdateManyArgs>(args: SelectSubset<T, EnglishTestTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EnglishTestTypes and returns the data updated in the database.
     * @param {EnglishTestTypeUpdateManyAndReturnArgs} args - Arguments to update many EnglishTestTypes.
     * @example
     * // Update many EnglishTestTypes
     * const englishTestType = await prisma.englishTestType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EnglishTestTypes and only return the `id`
     * const englishTestTypeWithIdOnly = await prisma.englishTestType.updateManyAndReturn({
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
    updateManyAndReturn<T extends EnglishTestTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, EnglishTestTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EnglishTestType.
     * @param {EnglishTestTypeUpsertArgs} args - Arguments to update or create a EnglishTestType.
     * @example
     * // Update or create a EnglishTestType
     * const englishTestType = await prisma.englishTestType.upsert({
     *   create: {
     *     // ... data to create a EnglishTestType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EnglishTestType we want to update
     *   }
     * })
     */
    upsert<T extends EnglishTestTypeUpsertArgs>(args: SelectSubset<T, EnglishTestTypeUpsertArgs<ExtArgs>>): Prisma__EnglishTestTypeClient<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EnglishTestTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnglishTestTypeCountArgs} args - Arguments to filter EnglishTestTypes to count.
     * @example
     * // Count the number of EnglishTestTypes
     * const count = await prisma.englishTestType.count({
     *   where: {
     *     // ... the filter for the EnglishTestTypes we want to count
     *   }
     * })
    **/
    count<T extends EnglishTestTypeCountArgs>(
      args?: Subset<T, EnglishTestTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EnglishTestTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EnglishTestType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnglishTestTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EnglishTestTypeAggregateArgs>(args: Subset<T, EnglishTestTypeAggregateArgs>): Prisma.PrismaPromise<GetEnglishTestTypeAggregateType<T>>

    /**
     * Group by EnglishTestType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EnglishTestTypeGroupByArgs} args - Group by arguments.
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
      T extends EnglishTestTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EnglishTestTypeGroupByArgs['orderBy'] }
        : { orderBy?: EnglishTestTypeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EnglishTestTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEnglishTestTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EnglishTestType model
   */
  readonly fields: EnglishTestTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EnglishTestType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EnglishTestTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    scoreConversions<T extends EnglishTestType$scoreConversionsArgs<ExtArgs> = {}>(args?: Subset<T, EnglishTestType$scoreConversionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScoreConversionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tests<T extends EnglishTestType$testsArgs<ExtArgs> = {}>(args?: Subset<T, EnglishTestType$testsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the EnglishTestType model
   */
  interface EnglishTestTypeFieldRefs {
    readonly id: FieldRef<"EnglishTestType", 'String'>
    readonly name: FieldRef<"EnglishTestType", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EnglishTestType findUnique
   */
  export type EnglishTestTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestType
     */
    select?: EnglishTestTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnglishTestType
     */
    omit?: EnglishTestTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnglishTestTypeInclude<ExtArgs> | null
    /**
     * Filter, which EnglishTestType to fetch.
     */
    where: EnglishTestTypeWhereUniqueInput
  }

  /**
   * EnglishTestType findUniqueOrThrow
   */
  export type EnglishTestTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestType
     */
    select?: EnglishTestTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnglishTestType
     */
    omit?: EnglishTestTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnglishTestTypeInclude<ExtArgs> | null
    /**
     * Filter, which EnglishTestType to fetch.
     */
    where: EnglishTestTypeWhereUniqueInput
  }

  /**
   * EnglishTestType findFirst
   */
  export type EnglishTestTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestType
     */
    select?: EnglishTestTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnglishTestType
     */
    omit?: EnglishTestTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnglishTestTypeInclude<ExtArgs> | null
    /**
     * Filter, which EnglishTestType to fetch.
     */
    where?: EnglishTestTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnglishTestTypes to fetch.
     */
    orderBy?: EnglishTestTypeOrderByWithRelationInput | EnglishTestTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EnglishTestTypes.
     */
    cursor?: EnglishTestTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnglishTestTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnglishTestTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EnglishTestTypes.
     */
    distinct?: EnglishTestTypeScalarFieldEnum | EnglishTestTypeScalarFieldEnum[]
  }

  /**
   * EnglishTestType findFirstOrThrow
   */
  export type EnglishTestTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestType
     */
    select?: EnglishTestTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnglishTestType
     */
    omit?: EnglishTestTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnglishTestTypeInclude<ExtArgs> | null
    /**
     * Filter, which EnglishTestType to fetch.
     */
    where?: EnglishTestTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnglishTestTypes to fetch.
     */
    orderBy?: EnglishTestTypeOrderByWithRelationInput | EnglishTestTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EnglishTestTypes.
     */
    cursor?: EnglishTestTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnglishTestTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnglishTestTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EnglishTestTypes.
     */
    distinct?: EnglishTestTypeScalarFieldEnum | EnglishTestTypeScalarFieldEnum[]
  }

  /**
   * EnglishTestType findMany
   */
  export type EnglishTestTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestType
     */
    select?: EnglishTestTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnglishTestType
     */
    omit?: EnglishTestTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnglishTestTypeInclude<ExtArgs> | null
    /**
     * Filter, which EnglishTestTypes to fetch.
     */
    where?: EnglishTestTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EnglishTestTypes to fetch.
     */
    orderBy?: EnglishTestTypeOrderByWithRelationInput | EnglishTestTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EnglishTestTypes.
     */
    cursor?: EnglishTestTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EnglishTestTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EnglishTestTypes.
     */
    skip?: number
    distinct?: EnglishTestTypeScalarFieldEnum | EnglishTestTypeScalarFieldEnum[]
  }

  /**
   * EnglishTestType create
   */
  export type EnglishTestTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestType
     */
    select?: EnglishTestTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnglishTestType
     */
    omit?: EnglishTestTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnglishTestTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a EnglishTestType.
     */
    data: XOR<EnglishTestTypeCreateInput, EnglishTestTypeUncheckedCreateInput>
  }

  /**
   * EnglishTestType createMany
   */
  export type EnglishTestTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EnglishTestTypes.
     */
    data: EnglishTestTypeCreateManyInput | EnglishTestTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EnglishTestType createManyAndReturn
   */
  export type EnglishTestTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestType
     */
    select?: EnglishTestTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EnglishTestType
     */
    omit?: EnglishTestTypeOmit<ExtArgs> | null
    /**
     * The data used to create many EnglishTestTypes.
     */
    data: EnglishTestTypeCreateManyInput | EnglishTestTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EnglishTestType update
   */
  export type EnglishTestTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestType
     */
    select?: EnglishTestTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnglishTestType
     */
    omit?: EnglishTestTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnglishTestTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a EnglishTestType.
     */
    data: XOR<EnglishTestTypeUpdateInput, EnglishTestTypeUncheckedUpdateInput>
    /**
     * Choose, which EnglishTestType to update.
     */
    where: EnglishTestTypeWhereUniqueInput
  }

  /**
   * EnglishTestType updateMany
   */
  export type EnglishTestTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EnglishTestTypes.
     */
    data: XOR<EnglishTestTypeUpdateManyMutationInput, EnglishTestTypeUncheckedUpdateManyInput>
    /**
     * Filter which EnglishTestTypes to update
     */
    where?: EnglishTestTypeWhereInput
    /**
     * Limit how many EnglishTestTypes to update.
     */
    limit?: number
  }

  /**
   * EnglishTestType updateManyAndReturn
   */
  export type EnglishTestTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestType
     */
    select?: EnglishTestTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EnglishTestType
     */
    omit?: EnglishTestTypeOmit<ExtArgs> | null
    /**
     * The data used to update EnglishTestTypes.
     */
    data: XOR<EnglishTestTypeUpdateManyMutationInput, EnglishTestTypeUncheckedUpdateManyInput>
    /**
     * Filter which EnglishTestTypes to update
     */
    where?: EnglishTestTypeWhereInput
    /**
     * Limit how many EnglishTestTypes to update.
     */
    limit?: number
  }

  /**
   * EnglishTestType upsert
   */
  export type EnglishTestTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestType
     */
    select?: EnglishTestTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnglishTestType
     */
    omit?: EnglishTestTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnglishTestTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the EnglishTestType to update in case it exists.
     */
    where: EnglishTestTypeWhereUniqueInput
    /**
     * In case the EnglishTestType found by the `where` argument doesn't exist, create a new EnglishTestType with this data.
     */
    create: XOR<EnglishTestTypeCreateInput, EnglishTestTypeUncheckedCreateInput>
    /**
     * In case the EnglishTestType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EnglishTestTypeUpdateInput, EnglishTestTypeUncheckedUpdateInput>
  }

  /**
   * EnglishTestType delete
   */
  export type EnglishTestTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestType
     */
    select?: EnglishTestTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnglishTestType
     */
    omit?: EnglishTestTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnglishTestTypeInclude<ExtArgs> | null
    /**
     * Filter which EnglishTestType to delete.
     */
    where: EnglishTestTypeWhereUniqueInput
  }

  /**
   * EnglishTestType deleteMany
   */
  export type EnglishTestTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EnglishTestTypes to delete
     */
    where?: EnglishTestTypeWhereInput
    /**
     * Limit how many EnglishTestTypes to delete.
     */
    limit?: number
  }

  /**
   * EnglishTestType.scoreConversions
   */
  export type EnglishTestType$scoreConversionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionInclude<ExtArgs> | null
    where?: ScoreConversionWhereInput
    orderBy?: ScoreConversionOrderByWithRelationInput | ScoreConversionOrderByWithRelationInput[]
    cursor?: ScoreConversionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScoreConversionScalarFieldEnum | ScoreConversionScalarFieldEnum[]
  }

  /**
   * EnglishTestType.tests
   */
  export type EnglishTestType$testsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    where?: TestWhereInput
    orderBy?: TestOrderByWithRelationInput | TestOrderByWithRelationInput[]
    cursor?: TestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TestScalarFieldEnum | TestScalarFieldEnum[]
  }

  /**
   * EnglishTestType without action
   */
  export type EnglishTestTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EnglishTestType
     */
    select?: EnglishTestTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EnglishTestType
     */
    omit?: EnglishTestTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EnglishTestTypeInclude<ExtArgs> | null
  }


  /**
   * Model Test
   */

  export type AggregateTest = {
    _count: TestCountAggregateOutputType | null
    _avg: TestAvgAggregateOutputType | null
    _sum: TestSumAggregateOutputType | null
    _min: TestMinAggregateOutputType | null
    _max: TestMaxAggregateOutputType | null
  }

  export type TestAvgAggregateOutputType = {
    durationInMinutes: number | null
    totalScore: number | null
    passingScore: number | null
    practiceCount: number | null
    maxAttempts: number | null
  }

  export type TestSumAggregateOutputType = {
    durationInMinutes: number | null
    totalScore: number | null
    passingScore: number | null
    practiceCount: number | null
    maxAttempts: number | null
  }

  export type TestMinAggregateOutputType = {
    id: string | null
    title: string | null
    durationInMinutes: number | null
    totalScore: number | null
    passingScore: number | null
    englishTestTypeId: string | null
    practiceCount: number | null
    createdAt: Date | null
    maxAttempts: number | null
    testType: $Enums.TestType | null
    updatedAt: Date | null
  }

  export type TestMaxAggregateOutputType = {
    id: string | null
    title: string | null
    durationInMinutes: number | null
    totalScore: number | null
    passingScore: number | null
    englishTestTypeId: string | null
    practiceCount: number | null
    createdAt: Date | null
    maxAttempts: number | null
    testType: $Enums.TestType | null
    updatedAt: Date | null
  }

  export type TestCountAggregateOutputType = {
    id: number
    title: number
    durationInMinutes: number
    totalScore: number
    passingScore: number
    englishTestTypeId: number
    practiceCount: number
    createdAt: number
    maxAttempts: number
    testType: number
    updatedAt: number
    _all: number
  }


  export type TestAvgAggregateInputType = {
    durationInMinutes?: true
    totalScore?: true
    passingScore?: true
    practiceCount?: true
    maxAttempts?: true
  }

  export type TestSumAggregateInputType = {
    durationInMinutes?: true
    totalScore?: true
    passingScore?: true
    practiceCount?: true
    maxAttempts?: true
  }

  export type TestMinAggregateInputType = {
    id?: true
    title?: true
    durationInMinutes?: true
    totalScore?: true
    passingScore?: true
    englishTestTypeId?: true
    practiceCount?: true
    createdAt?: true
    maxAttempts?: true
    testType?: true
    updatedAt?: true
  }

  export type TestMaxAggregateInputType = {
    id?: true
    title?: true
    durationInMinutes?: true
    totalScore?: true
    passingScore?: true
    englishTestTypeId?: true
    practiceCount?: true
    createdAt?: true
    maxAttempts?: true
    testType?: true
    updatedAt?: true
  }

  export type TestCountAggregateInputType = {
    id?: true
    title?: true
    durationInMinutes?: true
    totalScore?: true
    passingScore?: true
    englishTestTypeId?: true
    practiceCount?: true
    createdAt?: true
    maxAttempts?: true
    testType?: true
    updatedAt?: true
    _all?: true
  }

  export type TestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Test to aggregate.
     */
    where?: TestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tests to fetch.
     */
    orderBy?: TestOrderByWithRelationInput | TestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tests
    **/
    _count?: true | TestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TestMaxAggregateInputType
  }

  export type GetTestAggregateType<T extends TestAggregateArgs> = {
        [P in keyof T & keyof AggregateTest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTest[P]>
      : GetScalarType<T[P], AggregateTest[P]>
  }




  export type TestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TestWhereInput
    orderBy?: TestOrderByWithAggregationInput | TestOrderByWithAggregationInput[]
    by: TestScalarFieldEnum[] | TestScalarFieldEnum
    having?: TestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TestCountAggregateInputType | true
    _avg?: TestAvgAggregateInputType
    _sum?: TestSumAggregateInputType
    _min?: TestMinAggregateInputType
    _max?: TestMaxAggregateInputType
  }

  export type TestGroupByOutputType = {
    id: string
    title: string
    durationInMinutes: number | null
    totalScore: number | null
    passingScore: number | null
    englishTestTypeId: string
    practiceCount: number | null
    createdAt: Date
    maxAttempts: number | null
    testType: $Enums.TestType | null
    updatedAt: Date | null
    _count: TestCountAggregateOutputType | null
    _avg: TestAvgAggregateOutputType | null
    _sum: TestSumAggregateOutputType | null
    _min: TestMinAggregateOutputType | null
    _max: TestMaxAggregateOutputType | null
  }

  type GetTestGroupByPayload<T extends TestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TestGroupByOutputType[P]>
            : GetScalarType<T[P], TestGroupByOutputType[P]>
        }
      >
    >


  export type TestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    durationInMinutes?: boolean
    totalScore?: boolean
    passingScore?: boolean
    englishTestTypeId?: boolean
    practiceCount?: boolean
    createdAt?: boolean
    maxAttempts?: boolean
    testType?: boolean
    updatedAt?: boolean
    courseTests?: boolean | Test$courseTestsArgs<ExtArgs>
    practiceSessions?: boolean | Test$practiceSessionsArgs<ExtArgs>
    questions?: boolean | Test$questionsArgs<ExtArgs>
    sections?: boolean | Test$sectionsArgs<ExtArgs>
    testSkills?: boolean | Test$testSkillsArgs<ExtArgs>
    englishTestType?: boolean | EnglishTestTypeDefaultArgs<ExtArgs>
    _count?: boolean | TestCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["test"]>

  export type TestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    durationInMinutes?: boolean
    totalScore?: boolean
    passingScore?: boolean
    englishTestTypeId?: boolean
    practiceCount?: boolean
    createdAt?: boolean
    maxAttempts?: boolean
    testType?: boolean
    updatedAt?: boolean
    englishTestType?: boolean | EnglishTestTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["test"]>

  export type TestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    durationInMinutes?: boolean
    totalScore?: boolean
    passingScore?: boolean
    englishTestTypeId?: boolean
    practiceCount?: boolean
    createdAt?: boolean
    maxAttempts?: boolean
    testType?: boolean
    updatedAt?: boolean
    englishTestType?: boolean | EnglishTestTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["test"]>

  export type TestSelectScalar = {
    id?: boolean
    title?: boolean
    durationInMinutes?: boolean
    totalScore?: boolean
    passingScore?: boolean
    englishTestTypeId?: boolean
    practiceCount?: boolean
    createdAt?: boolean
    maxAttempts?: boolean
    testType?: boolean
    updatedAt?: boolean
  }

  export type TestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "durationInMinutes" | "totalScore" | "passingScore" | "englishTestTypeId" | "practiceCount" | "createdAt" | "maxAttempts" | "testType" | "updatedAt", ExtArgs["result"]["test"]>
  export type TestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    courseTests?: boolean | Test$courseTestsArgs<ExtArgs>
    practiceSessions?: boolean | Test$practiceSessionsArgs<ExtArgs>
    questions?: boolean | Test$questionsArgs<ExtArgs>
    sections?: boolean | Test$sectionsArgs<ExtArgs>
    testSkills?: boolean | Test$testSkillsArgs<ExtArgs>
    englishTestType?: boolean | EnglishTestTypeDefaultArgs<ExtArgs>
    _count?: boolean | TestCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    englishTestType?: boolean | EnglishTestTypeDefaultArgs<ExtArgs>
  }
  export type TestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    englishTestType?: boolean | EnglishTestTypeDefaultArgs<ExtArgs>
  }

  export type $TestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Test"
    objects: {
      courseTests: Prisma.$CourseTestPayload<ExtArgs>[]
      practiceSessions: Prisma.$PracticeSessionPayload<ExtArgs>[]
      questions: Prisma.$QuestionPayload<ExtArgs>[]
      sections: Prisma.$SectionPayload<ExtArgs>[]
      testSkills: Prisma.$TestSkillPayload<ExtArgs>[]
      englishTestType: Prisma.$EnglishTestTypePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      durationInMinutes: number | null
      totalScore: number | null
      passingScore: number | null
      englishTestTypeId: string
      practiceCount: number | null
      createdAt: Date
      maxAttempts: number | null
      testType: $Enums.TestType | null
      updatedAt: Date | null
    }, ExtArgs["result"]["test"]>
    composites: {}
  }

  type TestGetPayload<S extends boolean | null | undefined | TestDefaultArgs> = $Result.GetResult<Prisma.$TestPayload, S>

  type TestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TestCountAggregateInputType | true
    }

  export interface TestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Test'], meta: { name: 'Test' } }
    /**
     * Find zero or one Test that matches the filter.
     * @param {TestFindUniqueArgs} args - Arguments to find a Test
     * @example
     * // Get one Test
     * const test = await prisma.test.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TestFindUniqueArgs>(args: SelectSubset<T, TestFindUniqueArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Test that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TestFindUniqueOrThrowArgs} args - Arguments to find a Test
     * @example
     * // Get one Test
     * const test = await prisma.test.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TestFindUniqueOrThrowArgs>(args: SelectSubset<T, TestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Test that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestFindFirstArgs} args - Arguments to find a Test
     * @example
     * // Get one Test
     * const test = await prisma.test.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TestFindFirstArgs>(args?: SelectSubset<T, TestFindFirstArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Test that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestFindFirstOrThrowArgs} args - Arguments to find a Test
     * @example
     * // Get one Test
     * const test = await prisma.test.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TestFindFirstOrThrowArgs>(args?: SelectSubset<T, TestFindFirstOrThrowArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tests
     * const tests = await prisma.test.findMany()
     * 
     * // Get first 10 Tests
     * const tests = await prisma.test.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const testWithIdOnly = await prisma.test.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TestFindManyArgs>(args?: SelectSubset<T, TestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Test.
     * @param {TestCreateArgs} args - Arguments to create a Test.
     * @example
     * // Create one Test
     * const Test = await prisma.test.create({
     *   data: {
     *     // ... data to create a Test
     *   }
     * })
     * 
     */
    create<T extends TestCreateArgs>(args: SelectSubset<T, TestCreateArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tests.
     * @param {TestCreateManyArgs} args - Arguments to create many Tests.
     * @example
     * // Create many Tests
     * const test = await prisma.test.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TestCreateManyArgs>(args?: SelectSubset<T, TestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tests and returns the data saved in the database.
     * @param {TestCreateManyAndReturnArgs} args - Arguments to create many Tests.
     * @example
     * // Create many Tests
     * const test = await prisma.test.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tests and only return the `id`
     * const testWithIdOnly = await prisma.test.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TestCreateManyAndReturnArgs>(args?: SelectSubset<T, TestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Test.
     * @param {TestDeleteArgs} args - Arguments to delete one Test.
     * @example
     * // Delete one Test
     * const Test = await prisma.test.delete({
     *   where: {
     *     // ... filter to delete one Test
     *   }
     * })
     * 
     */
    delete<T extends TestDeleteArgs>(args: SelectSubset<T, TestDeleteArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Test.
     * @param {TestUpdateArgs} args - Arguments to update one Test.
     * @example
     * // Update one Test
     * const test = await prisma.test.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TestUpdateArgs>(args: SelectSubset<T, TestUpdateArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tests.
     * @param {TestDeleteManyArgs} args - Arguments to filter Tests to delete.
     * @example
     * // Delete a few Tests
     * const { count } = await prisma.test.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TestDeleteManyArgs>(args?: SelectSubset<T, TestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tests
     * const test = await prisma.test.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TestUpdateManyArgs>(args: SelectSubset<T, TestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tests and returns the data updated in the database.
     * @param {TestUpdateManyAndReturnArgs} args - Arguments to update many Tests.
     * @example
     * // Update many Tests
     * const test = await prisma.test.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tests and only return the `id`
     * const testWithIdOnly = await prisma.test.updateManyAndReturn({
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
    updateManyAndReturn<T extends TestUpdateManyAndReturnArgs>(args: SelectSubset<T, TestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Test.
     * @param {TestUpsertArgs} args - Arguments to update or create a Test.
     * @example
     * // Update or create a Test
     * const test = await prisma.test.upsert({
     *   create: {
     *     // ... data to create a Test
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Test we want to update
     *   }
     * })
     */
    upsert<T extends TestUpsertArgs>(args: SelectSubset<T, TestUpsertArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestCountArgs} args - Arguments to filter Tests to count.
     * @example
     * // Count the number of Tests
     * const count = await prisma.test.count({
     *   where: {
     *     // ... the filter for the Tests we want to count
     *   }
     * })
    **/
    count<T extends TestCountArgs>(
      args?: Subset<T, TestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Test.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TestAggregateArgs>(args: Subset<T, TestAggregateArgs>): Prisma.PrismaPromise<GetTestAggregateType<T>>

    /**
     * Group by Test.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestGroupByArgs} args - Group by arguments.
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
      T extends TestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TestGroupByArgs['orderBy'] }
        : { orderBy?: TestGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Test model
   */
  readonly fields: TestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Test.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    courseTests<T extends Test$courseTestsArgs<ExtArgs> = {}>(args?: Subset<T, Test$courseTestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseTestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    practiceSessions<T extends Test$practiceSessionsArgs<ExtArgs> = {}>(args?: Subset<T, Test$practiceSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    questions<T extends Test$questionsArgs<ExtArgs> = {}>(args?: Subset<T, Test$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sections<T extends Test$sectionsArgs<ExtArgs> = {}>(args?: Subset<T, Test$sectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    testSkills<T extends Test$testSkillsArgs<ExtArgs> = {}>(args?: Subset<T, Test$testSkillsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestSkillPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    englishTestType<T extends EnglishTestTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EnglishTestTypeDefaultArgs<ExtArgs>>): Prisma__EnglishTestTypeClient<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Test model
   */
  interface TestFieldRefs {
    readonly id: FieldRef<"Test", 'String'>
    readonly title: FieldRef<"Test", 'String'>
    readonly durationInMinutes: FieldRef<"Test", 'Int'>
    readonly totalScore: FieldRef<"Test", 'Float'>
    readonly passingScore: FieldRef<"Test", 'Float'>
    readonly englishTestTypeId: FieldRef<"Test", 'String'>
    readonly practiceCount: FieldRef<"Test", 'Int'>
    readonly createdAt: FieldRef<"Test", 'DateTime'>
    readonly maxAttempts: FieldRef<"Test", 'Int'>
    readonly testType: FieldRef<"Test", 'TestType'>
    readonly updatedAt: FieldRef<"Test", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Test findUnique
   */
  export type TestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * Filter, which Test to fetch.
     */
    where: TestWhereUniqueInput
  }

  /**
   * Test findUniqueOrThrow
   */
  export type TestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * Filter, which Test to fetch.
     */
    where: TestWhereUniqueInput
  }

  /**
   * Test findFirst
   */
  export type TestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * Filter, which Test to fetch.
     */
    where?: TestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tests to fetch.
     */
    orderBy?: TestOrderByWithRelationInput | TestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tests.
     */
    cursor?: TestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tests.
     */
    distinct?: TestScalarFieldEnum | TestScalarFieldEnum[]
  }

  /**
   * Test findFirstOrThrow
   */
  export type TestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * Filter, which Test to fetch.
     */
    where?: TestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tests to fetch.
     */
    orderBy?: TestOrderByWithRelationInput | TestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tests.
     */
    cursor?: TestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tests.
     */
    distinct?: TestScalarFieldEnum | TestScalarFieldEnum[]
  }

  /**
   * Test findMany
   */
  export type TestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * Filter, which Tests to fetch.
     */
    where?: TestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tests to fetch.
     */
    orderBy?: TestOrderByWithRelationInput | TestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tests.
     */
    cursor?: TestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tests.
     */
    skip?: number
    distinct?: TestScalarFieldEnum | TestScalarFieldEnum[]
  }

  /**
   * Test create
   */
  export type TestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * The data needed to create a Test.
     */
    data: XOR<TestCreateInput, TestUncheckedCreateInput>
  }

  /**
   * Test createMany
   */
  export type TestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tests.
     */
    data: TestCreateManyInput | TestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Test createManyAndReturn
   */
  export type TestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * The data used to create many Tests.
     */
    data: TestCreateManyInput | TestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Test update
   */
  export type TestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * The data needed to update a Test.
     */
    data: XOR<TestUpdateInput, TestUncheckedUpdateInput>
    /**
     * Choose, which Test to update.
     */
    where: TestWhereUniqueInput
  }

  /**
   * Test updateMany
   */
  export type TestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tests.
     */
    data: XOR<TestUpdateManyMutationInput, TestUncheckedUpdateManyInput>
    /**
     * Filter which Tests to update
     */
    where?: TestWhereInput
    /**
     * Limit how many Tests to update.
     */
    limit?: number
  }

  /**
   * Test updateManyAndReturn
   */
  export type TestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * The data used to update Tests.
     */
    data: XOR<TestUpdateManyMutationInput, TestUncheckedUpdateManyInput>
    /**
     * Filter which Tests to update
     */
    where?: TestWhereInput
    /**
     * Limit how many Tests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Test upsert
   */
  export type TestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * The filter to search for the Test to update in case it exists.
     */
    where: TestWhereUniqueInput
    /**
     * In case the Test found by the `where` argument doesn't exist, create a new Test with this data.
     */
    create: XOR<TestCreateInput, TestUncheckedCreateInput>
    /**
     * In case the Test was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TestUpdateInput, TestUncheckedUpdateInput>
  }

  /**
   * Test delete
   */
  export type TestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    /**
     * Filter which Test to delete.
     */
    where: TestWhereUniqueInput
  }

  /**
   * Test deleteMany
   */
  export type TestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tests to delete
     */
    where?: TestWhereInput
    /**
     * Limit how many Tests to delete.
     */
    limit?: number
  }

  /**
   * Test.courseTests
   */
  export type Test$courseTestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestInclude<ExtArgs> | null
    where?: CourseTestWhereInput
    orderBy?: CourseTestOrderByWithRelationInput | CourseTestOrderByWithRelationInput[]
    cursor?: CourseTestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CourseTestScalarFieldEnum | CourseTestScalarFieldEnum[]
  }

  /**
   * Test.practiceSessions
   */
  export type Test$practiceSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionInclude<ExtArgs> | null
    where?: PracticeSessionWhereInput
    orderBy?: PracticeSessionOrderByWithRelationInput | PracticeSessionOrderByWithRelationInput[]
    cursor?: PracticeSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PracticeSessionScalarFieldEnum | PracticeSessionScalarFieldEnum[]
  }

  /**
   * Test.questions
   */
  export type Test$questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Test.sections
   */
  export type Test$sectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    where?: SectionWhereInput
    orderBy?: SectionOrderByWithRelationInput | SectionOrderByWithRelationInput[]
    cursor?: SectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SectionScalarFieldEnum | SectionScalarFieldEnum[]
  }

  /**
   * Test.testSkills
   */
  export type Test$testSkillsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillInclude<ExtArgs> | null
    where?: TestSkillWhereInput
    orderBy?: TestSkillOrderByWithRelationInput | TestSkillOrderByWithRelationInput[]
    cursor?: TestSkillWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TestSkillScalarFieldEnum | TestSkillScalarFieldEnum[]
  }

  /**
   * Test without action
   */
  export type TestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
  }


  /**
   * Model CourseTest
   */

  export type AggregateCourseTest = {
    _count: CourseTestCountAggregateOutputType | null
    _min: CourseTestMinAggregateOutputType | null
    _max: CourseTestMaxAggregateOutputType | null
  }

  export type CourseTestMinAggregateOutputType = {
    courseId: string | null
    testId: string | null
  }

  export type CourseTestMaxAggregateOutputType = {
    courseId: string | null
    testId: string | null
  }

  export type CourseTestCountAggregateOutputType = {
    courseId: number
    testId: number
    _all: number
  }


  export type CourseTestMinAggregateInputType = {
    courseId?: true
    testId?: true
  }

  export type CourseTestMaxAggregateInputType = {
    courseId?: true
    testId?: true
  }

  export type CourseTestCountAggregateInputType = {
    courseId?: true
    testId?: true
    _all?: true
  }

  export type CourseTestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CourseTest to aggregate.
     */
    where?: CourseTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseTests to fetch.
     */
    orderBy?: CourseTestOrderByWithRelationInput | CourseTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CourseTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CourseTests
    **/
    _count?: true | CourseTestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CourseTestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CourseTestMaxAggregateInputType
  }

  export type GetCourseTestAggregateType<T extends CourseTestAggregateArgs> = {
        [P in keyof T & keyof AggregateCourseTest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCourseTest[P]>
      : GetScalarType<T[P], AggregateCourseTest[P]>
  }




  export type CourseTestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourseTestWhereInput
    orderBy?: CourseTestOrderByWithAggregationInput | CourseTestOrderByWithAggregationInput[]
    by: CourseTestScalarFieldEnum[] | CourseTestScalarFieldEnum
    having?: CourseTestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CourseTestCountAggregateInputType | true
    _min?: CourseTestMinAggregateInputType
    _max?: CourseTestMaxAggregateInputType
  }

  export type CourseTestGroupByOutputType = {
    courseId: string
    testId: string
    _count: CourseTestCountAggregateOutputType | null
    _min: CourseTestMinAggregateOutputType | null
    _max: CourseTestMaxAggregateOutputType | null
  }

  type GetCourseTestGroupByPayload<T extends CourseTestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CourseTestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CourseTestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CourseTestGroupByOutputType[P]>
            : GetScalarType<T[P], CourseTestGroupByOutputType[P]>
        }
      >
    >


  export type CourseTestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    courseId?: boolean
    testId?: boolean
    test?: boolean | TestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courseTest"]>

  export type CourseTestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    courseId?: boolean
    testId?: boolean
    test?: boolean | TestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courseTest"]>

  export type CourseTestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    courseId?: boolean
    testId?: boolean
    test?: boolean | TestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["courseTest"]>

  export type CourseTestSelectScalar = {
    courseId?: boolean
    testId?: boolean
  }

  export type CourseTestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"courseId" | "testId", ExtArgs["result"]["courseTest"]>
  export type CourseTestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | TestDefaultArgs<ExtArgs>
  }
  export type CourseTestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | TestDefaultArgs<ExtArgs>
  }
  export type CourseTestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | TestDefaultArgs<ExtArgs>
  }

  export type $CourseTestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CourseTest"
    objects: {
      test: Prisma.$TestPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      courseId: string
      testId: string
    }, ExtArgs["result"]["courseTest"]>
    composites: {}
  }

  type CourseTestGetPayload<S extends boolean | null | undefined | CourseTestDefaultArgs> = $Result.GetResult<Prisma.$CourseTestPayload, S>

  type CourseTestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CourseTestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CourseTestCountAggregateInputType | true
    }

  export interface CourseTestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CourseTest'], meta: { name: 'CourseTest' } }
    /**
     * Find zero or one CourseTest that matches the filter.
     * @param {CourseTestFindUniqueArgs} args - Arguments to find a CourseTest
     * @example
     * // Get one CourseTest
     * const courseTest = await prisma.courseTest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourseTestFindUniqueArgs>(args: SelectSubset<T, CourseTestFindUniqueArgs<ExtArgs>>): Prisma__CourseTestClient<$Result.GetResult<Prisma.$CourseTestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CourseTest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CourseTestFindUniqueOrThrowArgs} args - Arguments to find a CourseTest
     * @example
     * // Get one CourseTest
     * const courseTest = await prisma.courseTest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourseTestFindUniqueOrThrowArgs>(args: SelectSubset<T, CourseTestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CourseTestClient<$Result.GetResult<Prisma.$CourseTestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CourseTest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseTestFindFirstArgs} args - Arguments to find a CourseTest
     * @example
     * // Get one CourseTest
     * const courseTest = await prisma.courseTest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourseTestFindFirstArgs>(args?: SelectSubset<T, CourseTestFindFirstArgs<ExtArgs>>): Prisma__CourseTestClient<$Result.GetResult<Prisma.$CourseTestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CourseTest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseTestFindFirstOrThrowArgs} args - Arguments to find a CourseTest
     * @example
     * // Get one CourseTest
     * const courseTest = await prisma.courseTest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourseTestFindFirstOrThrowArgs>(args?: SelectSubset<T, CourseTestFindFirstOrThrowArgs<ExtArgs>>): Prisma__CourseTestClient<$Result.GetResult<Prisma.$CourseTestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CourseTests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseTestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CourseTests
     * const courseTests = await prisma.courseTest.findMany()
     * 
     * // Get first 10 CourseTests
     * const courseTests = await prisma.courseTest.findMany({ take: 10 })
     * 
     * // Only select the `courseId`
     * const courseTestWithCourseIdOnly = await prisma.courseTest.findMany({ select: { courseId: true } })
     * 
     */
    findMany<T extends CourseTestFindManyArgs>(args?: SelectSubset<T, CourseTestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseTestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CourseTest.
     * @param {CourseTestCreateArgs} args - Arguments to create a CourseTest.
     * @example
     * // Create one CourseTest
     * const CourseTest = await prisma.courseTest.create({
     *   data: {
     *     // ... data to create a CourseTest
     *   }
     * })
     * 
     */
    create<T extends CourseTestCreateArgs>(args: SelectSubset<T, CourseTestCreateArgs<ExtArgs>>): Prisma__CourseTestClient<$Result.GetResult<Prisma.$CourseTestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CourseTests.
     * @param {CourseTestCreateManyArgs} args - Arguments to create many CourseTests.
     * @example
     * // Create many CourseTests
     * const courseTest = await prisma.courseTest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CourseTestCreateManyArgs>(args?: SelectSubset<T, CourseTestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CourseTests and returns the data saved in the database.
     * @param {CourseTestCreateManyAndReturnArgs} args - Arguments to create many CourseTests.
     * @example
     * // Create many CourseTests
     * const courseTest = await prisma.courseTest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CourseTests and only return the `courseId`
     * const courseTestWithCourseIdOnly = await prisma.courseTest.createManyAndReturn({
     *   select: { courseId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CourseTestCreateManyAndReturnArgs>(args?: SelectSubset<T, CourseTestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseTestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CourseTest.
     * @param {CourseTestDeleteArgs} args - Arguments to delete one CourseTest.
     * @example
     * // Delete one CourseTest
     * const CourseTest = await prisma.courseTest.delete({
     *   where: {
     *     // ... filter to delete one CourseTest
     *   }
     * })
     * 
     */
    delete<T extends CourseTestDeleteArgs>(args: SelectSubset<T, CourseTestDeleteArgs<ExtArgs>>): Prisma__CourseTestClient<$Result.GetResult<Prisma.$CourseTestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CourseTest.
     * @param {CourseTestUpdateArgs} args - Arguments to update one CourseTest.
     * @example
     * // Update one CourseTest
     * const courseTest = await prisma.courseTest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CourseTestUpdateArgs>(args: SelectSubset<T, CourseTestUpdateArgs<ExtArgs>>): Prisma__CourseTestClient<$Result.GetResult<Prisma.$CourseTestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CourseTests.
     * @param {CourseTestDeleteManyArgs} args - Arguments to filter CourseTests to delete.
     * @example
     * // Delete a few CourseTests
     * const { count } = await prisma.courseTest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CourseTestDeleteManyArgs>(args?: SelectSubset<T, CourseTestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CourseTests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseTestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CourseTests
     * const courseTest = await prisma.courseTest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CourseTestUpdateManyArgs>(args: SelectSubset<T, CourseTestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CourseTests and returns the data updated in the database.
     * @param {CourseTestUpdateManyAndReturnArgs} args - Arguments to update many CourseTests.
     * @example
     * // Update many CourseTests
     * const courseTest = await prisma.courseTest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CourseTests and only return the `courseId`
     * const courseTestWithCourseIdOnly = await prisma.courseTest.updateManyAndReturn({
     *   select: { courseId: true },
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
    updateManyAndReturn<T extends CourseTestUpdateManyAndReturnArgs>(args: SelectSubset<T, CourseTestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourseTestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CourseTest.
     * @param {CourseTestUpsertArgs} args - Arguments to update or create a CourseTest.
     * @example
     * // Update or create a CourseTest
     * const courseTest = await prisma.courseTest.upsert({
     *   create: {
     *     // ... data to create a CourseTest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CourseTest we want to update
     *   }
     * })
     */
    upsert<T extends CourseTestUpsertArgs>(args: SelectSubset<T, CourseTestUpsertArgs<ExtArgs>>): Prisma__CourseTestClient<$Result.GetResult<Prisma.$CourseTestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CourseTests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseTestCountArgs} args - Arguments to filter CourseTests to count.
     * @example
     * // Count the number of CourseTests
     * const count = await prisma.courseTest.count({
     *   where: {
     *     // ... the filter for the CourseTests we want to count
     *   }
     * })
    **/
    count<T extends CourseTestCountArgs>(
      args?: Subset<T, CourseTestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CourseTestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CourseTest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseTestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CourseTestAggregateArgs>(args: Subset<T, CourseTestAggregateArgs>): Prisma.PrismaPromise<GetCourseTestAggregateType<T>>

    /**
     * Group by CourseTest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseTestGroupByArgs} args - Group by arguments.
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
      T extends CourseTestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CourseTestGroupByArgs['orderBy'] }
        : { orderBy?: CourseTestGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CourseTestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourseTestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CourseTest model
   */
  readonly fields: CourseTestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CourseTest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CourseTestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    test<T extends TestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TestDefaultArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the CourseTest model
   */
  interface CourseTestFieldRefs {
    readonly courseId: FieldRef<"CourseTest", 'String'>
    readonly testId: FieldRef<"CourseTest", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CourseTest findUnique
   */
  export type CourseTestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestInclude<ExtArgs> | null
    /**
     * Filter, which CourseTest to fetch.
     */
    where: CourseTestWhereUniqueInput
  }

  /**
   * CourseTest findUniqueOrThrow
   */
  export type CourseTestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestInclude<ExtArgs> | null
    /**
     * Filter, which CourseTest to fetch.
     */
    where: CourseTestWhereUniqueInput
  }

  /**
   * CourseTest findFirst
   */
  export type CourseTestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestInclude<ExtArgs> | null
    /**
     * Filter, which CourseTest to fetch.
     */
    where?: CourseTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseTests to fetch.
     */
    orderBy?: CourseTestOrderByWithRelationInput | CourseTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CourseTests.
     */
    cursor?: CourseTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CourseTests.
     */
    distinct?: CourseTestScalarFieldEnum | CourseTestScalarFieldEnum[]
  }

  /**
   * CourseTest findFirstOrThrow
   */
  export type CourseTestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestInclude<ExtArgs> | null
    /**
     * Filter, which CourseTest to fetch.
     */
    where?: CourseTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseTests to fetch.
     */
    orderBy?: CourseTestOrderByWithRelationInput | CourseTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CourseTests.
     */
    cursor?: CourseTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseTests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CourseTests.
     */
    distinct?: CourseTestScalarFieldEnum | CourseTestScalarFieldEnum[]
  }

  /**
   * CourseTest findMany
   */
  export type CourseTestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestInclude<ExtArgs> | null
    /**
     * Filter, which CourseTests to fetch.
     */
    where?: CourseTestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CourseTests to fetch.
     */
    orderBy?: CourseTestOrderByWithRelationInput | CourseTestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CourseTests.
     */
    cursor?: CourseTestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CourseTests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CourseTests.
     */
    skip?: number
    distinct?: CourseTestScalarFieldEnum | CourseTestScalarFieldEnum[]
  }

  /**
   * CourseTest create
   */
  export type CourseTestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestInclude<ExtArgs> | null
    /**
     * The data needed to create a CourseTest.
     */
    data: XOR<CourseTestCreateInput, CourseTestUncheckedCreateInput>
  }

  /**
   * CourseTest createMany
   */
  export type CourseTestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CourseTests.
     */
    data: CourseTestCreateManyInput | CourseTestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CourseTest createManyAndReturn
   */
  export type CourseTestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * The data used to create many CourseTests.
     */
    data: CourseTestCreateManyInput | CourseTestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CourseTest update
   */
  export type CourseTestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestInclude<ExtArgs> | null
    /**
     * The data needed to update a CourseTest.
     */
    data: XOR<CourseTestUpdateInput, CourseTestUncheckedUpdateInput>
    /**
     * Choose, which CourseTest to update.
     */
    where: CourseTestWhereUniqueInput
  }

  /**
   * CourseTest updateMany
   */
  export type CourseTestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CourseTests.
     */
    data: XOR<CourseTestUpdateManyMutationInput, CourseTestUncheckedUpdateManyInput>
    /**
     * Filter which CourseTests to update
     */
    where?: CourseTestWhereInput
    /**
     * Limit how many CourseTests to update.
     */
    limit?: number
  }

  /**
   * CourseTest updateManyAndReturn
   */
  export type CourseTestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * The data used to update CourseTests.
     */
    data: XOR<CourseTestUpdateManyMutationInput, CourseTestUncheckedUpdateManyInput>
    /**
     * Filter which CourseTests to update
     */
    where?: CourseTestWhereInput
    /**
     * Limit how many CourseTests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CourseTest upsert
   */
  export type CourseTestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestInclude<ExtArgs> | null
    /**
     * The filter to search for the CourseTest to update in case it exists.
     */
    where: CourseTestWhereUniqueInput
    /**
     * In case the CourseTest found by the `where` argument doesn't exist, create a new CourseTest with this data.
     */
    create: XOR<CourseTestCreateInput, CourseTestUncheckedCreateInput>
    /**
     * In case the CourseTest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CourseTestUpdateInput, CourseTestUncheckedUpdateInput>
  }

  /**
   * CourseTest delete
   */
  export type CourseTestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestInclude<ExtArgs> | null
    /**
     * Filter which CourseTest to delete.
     */
    where: CourseTestWhereUniqueInput
  }

  /**
   * CourseTest deleteMany
   */
  export type CourseTestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CourseTests to delete
     */
    where?: CourseTestWhereInput
    /**
     * Limit how many CourseTests to delete.
     */
    limit?: number
  }

  /**
   * CourseTest without action
   */
  export type CourseTestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseTest
     */
    select?: CourseTestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CourseTest
     */
    omit?: CourseTestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourseTestInclude<ExtArgs> | null
  }


  /**
   * Model Section
   */

  export type AggregateSection = {
    _count: SectionCountAggregateOutputType | null
    _avg: SectionAvgAggregateOutputType | null
    _sum: SectionSumAggregateOutputType | null
    _min: SectionMinAggregateOutputType | null
    _max: SectionMaxAggregateOutputType | null
  }

  export type SectionAvgAggregateOutputType = {
    durationInSeconds: number | null
    totalQuestions: number | null
    totalScore: number | null
  }

  export type SectionSumAggregateOutputType = {
    durationInSeconds: number | null
    totalQuestions: number | null
    totalScore: number | null
  }

  export type SectionMinAggregateOutputType = {
    id: string | null
    title: string | null
    testId: string | null
    skill: $Enums.SkillType | null
    durationInSeconds: number | null
    totalQuestions: number | null
    totalScore: number | null
  }

  export type SectionMaxAggregateOutputType = {
    id: string | null
    title: string | null
    testId: string | null
    skill: $Enums.SkillType | null
    durationInSeconds: number | null
    totalQuestions: number | null
    totalScore: number | null
  }

  export type SectionCountAggregateOutputType = {
    id: number
    title: number
    testId: number
    skill: number
    durationInSeconds: number
    totalQuestions: number
    totalScore: number
    _all: number
  }


  export type SectionAvgAggregateInputType = {
    durationInSeconds?: true
    totalQuestions?: true
    totalScore?: true
  }

  export type SectionSumAggregateInputType = {
    durationInSeconds?: true
    totalQuestions?: true
    totalScore?: true
  }

  export type SectionMinAggregateInputType = {
    id?: true
    title?: true
    testId?: true
    skill?: true
    durationInSeconds?: true
    totalQuestions?: true
    totalScore?: true
  }

  export type SectionMaxAggregateInputType = {
    id?: true
    title?: true
    testId?: true
    skill?: true
    durationInSeconds?: true
    totalQuestions?: true
    totalScore?: true
  }

  export type SectionCountAggregateInputType = {
    id?: true
    title?: true
    testId?: true
    skill?: true
    durationInSeconds?: true
    totalQuestions?: true
    totalScore?: true
    _all?: true
  }

  export type SectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Section to aggregate.
     */
    where?: SectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sections to fetch.
     */
    orderBy?: SectionOrderByWithRelationInput | SectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sections
    **/
    _count?: true | SectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SectionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SectionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SectionMaxAggregateInputType
  }

  export type GetSectionAggregateType<T extends SectionAggregateArgs> = {
        [P in keyof T & keyof AggregateSection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSection[P]>
      : GetScalarType<T[P], AggregateSection[P]>
  }




  export type SectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SectionWhereInput
    orderBy?: SectionOrderByWithAggregationInput | SectionOrderByWithAggregationInput[]
    by: SectionScalarFieldEnum[] | SectionScalarFieldEnum
    having?: SectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SectionCountAggregateInputType | true
    _avg?: SectionAvgAggregateInputType
    _sum?: SectionSumAggregateInputType
    _min?: SectionMinAggregateInputType
    _max?: SectionMaxAggregateInputType
  }

  export type SectionGroupByOutputType = {
    id: string
    title: string
    testId: string | null
    skill: $Enums.SkillType | null
    durationInSeconds: number | null
    totalQuestions: number | null
    totalScore: number | null
    _count: SectionCountAggregateOutputType | null
    _avg: SectionAvgAggregateOutputType | null
    _sum: SectionSumAggregateOutputType | null
    _min: SectionMinAggregateOutputType | null
    _max: SectionMaxAggregateOutputType | null
  }

  type GetSectionGroupByPayload<T extends SectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SectionGroupByOutputType[P]>
            : GetScalarType<T[P], SectionGroupByOutputType[P]>
        }
      >
    >


  export type SectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    testId?: boolean
    skill?: boolean
    durationInSeconds?: boolean
    totalQuestions?: boolean
    totalScore?: boolean
    passages?: boolean | Section$passagesArgs<ExtArgs>
    questions?: boolean | Section$questionsArgs<ExtArgs>
    test?: boolean | Section$testArgs<ExtArgs>
    _count?: boolean | SectionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["section"]>

  export type SectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    testId?: boolean
    skill?: boolean
    durationInSeconds?: boolean
    totalQuestions?: boolean
    totalScore?: boolean
    test?: boolean | Section$testArgs<ExtArgs>
  }, ExtArgs["result"]["section"]>

  export type SectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    testId?: boolean
    skill?: boolean
    durationInSeconds?: boolean
    totalQuestions?: boolean
    totalScore?: boolean
    test?: boolean | Section$testArgs<ExtArgs>
  }, ExtArgs["result"]["section"]>

  export type SectionSelectScalar = {
    id?: boolean
    title?: boolean
    testId?: boolean
    skill?: boolean
    durationInSeconds?: boolean
    totalQuestions?: boolean
    totalScore?: boolean
  }

  export type SectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "testId" | "skill" | "durationInSeconds" | "totalQuestions" | "totalScore", ExtArgs["result"]["section"]>
  export type SectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    passages?: boolean | Section$passagesArgs<ExtArgs>
    questions?: boolean | Section$questionsArgs<ExtArgs>
    test?: boolean | Section$testArgs<ExtArgs>
    _count?: boolean | SectionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | Section$testArgs<ExtArgs>
  }
  export type SectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | Section$testArgs<ExtArgs>
  }

  export type $SectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Section"
    objects: {
      passages: Prisma.$PassagePayload<ExtArgs>[]
      questions: Prisma.$QuestionPayload<ExtArgs>[]
      test: Prisma.$TestPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      testId: string | null
      skill: $Enums.SkillType | null
      durationInSeconds: number | null
      totalQuestions: number | null
      totalScore: number | null
    }, ExtArgs["result"]["section"]>
    composites: {}
  }

  type SectionGetPayload<S extends boolean | null | undefined | SectionDefaultArgs> = $Result.GetResult<Prisma.$SectionPayload, S>

  type SectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SectionCountAggregateInputType | true
    }

  export interface SectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Section'], meta: { name: 'Section' } }
    /**
     * Find zero or one Section that matches the filter.
     * @param {SectionFindUniqueArgs} args - Arguments to find a Section
     * @example
     * // Get one Section
     * const section = await prisma.section.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SectionFindUniqueArgs>(args: SelectSubset<T, SectionFindUniqueArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Section that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SectionFindUniqueOrThrowArgs} args - Arguments to find a Section
     * @example
     * // Get one Section
     * const section = await prisma.section.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SectionFindUniqueOrThrowArgs>(args: SelectSubset<T, SectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Section that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionFindFirstArgs} args - Arguments to find a Section
     * @example
     * // Get one Section
     * const section = await prisma.section.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SectionFindFirstArgs>(args?: SelectSubset<T, SectionFindFirstArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Section that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionFindFirstOrThrowArgs} args - Arguments to find a Section
     * @example
     * // Get one Section
     * const section = await prisma.section.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SectionFindFirstOrThrowArgs>(args?: SelectSubset<T, SectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sections
     * const sections = await prisma.section.findMany()
     * 
     * // Get first 10 Sections
     * const sections = await prisma.section.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sectionWithIdOnly = await prisma.section.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SectionFindManyArgs>(args?: SelectSubset<T, SectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Section.
     * @param {SectionCreateArgs} args - Arguments to create a Section.
     * @example
     * // Create one Section
     * const Section = await prisma.section.create({
     *   data: {
     *     // ... data to create a Section
     *   }
     * })
     * 
     */
    create<T extends SectionCreateArgs>(args: SelectSubset<T, SectionCreateArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sections.
     * @param {SectionCreateManyArgs} args - Arguments to create many Sections.
     * @example
     * // Create many Sections
     * const section = await prisma.section.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SectionCreateManyArgs>(args?: SelectSubset<T, SectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sections and returns the data saved in the database.
     * @param {SectionCreateManyAndReturnArgs} args - Arguments to create many Sections.
     * @example
     * // Create many Sections
     * const section = await prisma.section.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sections and only return the `id`
     * const sectionWithIdOnly = await prisma.section.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SectionCreateManyAndReturnArgs>(args?: SelectSubset<T, SectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Section.
     * @param {SectionDeleteArgs} args - Arguments to delete one Section.
     * @example
     * // Delete one Section
     * const Section = await prisma.section.delete({
     *   where: {
     *     // ... filter to delete one Section
     *   }
     * })
     * 
     */
    delete<T extends SectionDeleteArgs>(args: SelectSubset<T, SectionDeleteArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Section.
     * @param {SectionUpdateArgs} args - Arguments to update one Section.
     * @example
     * // Update one Section
     * const section = await prisma.section.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SectionUpdateArgs>(args: SelectSubset<T, SectionUpdateArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sections.
     * @param {SectionDeleteManyArgs} args - Arguments to filter Sections to delete.
     * @example
     * // Delete a few Sections
     * const { count } = await prisma.section.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SectionDeleteManyArgs>(args?: SelectSubset<T, SectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sections
     * const section = await prisma.section.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SectionUpdateManyArgs>(args: SelectSubset<T, SectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sections and returns the data updated in the database.
     * @param {SectionUpdateManyAndReturnArgs} args - Arguments to update many Sections.
     * @example
     * // Update many Sections
     * const section = await prisma.section.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sections and only return the `id`
     * const sectionWithIdOnly = await prisma.section.updateManyAndReturn({
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
    updateManyAndReturn<T extends SectionUpdateManyAndReturnArgs>(args: SelectSubset<T, SectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Section.
     * @param {SectionUpsertArgs} args - Arguments to update or create a Section.
     * @example
     * // Update or create a Section
     * const section = await prisma.section.upsert({
     *   create: {
     *     // ... data to create a Section
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Section we want to update
     *   }
     * })
     */
    upsert<T extends SectionUpsertArgs>(args: SelectSubset<T, SectionUpsertArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionCountArgs} args - Arguments to filter Sections to count.
     * @example
     * // Count the number of Sections
     * const count = await prisma.section.count({
     *   where: {
     *     // ... the filter for the Sections we want to count
     *   }
     * })
    **/
    count<T extends SectionCountArgs>(
      args?: Subset<T, SectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Section.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SectionAggregateArgs>(args: Subset<T, SectionAggregateArgs>): Prisma.PrismaPromise<GetSectionAggregateType<T>>

    /**
     * Group by Section.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SectionGroupByArgs} args - Group by arguments.
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
      T extends SectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SectionGroupByArgs['orderBy'] }
        : { orderBy?: SectionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Section model
   */
  readonly fields: SectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Section.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    passages<T extends Section$passagesArgs<ExtArgs> = {}>(args?: Subset<T, Section$passagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    questions<T extends Section$questionsArgs<ExtArgs> = {}>(args?: Subset<T, Section$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    test<T extends Section$testArgs<ExtArgs> = {}>(args?: Subset<T, Section$testArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Section model
   */
  interface SectionFieldRefs {
    readonly id: FieldRef<"Section", 'String'>
    readonly title: FieldRef<"Section", 'String'>
    readonly testId: FieldRef<"Section", 'String'>
    readonly skill: FieldRef<"Section", 'SkillType'>
    readonly durationInSeconds: FieldRef<"Section", 'Float'>
    readonly totalQuestions: FieldRef<"Section", 'Int'>
    readonly totalScore: FieldRef<"Section", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * Section findUnique
   */
  export type SectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * Filter, which Section to fetch.
     */
    where: SectionWhereUniqueInput
  }

  /**
   * Section findUniqueOrThrow
   */
  export type SectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * Filter, which Section to fetch.
     */
    where: SectionWhereUniqueInput
  }

  /**
   * Section findFirst
   */
  export type SectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * Filter, which Section to fetch.
     */
    where?: SectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sections to fetch.
     */
    orderBy?: SectionOrderByWithRelationInput | SectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sections.
     */
    cursor?: SectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sections.
     */
    distinct?: SectionScalarFieldEnum | SectionScalarFieldEnum[]
  }

  /**
   * Section findFirstOrThrow
   */
  export type SectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * Filter, which Section to fetch.
     */
    where?: SectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sections to fetch.
     */
    orderBy?: SectionOrderByWithRelationInput | SectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sections.
     */
    cursor?: SectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sections.
     */
    distinct?: SectionScalarFieldEnum | SectionScalarFieldEnum[]
  }

  /**
   * Section findMany
   */
  export type SectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * Filter, which Sections to fetch.
     */
    where?: SectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sections to fetch.
     */
    orderBy?: SectionOrderByWithRelationInput | SectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sections.
     */
    cursor?: SectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sections.
     */
    skip?: number
    distinct?: SectionScalarFieldEnum | SectionScalarFieldEnum[]
  }

  /**
   * Section create
   */
  export type SectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * The data needed to create a Section.
     */
    data: XOR<SectionCreateInput, SectionUncheckedCreateInput>
  }

  /**
   * Section createMany
   */
  export type SectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sections.
     */
    data: SectionCreateManyInput | SectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Section createManyAndReturn
   */
  export type SectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * The data used to create many Sections.
     */
    data: SectionCreateManyInput | SectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Section update
   */
  export type SectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * The data needed to update a Section.
     */
    data: XOR<SectionUpdateInput, SectionUncheckedUpdateInput>
    /**
     * Choose, which Section to update.
     */
    where: SectionWhereUniqueInput
  }

  /**
   * Section updateMany
   */
  export type SectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sections.
     */
    data: XOR<SectionUpdateManyMutationInput, SectionUncheckedUpdateManyInput>
    /**
     * Filter which Sections to update
     */
    where?: SectionWhereInput
    /**
     * Limit how many Sections to update.
     */
    limit?: number
  }

  /**
   * Section updateManyAndReturn
   */
  export type SectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * The data used to update Sections.
     */
    data: XOR<SectionUpdateManyMutationInput, SectionUncheckedUpdateManyInput>
    /**
     * Filter which Sections to update
     */
    where?: SectionWhereInput
    /**
     * Limit how many Sections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Section upsert
   */
  export type SectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * The filter to search for the Section to update in case it exists.
     */
    where: SectionWhereUniqueInput
    /**
     * In case the Section found by the `where` argument doesn't exist, create a new Section with this data.
     */
    create: XOR<SectionCreateInput, SectionUncheckedCreateInput>
    /**
     * In case the Section was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SectionUpdateInput, SectionUncheckedUpdateInput>
  }

  /**
   * Section delete
   */
  export type SectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    /**
     * Filter which Section to delete.
     */
    where: SectionWhereUniqueInput
  }

  /**
   * Section deleteMany
   */
  export type SectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sections to delete
     */
    where?: SectionWhereInput
    /**
     * Limit how many Sections to delete.
     */
    limit?: number
  }

  /**
   * Section.passages
   */
  export type Section$passagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageInclude<ExtArgs> | null
    where?: PassageWhereInput
    orderBy?: PassageOrderByWithRelationInput | PassageOrderByWithRelationInput[]
    cursor?: PassageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PassageScalarFieldEnum | PassageScalarFieldEnum[]
  }

  /**
   * Section.questions
   */
  export type Section$questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Section.test
   */
  export type Section$testArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    where?: TestWhereInput
  }

  /**
   * Section without action
   */
  export type SectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
  }


  /**
   * Model Passage
   */

  export type AggregatePassage = {
    _count: PassageCountAggregateOutputType | null
    _avg: PassageAvgAggregateOutputType | null
    _sum: PassageSumAggregateOutputType | null
    _min: PassageMinAggregateOutputType | null
    _max: PassageMaxAggregateOutputType | null
  }

  export type PassageAvgAggregateOutputType = {
    passageOrder: number | null
  }

  export type PassageSumAggregateOutputType = {
    passageOrder: number | null
  }

  export type PassageMinAggregateOutputType = {
    id: string | null
    sectionId: string | null
    content: string | null
    passageOrder: number | null
  }

  export type PassageMaxAggregateOutputType = {
    id: string | null
    sectionId: string | null
    content: string | null
    passageOrder: number | null
  }

  export type PassageCountAggregateOutputType = {
    id: number
    sectionId: number
    content: number
    passageOrder: number
    _all: number
  }


  export type PassageAvgAggregateInputType = {
    passageOrder?: true
  }

  export type PassageSumAggregateInputType = {
    passageOrder?: true
  }

  export type PassageMinAggregateInputType = {
    id?: true
    sectionId?: true
    content?: true
    passageOrder?: true
  }

  export type PassageMaxAggregateInputType = {
    id?: true
    sectionId?: true
    content?: true
    passageOrder?: true
  }

  export type PassageCountAggregateInputType = {
    id?: true
    sectionId?: true
    content?: true
    passageOrder?: true
    _all?: true
  }

  export type PassageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Passage to aggregate.
     */
    where?: PassageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Passages to fetch.
     */
    orderBy?: PassageOrderByWithRelationInput | PassageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PassageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Passages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Passages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Passages
    **/
    _count?: true | PassageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PassageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PassageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PassageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PassageMaxAggregateInputType
  }

  export type GetPassageAggregateType<T extends PassageAggregateArgs> = {
        [P in keyof T & keyof AggregatePassage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePassage[P]>
      : GetScalarType<T[P], AggregatePassage[P]>
  }




  export type PassageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PassageWhereInput
    orderBy?: PassageOrderByWithAggregationInput | PassageOrderByWithAggregationInput[]
    by: PassageScalarFieldEnum[] | PassageScalarFieldEnum
    having?: PassageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PassageCountAggregateInputType | true
    _avg?: PassageAvgAggregateInputType
    _sum?: PassageSumAggregateInputType
    _min?: PassageMinAggregateInputType
    _max?: PassageMaxAggregateInputType
  }

  export type PassageGroupByOutputType = {
    id: string
    sectionId: string
    content: string
    passageOrder: number | null
    _count: PassageCountAggregateOutputType | null
    _avg: PassageAvgAggregateOutputType | null
    _sum: PassageSumAggregateOutputType | null
    _min: PassageMinAggregateOutputType | null
    _max: PassageMaxAggregateOutputType | null
  }

  type GetPassageGroupByPayload<T extends PassageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PassageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PassageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PassageGroupByOutputType[P]>
            : GetScalarType<T[P], PassageGroupByOutputType[P]>
        }
      >
    >


  export type PassageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sectionId?: boolean
    content?: boolean
    passageOrder?: boolean
    section?: boolean | SectionDefaultArgs<ExtArgs>
    questions?: boolean | Passage$questionsArgs<ExtArgs>
    _count?: boolean | PassageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passage"]>

  export type PassageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sectionId?: boolean
    content?: boolean
    passageOrder?: boolean
    section?: boolean | SectionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passage"]>

  export type PassageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sectionId?: boolean
    content?: boolean
    passageOrder?: boolean
    section?: boolean | SectionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passage"]>

  export type PassageSelectScalar = {
    id?: boolean
    sectionId?: boolean
    content?: boolean
    passageOrder?: boolean
  }

  export type PassageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sectionId" | "content" | "passageOrder", ExtArgs["result"]["passage"]>
  export type PassageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    section?: boolean | SectionDefaultArgs<ExtArgs>
    questions?: boolean | Passage$questionsArgs<ExtArgs>
    _count?: boolean | PassageCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PassageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    section?: boolean | SectionDefaultArgs<ExtArgs>
  }
  export type PassageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    section?: boolean | SectionDefaultArgs<ExtArgs>
  }

  export type $PassagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Passage"
    objects: {
      section: Prisma.$SectionPayload<ExtArgs>
      questions: Prisma.$QuestionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sectionId: string
      content: string
      passageOrder: number | null
    }, ExtArgs["result"]["passage"]>
    composites: {}
  }

  type PassageGetPayload<S extends boolean | null | undefined | PassageDefaultArgs> = $Result.GetResult<Prisma.$PassagePayload, S>

  type PassageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PassageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PassageCountAggregateInputType | true
    }

  export interface PassageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Passage'], meta: { name: 'Passage' } }
    /**
     * Find zero or one Passage that matches the filter.
     * @param {PassageFindUniqueArgs} args - Arguments to find a Passage
     * @example
     * // Get one Passage
     * const passage = await prisma.passage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PassageFindUniqueArgs>(args: SelectSubset<T, PassageFindUniqueArgs<ExtArgs>>): Prisma__PassageClient<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Passage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PassageFindUniqueOrThrowArgs} args - Arguments to find a Passage
     * @example
     * // Get one Passage
     * const passage = await prisma.passage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PassageFindUniqueOrThrowArgs>(args: SelectSubset<T, PassageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PassageClient<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Passage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassageFindFirstArgs} args - Arguments to find a Passage
     * @example
     * // Get one Passage
     * const passage = await prisma.passage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PassageFindFirstArgs>(args?: SelectSubset<T, PassageFindFirstArgs<ExtArgs>>): Prisma__PassageClient<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Passage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassageFindFirstOrThrowArgs} args - Arguments to find a Passage
     * @example
     * // Get one Passage
     * const passage = await prisma.passage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PassageFindFirstOrThrowArgs>(args?: SelectSubset<T, PassageFindFirstOrThrowArgs<ExtArgs>>): Prisma__PassageClient<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Passages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Passages
     * const passages = await prisma.passage.findMany()
     * 
     * // Get first 10 Passages
     * const passages = await prisma.passage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passageWithIdOnly = await prisma.passage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PassageFindManyArgs>(args?: SelectSubset<T, PassageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Passage.
     * @param {PassageCreateArgs} args - Arguments to create a Passage.
     * @example
     * // Create one Passage
     * const Passage = await prisma.passage.create({
     *   data: {
     *     // ... data to create a Passage
     *   }
     * })
     * 
     */
    create<T extends PassageCreateArgs>(args: SelectSubset<T, PassageCreateArgs<ExtArgs>>): Prisma__PassageClient<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Passages.
     * @param {PassageCreateManyArgs} args - Arguments to create many Passages.
     * @example
     * // Create many Passages
     * const passage = await prisma.passage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PassageCreateManyArgs>(args?: SelectSubset<T, PassageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Passages and returns the data saved in the database.
     * @param {PassageCreateManyAndReturnArgs} args - Arguments to create many Passages.
     * @example
     * // Create many Passages
     * const passage = await prisma.passage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Passages and only return the `id`
     * const passageWithIdOnly = await prisma.passage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PassageCreateManyAndReturnArgs>(args?: SelectSubset<T, PassageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Passage.
     * @param {PassageDeleteArgs} args - Arguments to delete one Passage.
     * @example
     * // Delete one Passage
     * const Passage = await prisma.passage.delete({
     *   where: {
     *     // ... filter to delete one Passage
     *   }
     * })
     * 
     */
    delete<T extends PassageDeleteArgs>(args: SelectSubset<T, PassageDeleteArgs<ExtArgs>>): Prisma__PassageClient<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Passage.
     * @param {PassageUpdateArgs} args - Arguments to update one Passage.
     * @example
     * // Update one Passage
     * const passage = await prisma.passage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PassageUpdateArgs>(args: SelectSubset<T, PassageUpdateArgs<ExtArgs>>): Prisma__PassageClient<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Passages.
     * @param {PassageDeleteManyArgs} args - Arguments to filter Passages to delete.
     * @example
     * // Delete a few Passages
     * const { count } = await prisma.passage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PassageDeleteManyArgs>(args?: SelectSubset<T, PassageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Passages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Passages
     * const passage = await prisma.passage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PassageUpdateManyArgs>(args: SelectSubset<T, PassageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Passages and returns the data updated in the database.
     * @param {PassageUpdateManyAndReturnArgs} args - Arguments to update many Passages.
     * @example
     * // Update many Passages
     * const passage = await prisma.passage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Passages and only return the `id`
     * const passageWithIdOnly = await prisma.passage.updateManyAndReturn({
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
    updateManyAndReturn<T extends PassageUpdateManyAndReturnArgs>(args: SelectSubset<T, PassageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Passage.
     * @param {PassageUpsertArgs} args - Arguments to update or create a Passage.
     * @example
     * // Update or create a Passage
     * const passage = await prisma.passage.upsert({
     *   create: {
     *     // ... data to create a Passage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Passage we want to update
     *   }
     * })
     */
    upsert<T extends PassageUpsertArgs>(args: SelectSubset<T, PassageUpsertArgs<ExtArgs>>): Prisma__PassageClient<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Passages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassageCountArgs} args - Arguments to filter Passages to count.
     * @example
     * // Count the number of Passages
     * const count = await prisma.passage.count({
     *   where: {
     *     // ... the filter for the Passages we want to count
     *   }
     * })
    **/
    count<T extends PassageCountArgs>(
      args?: Subset<T, PassageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PassageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Passage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PassageAggregateArgs>(args: Subset<T, PassageAggregateArgs>): Prisma.PrismaPromise<GetPassageAggregateType<T>>

    /**
     * Group by Passage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PassageGroupByArgs} args - Group by arguments.
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
      T extends PassageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PassageGroupByArgs['orderBy'] }
        : { orderBy?: PassageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PassageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPassageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Passage model
   */
  readonly fields: PassageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Passage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PassageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    section<T extends SectionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SectionDefaultArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    questions<T extends Passage$questionsArgs<ExtArgs> = {}>(args?: Subset<T, Passage$questionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Passage model
   */
  interface PassageFieldRefs {
    readonly id: FieldRef<"Passage", 'String'>
    readonly sectionId: FieldRef<"Passage", 'String'>
    readonly content: FieldRef<"Passage", 'String'>
    readonly passageOrder: FieldRef<"Passage", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Passage findUnique
   */
  export type PassageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageInclude<ExtArgs> | null
    /**
     * Filter, which Passage to fetch.
     */
    where: PassageWhereUniqueInput
  }

  /**
   * Passage findUniqueOrThrow
   */
  export type PassageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageInclude<ExtArgs> | null
    /**
     * Filter, which Passage to fetch.
     */
    where: PassageWhereUniqueInput
  }

  /**
   * Passage findFirst
   */
  export type PassageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageInclude<ExtArgs> | null
    /**
     * Filter, which Passage to fetch.
     */
    where?: PassageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Passages to fetch.
     */
    orderBy?: PassageOrderByWithRelationInput | PassageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Passages.
     */
    cursor?: PassageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Passages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Passages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Passages.
     */
    distinct?: PassageScalarFieldEnum | PassageScalarFieldEnum[]
  }

  /**
   * Passage findFirstOrThrow
   */
  export type PassageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageInclude<ExtArgs> | null
    /**
     * Filter, which Passage to fetch.
     */
    where?: PassageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Passages to fetch.
     */
    orderBy?: PassageOrderByWithRelationInput | PassageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Passages.
     */
    cursor?: PassageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Passages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Passages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Passages.
     */
    distinct?: PassageScalarFieldEnum | PassageScalarFieldEnum[]
  }

  /**
   * Passage findMany
   */
  export type PassageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageInclude<ExtArgs> | null
    /**
     * Filter, which Passages to fetch.
     */
    where?: PassageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Passages to fetch.
     */
    orderBy?: PassageOrderByWithRelationInput | PassageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Passages.
     */
    cursor?: PassageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Passages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Passages.
     */
    skip?: number
    distinct?: PassageScalarFieldEnum | PassageScalarFieldEnum[]
  }

  /**
   * Passage create
   */
  export type PassageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageInclude<ExtArgs> | null
    /**
     * The data needed to create a Passage.
     */
    data: XOR<PassageCreateInput, PassageUncheckedCreateInput>
  }

  /**
   * Passage createMany
   */
  export type PassageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Passages.
     */
    data: PassageCreateManyInput | PassageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Passage createManyAndReturn
   */
  export type PassageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * The data used to create many Passages.
     */
    data: PassageCreateManyInput | PassageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Passage update
   */
  export type PassageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageInclude<ExtArgs> | null
    /**
     * The data needed to update a Passage.
     */
    data: XOR<PassageUpdateInput, PassageUncheckedUpdateInput>
    /**
     * Choose, which Passage to update.
     */
    where: PassageWhereUniqueInput
  }

  /**
   * Passage updateMany
   */
  export type PassageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Passages.
     */
    data: XOR<PassageUpdateManyMutationInput, PassageUncheckedUpdateManyInput>
    /**
     * Filter which Passages to update
     */
    where?: PassageWhereInput
    /**
     * Limit how many Passages to update.
     */
    limit?: number
  }

  /**
   * Passage updateManyAndReturn
   */
  export type PassageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * The data used to update Passages.
     */
    data: XOR<PassageUpdateManyMutationInput, PassageUncheckedUpdateManyInput>
    /**
     * Filter which Passages to update
     */
    where?: PassageWhereInput
    /**
     * Limit how many Passages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Passage upsert
   */
  export type PassageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageInclude<ExtArgs> | null
    /**
     * The filter to search for the Passage to update in case it exists.
     */
    where: PassageWhereUniqueInput
    /**
     * In case the Passage found by the `where` argument doesn't exist, create a new Passage with this data.
     */
    create: XOR<PassageCreateInput, PassageUncheckedCreateInput>
    /**
     * In case the Passage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PassageUpdateInput, PassageUncheckedUpdateInput>
  }

  /**
   * Passage delete
   */
  export type PassageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageInclude<ExtArgs> | null
    /**
     * Filter which Passage to delete.
     */
    where: PassageWhereUniqueInput
  }

  /**
   * Passage deleteMany
   */
  export type PassageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Passages to delete
     */
    where?: PassageWhereInput
    /**
     * Limit how many Passages to delete.
     */
    limit?: number
  }

  /**
   * Passage.questions
   */
  export type Passage$questionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Passage without action
   */
  export type PassageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageInclude<ExtArgs> | null
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
    correctAnswerIndex: number | null
    wordLimit: number | null
    questionOrder: number | null
  }

  export type QuestionSumAggregateOutputType = {
    correctAnswerIndex: number | null
    wordLimit: number | null
    questionOrder: number | null
  }

  export type QuestionMinAggregateOutputType = {
    id: string | null
    sectionId: string | null
    questionText: string | null
    imageUrl: string | null
    questionType: $Enums.QuestionType | null
    correctAnswerIndex: number | null
    wordLimit: number | null
    correctAnswer: string | null
    passageId: string | null
    questionOrder: number | null
    testId: string | null
  }

  export type QuestionMaxAggregateOutputType = {
    id: string | null
    sectionId: string | null
    questionText: string | null
    imageUrl: string | null
    questionType: $Enums.QuestionType | null
    correctAnswerIndex: number | null
    wordLimit: number | null
    correctAnswer: string | null
    passageId: string | null
    questionOrder: number | null
    testId: string | null
  }

  export type QuestionCountAggregateOutputType = {
    id: number
    sectionId: number
    questionText: number
    imageUrl: number
    questionType: number
    options: number
    correctAnswerIndex: number
    wordLimit: number
    correctAnswer: number
    passageId: number
    questionOrder: number
    testId: number
    _all: number
  }


  export type QuestionAvgAggregateInputType = {
    correctAnswerIndex?: true
    wordLimit?: true
    questionOrder?: true
  }

  export type QuestionSumAggregateInputType = {
    correctAnswerIndex?: true
    wordLimit?: true
    questionOrder?: true
  }

  export type QuestionMinAggregateInputType = {
    id?: true
    sectionId?: true
    questionText?: true
    imageUrl?: true
    questionType?: true
    correctAnswerIndex?: true
    wordLimit?: true
    correctAnswer?: true
    passageId?: true
    questionOrder?: true
    testId?: true
  }

  export type QuestionMaxAggregateInputType = {
    id?: true
    sectionId?: true
    questionText?: true
    imageUrl?: true
    questionType?: true
    correctAnswerIndex?: true
    wordLimit?: true
    correctAnswer?: true
    passageId?: true
    questionOrder?: true
    testId?: true
  }

  export type QuestionCountAggregateInputType = {
    id?: true
    sectionId?: true
    questionText?: true
    imageUrl?: true
    questionType?: true
    options?: true
    correctAnswerIndex?: true
    wordLimit?: true
    correctAnswer?: true
    passageId?: true
    questionOrder?: true
    testId?: true
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
    sectionId: string | null
    questionText: string | null
    imageUrl: string | null
    questionType: $Enums.QuestionType
    options: string[]
    correctAnswerIndex: number | null
    wordLimit: number | null
    correctAnswer: string | null
    passageId: string | null
    questionOrder: number | null
    testId: string | null
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
    sectionId?: boolean
    questionText?: boolean
    imageUrl?: boolean
    questionType?: boolean
    options?: boolean
    correctAnswerIndex?: boolean
    wordLimit?: boolean
    correctAnswer?: boolean
    passageId?: boolean
    questionOrder?: boolean
    testId?: boolean
    passage?: boolean | Question$passageArgs<ExtArgs>
    section?: boolean | Question$sectionArgs<ExtArgs>
    test?: boolean | Question$testArgs<ExtArgs>
    userAnswers?: boolean | Question$userAnswersArgs<ExtArgs>
    _count?: boolean | QuestionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sectionId?: boolean
    questionText?: boolean
    imageUrl?: boolean
    questionType?: boolean
    options?: boolean
    correctAnswerIndex?: boolean
    wordLimit?: boolean
    correctAnswer?: boolean
    passageId?: boolean
    questionOrder?: boolean
    testId?: boolean
    passage?: boolean | Question$passageArgs<ExtArgs>
    section?: boolean | Question$sectionArgs<ExtArgs>
    test?: boolean | Question$testArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sectionId?: boolean
    questionText?: boolean
    imageUrl?: boolean
    questionType?: boolean
    options?: boolean
    correctAnswerIndex?: boolean
    wordLimit?: boolean
    correctAnswer?: boolean
    passageId?: boolean
    questionOrder?: boolean
    testId?: boolean
    passage?: boolean | Question$passageArgs<ExtArgs>
    section?: boolean | Question$sectionArgs<ExtArgs>
    test?: boolean | Question$testArgs<ExtArgs>
  }, ExtArgs["result"]["question"]>

  export type QuestionSelectScalar = {
    id?: boolean
    sectionId?: boolean
    questionText?: boolean
    imageUrl?: boolean
    questionType?: boolean
    options?: boolean
    correctAnswerIndex?: boolean
    wordLimit?: boolean
    correctAnswer?: boolean
    passageId?: boolean
    questionOrder?: boolean
    testId?: boolean
  }

  export type QuestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sectionId" | "questionText" | "imageUrl" | "questionType" | "options" | "correctAnswerIndex" | "wordLimit" | "correctAnswer" | "passageId" | "questionOrder" | "testId", ExtArgs["result"]["question"]>
  export type QuestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    passage?: boolean | Question$passageArgs<ExtArgs>
    section?: boolean | Question$sectionArgs<ExtArgs>
    test?: boolean | Question$testArgs<ExtArgs>
    userAnswers?: boolean | Question$userAnswersArgs<ExtArgs>
    _count?: boolean | QuestionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type QuestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    passage?: boolean | Question$passageArgs<ExtArgs>
    section?: boolean | Question$sectionArgs<ExtArgs>
    test?: boolean | Question$testArgs<ExtArgs>
  }
  export type QuestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    passage?: boolean | Question$passageArgs<ExtArgs>
    section?: boolean | Question$sectionArgs<ExtArgs>
    test?: boolean | Question$testArgs<ExtArgs>
  }

  export type $QuestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Question"
    objects: {
      passage: Prisma.$PassagePayload<ExtArgs> | null
      section: Prisma.$SectionPayload<ExtArgs> | null
      test: Prisma.$TestPayload<ExtArgs> | null
      userAnswers: Prisma.$UserAnswerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sectionId: string | null
      questionText: string | null
      imageUrl: string | null
      questionType: $Enums.QuestionType
      options: string[]
      correctAnswerIndex: number | null
      wordLimit: number | null
      correctAnswer: string | null
      passageId: string | null
      questionOrder: number | null
      testId: string | null
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
    passage<T extends Question$passageArgs<ExtArgs> = {}>(args?: Subset<T, Question$passageArgs<ExtArgs>>): Prisma__PassageClient<$Result.GetResult<Prisma.$PassagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    section<T extends Question$sectionArgs<ExtArgs> = {}>(args?: Subset<T, Question$sectionArgs<ExtArgs>>): Prisma__SectionClient<$Result.GetResult<Prisma.$SectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    test<T extends Question$testArgs<ExtArgs> = {}>(args?: Subset<T, Question$testArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    userAnswers<T extends Question$userAnswersArgs<ExtArgs> = {}>(args?: Subset<T, Question$userAnswersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly sectionId: FieldRef<"Question", 'String'>
    readonly questionText: FieldRef<"Question", 'String'>
    readonly imageUrl: FieldRef<"Question", 'String'>
    readonly questionType: FieldRef<"Question", 'QuestionType'>
    readonly options: FieldRef<"Question", 'String[]'>
    readonly correctAnswerIndex: FieldRef<"Question", 'Int'>
    readonly wordLimit: FieldRef<"Question", 'Int'>
    readonly correctAnswer: FieldRef<"Question", 'String'>
    readonly passageId: FieldRef<"Question", 'String'>
    readonly questionOrder: FieldRef<"Question", 'Int'>
    readonly testId: FieldRef<"Question", 'String'>
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
   * Question.passage
   */
  export type Question$passageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Passage
     */
    select?: PassageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Passage
     */
    omit?: PassageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PassageInclude<ExtArgs> | null
    where?: PassageWhereInput
  }

  /**
   * Question.section
   */
  export type Question$sectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Section
     */
    select?: SectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Section
     */
    omit?: SectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SectionInclude<ExtArgs> | null
    where?: SectionWhereInput
  }

  /**
   * Question.test
   */
  export type Question$testArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Test
     */
    select?: TestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Test
     */
    omit?: TestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestInclude<ExtArgs> | null
    where?: TestWhereInput
  }

  /**
   * Question.userAnswers
   */
  export type Question$userAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerInclude<ExtArgs> | null
    where?: UserAnswerWhereInput
    orderBy?: UserAnswerOrderByWithRelationInput | UserAnswerOrderByWithRelationInput[]
    cursor?: UserAnswerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserAnswerScalarFieldEnum | UserAnswerScalarFieldEnum[]
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
   * Model PracticeSession
   */

  export type AggregatePracticeSession = {
    _count: PracticeSessionCountAggregateOutputType | null
    _avg: PracticeSessionAvgAggregateOutputType | null
    _sum: PracticeSessionSumAggregateOutputType | null
    _min: PracticeSessionMinAggregateOutputType | null
    _max: PracticeSessionMaxAggregateOutputType | null
  }

  export type PracticeSessionAvgAggregateOutputType = {
    overallScaledScore: number | null
  }

  export type PracticeSessionSumAggregateOutputType = {
    overallScaledScore: number | null
  }

  export type PracticeSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    testId: string | null
    status: $Enums.SessionStatus | null
    createdAt: Date | null
    completedAt: Date | null
    overallScaledScore: number | null
  }

  export type PracticeSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    testId: string | null
    status: $Enums.SessionStatus | null
    createdAt: Date | null
    completedAt: Date | null
    overallScaledScore: number | null
  }

  export type PracticeSessionCountAggregateOutputType = {
    id: number
    userId: number
    testId: number
    selectedSections: number
    status: number
    createdAt: number
    completedAt: number
    overallScaledScore: number
    rawScoresBySkill: number
    scoresBySkill: number
    _all: number
  }


  export type PracticeSessionAvgAggregateInputType = {
    overallScaledScore?: true
  }

  export type PracticeSessionSumAggregateInputType = {
    overallScaledScore?: true
  }

  export type PracticeSessionMinAggregateInputType = {
    id?: true
    userId?: true
    testId?: true
    status?: true
    createdAt?: true
    completedAt?: true
    overallScaledScore?: true
  }

  export type PracticeSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    testId?: true
    status?: true
    createdAt?: true
    completedAt?: true
    overallScaledScore?: true
  }

  export type PracticeSessionCountAggregateInputType = {
    id?: true
    userId?: true
    testId?: true
    selectedSections?: true
    status?: true
    createdAt?: true
    completedAt?: true
    overallScaledScore?: true
    rawScoresBySkill?: true
    scoresBySkill?: true
    _all?: true
  }

  export type PracticeSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PracticeSession to aggregate.
     */
    where?: PracticeSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PracticeSessions to fetch.
     */
    orderBy?: PracticeSessionOrderByWithRelationInput | PracticeSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PracticeSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PracticeSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PracticeSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PracticeSessions
    **/
    _count?: true | PracticeSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PracticeSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PracticeSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PracticeSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PracticeSessionMaxAggregateInputType
  }

  export type GetPracticeSessionAggregateType<T extends PracticeSessionAggregateArgs> = {
        [P in keyof T & keyof AggregatePracticeSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePracticeSession[P]>
      : GetScalarType<T[P], AggregatePracticeSession[P]>
  }




  export type PracticeSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PracticeSessionWhereInput
    orderBy?: PracticeSessionOrderByWithAggregationInput | PracticeSessionOrderByWithAggregationInput[]
    by: PracticeSessionScalarFieldEnum[] | PracticeSessionScalarFieldEnum
    having?: PracticeSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PracticeSessionCountAggregateInputType | true
    _avg?: PracticeSessionAvgAggregateInputType
    _sum?: PracticeSessionSumAggregateInputType
    _min?: PracticeSessionMinAggregateInputType
    _max?: PracticeSessionMaxAggregateInputType
  }

  export type PracticeSessionGroupByOutputType = {
    id: string
    userId: string
    testId: string
    selectedSections: string[]
    status: $Enums.SessionStatus
    createdAt: Date
    completedAt: Date | null
    overallScaledScore: number | null
    rawScoresBySkill: JsonValue | null
    scoresBySkill: JsonValue | null
    _count: PracticeSessionCountAggregateOutputType | null
    _avg: PracticeSessionAvgAggregateOutputType | null
    _sum: PracticeSessionSumAggregateOutputType | null
    _min: PracticeSessionMinAggregateOutputType | null
    _max: PracticeSessionMaxAggregateOutputType | null
  }

  type GetPracticeSessionGroupByPayload<T extends PracticeSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PracticeSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PracticeSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PracticeSessionGroupByOutputType[P]>
            : GetScalarType<T[P], PracticeSessionGroupByOutputType[P]>
        }
      >
    >


  export type PracticeSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    testId?: boolean
    selectedSections?: boolean
    status?: boolean
    createdAt?: boolean
    completedAt?: boolean
    overallScaledScore?: boolean
    rawScoresBySkill?: boolean
    scoresBySkill?: boolean
    test?: boolean | TestDefaultArgs<ExtArgs>
    userAnswers?: boolean | PracticeSession$userAnswersArgs<ExtArgs>
    _count?: boolean | PracticeSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practiceSession"]>

  export type PracticeSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    testId?: boolean
    selectedSections?: boolean
    status?: boolean
    createdAt?: boolean
    completedAt?: boolean
    overallScaledScore?: boolean
    rawScoresBySkill?: boolean
    scoresBySkill?: boolean
    test?: boolean | TestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practiceSession"]>

  export type PracticeSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    testId?: boolean
    selectedSections?: boolean
    status?: boolean
    createdAt?: boolean
    completedAt?: boolean
    overallScaledScore?: boolean
    rawScoresBySkill?: boolean
    scoresBySkill?: boolean
    test?: boolean | TestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["practiceSession"]>

  export type PracticeSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    testId?: boolean
    selectedSections?: boolean
    status?: boolean
    createdAt?: boolean
    completedAt?: boolean
    overallScaledScore?: boolean
    rawScoresBySkill?: boolean
    scoresBySkill?: boolean
  }

  export type PracticeSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "testId" | "selectedSections" | "status" | "createdAt" | "completedAt" | "overallScaledScore" | "rawScoresBySkill" | "scoresBySkill", ExtArgs["result"]["practiceSession"]>
  export type PracticeSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | TestDefaultArgs<ExtArgs>
    userAnswers?: boolean | PracticeSession$userAnswersArgs<ExtArgs>
    _count?: boolean | PracticeSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PracticeSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | TestDefaultArgs<ExtArgs>
  }
  export type PracticeSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | TestDefaultArgs<ExtArgs>
  }

  export type $PracticeSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PracticeSession"
    objects: {
      test: Prisma.$TestPayload<ExtArgs>
      userAnswers: Prisma.$UserAnswerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      testId: string
      selectedSections: string[]
      status: $Enums.SessionStatus
      createdAt: Date
      completedAt: Date | null
      overallScaledScore: number | null
      rawScoresBySkill: Prisma.JsonValue | null
      scoresBySkill: Prisma.JsonValue | null
    }, ExtArgs["result"]["practiceSession"]>
    composites: {}
  }

  type PracticeSessionGetPayload<S extends boolean | null | undefined | PracticeSessionDefaultArgs> = $Result.GetResult<Prisma.$PracticeSessionPayload, S>

  type PracticeSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PracticeSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PracticeSessionCountAggregateInputType | true
    }

  export interface PracticeSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PracticeSession'], meta: { name: 'PracticeSession' } }
    /**
     * Find zero or one PracticeSession that matches the filter.
     * @param {PracticeSessionFindUniqueArgs} args - Arguments to find a PracticeSession
     * @example
     * // Get one PracticeSession
     * const practiceSession = await prisma.practiceSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PracticeSessionFindUniqueArgs>(args: SelectSubset<T, PracticeSessionFindUniqueArgs<ExtArgs>>): Prisma__PracticeSessionClient<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PracticeSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PracticeSessionFindUniqueOrThrowArgs} args - Arguments to find a PracticeSession
     * @example
     * // Get one PracticeSession
     * const practiceSession = await prisma.practiceSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PracticeSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, PracticeSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PracticeSessionClient<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PracticeSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeSessionFindFirstArgs} args - Arguments to find a PracticeSession
     * @example
     * // Get one PracticeSession
     * const practiceSession = await prisma.practiceSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PracticeSessionFindFirstArgs>(args?: SelectSubset<T, PracticeSessionFindFirstArgs<ExtArgs>>): Prisma__PracticeSessionClient<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PracticeSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeSessionFindFirstOrThrowArgs} args - Arguments to find a PracticeSession
     * @example
     * // Get one PracticeSession
     * const practiceSession = await prisma.practiceSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PracticeSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, PracticeSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PracticeSessionClient<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PracticeSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PracticeSessions
     * const practiceSessions = await prisma.practiceSession.findMany()
     * 
     * // Get first 10 PracticeSessions
     * const practiceSessions = await prisma.practiceSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const practiceSessionWithIdOnly = await prisma.practiceSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PracticeSessionFindManyArgs>(args?: SelectSubset<T, PracticeSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PracticeSession.
     * @param {PracticeSessionCreateArgs} args - Arguments to create a PracticeSession.
     * @example
     * // Create one PracticeSession
     * const PracticeSession = await prisma.practiceSession.create({
     *   data: {
     *     // ... data to create a PracticeSession
     *   }
     * })
     * 
     */
    create<T extends PracticeSessionCreateArgs>(args: SelectSubset<T, PracticeSessionCreateArgs<ExtArgs>>): Prisma__PracticeSessionClient<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PracticeSessions.
     * @param {PracticeSessionCreateManyArgs} args - Arguments to create many PracticeSessions.
     * @example
     * // Create many PracticeSessions
     * const practiceSession = await prisma.practiceSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PracticeSessionCreateManyArgs>(args?: SelectSubset<T, PracticeSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PracticeSessions and returns the data saved in the database.
     * @param {PracticeSessionCreateManyAndReturnArgs} args - Arguments to create many PracticeSessions.
     * @example
     * // Create many PracticeSessions
     * const practiceSession = await prisma.practiceSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PracticeSessions and only return the `id`
     * const practiceSessionWithIdOnly = await prisma.practiceSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PracticeSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, PracticeSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PracticeSession.
     * @param {PracticeSessionDeleteArgs} args - Arguments to delete one PracticeSession.
     * @example
     * // Delete one PracticeSession
     * const PracticeSession = await prisma.practiceSession.delete({
     *   where: {
     *     // ... filter to delete one PracticeSession
     *   }
     * })
     * 
     */
    delete<T extends PracticeSessionDeleteArgs>(args: SelectSubset<T, PracticeSessionDeleteArgs<ExtArgs>>): Prisma__PracticeSessionClient<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PracticeSession.
     * @param {PracticeSessionUpdateArgs} args - Arguments to update one PracticeSession.
     * @example
     * // Update one PracticeSession
     * const practiceSession = await prisma.practiceSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PracticeSessionUpdateArgs>(args: SelectSubset<T, PracticeSessionUpdateArgs<ExtArgs>>): Prisma__PracticeSessionClient<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PracticeSessions.
     * @param {PracticeSessionDeleteManyArgs} args - Arguments to filter PracticeSessions to delete.
     * @example
     * // Delete a few PracticeSessions
     * const { count } = await prisma.practiceSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PracticeSessionDeleteManyArgs>(args?: SelectSubset<T, PracticeSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PracticeSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PracticeSessions
     * const practiceSession = await prisma.practiceSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PracticeSessionUpdateManyArgs>(args: SelectSubset<T, PracticeSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PracticeSessions and returns the data updated in the database.
     * @param {PracticeSessionUpdateManyAndReturnArgs} args - Arguments to update many PracticeSessions.
     * @example
     * // Update many PracticeSessions
     * const practiceSession = await prisma.practiceSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PracticeSessions and only return the `id`
     * const practiceSessionWithIdOnly = await prisma.practiceSession.updateManyAndReturn({
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
    updateManyAndReturn<T extends PracticeSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, PracticeSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PracticeSession.
     * @param {PracticeSessionUpsertArgs} args - Arguments to update or create a PracticeSession.
     * @example
     * // Update or create a PracticeSession
     * const practiceSession = await prisma.practiceSession.upsert({
     *   create: {
     *     // ... data to create a PracticeSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PracticeSession we want to update
     *   }
     * })
     */
    upsert<T extends PracticeSessionUpsertArgs>(args: SelectSubset<T, PracticeSessionUpsertArgs<ExtArgs>>): Prisma__PracticeSessionClient<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PracticeSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeSessionCountArgs} args - Arguments to filter PracticeSessions to count.
     * @example
     * // Count the number of PracticeSessions
     * const count = await prisma.practiceSession.count({
     *   where: {
     *     // ... the filter for the PracticeSessions we want to count
     *   }
     * })
    **/
    count<T extends PracticeSessionCountArgs>(
      args?: Subset<T, PracticeSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PracticeSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PracticeSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PracticeSessionAggregateArgs>(args: Subset<T, PracticeSessionAggregateArgs>): Prisma.PrismaPromise<GetPracticeSessionAggregateType<T>>

    /**
     * Group by PracticeSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PracticeSessionGroupByArgs} args - Group by arguments.
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
      T extends PracticeSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PracticeSessionGroupByArgs['orderBy'] }
        : { orderBy?: PracticeSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PracticeSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPracticeSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PracticeSession model
   */
  readonly fields: PracticeSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PracticeSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PracticeSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    test<T extends TestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TestDefaultArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    userAnswers<T extends PracticeSession$userAnswersArgs<ExtArgs> = {}>(args?: Subset<T, PracticeSession$userAnswersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the PracticeSession model
   */
  interface PracticeSessionFieldRefs {
    readonly id: FieldRef<"PracticeSession", 'String'>
    readonly userId: FieldRef<"PracticeSession", 'String'>
    readonly testId: FieldRef<"PracticeSession", 'String'>
    readonly selectedSections: FieldRef<"PracticeSession", 'String[]'>
    readonly status: FieldRef<"PracticeSession", 'SessionStatus'>
    readonly createdAt: FieldRef<"PracticeSession", 'DateTime'>
    readonly completedAt: FieldRef<"PracticeSession", 'DateTime'>
    readonly overallScaledScore: FieldRef<"PracticeSession", 'Float'>
    readonly rawScoresBySkill: FieldRef<"PracticeSession", 'Json'>
    readonly scoresBySkill: FieldRef<"PracticeSession", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * PracticeSession findUnique
   */
  export type PracticeSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionInclude<ExtArgs> | null
    /**
     * Filter, which PracticeSession to fetch.
     */
    where: PracticeSessionWhereUniqueInput
  }

  /**
   * PracticeSession findUniqueOrThrow
   */
  export type PracticeSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionInclude<ExtArgs> | null
    /**
     * Filter, which PracticeSession to fetch.
     */
    where: PracticeSessionWhereUniqueInput
  }

  /**
   * PracticeSession findFirst
   */
  export type PracticeSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionInclude<ExtArgs> | null
    /**
     * Filter, which PracticeSession to fetch.
     */
    where?: PracticeSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PracticeSessions to fetch.
     */
    orderBy?: PracticeSessionOrderByWithRelationInput | PracticeSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PracticeSessions.
     */
    cursor?: PracticeSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PracticeSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PracticeSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PracticeSessions.
     */
    distinct?: PracticeSessionScalarFieldEnum | PracticeSessionScalarFieldEnum[]
  }

  /**
   * PracticeSession findFirstOrThrow
   */
  export type PracticeSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionInclude<ExtArgs> | null
    /**
     * Filter, which PracticeSession to fetch.
     */
    where?: PracticeSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PracticeSessions to fetch.
     */
    orderBy?: PracticeSessionOrderByWithRelationInput | PracticeSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PracticeSessions.
     */
    cursor?: PracticeSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PracticeSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PracticeSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PracticeSessions.
     */
    distinct?: PracticeSessionScalarFieldEnum | PracticeSessionScalarFieldEnum[]
  }

  /**
   * PracticeSession findMany
   */
  export type PracticeSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionInclude<ExtArgs> | null
    /**
     * Filter, which PracticeSessions to fetch.
     */
    where?: PracticeSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PracticeSessions to fetch.
     */
    orderBy?: PracticeSessionOrderByWithRelationInput | PracticeSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PracticeSessions.
     */
    cursor?: PracticeSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PracticeSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PracticeSessions.
     */
    skip?: number
    distinct?: PracticeSessionScalarFieldEnum | PracticeSessionScalarFieldEnum[]
  }

  /**
   * PracticeSession create
   */
  export type PracticeSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a PracticeSession.
     */
    data: XOR<PracticeSessionCreateInput, PracticeSessionUncheckedCreateInput>
  }

  /**
   * PracticeSession createMany
   */
  export type PracticeSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PracticeSessions.
     */
    data: PracticeSessionCreateManyInput | PracticeSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PracticeSession createManyAndReturn
   */
  export type PracticeSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * The data used to create many PracticeSessions.
     */
    data: PracticeSessionCreateManyInput | PracticeSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PracticeSession update
   */
  export type PracticeSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a PracticeSession.
     */
    data: XOR<PracticeSessionUpdateInput, PracticeSessionUncheckedUpdateInput>
    /**
     * Choose, which PracticeSession to update.
     */
    where: PracticeSessionWhereUniqueInput
  }

  /**
   * PracticeSession updateMany
   */
  export type PracticeSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PracticeSessions.
     */
    data: XOR<PracticeSessionUpdateManyMutationInput, PracticeSessionUncheckedUpdateManyInput>
    /**
     * Filter which PracticeSessions to update
     */
    where?: PracticeSessionWhereInput
    /**
     * Limit how many PracticeSessions to update.
     */
    limit?: number
  }

  /**
   * PracticeSession updateManyAndReturn
   */
  export type PracticeSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * The data used to update PracticeSessions.
     */
    data: XOR<PracticeSessionUpdateManyMutationInput, PracticeSessionUncheckedUpdateManyInput>
    /**
     * Filter which PracticeSessions to update
     */
    where?: PracticeSessionWhereInput
    /**
     * Limit how many PracticeSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PracticeSession upsert
   */
  export type PracticeSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the PracticeSession to update in case it exists.
     */
    where: PracticeSessionWhereUniqueInput
    /**
     * In case the PracticeSession found by the `where` argument doesn't exist, create a new PracticeSession with this data.
     */
    create: XOR<PracticeSessionCreateInput, PracticeSessionUncheckedCreateInput>
    /**
     * In case the PracticeSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PracticeSessionUpdateInput, PracticeSessionUncheckedUpdateInput>
  }

  /**
   * PracticeSession delete
   */
  export type PracticeSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionInclude<ExtArgs> | null
    /**
     * Filter which PracticeSession to delete.
     */
    where: PracticeSessionWhereUniqueInput
  }

  /**
   * PracticeSession deleteMany
   */
  export type PracticeSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PracticeSessions to delete
     */
    where?: PracticeSessionWhereInput
    /**
     * Limit how many PracticeSessions to delete.
     */
    limit?: number
  }

  /**
   * PracticeSession.userAnswers
   */
  export type PracticeSession$userAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerInclude<ExtArgs> | null
    where?: UserAnswerWhereInput
    orderBy?: UserAnswerOrderByWithRelationInput | UserAnswerOrderByWithRelationInput[]
    cursor?: UserAnswerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserAnswerScalarFieldEnum | UserAnswerScalarFieldEnum[]
  }

  /**
   * PracticeSession without action
   */
  export type PracticeSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PracticeSession
     */
    select?: PracticeSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PracticeSession
     */
    omit?: PracticeSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PracticeSessionInclude<ExtArgs> | null
  }


  /**
   * Model UserAnswer
   */

  export type AggregateUserAnswer = {
    _count: UserAnswerCountAggregateOutputType | null
    _avg: UserAnswerAvgAggregateOutputType | null
    _sum: UserAnswerSumAggregateOutputType | null
    _min: UserAnswerMinAggregateOutputType | null
    _max: UserAnswerMaxAggregateOutputType | null
  }

  export type UserAnswerAvgAggregateOutputType = {
    selectedOptionIndex: number | null
  }

  export type UserAnswerSumAggregateOutputType = {
    selectedOptionIndex: number | null
  }

  export type UserAnswerMinAggregateOutputType = {
    id: string | null
    practiceSessionId: string | null
    questionId: string | null
    userId: string | null
    answerText: string | null
    selectedOptionIndex: number | null
    isCorrect: boolean | null
  }

  export type UserAnswerMaxAggregateOutputType = {
    id: string | null
    practiceSessionId: string | null
    questionId: string | null
    userId: string | null
    answerText: string | null
    selectedOptionIndex: number | null
    isCorrect: boolean | null
  }

  export type UserAnswerCountAggregateOutputType = {
    id: number
    practiceSessionId: number
    questionId: number
    userId: number
    answerText: number
    selectedOptionIndex: number
    isCorrect: number
    _all: number
  }


  export type UserAnswerAvgAggregateInputType = {
    selectedOptionIndex?: true
  }

  export type UserAnswerSumAggregateInputType = {
    selectedOptionIndex?: true
  }

  export type UserAnswerMinAggregateInputType = {
    id?: true
    practiceSessionId?: true
    questionId?: true
    userId?: true
    answerText?: true
    selectedOptionIndex?: true
    isCorrect?: true
  }

  export type UserAnswerMaxAggregateInputType = {
    id?: true
    practiceSessionId?: true
    questionId?: true
    userId?: true
    answerText?: true
    selectedOptionIndex?: true
    isCorrect?: true
  }

  export type UserAnswerCountAggregateInputType = {
    id?: true
    practiceSessionId?: true
    questionId?: true
    userId?: true
    answerText?: true
    selectedOptionIndex?: true
    isCorrect?: true
    _all?: true
  }

  export type UserAnswerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAnswer to aggregate.
     */
    where?: UserAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAnswers to fetch.
     */
    orderBy?: UserAnswerOrderByWithRelationInput | UserAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserAnswers
    **/
    _count?: true | UserAnswerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAnswerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserAnswerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserAnswerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserAnswerMaxAggregateInputType
  }

  export type GetUserAnswerAggregateType<T extends UserAnswerAggregateArgs> = {
        [P in keyof T & keyof AggregateUserAnswer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserAnswer[P]>
      : GetScalarType<T[P], AggregateUserAnswer[P]>
  }




  export type UserAnswerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAnswerWhereInput
    orderBy?: UserAnswerOrderByWithAggregationInput | UserAnswerOrderByWithAggregationInput[]
    by: UserAnswerScalarFieldEnum[] | UserAnswerScalarFieldEnum
    having?: UserAnswerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserAnswerCountAggregateInputType | true
    _avg?: UserAnswerAvgAggregateInputType
    _sum?: UserAnswerSumAggregateInputType
    _min?: UserAnswerMinAggregateInputType
    _max?: UserAnswerMaxAggregateInputType
  }

  export type UserAnswerGroupByOutputType = {
    id: string
    practiceSessionId: string
    questionId: string
    userId: string
    answerText: string | null
    selectedOptionIndex: number | null
    isCorrect: boolean | null
    _count: UserAnswerCountAggregateOutputType | null
    _avg: UserAnswerAvgAggregateOutputType | null
    _sum: UserAnswerSumAggregateOutputType | null
    _min: UserAnswerMinAggregateOutputType | null
    _max: UserAnswerMaxAggregateOutputType | null
  }

  type GetUserAnswerGroupByPayload<T extends UserAnswerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserAnswerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserAnswerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserAnswerGroupByOutputType[P]>
            : GetScalarType<T[P], UserAnswerGroupByOutputType[P]>
        }
      >
    >


  export type UserAnswerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practiceSessionId?: boolean
    questionId?: boolean
    userId?: boolean
    answerText?: boolean
    selectedOptionIndex?: boolean
    isCorrect?: boolean
    practiceSession?: boolean | PracticeSessionDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAnswer"]>

  export type UserAnswerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practiceSessionId?: boolean
    questionId?: boolean
    userId?: boolean
    answerText?: boolean
    selectedOptionIndex?: boolean
    isCorrect?: boolean
    practiceSession?: boolean | PracticeSessionDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAnswer"]>

  export type UserAnswerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    practiceSessionId?: boolean
    questionId?: boolean
    userId?: boolean
    answerText?: boolean
    selectedOptionIndex?: boolean
    isCorrect?: boolean
    practiceSession?: boolean | PracticeSessionDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAnswer"]>

  export type UserAnswerSelectScalar = {
    id?: boolean
    practiceSessionId?: boolean
    questionId?: boolean
    userId?: boolean
    answerText?: boolean
    selectedOptionIndex?: boolean
    isCorrect?: boolean
  }

  export type UserAnswerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "practiceSessionId" | "questionId" | "userId" | "answerText" | "selectedOptionIndex" | "isCorrect", ExtArgs["result"]["userAnswer"]>
  export type UserAnswerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    practiceSession?: boolean | PracticeSessionDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }
  export type UserAnswerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    practiceSession?: boolean | PracticeSessionDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }
  export type UserAnswerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    practiceSession?: boolean | PracticeSessionDefaultArgs<ExtArgs>
    question?: boolean | QuestionDefaultArgs<ExtArgs>
  }

  export type $UserAnswerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserAnswer"
    objects: {
      practiceSession: Prisma.$PracticeSessionPayload<ExtArgs>
      question: Prisma.$QuestionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      practiceSessionId: string
      questionId: string
      userId: string
      answerText: string | null
      selectedOptionIndex: number | null
      isCorrect: boolean | null
    }, ExtArgs["result"]["userAnswer"]>
    composites: {}
  }

  type UserAnswerGetPayload<S extends boolean | null | undefined | UserAnswerDefaultArgs> = $Result.GetResult<Prisma.$UserAnswerPayload, S>

  type UserAnswerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserAnswerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserAnswerCountAggregateInputType | true
    }

  export interface UserAnswerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserAnswer'], meta: { name: 'UserAnswer' } }
    /**
     * Find zero or one UserAnswer that matches the filter.
     * @param {UserAnswerFindUniqueArgs} args - Arguments to find a UserAnswer
     * @example
     * // Get one UserAnswer
     * const userAnswer = await prisma.userAnswer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserAnswerFindUniqueArgs>(args: SelectSubset<T, UserAnswerFindUniqueArgs<ExtArgs>>): Prisma__UserAnswerClient<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserAnswer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserAnswerFindUniqueOrThrowArgs} args - Arguments to find a UserAnswer
     * @example
     * // Get one UserAnswer
     * const userAnswer = await prisma.userAnswer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserAnswerFindUniqueOrThrowArgs>(args: SelectSubset<T, UserAnswerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserAnswerClient<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAnswer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnswerFindFirstArgs} args - Arguments to find a UserAnswer
     * @example
     * // Get one UserAnswer
     * const userAnswer = await prisma.userAnswer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserAnswerFindFirstArgs>(args?: SelectSubset<T, UserAnswerFindFirstArgs<ExtArgs>>): Prisma__UserAnswerClient<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAnswer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnswerFindFirstOrThrowArgs} args - Arguments to find a UserAnswer
     * @example
     * // Get one UserAnswer
     * const userAnswer = await prisma.userAnswer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserAnswerFindFirstOrThrowArgs>(args?: SelectSubset<T, UserAnswerFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserAnswerClient<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserAnswers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnswerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserAnswers
     * const userAnswers = await prisma.userAnswer.findMany()
     * 
     * // Get first 10 UserAnswers
     * const userAnswers = await prisma.userAnswer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userAnswerWithIdOnly = await prisma.userAnswer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserAnswerFindManyArgs>(args?: SelectSubset<T, UserAnswerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserAnswer.
     * @param {UserAnswerCreateArgs} args - Arguments to create a UserAnswer.
     * @example
     * // Create one UserAnswer
     * const UserAnswer = await prisma.userAnswer.create({
     *   data: {
     *     // ... data to create a UserAnswer
     *   }
     * })
     * 
     */
    create<T extends UserAnswerCreateArgs>(args: SelectSubset<T, UserAnswerCreateArgs<ExtArgs>>): Prisma__UserAnswerClient<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserAnswers.
     * @param {UserAnswerCreateManyArgs} args - Arguments to create many UserAnswers.
     * @example
     * // Create many UserAnswers
     * const userAnswer = await prisma.userAnswer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserAnswerCreateManyArgs>(args?: SelectSubset<T, UserAnswerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserAnswers and returns the data saved in the database.
     * @param {UserAnswerCreateManyAndReturnArgs} args - Arguments to create many UserAnswers.
     * @example
     * // Create many UserAnswers
     * const userAnswer = await prisma.userAnswer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserAnswers and only return the `id`
     * const userAnswerWithIdOnly = await prisma.userAnswer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserAnswerCreateManyAndReturnArgs>(args?: SelectSubset<T, UserAnswerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserAnswer.
     * @param {UserAnswerDeleteArgs} args - Arguments to delete one UserAnswer.
     * @example
     * // Delete one UserAnswer
     * const UserAnswer = await prisma.userAnswer.delete({
     *   where: {
     *     // ... filter to delete one UserAnswer
     *   }
     * })
     * 
     */
    delete<T extends UserAnswerDeleteArgs>(args: SelectSubset<T, UserAnswerDeleteArgs<ExtArgs>>): Prisma__UserAnswerClient<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserAnswer.
     * @param {UserAnswerUpdateArgs} args - Arguments to update one UserAnswer.
     * @example
     * // Update one UserAnswer
     * const userAnswer = await prisma.userAnswer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserAnswerUpdateArgs>(args: SelectSubset<T, UserAnswerUpdateArgs<ExtArgs>>): Prisma__UserAnswerClient<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserAnswers.
     * @param {UserAnswerDeleteManyArgs} args - Arguments to filter UserAnswers to delete.
     * @example
     * // Delete a few UserAnswers
     * const { count } = await prisma.userAnswer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserAnswerDeleteManyArgs>(args?: SelectSubset<T, UserAnswerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAnswers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnswerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserAnswers
     * const userAnswer = await prisma.userAnswer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserAnswerUpdateManyArgs>(args: SelectSubset<T, UserAnswerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAnswers and returns the data updated in the database.
     * @param {UserAnswerUpdateManyAndReturnArgs} args - Arguments to update many UserAnswers.
     * @example
     * // Update many UserAnswers
     * const userAnswer = await prisma.userAnswer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserAnswers and only return the `id`
     * const userAnswerWithIdOnly = await prisma.userAnswer.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserAnswerUpdateManyAndReturnArgs>(args: SelectSubset<T, UserAnswerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserAnswer.
     * @param {UserAnswerUpsertArgs} args - Arguments to update or create a UserAnswer.
     * @example
     * // Update or create a UserAnswer
     * const userAnswer = await prisma.userAnswer.upsert({
     *   create: {
     *     // ... data to create a UserAnswer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserAnswer we want to update
     *   }
     * })
     */
    upsert<T extends UserAnswerUpsertArgs>(args: SelectSubset<T, UserAnswerUpsertArgs<ExtArgs>>): Prisma__UserAnswerClient<$Result.GetResult<Prisma.$UserAnswerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserAnswers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnswerCountArgs} args - Arguments to filter UserAnswers to count.
     * @example
     * // Count the number of UserAnswers
     * const count = await prisma.userAnswer.count({
     *   where: {
     *     // ... the filter for the UserAnswers we want to count
     *   }
     * })
    **/
    count<T extends UserAnswerCountArgs>(
      args?: Subset<T, UserAnswerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserAnswerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserAnswer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnswerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAnswerAggregateArgs>(args: Subset<T, UserAnswerAggregateArgs>): Prisma.PrismaPromise<GetUserAnswerAggregateType<T>>

    /**
     * Group by UserAnswer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAnswerGroupByArgs} args - Group by arguments.
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
      T extends UserAnswerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserAnswerGroupByArgs['orderBy'] }
        : { orderBy?: UserAnswerGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserAnswerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserAnswerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserAnswer model
   */
  readonly fields: UserAnswerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserAnswer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserAnswerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    practiceSession<T extends PracticeSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PracticeSessionDefaultArgs<ExtArgs>>): Prisma__PracticeSessionClient<$Result.GetResult<Prisma.$PracticeSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    question<T extends QuestionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, QuestionDefaultArgs<ExtArgs>>): Prisma__QuestionClient<$Result.GetResult<Prisma.$QuestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the UserAnswer model
   */
  interface UserAnswerFieldRefs {
    readonly id: FieldRef<"UserAnswer", 'String'>
    readonly practiceSessionId: FieldRef<"UserAnswer", 'String'>
    readonly questionId: FieldRef<"UserAnswer", 'String'>
    readonly userId: FieldRef<"UserAnswer", 'String'>
    readonly answerText: FieldRef<"UserAnswer", 'String'>
    readonly selectedOptionIndex: FieldRef<"UserAnswer", 'Int'>
    readonly isCorrect: FieldRef<"UserAnswer", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * UserAnswer findUnique
   */
  export type UserAnswerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerInclude<ExtArgs> | null
    /**
     * Filter, which UserAnswer to fetch.
     */
    where: UserAnswerWhereUniqueInput
  }

  /**
   * UserAnswer findUniqueOrThrow
   */
  export type UserAnswerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerInclude<ExtArgs> | null
    /**
     * Filter, which UserAnswer to fetch.
     */
    where: UserAnswerWhereUniqueInput
  }

  /**
   * UserAnswer findFirst
   */
  export type UserAnswerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerInclude<ExtArgs> | null
    /**
     * Filter, which UserAnswer to fetch.
     */
    where?: UserAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAnswers to fetch.
     */
    orderBy?: UserAnswerOrderByWithRelationInput | UserAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAnswers.
     */
    cursor?: UserAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAnswers.
     */
    distinct?: UserAnswerScalarFieldEnum | UserAnswerScalarFieldEnum[]
  }

  /**
   * UserAnswer findFirstOrThrow
   */
  export type UserAnswerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerInclude<ExtArgs> | null
    /**
     * Filter, which UserAnswer to fetch.
     */
    where?: UserAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAnswers to fetch.
     */
    orderBy?: UserAnswerOrderByWithRelationInput | UserAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAnswers.
     */
    cursor?: UserAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAnswers.
     */
    distinct?: UserAnswerScalarFieldEnum | UserAnswerScalarFieldEnum[]
  }

  /**
   * UserAnswer findMany
   */
  export type UserAnswerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerInclude<ExtArgs> | null
    /**
     * Filter, which UserAnswers to fetch.
     */
    where?: UserAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAnswers to fetch.
     */
    orderBy?: UserAnswerOrderByWithRelationInput | UserAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserAnswers.
     */
    cursor?: UserAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAnswers.
     */
    skip?: number
    distinct?: UserAnswerScalarFieldEnum | UserAnswerScalarFieldEnum[]
  }

  /**
   * UserAnswer create
   */
  export type UserAnswerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerInclude<ExtArgs> | null
    /**
     * The data needed to create a UserAnswer.
     */
    data: XOR<UserAnswerCreateInput, UserAnswerUncheckedCreateInput>
  }

  /**
   * UserAnswer createMany
   */
  export type UserAnswerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserAnswers.
     */
    data: UserAnswerCreateManyInput | UserAnswerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserAnswer createManyAndReturn
   */
  export type UserAnswerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * The data used to create many UserAnswers.
     */
    data: UserAnswerCreateManyInput | UserAnswerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserAnswer update
   */
  export type UserAnswerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerInclude<ExtArgs> | null
    /**
     * The data needed to update a UserAnswer.
     */
    data: XOR<UserAnswerUpdateInput, UserAnswerUncheckedUpdateInput>
    /**
     * Choose, which UserAnswer to update.
     */
    where: UserAnswerWhereUniqueInput
  }

  /**
   * UserAnswer updateMany
   */
  export type UserAnswerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserAnswers.
     */
    data: XOR<UserAnswerUpdateManyMutationInput, UserAnswerUncheckedUpdateManyInput>
    /**
     * Filter which UserAnswers to update
     */
    where?: UserAnswerWhereInput
    /**
     * Limit how many UserAnswers to update.
     */
    limit?: number
  }

  /**
   * UserAnswer updateManyAndReturn
   */
  export type UserAnswerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * The data used to update UserAnswers.
     */
    data: XOR<UserAnswerUpdateManyMutationInput, UserAnswerUncheckedUpdateManyInput>
    /**
     * Filter which UserAnswers to update
     */
    where?: UserAnswerWhereInput
    /**
     * Limit how many UserAnswers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserAnswer upsert
   */
  export type UserAnswerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerInclude<ExtArgs> | null
    /**
     * The filter to search for the UserAnswer to update in case it exists.
     */
    where: UserAnswerWhereUniqueInput
    /**
     * In case the UserAnswer found by the `where` argument doesn't exist, create a new UserAnswer with this data.
     */
    create: XOR<UserAnswerCreateInput, UserAnswerUncheckedCreateInput>
    /**
     * In case the UserAnswer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserAnswerUpdateInput, UserAnswerUncheckedUpdateInput>
  }

  /**
   * UserAnswer delete
   */
  export type UserAnswerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerInclude<ExtArgs> | null
    /**
     * Filter which UserAnswer to delete.
     */
    where: UserAnswerWhereUniqueInput
  }

  /**
   * UserAnswer deleteMany
   */
  export type UserAnswerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAnswers to delete
     */
    where?: UserAnswerWhereInput
    /**
     * Limit how many UserAnswers to delete.
     */
    limit?: number
  }

  /**
   * UserAnswer without action
   */
  export type UserAnswerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAnswer
     */
    select?: UserAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAnswer
     */
    omit?: UserAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAnswerInclude<ExtArgs> | null
  }


  /**
   * Model ScoreConversion
   */

  export type AggregateScoreConversion = {
    _count: ScoreConversionCountAggregateOutputType | null
    _avg: ScoreConversionAvgAggregateOutputType | null
    _sum: ScoreConversionSumAggregateOutputType | null
    _min: ScoreConversionMinAggregateOutputType | null
    _max: ScoreConversionMaxAggregateOutputType | null
  }

  export type ScoreConversionAvgAggregateOutputType = {
    rawScore: number | null
    scaledScore: number | null
  }

  export type ScoreConversionSumAggregateOutputType = {
    rawScore: number | null
    scaledScore: number | null
  }

  export type ScoreConversionMinAggregateOutputType = {
    id: string | null
    englishTestTypeId: string | null
    skill: $Enums.SkillType | null
    rawScore: number | null
    scaledScore: number | null
  }

  export type ScoreConversionMaxAggregateOutputType = {
    id: string | null
    englishTestTypeId: string | null
    skill: $Enums.SkillType | null
    rawScore: number | null
    scaledScore: number | null
  }

  export type ScoreConversionCountAggregateOutputType = {
    id: number
    englishTestTypeId: number
    skill: number
    rawScore: number
    scaledScore: number
    _all: number
  }


  export type ScoreConversionAvgAggregateInputType = {
    rawScore?: true
    scaledScore?: true
  }

  export type ScoreConversionSumAggregateInputType = {
    rawScore?: true
    scaledScore?: true
  }

  export type ScoreConversionMinAggregateInputType = {
    id?: true
    englishTestTypeId?: true
    skill?: true
    rawScore?: true
    scaledScore?: true
  }

  export type ScoreConversionMaxAggregateInputType = {
    id?: true
    englishTestTypeId?: true
    skill?: true
    rawScore?: true
    scaledScore?: true
  }

  export type ScoreConversionCountAggregateInputType = {
    id?: true
    englishTestTypeId?: true
    skill?: true
    rawScore?: true
    scaledScore?: true
    _all?: true
  }

  export type ScoreConversionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScoreConversion to aggregate.
     */
    where?: ScoreConversionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScoreConversions to fetch.
     */
    orderBy?: ScoreConversionOrderByWithRelationInput | ScoreConversionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScoreConversionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScoreConversions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScoreConversions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScoreConversions
    **/
    _count?: true | ScoreConversionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScoreConversionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScoreConversionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScoreConversionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScoreConversionMaxAggregateInputType
  }

  export type GetScoreConversionAggregateType<T extends ScoreConversionAggregateArgs> = {
        [P in keyof T & keyof AggregateScoreConversion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScoreConversion[P]>
      : GetScalarType<T[P], AggregateScoreConversion[P]>
  }




  export type ScoreConversionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScoreConversionWhereInput
    orderBy?: ScoreConversionOrderByWithAggregationInput | ScoreConversionOrderByWithAggregationInput[]
    by: ScoreConversionScalarFieldEnum[] | ScoreConversionScalarFieldEnum
    having?: ScoreConversionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScoreConversionCountAggregateInputType | true
    _avg?: ScoreConversionAvgAggregateInputType
    _sum?: ScoreConversionSumAggregateInputType
    _min?: ScoreConversionMinAggregateInputType
    _max?: ScoreConversionMaxAggregateInputType
  }

  export type ScoreConversionGroupByOutputType = {
    id: string
    englishTestTypeId: string
    skill: $Enums.SkillType
    rawScore: number
    scaledScore: number
    _count: ScoreConversionCountAggregateOutputType | null
    _avg: ScoreConversionAvgAggregateOutputType | null
    _sum: ScoreConversionSumAggregateOutputType | null
    _min: ScoreConversionMinAggregateOutputType | null
    _max: ScoreConversionMaxAggregateOutputType | null
  }

  type GetScoreConversionGroupByPayload<T extends ScoreConversionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScoreConversionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScoreConversionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScoreConversionGroupByOutputType[P]>
            : GetScalarType<T[P], ScoreConversionGroupByOutputType[P]>
        }
      >
    >


  export type ScoreConversionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    englishTestTypeId?: boolean
    skill?: boolean
    rawScore?: boolean
    scaledScore?: boolean
    englishTestType?: boolean | EnglishTestTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scoreConversion"]>

  export type ScoreConversionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    englishTestTypeId?: boolean
    skill?: boolean
    rawScore?: boolean
    scaledScore?: boolean
    englishTestType?: boolean | EnglishTestTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scoreConversion"]>

  export type ScoreConversionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    englishTestTypeId?: boolean
    skill?: boolean
    rawScore?: boolean
    scaledScore?: boolean
    englishTestType?: boolean | EnglishTestTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scoreConversion"]>

  export type ScoreConversionSelectScalar = {
    id?: boolean
    englishTestTypeId?: boolean
    skill?: boolean
    rawScore?: boolean
    scaledScore?: boolean
  }

  export type ScoreConversionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "englishTestTypeId" | "skill" | "rawScore" | "scaledScore", ExtArgs["result"]["scoreConversion"]>
  export type ScoreConversionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    englishTestType?: boolean | EnglishTestTypeDefaultArgs<ExtArgs>
  }
  export type ScoreConversionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    englishTestType?: boolean | EnglishTestTypeDefaultArgs<ExtArgs>
  }
  export type ScoreConversionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    englishTestType?: boolean | EnglishTestTypeDefaultArgs<ExtArgs>
  }

  export type $ScoreConversionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScoreConversion"
    objects: {
      englishTestType: Prisma.$EnglishTestTypePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      englishTestTypeId: string
      skill: $Enums.SkillType
      rawScore: number
      scaledScore: number
    }, ExtArgs["result"]["scoreConversion"]>
    composites: {}
  }

  type ScoreConversionGetPayload<S extends boolean | null | undefined | ScoreConversionDefaultArgs> = $Result.GetResult<Prisma.$ScoreConversionPayload, S>

  type ScoreConversionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScoreConversionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScoreConversionCountAggregateInputType | true
    }

  export interface ScoreConversionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScoreConversion'], meta: { name: 'ScoreConversion' } }
    /**
     * Find zero or one ScoreConversion that matches the filter.
     * @param {ScoreConversionFindUniqueArgs} args - Arguments to find a ScoreConversion
     * @example
     * // Get one ScoreConversion
     * const scoreConversion = await prisma.scoreConversion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScoreConversionFindUniqueArgs>(args: SelectSubset<T, ScoreConversionFindUniqueArgs<ExtArgs>>): Prisma__ScoreConversionClient<$Result.GetResult<Prisma.$ScoreConversionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ScoreConversion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScoreConversionFindUniqueOrThrowArgs} args - Arguments to find a ScoreConversion
     * @example
     * // Get one ScoreConversion
     * const scoreConversion = await prisma.scoreConversion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScoreConversionFindUniqueOrThrowArgs>(args: SelectSubset<T, ScoreConversionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScoreConversionClient<$Result.GetResult<Prisma.$ScoreConversionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScoreConversion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreConversionFindFirstArgs} args - Arguments to find a ScoreConversion
     * @example
     * // Get one ScoreConversion
     * const scoreConversion = await prisma.scoreConversion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScoreConversionFindFirstArgs>(args?: SelectSubset<T, ScoreConversionFindFirstArgs<ExtArgs>>): Prisma__ScoreConversionClient<$Result.GetResult<Prisma.$ScoreConversionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScoreConversion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreConversionFindFirstOrThrowArgs} args - Arguments to find a ScoreConversion
     * @example
     * // Get one ScoreConversion
     * const scoreConversion = await prisma.scoreConversion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScoreConversionFindFirstOrThrowArgs>(args?: SelectSubset<T, ScoreConversionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScoreConversionClient<$Result.GetResult<Prisma.$ScoreConversionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScoreConversions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreConversionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScoreConversions
     * const scoreConversions = await prisma.scoreConversion.findMany()
     * 
     * // Get first 10 ScoreConversions
     * const scoreConversions = await prisma.scoreConversion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scoreConversionWithIdOnly = await prisma.scoreConversion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScoreConversionFindManyArgs>(args?: SelectSubset<T, ScoreConversionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScoreConversionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ScoreConversion.
     * @param {ScoreConversionCreateArgs} args - Arguments to create a ScoreConversion.
     * @example
     * // Create one ScoreConversion
     * const ScoreConversion = await prisma.scoreConversion.create({
     *   data: {
     *     // ... data to create a ScoreConversion
     *   }
     * })
     * 
     */
    create<T extends ScoreConversionCreateArgs>(args: SelectSubset<T, ScoreConversionCreateArgs<ExtArgs>>): Prisma__ScoreConversionClient<$Result.GetResult<Prisma.$ScoreConversionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ScoreConversions.
     * @param {ScoreConversionCreateManyArgs} args - Arguments to create many ScoreConversions.
     * @example
     * // Create many ScoreConversions
     * const scoreConversion = await prisma.scoreConversion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScoreConversionCreateManyArgs>(args?: SelectSubset<T, ScoreConversionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ScoreConversions and returns the data saved in the database.
     * @param {ScoreConversionCreateManyAndReturnArgs} args - Arguments to create many ScoreConversions.
     * @example
     * // Create many ScoreConversions
     * const scoreConversion = await prisma.scoreConversion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ScoreConversions and only return the `id`
     * const scoreConversionWithIdOnly = await prisma.scoreConversion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScoreConversionCreateManyAndReturnArgs>(args?: SelectSubset<T, ScoreConversionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScoreConversionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ScoreConversion.
     * @param {ScoreConversionDeleteArgs} args - Arguments to delete one ScoreConversion.
     * @example
     * // Delete one ScoreConversion
     * const ScoreConversion = await prisma.scoreConversion.delete({
     *   where: {
     *     // ... filter to delete one ScoreConversion
     *   }
     * })
     * 
     */
    delete<T extends ScoreConversionDeleteArgs>(args: SelectSubset<T, ScoreConversionDeleteArgs<ExtArgs>>): Prisma__ScoreConversionClient<$Result.GetResult<Prisma.$ScoreConversionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ScoreConversion.
     * @param {ScoreConversionUpdateArgs} args - Arguments to update one ScoreConversion.
     * @example
     * // Update one ScoreConversion
     * const scoreConversion = await prisma.scoreConversion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScoreConversionUpdateArgs>(args: SelectSubset<T, ScoreConversionUpdateArgs<ExtArgs>>): Prisma__ScoreConversionClient<$Result.GetResult<Prisma.$ScoreConversionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ScoreConversions.
     * @param {ScoreConversionDeleteManyArgs} args - Arguments to filter ScoreConversions to delete.
     * @example
     * // Delete a few ScoreConversions
     * const { count } = await prisma.scoreConversion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScoreConversionDeleteManyArgs>(args?: SelectSubset<T, ScoreConversionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScoreConversions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreConversionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScoreConversions
     * const scoreConversion = await prisma.scoreConversion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScoreConversionUpdateManyArgs>(args: SelectSubset<T, ScoreConversionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScoreConversions and returns the data updated in the database.
     * @param {ScoreConversionUpdateManyAndReturnArgs} args - Arguments to update many ScoreConversions.
     * @example
     * // Update many ScoreConversions
     * const scoreConversion = await prisma.scoreConversion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ScoreConversions and only return the `id`
     * const scoreConversionWithIdOnly = await prisma.scoreConversion.updateManyAndReturn({
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
    updateManyAndReturn<T extends ScoreConversionUpdateManyAndReturnArgs>(args: SelectSubset<T, ScoreConversionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScoreConversionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ScoreConversion.
     * @param {ScoreConversionUpsertArgs} args - Arguments to update or create a ScoreConversion.
     * @example
     * // Update or create a ScoreConversion
     * const scoreConversion = await prisma.scoreConversion.upsert({
     *   create: {
     *     // ... data to create a ScoreConversion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScoreConversion we want to update
     *   }
     * })
     */
    upsert<T extends ScoreConversionUpsertArgs>(args: SelectSubset<T, ScoreConversionUpsertArgs<ExtArgs>>): Prisma__ScoreConversionClient<$Result.GetResult<Prisma.$ScoreConversionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ScoreConversions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreConversionCountArgs} args - Arguments to filter ScoreConversions to count.
     * @example
     * // Count the number of ScoreConversions
     * const count = await prisma.scoreConversion.count({
     *   where: {
     *     // ... the filter for the ScoreConversions we want to count
     *   }
     * })
    **/
    count<T extends ScoreConversionCountArgs>(
      args?: Subset<T, ScoreConversionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScoreConversionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScoreConversion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreConversionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScoreConversionAggregateArgs>(args: Subset<T, ScoreConversionAggregateArgs>): Prisma.PrismaPromise<GetScoreConversionAggregateType<T>>

    /**
     * Group by ScoreConversion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreConversionGroupByArgs} args - Group by arguments.
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
      T extends ScoreConversionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScoreConversionGroupByArgs['orderBy'] }
        : { orderBy?: ScoreConversionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ScoreConversionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScoreConversionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScoreConversion model
   */
  readonly fields: ScoreConversionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScoreConversion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScoreConversionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    englishTestType<T extends EnglishTestTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EnglishTestTypeDefaultArgs<ExtArgs>>): Prisma__EnglishTestTypeClient<$Result.GetResult<Prisma.$EnglishTestTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ScoreConversion model
   */
  interface ScoreConversionFieldRefs {
    readonly id: FieldRef<"ScoreConversion", 'String'>
    readonly englishTestTypeId: FieldRef<"ScoreConversion", 'String'>
    readonly skill: FieldRef<"ScoreConversion", 'SkillType'>
    readonly rawScore: FieldRef<"ScoreConversion", 'Int'>
    readonly scaledScore: FieldRef<"ScoreConversion", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * ScoreConversion findUnique
   */
  export type ScoreConversionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionInclude<ExtArgs> | null
    /**
     * Filter, which ScoreConversion to fetch.
     */
    where: ScoreConversionWhereUniqueInput
  }

  /**
   * ScoreConversion findUniqueOrThrow
   */
  export type ScoreConversionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionInclude<ExtArgs> | null
    /**
     * Filter, which ScoreConversion to fetch.
     */
    where: ScoreConversionWhereUniqueInput
  }

  /**
   * ScoreConversion findFirst
   */
  export type ScoreConversionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionInclude<ExtArgs> | null
    /**
     * Filter, which ScoreConversion to fetch.
     */
    where?: ScoreConversionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScoreConversions to fetch.
     */
    orderBy?: ScoreConversionOrderByWithRelationInput | ScoreConversionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScoreConversions.
     */
    cursor?: ScoreConversionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScoreConversions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScoreConversions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScoreConversions.
     */
    distinct?: ScoreConversionScalarFieldEnum | ScoreConversionScalarFieldEnum[]
  }

  /**
   * ScoreConversion findFirstOrThrow
   */
  export type ScoreConversionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionInclude<ExtArgs> | null
    /**
     * Filter, which ScoreConversion to fetch.
     */
    where?: ScoreConversionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScoreConversions to fetch.
     */
    orderBy?: ScoreConversionOrderByWithRelationInput | ScoreConversionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScoreConversions.
     */
    cursor?: ScoreConversionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScoreConversions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScoreConversions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScoreConversions.
     */
    distinct?: ScoreConversionScalarFieldEnum | ScoreConversionScalarFieldEnum[]
  }

  /**
   * ScoreConversion findMany
   */
  export type ScoreConversionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionInclude<ExtArgs> | null
    /**
     * Filter, which ScoreConversions to fetch.
     */
    where?: ScoreConversionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScoreConversions to fetch.
     */
    orderBy?: ScoreConversionOrderByWithRelationInput | ScoreConversionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScoreConversions.
     */
    cursor?: ScoreConversionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScoreConversions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScoreConversions.
     */
    skip?: number
    distinct?: ScoreConversionScalarFieldEnum | ScoreConversionScalarFieldEnum[]
  }

  /**
   * ScoreConversion create
   */
  export type ScoreConversionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionInclude<ExtArgs> | null
    /**
     * The data needed to create a ScoreConversion.
     */
    data: XOR<ScoreConversionCreateInput, ScoreConversionUncheckedCreateInput>
  }

  /**
   * ScoreConversion createMany
   */
  export type ScoreConversionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScoreConversions.
     */
    data: ScoreConversionCreateManyInput | ScoreConversionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScoreConversion createManyAndReturn
   */
  export type ScoreConversionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * The data used to create many ScoreConversions.
     */
    data: ScoreConversionCreateManyInput | ScoreConversionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ScoreConversion update
   */
  export type ScoreConversionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionInclude<ExtArgs> | null
    /**
     * The data needed to update a ScoreConversion.
     */
    data: XOR<ScoreConversionUpdateInput, ScoreConversionUncheckedUpdateInput>
    /**
     * Choose, which ScoreConversion to update.
     */
    where: ScoreConversionWhereUniqueInput
  }

  /**
   * ScoreConversion updateMany
   */
  export type ScoreConversionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScoreConversions.
     */
    data: XOR<ScoreConversionUpdateManyMutationInput, ScoreConversionUncheckedUpdateManyInput>
    /**
     * Filter which ScoreConversions to update
     */
    where?: ScoreConversionWhereInput
    /**
     * Limit how many ScoreConversions to update.
     */
    limit?: number
  }

  /**
   * ScoreConversion updateManyAndReturn
   */
  export type ScoreConversionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * The data used to update ScoreConversions.
     */
    data: XOR<ScoreConversionUpdateManyMutationInput, ScoreConversionUncheckedUpdateManyInput>
    /**
     * Filter which ScoreConversions to update
     */
    where?: ScoreConversionWhereInput
    /**
     * Limit how many ScoreConversions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ScoreConversion upsert
   */
  export type ScoreConversionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionInclude<ExtArgs> | null
    /**
     * The filter to search for the ScoreConversion to update in case it exists.
     */
    where: ScoreConversionWhereUniqueInput
    /**
     * In case the ScoreConversion found by the `where` argument doesn't exist, create a new ScoreConversion with this data.
     */
    create: XOR<ScoreConversionCreateInput, ScoreConversionUncheckedCreateInput>
    /**
     * In case the ScoreConversion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScoreConversionUpdateInput, ScoreConversionUncheckedUpdateInput>
  }

  /**
   * ScoreConversion delete
   */
  export type ScoreConversionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionInclude<ExtArgs> | null
    /**
     * Filter which ScoreConversion to delete.
     */
    where: ScoreConversionWhereUniqueInput
  }

  /**
   * ScoreConversion deleteMany
   */
  export type ScoreConversionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScoreConversions to delete
     */
    where?: ScoreConversionWhereInput
    /**
     * Limit how many ScoreConversions to delete.
     */
    limit?: number
  }

  /**
   * ScoreConversion without action
   */
  export type ScoreConversionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreConversion
     */
    select?: ScoreConversionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreConversion
     */
    omit?: ScoreConversionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreConversionInclude<ExtArgs> | null
  }


  /**
   * Model TestSkill
   */

  export type AggregateTestSkill = {
    _count: TestSkillCountAggregateOutputType | null
    _min: TestSkillMinAggregateOutputType | null
    _max: TestSkillMaxAggregateOutputType | null
  }

  export type TestSkillMinAggregateOutputType = {
    testId: string | null
    skill: $Enums.SkillType | null
  }

  export type TestSkillMaxAggregateOutputType = {
    testId: string | null
    skill: $Enums.SkillType | null
  }

  export type TestSkillCountAggregateOutputType = {
    testId: number
    skill: number
    _all: number
  }


  export type TestSkillMinAggregateInputType = {
    testId?: true
    skill?: true
  }

  export type TestSkillMaxAggregateInputType = {
    testId?: true
    skill?: true
  }

  export type TestSkillCountAggregateInputType = {
    testId?: true
    skill?: true
    _all?: true
  }

  export type TestSkillAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TestSkill to aggregate.
     */
    where?: TestSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestSkills to fetch.
     */
    orderBy?: TestSkillOrderByWithRelationInput | TestSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TestSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestSkills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TestSkills
    **/
    _count?: true | TestSkillCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TestSkillMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TestSkillMaxAggregateInputType
  }

  export type GetTestSkillAggregateType<T extends TestSkillAggregateArgs> = {
        [P in keyof T & keyof AggregateTestSkill]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTestSkill[P]>
      : GetScalarType<T[P], AggregateTestSkill[P]>
  }




  export type TestSkillGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TestSkillWhereInput
    orderBy?: TestSkillOrderByWithAggregationInput | TestSkillOrderByWithAggregationInput[]
    by: TestSkillScalarFieldEnum[] | TestSkillScalarFieldEnum
    having?: TestSkillScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TestSkillCountAggregateInputType | true
    _min?: TestSkillMinAggregateInputType
    _max?: TestSkillMaxAggregateInputType
  }

  export type TestSkillGroupByOutputType = {
    testId: string
    skill: $Enums.SkillType
    _count: TestSkillCountAggregateOutputType | null
    _min: TestSkillMinAggregateOutputType | null
    _max: TestSkillMaxAggregateOutputType | null
  }

  type GetTestSkillGroupByPayload<T extends TestSkillGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TestSkillGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TestSkillGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TestSkillGroupByOutputType[P]>
            : GetScalarType<T[P], TestSkillGroupByOutputType[P]>
        }
      >
    >


  export type TestSkillSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    testId?: boolean
    skill?: boolean
    test?: boolean | TestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["testSkill"]>

  export type TestSkillSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    testId?: boolean
    skill?: boolean
    test?: boolean | TestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["testSkill"]>

  export type TestSkillSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    testId?: boolean
    skill?: boolean
    test?: boolean | TestDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["testSkill"]>

  export type TestSkillSelectScalar = {
    testId?: boolean
    skill?: boolean
  }

  export type TestSkillOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"testId" | "skill", ExtArgs["result"]["testSkill"]>
  export type TestSkillInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | TestDefaultArgs<ExtArgs>
  }
  export type TestSkillIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | TestDefaultArgs<ExtArgs>
  }
  export type TestSkillIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    test?: boolean | TestDefaultArgs<ExtArgs>
  }

  export type $TestSkillPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TestSkill"
    objects: {
      test: Prisma.$TestPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      testId: string
      skill: $Enums.SkillType
    }, ExtArgs["result"]["testSkill"]>
    composites: {}
  }

  type TestSkillGetPayload<S extends boolean | null | undefined | TestSkillDefaultArgs> = $Result.GetResult<Prisma.$TestSkillPayload, S>

  type TestSkillCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TestSkillFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TestSkillCountAggregateInputType | true
    }

  export interface TestSkillDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TestSkill'], meta: { name: 'TestSkill' } }
    /**
     * Find zero or one TestSkill that matches the filter.
     * @param {TestSkillFindUniqueArgs} args - Arguments to find a TestSkill
     * @example
     * // Get one TestSkill
     * const testSkill = await prisma.testSkill.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TestSkillFindUniqueArgs>(args: SelectSubset<T, TestSkillFindUniqueArgs<ExtArgs>>): Prisma__TestSkillClient<$Result.GetResult<Prisma.$TestSkillPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TestSkill that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TestSkillFindUniqueOrThrowArgs} args - Arguments to find a TestSkill
     * @example
     * // Get one TestSkill
     * const testSkill = await prisma.testSkill.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TestSkillFindUniqueOrThrowArgs>(args: SelectSubset<T, TestSkillFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TestSkillClient<$Result.GetResult<Prisma.$TestSkillPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TestSkill that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestSkillFindFirstArgs} args - Arguments to find a TestSkill
     * @example
     * // Get one TestSkill
     * const testSkill = await prisma.testSkill.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TestSkillFindFirstArgs>(args?: SelectSubset<T, TestSkillFindFirstArgs<ExtArgs>>): Prisma__TestSkillClient<$Result.GetResult<Prisma.$TestSkillPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TestSkill that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestSkillFindFirstOrThrowArgs} args - Arguments to find a TestSkill
     * @example
     * // Get one TestSkill
     * const testSkill = await prisma.testSkill.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TestSkillFindFirstOrThrowArgs>(args?: SelectSubset<T, TestSkillFindFirstOrThrowArgs<ExtArgs>>): Prisma__TestSkillClient<$Result.GetResult<Prisma.$TestSkillPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TestSkills that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestSkillFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TestSkills
     * const testSkills = await prisma.testSkill.findMany()
     * 
     * // Get first 10 TestSkills
     * const testSkills = await prisma.testSkill.findMany({ take: 10 })
     * 
     * // Only select the `testId`
     * const testSkillWithTestIdOnly = await prisma.testSkill.findMany({ select: { testId: true } })
     * 
     */
    findMany<T extends TestSkillFindManyArgs>(args?: SelectSubset<T, TestSkillFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestSkillPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TestSkill.
     * @param {TestSkillCreateArgs} args - Arguments to create a TestSkill.
     * @example
     * // Create one TestSkill
     * const TestSkill = await prisma.testSkill.create({
     *   data: {
     *     // ... data to create a TestSkill
     *   }
     * })
     * 
     */
    create<T extends TestSkillCreateArgs>(args: SelectSubset<T, TestSkillCreateArgs<ExtArgs>>): Prisma__TestSkillClient<$Result.GetResult<Prisma.$TestSkillPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TestSkills.
     * @param {TestSkillCreateManyArgs} args - Arguments to create many TestSkills.
     * @example
     * // Create many TestSkills
     * const testSkill = await prisma.testSkill.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TestSkillCreateManyArgs>(args?: SelectSubset<T, TestSkillCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TestSkills and returns the data saved in the database.
     * @param {TestSkillCreateManyAndReturnArgs} args - Arguments to create many TestSkills.
     * @example
     * // Create many TestSkills
     * const testSkill = await prisma.testSkill.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TestSkills and only return the `testId`
     * const testSkillWithTestIdOnly = await prisma.testSkill.createManyAndReturn({
     *   select: { testId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TestSkillCreateManyAndReturnArgs>(args?: SelectSubset<T, TestSkillCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestSkillPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TestSkill.
     * @param {TestSkillDeleteArgs} args - Arguments to delete one TestSkill.
     * @example
     * // Delete one TestSkill
     * const TestSkill = await prisma.testSkill.delete({
     *   where: {
     *     // ... filter to delete one TestSkill
     *   }
     * })
     * 
     */
    delete<T extends TestSkillDeleteArgs>(args: SelectSubset<T, TestSkillDeleteArgs<ExtArgs>>): Prisma__TestSkillClient<$Result.GetResult<Prisma.$TestSkillPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TestSkill.
     * @param {TestSkillUpdateArgs} args - Arguments to update one TestSkill.
     * @example
     * // Update one TestSkill
     * const testSkill = await prisma.testSkill.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TestSkillUpdateArgs>(args: SelectSubset<T, TestSkillUpdateArgs<ExtArgs>>): Prisma__TestSkillClient<$Result.GetResult<Prisma.$TestSkillPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TestSkills.
     * @param {TestSkillDeleteManyArgs} args - Arguments to filter TestSkills to delete.
     * @example
     * // Delete a few TestSkills
     * const { count } = await prisma.testSkill.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TestSkillDeleteManyArgs>(args?: SelectSubset<T, TestSkillDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TestSkills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestSkillUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TestSkills
     * const testSkill = await prisma.testSkill.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TestSkillUpdateManyArgs>(args: SelectSubset<T, TestSkillUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TestSkills and returns the data updated in the database.
     * @param {TestSkillUpdateManyAndReturnArgs} args - Arguments to update many TestSkills.
     * @example
     * // Update many TestSkills
     * const testSkill = await prisma.testSkill.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TestSkills and only return the `testId`
     * const testSkillWithTestIdOnly = await prisma.testSkill.updateManyAndReturn({
     *   select: { testId: true },
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
    updateManyAndReturn<T extends TestSkillUpdateManyAndReturnArgs>(args: SelectSubset<T, TestSkillUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TestSkillPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TestSkill.
     * @param {TestSkillUpsertArgs} args - Arguments to update or create a TestSkill.
     * @example
     * // Update or create a TestSkill
     * const testSkill = await prisma.testSkill.upsert({
     *   create: {
     *     // ... data to create a TestSkill
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TestSkill we want to update
     *   }
     * })
     */
    upsert<T extends TestSkillUpsertArgs>(args: SelectSubset<T, TestSkillUpsertArgs<ExtArgs>>): Prisma__TestSkillClient<$Result.GetResult<Prisma.$TestSkillPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TestSkills.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestSkillCountArgs} args - Arguments to filter TestSkills to count.
     * @example
     * // Count the number of TestSkills
     * const count = await prisma.testSkill.count({
     *   where: {
     *     // ... the filter for the TestSkills we want to count
     *   }
     * })
    **/
    count<T extends TestSkillCountArgs>(
      args?: Subset<T, TestSkillCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TestSkillCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TestSkill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestSkillAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TestSkillAggregateArgs>(args: Subset<T, TestSkillAggregateArgs>): Prisma.PrismaPromise<GetTestSkillAggregateType<T>>

    /**
     * Group by TestSkill.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TestSkillGroupByArgs} args - Group by arguments.
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
      T extends TestSkillGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TestSkillGroupByArgs['orderBy'] }
        : { orderBy?: TestSkillGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TestSkillGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTestSkillGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TestSkill model
   */
  readonly fields: TestSkillFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TestSkill.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TestSkillClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    test<T extends TestDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TestDefaultArgs<ExtArgs>>): Prisma__TestClient<$Result.GetResult<Prisma.$TestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TestSkill model
   */
  interface TestSkillFieldRefs {
    readonly testId: FieldRef<"TestSkill", 'String'>
    readonly skill: FieldRef<"TestSkill", 'SkillType'>
  }
    

  // Custom InputTypes
  /**
   * TestSkill findUnique
   */
  export type TestSkillFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillInclude<ExtArgs> | null
    /**
     * Filter, which TestSkill to fetch.
     */
    where: TestSkillWhereUniqueInput
  }

  /**
   * TestSkill findUniqueOrThrow
   */
  export type TestSkillFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillInclude<ExtArgs> | null
    /**
     * Filter, which TestSkill to fetch.
     */
    where: TestSkillWhereUniqueInput
  }

  /**
   * TestSkill findFirst
   */
  export type TestSkillFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillInclude<ExtArgs> | null
    /**
     * Filter, which TestSkill to fetch.
     */
    where?: TestSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestSkills to fetch.
     */
    orderBy?: TestSkillOrderByWithRelationInput | TestSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TestSkills.
     */
    cursor?: TestSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestSkills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TestSkills.
     */
    distinct?: TestSkillScalarFieldEnum | TestSkillScalarFieldEnum[]
  }

  /**
   * TestSkill findFirstOrThrow
   */
  export type TestSkillFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillInclude<ExtArgs> | null
    /**
     * Filter, which TestSkill to fetch.
     */
    where?: TestSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestSkills to fetch.
     */
    orderBy?: TestSkillOrderByWithRelationInput | TestSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TestSkills.
     */
    cursor?: TestSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestSkills.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TestSkills.
     */
    distinct?: TestSkillScalarFieldEnum | TestSkillScalarFieldEnum[]
  }

  /**
   * TestSkill findMany
   */
  export type TestSkillFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillInclude<ExtArgs> | null
    /**
     * Filter, which TestSkills to fetch.
     */
    where?: TestSkillWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TestSkills to fetch.
     */
    orderBy?: TestSkillOrderByWithRelationInput | TestSkillOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TestSkills.
     */
    cursor?: TestSkillWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TestSkills from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TestSkills.
     */
    skip?: number
    distinct?: TestSkillScalarFieldEnum | TestSkillScalarFieldEnum[]
  }

  /**
   * TestSkill create
   */
  export type TestSkillCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillInclude<ExtArgs> | null
    /**
     * The data needed to create a TestSkill.
     */
    data: XOR<TestSkillCreateInput, TestSkillUncheckedCreateInput>
  }

  /**
   * TestSkill createMany
   */
  export type TestSkillCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TestSkills.
     */
    data: TestSkillCreateManyInput | TestSkillCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TestSkill createManyAndReturn
   */
  export type TestSkillCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * The data used to create many TestSkills.
     */
    data: TestSkillCreateManyInput | TestSkillCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TestSkill update
   */
  export type TestSkillUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillInclude<ExtArgs> | null
    /**
     * The data needed to update a TestSkill.
     */
    data: XOR<TestSkillUpdateInput, TestSkillUncheckedUpdateInput>
    /**
     * Choose, which TestSkill to update.
     */
    where: TestSkillWhereUniqueInput
  }

  /**
   * TestSkill updateMany
   */
  export type TestSkillUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TestSkills.
     */
    data: XOR<TestSkillUpdateManyMutationInput, TestSkillUncheckedUpdateManyInput>
    /**
     * Filter which TestSkills to update
     */
    where?: TestSkillWhereInput
    /**
     * Limit how many TestSkills to update.
     */
    limit?: number
  }

  /**
   * TestSkill updateManyAndReturn
   */
  export type TestSkillUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * The data used to update TestSkills.
     */
    data: XOR<TestSkillUpdateManyMutationInput, TestSkillUncheckedUpdateManyInput>
    /**
     * Filter which TestSkills to update
     */
    where?: TestSkillWhereInput
    /**
     * Limit how many TestSkills to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TestSkill upsert
   */
  export type TestSkillUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillInclude<ExtArgs> | null
    /**
     * The filter to search for the TestSkill to update in case it exists.
     */
    where: TestSkillWhereUniqueInput
    /**
     * In case the TestSkill found by the `where` argument doesn't exist, create a new TestSkill with this data.
     */
    create: XOR<TestSkillCreateInput, TestSkillUncheckedCreateInput>
    /**
     * In case the TestSkill was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TestSkillUpdateInput, TestSkillUncheckedUpdateInput>
  }

  /**
   * TestSkill delete
   */
  export type TestSkillDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillInclude<ExtArgs> | null
    /**
     * Filter which TestSkill to delete.
     */
    where: TestSkillWhereUniqueInput
  }

  /**
   * TestSkill deleteMany
   */
  export type TestSkillDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TestSkills to delete
     */
    where?: TestSkillWhereInput
    /**
     * Limit how many TestSkills to delete.
     */
    limit?: number
  }

  /**
   * TestSkill without action
   */
  export type TestSkillDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TestSkill
     */
    select?: TestSkillSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TestSkill
     */
    omit?: TestSkillOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TestSkillInclude<ExtArgs> | null
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


  export const EnglishTestTypeScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type EnglishTestTypeScalarFieldEnum = (typeof EnglishTestTypeScalarFieldEnum)[keyof typeof EnglishTestTypeScalarFieldEnum]


  export const TestScalarFieldEnum: {
    id: 'id',
    title: 'title',
    durationInMinutes: 'durationInMinutes',
    totalScore: 'totalScore',
    passingScore: 'passingScore',
    englishTestTypeId: 'englishTestTypeId',
    practiceCount: 'practiceCount',
    createdAt: 'createdAt',
    maxAttempts: 'maxAttempts',
    testType: 'testType',
    updatedAt: 'updatedAt'
  };

  export type TestScalarFieldEnum = (typeof TestScalarFieldEnum)[keyof typeof TestScalarFieldEnum]


  export const CourseTestScalarFieldEnum: {
    courseId: 'courseId',
    testId: 'testId'
  };

  export type CourseTestScalarFieldEnum = (typeof CourseTestScalarFieldEnum)[keyof typeof CourseTestScalarFieldEnum]


  export const SectionScalarFieldEnum: {
    id: 'id',
    title: 'title',
    testId: 'testId',
    skill: 'skill',
    durationInSeconds: 'durationInSeconds',
    totalQuestions: 'totalQuestions',
    totalScore: 'totalScore'
  };

  export type SectionScalarFieldEnum = (typeof SectionScalarFieldEnum)[keyof typeof SectionScalarFieldEnum]


  export const PassageScalarFieldEnum: {
    id: 'id',
    sectionId: 'sectionId',
    content: 'content',
    passageOrder: 'passageOrder'
  };

  export type PassageScalarFieldEnum = (typeof PassageScalarFieldEnum)[keyof typeof PassageScalarFieldEnum]


  export const QuestionScalarFieldEnum: {
    id: 'id',
    sectionId: 'sectionId',
    questionText: 'questionText',
    imageUrl: 'imageUrl',
    questionType: 'questionType',
    options: 'options',
    correctAnswerIndex: 'correctAnswerIndex',
    wordLimit: 'wordLimit',
    correctAnswer: 'correctAnswer',
    passageId: 'passageId',
    questionOrder: 'questionOrder',
    testId: 'testId'
  };

  export type QuestionScalarFieldEnum = (typeof QuestionScalarFieldEnum)[keyof typeof QuestionScalarFieldEnum]


  export const PracticeSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    testId: 'testId',
    selectedSections: 'selectedSections',
    status: 'status',
    createdAt: 'createdAt',
    completedAt: 'completedAt',
    overallScaledScore: 'overallScaledScore',
    rawScoresBySkill: 'rawScoresBySkill',
    scoresBySkill: 'scoresBySkill'
  };

  export type PracticeSessionScalarFieldEnum = (typeof PracticeSessionScalarFieldEnum)[keyof typeof PracticeSessionScalarFieldEnum]


  export const UserAnswerScalarFieldEnum: {
    id: 'id',
    practiceSessionId: 'practiceSessionId',
    questionId: 'questionId',
    userId: 'userId',
    answerText: 'answerText',
    selectedOptionIndex: 'selectedOptionIndex',
    isCorrect: 'isCorrect'
  };

  export type UserAnswerScalarFieldEnum = (typeof UserAnswerScalarFieldEnum)[keyof typeof UserAnswerScalarFieldEnum]


  export const ScoreConversionScalarFieldEnum: {
    id: 'id',
    englishTestTypeId: 'englishTestTypeId',
    skill: 'skill',
    rawScore: 'rawScore',
    scaledScore: 'scaledScore'
  };

  export type ScoreConversionScalarFieldEnum = (typeof ScoreConversionScalarFieldEnum)[keyof typeof ScoreConversionScalarFieldEnum]


  export const TestSkillScalarFieldEnum: {
    testId: 'testId',
    skill: 'skill'
  };

  export type TestSkillScalarFieldEnum = (typeof TestSkillScalarFieldEnum)[keyof typeof TestSkillScalarFieldEnum]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TestType'
   */
  export type EnumTestTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TestType'>
    


  /**
   * Reference to a field of type 'TestType[]'
   */
  export type ListEnumTestTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TestType[]'>
    


  /**
   * Reference to a field of type 'SkillType'
   */
  export type EnumSkillTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SkillType'>
    


  /**
   * Reference to a field of type 'SkillType[]'
   */
  export type ListEnumSkillTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SkillType[]'>
    


  /**
   * Reference to a field of type 'QuestionType'
   */
  export type EnumQuestionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuestionType'>
    


  /**
   * Reference to a field of type 'QuestionType[]'
   */
  export type ListEnumQuestionTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QuestionType[]'>
    


  /**
   * Reference to a field of type 'SessionStatus'
   */
  export type EnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus'>
    


  /**
   * Reference to a field of type 'SessionStatus[]'
   */
  export type ListEnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type EnglishTestTypeWhereInput = {
    AND?: EnglishTestTypeWhereInput | EnglishTestTypeWhereInput[]
    OR?: EnglishTestTypeWhereInput[]
    NOT?: EnglishTestTypeWhereInput | EnglishTestTypeWhereInput[]
    id?: UuidFilter<"EnglishTestType"> | string
    name?: StringFilter<"EnglishTestType"> | string
    scoreConversions?: ScoreConversionListRelationFilter
    tests?: TestListRelationFilter
  }

  export type EnglishTestTypeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    scoreConversions?: ScoreConversionOrderByRelationAggregateInput
    tests?: TestOrderByRelationAggregateInput
  }

  export type EnglishTestTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: EnglishTestTypeWhereInput | EnglishTestTypeWhereInput[]
    OR?: EnglishTestTypeWhereInput[]
    NOT?: EnglishTestTypeWhereInput | EnglishTestTypeWhereInput[]
    name?: StringFilter<"EnglishTestType"> | string
    scoreConversions?: ScoreConversionListRelationFilter
    tests?: TestListRelationFilter
  }, "id">

  export type EnglishTestTypeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: EnglishTestTypeCountOrderByAggregateInput
    _max?: EnglishTestTypeMaxOrderByAggregateInput
    _min?: EnglishTestTypeMinOrderByAggregateInput
  }

  export type EnglishTestTypeScalarWhereWithAggregatesInput = {
    AND?: EnglishTestTypeScalarWhereWithAggregatesInput | EnglishTestTypeScalarWhereWithAggregatesInput[]
    OR?: EnglishTestTypeScalarWhereWithAggregatesInput[]
    NOT?: EnglishTestTypeScalarWhereWithAggregatesInput | EnglishTestTypeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"EnglishTestType"> | string
    name?: StringWithAggregatesFilter<"EnglishTestType"> | string
  }

  export type TestWhereInput = {
    AND?: TestWhereInput | TestWhereInput[]
    OR?: TestWhereInput[]
    NOT?: TestWhereInput | TestWhereInput[]
    id?: UuidFilter<"Test"> | string
    title?: StringFilter<"Test"> | string
    durationInMinutes?: IntNullableFilter<"Test"> | number | null
    totalScore?: FloatNullableFilter<"Test"> | number | null
    passingScore?: FloatNullableFilter<"Test"> | number | null
    englishTestTypeId?: UuidFilter<"Test"> | string
    practiceCount?: IntNullableFilter<"Test"> | number | null
    createdAt?: DateTimeFilter<"Test"> | Date | string
    maxAttempts?: IntNullableFilter<"Test"> | number | null
    testType?: EnumTestTypeNullableFilter<"Test"> | $Enums.TestType | null
    updatedAt?: DateTimeNullableFilter<"Test"> | Date | string | null
    courseTests?: CourseTestListRelationFilter
    practiceSessions?: PracticeSessionListRelationFilter
    questions?: QuestionListRelationFilter
    sections?: SectionListRelationFilter
    testSkills?: TestSkillListRelationFilter
    englishTestType?: XOR<EnglishTestTypeScalarRelationFilter, EnglishTestTypeWhereInput>
  }

  export type TestOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    durationInMinutes?: SortOrderInput | SortOrder
    totalScore?: SortOrderInput | SortOrder
    passingScore?: SortOrderInput | SortOrder
    englishTestTypeId?: SortOrder
    practiceCount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    maxAttempts?: SortOrderInput | SortOrder
    testType?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    courseTests?: CourseTestOrderByRelationAggregateInput
    practiceSessions?: PracticeSessionOrderByRelationAggregateInput
    questions?: QuestionOrderByRelationAggregateInput
    sections?: SectionOrderByRelationAggregateInput
    testSkills?: TestSkillOrderByRelationAggregateInput
    englishTestType?: EnglishTestTypeOrderByWithRelationInput
  }

  export type TestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TestWhereInput | TestWhereInput[]
    OR?: TestWhereInput[]
    NOT?: TestWhereInput | TestWhereInput[]
    title?: StringFilter<"Test"> | string
    durationInMinutes?: IntNullableFilter<"Test"> | number | null
    totalScore?: FloatNullableFilter<"Test"> | number | null
    passingScore?: FloatNullableFilter<"Test"> | number | null
    englishTestTypeId?: UuidFilter<"Test"> | string
    practiceCount?: IntNullableFilter<"Test"> | number | null
    createdAt?: DateTimeFilter<"Test"> | Date | string
    maxAttempts?: IntNullableFilter<"Test"> | number | null
    testType?: EnumTestTypeNullableFilter<"Test"> | $Enums.TestType | null
    updatedAt?: DateTimeNullableFilter<"Test"> | Date | string | null
    courseTests?: CourseTestListRelationFilter
    practiceSessions?: PracticeSessionListRelationFilter
    questions?: QuestionListRelationFilter
    sections?: SectionListRelationFilter
    testSkills?: TestSkillListRelationFilter
    englishTestType?: XOR<EnglishTestTypeScalarRelationFilter, EnglishTestTypeWhereInput>
  }, "id">

  export type TestOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    durationInMinutes?: SortOrderInput | SortOrder
    totalScore?: SortOrderInput | SortOrder
    passingScore?: SortOrderInput | SortOrder
    englishTestTypeId?: SortOrder
    practiceCount?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    maxAttempts?: SortOrderInput | SortOrder
    testType?: SortOrderInput | SortOrder
    updatedAt?: SortOrderInput | SortOrder
    _count?: TestCountOrderByAggregateInput
    _avg?: TestAvgOrderByAggregateInput
    _max?: TestMaxOrderByAggregateInput
    _min?: TestMinOrderByAggregateInput
    _sum?: TestSumOrderByAggregateInput
  }

  export type TestScalarWhereWithAggregatesInput = {
    AND?: TestScalarWhereWithAggregatesInput | TestScalarWhereWithAggregatesInput[]
    OR?: TestScalarWhereWithAggregatesInput[]
    NOT?: TestScalarWhereWithAggregatesInput | TestScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Test"> | string
    title?: StringWithAggregatesFilter<"Test"> | string
    durationInMinutes?: IntNullableWithAggregatesFilter<"Test"> | number | null
    totalScore?: FloatNullableWithAggregatesFilter<"Test"> | number | null
    passingScore?: FloatNullableWithAggregatesFilter<"Test"> | number | null
    englishTestTypeId?: UuidWithAggregatesFilter<"Test"> | string
    practiceCount?: IntNullableWithAggregatesFilter<"Test"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Test"> | Date | string
    maxAttempts?: IntNullableWithAggregatesFilter<"Test"> | number | null
    testType?: EnumTestTypeNullableWithAggregatesFilter<"Test"> | $Enums.TestType | null
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Test"> | Date | string | null
  }

  export type CourseTestWhereInput = {
    AND?: CourseTestWhereInput | CourseTestWhereInput[]
    OR?: CourseTestWhereInput[]
    NOT?: CourseTestWhereInput | CourseTestWhereInput[]
    courseId?: UuidFilter<"CourseTest"> | string
    testId?: UuidFilter<"CourseTest"> | string
    test?: XOR<TestScalarRelationFilter, TestWhereInput>
  }

  export type CourseTestOrderByWithRelationInput = {
    courseId?: SortOrder
    testId?: SortOrder
    test?: TestOrderByWithRelationInput
  }

  export type CourseTestWhereUniqueInput = Prisma.AtLeast<{
    courseId_testId?: CourseTestCourseIdTestIdCompoundUniqueInput
    AND?: CourseTestWhereInput | CourseTestWhereInput[]
    OR?: CourseTestWhereInput[]
    NOT?: CourseTestWhereInput | CourseTestWhereInput[]
    courseId?: UuidFilter<"CourseTest"> | string
    testId?: UuidFilter<"CourseTest"> | string
    test?: XOR<TestScalarRelationFilter, TestWhereInput>
  }, "courseId_testId">

  export type CourseTestOrderByWithAggregationInput = {
    courseId?: SortOrder
    testId?: SortOrder
    _count?: CourseTestCountOrderByAggregateInput
    _max?: CourseTestMaxOrderByAggregateInput
    _min?: CourseTestMinOrderByAggregateInput
  }

  export type CourseTestScalarWhereWithAggregatesInput = {
    AND?: CourseTestScalarWhereWithAggregatesInput | CourseTestScalarWhereWithAggregatesInput[]
    OR?: CourseTestScalarWhereWithAggregatesInput[]
    NOT?: CourseTestScalarWhereWithAggregatesInput | CourseTestScalarWhereWithAggregatesInput[]
    courseId?: UuidWithAggregatesFilter<"CourseTest"> | string
    testId?: UuidWithAggregatesFilter<"CourseTest"> | string
  }

  export type SectionWhereInput = {
    AND?: SectionWhereInput | SectionWhereInput[]
    OR?: SectionWhereInput[]
    NOT?: SectionWhereInput | SectionWhereInput[]
    id?: UuidFilter<"Section"> | string
    title?: StringFilter<"Section"> | string
    testId?: UuidNullableFilter<"Section"> | string | null
    skill?: EnumSkillTypeNullableFilter<"Section"> | $Enums.SkillType | null
    durationInSeconds?: FloatNullableFilter<"Section"> | number | null
    totalQuestions?: IntNullableFilter<"Section"> | number | null
    totalScore?: FloatNullableFilter<"Section"> | number | null
    passages?: PassageListRelationFilter
    questions?: QuestionListRelationFilter
    test?: XOR<TestNullableScalarRelationFilter, TestWhereInput> | null
  }

  export type SectionOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    testId?: SortOrderInput | SortOrder
    skill?: SortOrderInput | SortOrder
    durationInSeconds?: SortOrderInput | SortOrder
    totalQuestions?: SortOrderInput | SortOrder
    totalScore?: SortOrderInput | SortOrder
    passages?: PassageOrderByRelationAggregateInput
    questions?: QuestionOrderByRelationAggregateInput
    test?: TestOrderByWithRelationInput
  }

  export type SectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SectionWhereInput | SectionWhereInput[]
    OR?: SectionWhereInput[]
    NOT?: SectionWhereInput | SectionWhereInput[]
    title?: StringFilter<"Section"> | string
    testId?: UuidNullableFilter<"Section"> | string | null
    skill?: EnumSkillTypeNullableFilter<"Section"> | $Enums.SkillType | null
    durationInSeconds?: FloatNullableFilter<"Section"> | number | null
    totalQuestions?: IntNullableFilter<"Section"> | number | null
    totalScore?: FloatNullableFilter<"Section"> | number | null
    passages?: PassageListRelationFilter
    questions?: QuestionListRelationFilter
    test?: XOR<TestNullableScalarRelationFilter, TestWhereInput> | null
  }, "id">

  export type SectionOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    testId?: SortOrderInput | SortOrder
    skill?: SortOrderInput | SortOrder
    durationInSeconds?: SortOrderInput | SortOrder
    totalQuestions?: SortOrderInput | SortOrder
    totalScore?: SortOrderInput | SortOrder
    _count?: SectionCountOrderByAggregateInput
    _avg?: SectionAvgOrderByAggregateInput
    _max?: SectionMaxOrderByAggregateInput
    _min?: SectionMinOrderByAggregateInput
    _sum?: SectionSumOrderByAggregateInput
  }

  export type SectionScalarWhereWithAggregatesInput = {
    AND?: SectionScalarWhereWithAggregatesInput | SectionScalarWhereWithAggregatesInput[]
    OR?: SectionScalarWhereWithAggregatesInput[]
    NOT?: SectionScalarWhereWithAggregatesInput | SectionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Section"> | string
    title?: StringWithAggregatesFilter<"Section"> | string
    testId?: UuidNullableWithAggregatesFilter<"Section"> | string | null
    skill?: EnumSkillTypeNullableWithAggregatesFilter<"Section"> | $Enums.SkillType | null
    durationInSeconds?: FloatNullableWithAggregatesFilter<"Section"> | number | null
    totalQuestions?: IntNullableWithAggregatesFilter<"Section"> | number | null
    totalScore?: FloatNullableWithAggregatesFilter<"Section"> | number | null
  }

  export type PassageWhereInput = {
    AND?: PassageWhereInput | PassageWhereInput[]
    OR?: PassageWhereInput[]
    NOT?: PassageWhereInput | PassageWhereInput[]
    id?: UuidFilter<"Passage"> | string
    sectionId?: UuidFilter<"Passage"> | string
    content?: StringFilter<"Passage"> | string
    passageOrder?: IntNullableFilter<"Passage"> | number | null
    section?: XOR<SectionScalarRelationFilter, SectionWhereInput>
    questions?: QuestionListRelationFilter
  }

  export type PassageOrderByWithRelationInput = {
    id?: SortOrder
    sectionId?: SortOrder
    content?: SortOrder
    passageOrder?: SortOrderInput | SortOrder
    section?: SectionOrderByWithRelationInput
    questions?: QuestionOrderByRelationAggregateInput
  }

  export type PassageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sectionId_passageOrder?: PassageSectionIdPassageOrderCompoundUniqueInput
    AND?: PassageWhereInput | PassageWhereInput[]
    OR?: PassageWhereInput[]
    NOT?: PassageWhereInput | PassageWhereInput[]
    sectionId?: UuidFilter<"Passage"> | string
    content?: StringFilter<"Passage"> | string
    passageOrder?: IntNullableFilter<"Passage"> | number | null
    section?: XOR<SectionScalarRelationFilter, SectionWhereInput>
    questions?: QuestionListRelationFilter
  }, "id" | "sectionId_passageOrder">

  export type PassageOrderByWithAggregationInput = {
    id?: SortOrder
    sectionId?: SortOrder
    content?: SortOrder
    passageOrder?: SortOrderInput | SortOrder
    _count?: PassageCountOrderByAggregateInput
    _avg?: PassageAvgOrderByAggregateInput
    _max?: PassageMaxOrderByAggregateInput
    _min?: PassageMinOrderByAggregateInput
    _sum?: PassageSumOrderByAggregateInput
  }

  export type PassageScalarWhereWithAggregatesInput = {
    AND?: PassageScalarWhereWithAggregatesInput | PassageScalarWhereWithAggregatesInput[]
    OR?: PassageScalarWhereWithAggregatesInput[]
    NOT?: PassageScalarWhereWithAggregatesInput | PassageScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Passage"> | string
    sectionId?: UuidWithAggregatesFilter<"Passage"> | string
    content?: StringWithAggregatesFilter<"Passage"> | string
    passageOrder?: IntNullableWithAggregatesFilter<"Passage"> | number | null
  }

  export type QuestionWhereInput = {
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    id?: UuidFilter<"Question"> | string
    sectionId?: UuidNullableFilter<"Question"> | string | null
    questionText?: StringNullableFilter<"Question"> | string | null
    imageUrl?: StringNullableFilter<"Question"> | string | null
    questionType?: EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType
    options?: StringNullableListFilter<"Question">
    correctAnswerIndex?: IntNullableFilter<"Question"> | number | null
    wordLimit?: IntNullableFilter<"Question"> | number | null
    correctAnswer?: StringNullableFilter<"Question"> | string | null
    passageId?: UuidNullableFilter<"Question"> | string | null
    questionOrder?: IntNullableFilter<"Question"> | number | null
    testId?: UuidNullableFilter<"Question"> | string | null
    passage?: XOR<PassageNullableScalarRelationFilter, PassageWhereInput> | null
    section?: XOR<SectionNullableScalarRelationFilter, SectionWhereInput> | null
    test?: XOR<TestNullableScalarRelationFilter, TestWhereInput> | null
    userAnswers?: UserAnswerListRelationFilter
  }

  export type QuestionOrderByWithRelationInput = {
    id?: SortOrder
    sectionId?: SortOrderInput | SortOrder
    questionText?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    questionType?: SortOrder
    options?: SortOrder
    correctAnswerIndex?: SortOrderInput | SortOrder
    wordLimit?: SortOrderInput | SortOrder
    correctAnswer?: SortOrderInput | SortOrder
    passageId?: SortOrderInput | SortOrder
    questionOrder?: SortOrderInput | SortOrder
    testId?: SortOrderInput | SortOrder
    passage?: PassageOrderByWithRelationInput
    section?: SectionOrderByWithRelationInput
    test?: TestOrderByWithRelationInput
    userAnswers?: UserAnswerOrderByRelationAggregateInput
  }

  export type QuestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: QuestionWhereInput | QuestionWhereInput[]
    OR?: QuestionWhereInput[]
    NOT?: QuestionWhereInput | QuestionWhereInput[]
    sectionId?: UuidNullableFilter<"Question"> | string | null
    questionText?: StringNullableFilter<"Question"> | string | null
    imageUrl?: StringNullableFilter<"Question"> | string | null
    questionType?: EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType
    options?: StringNullableListFilter<"Question">
    correctAnswerIndex?: IntNullableFilter<"Question"> | number | null
    wordLimit?: IntNullableFilter<"Question"> | number | null
    correctAnswer?: StringNullableFilter<"Question"> | string | null
    passageId?: UuidNullableFilter<"Question"> | string | null
    questionOrder?: IntNullableFilter<"Question"> | number | null
    testId?: UuidNullableFilter<"Question"> | string | null
    passage?: XOR<PassageNullableScalarRelationFilter, PassageWhereInput> | null
    section?: XOR<SectionNullableScalarRelationFilter, SectionWhereInput> | null
    test?: XOR<TestNullableScalarRelationFilter, TestWhereInput> | null
    userAnswers?: UserAnswerListRelationFilter
  }, "id">

  export type QuestionOrderByWithAggregationInput = {
    id?: SortOrder
    sectionId?: SortOrderInput | SortOrder
    questionText?: SortOrderInput | SortOrder
    imageUrl?: SortOrderInput | SortOrder
    questionType?: SortOrder
    options?: SortOrder
    correctAnswerIndex?: SortOrderInput | SortOrder
    wordLimit?: SortOrderInput | SortOrder
    correctAnswer?: SortOrderInput | SortOrder
    passageId?: SortOrderInput | SortOrder
    questionOrder?: SortOrderInput | SortOrder
    testId?: SortOrderInput | SortOrder
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
    sectionId?: UuidNullableWithAggregatesFilter<"Question"> | string | null
    questionText?: StringNullableWithAggregatesFilter<"Question"> | string | null
    imageUrl?: StringNullableWithAggregatesFilter<"Question"> | string | null
    questionType?: EnumQuestionTypeWithAggregatesFilter<"Question"> | $Enums.QuestionType
    options?: StringNullableListFilter<"Question">
    correctAnswerIndex?: IntNullableWithAggregatesFilter<"Question"> | number | null
    wordLimit?: IntNullableWithAggregatesFilter<"Question"> | number | null
    correctAnswer?: StringNullableWithAggregatesFilter<"Question"> | string | null
    passageId?: UuidNullableWithAggregatesFilter<"Question"> | string | null
    questionOrder?: IntNullableWithAggregatesFilter<"Question"> | number | null
    testId?: UuidNullableWithAggregatesFilter<"Question"> | string | null
  }

  export type PracticeSessionWhereInput = {
    AND?: PracticeSessionWhereInput | PracticeSessionWhereInput[]
    OR?: PracticeSessionWhereInput[]
    NOT?: PracticeSessionWhereInput | PracticeSessionWhereInput[]
    id?: UuidFilter<"PracticeSession"> | string
    userId?: UuidFilter<"PracticeSession"> | string
    testId?: UuidFilter<"PracticeSession"> | string
    selectedSections?: StringNullableListFilter<"PracticeSession">
    status?: EnumSessionStatusFilter<"PracticeSession"> | $Enums.SessionStatus
    createdAt?: DateTimeFilter<"PracticeSession"> | Date | string
    completedAt?: DateTimeNullableFilter<"PracticeSession"> | Date | string | null
    overallScaledScore?: FloatNullableFilter<"PracticeSession"> | number | null
    rawScoresBySkill?: JsonNullableFilter<"PracticeSession">
    scoresBySkill?: JsonNullableFilter<"PracticeSession">
    test?: XOR<TestScalarRelationFilter, TestWhereInput>
    userAnswers?: UserAnswerListRelationFilter
  }

  export type PracticeSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    testId?: SortOrder
    selectedSections?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    overallScaledScore?: SortOrderInput | SortOrder
    rawScoresBySkill?: SortOrderInput | SortOrder
    scoresBySkill?: SortOrderInput | SortOrder
    test?: TestOrderByWithRelationInput
    userAnswers?: UserAnswerOrderByRelationAggregateInput
  }

  export type PracticeSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PracticeSessionWhereInput | PracticeSessionWhereInput[]
    OR?: PracticeSessionWhereInput[]
    NOT?: PracticeSessionWhereInput | PracticeSessionWhereInput[]
    userId?: UuidFilter<"PracticeSession"> | string
    testId?: UuidFilter<"PracticeSession"> | string
    selectedSections?: StringNullableListFilter<"PracticeSession">
    status?: EnumSessionStatusFilter<"PracticeSession"> | $Enums.SessionStatus
    createdAt?: DateTimeFilter<"PracticeSession"> | Date | string
    completedAt?: DateTimeNullableFilter<"PracticeSession"> | Date | string | null
    overallScaledScore?: FloatNullableFilter<"PracticeSession"> | number | null
    rawScoresBySkill?: JsonNullableFilter<"PracticeSession">
    scoresBySkill?: JsonNullableFilter<"PracticeSession">
    test?: XOR<TestScalarRelationFilter, TestWhereInput>
    userAnswers?: UserAnswerListRelationFilter
  }, "id">

  export type PracticeSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    testId?: SortOrder
    selectedSections?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    overallScaledScore?: SortOrderInput | SortOrder
    rawScoresBySkill?: SortOrderInput | SortOrder
    scoresBySkill?: SortOrderInput | SortOrder
    _count?: PracticeSessionCountOrderByAggregateInput
    _avg?: PracticeSessionAvgOrderByAggregateInput
    _max?: PracticeSessionMaxOrderByAggregateInput
    _min?: PracticeSessionMinOrderByAggregateInput
    _sum?: PracticeSessionSumOrderByAggregateInput
  }

  export type PracticeSessionScalarWhereWithAggregatesInput = {
    AND?: PracticeSessionScalarWhereWithAggregatesInput | PracticeSessionScalarWhereWithAggregatesInput[]
    OR?: PracticeSessionScalarWhereWithAggregatesInput[]
    NOT?: PracticeSessionScalarWhereWithAggregatesInput | PracticeSessionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PracticeSession"> | string
    userId?: UuidWithAggregatesFilter<"PracticeSession"> | string
    testId?: UuidWithAggregatesFilter<"PracticeSession"> | string
    selectedSections?: StringNullableListFilter<"PracticeSession">
    status?: EnumSessionStatusWithAggregatesFilter<"PracticeSession"> | $Enums.SessionStatus
    createdAt?: DateTimeWithAggregatesFilter<"PracticeSession"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"PracticeSession"> | Date | string | null
    overallScaledScore?: FloatNullableWithAggregatesFilter<"PracticeSession"> | number | null
    rawScoresBySkill?: JsonNullableWithAggregatesFilter<"PracticeSession">
    scoresBySkill?: JsonNullableWithAggregatesFilter<"PracticeSession">
  }

  export type UserAnswerWhereInput = {
    AND?: UserAnswerWhereInput | UserAnswerWhereInput[]
    OR?: UserAnswerWhereInput[]
    NOT?: UserAnswerWhereInput | UserAnswerWhereInput[]
    id?: UuidFilter<"UserAnswer"> | string
    practiceSessionId?: UuidFilter<"UserAnswer"> | string
    questionId?: UuidFilter<"UserAnswer"> | string
    userId?: UuidFilter<"UserAnswer"> | string
    answerText?: StringNullableFilter<"UserAnswer"> | string | null
    selectedOptionIndex?: IntNullableFilter<"UserAnswer"> | number | null
    isCorrect?: BoolNullableFilter<"UserAnswer"> | boolean | null
    practiceSession?: XOR<PracticeSessionScalarRelationFilter, PracticeSessionWhereInput>
    question?: XOR<QuestionScalarRelationFilter, QuestionWhereInput>
  }

  export type UserAnswerOrderByWithRelationInput = {
    id?: SortOrder
    practiceSessionId?: SortOrder
    questionId?: SortOrder
    userId?: SortOrder
    answerText?: SortOrderInput | SortOrder
    selectedOptionIndex?: SortOrderInput | SortOrder
    isCorrect?: SortOrderInput | SortOrder
    practiceSession?: PracticeSessionOrderByWithRelationInput
    question?: QuestionOrderByWithRelationInput
  }

  export type UserAnswerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    practiceSessionId_questionId_userId?: UserAnswerPracticeSessionIdQuestionIdUserIdCompoundUniqueInput
    AND?: UserAnswerWhereInput | UserAnswerWhereInput[]
    OR?: UserAnswerWhereInput[]
    NOT?: UserAnswerWhereInput | UserAnswerWhereInput[]
    practiceSessionId?: UuidFilter<"UserAnswer"> | string
    questionId?: UuidFilter<"UserAnswer"> | string
    userId?: UuidFilter<"UserAnswer"> | string
    answerText?: StringNullableFilter<"UserAnswer"> | string | null
    selectedOptionIndex?: IntNullableFilter<"UserAnswer"> | number | null
    isCorrect?: BoolNullableFilter<"UserAnswer"> | boolean | null
    practiceSession?: XOR<PracticeSessionScalarRelationFilter, PracticeSessionWhereInput>
    question?: XOR<QuestionScalarRelationFilter, QuestionWhereInput>
  }, "id" | "practiceSessionId_questionId_userId">

  export type UserAnswerOrderByWithAggregationInput = {
    id?: SortOrder
    practiceSessionId?: SortOrder
    questionId?: SortOrder
    userId?: SortOrder
    answerText?: SortOrderInput | SortOrder
    selectedOptionIndex?: SortOrderInput | SortOrder
    isCorrect?: SortOrderInput | SortOrder
    _count?: UserAnswerCountOrderByAggregateInput
    _avg?: UserAnswerAvgOrderByAggregateInput
    _max?: UserAnswerMaxOrderByAggregateInput
    _min?: UserAnswerMinOrderByAggregateInput
    _sum?: UserAnswerSumOrderByAggregateInput
  }

  export type UserAnswerScalarWhereWithAggregatesInput = {
    AND?: UserAnswerScalarWhereWithAggregatesInput | UserAnswerScalarWhereWithAggregatesInput[]
    OR?: UserAnswerScalarWhereWithAggregatesInput[]
    NOT?: UserAnswerScalarWhereWithAggregatesInput | UserAnswerScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"UserAnswer"> | string
    practiceSessionId?: UuidWithAggregatesFilter<"UserAnswer"> | string
    questionId?: UuidWithAggregatesFilter<"UserAnswer"> | string
    userId?: UuidWithAggregatesFilter<"UserAnswer"> | string
    answerText?: StringNullableWithAggregatesFilter<"UserAnswer"> | string | null
    selectedOptionIndex?: IntNullableWithAggregatesFilter<"UserAnswer"> | number | null
    isCorrect?: BoolNullableWithAggregatesFilter<"UserAnswer"> | boolean | null
  }

  export type ScoreConversionWhereInput = {
    AND?: ScoreConversionWhereInput | ScoreConversionWhereInput[]
    OR?: ScoreConversionWhereInput[]
    NOT?: ScoreConversionWhereInput | ScoreConversionWhereInput[]
    id?: UuidFilter<"ScoreConversion"> | string
    englishTestTypeId?: UuidFilter<"ScoreConversion"> | string
    skill?: EnumSkillTypeFilter<"ScoreConversion"> | $Enums.SkillType
    rawScore?: IntFilter<"ScoreConversion"> | number
    scaledScore?: FloatFilter<"ScoreConversion"> | number
    englishTestType?: XOR<EnglishTestTypeScalarRelationFilter, EnglishTestTypeWhereInput>
  }

  export type ScoreConversionOrderByWithRelationInput = {
    id?: SortOrder
    englishTestTypeId?: SortOrder
    skill?: SortOrder
    rawScore?: SortOrder
    scaledScore?: SortOrder
    englishTestType?: EnglishTestTypeOrderByWithRelationInput
  }

  export type ScoreConversionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScoreConversionWhereInput | ScoreConversionWhereInput[]
    OR?: ScoreConversionWhereInput[]
    NOT?: ScoreConversionWhereInput | ScoreConversionWhereInput[]
    englishTestTypeId?: UuidFilter<"ScoreConversion"> | string
    skill?: EnumSkillTypeFilter<"ScoreConversion"> | $Enums.SkillType
    rawScore?: IntFilter<"ScoreConversion"> | number
    scaledScore?: FloatFilter<"ScoreConversion"> | number
    englishTestType?: XOR<EnglishTestTypeScalarRelationFilter, EnglishTestTypeWhereInput>
  }, "id">

  export type ScoreConversionOrderByWithAggregationInput = {
    id?: SortOrder
    englishTestTypeId?: SortOrder
    skill?: SortOrder
    rawScore?: SortOrder
    scaledScore?: SortOrder
    _count?: ScoreConversionCountOrderByAggregateInput
    _avg?: ScoreConversionAvgOrderByAggregateInput
    _max?: ScoreConversionMaxOrderByAggregateInput
    _min?: ScoreConversionMinOrderByAggregateInput
    _sum?: ScoreConversionSumOrderByAggregateInput
  }

  export type ScoreConversionScalarWhereWithAggregatesInput = {
    AND?: ScoreConversionScalarWhereWithAggregatesInput | ScoreConversionScalarWhereWithAggregatesInput[]
    OR?: ScoreConversionScalarWhereWithAggregatesInput[]
    NOT?: ScoreConversionScalarWhereWithAggregatesInput | ScoreConversionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ScoreConversion"> | string
    englishTestTypeId?: UuidWithAggregatesFilter<"ScoreConversion"> | string
    skill?: EnumSkillTypeWithAggregatesFilter<"ScoreConversion"> | $Enums.SkillType
    rawScore?: IntWithAggregatesFilter<"ScoreConversion"> | number
    scaledScore?: FloatWithAggregatesFilter<"ScoreConversion"> | number
  }

  export type TestSkillWhereInput = {
    AND?: TestSkillWhereInput | TestSkillWhereInput[]
    OR?: TestSkillWhereInput[]
    NOT?: TestSkillWhereInput | TestSkillWhereInput[]
    testId?: UuidFilter<"TestSkill"> | string
    skill?: EnumSkillTypeFilter<"TestSkill"> | $Enums.SkillType
    test?: XOR<TestScalarRelationFilter, TestWhereInput>
  }

  export type TestSkillOrderByWithRelationInput = {
    testId?: SortOrder
    skill?: SortOrder
    test?: TestOrderByWithRelationInput
  }

  export type TestSkillWhereUniqueInput = Prisma.AtLeast<{
    testId_skill?: TestSkillTestIdSkillCompoundUniqueInput
    AND?: TestSkillWhereInput | TestSkillWhereInput[]
    OR?: TestSkillWhereInput[]
    NOT?: TestSkillWhereInput | TestSkillWhereInput[]
    testId?: UuidFilter<"TestSkill"> | string
    skill?: EnumSkillTypeFilter<"TestSkill"> | $Enums.SkillType
    test?: XOR<TestScalarRelationFilter, TestWhereInput>
  }, "testId_skill">

  export type TestSkillOrderByWithAggregationInput = {
    testId?: SortOrder
    skill?: SortOrder
    _count?: TestSkillCountOrderByAggregateInput
    _max?: TestSkillMaxOrderByAggregateInput
    _min?: TestSkillMinOrderByAggregateInput
  }

  export type TestSkillScalarWhereWithAggregatesInput = {
    AND?: TestSkillScalarWhereWithAggregatesInput | TestSkillScalarWhereWithAggregatesInput[]
    OR?: TestSkillScalarWhereWithAggregatesInput[]
    NOT?: TestSkillScalarWhereWithAggregatesInput | TestSkillScalarWhereWithAggregatesInput[]
    testId?: UuidWithAggregatesFilter<"TestSkill"> | string
    skill?: EnumSkillTypeWithAggregatesFilter<"TestSkill"> | $Enums.SkillType
  }

  export type EnglishTestTypeCreateInput = {
    id?: string
    name: string
    scoreConversions?: ScoreConversionCreateNestedManyWithoutEnglishTestTypeInput
    tests?: TestCreateNestedManyWithoutEnglishTestTypeInput
  }

  export type EnglishTestTypeUncheckedCreateInput = {
    id?: string
    name: string
    scoreConversions?: ScoreConversionUncheckedCreateNestedManyWithoutEnglishTestTypeInput
    tests?: TestUncheckedCreateNestedManyWithoutEnglishTestTypeInput
  }

  export type EnglishTestTypeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scoreConversions?: ScoreConversionUpdateManyWithoutEnglishTestTypeNestedInput
    tests?: TestUpdateManyWithoutEnglishTestTypeNestedInput
  }

  export type EnglishTestTypeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scoreConversions?: ScoreConversionUncheckedUpdateManyWithoutEnglishTestTypeNestedInput
    tests?: TestUncheckedUpdateManyWithoutEnglishTestTypeNestedInput
  }

  export type EnglishTestTypeCreateManyInput = {
    id?: string
    name: string
  }

  export type EnglishTestTypeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type EnglishTestTypeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type TestCreateInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    courseTests?: CourseTestCreateNestedManyWithoutTestInput
    practiceSessions?: PracticeSessionCreateNestedManyWithoutTestInput
    questions?: QuestionCreateNestedManyWithoutTestInput
    sections?: SectionCreateNestedManyWithoutTestInput
    testSkills?: TestSkillCreateNestedManyWithoutTestInput
    englishTestType: EnglishTestTypeCreateNestedOneWithoutTestsInput
  }

  export type TestUncheckedCreateInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    englishTestTypeId: string
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    courseTests?: CourseTestUncheckedCreateNestedManyWithoutTestInput
    practiceSessions?: PracticeSessionUncheckedCreateNestedManyWithoutTestInput
    questions?: QuestionUncheckedCreateNestedManyWithoutTestInput
    sections?: SectionUncheckedCreateNestedManyWithoutTestInput
    testSkills?: TestSkillUncheckedCreateNestedManyWithoutTestInput
  }

  export type TestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courseTests?: CourseTestUpdateManyWithoutTestNestedInput
    practiceSessions?: PracticeSessionUpdateManyWithoutTestNestedInput
    questions?: QuestionUpdateManyWithoutTestNestedInput
    sections?: SectionUpdateManyWithoutTestNestedInput
    testSkills?: TestSkillUpdateManyWithoutTestNestedInput
    englishTestType?: EnglishTestTypeUpdateOneRequiredWithoutTestsNestedInput
  }

  export type TestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    englishTestTypeId?: StringFieldUpdateOperationsInput | string
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courseTests?: CourseTestUncheckedUpdateManyWithoutTestNestedInput
    practiceSessions?: PracticeSessionUncheckedUpdateManyWithoutTestNestedInput
    questions?: QuestionUncheckedUpdateManyWithoutTestNestedInput
    sections?: SectionUncheckedUpdateManyWithoutTestNestedInput
    testSkills?: TestSkillUncheckedUpdateManyWithoutTestNestedInput
  }

  export type TestCreateManyInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    englishTestTypeId: string
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
  }

  export type TestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    englishTestTypeId?: StringFieldUpdateOperationsInput | string
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CourseTestCreateInput = {
    courseId: string
    test: TestCreateNestedOneWithoutCourseTestsInput
  }

  export type CourseTestUncheckedCreateInput = {
    courseId: string
    testId: string
  }

  export type CourseTestUpdateInput = {
    courseId?: StringFieldUpdateOperationsInput | string
    test?: TestUpdateOneRequiredWithoutCourseTestsNestedInput
  }

  export type CourseTestUncheckedUpdateInput = {
    courseId?: StringFieldUpdateOperationsInput | string
    testId?: StringFieldUpdateOperationsInput | string
  }

  export type CourseTestCreateManyInput = {
    courseId: string
    testId: string
  }

  export type CourseTestUpdateManyMutationInput = {
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type CourseTestUncheckedUpdateManyInput = {
    courseId?: StringFieldUpdateOperationsInput | string
    testId?: StringFieldUpdateOperationsInput | string
  }

  export type SectionCreateInput = {
    id?: string
    title: string
    skill?: $Enums.SkillType | null
    durationInSeconds?: number | null
    totalQuestions?: number | null
    totalScore?: number | null
    passages?: PassageCreateNestedManyWithoutSectionInput
    questions?: QuestionCreateNestedManyWithoutSectionInput
    test?: TestCreateNestedOneWithoutSectionsInput
  }

  export type SectionUncheckedCreateInput = {
    id?: string
    title: string
    testId?: string | null
    skill?: $Enums.SkillType | null
    durationInSeconds?: number | null
    totalQuestions?: number | null
    totalScore?: number | null
    passages?: PassageUncheckedCreateNestedManyWithoutSectionInput
    questions?: QuestionUncheckedCreateNestedManyWithoutSectionInput
  }

  export type SectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    skill?: NullableEnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType | null
    durationInSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    totalQuestions?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passages?: PassageUpdateManyWithoutSectionNestedInput
    questions?: QuestionUpdateManyWithoutSectionNestedInput
    test?: TestUpdateOneWithoutSectionsNestedInput
  }

  export type SectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    testId?: NullableStringFieldUpdateOperationsInput | string | null
    skill?: NullableEnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType | null
    durationInSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    totalQuestions?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passages?: PassageUncheckedUpdateManyWithoutSectionNestedInput
    questions?: QuestionUncheckedUpdateManyWithoutSectionNestedInput
  }

  export type SectionCreateManyInput = {
    id?: string
    title: string
    testId?: string | null
    skill?: $Enums.SkillType | null
    durationInSeconds?: number | null
    totalQuestions?: number | null
    totalScore?: number | null
  }

  export type SectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    skill?: NullableEnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType | null
    durationInSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    totalQuestions?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type SectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    testId?: NullableStringFieldUpdateOperationsInput | string | null
    skill?: NullableEnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType | null
    durationInSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    totalQuestions?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type PassageCreateInput = {
    id?: string
    content: string
    passageOrder?: number | null
    section: SectionCreateNestedOneWithoutPassagesInput
    questions?: QuestionCreateNestedManyWithoutPassageInput
  }

  export type PassageUncheckedCreateInput = {
    id?: string
    sectionId: string
    content: string
    passageOrder?: number | null
    questions?: QuestionUncheckedCreateNestedManyWithoutPassageInput
  }

  export type PassageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    passageOrder?: NullableIntFieldUpdateOperationsInput | number | null
    section?: SectionUpdateOneRequiredWithoutPassagesNestedInput
    questions?: QuestionUpdateManyWithoutPassageNestedInput
  }

  export type PassageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    passageOrder?: NullableIntFieldUpdateOperationsInput | number | null
    questions?: QuestionUncheckedUpdateManyWithoutPassageNestedInput
  }

  export type PassageCreateManyInput = {
    id?: string
    sectionId: string
    content: string
    passageOrder?: number | null
  }

  export type PassageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    passageOrder?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type PassageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    passageOrder?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type QuestionCreateInput = {
    id?: string
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    questionOrder?: number | null
    passage?: PassageCreateNestedOneWithoutQuestionsInput
    section?: SectionCreateNestedOneWithoutQuestionsInput
    test?: TestCreateNestedOneWithoutQuestionsInput
    userAnswers?: UserAnswerCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUncheckedCreateInput = {
    id?: string
    sectionId?: string | null
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    passageId?: string | null
    questionOrder?: number | null
    testId?: string | null
    userAnswers?: UserAnswerUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    passage?: PassageUpdateOneWithoutQuestionsNestedInput
    section?: SectionUpdateOneWithoutQuestionsNestedInput
    test?: TestUpdateOneWithoutQuestionsNestedInput
    userAnswers?: UserAnswerUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    passageId?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    testId?: NullableStringFieldUpdateOperationsInput | string | null
    userAnswers?: UserAnswerUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionCreateManyInput = {
    id?: string
    sectionId?: string | null
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    passageId?: string | null
    questionOrder?: number | null
    testId?: string | null
  }

  export type QuestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type QuestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    passageId?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    testId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PracticeSessionCreateInput = {
    id?: string
    userId: string
    selectedSections?: PracticeSessionCreateselectedSectionsInput | string[]
    status: $Enums.SessionStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
    overallScaledScore?: number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    test: TestCreateNestedOneWithoutPracticeSessionsInput
    userAnswers?: UserAnswerCreateNestedManyWithoutPracticeSessionInput
  }

  export type PracticeSessionUncheckedCreateInput = {
    id?: string
    userId: string
    testId: string
    selectedSections?: PracticeSessionCreateselectedSectionsInput | string[]
    status: $Enums.SessionStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
    overallScaledScore?: number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    userAnswers?: UserAnswerUncheckedCreateNestedManyWithoutPracticeSessionInput
  }

  export type PracticeSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    selectedSections?: PracticeSessionUpdateselectedSectionsInput | string[]
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    overallScaledScore?: NullableFloatFieldUpdateOperationsInput | number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    test?: TestUpdateOneRequiredWithoutPracticeSessionsNestedInput
    userAnswers?: UserAnswerUpdateManyWithoutPracticeSessionNestedInput
  }

  export type PracticeSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    testId?: StringFieldUpdateOperationsInput | string
    selectedSections?: PracticeSessionUpdateselectedSectionsInput | string[]
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    overallScaledScore?: NullableFloatFieldUpdateOperationsInput | number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    userAnswers?: UserAnswerUncheckedUpdateManyWithoutPracticeSessionNestedInput
  }

  export type PracticeSessionCreateManyInput = {
    id?: string
    userId: string
    testId: string
    selectedSections?: PracticeSessionCreateselectedSectionsInput | string[]
    status: $Enums.SessionStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
    overallScaledScore?: number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
  }

  export type PracticeSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    selectedSections?: PracticeSessionUpdateselectedSectionsInput | string[]
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    overallScaledScore?: NullableFloatFieldUpdateOperationsInput | number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
  }

  export type PracticeSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    testId?: StringFieldUpdateOperationsInput | string
    selectedSections?: PracticeSessionUpdateselectedSectionsInput | string[]
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    overallScaledScore?: NullableFloatFieldUpdateOperationsInput | number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserAnswerCreateInput = {
    id?: string
    userId: string
    answerText?: string | null
    selectedOptionIndex?: number | null
    isCorrect?: boolean | null
    practiceSession: PracticeSessionCreateNestedOneWithoutUserAnswersInput
    question: QuestionCreateNestedOneWithoutUserAnswersInput
  }

  export type UserAnswerUncheckedCreateInput = {
    id?: string
    practiceSessionId: string
    questionId: string
    userId: string
    answerText?: string | null
    selectedOptionIndex?: number | null
    isCorrect?: boolean | null
  }

  export type UserAnswerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    selectedOptionIndex?: NullableIntFieldUpdateOperationsInput | number | null
    isCorrect?: NullableBoolFieldUpdateOperationsInput | boolean | null
    practiceSession?: PracticeSessionUpdateOneRequiredWithoutUserAnswersNestedInput
    question?: QuestionUpdateOneRequiredWithoutUserAnswersNestedInput
  }

  export type UserAnswerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    practiceSessionId?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    selectedOptionIndex?: NullableIntFieldUpdateOperationsInput | number | null
    isCorrect?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type UserAnswerCreateManyInput = {
    id?: string
    practiceSessionId: string
    questionId: string
    userId: string
    answerText?: string | null
    selectedOptionIndex?: number | null
    isCorrect?: boolean | null
  }

  export type UserAnswerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    selectedOptionIndex?: NullableIntFieldUpdateOperationsInput | number | null
    isCorrect?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type UserAnswerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    practiceSessionId?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    selectedOptionIndex?: NullableIntFieldUpdateOperationsInput | number | null
    isCorrect?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type ScoreConversionCreateInput = {
    id?: string
    skill: $Enums.SkillType
    rawScore: number
    scaledScore: number
    englishTestType: EnglishTestTypeCreateNestedOneWithoutScoreConversionsInput
  }

  export type ScoreConversionUncheckedCreateInput = {
    id?: string
    englishTestTypeId: string
    skill: $Enums.SkillType
    rawScore: number
    scaledScore: number
  }

  export type ScoreConversionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
    rawScore?: IntFieldUpdateOperationsInput | number
    scaledScore?: FloatFieldUpdateOperationsInput | number
    englishTestType?: EnglishTestTypeUpdateOneRequiredWithoutScoreConversionsNestedInput
  }

  export type ScoreConversionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    englishTestTypeId?: StringFieldUpdateOperationsInput | string
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
    rawScore?: IntFieldUpdateOperationsInput | number
    scaledScore?: FloatFieldUpdateOperationsInput | number
  }

  export type ScoreConversionCreateManyInput = {
    id?: string
    englishTestTypeId: string
    skill: $Enums.SkillType
    rawScore: number
    scaledScore: number
  }

  export type ScoreConversionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
    rawScore?: IntFieldUpdateOperationsInput | number
    scaledScore?: FloatFieldUpdateOperationsInput | number
  }

  export type ScoreConversionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    englishTestTypeId?: StringFieldUpdateOperationsInput | string
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
    rawScore?: IntFieldUpdateOperationsInput | number
    scaledScore?: FloatFieldUpdateOperationsInput | number
  }

  export type TestSkillCreateInput = {
    skill: $Enums.SkillType
    test: TestCreateNestedOneWithoutTestSkillsInput
  }

  export type TestSkillUncheckedCreateInput = {
    testId: string
    skill: $Enums.SkillType
  }

  export type TestSkillUpdateInput = {
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
    test?: TestUpdateOneRequiredWithoutTestSkillsNestedInput
  }

  export type TestSkillUncheckedUpdateInput = {
    testId?: StringFieldUpdateOperationsInput | string
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
  }

  export type TestSkillCreateManyInput = {
    testId: string
    skill: $Enums.SkillType
  }

  export type TestSkillUpdateManyMutationInput = {
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
  }

  export type TestSkillUncheckedUpdateManyInput = {
    testId?: StringFieldUpdateOperationsInput | string
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
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

  export type ScoreConversionListRelationFilter = {
    every?: ScoreConversionWhereInput
    some?: ScoreConversionWhereInput
    none?: ScoreConversionWhereInput
  }

  export type TestListRelationFilter = {
    every?: TestWhereInput
    some?: TestWhereInput
    none?: TestWhereInput
  }

  export type ScoreConversionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EnglishTestTypeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type EnglishTestTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type EnglishTestTypeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
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

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
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

  export type EnumTestTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TestType | EnumTestTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TestType[] | ListEnumTestTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TestType[] | ListEnumTestTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTestTypeNullableFilter<$PrismaModel> | $Enums.TestType | null
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

  export type CourseTestListRelationFilter = {
    every?: CourseTestWhereInput
    some?: CourseTestWhereInput
    none?: CourseTestWhereInput
  }

  export type PracticeSessionListRelationFilter = {
    every?: PracticeSessionWhereInput
    some?: PracticeSessionWhereInput
    none?: PracticeSessionWhereInput
  }

  export type QuestionListRelationFilter = {
    every?: QuestionWhereInput
    some?: QuestionWhereInput
    none?: QuestionWhereInput
  }

  export type SectionListRelationFilter = {
    every?: SectionWhereInput
    some?: SectionWhereInput
    none?: SectionWhereInput
  }

  export type TestSkillListRelationFilter = {
    every?: TestSkillWhereInput
    some?: TestSkillWhereInput
    none?: TestSkillWhereInput
  }

  export type EnglishTestTypeScalarRelationFilter = {
    is?: EnglishTestTypeWhereInput
    isNot?: EnglishTestTypeWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CourseTestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PracticeSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TestSkillOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TestCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    durationInMinutes?: SortOrder
    totalScore?: SortOrder
    passingScore?: SortOrder
    englishTestTypeId?: SortOrder
    practiceCount?: SortOrder
    createdAt?: SortOrder
    maxAttempts?: SortOrder
    testType?: SortOrder
    updatedAt?: SortOrder
  }

  export type TestAvgOrderByAggregateInput = {
    durationInMinutes?: SortOrder
    totalScore?: SortOrder
    passingScore?: SortOrder
    practiceCount?: SortOrder
    maxAttempts?: SortOrder
  }

  export type TestMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    durationInMinutes?: SortOrder
    totalScore?: SortOrder
    passingScore?: SortOrder
    englishTestTypeId?: SortOrder
    practiceCount?: SortOrder
    createdAt?: SortOrder
    maxAttempts?: SortOrder
    testType?: SortOrder
    updatedAt?: SortOrder
  }

  export type TestMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    durationInMinutes?: SortOrder
    totalScore?: SortOrder
    passingScore?: SortOrder
    englishTestTypeId?: SortOrder
    practiceCount?: SortOrder
    createdAt?: SortOrder
    maxAttempts?: SortOrder
    testType?: SortOrder
    updatedAt?: SortOrder
  }

  export type TestSumOrderByAggregateInput = {
    durationInMinutes?: SortOrder
    totalScore?: SortOrder
    passingScore?: SortOrder
    practiceCount?: SortOrder
    maxAttempts?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
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

  export type EnumTestTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TestType | EnumTestTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TestType[] | ListEnumTestTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TestType[] | ListEnumTestTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTestTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.TestType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTestTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumTestTypeNullableFilter<$PrismaModel>
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

  export type TestScalarRelationFilter = {
    is?: TestWhereInput
    isNot?: TestWhereInput
  }

  export type CourseTestCourseIdTestIdCompoundUniqueInput = {
    courseId: string
    testId: string
  }

  export type CourseTestCountOrderByAggregateInput = {
    courseId?: SortOrder
    testId?: SortOrder
  }

  export type CourseTestMaxOrderByAggregateInput = {
    courseId?: SortOrder
    testId?: SortOrder
  }

  export type CourseTestMinOrderByAggregateInput = {
    courseId?: SortOrder
    testId?: SortOrder
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

  export type EnumSkillTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SkillType | EnumSkillTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSkillTypeNullableFilter<$PrismaModel> | $Enums.SkillType | null
  }

  export type PassageListRelationFilter = {
    every?: PassageWhereInput
    some?: PassageWhereInput
    none?: PassageWhereInput
  }

  export type TestNullableScalarRelationFilter = {
    is?: TestWhereInput | null
    isNot?: TestWhereInput | null
  }

  export type PassageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SectionCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    testId?: SortOrder
    skill?: SortOrder
    durationInSeconds?: SortOrder
    totalQuestions?: SortOrder
    totalScore?: SortOrder
  }

  export type SectionAvgOrderByAggregateInput = {
    durationInSeconds?: SortOrder
    totalQuestions?: SortOrder
    totalScore?: SortOrder
  }

  export type SectionMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    testId?: SortOrder
    skill?: SortOrder
    durationInSeconds?: SortOrder
    totalQuestions?: SortOrder
    totalScore?: SortOrder
  }

  export type SectionMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    testId?: SortOrder
    skill?: SortOrder
    durationInSeconds?: SortOrder
    totalQuestions?: SortOrder
    totalScore?: SortOrder
  }

  export type SectionSumOrderByAggregateInput = {
    durationInSeconds?: SortOrder
    totalQuestions?: SortOrder
    totalScore?: SortOrder
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

  export type EnumSkillTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SkillType | EnumSkillTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSkillTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.SkillType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumSkillTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumSkillTypeNullableFilter<$PrismaModel>
  }

  export type SectionScalarRelationFilter = {
    is?: SectionWhereInput
    isNot?: SectionWhereInput
  }

  export type PassageSectionIdPassageOrderCompoundUniqueInput = {
    sectionId: string
    passageOrder: number
  }

  export type PassageCountOrderByAggregateInput = {
    id?: SortOrder
    sectionId?: SortOrder
    content?: SortOrder
    passageOrder?: SortOrder
  }

  export type PassageAvgOrderByAggregateInput = {
    passageOrder?: SortOrder
  }

  export type PassageMaxOrderByAggregateInput = {
    id?: SortOrder
    sectionId?: SortOrder
    content?: SortOrder
    passageOrder?: SortOrder
  }

  export type PassageMinOrderByAggregateInput = {
    id?: SortOrder
    sectionId?: SortOrder
    content?: SortOrder
    passageOrder?: SortOrder
  }

  export type PassageSumOrderByAggregateInput = {
    passageOrder?: SortOrder
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

  export type EnumQuestionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeFilter<$PrismaModel> | $Enums.QuestionType
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type PassageNullableScalarRelationFilter = {
    is?: PassageWhereInput | null
    isNot?: PassageWhereInput | null
  }

  export type SectionNullableScalarRelationFilter = {
    is?: SectionWhereInput | null
    isNot?: SectionWhereInput | null
  }

  export type UserAnswerListRelationFilter = {
    every?: UserAnswerWhereInput
    some?: UserAnswerWhereInput
    none?: UserAnswerWhereInput
  }

  export type UserAnswerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type QuestionCountOrderByAggregateInput = {
    id?: SortOrder
    sectionId?: SortOrder
    questionText?: SortOrder
    imageUrl?: SortOrder
    questionType?: SortOrder
    options?: SortOrder
    correctAnswerIndex?: SortOrder
    wordLimit?: SortOrder
    correctAnswer?: SortOrder
    passageId?: SortOrder
    questionOrder?: SortOrder
    testId?: SortOrder
  }

  export type QuestionAvgOrderByAggregateInput = {
    correctAnswerIndex?: SortOrder
    wordLimit?: SortOrder
    questionOrder?: SortOrder
  }

  export type QuestionMaxOrderByAggregateInput = {
    id?: SortOrder
    sectionId?: SortOrder
    questionText?: SortOrder
    imageUrl?: SortOrder
    questionType?: SortOrder
    correctAnswerIndex?: SortOrder
    wordLimit?: SortOrder
    correctAnswer?: SortOrder
    passageId?: SortOrder
    questionOrder?: SortOrder
    testId?: SortOrder
  }

  export type QuestionMinOrderByAggregateInput = {
    id?: SortOrder
    sectionId?: SortOrder
    questionText?: SortOrder
    imageUrl?: SortOrder
    questionType?: SortOrder
    correctAnswerIndex?: SortOrder
    wordLimit?: SortOrder
    correctAnswer?: SortOrder
    passageId?: SortOrder
    questionOrder?: SortOrder
    testId?: SortOrder
  }

  export type QuestionSumOrderByAggregateInput = {
    correctAnswerIndex?: SortOrder
    wordLimit?: SortOrder
    questionOrder?: SortOrder
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

  export type EnumQuestionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel> | $Enums.QuestionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuestionTypeFilter<$PrismaModel>
    _max?: NestedEnumQuestionTypeFilter<$PrismaModel>
  }

  export type EnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
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

  export type PracticeSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    testId?: SortOrder
    selectedSections?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
    overallScaledScore?: SortOrder
    rawScoresBySkill?: SortOrder
    scoresBySkill?: SortOrder
  }

  export type PracticeSessionAvgOrderByAggregateInput = {
    overallScaledScore?: SortOrder
  }

  export type PracticeSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    testId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
    overallScaledScore?: SortOrder
  }

  export type PracticeSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    testId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    completedAt?: SortOrder
    overallScaledScore?: SortOrder
  }

  export type PracticeSessionSumOrderByAggregateInput = {
    overallScaledScore?: SortOrder
  }

  export type EnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
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

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type PracticeSessionScalarRelationFilter = {
    is?: PracticeSessionWhereInput
    isNot?: PracticeSessionWhereInput
  }

  export type QuestionScalarRelationFilter = {
    is?: QuestionWhereInput
    isNot?: QuestionWhereInput
  }

  export type UserAnswerPracticeSessionIdQuestionIdUserIdCompoundUniqueInput = {
    practiceSessionId: string
    questionId: string
    userId: string
  }

  export type UserAnswerCountOrderByAggregateInput = {
    id?: SortOrder
    practiceSessionId?: SortOrder
    questionId?: SortOrder
    userId?: SortOrder
    answerText?: SortOrder
    selectedOptionIndex?: SortOrder
    isCorrect?: SortOrder
  }

  export type UserAnswerAvgOrderByAggregateInput = {
    selectedOptionIndex?: SortOrder
  }

  export type UserAnswerMaxOrderByAggregateInput = {
    id?: SortOrder
    practiceSessionId?: SortOrder
    questionId?: SortOrder
    userId?: SortOrder
    answerText?: SortOrder
    selectedOptionIndex?: SortOrder
    isCorrect?: SortOrder
  }

  export type UserAnswerMinOrderByAggregateInput = {
    id?: SortOrder
    practiceSessionId?: SortOrder
    questionId?: SortOrder
    userId?: SortOrder
    answerText?: SortOrder
    selectedOptionIndex?: SortOrder
    isCorrect?: SortOrder
  }

  export type UserAnswerSumOrderByAggregateInput = {
    selectedOptionIndex?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type EnumSkillTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SkillType | EnumSkillTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSkillTypeFilter<$PrismaModel> | $Enums.SkillType
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

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ScoreConversionCountOrderByAggregateInput = {
    id?: SortOrder
    englishTestTypeId?: SortOrder
    skill?: SortOrder
    rawScore?: SortOrder
    scaledScore?: SortOrder
  }

  export type ScoreConversionAvgOrderByAggregateInput = {
    rawScore?: SortOrder
    scaledScore?: SortOrder
  }

  export type ScoreConversionMaxOrderByAggregateInput = {
    id?: SortOrder
    englishTestTypeId?: SortOrder
    skill?: SortOrder
    rawScore?: SortOrder
    scaledScore?: SortOrder
  }

  export type ScoreConversionMinOrderByAggregateInput = {
    id?: SortOrder
    englishTestTypeId?: SortOrder
    skill?: SortOrder
    rawScore?: SortOrder
    scaledScore?: SortOrder
  }

  export type ScoreConversionSumOrderByAggregateInput = {
    rawScore?: SortOrder
    scaledScore?: SortOrder
  }

  export type EnumSkillTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SkillType | EnumSkillTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSkillTypeWithAggregatesFilter<$PrismaModel> | $Enums.SkillType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSkillTypeFilter<$PrismaModel>
    _max?: NestedEnumSkillTypeFilter<$PrismaModel>
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

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type TestSkillTestIdSkillCompoundUniqueInput = {
    testId: string
    skill: $Enums.SkillType
  }

  export type TestSkillCountOrderByAggregateInput = {
    testId?: SortOrder
    skill?: SortOrder
  }

  export type TestSkillMaxOrderByAggregateInput = {
    testId?: SortOrder
    skill?: SortOrder
  }

  export type TestSkillMinOrderByAggregateInput = {
    testId?: SortOrder
    skill?: SortOrder
  }

  export type ScoreConversionCreateNestedManyWithoutEnglishTestTypeInput = {
    create?: XOR<ScoreConversionCreateWithoutEnglishTestTypeInput, ScoreConversionUncheckedCreateWithoutEnglishTestTypeInput> | ScoreConversionCreateWithoutEnglishTestTypeInput[] | ScoreConversionUncheckedCreateWithoutEnglishTestTypeInput[]
    connectOrCreate?: ScoreConversionCreateOrConnectWithoutEnglishTestTypeInput | ScoreConversionCreateOrConnectWithoutEnglishTestTypeInput[]
    createMany?: ScoreConversionCreateManyEnglishTestTypeInputEnvelope
    connect?: ScoreConversionWhereUniqueInput | ScoreConversionWhereUniqueInput[]
  }

  export type TestCreateNestedManyWithoutEnglishTestTypeInput = {
    create?: XOR<TestCreateWithoutEnglishTestTypeInput, TestUncheckedCreateWithoutEnglishTestTypeInput> | TestCreateWithoutEnglishTestTypeInput[] | TestUncheckedCreateWithoutEnglishTestTypeInput[]
    connectOrCreate?: TestCreateOrConnectWithoutEnglishTestTypeInput | TestCreateOrConnectWithoutEnglishTestTypeInput[]
    createMany?: TestCreateManyEnglishTestTypeInputEnvelope
    connect?: TestWhereUniqueInput | TestWhereUniqueInput[]
  }

  export type ScoreConversionUncheckedCreateNestedManyWithoutEnglishTestTypeInput = {
    create?: XOR<ScoreConversionCreateWithoutEnglishTestTypeInput, ScoreConversionUncheckedCreateWithoutEnglishTestTypeInput> | ScoreConversionCreateWithoutEnglishTestTypeInput[] | ScoreConversionUncheckedCreateWithoutEnglishTestTypeInput[]
    connectOrCreate?: ScoreConversionCreateOrConnectWithoutEnglishTestTypeInput | ScoreConversionCreateOrConnectWithoutEnglishTestTypeInput[]
    createMany?: ScoreConversionCreateManyEnglishTestTypeInputEnvelope
    connect?: ScoreConversionWhereUniqueInput | ScoreConversionWhereUniqueInput[]
  }

  export type TestUncheckedCreateNestedManyWithoutEnglishTestTypeInput = {
    create?: XOR<TestCreateWithoutEnglishTestTypeInput, TestUncheckedCreateWithoutEnglishTestTypeInput> | TestCreateWithoutEnglishTestTypeInput[] | TestUncheckedCreateWithoutEnglishTestTypeInput[]
    connectOrCreate?: TestCreateOrConnectWithoutEnglishTestTypeInput | TestCreateOrConnectWithoutEnglishTestTypeInput[]
    createMany?: TestCreateManyEnglishTestTypeInputEnvelope
    connect?: TestWhereUniqueInput | TestWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type ScoreConversionUpdateManyWithoutEnglishTestTypeNestedInput = {
    create?: XOR<ScoreConversionCreateWithoutEnglishTestTypeInput, ScoreConversionUncheckedCreateWithoutEnglishTestTypeInput> | ScoreConversionCreateWithoutEnglishTestTypeInput[] | ScoreConversionUncheckedCreateWithoutEnglishTestTypeInput[]
    connectOrCreate?: ScoreConversionCreateOrConnectWithoutEnglishTestTypeInput | ScoreConversionCreateOrConnectWithoutEnglishTestTypeInput[]
    upsert?: ScoreConversionUpsertWithWhereUniqueWithoutEnglishTestTypeInput | ScoreConversionUpsertWithWhereUniqueWithoutEnglishTestTypeInput[]
    createMany?: ScoreConversionCreateManyEnglishTestTypeInputEnvelope
    set?: ScoreConversionWhereUniqueInput | ScoreConversionWhereUniqueInput[]
    disconnect?: ScoreConversionWhereUniqueInput | ScoreConversionWhereUniqueInput[]
    delete?: ScoreConversionWhereUniqueInput | ScoreConversionWhereUniqueInput[]
    connect?: ScoreConversionWhereUniqueInput | ScoreConversionWhereUniqueInput[]
    update?: ScoreConversionUpdateWithWhereUniqueWithoutEnglishTestTypeInput | ScoreConversionUpdateWithWhereUniqueWithoutEnglishTestTypeInput[]
    updateMany?: ScoreConversionUpdateManyWithWhereWithoutEnglishTestTypeInput | ScoreConversionUpdateManyWithWhereWithoutEnglishTestTypeInput[]
    deleteMany?: ScoreConversionScalarWhereInput | ScoreConversionScalarWhereInput[]
  }

  export type TestUpdateManyWithoutEnglishTestTypeNestedInput = {
    create?: XOR<TestCreateWithoutEnglishTestTypeInput, TestUncheckedCreateWithoutEnglishTestTypeInput> | TestCreateWithoutEnglishTestTypeInput[] | TestUncheckedCreateWithoutEnglishTestTypeInput[]
    connectOrCreate?: TestCreateOrConnectWithoutEnglishTestTypeInput | TestCreateOrConnectWithoutEnglishTestTypeInput[]
    upsert?: TestUpsertWithWhereUniqueWithoutEnglishTestTypeInput | TestUpsertWithWhereUniqueWithoutEnglishTestTypeInput[]
    createMany?: TestCreateManyEnglishTestTypeInputEnvelope
    set?: TestWhereUniqueInput | TestWhereUniqueInput[]
    disconnect?: TestWhereUniqueInput | TestWhereUniqueInput[]
    delete?: TestWhereUniqueInput | TestWhereUniqueInput[]
    connect?: TestWhereUniqueInput | TestWhereUniqueInput[]
    update?: TestUpdateWithWhereUniqueWithoutEnglishTestTypeInput | TestUpdateWithWhereUniqueWithoutEnglishTestTypeInput[]
    updateMany?: TestUpdateManyWithWhereWithoutEnglishTestTypeInput | TestUpdateManyWithWhereWithoutEnglishTestTypeInput[]
    deleteMany?: TestScalarWhereInput | TestScalarWhereInput[]
  }

  export type ScoreConversionUncheckedUpdateManyWithoutEnglishTestTypeNestedInput = {
    create?: XOR<ScoreConversionCreateWithoutEnglishTestTypeInput, ScoreConversionUncheckedCreateWithoutEnglishTestTypeInput> | ScoreConversionCreateWithoutEnglishTestTypeInput[] | ScoreConversionUncheckedCreateWithoutEnglishTestTypeInput[]
    connectOrCreate?: ScoreConversionCreateOrConnectWithoutEnglishTestTypeInput | ScoreConversionCreateOrConnectWithoutEnglishTestTypeInput[]
    upsert?: ScoreConversionUpsertWithWhereUniqueWithoutEnglishTestTypeInput | ScoreConversionUpsertWithWhereUniqueWithoutEnglishTestTypeInput[]
    createMany?: ScoreConversionCreateManyEnglishTestTypeInputEnvelope
    set?: ScoreConversionWhereUniqueInput | ScoreConversionWhereUniqueInput[]
    disconnect?: ScoreConversionWhereUniqueInput | ScoreConversionWhereUniqueInput[]
    delete?: ScoreConversionWhereUniqueInput | ScoreConversionWhereUniqueInput[]
    connect?: ScoreConversionWhereUniqueInput | ScoreConversionWhereUniqueInput[]
    update?: ScoreConversionUpdateWithWhereUniqueWithoutEnglishTestTypeInput | ScoreConversionUpdateWithWhereUniqueWithoutEnglishTestTypeInput[]
    updateMany?: ScoreConversionUpdateManyWithWhereWithoutEnglishTestTypeInput | ScoreConversionUpdateManyWithWhereWithoutEnglishTestTypeInput[]
    deleteMany?: ScoreConversionScalarWhereInput | ScoreConversionScalarWhereInput[]
  }

  export type TestUncheckedUpdateManyWithoutEnglishTestTypeNestedInput = {
    create?: XOR<TestCreateWithoutEnglishTestTypeInput, TestUncheckedCreateWithoutEnglishTestTypeInput> | TestCreateWithoutEnglishTestTypeInput[] | TestUncheckedCreateWithoutEnglishTestTypeInput[]
    connectOrCreate?: TestCreateOrConnectWithoutEnglishTestTypeInput | TestCreateOrConnectWithoutEnglishTestTypeInput[]
    upsert?: TestUpsertWithWhereUniqueWithoutEnglishTestTypeInput | TestUpsertWithWhereUniqueWithoutEnglishTestTypeInput[]
    createMany?: TestCreateManyEnglishTestTypeInputEnvelope
    set?: TestWhereUniqueInput | TestWhereUniqueInput[]
    disconnect?: TestWhereUniqueInput | TestWhereUniqueInput[]
    delete?: TestWhereUniqueInput | TestWhereUniqueInput[]
    connect?: TestWhereUniqueInput | TestWhereUniqueInput[]
    update?: TestUpdateWithWhereUniqueWithoutEnglishTestTypeInput | TestUpdateWithWhereUniqueWithoutEnglishTestTypeInput[]
    updateMany?: TestUpdateManyWithWhereWithoutEnglishTestTypeInput | TestUpdateManyWithWhereWithoutEnglishTestTypeInput[]
    deleteMany?: TestScalarWhereInput | TestScalarWhereInput[]
  }

  export type CourseTestCreateNestedManyWithoutTestInput = {
    create?: XOR<CourseTestCreateWithoutTestInput, CourseTestUncheckedCreateWithoutTestInput> | CourseTestCreateWithoutTestInput[] | CourseTestUncheckedCreateWithoutTestInput[]
    connectOrCreate?: CourseTestCreateOrConnectWithoutTestInput | CourseTestCreateOrConnectWithoutTestInput[]
    createMany?: CourseTestCreateManyTestInputEnvelope
    connect?: CourseTestWhereUniqueInput | CourseTestWhereUniqueInput[]
  }

  export type PracticeSessionCreateNestedManyWithoutTestInput = {
    create?: XOR<PracticeSessionCreateWithoutTestInput, PracticeSessionUncheckedCreateWithoutTestInput> | PracticeSessionCreateWithoutTestInput[] | PracticeSessionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: PracticeSessionCreateOrConnectWithoutTestInput | PracticeSessionCreateOrConnectWithoutTestInput[]
    createMany?: PracticeSessionCreateManyTestInputEnvelope
    connect?: PracticeSessionWhereUniqueInput | PracticeSessionWhereUniqueInput[]
  }

  export type QuestionCreateNestedManyWithoutTestInput = {
    create?: XOR<QuestionCreateWithoutTestInput, QuestionUncheckedCreateWithoutTestInput> | QuestionCreateWithoutTestInput[] | QuestionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutTestInput | QuestionCreateOrConnectWithoutTestInput[]
    createMany?: QuestionCreateManyTestInputEnvelope
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
  }

  export type SectionCreateNestedManyWithoutTestInput = {
    create?: XOR<SectionCreateWithoutTestInput, SectionUncheckedCreateWithoutTestInput> | SectionCreateWithoutTestInput[] | SectionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: SectionCreateOrConnectWithoutTestInput | SectionCreateOrConnectWithoutTestInput[]
    createMany?: SectionCreateManyTestInputEnvelope
    connect?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
  }

  export type TestSkillCreateNestedManyWithoutTestInput = {
    create?: XOR<TestSkillCreateWithoutTestInput, TestSkillUncheckedCreateWithoutTestInput> | TestSkillCreateWithoutTestInput[] | TestSkillUncheckedCreateWithoutTestInput[]
    connectOrCreate?: TestSkillCreateOrConnectWithoutTestInput | TestSkillCreateOrConnectWithoutTestInput[]
    createMany?: TestSkillCreateManyTestInputEnvelope
    connect?: TestSkillWhereUniqueInput | TestSkillWhereUniqueInput[]
  }

  export type EnglishTestTypeCreateNestedOneWithoutTestsInput = {
    create?: XOR<EnglishTestTypeCreateWithoutTestsInput, EnglishTestTypeUncheckedCreateWithoutTestsInput>
    connectOrCreate?: EnglishTestTypeCreateOrConnectWithoutTestsInput
    connect?: EnglishTestTypeWhereUniqueInput
  }

  export type CourseTestUncheckedCreateNestedManyWithoutTestInput = {
    create?: XOR<CourseTestCreateWithoutTestInput, CourseTestUncheckedCreateWithoutTestInput> | CourseTestCreateWithoutTestInput[] | CourseTestUncheckedCreateWithoutTestInput[]
    connectOrCreate?: CourseTestCreateOrConnectWithoutTestInput | CourseTestCreateOrConnectWithoutTestInput[]
    createMany?: CourseTestCreateManyTestInputEnvelope
    connect?: CourseTestWhereUniqueInput | CourseTestWhereUniqueInput[]
  }

  export type PracticeSessionUncheckedCreateNestedManyWithoutTestInput = {
    create?: XOR<PracticeSessionCreateWithoutTestInput, PracticeSessionUncheckedCreateWithoutTestInput> | PracticeSessionCreateWithoutTestInput[] | PracticeSessionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: PracticeSessionCreateOrConnectWithoutTestInput | PracticeSessionCreateOrConnectWithoutTestInput[]
    createMany?: PracticeSessionCreateManyTestInputEnvelope
    connect?: PracticeSessionWhereUniqueInput | PracticeSessionWhereUniqueInput[]
  }

  export type QuestionUncheckedCreateNestedManyWithoutTestInput = {
    create?: XOR<QuestionCreateWithoutTestInput, QuestionUncheckedCreateWithoutTestInput> | QuestionCreateWithoutTestInput[] | QuestionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutTestInput | QuestionCreateOrConnectWithoutTestInput[]
    createMany?: QuestionCreateManyTestInputEnvelope
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
  }

  export type SectionUncheckedCreateNestedManyWithoutTestInput = {
    create?: XOR<SectionCreateWithoutTestInput, SectionUncheckedCreateWithoutTestInput> | SectionCreateWithoutTestInput[] | SectionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: SectionCreateOrConnectWithoutTestInput | SectionCreateOrConnectWithoutTestInput[]
    createMany?: SectionCreateManyTestInputEnvelope
    connect?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
  }

  export type TestSkillUncheckedCreateNestedManyWithoutTestInput = {
    create?: XOR<TestSkillCreateWithoutTestInput, TestSkillUncheckedCreateWithoutTestInput> | TestSkillCreateWithoutTestInput[] | TestSkillUncheckedCreateWithoutTestInput[]
    connectOrCreate?: TestSkillCreateOrConnectWithoutTestInput | TestSkillCreateOrConnectWithoutTestInput[]
    createMany?: TestSkillCreateManyTestInputEnvelope
    connect?: TestSkillWhereUniqueInput | TestSkillWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableEnumTestTypeFieldUpdateOperationsInput = {
    set?: $Enums.TestType | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type CourseTestUpdateManyWithoutTestNestedInput = {
    create?: XOR<CourseTestCreateWithoutTestInput, CourseTestUncheckedCreateWithoutTestInput> | CourseTestCreateWithoutTestInput[] | CourseTestUncheckedCreateWithoutTestInput[]
    connectOrCreate?: CourseTestCreateOrConnectWithoutTestInput | CourseTestCreateOrConnectWithoutTestInput[]
    upsert?: CourseTestUpsertWithWhereUniqueWithoutTestInput | CourseTestUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: CourseTestCreateManyTestInputEnvelope
    set?: CourseTestWhereUniqueInput | CourseTestWhereUniqueInput[]
    disconnect?: CourseTestWhereUniqueInput | CourseTestWhereUniqueInput[]
    delete?: CourseTestWhereUniqueInput | CourseTestWhereUniqueInput[]
    connect?: CourseTestWhereUniqueInput | CourseTestWhereUniqueInput[]
    update?: CourseTestUpdateWithWhereUniqueWithoutTestInput | CourseTestUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: CourseTestUpdateManyWithWhereWithoutTestInput | CourseTestUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: CourseTestScalarWhereInput | CourseTestScalarWhereInput[]
  }

  export type PracticeSessionUpdateManyWithoutTestNestedInput = {
    create?: XOR<PracticeSessionCreateWithoutTestInput, PracticeSessionUncheckedCreateWithoutTestInput> | PracticeSessionCreateWithoutTestInput[] | PracticeSessionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: PracticeSessionCreateOrConnectWithoutTestInput | PracticeSessionCreateOrConnectWithoutTestInput[]
    upsert?: PracticeSessionUpsertWithWhereUniqueWithoutTestInput | PracticeSessionUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: PracticeSessionCreateManyTestInputEnvelope
    set?: PracticeSessionWhereUniqueInput | PracticeSessionWhereUniqueInput[]
    disconnect?: PracticeSessionWhereUniqueInput | PracticeSessionWhereUniqueInput[]
    delete?: PracticeSessionWhereUniqueInput | PracticeSessionWhereUniqueInput[]
    connect?: PracticeSessionWhereUniqueInput | PracticeSessionWhereUniqueInput[]
    update?: PracticeSessionUpdateWithWhereUniqueWithoutTestInput | PracticeSessionUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: PracticeSessionUpdateManyWithWhereWithoutTestInput | PracticeSessionUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: PracticeSessionScalarWhereInput | PracticeSessionScalarWhereInput[]
  }

  export type QuestionUpdateManyWithoutTestNestedInput = {
    create?: XOR<QuestionCreateWithoutTestInput, QuestionUncheckedCreateWithoutTestInput> | QuestionCreateWithoutTestInput[] | QuestionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutTestInput | QuestionCreateOrConnectWithoutTestInput[]
    upsert?: QuestionUpsertWithWhereUniqueWithoutTestInput | QuestionUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: QuestionCreateManyTestInputEnvelope
    set?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    disconnect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    delete?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    update?: QuestionUpdateWithWhereUniqueWithoutTestInput | QuestionUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: QuestionUpdateManyWithWhereWithoutTestInput | QuestionUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
  }

  export type SectionUpdateManyWithoutTestNestedInput = {
    create?: XOR<SectionCreateWithoutTestInput, SectionUncheckedCreateWithoutTestInput> | SectionCreateWithoutTestInput[] | SectionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: SectionCreateOrConnectWithoutTestInput | SectionCreateOrConnectWithoutTestInput[]
    upsert?: SectionUpsertWithWhereUniqueWithoutTestInput | SectionUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: SectionCreateManyTestInputEnvelope
    set?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    disconnect?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    delete?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    connect?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    update?: SectionUpdateWithWhereUniqueWithoutTestInput | SectionUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: SectionUpdateManyWithWhereWithoutTestInput | SectionUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: SectionScalarWhereInput | SectionScalarWhereInput[]
  }

  export type TestSkillUpdateManyWithoutTestNestedInput = {
    create?: XOR<TestSkillCreateWithoutTestInput, TestSkillUncheckedCreateWithoutTestInput> | TestSkillCreateWithoutTestInput[] | TestSkillUncheckedCreateWithoutTestInput[]
    connectOrCreate?: TestSkillCreateOrConnectWithoutTestInput | TestSkillCreateOrConnectWithoutTestInput[]
    upsert?: TestSkillUpsertWithWhereUniqueWithoutTestInput | TestSkillUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: TestSkillCreateManyTestInputEnvelope
    set?: TestSkillWhereUniqueInput | TestSkillWhereUniqueInput[]
    disconnect?: TestSkillWhereUniqueInput | TestSkillWhereUniqueInput[]
    delete?: TestSkillWhereUniqueInput | TestSkillWhereUniqueInput[]
    connect?: TestSkillWhereUniqueInput | TestSkillWhereUniqueInput[]
    update?: TestSkillUpdateWithWhereUniqueWithoutTestInput | TestSkillUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: TestSkillUpdateManyWithWhereWithoutTestInput | TestSkillUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: TestSkillScalarWhereInput | TestSkillScalarWhereInput[]
  }

  export type EnglishTestTypeUpdateOneRequiredWithoutTestsNestedInput = {
    create?: XOR<EnglishTestTypeCreateWithoutTestsInput, EnglishTestTypeUncheckedCreateWithoutTestsInput>
    connectOrCreate?: EnglishTestTypeCreateOrConnectWithoutTestsInput
    upsert?: EnglishTestTypeUpsertWithoutTestsInput
    connect?: EnglishTestTypeWhereUniqueInput
    update?: XOR<XOR<EnglishTestTypeUpdateToOneWithWhereWithoutTestsInput, EnglishTestTypeUpdateWithoutTestsInput>, EnglishTestTypeUncheckedUpdateWithoutTestsInput>
  }

  export type CourseTestUncheckedUpdateManyWithoutTestNestedInput = {
    create?: XOR<CourseTestCreateWithoutTestInput, CourseTestUncheckedCreateWithoutTestInput> | CourseTestCreateWithoutTestInput[] | CourseTestUncheckedCreateWithoutTestInput[]
    connectOrCreate?: CourseTestCreateOrConnectWithoutTestInput | CourseTestCreateOrConnectWithoutTestInput[]
    upsert?: CourseTestUpsertWithWhereUniqueWithoutTestInput | CourseTestUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: CourseTestCreateManyTestInputEnvelope
    set?: CourseTestWhereUniqueInput | CourseTestWhereUniqueInput[]
    disconnect?: CourseTestWhereUniqueInput | CourseTestWhereUniqueInput[]
    delete?: CourseTestWhereUniqueInput | CourseTestWhereUniqueInput[]
    connect?: CourseTestWhereUniqueInput | CourseTestWhereUniqueInput[]
    update?: CourseTestUpdateWithWhereUniqueWithoutTestInput | CourseTestUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: CourseTestUpdateManyWithWhereWithoutTestInput | CourseTestUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: CourseTestScalarWhereInput | CourseTestScalarWhereInput[]
  }

  export type PracticeSessionUncheckedUpdateManyWithoutTestNestedInput = {
    create?: XOR<PracticeSessionCreateWithoutTestInput, PracticeSessionUncheckedCreateWithoutTestInput> | PracticeSessionCreateWithoutTestInput[] | PracticeSessionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: PracticeSessionCreateOrConnectWithoutTestInput | PracticeSessionCreateOrConnectWithoutTestInput[]
    upsert?: PracticeSessionUpsertWithWhereUniqueWithoutTestInput | PracticeSessionUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: PracticeSessionCreateManyTestInputEnvelope
    set?: PracticeSessionWhereUniqueInput | PracticeSessionWhereUniqueInput[]
    disconnect?: PracticeSessionWhereUniqueInput | PracticeSessionWhereUniqueInput[]
    delete?: PracticeSessionWhereUniqueInput | PracticeSessionWhereUniqueInput[]
    connect?: PracticeSessionWhereUniqueInput | PracticeSessionWhereUniqueInput[]
    update?: PracticeSessionUpdateWithWhereUniqueWithoutTestInput | PracticeSessionUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: PracticeSessionUpdateManyWithWhereWithoutTestInput | PracticeSessionUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: PracticeSessionScalarWhereInput | PracticeSessionScalarWhereInput[]
  }

  export type QuestionUncheckedUpdateManyWithoutTestNestedInput = {
    create?: XOR<QuestionCreateWithoutTestInput, QuestionUncheckedCreateWithoutTestInput> | QuestionCreateWithoutTestInput[] | QuestionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutTestInput | QuestionCreateOrConnectWithoutTestInput[]
    upsert?: QuestionUpsertWithWhereUniqueWithoutTestInput | QuestionUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: QuestionCreateManyTestInputEnvelope
    set?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    disconnect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    delete?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    update?: QuestionUpdateWithWhereUniqueWithoutTestInput | QuestionUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: QuestionUpdateManyWithWhereWithoutTestInput | QuestionUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
  }

  export type SectionUncheckedUpdateManyWithoutTestNestedInput = {
    create?: XOR<SectionCreateWithoutTestInput, SectionUncheckedCreateWithoutTestInput> | SectionCreateWithoutTestInput[] | SectionUncheckedCreateWithoutTestInput[]
    connectOrCreate?: SectionCreateOrConnectWithoutTestInput | SectionCreateOrConnectWithoutTestInput[]
    upsert?: SectionUpsertWithWhereUniqueWithoutTestInput | SectionUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: SectionCreateManyTestInputEnvelope
    set?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    disconnect?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    delete?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    connect?: SectionWhereUniqueInput | SectionWhereUniqueInput[]
    update?: SectionUpdateWithWhereUniqueWithoutTestInput | SectionUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: SectionUpdateManyWithWhereWithoutTestInput | SectionUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: SectionScalarWhereInput | SectionScalarWhereInput[]
  }

  export type TestSkillUncheckedUpdateManyWithoutTestNestedInput = {
    create?: XOR<TestSkillCreateWithoutTestInput, TestSkillUncheckedCreateWithoutTestInput> | TestSkillCreateWithoutTestInput[] | TestSkillUncheckedCreateWithoutTestInput[]
    connectOrCreate?: TestSkillCreateOrConnectWithoutTestInput | TestSkillCreateOrConnectWithoutTestInput[]
    upsert?: TestSkillUpsertWithWhereUniqueWithoutTestInput | TestSkillUpsertWithWhereUniqueWithoutTestInput[]
    createMany?: TestSkillCreateManyTestInputEnvelope
    set?: TestSkillWhereUniqueInput | TestSkillWhereUniqueInput[]
    disconnect?: TestSkillWhereUniqueInput | TestSkillWhereUniqueInput[]
    delete?: TestSkillWhereUniqueInput | TestSkillWhereUniqueInput[]
    connect?: TestSkillWhereUniqueInput | TestSkillWhereUniqueInput[]
    update?: TestSkillUpdateWithWhereUniqueWithoutTestInput | TestSkillUpdateWithWhereUniqueWithoutTestInput[]
    updateMany?: TestSkillUpdateManyWithWhereWithoutTestInput | TestSkillUpdateManyWithWhereWithoutTestInput[]
    deleteMany?: TestSkillScalarWhereInput | TestSkillScalarWhereInput[]
  }

  export type TestCreateNestedOneWithoutCourseTestsInput = {
    create?: XOR<TestCreateWithoutCourseTestsInput, TestUncheckedCreateWithoutCourseTestsInput>
    connectOrCreate?: TestCreateOrConnectWithoutCourseTestsInput
    connect?: TestWhereUniqueInput
  }

  export type TestUpdateOneRequiredWithoutCourseTestsNestedInput = {
    create?: XOR<TestCreateWithoutCourseTestsInput, TestUncheckedCreateWithoutCourseTestsInput>
    connectOrCreate?: TestCreateOrConnectWithoutCourseTestsInput
    upsert?: TestUpsertWithoutCourseTestsInput
    connect?: TestWhereUniqueInput
    update?: XOR<XOR<TestUpdateToOneWithWhereWithoutCourseTestsInput, TestUpdateWithoutCourseTestsInput>, TestUncheckedUpdateWithoutCourseTestsInput>
  }

  export type PassageCreateNestedManyWithoutSectionInput = {
    create?: XOR<PassageCreateWithoutSectionInput, PassageUncheckedCreateWithoutSectionInput> | PassageCreateWithoutSectionInput[] | PassageUncheckedCreateWithoutSectionInput[]
    connectOrCreate?: PassageCreateOrConnectWithoutSectionInput | PassageCreateOrConnectWithoutSectionInput[]
    createMany?: PassageCreateManySectionInputEnvelope
    connect?: PassageWhereUniqueInput | PassageWhereUniqueInput[]
  }

  export type QuestionCreateNestedManyWithoutSectionInput = {
    create?: XOR<QuestionCreateWithoutSectionInput, QuestionUncheckedCreateWithoutSectionInput> | QuestionCreateWithoutSectionInput[] | QuestionUncheckedCreateWithoutSectionInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutSectionInput | QuestionCreateOrConnectWithoutSectionInput[]
    createMany?: QuestionCreateManySectionInputEnvelope
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
  }

  export type TestCreateNestedOneWithoutSectionsInput = {
    create?: XOR<TestCreateWithoutSectionsInput, TestUncheckedCreateWithoutSectionsInput>
    connectOrCreate?: TestCreateOrConnectWithoutSectionsInput
    connect?: TestWhereUniqueInput
  }

  export type PassageUncheckedCreateNestedManyWithoutSectionInput = {
    create?: XOR<PassageCreateWithoutSectionInput, PassageUncheckedCreateWithoutSectionInput> | PassageCreateWithoutSectionInput[] | PassageUncheckedCreateWithoutSectionInput[]
    connectOrCreate?: PassageCreateOrConnectWithoutSectionInput | PassageCreateOrConnectWithoutSectionInput[]
    createMany?: PassageCreateManySectionInputEnvelope
    connect?: PassageWhereUniqueInput | PassageWhereUniqueInput[]
  }

  export type QuestionUncheckedCreateNestedManyWithoutSectionInput = {
    create?: XOR<QuestionCreateWithoutSectionInput, QuestionUncheckedCreateWithoutSectionInput> | QuestionCreateWithoutSectionInput[] | QuestionUncheckedCreateWithoutSectionInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutSectionInput | QuestionCreateOrConnectWithoutSectionInput[]
    createMany?: QuestionCreateManySectionInputEnvelope
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
  }

  export type NullableEnumSkillTypeFieldUpdateOperationsInput = {
    set?: $Enums.SkillType | null
  }

  export type PassageUpdateManyWithoutSectionNestedInput = {
    create?: XOR<PassageCreateWithoutSectionInput, PassageUncheckedCreateWithoutSectionInput> | PassageCreateWithoutSectionInput[] | PassageUncheckedCreateWithoutSectionInput[]
    connectOrCreate?: PassageCreateOrConnectWithoutSectionInput | PassageCreateOrConnectWithoutSectionInput[]
    upsert?: PassageUpsertWithWhereUniqueWithoutSectionInput | PassageUpsertWithWhereUniqueWithoutSectionInput[]
    createMany?: PassageCreateManySectionInputEnvelope
    set?: PassageWhereUniqueInput | PassageWhereUniqueInput[]
    disconnect?: PassageWhereUniqueInput | PassageWhereUniqueInput[]
    delete?: PassageWhereUniqueInput | PassageWhereUniqueInput[]
    connect?: PassageWhereUniqueInput | PassageWhereUniqueInput[]
    update?: PassageUpdateWithWhereUniqueWithoutSectionInput | PassageUpdateWithWhereUniqueWithoutSectionInput[]
    updateMany?: PassageUpdateManyWithWhereWithoutSectionInput | PassageUpdateManyWithWhereWithoutSectionInput[]
    deleteMany?: PassageScalarWhereInput | PassageScalarWhereInput[]
  }

  export type QuestionUpdateManyWithoutSectionNestedInput = {
    create?: XOR<QuestionCreateWithoutSectionInput, QuestionUncheckedCreateWithoutSectionInput> | QuestionCreateWithoutSectionInput[] | QuestionUncheckedCreateWithoutSectionInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutSectionInput | QuestionCreateOrConnectWithoutSectionInput[]
    upsert?: QuestionUpsertWithWhereUniqueWithoutSectionInput | QuestionUpsertWithWhereUniqueWithoutSectionInput[]
    createMany?: QuestionCreateManySectionInputEnvelope
    set?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    disconnect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    delete?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    update?: QuestionUpdateWithWhereUniqueWithoutSectionInput | QuestionUpdateWithWhereUniqueWithoutSectionInput[]
    updateMany?: QuestionUpdateManyWithWhereWithoutSectionInput | QuestionUpdateManyWithWhereWithoutSectionInput[]
    deleteMany?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
  }

  export type TestUpdateOneWithoutSectionsNestedInput = {
    create?: XOR<TestCreateWithoutSectionsInput, TestUncheckedCreateWithoutSectionsInput>
    connectOrCreate?: TestCreateOrConnectWithoutSectionsInput
    upsert?: TestUpsertWithoutSectionsInput
    disconnect?: TestWhereInput | boolean
    delete?: TestWhereInput | boolean
    connect?: TestWhereUniqueInput
    update?: XOR<XOR<TestUpdateToOneWithWhereWithoutSectionsInput, TestUpdateWithoutSectionsInput>, TestUncheckedUpdateWithoutSectionsInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type PassageUncheckedUpdateManyWithoutSectionNestedInput = {
    create?: XOR<PassageCreateWithoutSectionInput, PassageUncheckedCreateWithoutSectionInput> | PassageCreateWithoutSectionInput[] | PassageUncheckedCreateWithoutSectionInput[]
    connectOrCreate?: PassageCreateOrConnectWithoutSectionInput | PassageCreateOrConnectWithoutSectionInput[]
    upsert?: PassageUpsertWithWhereUniqueWithoutSectionInput | PassageUpsertWithWhereUniqueWithoutSectionInput[]
    createMany?: PassageCreateManySectionInputEnvelope
    set?: PassageWhereUniqueInput | PassageWhereUniqueInput[]
    disconnect?: PassageWhereUniqueInput | PassageWhereUniqueInput[]
    delete?: PassageWhereUniqueInput | PassageWhereUniqueInput[]
    connect?: PassageWhereUniqueInput | PassageWhereUniqueInput[]
    update?: PassageUpdateWithWhereUniqueWithoutSectionInput | PassageUpdateWithWhereUniqueWithoutSectionInput[]
    updateMany?: PassageUpdateManyWithWhereWithoutSectionInput | PassageUpdateManyWithWhereWithoutSectionInput[]
    deleteMany?: PassageScalarWhereInput | PassageScalarWhereInput[]
  }

  export type QuestionUncheckedUpdateManyWithoutSectionNestedInput = {
    create?: XOR<QuestionCreateWithoutSectionInput, QuestionUncheckedCreateWithoutSectionInput> | QuestionCreateWithoutSectionInput[] | QuestionUncheckedCreateWithoutSectionInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutSectionInput | QuestionCreateOrConnectWithoutSectionInput[]
    upsert?: QuestionUpsertWithWhereUniqueWithoutSectionInput | QuestionUpsertWithWhereUniqueWithoutSectionInput[]
    createMany?: QuestionCreateManySectionInputEnvelope
    set?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    disconnect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    delete?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    update?: QuestionUpdateWithWhereUniqueWithoutSectionInput | QuestionUpdateWithWhereUniqueWithoutSectionInput[]
    updateMany?: QuestionUpdateManyWithWhereWithoutSectionInput | QuestionUpdateManyWithWhereWithoutSectionInput[]
    deleteMany?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
  }

  export type SectionCreateNestedOneWithoutPassagesInput = {
    create?: XOR<SectionCreateWithoutPassagesInput, SectionUncheckedCreateWithoutPassagesInput>
    connectOrCreate?: SectionCreateOrConnectWithoutPassagesInput
    connect?: SectionWhereUniqueInput
  }

  export type QuestionCreateNestedManyWithoutPassageInput = {
    create?: XOR<QuestionCreateWithoutPassageInput, QuestionUncheckedCreateWithoutPassageInput> | QuestionCreateWithoutPassageInput[] | QuestionUncheckedCreateWithoutPassageInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutPassageInput | QuestionCreateOrConnectWithoutPassageInput[]
    createMany?: QuestionCreateManyPassageInputEnvelope
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
  }

  export type QuestionUncheckedCreateNestedManyWithoutPassageInput = {
    create?: XOR<QuestionCreateWithoutPassageInput, QuestionUncheckedCreateWithoutPassageInput> | QuestionCreateWithoutPassageInput[] | QuestionUncheckedCreateWithoutPassageInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutPassageInput | QuestionCreateOrConnectWithoutPassageInput[]
    createMany?: QuestionCreateManyPassageInputEnvelope
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
  }

  export type SectionUpdateOneRequiredWithoutPassagesNestedInput = {
    create?: XOR<SectionCreateWithoutPassagesInput, SectionUncheckedCreateWithoutPassagesInput>
    connectOrCreate?: SectionCreateOrConnectWithoutPassagesInput
    upsert?: SectionUpsertWithoutPassagesInput
    connect?: SectionWhereUniqueInput
    update?: XOR<XOR<SectionUpdateToOneWithWhereWithoutPassagesInput, SectionUpdateWithoutPassagesInput>, SectionUncheckedUpdateWithoutPassagesInput>
  }

  export type QuestionUpdateManyWithoutPassageNestedInput = {
    create?: XOR<QuestionCreateWithoutPassageInput, QuestionUncheckedCreateWithoutPassageInput> | QuestionCreateWithoutPassageInput[] | QuestionUncheckedCreateWithoutPassageInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutPassageInput | QuestionCreateOrConnectWithoutPassageInput[]
    upsert?: QuestionUpsertWithWhereUniqueWithoutPassageInput | QuestionUpsertWithWhereUniqueWithoutPassageInput[]
    createMany?: QuestionCreateManyPassageInputEnvelope
    set?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    disconnect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    delete?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    update?: QuestionUpdateWithWhereUniqueWithoutPassageInput | QuestionUpdateWithWhereUniqueWithoutPassageInput[]
    updateMany?: QuestionUpdateManyWithWhereWithoutPassageInput | QuestionUpdateManyWithWhereWithoutPassageInput[]
    deleteMany?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
  }

  export type QuestionUncheckedUpdateManyWithoutPassageNestedInput = {
    create?: XOR<QuestionCreateWithoutPassageInput, QuestionUncheckedCreateWithoutPassageInput> | QuestionCreateWithoutPassageInput[] | QuestionUncheckedCreateWithoutPassageInput[]
    connectOrCreate?: QuestionCreateOrConnectWithoutPassageInput | QuestionCreateOrConnectWithoutPassageInput[]
    upsert?: QuestionUpsertWithWhereUniqueWithoutPassageInput | QuestionUpsertWithWhereUniqueWithoutPassageInput[]
    createMany?: QuestionCreateManyPassageInputEnvelope
    set?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    disconnect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    delete?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    connect?: QuestionWhereUniqueInput | QuestionWhereUniqueInput[]
    update?: QuestionUpdateWithWhereUniqueWithoutPassageInput | QuestionUpdateWithWhereUniqueWithoutPassageInput[]
    updateMany?: QuestionUpdateManyWithWhereWithoutPassageInput | QuestionUpdateManyWithWhereWithoutPassageInput[]
    deleteMany?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
  }

  export type QuestionCreateoptionsInput = {
    set: string[]
  }

  export type PassageCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<PassageCreateWithoutQuestionsInput, PassageUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: PassageCreateOrConnectWithoutQuestionsInput
    connect?: PassageWhereUniqueInput
  }

  export type SectionCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<SectionCreateWithoutQuestionsInput, SectionUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: SectionCreateOrConnectWithoutQuestionsInput
    connect?: SectionWhereUniqueInput
  }

  export type TestCreateNestedOneWithoutQuestionsInput = {
    create?: XOR<TestCreateWithoutQuestionsInput, TestUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: TestCreateOrConnectWithoutQuestionsInput
    connect?: TestWhereUniqueInput
  }

  export type UserAnswerCreateNestedManyWithoutQuestionInput = {
    create?: XOR<UserAnswerCreateWithoutQuestionInput, UserAnswerUncheckedCreateWithoutQuestionInput> | UserAnswerCreateWithoutQuestionInput[] | UserAnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: UserAnswerCreateOrConnectWithoutQuestionInput | UserAnswerCreateOrConnectWithoutQuestionInput[]
    createMany?: UserAnswerCreateManyQuestionInputEnvelope
    connect?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
  }

  export type UserAnswerUncheckedCreateNestedManyWithoutQuestionInput = {
    create?: XOR<UserAnswerCreateWithoutQuestionInput, UserAnswerUncheckedCreateWithoutQuestionInput> | UserAnswerCreateWithoutQuestionInput[] | UserAnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: UserAnswerCreateOrConnectWithoutQuestionInput | UserAnswerCreateOrConnectWithoutQuestionInput[]
    createMany?: UserAnswerCreateManyQuestionInputEnvelope
    connect?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
  }

  export type EnumQuestionTypeFieldUpdateOperationsInput = {
    set?: $Enums.QuestionType
  }

  export type QuestionUpdateoptionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type PassageUpdateOneWithoutQuestionsNestedInput = {
    create?: XOR<PassageCreateWithoutQuestionsInput, PassageUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: PassageCreateOrConnectWithoutQuestionsInput
    upsert?: PassageUpsertWithoutQuestionsInput
    disconnect?: PassageWhereInput | boolean
    delete?: PassageWhereInput | boolean
    connect?: PassageWhereUniqueInput
    update?: XOR<XOR<PassageUpdateToOneWithWhereWithoutQuestionsInput, PassageUpdateWithoutQuestionsInput>, PassageUncheckedUpdateWithoutQuestionsInput>
  }

  export type SectionUpdateOneWithoutQuestionsNestedInput = {
    create?: XOR<SectionCreateWithoutQuestionsInput, SectionUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: SectionCreateOrConnectWithoutQuestionsInput
    upsert?: SectionUpsertWithoutQuestionsInput
    disconnect?: SectionWhereInput | boolean
    delete?: SectionWhereInput | boolean
    connect?: SectionWhereUniqueInput
    update?: XOR<XOR<SectionUpdateToOneWithWhereWithoutQuestionsInput, SectionUpdateWithoutQuestionsInput>, SectionUncheckedUpdateWithoutQuestionsInput>
  }

  export type TestUpdateOneWithoutQuestionsNestedInput = {
    create?: XOR<TestCreateWithoutQuestionsInput, TestUncheckedCreateWithoutQuestionsInput>
    connectOrCreate?: TestCreateOrConnectWithoutQuestionsInput
    upsert?: TestUpsertWithoutQuestionsInput
    disconnect?: TestWhereInput | boolean
    delete?: TestWhereInput | boolean
    connect?: TestWhereUniqueInput
    update?: XOR<XOR<TestUpdateToOneWithWhereWithoutQuestionsInput, TestUpdateWithoutQuestionsInput>, TestUncheckedUpdateWithoutQuestionsInput>
  }

  export type UserAnswerUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<UserAnswerCreateWithoutQuestionInput, UserAnswerUncheckedCreateWithoutQuestionInput> | UserAnswerCreateWithoutQuestionInput[] | UserAnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: UserAnswerCreateOrConnectWithoutQuestionInput | UserAnswerCreateOrConnectWithoutQuestionInput[]
    upsert?: UserAnswerUpsertWithWhereUniqueWithoutQuestionInput | UserAnswerUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: UserAnswerCreateManyQuestionInputEnvelope
    set?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    disconnect?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    delete?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    connect?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    update?: UserAnswerUpdateWithWhereUniqueWithoutQuestionInput | UserAnswerUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: UserAnswerUpdateManyWithWhereWithoutQuestionInput | UserAnswerUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: UserAnswerScalarWhereInput | UserAnswerScalarWhereInput[]
  }

  export type UserAnswerUncheckedUpdateManyWithoutQuestionNestedInput = {
    create?: XOR<UserAnswerCreateWithoutQuestionInput, UserAnswerUncheckedCreateWithoutQuestionInput> | UserAnswerCreateWithoutQuestionInput[] | UserAnswerUncheckedCreateWithoutQuestionInput[]
    connectOrCreate?: UserAnswerCreateOrConnectWithoutQuestionInput | UserAnswerCreateOrConnectWithoutQuestionInput[]
    upsert?: UserAnswerUpsertWithWhereUniqueWithoutQuestionInput | UserAnswerUpsertWithWhereUniqueWithoutQuestionInput[]
    createMany?: UserAnswerCreateManyQuestionInputEnvelope
    set?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    disconnect?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    delete?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    connect?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    update?: UserAnswerUpdateWithWhereUniqueWithoutQuestionInput | UserAnswerUpdateWithWhereUniqueWithoutQuestionInput[]
    updateMany?: UserAnswerUpdateManyWithWhereWithoutQuestionInput | UserAnswerUpdateManyWithWhereWithoutQuestionInput[]
    deleteMany?: UserAnswerScalarWhereInput | UserAnswerScalarWhereInput[]
  }

  export type PracticeSessionCreateselectedSectionsInput = {
    set: string[]
  }

  export type TestCreateNestedOneWithoutPracticeSessionsInput = {
    create?: XOR<TestCreateWithoutPracticeSessionsInput, TestUncheckedCreateWithoutPracticeSessionsInput>
    connectOrCreate?: TestCreateOrConnectWithoutPracticeSessionsInput
    connect?: TestWhereUniqueInput
  }

  export type UserAnswerCreateNestedManyWithoutPracticeSessionInput = {
    create?: XOR<UserAnswerCreateWithoutPracticeSessionInput, UserAnswerUncheckedCreateWithoutPracticeSessionInput> | UserAnswerCreateWithoutPracticeSessionInput[] | UserAnswerUncheckedCreateWithoutPracticeSessionInput[]
    connectOrCreate?: UserAnswerCreateOrConnectWithoutPracticeSessionInput | UserAnswerCreateOrConnectWithoutPracticeSessionInput[]
    createMany?: UserAnswerCreateManyPracticeSessionInputEnvelope
    connect?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
  }

  export type UserAnswerUncheckedCreateNestedManyWithoutPracticeSessionInput = {
    create?: XOR<UserAnswerCreateWithoutPracticeSessionInput, UserAnswerUncheckedCreateWithoutPracticeSessionInput> | UserAnswerCreateWithoutPracticeSessionInput[] | UserAnswerUncheckedCreateWithoutPracticeSessionInput[]
    connectOrCreate?: UserAnswerCreateOrConnectWithoutPracticeSessionInput | UserAnswerCreateOrConnectWithoutPracticeSessionInput[]
    createMany?: UserAnswerCreateManyPracticeSessionInputEnvelope
    connect?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
  }

  export type PracticeSessionUpdateselectedSectionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumSessionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SessionStatus
  }

  export type TestUpdateOneRequiredWithoutPracticeSessionsNestedInput = {
    create?: XOR<TestCreateWithoutPracticeSessionsInput, TestUncheckedCreateWithoutPracticeSessionsInput>
    connectOrCreate?: TestCreateOrConnectWithoutPracticeSessionsInput
    upsert?: TestUpsertWithoutPracticeSessionsInput
    connect?: TestWhereUniqueInput
    update?: XOR<XOR<TestUpdateToOneWithWhereWithoutPracticeSessionsInput, TestUpdateWithoutPracticeSessionsInput>, TestUncheckedUpdateWithoutPracticeSessionsInput>
  }

  export type UserAnswerUpdateManyWithoutPracticeSessionNestedInput = {
    create?: XOR<UserAnswerCreateWithoutPracticeSessionInput, UserAnswerUncheckedCreateWithoutPracticeSessionInput> | UserAnswerCreateWithoutPracticeSessionInput[] | UserAnswerUncheckedCreateWithoutPracticeSessionInput[]
    connectOrCreate?: UserAnswerCreateOrConnectWithoutPracticeSessionInput | UserAnswerCreateOrConnectWithoutPracticeSessionInput[]
    upsert?: UserAnswerUpsertWithWhereUniqueWithoutPracticeSessionInput | UserAnswerUpsertWithWhereUniqueWithoutPracticeSessionInput[]
    createMany?: UserAnswerCreateManyPracticeSessionInputEnvelope
    set?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    disconnect?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    delete?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    connect?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    update?: UserAnswerUpdateWithWhereUniqueWithoutPracticeSessionInput | UserAnswerUpdateWithWhereUniqueWithoutPracticeSessionInput[]
    updateMany?: UserAnswerUpdateManyWithWhereWithoutPracticeSessionInput | UserAnswerUpdateManyWithWhereWithoutPracticeSessionInput[]
    deleteMany?: UserAnswerScalarWhereInput | UserAnswerScalarWhereInput[]
  }

  export type UserAnswerUncheckedUpdateManyWithoutPracticeSessionNestedInput = {
    create?: XOR<UserAnswerCreateWithoutPracticeSessionInput, UserAnswerUncheckedCreateWithoutPracticeSessionInput> | UserAnswerCreateWithoutPracticeSessionInput[] | UserAnswerUncheckedCreateWithoutPracticeSessionInput[]
    connectOrCreate?: UserAnswerCreateOrConnectWithoutPracticeSessionInput | UserAnswerCreateOrConnectWithoutPracticeSessionInput[]
    upsert?: UserAnswerUpsertWithWhereUniqueWithoutPracticeSessionInput | UserAnswerUpsertWithWhereUniqueWithoutPracticeSessionInput[]
    createMany?: UserAnswerCreateManyPracticeSessionInputEnvelope
    set?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    disconnect?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    delete?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    connect?: UserAnswerWhereUniqueInput | UserAnswerWhereUniqueInput[]
    update?: UserAnswerUpdateWithWhereUniqueWithoutPracticeSessionInput | UserAnswerUpdateWithWhereUniqueWithoutPracticeSessionInput[]
    updateMany?: UserAnswerUpdateManyWithWhereWithoutPracticeSessionInput | UserAnswerUpdateManyWithWhereWithoutPracticeSessionInput[]
    deleteMany?: UserAnswerScalarWhereInput | UserAnswerScalarWhereInput[]
  }

  export type PracticeSessionCreateNestedOneWithoutUserAnswersInput = {
    create?: XOR<PracticeSessionCreateWithoutUserAnswersInput, PracticeSessionUncheckedCreateWithoutUserAnswersInput>
    connectOrCreate?: PracticeSessionCreateOrConnectWithoutUserAnswersInput
    connect?: PracticeSessionWhereUniqueInput
  }

  export type QuestionCreateNestedOneWithoutUserAnswersInput = {
    create?: XOR<QuestionCreateWithoutUserAnswersInput, QuestionUncheckedCreateWithoutUserAnswersInput>
    connectOrCreate?: QuestionCreateOrConnectWithoutUserAnswersInput
    connect?: QuestionWhereUniqueInput
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type PracticeSessionUpdateOneRequiredWithoutUserAnswersNestedInput = {
    create?: XOR<PracticeSessionCreateWithoutUserAnswersInput, PracticeSessionUncheckedCreateWithoutUserAnswersInput>
    connectOrCreate?: PracticeSessionCreateOrConnectWithoutUserAnswersInput
    upsert?: PracticeSessionUpsertWithoutUserAnswersInput
    connect?: PracticeSessionWhereUniqueInput
    update?: XOR<XOR<PracticeSessionUpdateToOneWithWhereWithoutUserAnswersInput, PracticeSessionUpdateWithoutUserAnswersInput>, PracticeSessionUncheckedUpdateWithoutUserAnswersInput>
  }

  export type QuestionUpdateOneRequiredWithoutUserAnswersNestedInput = {
    create?: XOR<QuestionCreateWithoutUserAnswersInput, QuestionUncheckedCreateWithoutUserAnswersInput>
    connectOrCreate?: QuestionCreateOrConnectWithoutUserAnswersInput
    upsert?: QuestionUpsertWithoutUserAnswersInput
    connect?: QuestionWhereUniqueInput
    update?: XOR<XOR<QuestionUpdateToOneWithWhereWithoutUserAnswersInput, QuestionUpdateWithoutUserAnswersInput>, QuestionUncheckedUpdateWithoutUserAnswersInput>
  }

  export type EnglishTestTypeCreateNestedOneWithoutScoreConversionsInput = {
    create?: XOR<EnglishTestTypeCreateWithoutScoreConversionsInput, EnglishTestTypeUncheckedCreateWithoutScoreConversionsInput>
    connectOrCreate?: EnglishTestTypeCreateOrConnectWithoutScoreConversionsInput
    connect?: EnglishTestTypeWhereUniqueInput
  }

  export type EnumSkillTypeFieldUpdateOperationsInput = {
    set?: $Enums.SkillType
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnglishTestTypeUpdateOneRequiredWithoutScoreConversionsNestedInput = {
    create?: XOR<EnglishTestTypeCreateWithoutScoreConversionsInput, EnglishTestTypeUncheckedCreateWithoutScoreConversionsInput>
    connectOrCreate?: EnglishTestTypeCreateOrConnectWithoutScoreConversionsInput
    upsert?: EnglishTestTypeUpsertWithoutScoreConversionsInput
    connect?: EnglishTestTypeWhereUniqueInput
    update?: XOR<XOR<EnglishTestTypeUpdateToOneWithWhereWithoutScoreConversionsInput, EnglishTestTypeUpdateWithoutScoreConversionsInput>, EnglishTestTypeUncheckedUpdateWithoutScoreConversionsInput>
  }

  export type TestCreateNestedOneWithoutTestSkillsInput = {
    create?: XOR<TestCreateWithoutTestSkillsInput, TestUncheckedCreateWithoutTestSkillsInput>
    connectOrCreate?: TestCreateOrConnectWithoutTestSkillsInput
    connect?: TestWhereUniqueInput
  }

  export type TestUpdateOneRequiredWithoutTestSkillsNestedInput = {
    create?: XOR<TestCreateWithoutTestSkillsInput, TestUncheckedCreateWithoutTestSkillsInput>
    connectOrCreate?: TestCreateOrConnectWithoutTestSkillsInput
    upsert?: TestUpsertWithoutTestSkillsInput
    connect?: TestWhereUniqueInput
    update?: XOR<XOR<TestUpdateToOneWithWhereWithoutTestSkillsInput, TestUpdateWithoutTestSkillsInput>, TestUncheckedUpdateWithoutTestSkillsInput>
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

  export type NestedEnumTestTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TestType | EnumTestTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TestType[] | ListEnumTestTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TestType[] | ListEnumTestTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTestTypeNullableFilter<$PrismaModel> | $Enums.TestType | null
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

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
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

  export type NestedEnumTestTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TestType | EnumTestTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.TestType[] | ListEnumTestTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.TestType[] | ListEnumTestTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumTestTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.TestType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumTestTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumTestTypeNullableFilter<$PrismaModel>
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

  export type NestedEnumSkillTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SkillType | EnumSkillTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSkillTypeNullableFilter<$PrismaModel> | $Enums.SkillType | null
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

  export type NestedEnumSkillTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SkillType | EnumSkillTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSkillTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.SkillType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumSkillTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumSkillTypeNullableFilter<$PrismaModel>
  }

  export type NestedEnumQuestionTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeFilter<$PrismaModel> | $Enums.QuestionType
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

  export type NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuestionType | EnumQuestionTypeFieldRefInput<$PrismaModel>
    in?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.QuestionType[] | ListEnumQuestionTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumQuestionTypeWithAggregatesFilter<$PrismaModel> | $Enums.QuestionType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumQuestionTypeFilter<$PrismaModel>
    _max?: NestedEnumQuestionTypeFilter<$PrismaModel>
  }

  export type NestedEnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
  }

  export type NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
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

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumSkillTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SkillType | EnumSkillTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSkillTypeFilter<$PrismaModel> | $Enums.SkillType
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

  export type NestedEnumSkillTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SkillType | EnumSkillTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SkillType[] | ListEnumSkillTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSkillTypeWithAggregatesFilter<$PrismaModel> | $Enums.SkillType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSkillTypeFilter<$PrismaModel>
    _max?: NestedEnumSkillTypeFilter<$PrismaModel>
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

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type ScoreConversionCreateWithoutEnglishTestTypeInput = {
    id?: string
    skill: $Enums.SkillType
    rawScore: number
    scaledScore: number
  }

  export type ScoreConversionUncheckedCreateWithoutEnglishTestTypeInput = {
    id?: string
    skill: $Enums.SkillType
    rawScore: number
    scaledScore: number
  }

  export type ScoreConversionCreateOrConnectWithoutEnglishTestTypeInput = {
    where: ScoreConversionWhereUniqueInput
    create: XOR<ScoreConversionCreateWithoutEnglishTestTypeInput, ScoreConversionUncheckedCreateWithoutEnglishTestTypeInput>
  }

  export type ScoreConversionCreateManyEnglishTestTypeInputEnvelope = {
    data: ScoreConversionCreateManyEnglishTestTypeInput | ScoreConversionCreateManyEnglishTestTypeInput[]
    skipDuplicates?: boolean
  }

  export type TestCreateWithoutEnglishTestTypeInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    courseTests?: CourseTestCreateNestedManyWithoutTestInput
    practiceSessions?: PracticeSessionCreateNestedManyWithoutTestInput
    questions?: QuestionCreateNestedManyWithoutTestInput
    sections?: SectionCreateNestedManyWithoutTestInput
    testSkills?: TestSkillCreateNestedManyWithoutTestInput
  }

  export type TestUncheckedCreateWithoutEnglishTestTypeInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    courseTests?: CourseTestUncheckedCreateNestedManyWithoutTestInput
    practiceSessions?: PracticeSessionUncheckedCreateNestedManyWithoutTestInput
    questions?: QuestionUncheckedCreateNestedManyWithoutTestInput
    sections?: SectionUncheckedCreateNestedManyWithoutTestInput
    testSkills?: TestSkillUncheckedCreateNestedManyWithoutTestInput
  }

  export type TestCreateOrConnectWithoutEnglishTestTypeInput = {
    where: TestWhereUniqueInput
    create: XOR<TestCreateWithoutEnglishTestTypeInput, TestUncheckedCreateWithoutEnglishTestTypeInput>
  }

  export type TestCreateManyEnglishTestTypeInputEnvelope = {
    data: TestCreateManyEnglishTestTypeInput | TestCreateManyEnglishTestTypeInput[]
    skipDuplicates?: boolean
  }

  export type ScoreConversionUpsertWithWhereUniqueWithoutEnglishTestTypeInput = {
    where: ScoreConversionWhereUniqueInput
    update: XOR<ScoreConversionUpdateWithoutEnglishTestTypeInput, ScoreConversionUncheckedUpdateWithoutEnglishTestTypeInput>
    create: XOR<ScoreConversionCreateWithoutEnglishTestTypeInput, ScoreConversionUncheckedCreateWithoutEnglishTestTypeInput>
  }

  export type ScoreConversionUpdateWithWhereUniqueWithoutEnglishTestTypeInput = {
    where: ScoreConversionWhereUniqueInput
    data: XOR<ScoreConversionUpdateWithoutEnglishTestTypeInput, ScoreConversionUncheckedUpdateWithoutEnglishTestTypeInput>
  }

  export type ScoreConversionUpdateManyWithWhereWithoutEnglishTestTypeInput = {
    where: ScoreConversionScalarWhereInput
    data: XOR<ScoreConversionUpdateManyMutationInput, ScoreConversionUncheckedUpdateManyWithoutEnglishTestTypeInput>
  }

  export type ScoreConversionScalarWhereInput = {
    AND?: ScoreConversionScalarWhereInput | ScoreConversionScalarWhereInput[]
    OR?: ScoreConversionScalarWhereInput[]
    NOT?: ScoreConversionScalarWhereInput | ScoreConversionScalarWhereInput[]
    id?: UuidFilter<"ScoreConversion"> | string
    englishTestTypeId?: UuidFilter<"ScoreConversion"> | string
    skill?: EnumSkillTypeFilter<"ScoreConversion"> | $Enums.SkillType
    rawScore?: IntFilter<"ScoreConversion"> | number
    scaledScore?: FloatFilter<"ScoreConversion"> | number
  }

  export type TestUpsertWithWhereUniqueWithoutEnglishTestTypeInput = {
    where: TestWhereUniqueInput
    update: XOR<TestUpdateWithoutEnglishTestTypeInput, TestUncheckedUpdateWithoutEnglishTestTypeInput>
    create: XOR<TestCreateWithoutEnglishTestTypeInput, TestUncheckedCreateWithoutEnglishTestTypeInput>
  }

  export type TestUpdateWithWhereUniqueWithoutEnglishTestTypeInput = {
    where: TestWhereUniqueInput
    data: XOR<TestUpdateWithoutEnglishTestTypeInput, TestUncheckedUpdateWithoutEnglishTestTypeInput>
  }

  export type TestUpdateManyWithWhereWithoutEnglishTestTypeInput = {
    where: TestScalarWhereInput
    data: XOR<TestUpdateManyMutationInput, TestUncheckedUpdateManyWithoutEnglishTestTypeInput>
  }

  export type TestScalarWhereInput = {
    AND?: TestScalarWhereInput | TestScalarWhereInput[]
    OR?: TestScalarWhereInput[]
    NOT?: TestScalarWhereInput | TestScalarWhereInput[]
    id?: UuidFilter<"Test"> | string
    title?: StringFilter<"Test"> | string
    durationInMinutes?: IntNullableFilter<"Test"> | number | null
    totalScore?: FloatNullableFilter<"Test"> | number | null
    passingScore?: FloatNullableFilter<"Test"> | number | null
    englishTestTypeId?: UuidFilter<"Test"> | string
    practiceCount?: IntNullableFilter<"Test"> | number | null
    createdAt?: DateTimeFilter<"Test"> | Date | string
    maxAttempts?: IntNullableFilter<"Test"> | number | null
    testType?: EnumTestTypeNullableFilter<"Test"> | $Enums.TestType | null
    updatedAt?: DateTimeNullableFilter<"Test"> | Date | string | null
  }

  export type CourseTestCreateWithoutTestInput = {
    courseId: string
  }

  export type CourseTestUncheckedCreateWithoutTestInput = {
    courseId: string
  }

  export type CourseTestCreateOrConnectWithoutTestInput = {
    where: CourseTestWhereUniqueInput
    create: XOR<CourseTestCreateWithoutTestInput, CourseTestUncheckedCreateWithoutTestInput>
  }

  export type CourseTestCreateManyTestInputEnvelope = {
    data: CourseTestCreateManyTestInput | CourseTestCreateManyTestInput[]
    skipDuplicates?: boolean
  }

  export type PracticeSessionCreateWithoutTestInput = {
    id?: string
    userId: string
    selectedSections?: PracticeSessionCreateselectedSectionsInput | string[]
    status: $Enums.SessionStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
    overallScaledScore?: number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    userAnswers?: UserAnswerCreateNestedManyWithoutPracticeSessionInput
  }

  export type PracticeSessionUncheckedCreateWithoutTestInput = {
    id?: string
    userId: string
    selectedSections?: PracticeSessionCreateselectedSectionsInput | string[]
    status: $Enums.SessionStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
    overallScaledScore?: number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    userAnswers?: UserAnswerUncheckedCreateNestedManyWithoutPracticeSessionInput
  }

  export type PracticeSessionCreateOrConnectWithoutTestInput = {
    where: PracticeSessionWhereUniqueInput
    create: XOR<PracticeSessionCreateWithoutTestInput, PracticeSessionUncheckedCreateWithoutTestInput>
  }

  export type PracticeSessionCreateManyTestInputEnvelope = {
    data: PracticeSessionCreateManyTestInput | PracticeSessionCreateManyTestInput[]
    skipDuplicates?: boolean
  }

  export type QuestionCreateWithoutTestInput = {
    id?: string
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    questionOrder?: number | null
    passage?: PassageCreateNestedOneWithoutQuestionsInput
    section?: SectionCreateNestedOneWithoutQuestionsInput
    userAnswers?: UserAnswerCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUncheckedCreateWithoutTestInput = {
    id?: string
    sectionId?: string | null
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    passageId?: string | null
    questionOrder?: number | null
    userAnswers?: UserAnswerUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionCreateOrConnectWithoutTestInput = {
    where: QuestionWhereUniqueInput
    create: XOR<QuestionCreateWithoutTestInput, QuestionUncheckedCreateWithoutTestInput>
  }

  export type QuestionCreateManyTestInputEnvelope = {
    data: QuestionCreateManyTestInput | QuestionCreateManyTestInput[]
    skipDuplicates?: boolean
  }

  export type SectionCreateWithoutTestInput = {
    id?: string
    title: string
    skill?: $Enums.SkillType | null
    durationInSeconds?: number | null
    totalQuestions?: number | null
    totalScore?: number | null
    passages?: PassageCreateNestedManyWithoutSectionInput
    questions?: QuestionCreateNestedManyWithoutSectionInput
  }

  export type SectionUncheckedCreateWithoutTestInput = {
    id?: string
    title: string
    skill?: $Enums.SkillType | null
    durationInSeconds?: number | null
    totalQuestions?: number | null
    totalScore?: number | null
    passages?: PassageUncheckedCreateNestedManyWithoutSectionInput
    questions?: QuestionUncheckedCreateNestedManyWithoutSectionInput
  }

  export type SectionCreateOrConnectWithoutTestInput = {
    where: SectionWhereUniqueInput
    create: XOR<SectionCreateWithoutTestInput, SectionUncheckedCreateWithoutTestInput>
  }

  export type SectionCreateManyTestInputEnvelope = {
    data: SectionCreateManyTestInput | SectionCreateManyTestInput[]
    skipDuplicates?: boolean
  }

  export type TestSkillCreateWithoutTestInput = {
    skill: $Enums.SkillType
  }

  export type TestSkillUncheckedCreateWithoutTestInput = {
    skill: $Enums.SkillType
  }

  export type TestSkillCreateOrConnectWithoutTestInput = {
    where: TestSkillWhereUniqueInput
    create: XOR<TestSkillCreateWithoutTestInput, TestSkillUncheckedCreateWithoutTestInput>
  }

  export type TestSkillCreateManyTestInputEnvelope = {
    data: TestSkillCreateManyTestInput | TestSkillCreateManyTestInput[]
    skipDuplicates?: boolean
  }

  export type EnglishTestTypeCreateWithoutTestsInput = {
    id?: string
    name: string
    scoreConversions?: ScoreConversionCreateNestedManyWithoutEnglishTestTypeInput
  }

  export type EnglishTestTypeUncheckedCreateWithoutTestsInput = {
    id?: string
    name: string
    scoreConversions?: ScoreConversionUncheckedCreateNestedManyWithoutEnglishTestTypeInput
  }

  export type EnglishTestTypeCreateOrConnectWithoutTestsInput = {
    where: EnglishTestTypeWhereUniqueInput
    create: XOR<EnglishTestTypeCreateWithoutTestsInput, EnglishTestTypeUncheckedCreateWithoutTestsInput>
  }

  export type CourseTestUpsertWithWhereUniqueWithoutTestInput = {
    where: CourseTestWhereUniqueInput
    update: XOR<CourseTestUpdateWithoutTestInput, CourseTestUncheckedUpdateWithoutTestInput>
    create: XOR<CourseTestCreateWithoutTestInput, CourseTestUncheckedCreateWithoutTestInput>
  }

  export type CourseTestUpdateWithWhereUniqueWithoutTestInput = {
    where: CourseTestWhereUniqueInput
    data: XOR<CourseTestUpdateWithoutTestInput, CourseTestUncheckedUpdateWithoutTestInput>
  }

  export type CourseTestUpdateManyWithWhereWithoutTestInput = {
    where: CourseTestScalarWhereInput
    data: XOR<CourseTestUpdateManyMutationInput, CourseTestUncheckedUpdateManyWithoutTestInput>
  }

  export type CourseTestScalarWhereInput = {
    AND?: CourseTestScalarWhereInput | CourseTestScalarWhereInput[]
    OR?: CourseTestScalarWhereInput[]
    NOT?: CourseTestScalarWhereInput | CourseTestScalarWhereInput[]
    courseId?: UuidFilter<"CourseTest"> | string
    testId?: UuidFilter<"CourseTest"> | string
  }

  export type PracticeSessionUpsertWithWhereUniqueWithoutTestInput = {
    where: PracticeSessionWhereUniqueInput
    update: XOR<PracticeSessionUpdateWithoutTestInput, PracticeSessionUncheckedUpdateWithoutTestInput>
    create: XOR<PracticeSessionCreateWithoutTestInput, PracticeSessionUncheckedCreateWithoutTestInput>
  }

  export type PracticeSessionUpdateWithWhereUniqueWithoutTestInput = {
    where: PracticeSessionWhereUniqueInput
    data: XOR<PracticeSessionUpdateWithoutTestInput, PracticeSessionUncheckedUpdateWithoutTestInput>
  }

  export type PracticeSessionUpdateManyWithWhereWithoutTestInput = {
    where: PracticeSessionScalarWhereInput
    data: XOR<PracticeSessionUpdateManyMutationInput, PracticeSessionUncheckedUpdateManyWithoutTestInput>
  }

  export type PracticeSessionScalarWhereInput = {
    AND?: PracticeSessionScalarWhereInput | PracticeSessionScalarWhereInput[]
    OR?: PracticeSessionScalarWhereInput[]
    NOT?: PracticeSessionScalarWhereInput | PracticeSessionScalarWhereInput[]
    id?: UuidFilter<"PracticeSession"> | string
    userId?: UuidFilter<"PracticeSession"> | string
    testId?: UuidFilter<"PracticeSession"> | string
    selectedSections?: StringNullableListFilter<"PracticeSession">
    status?: EnumSessionStatusFilter<"PracticeSession"> | $Enums.SessionStatus
    createdAt?: DateTimeFilter<"PracticeSession"> | Date | string
    completedAt?: DateTimeNullableFilter<"PracticeSession"> | Date | string | null
    overallScaledScore?: FloatNullableFilter<"PracticeSession"> | number | null
    rawScoresBySkill?: JsonNullableFilter<"PracticeSession">
    scoresBySkill?: JsonNullableFilter<"PracticeSession">
  }

  export type QuestionUpsertWithWhereUniqueWithoutTestInput = {
    where: QuestionWhereUniqueInput
    update: XOR<QuestionUpdateWithoutTestInput, QuestionUncheckedUpdateWithoutTestInput>
    create: XOR<QuestionCreateWithoutTestInput, QuestionUncheckedCreateWithoutTestInput>
  }

  export type QuestionUpdateWithWhereUniqueWithoutTestInput = {
    where: QuestionWhereUniqueInput
    data: XOR<QuestionUpdateWithoutTestInput, QuestionUncheckedUpdateWithoutTestInput>
  }

  export type QuestionUpdateManyWithWhereWithoutTestInput = {
    where: QuestionScalarWhereInput
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyWithoutTestInput>
  }

  export type QuestionScalarWhereInput = {
    AND?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
    OR?: QuestionScalarWhereInput[]
    NOT?: QuestionScalarWhereInput | QuestionScalarWhereInput[]
    id?: UuidFilter<"Question"> | string
    sectionId?: UuidNullableFilter<"Question"> | string | null
    questionText?: StringNullableFilter<"Question"> | string | null
    imageUrl?: StringNullableFilter<"Question"> | string | null
    questionType?: EnumQuestionTypeFilter<"Question"> | $Enums.QuestionType
    options?: StringNullableListFilter<"Question">
    correctAnswerIndex?: IntNullableFilter<"Question"> | number | null
    wordLimit?: IntNullableFilter<"Question"> | number | null
    correctAnswer?: StringNullableFilter<"Question"> | string | null
    passageId?: UuidNullableFilter<"Question"> | string | null
    questionOrder?: IntNullableFilter<"Question"> | number | null
    testId?: UuidNullableFilter<"Question"> | string | null
  }

  export type SectionUpsertWithWhereUniqueWithoutTestInput = {
    where: SectionWhereUniqueInput
    update: XOR<SectionUpdateWithoutTestInput, SectionUncheckedUpdateWithoutTestInput>
    create: XOR<SectionCreateWithoutTestInput, SectionUncheckedCreateWithoutTestInput>
  }

  export type SectionUpdateWithWhereUniqueWithoutTestInput = {
    where: SectionWhereUniqueInput
    data: XOR<SectionUpdateWithoutTestInput, SectionUncheckedUpdateWithoutTestInput>
  }

  export type SectionUpdateManyWithWhereWithoutTestInput = {
    where: SectionScalarWhereInput
    data: XOR<SectionUpdateManyMutationInput, SectionUncheckedUpdateManyWithoutTestInput>
  }

  export type SectionScalarWhereInput = {
    AND?: SectionScalarWhereInput | SectionScalarWhereInput[]
    OR?: SectionScalarWhereInput[]
    NOT?: SectionScalarWhereInput | SectionScalarWhereInput[]
    id?: UuidFilter<"Section"> | string
    title?: StringFilter<"Section"> | string
    testId?: UuidNullableFilter<"Section"> | string | null
    skill?: EnumSkillTypeNullableFilter<"Section"> | $Enums.SkillType | null
    durationInSeconds?: FloatNullableFilter<"Section"> | number | null
    totalQuestions?: IntNullableFilter<"Section"> | number | null
    totalScore?: FloatNullableFilter<"Section"> | number | null
  }

  export type TestSkillUpsertWithWhereUniqueWithoutTestInput = {
    where: TestSkillWhereUniqueInput
    update: XOR<TestSkillUpdateWithoutTestInput, TestSkillUncheckedUpdateWithoutTestInput>
    create: XOR<TestSkillCreateWithoutTestInput, TestSkillUncheckedCreateWithoutTestInput>
  }

  export type TestSkillUpdateWithWhereUniqueWithoutTestInput = {
    where: TestSkillWhereUniqueInput
    data: XOR<TestSkillUpdateWithoutTestInput, TestSkillUncheckedUpdateWithoutTestInput>
  }

  export type TestSkillUpdateManyWithWhereWithoutTestInput = {
    where: TestSkillScalarWhereInput
    data: XOR<TestSkillUpdateManyMutationInput, TestSkillUncheckedUpdateManyWithoutTestInput>
  }

  export type TestSkillScalarWhereInput = {
    AND?: TestSkillScalarWhereInput | TestSkillScalarWhereInput[]
    OR?: TestSkillScalarWhereInput[]
    NOT?: TestSkillScalarWhereInput | TestSkillScalarWhereInput[]
    testId?: UuidFilter<"TestSkill"> | string
    skill?: EnumSkillTypeFilter<"TestSkill"> | $Enums.SkillType
  }

  export type EnglishTestTypeUpsertWithoutTestsInput = {
    update: XOR<EnglishTestTypeUpdateWithoutTestsInput, EnglishTestTypeUncheckedUpdateWithoutTestsInput>
    create: XOR<EnglishTestTypeCreateWithoutTestsInput, EnglishTestTypeUncheckedCreateWithoutTestsInput>
    where?: EnglishTestTypeWhereInput
  }

  export type EnglishTestTypeUpdateToOneWithWhereWithoutTestsInput = {
    where?: EnglishTestTypeWhereInput
    data: XOR<EnglishTestTypeUpdateWithoutTestsInput, EnglishTestTypeUncheckedUpdateWithoutTestsInput>
  }

  export type EnglishTestTypeUpdateWithoutTestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scoreConversions?: ScoreConversionUpdateManyWithoutEnglishTestTypeNestedInput
  }

  export type EnglishTestTypeUncheckedUpdateWithoutTestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    scoreConversions?: ScoreConversionUncheckedUpdateManyWithoutEnglishTestTypeNestedInput
  }

  export type TestCreateWithoutCourseTestsInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    practiceSessions?: PracticeSessionCreateNestedManyWithoutTestInput
    questions?: QuestionCreateNestedManyWithoutTestInput
    sections?: SectionCreateNestedManyWithoutTestInput
    testSkills?: TestSkillCreateNestedManyWithoutTestInput
    englishTestType: EnglishTestTypeCreateNestedOneWithoutTestsInput
  }

  export type TestUncheckedCreateWithoutCourseTestsInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    englishTestTypeId: string
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    practiceSessions?: PracticeSessionUncheckedCreateNestedManyWithoutTestInput
    questions?: QuestionUncheckedCreateNestedManyWithoutTestInput
    sections?: SectionUncheckedCreateNestedManyWithoutTestInput
    testSkills?: TestSkillUncheckedCreateNestedManyWithoutTestInput
  }

  export type TestCreateOrConnectWithoutCourseTestsInput = {
    where: TestWhereUniqueInput
    create: XOR<TestCreateWithoutCourseTestsInput, TestUncheckedCreateWithoutCourseTestsInput>
  }

  export type TestUpsertWithoutCourseTestsInput = {
    update: XOR<TestUpdateWithoutCourseTestsInput, TestUncheckedUpdateWithoutCourseTestsInput>
    create: XOR<TestCreateWithoutCourseTestsInput, TestUncheckedCreateWithoutCourseTestsInput>
    where?: TestWhereInput
  }

  export type TestUpdateToOneWithWhereWithoutCourseTestsInput = {
    where?: TestWhereInput
    data: XOR<TestUpdateWithoutCourseTestsInput, TestUncheckedUpdateWithoutCourseTestsInput>
  }

  export type TestUpdateWithoutCourseTestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    practiceSessions?: PracticeSessionUpdateManyWithoutTestNestedInput
    questions?: QuestionUpdateManyWithoutTestNestedInput
    sections?: SectionUpdateManyWithoutTestNestedInput
    testSkills?: TestSkillUpdateManyWithoutTestNestedInput
    englishTestType?: EnglishTestTypeUpdateOneRequiredWithoutTestsNestedInput
  }

  export type TestUncheckedUpdateWithoutCourseTestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    englishTestTypeId?: StringFieldUpdateOperationsInput | string
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    practiceSessions?: PracticeSessionUncheckedUpdateManyWithoutTestNestedInput
    questions?: QuestionUncheckedUpdateManyWithoutTestNestedInput
    sections?: SectionUncheckedUpdateManyWithoutTestNestedInput
    testSkills?: TestSkillUncheckedUpdateManyWithoutTestNestedInput
  }

  export type PassageCreateWithoutSectionInput = {
    id?: string
    content: string
    passageOrder?: number | null
    questions?: QuestionCreateNestedManyWithoutPassageInput
  }

  export type PassageUncheckedCreateWithoutSectionInput = {
    id?: string
    content: string
    passageOrder?: number | null
    questions?: QuestionUncheckedCreateNestedManyWithoutPassageInput
  }

  export type PassageCreateOrConnectWithoutSectionInput = {
    where: PassageWhereUniqueInput
    create: XOR<PassageCreateWithoutSectionInput, PassageUncheckedCreateWithoutSectionInput>
  }

  export type PassageCreateManySectionInputEnvelope = {
    data: PassageCreateManySectionInput | PassageCreateManySectionInput[]
    skipDuplicates?: boolean
  }

  export type QuestionCreateWithoutSectionInput = {
    id?: string
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    questionOrder?: number | null
    passage?: PassageCreateNestedOneWithoutQuestionsInput
    test?: TestCreateNestedOneWithoutQuestionsInput
    userAnswers?: UserAnswerCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUncheckedCreateWithoutSectionInput = {
    id?: string
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    passageId?: string | null
    questionOrder?: number | null
    testId?: string | null
    userAnswers?: UserAnswerUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionCreateOrConnectWithoutSectionInput = {
    where: QuestionWhereUniqueInput
    create: XOR<QuestionCreateWithoutSectionInput, QuestionUncheckedCreateWithoutSectionInput>
  }

  export type QuestionCreateManySectionInputEnvelope = {
    data: QuestionCreateManySectionInput | QuestionCreateManySectionInput[]
    skipDuplicates?: boolean
  }

  export type TestCreateWithoutSectionsInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    courseTests?: CourseTestCreateNestedManyWithoutTestInput
    practiceSessions?: PracticeSessionCreateNestedManyWithoutTestInput
    questions?: QuestionCreateNestedManyWithoutTestInput
    testSkills?: TestSkillCreateNestedManyWithoutTestInput
    englishTestType: EnglishTestTypeCreateNestedOneWithoutTestsInput
  }

  export type TestUncheckedCreateWithoutSectionsInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    englishTestTypeId: string
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    courseTests?: CourseTestUncheckedCreateNestedManyWithoutTestInput
    practiceSessions?: PracticeSessionUncheckedCreateNestedManyWithoutTestInput
    questions?: QuestionUncheckedCreateNestedManyWithoutTestInput
    testSkills?: TestSkillUncheckedCreateNestedManyWithoutTestInput
  }

  export type TestCreateOrConnectWithoutSectionsInput = {
    where: TestWhereUniqueInput
    create: XOR<TestCreateWithoutSectionsInput, TestUncheckedCreateWithoutSectionsInput>
  }

  export type PassageUpsertWithWhereUniqueWithoutSectionInput = {
    where: PassageWhereUniqueInput
    update: XOR<PassageUpdateWithoutSectionInput, PassageUncheckedUpdateWithoutSectionInput>
    create: XOR<PassageCreateWithoutSectionInput, PassageUncheckedCreateWithoutSectionInput>
  }

  export type PassageUpdateWithWhereUniqueWithoutSectionInput = {
    where: PassageWhereUniqueInput
    data: XOR<PassageUpdateWithoutSectionInput, PassageUncheckedUpdateWithoutSectionInput>
  }

  export type PassageUpdateManyWithWhereWithoutSectionInput = {
    where: PassageScalarWhereInput
    data: XOR<PassageUpdateManyMutationInput, PassageUncheckedUpdateManyWithoutSectionInput>
  }

  export type PassageScalarWhereInput = {
    AND?: PassageScalarWhereInput | PassageScalarWhereInput[]
    OR?: PassageScalarWhereInput[]
    NOT?: PassageScalarWhereInput | PassageScalarWhereInput[]
    id?: UuidFilter<"Passage"> | string
    sectionId?: UuidFilter<"Passage"> | string
    content?: StringFilter<"Passage"> | string
    passageOrder?: IntNullableFilter<"Passage"> | number | null
  }

  export type QuestionUpsertWithWhereUniqueWithoutSectionInput = {
    where: QuestionWhereUniqueInput
    update: XOR<QuestionUpdateWithoutSectionInput, QuestionUncheckedUpdateWithoutSectionInput>
    create: XOR<QuestionCreateWithoutSectionInput, QuestionUncheckedCreateWithoutSectionInput>
  }

  export type QuestionUpdateWithWhereUniqueWithoutSectionInput = {
    where: QuestionWhereUniqueInput
    data: XOR<QuestionUpdateWithoutSectionInput, QuestionUncheckedUpdateWithoutSectionInput>
  }

  export type QuestionUpdateManyWithWhereWithoutSectionInput = {
    where: QuestionScalarWhereInput
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyWithoutSectionInput>
  }

  export type TestUpsertWithoutSectionsInput = {
    update: XOR<TestUpdateWithoutSectionsInput, TestUncheckedUpdateWithoutSectionsInput>
    create: XOR<TestCreateWithoutSectionsInput, TestUncheckedCreateWithoutSectionsInput>
    where?: TestWhereInput
  }

  export type TestUpdateToOneWithWhereWithoutSectionsInput = {
    where?: TestWhereInput
    data: XOR<TestUpdateWithoutSectionsInput, TestUncheckedUpdateWithoutSectionsInput>
  }

  export type TestUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courseTests?: CourseTestUpdateManyWithoutTestNestedInput
    practiceSessions?: PracticeSessionUpdateManyWithoutTestNestedInput
    questions?: QuestionUpdateManyWithoutTestNestedInput
    testSkills?: TestSkillUpdateManyWithoutTestNestedInput
    englishTestType?: EnglishTestTypeUpdateOneRequiredWithoutTestsNestedInput
  }

  export type TestUncheckedUpdateWithoutSectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    englishTestTypeId?: StringFieldUpdateOperationsInput | string
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courseTests?: CourseTestUncheckedUpdateManyWithoutTestNestedInput
    practiceSessions?: PracticeSessionUncheckedUpdateManyWithoutTestNestedInput
    questions?: QuestionUncheckedUpdateManyWithoutTestNestedInput
    testSkills?: TestSkillUncheckedUpdateManyWithoutTestNestedInput
  }

  export type SectionCreateWithoutPassagesInput = {
    id?: string
    title: string
    skill?: $Enums.SkillType | null
    durationInSeconds?: number | null
    totalQuestions?: number | null
    totalScore?: number | null
    questions?: QuestionCreateNestedManyWithoutSectionInput
    test?: TestCreateNestedOneWithoutSectionsInput
  }

  export type SectionUncheckedCreateWithoutPassagesInput = {
    id?: string
    title: string
    testId?: string | null
    skill?: $Enums.SkillType | null
    durationInSeconds?: number | null
    totalQuestions?: number | null
    totalScore?: number | null
    questions?: QuestionUncheckedCreateNestedManyWithoutSectionInput
  }

  export type SectionCreateOrConnectWithoutPassagesInput = {
    where: SectionWhereUniqueInput
    create: XOR<SectionCreateWithoutPassagesInput, SectionUncheckedCreateWithoutPassagesInput>
  }

  export type QuestionCreateWithoutPassageInput = {
    id?: string
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    questionOrder?: number | null
    section?: SectionCreateNestedOneWithoutQuestionsInput
    test?: TestCreateNestedOneWithoutQuestionsInput
    userAnswers?: UserAnswerCreateNestedManyWithoutQuestionInput
  }

  export type QuestionUncheckedCreateWithoutPassageInput = {
    id?: string
    sectionId?: string | null
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    questionOrder?: number | null
    testId?: string | null
    userAnswers?: UserAnswerUncheckedCreateNestedManyWithoutQuestionInput
  }

  export type QuestionCreateOrConnectWithoutPassageInput = {
    where: QuestionWhereUniqueInput
    create: XOR<QuestionCreateWithoutPassageInput, QuestionUncheckedCreateWithoutPassageInput>
  }

  export type QuestionCreateManyPassageInputEnvelope = {
    data: QuestionCreateManyPassageInput | QuestionCreateManyPassageInput[]
    skipDuplicates?: boolean
  }

  export type SectionUpsertWithoutPassagesInput = {
    update: XOR<SectionUpdateWithoutPassagesInput, SectionUncheckedUpdateWithoutPassagesInput>
    create: XOR<SectionCreateWithoutPassagesInput, SectionUncheckedCreateWithoutPassagesInput>
    where?: SectionWhereInput
  }

  export type SectionUpdateToOneWithWhereWithoutPassagesInput = {
    where?: SectionWhereInput
    data: XOR<SectionUpdateWithoutPassagesInput, SectionUncheckedUpdateWithoutPassagesInput>
  }

  export type SectionUpdateWithoutPassagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    skill?: NullableEnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType | null
    durationInSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    totalQuestions?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    questions?: QuestionUpdateManyWithoutSectionNestedInput
    test?: TestUpdateOneWithoutSectionsNestedInput
  }

  export type SectionUncheckedUpdateWithoutPassagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    testId?: NullableStringFieldUpdateOperationsInput | string | null
    skill?: NullableEnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType | null
    durationInSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    totalQuestions?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    questions?: QuestionUncheckedUpdateManyWithoutSectionNestedInput
  }

  export type QuestionUpsertWithWhereUniqueWithoutPassageInput = {
    where: QuestionWhereUniqueInput
    update: XOR<QuestionUpdateWithoutPassageInput, QuestionUncheckedUpdateWithoutPassageInput>
    create: XOR<QuestionCreateWithoutPassageInput, QuestionUncheckedCreateWithoutPassageInput>
  }

  export type QuestionUpdateWithWhereUniqueWithoutPassageInput = {
    where: QuestionWhereUniqueInput
    data: XOR<QuestionUpdateWithoutPassageInput, QuestionUncheckedUpdateWithoutPassageInput>
  }

  export type QuestionUpdateManyWithWhereWithoutPassageInput = {
    where: QuestionScalarWhereInput
    data: XOR<QuestionUpdateManyMutationInput, QuestionUncheckedUpdateManyWithoutPassageInput>
  }

  export type PassageCreateWithoutQuestionsInput = {
    id?: string
    content: string
    passageOrder?: number | null
    section: SectionCreateNestedOneWithoutPassagesInput
  }

  export type PassageUncheckedCreateWithoutQuestionsInput = {
    id?: string
    sectionId: string
    content: string
    passageOrder?: number | null
  }

  export type PassageCreateOrConnectWithoutQuestionsInput = {
    where: PassageWhereUniqueInput
    create: XOR<PassageCreateWithoutQuestionsInput, PassageUncheckedCreateWithoutQuestionsInput>
  }

  export type SectionCreateWithoutQuestionsInput = {
    id?: string
    title: string
    skill?: $Enums.SkillType | null
    durationInSeconds?: number | null
    totalQuestions?: number | null
    totalScore?: number | null
    passages?: PassageCreateNestedManyWithoutSectionInput
    test?: TestCreateNestedOneWithoutSectionsInput
  }

  export type SectionUncheckedCreateWithoutQuestionsInput = {
    id?: string
    title: string
    testId?: string | null
    skill?: $Enums.SkillType | null
    durationInSeconds?: number | null
    totalQuestions?: number | null
    totalScore?: number | null
    passages?: PassageUncheckedCreateNestedManyWithoutSectionInput
  }

  export type SectionCreateOrConnectWithoutQuestionsInput = {
    where: SectionWhereUniqueInput
    create: XOR<SectionCreateWithoutQuestionsInput, SectionUncheckedCreateWithoutQuestionsInput>
  }

  export type TestCreateWithoutQuestionsInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    courseTests?: CourseTestCreateNestedManyWithoutTestInput
    practiceSessions?: PracticeSessionCreateNestedManyWithoutTestInput
    sections?: SectionCreateNestedManyWithoutTestInput
    testSkills?: TestSkillCreateNestedManyWithoutTestInput
    englishTestType: EnglishTestTypeCreateNestedOneWithoutTestsInput
  }

  export type TestUncheckedCreateWithoutQuestionsInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    englishTestTypeId: string
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    courseTests?: CourseTestUncheckedCreateNestedManyWithoutTestInput
    practiceSessions?: PracticeSessionUncheckedCreateNestedManyWithoutTestInput
    sections?: SectionUncheckedCreateNestedManyWithoutTestInput
    testSkills?: TestSkillUncheckedCreateNestedManyWithoutTestInput
  }

  export type TestCreateOrConnectWithoutQuestionsInput = {
    where: TestWhereUniqueInput
    create: XOR<TestCreateWithoutQuestionsInput, TestUncheckedCreateWithoutQuestionsInput>
  }

  export type UserAnswerCreateWithoutQuestionInput = {
    id?: string
    userId: string
    answerText?: string | null
    selectedOptionIndex?: number | null
    isCorrect?: boolean | null
    practiceSession: PracticeSessionCreateNestedOneWithoutUserAnswersInput
  }

  export type UserAnswerUncheckedCreateWithoutQuestionInput = {
    id?: string
    practiceSessionId: string
    userId: string
    answerText?: string | null
    selectedOptionIndex?: number | null
    isCorrect?: boolean | null
  }

  export type UserAnswerCreateOrConnectWithoutQuestionInput = {
    where: UserAnswerWhereUniqueInput
    create: XOR<UserAnswerCreateWithoutQuestionInput, UserAnswerUncheckedCreateWithoutQuestionInput>
  }

  export type UserAnswerCreateManyQuestionInputEnvelope = {
    data: UserAnswerCreateManyQuestionInput | UserAnswerCreateManyQuestionInput[]
    skipDuplicates?: boolean
  }

  export type PassageUpsertWithoutQuestionsInput = {
    update: XOR<PassageUpdateWithoutQuestionsInput, PassageUncheckedUpdateWithoutQuestionsInput>
    create: XOR<PassageCreateWithoutQuestionsInput, PassageUncheckedCreateWithoutQuestionsInput>
    where?: PassageWhereInput
  }

  export type PassageUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: PassageWhereInput
    data: XOR<PassageUpdateWithoutQuestionsInput, PassageUncheckedUpdateWithoutQuestionsInput>
  }

  export type PassageUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    passageOrder?: NullableIntFieldUpdateOperationsInput | number | null
    section?: SectionUpdateOneRequiredWithoutPassagesNestedInput
  }

  export type PassageUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    passageOrder?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SectionUpsertWithoutQuestionsInput = {
    update: XOR<SectionUpdateWithoutQuestionsInput, SectionUncheckedUpdateWithoutQuestionsInput>
    create: XOR<SectionCreateWithoutQuestionsInput, SectionUncheckedCreateWithoutQuestionsInput>
    where?: SectionWhereInput
  }

  export type SectionUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: SectionWhereInput
    data: XOR<SectionUpdateWithoutQuestionsInput, SectionUncheckedUpdateWithoutQuestionsInput>
  }

  export type SectionUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    skill?: NullableEnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType | null
    durationInSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    totalQuestions?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passages?: PassageUpdateManyWithoutSectionNestedInput
    test?: TestUpdateOneWithoutSectionsNestedInput
  }

  export type SectionUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    testId?: NullableStringFieldUpdateOperationsInput | string | null
    skill?: NullableEnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType | null
    durationInSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    totalQuestions?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passages?: PassageUncheckedUpdateManyWithoutSectionNestedInput
  }

  export type TestUpsertWithoutQuestionsInput = {
    update: XOR<TestUpdateWithoutQuestionsInput, TestUncheckedUpdateWithoutQuestionsInput>
    create: XOR<TestCreateWithoutQuestionsInput, TestUncheckedCreateWithoutQuestionsInput>
    where?: TestWhereInput
  }

  export type TestUpdateToOneWithWhereWithoutQuestionsInput = {
    where?: TestWhereInput
    data: XOR<TestUpdateWithoutQuestionsInput, TestUncheckedUpdateWithoutQuestionsInput>
  }

  export type TestUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courseTests?: CourseTestUpdateManyWithoutTestNestedInput
    practiceSessions?: PracticeSessionUpdateManyWithoutTestNestedInput
    sections?: SectionUpdateManyWithoutTestNestedInput
    testSkills?: TestSkillUpdateManyWithoutTestNestedInput
    englishTestType?: EnglishTestTypeUpdateOneRequiredWithoutTestsNestedInput
  }

  export type TestUncheckedUpdateWithoutQuestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    englishTestTypeId?: StringFieldUpdateOperationsInput | string
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courseTests?: CourseTestUncheckedUpdateManyWithoutTestNestedInput
    practiceSessions?: PracticeSessionUncheckedUpdateManyWithoutTestNestedInput
    sections?: SectionUncheckedUpdateManyWithoutTestNestedInput
    testSkills?: TestSkillUncheckedUpdateManyWithoutTestNestedInput
  }

  export type UserAnswerUpsertWithWhereUniqueWithoutQuestionInput = {
    where: UserAnswerWhereUniqueInput
    update: XOR<UserAnswerUpdateWithoutQuestionInput, UserAnswerUncheckedUpdateWithoutQuestionInput>
    create: XOR<UserAnswerCreateWithoutQuestionInput, UserAnswerUncheckedCreateWithoutQuestionInput>
  }

  export type UserAnswerUpdateWithWhereUniqueWithoutQuestionInput = {
    where: UserAnswerWhereUniqueInput
    data: XOR<UserAnswerUpdateWithoutQuestionInput, UserAnswerUncheckedUpdateWithoutQuestionInput>
  }

  export type UserAnswerUpdateManyWithWhereWithoutQuestionInput = {
    where: UserAnswerScalarWhereInput
    data: XOR<UserAnswerUpdateManyMutationInput, UserAnswerUncheckedUpdateManyWithoutQuestionInput>
  }

  export type UserAnswerScalarWhereInput = {
    AND?: UserAnswerScalarWhereInput | UserAnswerScalarWhereInput[]
    OR?: UserAnswerScalarWhereInput[]
    NOT?: UserAnswerScalarWhereInput | UserAnswerScalarWhereInput[]
    id?: UuidFilter<"UserAnswer"> | string
    practiceSessionId?: UuidFilter<"UserAnswer"> | string
    questionId?: UuidFilter<"UserAnswer"> | string
    userId?: UuidFilter<"UserAnswer"> | string
    answerText?: StringNullableFilter<"UserAnswer"> | string | null
    selectedOptionIndex?: IntNullableFilter<"UserAnswer"> | number | null
    isCorrect?: BoolNullableFilter<"UserAnswer"> | boolean | null
  }

  export type TestCreateWithoutPracticeSessionsInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    courseTests?: CourseTestCreateNestedManyWithoutTestInput
    questions?: QuestionCreateNestedManyWithoutTestInput
    sections?: SectionCreateNestedManyWithoutTestInput
    testSkills?: TestSkillCreateNestedManyWithoutTestInput
    englishTestType: EnglishTestTypeCreateNestedOneWithoutTestsInput
  }

  export type TestUncheckedCreateWithoutPracticeSessionsInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    englishTestTypeId: string
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    courseTests?: CourseTestUncheckedCreateNestedManyWithoutTestInput
    questions?: QuestionUncheckedCreateNestedManyWithoutTestInput
    sections?: SectionUncheckedCreateNestedManyWithoutTestInput
    testSkills?: TestSkillUncheckedCreateNestedManyWithoutTestInput
  }

  export type TestCreateOrConnectWithoutPracticeSessionsInput = {
    where: TestWhereUniqueInput
    create: XOR<TestCreateWithoutPracticeSessionsInput, TestUncheckedCreateWithoutPracticeSessionsInput>
  }

  export type UserAnswerCreateWithoutPracticeSessionInput = {
    id?: string
    userId: string
    answerText?: string | null
    selectedOptionIndex?: number | null
    isCorrect?: boolean | null
    question: QuestionCreateNestedOneWithoutUserAnswersInput
  }

  export type UserAnswerUncheckedCreateWithoutPracticeSessionInput = {
    id?: string
    questionId: string
    userId: string
    answerText?: string | null
    selectedOptionIndex?: number | null
    isCorrect?: boolean | null
  }

  export type UserAnswerCreateOrConnectWithoutPracticeSessionInput = {
    where: UserAnswerWhereUniqueInput
    create: XOR<UserAnswerCreateWithoutPracticeSessionInput, UserAnswerUncheckedCreateWithoutPracticeSessionInput>
  }

  export type UserAnswerCreateManyPracticeSessionInputEnvelope = {
    data: UserAnswerCreateManyPracticeSessionInput | UserAnswerCreateManyPracticeSessionInput[]
    skipDuplicates?: boolean
  }

  export type TestUpsertWithoutPracticeSessionsInput = {
    update: XOR<TestUpdateWithoutPracticeSessionsInput, TestUncheckedUpdateWithoutPracticeSessionsInput>
    create: XOR<TestCreateWithoutPracticeSessionsInput, TestUncheckedCreateWithoutPracticeSessionsInput>
    where?: TestWhereInput
  }

  export type TestUpdateToOneWithWhereWithoutPracticeSessionsInput = {
    where?: TestWhereInput
    data: XOR<TestUpdateWithoutPracticeSessionsInput, TestUncheckedUpdateWithoutPracticeSessionsInput>
  }

  export type TestUpdateWithoutPracticeSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courseTests?: CourseTestUpdateManyWithoutTestNestedInput
    questions?: QuestionUpdateManyWithoutTestNestedInput
    sections?: SectionUpdateManyWithoutTestNestedInput
    testSkills?: TestSkillUpdateManyWithoutTestNestedInput
    englishTestType?: EnglishTestTypeUpdateOneRequiredWithoutTestsNestedInput
  }

  export type TestUncheckedUpdateWithoutPracticeSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    englishTestTypeId?: StringFieldUpdateOperationsInput | string
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courseTests?: CourseTestUncheckedUpdateManyWithoutTestNestedInput
    questions?: QuestionUncheckedUpdateManyWithoutTestNestedInput
    sections?: SectionUncheckedUpdateManyWithoutTestNestedInput
    testSkills?: TestSkillUncheckedUpdateManyWithoutTestNestedInput
  }

  export type UserAnswerUpsertWithWhereUniqueWithoutPracticeSessionInput = {
    where: UserAnswerWhereUniqueInput
    update: XOR<UserAnswerUpdateWithoutPracticeSessionInput, UserAnswerUncheckedUpdateWithoutPracticeSessionInput>
    create: XOR<UserAnswerCreateWithoutPracticeSessionInput, UserAnswerUncheckedCreateWithoutPracticeSessionInput>
  }

  export type UserAnswerUpdateWithWhereUniqueWithoutPracticeSessionInput = {
    where: UserAnswerWhereUniqueInput
    data: XOR<UserAnswerUpdateWithoutPracticeSessionInput, UserAnswerUncheckedUpdateWithoutPracticeSessionInput>
  }

  export type UserAnswerUpdateManyWithWhereWithoutPracticeSessionInput = {
    where: UserAnswerScalarWhereInput
    data: XOR<UserAnswerUpdateManyMutationInput, UserAnswerUncheckedUpdateManyWithoutPracticeSessionInput>
  }

  export type PracticeSessionCreateWithoutUserAnswersInput = {
    id?: string
    userId: string
    selectedSections?: PracticeSessionCreateselectedSectionsInput | string[]
    status: $Enums.SessionStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
    overallScaledScore?: number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    test: TestCreateNestedOneWithoutPracticeSessionsInput
  }

  export type PracticeSessionUncheckedCreateWithoutUserAnswersInput = {
    id?: string
    userId: string
    testId: string
    selectedSections?: PracticeSessionCreateselectedSectionsInput | string[]
    status: $Enums.SessionStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
    overallScaledScore?: number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
  }

  export type PracticeSessionCreateOrConnectWithoutUserAnswersInput = {
    where: PracticeSessionWhereUniqueInput
    create: XOR<PracticeSessionCreateWithoutUserAnswersInput, PracticeSessionUncheckedCreateWithoutUserAnswersInput>
  }

  export type QuestionCreateWithoutUserAnswersInput = {
    id?: string
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    questionOrder?: number | null
    passage?: PassageCreateNestedOneWithoutQuestionsInput
    section?: SectionCreateNestedOneWithoutQuestionsInput
    test?: TestCreateNestedOneWithoutQuestionsInput
  }

  export type QuestionUncheckedCreateWithoutUserAnswersInput = {
    id?: string
    sectionId?: string | null
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    passageId?: string | null
    questionOrder?: number | null
    testId?: string | null
  }

  export type QuestionCreateOrConnectWithoutUserAnswersInput = {
    where: QuestionWhereUniqueInput
    create: XOR<QuestionCreateWithoutUserAnswersInput, QuestionUncheckedCreateWithoutUserAnswersInput>
  }

  export type PracticeSessionUpsertWithoutUserAnswersInput = {
    update: XOR<PracticeSessionUpdateWithoutUserAnswersInput, PracticeSessionUncheckedUpdateWithoutUserAnswersInput>
    create: XOR<PracticeSessionCreateWithoutUserAnswersInput, PracticeSessionUncheckedCreateWithoutUserAnswersInput>
    where?: PracticeSessionWhereInput
  }

  export type PracticeSessionUpdateToOneWithWhereWithoutUserAnswersInput = {
    where?: PracticeSessionWhereInput
    data: XOR<PracticeSessionUpdateWithoutUserAnswersInput, PracticeSessionUncheckedUpdateWithoutUserAnswersInput>
  }

  export type PracticeSessionUpdateWithoutUserAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    selectedSections?: PracticeSessionUpdateselectedSectionsInput | string[]
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    overallScaledScore?: NullableFloatFieldUpdateOperationsInput | number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    test?: TestUpdateOneRequiredWithoutPracticeSessionsNestedInput
  }

  export type PracticeSessionUncheckedUpdateWithoutUserAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    testId?: StringFieldUpdateOperationsInput | string
    selectedSections?: PracticeSessionUpdateselectedSectionsInput | string[]
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    overallScaledScore?: NullableFloatFieldUpdateOperationsInput | number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
  }

  export type QuestionUpsertWithoutUserAnswersInput = {
    update: XOR<QuestionUpdateWithoutUserAnswersInput, QuestionUncheckedUpdateWithoutUserAnswersInput>
    create: XOR<QuestionCreateWithoutUserAnswersInput, QuestionUncheckedCreateWithoutUserAnswersInput>
    where?: QuestionWhereInput
  }

  export type QuestionUpdateToOneWithWhereWithoutUserAnswersInput = {
    where?: QuestionWhereInput
    data: XOR<QuestionUpdateWithoutUserAnswersInput, QuestionUncheckedUpdateWithoutUserAnswersInput>
  }

  export type QuestionUpdateWithoutUserAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    passage?: PassageUpdateOneWithoutQuestionsNestedInput
    section?: SectionUpdateOneWithoutQuestionsNestedInput
    test?: TestUpdateOneWithoutQuestionsNestedInput
  }

  export type QuestionUncheckedUpdateWithoutUserAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    passageId?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    testId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type EnglishTestTypeCreateWithoutScoreConversionsInput = {
    id?: string
    name: string
    tests?: TestCreateNestedManyWithoutEnglishTestTypeInput
  }

  export type EnglishTestTypeUncheckedCreateWithoutScoreConversionsInput = {
    id?: string
    name: string
    tests?: TestUncheckedCreateNestedManyWithoutEnglishTestTypeInput
  }

  export type EnglishTestTypeCreateOrConnectWithoutScoreConversionsInput = {
    where: EnglishTestTypeWhereUniqueInput
    create: XOR<EnglishTestTypeCreateWithoutScoreConversionsInput, EnglishTestTypeUncheckedCreateWithoutScoreConversionsInput>
  }

  export type EnglishTestTypeUpsertWithoutScoreConversionsInput = {
    update: XOR<EnglishTestTypeUpdateWithoutScoreConversionsInput, EnglishTestTypeUncheckedUpdateWithoutScoreConversionsInput>
    create: XOR<EnglishTestTypeCreateWithoutScoreConversionsInput, EnglishTestTypeUncheckedCreateWithoutScoreConversionsInput>
    where?: EnglishTestTypeWhereInput
  }

  export type EnglishTestTypeUpdateToOneWithWhereWithoutScoreConversionsInput = {
    where?: EnglishTestTypeWhereInput
    data: XOR<EnglishTestTypeUpdateWithoutScoreConversionsInput, EnglishTestTypeUncheckedUpdateWithoutScoreConversionsInput>
  }

  export type EnglishTestTypeUpdateWithoutScoreConversionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tests?: TestUpdateManyWithoutEnglishTestTypeNestedInput
  }

  export type EnglishTestTypeUncheckedUpdateWithoutScoreConversionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    tests?: TestUncheckedUpdateManyWithoutEnglishTestTypeNestedInput
  }

  export type TestCreateWithoutTestSkillsInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    courseTests?: CourseTestCreateNestedManyWithoutTestInput
    practiceSessions?: PracticeSessionCreateNestedManyWithoutTestInput
    questions?: QuestionCreateNestedManyWithoutTestInput
    sections?: SectionCreateNestedManyWithoutTestInput
    englishTestType: EnglishTestTypeCreateNestedOneWithoutTestsInput
  }

  export type TestUncheckedCreateWithoutTestSkillsInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    englishTestTypeId: string
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
    courseTests?: CourseTestUncheckedCreateNestedManyWithoutTestInput
    practiceSessions?: PracticeSessionUncheckedCreateNestedManyWithoutTestInput
    questions?: QuestionUncheckedCreateNestedManyWithoutTestInput
    sections?: SectionUncheckedCreateNestedManyWithoutTestInput
  }

  export type TestCreateOrConnectWithoutTestSkillsInput = {
    where: TestWhereUniqueInput
    create: XOR<TestCreateWithoutTestSkillsInput, TestUncheckedCreateWithoutTestSkillsInput>
  }

  export type TestUpsertWithoutTestSkillsInput = {
    update: XOR<TestUpdateWithoutTestSkillsInput, TestUncheckedUpdateWithoutTestSkillsInput>
    create: XOR<TestCreateWithoutTestSkillsInput, TestUncheckedCreateWithoutTestSkillsInput>
    where?: TestWhereInput
  }

  export type TestUpdateToOneWithWhereWithoutTestSkillsInput = {
    where?: TestWhereInput
    data: XOR<TestUpdateWithoutTestSkillsInput, TestUncheckedUpdateWithoutTestSkillsInput>
  }

  export type TestUpdateWithoutTestSkillsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courseTests?: CourseTestUpdateManyWithoutTestNestedInput
    practiceSessions?: PracticeSessionUpdateManyWithoutTestNestedInput
    questions?: QuestionUpdateManyWithoutTestNestedInput
    sections?: SectionUpdateManyWithoutTestNestedInput
    englishTestType?: EnglishTestTypeUpdateOneRequiredWithoutTestsNestedInput
  }

  export type TestUncheckedUpdateWithoutTestSkillsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    englishTestTypeId?: StringFieldUpdateOperationsInput | string
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courseTests?: CourseTestUncheckedUpdateManyWithoutTestNestedInput
    practiceSessions?: PracticeSessionUncheckedUpdateManyWithoutTestNestedInput
    questions?: QuestionUncheckedUpdateManyWithoutTestNestedInput
    sections?: SectionUncheckedUpdateManyWithoutTestNestedInput
  }

  export type ScoreConversionCreateManyEnglishTestTypeInput = {
    id?: string
    skill: $Enums.SkillType
    rawScore: number
    scaledScore: number
  }

  export type TestCreateManyEnglishTestTypeInput = {
    id?: string
    title: string
    durationInMinutes?: number | null
    totalScore?: number | null
    passingScore?: number | null
    practiceCount?: number | null
    createdAt?: Date | string
    maxAttempts?: number | null
    testType?: $Enums.TestType | null
    updatedAt?: Date | string | null
  }

  export type ScoreConversionUpdateWithoutEnglishTestTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
    rawScore?: IntFieldUpdateOperationsInput | number
    scaledScore?: FloatFieldUpdateOperationsInput | number
  }

  export type ScoreConversionUncheckedUpdateWithoutEnglishTestTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
    rawScore?: IntFieldUpdateOperationsInput | number
    scaledScore?: FloatFieldUpdateOperationsInput | number
  }

  export type ScoreConversionUncheckedUpdateManyWithoutEnglishTestTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
    rawScore?: IntFieldUpdateOperationsInput | number
    scaledScore?: FloatFieldUpdateOperationsInput | number
  }

  export type TestUpdateWithoutEnglishTestTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courseTests?: CourseTestUpdateManyWithoutTestNestedInput
    practiceSessions?: PracticeSessionUpdateManyWithoutTestNestedInput
    questions?: QuestionUpdateManyWithoutTestNestedInput
    sections?: SectionUpdateManyWithoutTestNestedInput
    testSkills?: TestSkillUpdateManyWithoutTestNestedInput
  }

  export type TestUncheckedUpdateWithoutEnglishTestTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    courseTests?: CourseTestUncheckedUpdateManyWithoutTestNestedInput
    practiceSessions?: PracticeSessionUncheckedUpdateManyWithoutTestNestedInput
    questions?: QuestionUncheckedUpdateManyWithoutTestNestedInput
    sections?: SectionUncheckedUpdateManyWithoutTestNestedInput
    testSkills?: TestSkillUncheckedUpdateManyWithoutTestNestedInput
  }

  export type TestUncheckedUpdateManyWithoutEnglishTestTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    durationInMinutes?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passingScore?: NullableFloatFieldUpdateOperationsInput | number | null
    practiceCount?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    maxAttempts?: NullableIntFieldUpdateOperationsInput | number | null
    testType?: NullableEnumTestTypeFieldUpdateOperationsInput | $Enums.TestType | null
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CourseTestCreateManyTestInput = {
    courseId: string
  }

  export type PracticeSessionCreateManyTestInput = {
    id?: string
    userId: string
    selectedSections?: PracticeSessionCreateselectedSectionsInput | string[]
    status: $Enums.SessionStatus
    createdAt?: Date | string
    completedAt?: Date | string | null
    overallScaledScore?: number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
  }

  export type QuestionCreateManyTestInput = {
    id?: string
    sectionId?: string | null
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    passageId?: string | null
    questionOrder?: number | null
  }

  export type SectionCreateManyTestInput = {
    id?: string
    title: string
    skill?: $Enums.SkillType | null
    durationInSeconds?: number | null
    totalQuestions?: number | null
    totalScore?: number | null
  }

  export type TestSkillCreateManyTestInput = {
    skill: $Enums.SkillType
  }

  export type CourseTestUpdateWithoutTestInput = {
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type CourseTestUncheckedUpdateWithoutTestInput = {
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type CourseTestUncheckedUpdateManyWithoutTestInput = {
    courseId?: StringFieldUpdateOperationsInput | string
  }

  export type PracticeSessionUpdateWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    selectedSections?: PracticeSessionUpdateselectedSectionsInput | string[]
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    overallScaledScore?: NullableFloatFieldUpdateOperationsInput | number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    userAnswers?: UserAnswerUpdateManyWithoutPracticeSessionNestedInput
  }

  export type PracticeSessionUncheckedUpdateWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    selectedSections?: PracticeSessionUpdateselectedSectionsInput | string[]
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    overallScaledScore?: NullableFloatFieldUpdateOperationsInput | number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    userAnswers?: UserAnswerUncheckedUpdateManyWithoutPracticeSessionNestedInput
  }

  export type PracticeSessionUncheckedUpdateManyWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    selectedSections?: PracticeSessionUpdateselectedSectionsInput | string[]
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    overallScaledScore?: NullableFloatFieldUpdateOperationsInput | number | null
    rawScoresBySkill?: NullableJsonNullValueInput | InputJsonValue
    scoresBySkill?: NullableJsonNullValueInput | InputJsonValue
  }

  export type QuestionUpdateWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    passage?: PassageUpdateOneWithoutQuestionsNestedInput
    section?: SectionUpdateOneWithoutQuestionsNestedInput
    userAnswers?: UserAnswerUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    passageId?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    userAnswers?: UserAnswerUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateManyWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    passageId?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SectionUpdateWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    skill?: NullableEnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType | null
    durationInSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    totalQuestions?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passages?: PassageUpdateManyWithoutSectionNestedInput
    questions?: QuestionUpdateManyWithoutSectionNestedInput
  }

  export type SectionUncheckedUpdateWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    skill?: NullableEnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType | null
    durationInSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    totalQuestions?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
    passages?: PassageUncheckedUpdateManyWithoutSectionNestedInput
    questions?: QuestionUncheckedUpdateManyWithoutSectionNestedInput
  }

  export type SectionUncheckedUpdateManyWithoutTestInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    skill?: NullableEnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType | null
    durationInSeconds?: NullableFloatFieldUpdateOperationsInput | number | null
    totalQuestions?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type TestSkillUpdateWithoutTestInput = {
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
  }

  export type TestSkillUncheckedUpdateWithoutTestInput = {
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
  }

  export type TestSkillUncheckedUpdateManyWithoutTestInput = {
    skill?: EnumSkillTypeFieldUpdateOperationsInput | $Enums.SkillType
  }

  export type PassageCreateManySectionInput = {
    id?: string
    content: string
    passageOrder?: number | null
  }

  export type QuestionCreateManySectionInput = {
    id?: string
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    passageId?: string | null
    questionOrder?: number | null
    testId?: string | null
  }

  export type PassageUpdateWithoutSectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    passageOrder?: NullableIntFieldUpdateOperationsInput | number | null
    questions?: QuestionUpdateManyWithoutPassageNestedInput
  }

  export type PassageUncheckedUpdateWithoutSectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    passageOrder?: NullableIntFieldUpdateOperationsInput | number | null
    questions?: QuestionUncheckedUpdateManyWithoutPassageNestedInput
  }

  export type PassageUncheckedUpdateManyWithoutSectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    passageOrder?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type QuestionUpdateWithoutSectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    passage?: PassageUpdateOneWithoutQuestionsNestedInput
    test?: TestUpdateOneWithoutQuestionsNestedInput
    userAnswers?: UserAnswerUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateWithoutSectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    passageId?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    testId?: NullableStringFieldUpdateOperationsInput | string | null
    userAnswers?: UserAnswerUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateManyWithoutSectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    passageId?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    testId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QuestionCreateManyPassageInput = {
    id?: string
    sectionId?: string | null
    questionText?: string | null
    imageUrl?: string | null
    questionType: $Enums.QuestionType
    options?: QuestionCreateoptionsInput | string[]
    correctAnswerIndex?: number | null
    wordLimit?: number | null
    correctAnswer?: string | null
    questionOrder?: number | null
    testId?: string | null
  }

  export type QuestionUpdateWithoutPassageInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    section?: SectionUpdateOneWithoutQuestionsNestedInput
    test?: TestUpdateOneWithoutQuestionsNestedInput
    userAnswers?: UserAnswerUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateWithoutPassageInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    testId?: NullableStringFieldUpdateOperationsInput | string | null
    userAnswers?: UserAnswerUncheckedUpdateManyWithoutQuestionNestedInput
  }

  export type QuestionUncheckedUpdateManyWithoutPassageInput = {
    id?: StringFieldUpdateOperationsInput | string
    sectionId?: NullableStringFieldUpdateOperationsInput | string | null
    questionText?: NullableStringFieldUpdateOperationsInput | string | null
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    questionType?: EnumQuestionTypeFieldUpdateOperationsInput | $Enums.QuestionType
    options?: QuestionUpdateoptionsInput | string[]
    correctAnswerIndex?: NullableIntFieldUpdateOperationsInput | number | null
    wordLimit?: NullableIntFieldUpdateOperationsInput | number | null
    correctAnswer?: NullableStringFieldUpdateOperationsInput | string | null
    questionOrder?: NullableIntFieldUpdateOperationsInput | number | null
    testId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserAnswerCreateManyQuestionInput = {
    id?: string
    practiceSessionId: string
    userId: string
    answerText?: string | null
    selectedOptionIndex?: number | null
    isCorrect?: boolean | null
  }

  export type UserAnswerUpdateWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    selectedOptionIndex?: NullableIntFieldUpdateOperationsInput | number | null
    isCorrect?: NullableBoolFieldUpdateOperationsInput | boolean | null
    practiceSession?: PracticeSessionUpdateOneRequiredWithoutUserAnswersNestedInput
  }

  export type UserAnswerUncheckedUpdateWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    practiceSessionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    selectedOptionIndex?: NullableIntFieldUpdateOperationsInput | number | null
    isCorrect?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type UserAnswerUncheckedUpdateManyWithoutQuestionInput = {
    id?: StringFieldUpdateOperationsInput | string
    practiceSessionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    selectedOptionIndex?: NullableIntFieldUpdateOperationsInput | number | null
    isCorrect?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type UserAnswerCreateManyPracticeSessionInput = {
    id?: string
    questionId: string
    userId: string
    answerText?: string | null
    selectedOptionIndex?: number | null
    isCorrect?: boolean | null
  }

  export type UserAnswerUpdateWithoutPracticeSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    selectedOptionIndex?: NullableIntFieldUpdateOperationsInput | number | null
    isCorrect?: NullableBoolFieldUpdateOperationsInput | boolean | null
    question?: QuestionUpdateOneRequiredWithoutUserAnswersNestedInput
  }

  export type UserAnswerUncheckedUpdateWithoutPracticeSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    selectedOptionIndex?: NullableIntFieldUpdateOperationsInput | number | null
    isCorrect?: NullableBoolFieldUpdateOperationsInput | boolean | null
  }

  export type UserAnswerUncheckedUpdateManyWithoutPracticeSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    questionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    answerText?: NullableStringFieldUpdateOperationsInput | string | null
    selectedOptionIndex?: NullableIntFieldUpdateOperationsInput | number | null
    isCorrect?: NullableBoolFieldUpdateOperationsInput | boolean | null
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