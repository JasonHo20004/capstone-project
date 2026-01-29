
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
 * Model Tag
 * 
 */
export type Tag = $Result.DefaultSelection<Prisma.$TagPayload>
/**
 * Model FlashcardDeck
 * 
 */
export type FlashcardDeck = $Result.DefaultSelection<Prisma.$FlashcardDeckPayload>
/**
 * Model Flashcard
 * 
 */
export type Flashcard = $Result.DefaultSelection<Prisma.$FlashcardPayload>
/**
 * Model DeckTag
 * 
 */
export type DeckTag = $Result.DefaultSelection<Prisma.$DeckTagPayload>
/**
 * Model UserFlashcardProgress
 * 
 */
export type UserFlashcardProgress = $Result.DefaultSelection<Prisma.$UserFlashcardProgressPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const FlashcardStatus: {
  LEARNING: 'LEARNING',
  REVIEW: 'REVIEW'
};

export type FlashcardStatus = (typeof FlashcardStatus)[keyof typeof FlashcardStatus]

}

export type FlashcardStatus = $Enums.FlashcardStatus

export const FlashcardStatus: typeof $Enums.FlashcardStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tags
 * const tags = await prisma.tag.findMany()
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
   * // Fetch zero or more Tags
   * const tags = await prisma.tag.findMany()
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
   * `prisma.tag`: Exposes CRUD operations for the **Tag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tags
    * const tags = await prisma.tag.findMany()
    * ```
    */
  get tag(): Prisma.TagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.flashcardDeck`: Exposes CRUD operations for the **FlashcardDeck** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FlashcardDecks
    * const flashcardDecks = await prisma.flashcardDeck.findMany()
    * ```
    */
  get flashcardDeck(): Prisma.FlashcardDeckDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.flashcard`: Exposes CRUD operations for the **Flashcard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Flashcards
    * const flashcards = await prisma.flashcard.findMany()
    * ```
    */
  get flashcard(): Prisma.FlashcardDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.deckTag`: Exposes CRUD operations for the **DeckTag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DeckTags
    * const deckTags = await prisma.deckTag.findMany()
    * ```
    */
  get deckTag(): Prisma.DeckTagDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userFlashcardProgress`: Exposes CRUD operations for the **UserFlashcardProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserFlashcardProgresses
    * const userFlashcardProgresses = await prisma.userFlashcardProgress.findMany()
    * ```
    */
  get userFlashcardProgress(): Prisma.UserFlashcardProgressDelegate<ExtArgs, ClientOptions>;
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
    Tag: 'Tag',
    FlashcardDeck: 'FlashcardDeck',
    Flashcard: 'Flashcard',
    DeckTag: 'DeckTag',
    UserFlashcardProgress: 'UserFlashcardProgress'
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
      modelProps: "tag" | "flashcardDeck" | "flashcard" | "deckTag" | "userFlashcardProgress"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tag: {
        payload: Prisma.$TagPayload<ExtArgs>
        fields: Prisma.TagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findFirst: {
            args: Prisma.TagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          findMany: {
            args: Prisma.TagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          create: {
            args: Prisma.TagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          createMany: {
            args: Prisma.TagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          delete: {
            args: Prisma.TagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          update: {
            args: Prisma.TagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          deleteMany: {
            args: Prisma.TagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>[]
          }
          upsert: {
            args: Prisma.TagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TagPayload>
          }
          aggregate: {
            args: Prisma.TagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTag>
          }
          groupBy: {
            args: Prisma.TagGroupByArgs<ExtArgs>
            result: $Utils.Optional<TagGroupByOutputType>[]
          }
          count: {
            args: Prisma.TagCountArgs<ExtArgs>
            result: $Utils.Optional<TagCountAggregateOutputType> | number
          }
        }
      }
      FlashcardDeck: {
        payload: Prisma.$FlashcardDeckPayload<ExtArgs>
        fields: Prisma.FlashcardDeckFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FlashcardDeckFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardDeckPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FlashcardDeckFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardDeckPayload>
          }
          findFirst: {
            args: Prisma.FlashcardDeckFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardDeckPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FlashcardDeckFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardDeckPayload>
          }
          findMany: {
            args: Prisma.FlashcardDeckFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardDeckPayload>[]
          }
          create: {
            args: Prisma.FlashcardDeckCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardDeckPayload>
          }
          createMany: {
            args: Prisma.FlashcardDeckCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FlashcardDeckCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardDeckPayload>[]
          }
          delete: {
            args: Prisma.FlashcardDeckDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardDeckPayload>
          }
          update: {
            args: Prisma.FlashcardDeckUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardDeckPayload>
          }
          deleteMany: {
            args: Prisma.FlashcardDeckDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FlashcardDeckUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FlashcardDeckUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardDeckPayload>[]
          }
          upsert: {
            args: Prisma.FlashcardDeckUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardDeckPayload>
          }
          aggregate: {
            args: Prisma.FlashcardDeckAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFlashcardDeck>
          }
          groupBy: {
            args: Prisma.FlashcardDeckGroupByArgs<ExtArgs>
            result: $Utils.Optional<FlashcardDeckGroupByOutputType>[]
          }
          count: {
            args: Prisma.FlashcardDeckCountArgs<ExtArgs>
            result: $Utils.Optional<FlashcardDeckCountAggregateOutputType> | number
          }
        }
      }
      Flashcard: {
        payload: Prisma.$FlashcardPayload<ExtArgs>
        fields: Prisma.FlashcardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FlashcardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FlashcardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          findFirst: {
            args: Prisma.FlashcardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FlashcardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          findMany: {
            args: Prisma.FlashcardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>[]
          }
          create: {
            args: Prisma.FlashcardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          createMany: {
            args: Prisma.FlashcardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FlashcardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>[]
          }
          delete: {
            args: Prisma.FlashcardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          update: {
            args: Prisma.FlashcardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          deleteMany: {
            args: Prisma.FlashcardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FlashcardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FlashcardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>[]
          }
          upsert: {
            args: Prisma.FlashcardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FlashcardPayload>
          }
          aggregate: {
            args: Prisma.FlashcardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFlashcard>
          }
          groupBy: {
            args: Prisma.FlashcardGroupByArgs<ExtArgs>
            result: $Utils.Optional<FlashcardGroupByOutputType>[]
          }
          count: {
            args: Prisma.FlashcardCountArgs<ExtArgs>
            result: $Utils.Optional<FlashcardCountAggregateOutputType> | number
          }
        }
      }
      DeckTag: {
        payload: Prisma.$DeckTagPayload<ExtArgs>
        fields: Prisma.DeckTagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeckTagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckTagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeckTagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckTagPayload>
          }
          findFirst: {
            args: Prisma.DeckTagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckTagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeckTagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckTagPayload>
          }
          findMany: {
            args: Prisma.DeckTagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckTagPayload>[]
          }
          create: {
            args: Prisma.DeckTagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckTagPayload>
          }
          createMany: {
            args: Prisma.DeckTagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeckTagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckTagPayload>[]
          }
          delete: {
            args: Prisma.DeckTagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckTagPayload>
          }
          update: {
            args: Prisma.DeckTagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckTagPayload>
          }
          deleteMany: {
            args: Prisma.DeckTagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeckTagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeckTagUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckTagPayload>[]
          }
          upsert: {
            args: Prisma.DeckTagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeckTagPayload>
          }
          aggregate: {
            args: Prisma.DeckTagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeckTag>
          }
          groupBy: {
            args: Prisma.DeckTagGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeckTagGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeckTagCountArgs<ExtArgs>
            result: $Utils.Optional<DeckTagCountAggregateOutputType> | number
          }
        }
      }
      UserFlashcardProgress: {
        payload: Prisma.$UserFlashcardProgressPayload<ExtArgs>
        fields: Prisma.UserFlashcardProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFlashcardProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFlashcardProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardProgressPayload>
          }
          findFirst: {
            args: Prisma.UserFlashcardProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFlashcardProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardProgressPayload>
          }
          findMany: {
            args: Prisma.UserFlashcardProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardProgressPayload>[]
          }
          create: {
            args: Prisma.UserFlashcardProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardProgressPayload>
          }
          createMany: {
            args: Prisma.UserFlashcardProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserFlashcardProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardProgressPayload>[]
          }
          delete: {
            args: Prisma.UserFlashcardProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardProgressPayload>
          }
          update: {
            args: Prisma.UserFlashcardProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardProgressPayload>
          }
          deleteMany: {
            args: Prisma.UserFlashcardProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserFlashcardProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserFlashcardProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardProgressPayload>[]
          }
          upsert: {
            args: Prisma.UserFlashcardProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserFlashcardProgressPayload>
          }
          aggregate: {
            args: Prisma.UserFlashcardProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserFlashcardProgress>
          }
          groupBy: {
            args: Prisma.UserFlashcardProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserFlashcardProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserFlashcardProgressCountArgs<ExtArgs>
            result: $Utils.Optional<UserFlashcardProgressCountAggregateOutputType> | number
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
    tag?: TagOmit
    flashcardDeck?: FlashcardDeckOmit
    flashcard?: FlashcardOmit
    deckTag?: DeckTagOmit
    userFlashcardProgress?: UserFlashcardProgressOmit
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
   * Count Type TagCountOutputType
   */

  export type TagCountOutputType = {
    deckTags: number
  }

  export type TagCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deckTags?: boolean | TagCountOutputTypeCountDeckTagsArgs
  }

  // Custom InputTypes
  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TagCountOutputType
     */
    select?: TagCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TagCountOutputType without action
   */
  export type TagCountOutputTypeCountDeckTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeckTagWhereInput
  }


  /**
   * Count Type FlashcardDeckCountOutputType
   */

  export type FlashcardDeckCountOutputType = {
    deckTags: number
    flashcards: number
  }

  export type FlashcardDeckCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deckTags?: boolean | FlashcardDeckCountOutputTypeCountDeckTagsArgs
    flashcards?: boolean | FlashcardDeckCountOutputTypeCountFlashcardsArgs
  }

  // Custom InputTypes
  /**
   * FlashcardDeckCountOutputType without action
   */
  export type FlashcardDeckCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeckCountOutputType
     */
    select?: FlashcardDeckCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FlashcardDeckCountOutputType without action
   */
  export type FlashcardDeckCountOutputTypeCountDeckTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeckTagWhereInput
  }

  /**
   * FlashcardDeckCountOutputType without action
   */
  export type FlashcardDeckCountOutputTypeCountFlashcardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardWhereInput
  }


  /**
   * Count Type FlashcardCountOutputType
   */

  export type FlashcardCountOutputType = {
    userProgress: number
  }

  export type FlashcardCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userProgress?: boolean | FlashcardCountOutputTypeCountUserProgressArgs
  }

  // Custom InputTypes
  /**
   * FlashcardCountOutputType without action
   */
  export type FlashcardCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardCountOutputType
     */
    select?: FlashcardCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * FlashcardCountOutputType without action
   */
  export type FlashcardCountOutputTypeCountUserProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserFlashcardProgressWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Tag
   */

  export type AggregateTag = {
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  export type TagMinAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type TagMaxAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type TagCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type TagMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type TagMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type TagCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type TagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tag to aggregate.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tags
    **/
    _count?: true | TagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TagMaxAggregateInputType
  }

  export type GetTagAggregateType<T extends TagAggregateArgs> = {
        [P in keyof T & keyof AggregateTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTag[P]>
      : GetScalarType<T[P], AggregateTag[P]>
  }




  export type TagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TagWhereInput
    orderBy?: TagOrderByWithAggregationInput | TagOrderByWithAggregationInput[]
    by: TagScalarFieldEnum[] | TagScalarFieldEnum
    having?: TagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TagCountAggregateInputType | true
    _min?: TagMinAggregateInputType
    _max?: TagMaxAggregateInputType
  }

  export type TagGroupByOutputType = {
    id: string
    name: string
    _count: TagCountAggregateOutputType | null
    _min: TagMinAggregateOutputType | null
    _max: TagMaxAggregateOutputType | null
  }

  type GetTagGroupByPayload<T extends TagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TagGroupByOutputType[P]>
            : GetScalarType<T[P], TagGroupByOutputType[P]>
        }
      >
    >


  export type TagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    deckTags?: boolean | Tag$deckTagsArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tag"]>

  export type TagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["tag"]>

  export type TagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["tag"]>

  export type TagSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type TagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name", ExtArgs["result"]["tag"]>
  export type TagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deckTags?: boolean | Tag$deckTagsArgs<ExtArgs>
    _count?: boolean | TagCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tag"
    objects: {
      deckTags: Prisma.$DeckTagPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
    }, ExtArgs["result"]["tag"]>
    composites: {}
  }

  type TagGetPayload<S extends boolean | null | undefined | TagDefaultArgs> = $Result.GetResult<Prisma.$TagPayload, S>

  type TagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TagCountAggregateInputType | true
    }

  export interface TagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tag'], meta: { name: 'Tag' } }
    /**
     * Find zero or one Tag that matches the filter.
     * @param {TagFindUniqueArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TagFindUniqueArgs>(args: SelectSubset<T, TagFindUniqueArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TagFindUniqueOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TagFindUniqueOrThrowArgs>(args: SelectSubset<T, TagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TagFindFirstArgs>(args?: SelectSubset<T, TagFindFirstArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindFirstOrThrowArgs} args - Arguments to find a Tag
     * @example
     * // Get one Tag
     * const tag = await prisma.tag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TagFindFirstOrThrowArgs>(args?: SelectSubset<T, TagFindFirstOrThrowArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tags
     * const tags = await prisma.tag.findMany()
     * 
     * // Get first 10 Tags
     * const tags = await prisma.tag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tagWithIdOnly = await prisma.tag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TagFindManyArgs>(args?: SelectSubset<T, TagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tag.
     * @param {TagCreateArgs} args - Arguments to create a Tag.
     * @example
     * // Create one Tag
     * const Tag = await prisma.tag.create({
     *   data: {
     *     // ... data to create a Tag
     *   }
     * })
     * 
     */
    create<T extends TagCreateArgs>(args: SelectSubset<T, TagCreateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tags.
     * @param {TagCreateManyArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TagCreateManyArgs>(args?: SelectSubset<T, TagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tags and returns the data saved in the database.
     * @param {TagCreateManyAndReturnArgs} args - Arguments to create many Tags.
     * @example
     * // Create many Tags
     * const tag = await prisma.tag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TagCreateManyAndReturnArgs>(args?: SelectSubset<T, TagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tag.
     * @param {TagDeleteArgs} args - Arguments to delete one Tag.
     * @example
     * // Delete one Tag
     * const Tag = await prisma.tag.delete({
     *   where: {
     *     // ... filter to delete one Tag
     *   }
     * })
     * 
     */
    delete<T extends TagDeleteArgs>(args: SelectSubset<T, TagDeleteArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tag.
     * @param {TagUpdateArgs} args - Arguments to update one Tag.
     * @example
     * // Update one Tag
     * const tag = await prisma.tag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TagUpdateArgs>(args: SelectSubset<T, TagUpdateArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tags.
     * @param {TagDeleteManyArgs} args - Arguments to filter Tags to delete.
     * @example
     * // Delete a few Tags
     * const { count } = await prisma.tag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TagDeleteManyArgs>(args?: SelectSubset<T, TagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TagUpdateManyArgs>(args: SelectSubset<T, TagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tags and returns the data updated in the database.
     * @param {TagUpdateManyAndReturnArgs} args - Arguments to update many Tags.
     * @example
     * // Update many Tags
     * const tag = await prisma.tag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tags and only return the `id`
     * const tagWithIdOnly = await prisma.tag.updateManyAndReturn({
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
    updateManyAndReturn<T extends TagUpdateManyAndReturnArgs>(args: SelectSubset<T, TagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tag.
     * @param {TagUpsertArgs} args - Arguments to update or create a Tag.
     * @example
     * // Update or create a Tag
     * const tag = await prisma.tag.upsert({
     *   create: {
     *     // ... data to create a Tag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tag we want to update
     *   }
     * })
     */
    upsert<T extends TagUpsertArgs>(args: SelectSubset<T, TagUpsertArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagCountArgs} args - Arguments to filter Tags to count.
     * @example
     * // Count the number of Tags
     * const count = await prisma.tag.count({
     *   where: {
     *     // ... the filter for the Tags we want to count
     *   }
     * })
    **/
    count<T extends TagCountArgs>(
      args?: Subset<T, TagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TagAggregateArgs>(args: Subset<T, TagAggregateArgs>): Prisma.PrismaPromise<GetTagAggregateType<T>>

    /**
     * Group by Tag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TagGroupByArgs} args - Group by arguments.
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
      T extends TagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TagGroupByArgs['orderBy'] }
        : { orderBy?: TagGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tag model
   */
  readonly fields: TagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    deckTags<T extends Tag$deckTagsArgs<ExtArgs> = {}>(args?: Subset<T, Tag$deckTagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Tag model
   */
  interface TagFieldRefs {
    readonly id: FieldRef<"Tag", 'String'>
    readonly name: FieldRef<"Tag", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Tag findUnique
   */
  export type TagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findUniqueOrThrow
   */
  export type TagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag findFirst
   */
  export type TagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findFirstOrThrow
   */
  export type TagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tag to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tags.
     */
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag findMany
   */
  export type TagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter, which Tags to fetch.
     */
    where?: TagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tags to fetch.
     */
    orderBy?: TagOrderByWithRelationInput | TagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tags.
     */
    cursor?: TagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tags.
     */
    skip?: number
    distinct?: TagScalarFieldEnum | TagScalarFieldEnum[]
  }

  /**
   * Tag create
   */
  export type TagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to create a Tag.
     */
    data: XOR<TagCreateInput, TagUncheckedCreateInput>
  }

  /**
   * Tag createMany
   */
  export type TagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag createManyAndReturn
   */
  export type TagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to create many Tags.
     */
    data: TagCreateManyInput | TagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tag update
   */
  export type TagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The data needed to update a Tag.
     */
    data: XOR<TagUpdateInput, TagUncheckedUpdateInput>
    /**
     * Choose, which Tag to update.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag updateMany
   */
  export type TagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag updateManyAndReturn
   */
  export type TagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * The data used to update Tags.
     */
    data: XOR<TagUpdateManyMutationInput, TagUncheckedUpdateManyInput>
    /**
     * Filter which Tags to update
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to update.
     */
    limit?: number
  }

  /**
   * Tag upsert
   */
  export type TagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * The filter to search for the Tag to update in case it exists.
     */
    where: TagWhereUniqueInput
    /**
     * In case the Tag found by the `where` argument doesn't exist, create a new Tag with this data.
     */
    create: XOR<TagCreateInput, TagUncheckedCreateInput>
    /**
     * In case the Tag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TagUpdateInput, TagUncheckedUpdateInput>
  }

  /**
   * Tag delete
   */
  export type TagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
    /**
     * Filter which Tag to delete.
     */
    where: TagWhereUniqueInput
  }

  /**
   * Tag deleteMany
   */
  export type TagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tags to delete
     */
    where?: TagWhereInput
    /**
     * Limit how many Tags to delete.
     */
    limit?: number
  }

  /**
   * Tag.deckTags
   */
  export type Tag$deckTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagInclude<ExtArgs> | null
    where?: DeckTagWhereInput
    orderBy?: DeckTagOrderByWithRelationInput | DeckTagOrderByWithRelationInput[]
    cursor?: DeckTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeckTagScalarFieldEnum | DeckTagScalarFieldEnum[]
  }

  /**
   * Tag without action
   */
  export type TagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tag
     */
    select?: TagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tag
     */
    omit?: TagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TagInclude<ExtArgs> | null
  }


  /**
   * Model FlashcardDeck
   */

  export type AggregateFlashcardDeck = {
    _count: FlashcardDeckCountAggregateOutputType | null
    _min: FlashcardDeckMinAggregateOutputType | null
    _max: FlashcardDeckMaxAggregateOutputType | null
  }

  export type FlashcardDeckMinAggregateOutputType = {
    id: string | null
    title: string | null
    createdAt: Date | null
    description: string | null
    isPublic: boolean | null
    userId: string | null
  }

  export type FlashcardDeckMaxAggregateOutputType = {
    id: string | null
    title: string | null
    createdAt: Date | null
    description: string | null
    isPublic: boolean | null
    userId: string | null
  }

  export type FlashcardDeckCountAggregateOutputType = {
    id: number
    title: number
    createdAt: number
    description: number
    isPublic: number
    userId: number
    _all: number
  }


  export type FlashcardDeckMinAggregateInputType = {
    id?: true
    title?: true
    createdAt?: true
    description?: true
    isPublic?: true
    userId?: true
  }

  export type FlashcardDeckMaxAggregateInputType = {
    id?: true
    title?: true
    createdAt?: true
    description?: true
    isPublic?: true
    userId?: true
  }

  export type FlashcardDeckCountAggregateInputType = {
    id?: true
    title?: true
    createdAt?: true
    description?: true
    isPublic?: true
    userId?: true
    _all?: true
  }

  export type FlashcardDeckAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FlashcardDeck to aggregate.
     */
    where?: FlashcardDeckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlashcardDecks to fetch.
     */
    orderBy?: FlashcardDeckOrderByWithRelationInput | FlashcardDeckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FlashcardDeckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlashcardDecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlashcardDecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FlashcardDecks
    **/
    _count?: true | FlashcardDeckCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FlashcardDeckMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FlashcardDeckMaxAggregateInputType
  }

  export type GetFlashcardDeckAggregateType<T extends FlashcardDeckAggregateArgs> = {
        [P in keyof T & keyof AggregateFlashcardDeck]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFlashcardDeck[P]>
      : GetScalarType<T[P], AggregateFlashcardDeck[P]>
  }




  export type FlashcardDeckGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardDeckWhereInput
    orderBy?: FlashcardDeckOrderByWithAggregationInput | FlashcardDeckOrderByWithAggregationInput[]
    by: FlashcardDeckScalarFieldEnum[] | FlashcardDeckScalarFieldEnum
    having?: FlashcardDeckScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FlashcardDeckCountAggregateInputType | true
    _min?: FlashcardDeckMinAggregateInputType
    _max?: FlashcardDeckMaxAggregateInputType
  }

  export type FlashcardDeckGroupByOutputType = {
    id: string
    title: string
    createdAt: Date
    description: string | null
    isPublic: boolean
    userId: string
    _count: FlashcardDeckCountAggregateOutputType | null
    _min: FlashcardDeckMinAggregateOutputType | null
    _max: FlashcardDeckMaxAggregateOutputType | null
  }

  type GetFlashcardDeckGroupByPayload<T extends FlashcardDeckGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FlashcardDeckGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FlashcardDeckGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FlashcardDeckGroupByOutputType[P]>
            : GetScalarType<T[P], FlashcardDeckGroupByOutputType[P]>
        }
      >
    >


  export type FlashcardDeckSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    createdAt?: boolean
    description?: boolean
    isPublic?: boolean
    userId?: boolean
    deckTags?: boolean | FlashcardDeck$deckTagsArgs<ExtArgs>
    flashcards?: boolean | FlashcardDeck$flashcardsArgs<ExtArgs>
    _count?: boolean | FlashcardDeckCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcardDeck"]>

  export type FlashcardDeckSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    createdAt?: boolean
    description?: boolean
    isPublic?: boolean
    userId?: boolean
  }, ExtArgs["result"]["flashcardDeck"]>

  export type FlashcardDeckSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    createdAt?: boolean
    description?: boolean
    isPublic?: boolean
    userId?: boolean
  }, ExtArgs["result"]["flashcardDeck"]>

  export type FlashcardDeckSelectScalar = {
    id?: boolean
    title?: boolean
    createdAt?: boolean
    description?: boolean
    isPublic?: boolean
    userId?: boolean
  }

  export type FlashcardDeckOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "createdAt" | "description" | "isPublic" | "userId", ExtArgs["result"]["flashcardDeck"]>
  export type FlashcardDeckInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deckTags?: boolean | FlashcardDeck$deckTagsArgs<ExtArgs>
    flashcards?: boolean | FlashcardDeck$flashcardsArgs<ExtArgs>
    _count?: boolean | FlashcardDeckCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FlashcardDeckIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type FlashcardDeckIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $FlashcardDeckPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FlashcardDeck"
    objects: {
      deckTags: Prisma.$DeckTagPayload<ExtArgs>[]
      flashcards: Prisma.$FlashcardPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      createdAt: Date
      description: string | null
      isPublic: boolean
      userId: string
    }, ExtArgs["result"]["flashcardDeck"]>
    composites: {}
  }

  type FlashcardDeckGetPayload<S extends boolean | null | undefined | FlashcardDeckDefaultArgs> = $Result.GetResult<Prisma.$FlashcardDeckPayload, S>

  type FlashcardDeckCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FlashcardDeckFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FlashcardDeckCountAggregateInputType | true
    }

  export interface FlashcardDeckDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FlashcardDeck'], meta: { name: 'FlashcardDeck' } }
    /**
     * Find zero or one FlashcardDeck that matches the filter.
     * @param {FlashcardDeckFindUniqueArgs} args - Arguments to find a FlashcardDeck
     * @example
     * // Get one FlashcardDeck
     * const flashcardDeck = await prisma.flashcardDeck.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FlashcardDeckFindUniqueArgs>(args: SelectSubset<T, FlashcardDeckFindUniqueArgs<ExtArgs>>): Prisma__FlashcardDeckClient<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FlashcardDeck that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FlashcardDeckFindUniqueOrThrowArgs} args - Arguments to find a FlashcardDeck
     * @example
     * // Get one FlashcardDeck
     * const flashcardDeck = await prisma.flashcardDeck.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FlashcardDeckFindUniqueOrThrowArgs>(args: SelectSubset<T, FlashcardDeckFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FlashcardDeckClient<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FlashcardDeck that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardDeckFindFirstArgs} args - Arguments to find a FlashcardDeck
     * @example
     * // Get one FlashcardDeck
     * const flashcardDeck = await prisma.flashcardDeck.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FlashcardDeckFindFirstArgs>(args?: SelectSubset<T, FlashcardDeckFindFirstArgs<ExtArgs>>): Prisma__FlashcardDeckClient<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FlashcardDeck that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardDeckFindFirstOrThrowArgs} args - Arguments to find a FlashcardDeck
     * @example
     * // Get one FlashcardDeck
     * const flashcardDeck = await prisma.flashcardDeck.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FlashcardDeckFindFirstOrThrowArgs>(args?: SelectSubset<T, FlashcardDeckFindFirstOrThrowArgs<ExtArgs>>): Prisma__FlashcardDeckClient<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FlashcardDecks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardDeckFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FlashcardDecks
     * const flashcardDecks = await prisma.flashcardDeck.findMany()
     * 
     * // Get first 10 FlashcardDecks
     * const flashcardDecks = await prisma.flashcardDeck.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const flashcardDeckWithIdOnly = await prisma.flashcardDeck.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FlashcardDeckFindManyArgs>(args?: SelectSubset<T, FlashcardDeckFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FlashcardDeck.
     * @param {FlashcardDeckCreateArgs} args - Arguments to create a FlashcardDeck.
     * @example
     * // Create one FlashcardDeck
     * const FlashcardDeck = await prisma.flashcardDeck.create({
     *   data: {
     *     // ... data to create a FlashcardDeck
     *   }
     * })
     * 
     */
    create<T extends FlashcardDeckCreateArgs>(args: SelectSubset<T, FlashcardDeckCreateArgs<ExtArgs>>): Prisma__FlashcardDeckClient<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FlashcardDecks.
     * @param {FlashcardDeckCreateManyArgs} args - Arguments to create many FlashcardDecks.
     * @example
     * // Create many FlashcardDecks
     * const flashcardDeck = await prisma.flashcardDeck.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FlashcardDeckCreateManyArgs>(args?: SelectSubset<T, FlashcardDeckCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FlashcardDecks and returns the data saved in the database.
     * @param {FlashcardDeckCreateManyAndReturnArgs} args - Arguments to create many FlashcardDecks.
     * @example
     * // Create many FlashcardDecks
     * const flashcardDeck = await prisma.flashcardDeck.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FlashcardDecks and only return the `id`
     * const flashcardDeckWithIdOnly = await prisma.flashcardDeck.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FlashcardDeckCreateManyAndReturnArgs>(args?: SelectSubset<T, FlashcardDeckCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FlashcardDeck.
     * @param {FlashcardDeckDeleteArgs} args - Arguments to delete one FlashcardDeck.
     * @example
     * // Delete one FlashcardDeck
     * const FlashcardDeck = await prisma.flashcardDeck.delete({
     *   where: {
     *     // ... filter to delete one FlashcardDeck
     *   }
     * })
     * 
     */
    delete<T extends FlashcardDeckDeleteArgs>(args: SelectSubset<T, FlashcardDeckDeleteArgs<ExtArgs>>): Prisma__FlashcardDeckClient<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FlashcardDeck.
     * @param {FlashcardDeckUpdateArgs} args - Arguments to update one FlashcardDeck.
     * @example
     * // Update one FlashcardDeck
     * const flashcardDeck = await prisma.flashcardDeck.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FlashcardDeckUpdateArgs>(args: SelectSubset<T, FlashcardDeckUpdateArgs<ExtArgs>>): Prisma__FlashcardDeckClient<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FlashcardDecks.
     * @param {FlashcardDeckDeleteManyArgs} args - Arguments to filter FlashcardDecks to delete.
     * @example
     * // Delete a few FlashcardDecks
     * const { count } = await prisma.flashcardDeck.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FlashcardDeckDeleteManyArgs>(args?: SelectSubset<T, FlashcardDeckDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FlashcardDecks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardDeckUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FlashcardDecks
     * const flashcardDeck = await prisma.flashcardDeck.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FlashcardDeckUpdateManyArgs>(args: SelectSubset<T, FlashcardDeckUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FlashcardDecks and returns the data updated in the database.
     * @param {FlashcardDeckUpdateManyAndReturnArgs} args - Arguments to update many FlashcardDecks.
     * @example
     * // Update many FlashcardDecks
     * const flashcardDeck = await prisma.flashcardDeck.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FlashcardDecks and only return the `id`
     * const flashcardDeckWithIdOnly = await prisma.flashcardDeck.updateManyAndReturn({
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
    updateManyAndReturn<T extends FlashcardDeckUpdateManyAndReturnArgs>(args: SelectSubset<T, FlashcardDeckUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FlashcardDeck.
     * @param {FlashcardDeckUpsertArgs} args - Arguments to update or create a FlashcardDeck.
     * @example
     * // Update or create a FlashcardDeck
     * const flashcardDeck = await prisma.flashcardDeck.upsert({
     *   create: {
     *     // ... data to create a FlashcardDeck
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FlashcardDeck we want to update
     *   }
     * })
     */
    upsert<T extends FlashcardDeckUpsertArgs>(args: SelectSubset<T, FlashcardDeckUpsertArgs<ExtArgs>>): Prisma__FlashcardDeckClient<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FlashcardDecks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardDeckCountArgs} args - Arguments to filter FlashcardDecks to count.
     * @example
     * // Count the number of FlashcardDecks
     * const count = await prisma.flashcardDeck.count({
     *   where: {
     *     // ... the filter for the FlashcardDecks we want to count
     *   }
     * })
    **/
    count<T extends FlashcardDeckCountArgs>(
      args?: Subset<T, FlashcardDeckCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FlashcardDeckCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FlashcardDeck.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardDeckAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FlashcardDeckAggregateArgs>(args: Subset<T, FlashcardDeckAggregateArgs>): Prisma.PrismaPromise<GetFlashcardDeckAggregateType<T>>

    /**
     * Group by FlashcardDeck.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardDeckGroupByArgs} args - Group by arguments.
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
      T extends FlashcardDeckGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FlashcardDeckGroupByArgs['orderBy'] }
        : { orderBy?: FlashcardDeckGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FlashcardDeckGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlashcardDeckGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FlashcardDeck model
   */
  readonly fields: FlashcardDeckFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FlashcardDeck.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FlashcardDeckClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    deckTags<T extends FlashcardDeck$deckTagsArgs<ExtArgs> = {}>(args?: Subset<T, FlashcardDeck$deckTagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    flashcards<T extends FlashcardDeck$flashcardsArgs<ExtArgs> = {}>(args?: Subset<T, FlashcardDeck$flashcardsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the FlashcardDeck model
   */
  interface FlashcardDeckFieldRefs {
    readonly id: FieldRef<"FlashcardDeck", 'String'>
    readonly title: FieldRef<"FlashcardDeck", 'String'>
    readonly createdAt: FieldRef<"FlashcardDeck", 'DateTime'>
    readonly description: FieldRef<"FlashcardDeck", 'String'>
    readonly isPublic: FieldRef<"FlashcardDeck", 'Boolean'>
    readonly userId: FieldRef<"FlashcardDeck", 'String'>
  }
    

  // Custom InputTypes
  /**
   * FlashcardDeck findUnique
   */
  export type FlashcardDeckFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeck
     */
    select?: FlashcardDeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardDeck
     */
    omit?: FlashcardDeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardDeckInclude<ExtArgs> | null
    /**
     * Filter, which FlashcardDeck to fetch.
     */
    where: FlashcardDeckWhereUniqueInput
  }

  /**
   * FlashcardDeck findUniqueOrThrow
   */
  export type FlashcardDeckFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeck
     */
    select?: FlashcardDeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardDeck
     */
    omit?: FlashcardDeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardDeckInclude<ExtArgs> | null
    /**
     * Filter, which FlashcardDeck to fetch.
     */
    where: FlashcardDeckWhereUniqueInput
  }

  /**
   * FlashcardDeck findFirst
   */
  export type FlashcardDeckFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeck
     */
    select?: FlashcardDeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardDeck
     */
    omit?: FlashcardDeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardDeckInclude<ExtArgs> | null
    /**
     * Filter, which FlashcardDeck to fetch.
     */
    where?: FlashcardDeckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlashcardDecks to fetch.
     */
    orderBy?: FlashcardDeckOrderByWithRelationInput | FlashcardDeckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FlashcardDecks.
     */
    cursor?: FlashcardDeckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlashcardDecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlashcardDecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlashcardDecks.
     */
    distinct?: FlashcardDeckScalarFieldEnum | FlashcardDeckScalarFieldEnum[]
  }

  /**
   * FlashcardDeck findFirstOrThrow
   */
  export type FlashcardDeckFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeck
     */
    select?: FlashcardDeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardDeck
     */
    omit?: FlashcardDeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardDeckInclude<ExtArgs> | null
    /**
     * Filter, which FlashcardDeck to fetch.
     */
    where?: FlashcardDeckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlashcardDecks to fetch.
     */
    orderBy?: FlashcardDeckOrderByWithRelationInput | FlashcardDeckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FlashcardDecks.
     */
    cursor?: FlashcardDeckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlashcardDecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlashcardDecks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FlashcardDecks.
     */
    distinct?: FlashcardDeckScalarFieldEnum | FlashcardDeckScalarFieldEnum[]
  }

  /**
   * FlashcardDeck findMany
   */
  export type FlashcardDeckFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeck
     */
    select?: FlashcardDeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardDeck
     */
    omit?: FlashcardDeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardDeckInclude<ExtArgs> | null
    /**
     * Filter, which FlashcardDecks to fetch.
     */
    where?: FlashcardDeckWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FlashcardDecks to fetch.
     */
    orderBy?: FlashcardDeckOrderByWithRelationInput | FlashcardDeckOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FlashcardDecks.
     */
    cursor?: FlashcardDeckWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FlashcardDecks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FlashcardDecks.
     */
    skip?: number
    distinct?: FlashcardDeckScalarFieldEnum | FlashcardDeckScalarFieldEnum[]
  }

  /**
   * FlashcardDeck create
   */
  export type FlashcardDeckCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeck
     */
    select?: FlashcardDeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardDeck
     */
    omit?: FlashcardDeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardDeckInclude<ExtArgs> | null
    /**
     * The data needed to create a FlashcardDeck.
     */
    data: XOR<FlashcardDeckCreateInput, FlashcardDeckUncheckedCreateInput>
  }

  /**
   * FlashcardDeck createMany
   */
  export type FlashcardDeckCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FlashcardDecks.
     */
    data: FlashcardDeckCreateManyInput | FlashcardDeckCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FlashcardDeck createManyAndReturn
   */
  export type FlashcardDeckCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeck
     */
    select?: FlashcardDeckSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardDeck
     */
    omit?: FlashcardDeckOmit<ExtArgs> | null
    /**
     * The data used to create many FlashcardDecks.
     */
    data: FlashcardDeckCreateManyInput | FlashcardDeckCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FlashcardDeck update
   */
  export type FlashcardDeckUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeck
     */
    select?: FlashcardDeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardDeck
     */
    omit?: FlashcardDeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardDeckInclude<ExtArgs> | null
    /**
     * The data needed to update a FlashcardDeck.
     */
    data: XOR<FlashcardDeckUpdateInput, FlashcardDeckUncheckedUpdateInput>
    /**
     * Choose, which FlashcardDeck to update.
     */
    where: FlashcardDeckWhereUniqueInput
  }

  /**
   * FlashcardDeck updateMany
   */
  export type FlashcardDeckUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FlashcardDecks.
     */
    data: XOR<FlashcardDeckUpdateManyMutationInput, FlashcardDeckUncheckedUpdateManyInput>
    /**
     * Filter which FlashcardDecks to update
     */
    where?: FlashcardDeckWhereInput
    /**
     * Limit how many FlashcardDecks to update.
     */
    limit?: number
  }

  /**
   * FlashcardDeck updateManyAndReturn
   */
  export type FlashcardDeckUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeck
     */
    select?: FlashcardDeckSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardDeck
     */
    omit?: FlashcardDeckOmit<ExtArgs> | null
    /**
     * The data used to update FlashcardDecks.
     */
    data: XOR<FlashcardDeckUpdateManyMutationInput, FlashcardDeckUncheckedUpdateManyInput>
    /**
     * Filter which FlashcardDecks to update
     */
    where?: FlashcardDeckWhereInput
    /**
     * Limit how many FlashcardDecks to update.
     */
    limit?: number
  }

  /**
   * FlashcardDeck upsert
   */
  export type FlashcardDeckUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeck
     */
    select?: FlashcardDeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardDeck
     */
    omit?: FlashcardDeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardDeckInclude<ExtArgs> | null
    /**
     * The filter to search for the FlashcardDeck to update in case it exists.
     */
    where: FlashcardDeckWhereUniqueInput
    /**
     * In case the FlashcardDeck found by the `where` argument doesn't exist, create a new FlashcardDeck with this data.
     */
    create: XOR<FlashcardDeckCreateInput, FlashcardDeckUncheckedCreateInput>
    /**
     * In case the FlashcardDeck was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FlashcardDeckUpdateInput, FlashcardDeckUncheckedUpdateInput>
  }

  /**
   * FlashcardDeck delete
   */
  export type FlashcardDeckDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeck
     */
    select?: FlashcardDeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardDeck
     */
    omit?: FlashcardDeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardDeckInclude<ExtArgs> | null
    /**
     * Filter which FlashcardDeck to delete.
     */
    where: FlashcardDeckWhereUniqueInput
  }

  /**
   * FlashcardDeck deleteMany
   */
  export type FlashcardDeckDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FlashcardDecks to delete
     */
    where?: FlashcardDeckWhereInput
    /**
     * Limit how many FlashcardDecks to delete.
     */
    limit?: number
  }

  /**
   * FlashcardDeck.deckTags
   */
  export type FlashcardDeck$deckTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagInclude<ExtArgs> | null
    where?: DeckTagWhereInput
    orderBy?: DeckTagOrderByWithRelationInput | DeckTagOrderByWithRelationInput[]
    cursor?: DeckTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeckTagScalarFieldEnum | DeckTagScalarFieldEnum[]
  }

  /**
   * FlashcardDeck.flashcards
   */
  export type FlashcardDeck$flashcardsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    where?: FlashcardWhereInput
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    cursor?: FlashcardWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * FlashcardDeck without action
   */
  export type FlashcardDeckDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FlashcardDeck
     */
    select?: FlashcardDeckSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FlashcardDeck
     */
    omit?: FlashcardDeckOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardDeckInclude<ExtArgs> | null
  }


  /**
   * Model Flashcard
   */

  export type AggregateFlashcard = {
    _count: FlashcardCountAggregateOutputType | null
    _min: FlashcardMinAggregateOutputType | null
    _max: FlashcardMaxAggregateOutputType | null
  }

  export type FlashcardMinAggregateOutputType = {
    id: string | null
    frontContent: string | null
    backContent: string | null
    exampleSentence: string | null
    audioUrl: string | null
    deckId: string | null
  }

  export type FlashcardMaxAggregateOutputType = {
    id: string | null
    frontContent: string | null
    backContent: string | null
    exampleSentence: string | null
    audioUrl: string | null
    deckId: string | null
  }

  export type FlashcardCountAggregateOutputType = {
    id: number
    frontContent: number
    backContent: number
    exampleSentence: number
    audioUrl: number
    deckId: number
    _all: number
  }


  export type FlashcardMinAggregateInputType = {
    id?: true
    frontContent?: true
    backContent?: true
    exampleSentence?: true
    audioUrl?: true
    deckId?: true
  }

  export type FlashcardMaxAggregateInputType = {
    id?: true
    frontContent?: true
    backContent?: true
    exampleSentence?: true
    audioUrl?: true
    deckId?: true
  }

  export type FlashcardCountAggregateInputType = {
    id?: true
    frontContent?: true
    backContent?: true
    exampleSentence?: true
    audioUrl?: true
    deckId?: true
    _all?: true
  }

  export type FlashcardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Flashcard to aggregate.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Flashcards
    **/
    _count?: true | FlashcardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FlashcardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FlashcardMaxAggregateInputType
  }

  export type GetFlashcardAggregateType<T extends FlashcardAggregateArgs> = {
        [P in keyof T & keyof AggregateFlashcard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFlashcard[P]>
      : GetScalarType<T[P], AggregateFlashcard[P]>
  }




  export type FlashcardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FlashcardWhereInput
    orderBy?: FlashcardOrderByWithAggregationInput | FlashcardOrderByWithAggregationInput[]
    by: FlashcardScalarFieldEnum[] | FlashcardScalarFieldEnum
    having?: FlashcardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FlashcardCountAggregateInputType | true
    _min?: FlashcardMinAggregateInputType
    _max?: FlashcardMaxAggregateInputType
  }

  export type FlashcardGroupByOutputType = {
    id: string
    frontContent: string
    backContent: string
    exampleSentence: string | null
    audioUrl: string | null
    deckId: string
    _count: FlashcardCountAggregateOutputType | null
    _min: FlashcardMinAggregateOutputType | null
    _max: FlashcardMaxAggregateOutputType | null
  }

  type GetFlashcardGroupByPayload<T extends FlashcardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FlashcardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FlashcardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FlashcardGroupByOutputType[P]>
            : GetScalarType<T[P], FlashcardGroupByOutputType[P]>
        }
      >
    >


  export type FlashcardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    frontContent?: boolean
    backContent?: boolean
    exampleSentence?: boolean
    audioUrl?: boolean
    deckId?: boolean
    deck?: boolean | FlashcardDeckDefaultArgs<ExtArgs>
    userProgress?: boolean | Flashcard$userProgressArgs<ExtArgs>
    _count?: boolean | FlashcardCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcard"]>

  export type FlashcardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    frontContent?: boolean
    backContent?: boolean
    exampleSentence?: boolean
    audioUrl?: boolean
    deckId?: boolean
    deck?: boolean | FlashcardDeckDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcard"]>

  export type FlashcardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    frontContent?: boolean
    backContent?: boolean
    exampleSentence?: boolean
    audioUrl?: boolean
    deckId?: boolean
    deck?: boolean | FlashcardDeckDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["flashcard"]>

  export type FlashcardSelectScalar = {
    id?: boolean
    frontContent?: boolean
    backContent?: boolean
    exampleSentence?: boolean
    audioUrl?: boolean
    deckId?: boolean
  }

  export type FlashcardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "frontContent" | "backContent" | "exampleSentence" | "audioUrl" | "deckId", ExtArgs["result"]["flashcard"]>
  export type FlashcardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deck?: boolean | FlashcardDeckDefaultArgs<ExtArgs>
    userProgress?: boolean | Flashcard$userProgressArgs<ExtArgs>
    _count?: boolean | FlashcardCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type FlashcardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deck?: boolean | FlashcardDeckDefaultArgs<ExtArgs>
  }
  export type FlashcardIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deck?: boolean | FlashcardDeckDefaultArgs<ExtArgs>
  }

  export type $FlashcardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Flashcard"
    objects: {
      deck: Prisma.$FlashcardDeckPayload<ExtArgs>
      userProgress: Prisma.$UserFlashcardProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      frontContent: string
      backContent: string
      exampleSentence: string | null
      audioUrl: string | null
      deckId: string
    }, ExtArgs["result"]["flashcard"]>
    composites: {}
  }

  type FlashcardGetPayload<S extends boolean | null | undefined | FlashcardDefaultArgs> = $Result.GetResult<Prisma.$FlashcardPayload, S>

  type FlashcardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FlashcardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FlashcardCountAggregateInputType | true
    }

  export interface FlashcardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Flashcard'], meta: { name: 'Flashcard' } }
    /**
     * Find zero or one Flashcard that matches the filter.
     * @param {FlashcardFindUniqueArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FlashcardFindUniqueArgs>(args: SelectSubset<T, FlashcardFindUniqueArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Flashcard that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FlashcardFindUniqueOrThrowArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FlashcardFindUniqueOrThrowArgs>(args: SelectSubset<T, FlashcardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Flashcard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardFindFirstArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FlashcardFindFirstArgs>(args?: SelectSubset<T, FlashcardFindFirstArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Flashcard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardFindFirstOrThrowArgs} args - Arguments to find a Flashcard
     * @example
     * // Get one Flashcard
     * const flashcard = await prisma.flashcard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FlashcardFindFirstOrThrowArgs>(args?: SelectSubset<T, FlashcardFindFirstOrThrowArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Flashcards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Flashcards
     * const flashcards = await prisma.flashcard.findMany()
     * 
     * // Get first 10 Flashcards
     * const flashcards = await prisma.flashcard.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const flashcardWithIdOnly = await prisma.flashcard.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FlashcardFindManyArgs>(args?: SelectSubset<T, FlashcardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Flashcard.
     * @param {FlashcardCreateArgs} args - Arguments to create a Flashcard.
     * @example
     * // Create one Flashcard
     * const Flashcard = await prisma.flashcard.create({
     *   data: {
     *     // ... data to create a Flashcard
     *   }
     * })
     * 
     */
    create<T extends FlashcardCreateArgs>(args: SelectSubset<T, FlashcardCreateArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Flashcards.
     * @param {FlashcardCreateManyArgs} args - Arguments to create many Flashcards.
     * @example
     * // Create many Flashcards
     * const flashcard = await prisma.flashcard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FlashcardCreateManyArgs>(args?: SelectSubset<T, FlashcardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Flashcards and returns the data saved in the database.
     * @param {FlashcardCreateManyAndReturnArgs} args - Arguments to create many Flashcards.
     * @example
     * // Create many Flashcards
     * const flashcard = await prisma.flashcard.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Flashcards and only return the `id`
     * const flashcardWithIdOnly = await prisma.flashcard.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FlashcardCreateManyAndReturnArgs>(args?: SelectSubset<T, FlashcardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Flashcard.
     * @param {FlashcardDeleteArgs} args - Arguments to delete one Flashcard.
     * @example
     * // Delete one Flashcard
     * const Flashcard = await prisma.flashcard.delete({
     *   where: {
     *     // ... filter to delete one Flashcard
     *   }
     * })
     * 
     */
    delete<T extends FlashcardDeleteArgs>(args: SelectSubset<T, FlashcardDeleteArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Flashcard.
     * @param {FlashcardUpdateArgs} args - Arguments to update one Flashcard.
     * @example
     * // Update one Flashcard
     * const flashcard = await prisma.flashcard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FlashcardUpdateArgs>(args: SelectSubset<T, FlashcardUpdateArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Flashcards.
     * @param {FlashcardDeleteManyArgs} args - Arguments to filter Flashcards to delete.
     * @example
     * // Delete a few Flashcards
     * const { count } = await prisma.flashcard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FlashcardDeleteManyArgs>(args?: SelectSubset<T, FlashcardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Flashcards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Flashcards
     * const flashcard = await prisma.flashcard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FlashcardUpdateManyArgs>(args: SelectSubset<T, FlashcardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Flashcards and returns the data updated in the database.
     * @param {FlashcardUpdateManyAndReturnArgs} args - Arguments to update many Flashcards.
     * @example
     * // Update many Flashcards
     * const flashcard = await prisma.flashcard.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Flashcards and only return the `id`
     * const flashcardWithIdOnly = await prisma.flashcard.updateManyAndReturn({
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
    updateManyAndReturn<T extends FlashcardUpdateManyAndReturnArgs>(args: SelectSubset<T, FlashcardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Flashcard.
     * @param {FlashcardUpsertArgs} args - Arguments to update or create a Flashcard.
     * @example
     * // Update or create a Flashcard
     * const flashcard = await prisma.flashcard.upsert({
     *   create: {
     *     // ... data to create a Flashcard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Flashcard we want to update
     *   }
     * })
     */
    upsert<T extends FlashcardUpsertArgs>(args: SelectSubset<T, FlashcardUpsertArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Flashcards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardCountArgs} args - Arguments to filter Flashcards to count.
     * @example
     * // Count the number of Flashcards
     * const count = await prisma.flashcard.count({
     *   where: {
     *     // ... the filter for the Flashcards we want to count
     *   }
     * })
    **/
    count<T extends FlashcardCountArgs>(
      args?: Subset<T, FlashcardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FlashcardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Flashcard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends FlashcardAggregateArgs>(args: Subset<T, FlashcardAggregateArgs>): Prisma.PrismaPromise<GetFlashcardAggregateType<T>>

    /**
     * Group by Flashcard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FlashcardGroupByArgs} args - Group by arguments.
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
      T extends FlashcardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FlashcardGroupByArgs['orderBy'] }
        : { orderBy?: FlashcardGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, FlashcardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFlashcardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Flashcard model
   */
  readonly fields: FlashcardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Flashcard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FlashcardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    deck<T extends FlashcardDeckDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FlashcardDeckDefaultArgs<ExtArgs>>): Prisma__FlashcardDeckClient<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    userProgress<T extends Flashcard$userProgressArgs<ExtArgs> = {}>(args?: Subset<T, Flashcard$userProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserFlashcardProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Flashcard model
   */
  interface FlashcardFieldRefs {
    readonly id: FieldRef<"Flashcard", 'String'>
    readonly frontContent: FieldRef<"Flashcard", 'String'>
    readonly backContent: FieldRef<"Flashcard", 'String'>
    readonly exampleSentence: FieldRef<"Flashcard", 'String'>
    readonly audioUrl: FieldRef<"Flashcard", 'String'>
    readonly deckId: FieldRef<"Flashcard", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Flashcard findUnique
   */
  export type FlashcardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard findUniqueOrThrow
   */
  export type FlashcardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard findFirst
   */
  export type FlashcardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Flashcards.
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flashcards.
     */
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard findFirstOrThrow
   */
  export type FlashcardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcard to fetch.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Flashcards.
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Flashcards.
     */
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard findMany
   */
  export type FlashcardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter, which Flashcards to fetch.
     */
    where?: FlashcardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Flashcards to fetch.
     */
    orderBy?: FlashcardOrderByWithRelationInput | FlashcardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Flashcards.
     */
    cursor?: FlashcardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Flashcards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Flashcards.
     */
    skip?: number
    distinct?: FlashcardScalarFieldEnum | FlashcardScalarFieldEnum[]
  }

  /**
   * Flashcard create
   */
  export type FlashcardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * The data needed to create a Flashcard.
     */
    data: XOR<FlashcardCreateInput, FlashcardUncheckedCreateInput>
  }

  /**
   * Flashcard createMany
   */
  export type FlashcardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Flashcards.
     */
    data: FlashcardCreateManyInput | FlashcardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Flashcard createManyAndReturn
   */
  export type FlashcardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * The data used to create many Flashcards.
     */
    data: FlashcardCreateManyInput | FlashcardCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Flashcard update
   */
  export type FlashcardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * The data needed to update a Flashcard.
     */
    data: XOR<FlashcardUpdateInput, FlashcardUncheckedUpdateInput>
    /**
     * Choose, which Flashcard to update.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard updateMany
   */
  export type FlashcardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Flashcards.
     */
    data: XOR<FlashcardUpdateManyMutationInput, FlashcardUncheckedUpdateManyInput>
    /**
     * Filter which Flashcards to update
     */
    where?: FlashcardWhereInput
    /**
     * Limit how many Flashcards to update.
     */
    limit?: number
  }

  /**
   * Flashcard updateManyAndReturn
   */
  export type FlashcardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * The data used to update Flashcards.
     */
    data: XOR<FlashcardUpdateManyMutationInput, FlashcardUncheckedUpdateManyInput>
    /**
     * Filter which Flashcards to update
     */
    where?: FlashcardWhereInput
    /**
     * Limit how many Flashcards to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Flashcard upsert
   */
  export type FlashcardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * The filter to search for the Flashcard to update in case it exists.
     */
    where: FlashcardWhereUniqueInput
    /**
     * In case the Flashcard found by the `where` argument doesn't exist, create a new Flashcard with this data.
     */
    create: XOR<FlashcardCreateInput, FlashcardUncheckedCreateInput>
    /**
     * In case the Flashcard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FlashcardUpdateInput, FlashcardUncheckedUpdateInput>
  }

  /**
   * Flashcard delete
   */
  export type FlashcardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
    /**
     * Filter which Flashcard to delete.
     */
    where: FlashcardWhereUniqueInput
  }

  /**
   * Flashcard deleteMany
   */
  export type FlashcardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Flashcards to delete
     */
    where?: FlashcardWhereInput
    /**
     * Limit how many Flashcards to delete.
     */
    limit?: number
  }

  /**
   * Flashcard.userProgress
   */
  export type Flashcard$userProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressInclude<ExtArgs> | null
    where?: UserFlashcardProgressWhereInput
    orderBy?: UserFlashcardProgressOrderByWithRelationInput | UserFlashcardProgressOrderByWithRelationInput[]
    cursor?: UserFlashcardProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserFlashcardProgressScalarFieldEnum | UserFlashcardProgressScalarFieldEnum[]
  }

  /**
   * Flashcard without action
   */
  export type FlashcardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Flashcard
     */
    select?: FlashcardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Flashcard
     */
    omit?: FlashcardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FlashcardInclude<ExtArgs> | null
  }


  /**
   * Model DeckTag
   */

  export type AggregateDeckTag = {
    _count: DeckTagCountAggregateOutputType | null
    _min: DeckTagMinAggregateOutputType | null
    _max: DeckTagMaxAggregateOutputType | null
  }

  export type DeckTagMinAggregateOutputType = {
    tagId: string | null
    deckId: string | null
  }

  export type DeckTagMaxAggregateOutputType = {
    tagId: string | null
    deckId: string | null
  }

  export type DeckTagCountAggregateOutputType = {
    tagId: number
    deckId: number
    _all: number
  }


  export type DeckTagMinAggregateInputType = {
    tagId?: true
    deckId?: true
  }

  export type DeckTagMaxAggregateInputType = {
    tagId?: true
    deckId?: true
  }

  export type DeckTagCountAggregateInputType = {
    tagId?: true
    deckId?: true
    _all?: true
  }

  export type DeckTagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeckTag to aggregate.
     */
    where?: DeckTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeckTags to fetch.
     */
    orderBy?: DeckTagOrderByWithRelationInput | DeckTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeckTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeckTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeckTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DeckTags
    **/
    _count?: true | DeckTagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeckTagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeckTagMaxAggregateInputType
  }

  export type GetDeckTagAggregateType<T extends DeckTagAggregateArgs> = {
        [P in keyof T & keyof AggregateDeckTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeckTag[P]>
      : GetScalarType<T[P], AggregateDeckTag[P]>
  }




  export type DeckTagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeckTagWhereInput
    orderBy?: DeckTagOrderByWithAggregationInput | DeckTagOrderByWithAggregationInput[]
    by: DeckTagScalarFieldEnum[] | DeckTagScalarFieldEnum
    having?: DeckTagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeckTagCountAggregateInputType | true
    _min?: DeckTagMinAggregateInputType
    _max?: DeckTagMaxAggregateInputType
  }

  export type DeckTagGroupByOutputType = {
    tagId: string
    deckId: string
    _count: DeckTagCountAggregateOutputType | null
    _min: DeckTagMinAggregateOutputType | null
    _max: DeckTagMaxAggregateOutputType | null
  }

  type GetDeckTagGroupByPayload<T extends DeckTagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeckTagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeckTagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeckTagGroupByOutputType[P]>
            : GetScalarType<T[P], DeckTagGroupByOutputType[P]>
        }
      >
    >


  export type DeckTagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    tagId?: boolean
    deckId?: boolean
    deck?: boolean | FlashcardDeckDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deckTag"]>

  export type DeckTagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    tagId?: boolean
    deckId?: boolean
    deck?: boolean | FlashcardDeckDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deckTag"]>

  export type DeckTagSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    tagId?: boolean
    deckId?: boolean
    deck?: boolean | FlashcardDeckDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deckTag"]>

  export type DeckTagSelectScalar = {
    tagId?: boolean
    deckId?: boolean
  }

  export type DeckTagOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"tagId" | "deckId", ExtArgs["result"]["deckTag"]>
  export type DeckTagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deck?: boolean | FlashcardDeckDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }
  export type DeckTagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deck?: boolean | FlashcardDeckDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }
  export type DeckTagIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deck?: boolean | FlashcardDeckDefaultArgs<ExtArgs>
    tag?: boolean | TagDefaultArgs<ExtArgs>
  }

  export type $DeckTagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DeckTag"
    objects: {
      deck: Prisma.$FlashcardDeckPayload<ExtArgs>
      tag: Prisma.$TagPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      tagId: string
      deckId: string
    }, ExtArgs["result"]["deckTag"]>
    composites: {}
  }

  type DeckTagGetPayload<S extends boolean | null | undefined | DeckTagDefaultArgs> = $Result.GetResult<Prisma.$DeckTagPayload, S>

  type DeckTagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeckTagFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeckTagCountAggregateInputType | true
    }

  export interface DeckTagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DeckTag'], meta: { name: 'DeckTag' } }
    /**
     * Find zero or one DeckTag that matches the filter.
     * @param {DeckTagFindUniqueArgs} args - Arguments to find a DeckTag
     * @example
     * // Get one DeckTag
     * const deckTag = await prisma.deckTag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeckTagFindUniqueArgs>(args: SelectSubset<T, DeckTagFindUniqueArgs<ExtArgs>>): Prisma__DeckTagClient<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DeckTag that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeckTagFindUniqueOrThrowArgs} args - Arguments to find a DeckTag
     * @example
     * // Get one DeckTag
     * const deckTag = await prisma.deckTag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeckTagFindUniqueOrThrowArgs>(args: SelectSubset<T, DeckTagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeckTagClient<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeckTag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckTagFindFirstArgs} args - Arguments to find a DeckTag
     * @example
     * // Get one DeckTag
     * const deckTag = await prisma.deckTag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeckTagFindFirstArgs>(args?: SelectSubset<T, DeckTagFindFirstArgs<ExtArgs>>): Prisma__DeckTagClient<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeckTag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckTagFindFirstOrThrowArgs} args - Arguments to find a DeckTag
     * @example
     * // Get one DeckTag
     * const deckTag = await prisma.deckTag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeckTagFindFirstOrThrowArgs>(args?: SelectSubset<T, DeckTagFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeckTagClient<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DeckTags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckTagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DeckTags
     * const deckTags = await prisma.deckTag.findMany()
     * 
     * // Get first 10 DeckTags
     * const deckTags = await prisma.deckTag.findMany({ take: 10 })
     * 
     * // Only select the `tagId`
     * const deckTagWithTagIdOnly = await prisma.deckTag.findMany({ select: { tagId: true } })
     * 
     */
    findMany<T extends DeckTagFindManyArgs>(args?: SelectSubset<T, DeckTagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DeckTag.
     * @param {DeckTagCreateArgs} args - Arguments to create a DeckTag.
     * @example
     * // Create one DeckTag
     * const DeckTag = await prisma.deckTag.create({
     *   data: {
     *     // ... data to create a DeckTag
     *   }
     * })
     * 
     */
    create<T extends DeckTagCreateArgs>(args: SelectSubset<T, DeckTagCreateArgs<ExtArgs>>): Prisma__DeckTagClient<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DeckTags.
     * @param {DeckTagCreateManyArgs} args - Arguments to create many DeckTags.
     * @example
     * // Create many DeckTags
     * const deckTag = await prisma.deckTag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeckTagCreateManyArgs>(args?: SelectSubset<T, DeckTagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DeckTags and returns the data saved in the database.
     * @param {DeckTagCreateManyAndReturnArgs} args - Arguments to create many DeckTags.
     * @example
     * // Create many DeckTags
     * const deckTag = await prisma.deckTag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DeckTags and only return the `tagId`
     * const deckTagWithTagIdOnly = await prisma.deckTag.createManyAndReturn({
     *   select: { tagId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeckTagCreateManyAndReturnArgs>(args?: SelectSubset<T, DeckTagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DeckTag.
     * @param {DeckTagDeleteArgs} args - Arguments to delete one DeckTag.
     * @example
     * // Delete one DeckTag
     * const DeckTag = await prisma.deckTag.delete({
     *   where: {
     *     // ... filter to delete one DeckTag
     *   }
     * })
     * 
     */
    delete<T extends DeckTagDeleteArgs>(args: SelectSubset<T, DeckTagDeleteArgs<ExtArgs>>): Prisma__DeckTagClient<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DeckTag.
     * @param {DeckTagUpdateArgs} args - Arguments to update one DeckTag.
     * @example
     * // Update one DeckTag
     * const deckTag = await prisma.deckTag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeckTagUpdateArgs>(args: SelectSubset<T, DeckTagUpdateArgs<ExtArgs>>): Prisma__DeckTagClient<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DeckTags.
     * @param {DeckTagDeleteManyArgs} args - Arguments to filter DeckTags to delete.
     * @example
     * // Delete a few DeckTags
     * const { count } = await prisma.deckTag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeckTagDeleteManyArgs>(args?: SelectSubset<T, DeckTagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeckTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckTagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DeckTags
     * const deckTag = await prisma.deckTag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeckTagUpdateManyArgs>(args: SelectSubset<T, DeckTagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeckTags and returns the data updated in the database.
     * @param {DeckTagUpdateManyAndReturnArgs} args - Arguments to update many DeckTags.
     * @example
     * // Update many DeckTags
     * const deckTag = await prisma.deckTag.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DeckTags and only return the `tagId`
     * const deckTagWithTagIdOnly = await prisma.deckTag.updateManyAndReturn({
     *   select: { tagId: true },
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
    updateManyAndReturn<T extends DeckTagUpdateManyAndReturnArgs>(args: SelectSubset<T, DeckTagUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DeckTag.
     * @param {DeckTagUpsertArgs} args - Arguments to update or create a DeckTag.
     * @example
     * // Update or create a DeckTag
     * const deckTag = await prisma.deckTag.upsert({
     *   create: {
     *     // ... data to create a DeckTag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DeckTag we want to update
     *   }
     * })
     */
    upsert<T extends DeckTagUpsertArgs>(args: SelectSubset<T, DeckTagUpsertArgs<ExtArgs>>): Prisma__DeckTagClient<$Result.GetResult<Prisma.$DeckTagPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DeckTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckTagCountArgs} args - Arguments to filter DeckTags to count.
     * @example
     * // Count the number of DeckTags
     * const count = await prisma.deckTag.count({
     *   where: {
     *     // ... the filter for the DeckTags we want to count
     *   }
     * })
    **/
    count<T extends DeckTagCountArgs>(
      args?: Subset<T, DeckTagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeckTagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DeckTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckTagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DeckTagAggregateArgs>(args: Subset<T, DeckTagAggregateArgs>): Prisma.PrismaPromise<GetDeckTagAggregateType<T>>

    /**
     * Group by DeckTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeckTagGroupByArgs} args - Group by arguments.
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
      T extends DeckTagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeckTagGroupByArgs['orderBy'] }
        : { orderBy?: DeckTagGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DeckTagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeckTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DeckTag model
   */
  readonly fields: DeckTagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DeckTag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeckTagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    deck<T extends FlashcardDeckDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FlashcardDeckDefaultArgs<ExtArgs>>): Prisma__FlashcardDeckClient<$Result.GetResult<Prisma.$FlashcardDeckPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tag<T extends TagDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TagDefaultArgs<ExtArgs>>): Prisma__TagClient<$Result.GetResult<Prisma.$TagPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the DeckTag model
   */
  interface DeckTagFieldRefs {
    readonly tagId: FieldRef<"DeckTag", 'String'>
    readonly deckId: FieldRef<"DeckTag", 'String'>
  }
    

  // Custom InputTypes
  /**
   * DeckTag findUnique
   */
  export type DeckTagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagInclude<ExtArgs> | null
    /**
     * Filter, which DeckTag to fetch.
     */
    where: DeckTagWhereUniqueInput
  }

  /**
   * DeckTag findUniqueOrThrow
   */
  export type DeckTagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagInclude<ExtArgs> | null
    /**
     * Filter, which DeckTag to fetch.
     */
    where: DeckTagWhereUniqueInput
  }

  /**
   * DeckTag findFirst
   */
  export type DeckTagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagInclude<ExtArgs> | null
    /**
     * Filter, which DeckTag to fetch.
     */
    where?: DeckTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeckTags to fetch.
     */
    orderBy?: DeckTagOrderByWithRelationInput | DeckTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeckTags.
     */
    cursor?: DeckTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeckTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeckTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeckTags.
     */
    distinct?: DeckTagScalarFieldEnum | DeckTagScalarFieldEnum[]
  }

  /**
   * DeckTag findFirstOrThrow
   */
  export type DeckTagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagInclude<ExtArgs> | null
    /**
     * Filter, which DeckTag to fetch.
     */
    where?: DeckTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeckTags to fetch.
     */
    orderBy?: DeckTagOrderByWithRelationInput | DeckTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeckTags.
     */
    cursor?: DeckTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeckTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeckTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeckTags.
     */
    distinct?: DeckTagScalarFieldEnum | DeckTagScalarFieldEnum[]
  }

  /**
   * DeckTag findMany
   */
  export type DeckTagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagInclude<ExtArgs> | null
    /**
     * Filter, which DeckTags to fetch.
     */
    where?: DeckTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeckTags to fetch.
     */
    orderBy?: DeckTagOrderByWithRelationInput | DeckTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DeckTags.
     */
    cursor?: DeckTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeckTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeckTags.
     */
    skip?: number
    distinct?: DeckTagScalarFieldEnum | DeckTagScalarFieldEnum[]
  }

  /**
   * DeckTag create
   */
  export type DeckTagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagInclude<ExtArgs> | null
    /**
     * The data needed to create a DeckTag.
     */
    data: XOR<DeckTagCreateInput, DeckTagUncheckedCreateInput>
  }

  /**
   * DeckTag createMany
   */
  export type DeckTagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DeckTags.
     */
    data: DeckTagCreateManyInput | DeckTagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DeckTag createManyAndReturn
   */
  export type DeckTagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * The data used to create many DeckTags.
     */
    data: DeckTagCreateManyInput | DeckTagCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeckTag update
   */
  export type DeckTagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagInclude<ExtArgs> | null
    /**
     * The data needed to update a DeckTag.
     */
    data: XOR<DeckTagUpdateInput, DeckTagUncheckedUpdateInput>
    /**
     * Choose, which DeckTag to update.
     */
    where: DeckTagWhereUniqueInput
  }

  /**
   * DeckTag updateMany
   */
  export type DeckTagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DeckTags.
     */
    data: XOR<DeckTagUpdateManyMutationInput, DeckTagUncheckedUpdateManyInput>
    /**
     * Filter which DeckTags to update
     */
    where?: DeckTagWhereInput
    /**
     * Limit how many DeckTags to update.
     */
    limit?: number
  }

  /**
   * DeckTag updateManyAndReturn
   */
  export type DeckTagUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * The data used to update DeckTags.
     */
    data: XOR<DeckTagUpdateManyMutationInput, DeckTagUncheckedUpdateManyInput>
    /**
     * Filter which DeckTags to update
     */
    where?: DeckTagWhereInput
    /**
     * Limit how many DeckTags to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeckTag upsert
   */
  export type DeckTagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagInclude<ExtArgs> | null
    /**
     * The filter to search for the DeckTag to update in case it exists.
     */
    where: DeckTagWhereUniqueInput
    /**
     * In case the DeckTag found by the `where` argument doesn't exist, create a new DeckTag with this data.
     */
    create: XOR<DeckTagCreateInput, DeckTagUncheckedCreateInput>
    /**
     * In case the DeckTag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeckTagUpdateInput, DeckTagUncheckedUpdateInput>
  }

  /**
   * DeckTag delete
   */
  export type DeckTagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagInclude<ExtArgs> | null
    /**
     * Filter which DeckTag to delete.
     */
    where: DeckTagWhereUniqueInput
  }

  /**
   * DeckTag deleteMany
   */
  export type DeckTagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeckTags to delete
     */
    where?: DeckTagWhereInput
    /**
     * Limit how many DeckTags to delete.
     */
    limit?: number
  }

  /**
   * DeckTag without action
   */
  export type DeckTagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeckTag
     */
    select?: DeckTagSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeckTag
     */
    omit?: DeckTagOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeckTagInclude<ExtArgs> | null
  }


  /**
   * Model UserFlashcardProgress
   */

  export type AggregateUserFlashcardProgress = {
    _count: UserFlashcardProgressCountAggregateOutputType | null
    _avg: UserFlashcardProgressAvgAggregateOutputType | null
    _sum: UserFlashcardProgressSumAggregateOutputType | null
    _min: UserFlashcardProgressMinAggregateOutputType | null
    _max: UserFlashcardProgressMaxAggregateOutputType | null
  }

  export type UserFlashcardProgressAvgAggregateOutputType = {
    repetitions: number | null
    easeFactor: number | null
    interval: number | null
    learningStep: number | null
  }

  export type UserFlashcardProgressSumAggregateOutputType = {
    repetitions: number | null
    easeFactor: number | null
    interval: number | null
    learningStep: number | null
  }

  export type UserFlashcardProgressMinAggregateOutputType = {
    userId: string | null
    flashcardId: string | null
    status: $Enums.FlashcardStatus | null
    nextReviewAt: Date | null
    repetitions: number | null
    easeFactor: number | null
    interval: number | null
    learningStep: number | null
  }

  export type UserFlashcardProgressMaxAggregateOutputType = {
    userId: string | null
    flashcardId: string | null
    status: $Enums.FlashcardStatus | null
    nextReviewAt: Date | null
    repetitions: number | null
    easeFactor: number | null
    interval: number | null
    learningStep: number | null
  }

  export type UserFlashcardProgressCountAggregateOutputType = {
    userId: number
    flashcardId: number
    status: number
    nextReviewAt: number
    repetitions: number
    easeFactor: number
    interval: number
    learningStep: number
    _all: number
  }


  export type UserFlashcardProgressAvgAggregateInputType = {
    repetitions?: true
    easeFactor?: true
    interval?: true
    learningStep?: true
  }

  export type UserFlashcardProgressSumAggregateInputType = {
    repetitions?: true
    easeFactor?: true
    interval?: true
    learningStep?: true
  }

  export type UserFlashcardProgressMinAggregateInputType = {
    userId?: true
    flashcardId?: true
    status?: true
    nextReviewAt?: true
    repetitions?: true
    easeFactor?: true
    interval?: true
    learningStep?: true
  }

  export type UserFlashcardProgressMaxAggregateInputType = {
    userId?: true
    flashcardId?: true
    status?: true
    nextReviewAt?: true
    repetitions?: true
    easeFactor?: true
    interval?: true
    learningStep?: true
  }

  export type UserFlashcardProgressCountAggregateInputType = {
    userId?: true
    flashcardId?: true
    status?: true
    nextReviewAt?: true
    repetitions?: true
    easeFactor?: true
    interval?: true
    learningStep?: true
    _all?: true
  }

  export type UserFlashcardProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserFlashcardProgress to aggregate.
     */
    where?: UserFlashcardProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserFlashcardProgresses to fetch.
     */
    orderBy?: UserFlashcardProgressOrderByWithRelationInput | UserFlashcardProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserFlashcardProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserFlashcardProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserFlashcardProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserFlashcardProgresses
    **/
    _count?: true | UserFlashcardProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserFlashcardProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserFlashcardProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserFlashcardProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserFlashcardProgressMaxAggregateInputType
  }

  export type GetUserFlashcardProgressAggregateType<T extends UserFlashcardProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateUserFlashcardProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserFlashcardProgress[P]>
      : GetScalarType<T[P], AggregateUserFlashcardProgress[P]>
  }




  export type UserFlashcardProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserFlashcardProgressWhereInput
    orderBy?: UserFlashcardProgressOrderByWithAggregationInput | UserFlashcardProgressOrderByWithAggregationInput[]
    by: UserFlashcardProgressScalarFieldEnum[] | UserFlashcardProgressScalarFieldEnum
    having?: UserFlashcardProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserFlashcardProgressCountAggregateInputType | true
    _avg?: UserFlashcardProgressAvgAggregateInputType
    _sum?: UserFlashcardProgressSumAggregateInputType
    _min?: UserFlashcardProgressMinAggregateInputType
    _max?: UserFlashcardProgressMaxAggregateInputType
  }

  export type UserFlashcardProgressGroupByOutputType = {
    userId: string
    flashcardId: string
    status: $Enums.FlashcardStatus
    nextReviewAt: Date
    repetitions: number
    easeFactor: number
    interval: number
    learningStep: number
    _count: UserFlashcardProgressCountAggregateOutputType | null
    _avg: UserFlashcardProgressAvgAggregateOutputType | null
    _sum: UserFlashcardProgressSumAggregateOutputType | null
    _min: UserFlashcardProgressMinAggregateOutputType | null
    _max: UserFlashcardProgressMaxAggregateOutputType | null
  }

  type GetUserFlashcardProgressGroupByPayload<T extends UserFlashcardProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserFlashcardProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserFlashcardProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserFlashcardProgressGroupByOutputType[P]>
            : GetScalarType<T[P], UserFlashcardProgressGroupByOutputType[P]>
        }
      >
    >


  export type UserFlashcardProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    flashcardId?: boolean
    status?: boolean
    nextReviewAt?: boolean
    repetitions?: boolean
    easeFactor?: boolean
    interval?: boolean
    learningStep?: boolean
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userFlashcardProgress"]>

  export type UserFlashcardProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    flashcardId?: boolean
    status?: boolean
    nextReviewAt?: boolean
    repetitions?: boolean
    easeFactor?: boolean
    interval?: boolean
    learningStep?: boolean
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userFlashcardProgress"]>

  export type UserFlashcardProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    flashcardId?: boolean
    status?: boolean
    nextReviewAt?: boolean
    repetitions?: boolean
    easeFactor?: boolean
    interval?: boolean
    learningStep?: boolean
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userFlashcardProgress"]>

  export type UserFlashcardProgressSelectScalar = {
    userId?: boolean
    flashcardId?: boolean
    status?: boolean
    nextReviewAt?: boolean
    repetitions?: boolean
    easeFactor?: boolean
    interval?: boolean
    learningStep?: boolean
  }

  export type UserFlashcardProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "flashcardId" | "status" | "nextReviewAt" | "repetitions" | "easeFactor" | "interval" | "learningStep", ExtArgs["result"]["userFlashcardProgress"]>
  export type UserFlashcardProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
  }
  export type UserFlashcardProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
  }
  export type UserFlashcardProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    flashcard?: boolean | FlashcardDefaultArgs<ExtArgs>
  }

  export type $UserFlashcardProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserFlashcardProgress"
    objects: {
      flashcard: Prisma.$FlashcardPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      flashcardId: string
      status: $Enums.FlashcardStatus
      nextReviewAt: Date
      repetitions: number
      easeFactor: number
      interval: number
      learningStep: number
    }, ExtArgs["result"]["userFlashcardProgress"]>
    composites: {}
  }

  type UserFlashcardProgressGetPayload<S extends boolean | null | undefined | UserFlashcardProgressDefaultArgs> = $Result.GetResult<Prisma.$UserFlashcardProgressPayload, S>

  type UserFlashcardProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFlashcardProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserFlashcardProgressCountAggregateInputType | true
    }

  export interface UserFlashcardProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserFlashcardProgress'], meta: { name: 'UserFlashcardProgress' } }
    /**
     * Find zero or one UserFlashcardProgress that matches the filter.
     * @param {UserFlashcardProgressFindUniqueArgs} args - Arguments to find a UserFlashcardProgress
     * @example
     * // Get one UserFlashcardProgress
     * const userFlashcardProgress = await prisma.userFlashcardProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFlashcardProgressFindUniqueArgs>(args: SelectSubset<T, UserFlashcardProgressFindUniqueArgs<ExtArgs>>): Prisma__UserFlashcardProgressClient<$Result.GetResult<Prisma.$UserFlashcardProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserFlashcardProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFlashcardProgressFindUniqueOrThrowArgs} args - Arguments to find a UserFlashcardProgress
     * @example
     * // Get one UserFlashcardProgress
     * const userFlashcardProgress = await prisma.userFlashcardProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFlashcardProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFlashcardProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserFlashcardProgressClient<$Result.GetResult<Prisma.$UserFlashcardProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserFlashcardProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardProgressFindFirstArgs} args - Arguments to find a UserFlashcardProgress
     * @example
     * // Get one UserFlashcardProgress
     * const userFlashcardProgress = await prisma.userFlashcardProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFlashcardProgressFindFirstArgs>(args?: SelectSubset<T, UserFlashcardProgressFindFirstArgs<ExtArgs>>): Prisma__UserFlashcardProgressClient<$Result.GetResult<Prisma.$UserFlashcardProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserFlashcardProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardProgressFindFirstOrThrowArgs} args - Arguments to find a UserFlashcardProgress
     * @example
     * // Get one UserFlashcardProgress
     * const userFlashcardProgress = await prisma.userFlashcardProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFlashcardProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFlashcardProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserFlashcardProgressClient<$Result.GetResult<Prisma.$UserFlashcardProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserFlashcardProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserFlashcardProgresses
     * const userFlashcardProgresses = await prisma.userFlashcardProgress.findMany()
     * 
     * // Get first 10 UserFlashcardProgresses
     * const userFlashcardProgresses = await prisma.userFlashcardProgress.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const userFlashcardProgressWithUserIdOnly = await prisma.userFlashcardProgress.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends UserFlashcardProgressFindManyArgs>(args?: SelectSubset<T, UserFlashcardProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserFlashcardProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserFlashcardProgress.
     * @param {UserFlashcardProgressCreateArgs} args - Arguments to create a UserFlashcardProgress.
     * @example
     * // Create one UserFlashcardProgress
     * const UserFlashcardProgress = await prisma.userFlashcardProgress.create({
     *   data: {
     *     // ... data to create a UserFlashcardProgress
     *   }
     * })
     * 
     */
    create<T extends UserFlashcardProgressCreateArgs>(args: SelectSubset<T, UserFlashcardProgressCreateArgs<ExtArgs>>): Prisma__UserFlashcardProgressClient<$Result.GetResult<Prisma.$UserFlashcardProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserFlashcardProgresses.
     * @param {UserFlashcardProgressCreateManyArgs} args - Arguments to create many UserFlashcardProgresses.
     * @example
     * // Create many UserFlashcardProgresses
     * const userFlashcardProgress = await prisma.userFlashcardProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserFlashcardProgressCreateManyArgs>(args?: SelectSubset<T, UserFlashcardProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserFlashcardProgresses and returns the data saved in the database.
     * @param {UserFlashcardProgressCreateManyAndReturnArgs} args - Arguments to create many UserFlashcardProgresses.
     * @example
     * // Create many UserFlashcardProgresses
     * const userFlashcardProgress = await prisma.userFlashcardProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserFlashcardProgresses and only return the `userId`
     * const userFlashcardProgressWithUserIdOnly = await prisma.userFlashcardProgress.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserFlashcardProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, UserFlashcardProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserFlashcardProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserFlashcardProgress.
     * @param {UserFlashcardProgressDeleteArgs} args - Arguments to delete one UserFlashcardProgress.
     * @example
     * // Delete one UserFlashcardProgress
     * const UserFlashcardProgress = await prisma.userFlashcardProgress.delete({
     *   where: {
     *     // ... filter to delete one UserFlashcardProgress
     *   }
     * })
     * 
     */
    delete<T extends UserFlashcardProgressDeleteArgs>(args: SelectSubset<T, UserFlashcardProgressDeleteArgs<ExtArgs>>): Prisma__UserFlashcardProgressClient<$Result.GetResult<Prisma.$UserFlashcardProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserFlashcardProgress.
     * @param {UserFlashcardProgressUpdateArgs} args - Arguments to update one UserFlashcardProgress.
     * @example
     * // Update one UserFlashcardProgress
     * const userFlashcardProgress = await prisma.userFlashcardProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserFlashcardProgressUpdateArgs>(args: SelectSubset<T, UserFlashcardProgressUpdateArgs<ExtArgs>>): Prisma__UserFlashcardProgressClient<$Result.GetResult<Prisma.$UserFlashcardProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserFlashcardProgresses.
     * @param {UserFlashcardProgressDeleteManyArgs} args - Arguments to filter UserFlashcardProgresses to delete.
     * @example
     * // Delete a few UserFlashcardProgresses
     * const { count } = await prisma.userFlashcardProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserFlashcardProgressDeleteManyArgs>(args?: SelectSubset<T, UserFlashcardProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserFlashcardProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserFlashcardProgresses
     * const userFlashcardProgress = await prisma.userFlashcardProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserFlashcardProgressUpdateManyArgs>(args: SelectSubset<T, UserFlashcardProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserFlashcardProgresses and returns the data updated in the database.
     * @param {UserFlashcardProgressUpdateManyAndReturnArgs} args - Arguments to update many UserFlashcardProgresses.
     * @example
     * // Update many UserFlashcardProgresses
     * const userFlashcardProgress = await prisma.userFlashcardProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserFlashcardProgresses and only return the `userId`
     * const userFlashcardProgressWithUserIdOnly = await prisma.userFlashcardProgress.updateManyAndReturn({
     *   select: { userId: true },
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
    updateManyAndReturn<T extends UserFlashcardProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, UserFlashcardProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserFlashcardProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserFlashcardProgress.
     * @param {UserFlashcardProgressUpsertArgs} args - Arguments to update or create a UserFlashcardProgress.
     * @example
     * // Update or create a UserFlashcardProgress
     * const userFlashcardProgress = await prisma.userFlashcardProgress.upsert({
     *   create: {
     *     // ... data to create a UserFlashcardProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserFlashcardProgress we want to update
     *   }
     * })
     */
    upsert<T extends UserFlashcardProgressUpsertArgs>(args: SelectSubset<T, UserFlashcardProgressUpsertArgs<ExtArgs>>): Prisma__UserFlashcardProgressClient<$Result.GetResult<Prisma.$UserFlashcardProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserFlashcardProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardProgressCountArgs} args - Arguments to filter UserFlashcardProgresses to count.
     * @example
     * // Count the number of UserFlashcardProgresses
     * const count = await prisma.userFlashcardProgress.count({
     *   where: {
     *     // ... the filter for the UserFlashcardProgresses we want to count
     *   }
     * })
    **/
    count<T extends UserFlashcardProgressCountArgs>(
      args?: Subset<T, UserFlashcardProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserFlashcardProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserFlashcardProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserFlashcardProgressAggregateArgs>(args: Subset<T, UserFlashcardProgressAggregateArgs>): Prisma.PrismaPromise<GetUserFlashcardProgressAggregateType<T>>

    /**
     * Group by UserFlashcardProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFlashcardProgressGroupByArgs} args - Group by arguments.
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
      T extends UserFlashcardProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserFlashcardProgressGroupByArgs['orderBy'] }
        : { orderBy?: UserFlashcardProgressGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserFlashcardProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserFlashcardProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserFlashcardProgress model
   */
  readonly fields: UserFlashcardProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserFlashcardProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserFlashcardProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    flashcard<T extends FlashcardDefaultArgs<ExtArgs> = {}>(args?: Subset<T, FlashcardDefaultArgs<ExtArgs>>): Prisma__FlashcardClient<$Result.GetResult<Prisma.$FlashcardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the UserFlashcardProgress model
   */
  interface UserFlashcardProgressFieldRefs {
    readonly userId: FieldRef<"UserFlashcardProgress", 'String'>
    readonly flashcardId: FieldRef<"UserFlashcardProgress", 'String'>
    readonly status: FieldRef<"UserFlashcardProgress", 'FlashcardStatus'>
    readonly nextReviewAt: FieldRef<"UserFlashcardProgress", 'DateTime'>
    readonly repetitions: FieldRef<"UserFlashcardProgress", 'Int'>
    readonly easeFactor: FieldRef<"UserFlashcardProgress", 'Float'>
    readonly interval: FieldRef<"UserFlashcardProgress", 'Int'>
    readonly learningStep: FieldRef<"UserFlashcardProgress", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * UserFlashcardProgress findUnique
   */
  export type UserFlashcardProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserFlashcardProgress to fetch.
     */
    where: UserFlashcardProgressWhereUniqueInput
  }

  /**
   * UserFlashcardProgress findUniqueOrThrow
   */
  export type UserFlashcardProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserFlashcardProgress to fetch.
     */
    where: UserFlashcardProgressWhereUniqueInput
  }

  /**
   * UserFlashcardProgress findFirst
   */
  export type UserFlashcardProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserFlashcardProgress to fetch.
     */
    where?: UserFlashcardProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserFlashcardProgresses to fetch.
     */
    orderBy?: UserFlashcardProgressOrderByWithRelationInput | UserFlashcardProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserFlashcardProgresses.
     */
    cursor?: UserFlashcardProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserFlashcardProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserFlashcardProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserFlashcardProgresses.
     */
    distinct?: UserFlashcardProgressScalarFieldEnum | UserFlashcardProgressScalarFieldEnum[]
  }

  /**
   * UserFlashcardProgress findFirstOrThrow
   */
  export type UserFlashcardProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserFlashcardProgress to fetch.
     */
    where?: UserFlashcardProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserFlashcardProgresses to fetch.
     */
    orderBy?: UserFlashcardProgressOrderByWithRelationInput | UserFlashcardProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserFlashcardProgresses.
     */
    cursor?: UserFlashcardProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserFlashcardProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserFlashcardProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserFlashcardProgresses.
     */
    distinct?: UserFlashcardProgressScalarFieldEnum | UserFlashcardProgressScalarFieldEnum[]
  }

  /**
   * UserFlashcardProgress findMany
   */
  export type UserFlashcardProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserFlashcardProgresses to fetch.
     */
    where?: UserFlashcardProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserFlashcardProgresses to fetch.
     */
    orderBy?: UserFlashcardProgressOrderByWithRelationInput | UserFlashcardProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserFlashcardProgresses.
     */
    cursor?: UserFlashcardProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserFlashcardProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserFlashcardProgresses.
     */
    skip?: number
    distinct?: UserFlashcardProgressScalarFieldEnum | UserFlashcardProgressScalarFieldEnum[]
  }

  /**
   * UserFlashcardProgress create
   */
  export type UserFlashcardProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a UserFlashcardProgress.
     */
    data: XOR<UserFlashcardProgressCreateInput, UserFlashcardProgressUncheckedCreateInput>
  }

  /**
   * UserFlashcardProgress createMany
   */
  export type UserFlashcardProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserFlashcardProgresses.
     */
    data: UserFlashcardProgressCreateManyInput | UserFlashcardProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserFlashcardProgress createManyAndReturn
   */
  export type UserFlashcardProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * The data used to create many UserFlashcardProgresses.
     */
    data: UserFlashcardProgressCreateManyInput | UserFlashcardProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserFlashcardProgress update
   */
  export type UserFlashcardProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a UserFlashcardProgress.
     */
    data: XOR<UserFlashcardProgressUpdateInput, UserFlashcardProgressUncheckedUpdateInput>
    /**
     * Choose, which UserFlashcardProgress to update.
     */
    where: UserFlashcardProgressWhereUniqueInput
  }

  /**
   * UserFlashcardProgress updateMany
   */
  export type UserFlashcardProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserFlashcardProgresses.
     */
    data: XOR<UserFlashcardProgressUpdateManyMutationInput, UserFlashcardProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserFlashcardProgresses to update
     */
    where?: UserFlashcardProgressWhereInput
    /**
     * Limit how many UserFlashcardProgresses to update.
     */
    limit?: number
  }

  /**
   * UserFlashcardProgress updateManyAndReturn
   */
  export type UserFlashcardProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * The data used to update UserFlashcardProgresses.
     */
    data: XOR<UserFlashcardProgressUpdateManyMutationInput, UserFlashcardProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserFlashcardProgresses to update
     */
    where?: UserFlashcardProgressWhereInput
    /**
     * Limit how many UserFlashcardProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserFlashcardProgress upsert
   */
  export type UserFlashcardProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the UserFlashcardProgress to update in case it exists.
     */
    where: UserFlashcardProgressWhereUniqueInput
    /**
     * In case the UserFlashcardProgress found by the `where` argument doesn't exist, create a new UserFlashcardProgress with this data.
     */
    create: XOR<UserFlashcardProgressCreateInput, UserFlashcardProgressUncheckedCreateInput>
    /**
     * In case the UserFlashcardProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserFlashcardProgressUpdateInput, UserFlashcardProgressUncheckedUpdateInput>
  }

  /**
   * UserFlashcardProgress delete
   */
  export type UserFlashcardProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressInclude<ExtArgs> | null
    /**
     * Filter which UserFlashcardProgress to delete.
     */
    where: UserFlashcardProgressWhereUniqueInput
  }

  /**
   * UserFlashcardProgress deleteMany
   */
  export type UserFlashcardProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserFlashcardProgresses to delete
     */
    where?: UserFlashcardProgressWhereInput
    /**
     * Limit how many UserFlashcardProgresses to delete.
     */
    limit?: number
  }

  /**
   * UserFlashcardProgress without action
   */
  export type UserFlashcardProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserFlashcardProgress
     */
    select?: UserFlashcardProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserFlashcardProgress
     */
    omit?: UserFlashcardProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserFlashcardProgressInclude<ExtArgs> | null
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


  export const TagScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type TagScalarFieldEnum = (typeof TagScalarFieldEnum)[keyof typeof TagScalarFieldEnum]


  export const FlashcardDeckScalarFieldEnum: {
    id: 'id',
    title: 'title',
    createdAt: 'createdAt',
    description: 'description',
    isPublic: 'isPublic',
    userId: 'userId'
  };

  export type FlashcardDeckScalarFieldEnum = (typeof FlashcardDeckScalarFieldEnum)[keyof typeof FlashcardDeckScalarFieldEnum]


  export const FlashcardScalarFieldEnum: {
    id: 'id',
    frontContent: 'frontContent',
    backContent: 'backContent',
    exampleSentence: 'exampleSentence',
    audioUrl: 'audioUrl',
    deckId: 'deckId'
  };

  export type FlashcardScalarFieldEnum = (typeof FlashcardScalarFieldEnum)[keyof typeof FlashcardScalarFieldEnum]


  export const DeckTagScalarFieldEnum: {
    tagId: 'tagId',
    deckId: 'deckId'
  };

  export type DeckTagScalarFieldEnum = (typeof DeckTagScalarFieldEnum)[keyof typeof DeckTagScalarFieldEnum]


  export const UserFlashcardProgressScalarFieldEnum: {
    userId: 'userId',
    flashcardId: 'flashcardId',
    status: 'status',
    nextReviewAt: 'nextReviewAt',
    repetitions: 'repetitions',
    easeFactor: 'easeFactor',
    interval: 'interval',
    learningStep: 'learningStep'
  };

  export type UserFlashcardProgressScalarFieldEnum = (typeof UserFlashcardProgressScalarFieldEnum)[keyof typeof UserFlashcardProgressScalarFieldEnum]


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
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'FlashcardStatus'
   */
  export type EnumFlashcardStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FlashcardStatus'>
    


  /**
   * Reference to a field of type 'FlashcardStatus[]'
   */
  export type ListEnumFlashcardStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FlashcardStatus[]'>
    


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
   * Deep Input Types
   */


  export type TagWhereInput = {
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    id?: UuidFilter<"Tag"> | string
    name?: StringFilter<"Tag"> | string
    deckTags?: DeckTagListRelationFilter
  }

  export type TagOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    deckTags?: DeckTagOrderByRelationAggregateInput
  }

  export type TagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: TagWhereInput | TagWhereInput[]
    OR?: TagWhereInput[]
    NOT?: TagWhereInput | TagWhereInput[]
    deckTags?: DeckTagListRelationFilter
  }, "id" | "name">

  export type TagOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: TagCountOrderByAggregateInput
    _max?: TagMaxOrderByAggregateInput
    _min?: TagMinOrderByAggregateInput
  }

  export type TagScalarWhereWithAggregatesInput = {
    AND?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    OR?: TagScalarWhereWithAggregatesInput[]
    NOT?: TagScalarWhereWithAggregatesInput | TagScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Tag"> | string
    name?: StringWithAggregatesFilter<"Tag"> | string
  }

  export type FlashcardDeckWhereInput = {
    AND?: FlashcardDeckWhereInput | FlashcardDeckWhereInput[]
    OR?: FlashcardDeckWhereInput[]
    NOT?: FlashcardDeckWhereInput | FlashcardDeckWhereInput[]
    id?: UuidFilter<"FlashcardDeck"> | string
    title?: StringFilter<"FlashcardDeck"> | string
    createdAt?: DateTimeFilter<"FlashcardDeck"> | Date | string
    description?: StringNullableFilter<"FlashcardDeck"> | string | null
    isPublic?: BoolFilter<"FlashcardDeck"> | boolean
    userId?: UuidFilter<"FlashcardDeck"> | string
    deckTags?: DeckTagListRelationFilter
    flashcards?: FlashcardListRelationFilter
  }

  export type FlashcardDeckOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    description?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    userId?: SortOrder
    deckTags?: DeckTagOrderByRelationAggregateInput
    flashcards?: FlashcardOrderByRelationAggregateInput
  }

  export type FlashcardDeckWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FlashcardDeckWhereInput | FlashcardDeckWhereInput[]
    OR?: FlashcardDeckWhereInput[]
    NOT?: FlashcardDeckWhereInput | FlashcardDeckWhereInput[]
    title?: StringFilter<"FlashcardDeck"> | string
    createdAt?: DateTimeFilter<"FlashcardDeck"> | Date | string
    description?: StringNullableFilter<"FlashcardDeck"> | string | null
    isPublic?: BoolFilter<"FlashcardDeck"> | boolean
    userId?: UuidFilter<"FlashcardDeck"> | string
    deckTags?: DeckTagListRelationFilter
    flashcards?: FlashcardListRelationFilter
  }, "id">

  export type FlashcardDeckOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    description?: SortOrderInput | SortOrder
    isPublic?: SortOrder
    userId?: SortOrder
    _count?: FlashcardDeckCountOrderByAggregateInput
    _max?: FlashcardDeckMaxOrderByAggregateInput
    _min?: FlashcardDeckMinOrderByAggregateInput
  }

  export type FlashcardDeckScalarWhereWithAggregatesInput = {
    AND?: FlashcardDeckScalarWhereWithAggregatesInput | FlashcardDeckScalarWhereWithAggregatesInput[]
    OR?: FlashcardDeckScalarWhereWithAggregatesInput[]
    NOT?: FlashcardDeckScalarWhereWithAggregatesInput | FlashcardDeckScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"FlashcardDeck"> | string
    title?: StringWithAggregatesFilter<"FlashcardDeck"> | string
    createdAt?: DateTimeWithAggregatesFilter<"FlashcardDeck"> | Date | string
    description?: StringNullableWithAggregatesFilter<"FlashcardDeck"> | string | null
    isPublic?: BoolWithAggregatesFilter<"FlashcardDeck"> | boolean
    userId?: UuidWithAggregatesFilter<"FlashcardDeck"> | string
  }

  export type FlashcardWhereInput = {
    AND?: FlashcardWhereInput | FlashcardWhereInput[]
    OR?: FlashcardWhereInput[]
    NOT?: FlashcardWhereInput | FlashcardWhereInput[]
    id?: UuidFilter<"Flashcard"> | string
    frontContent?: StringFilter<"Flashcard"> | string
    backContent?: StringFilter<"Flashcard"> | string
    exampleSentence?: StringNullableFilter<"Flashcard"> | string | null
    audioUrl?: StringNullableFilter<"Flashcard"> | string | null
    deckId?: UuidFilter<"Flashcard"> | string
    deck?: XOR<FlashcardDeckScalarRelationFilter, FlashcardDeckWhereInput>
    userProgress?: UserFlashcardProgressListRelationFilter
  }

  export type FlashcardOrderByWithRelationInput = {
    id?: SortOrder
    frontContent?: SortOrder
    backContent?: SortOrder
    exampleSentence?: SortOrderInput | SortOrder
    audioUrl?: SortOrderInput | SortOrder
    deckId?: SortOrder
    deck?: FlashcardDeckOrderByWithRelationInput
    userProgress?: UserFlashcardProgressOrderByRelationAggregateInput
  }

  export type FlashcardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: FlashcardWhereInput | FlashcardWhereInput[]
    OR?: FlashcardWhereInput[]
    NOT?: FlashcardWhereInput | FlashcardWhereInput[]
    frontContent?: StringFilter<"Flashcard"> | string
    backContent?: StringFilter<"Flashcard"> | string
    exampleSentence?: StringNullableFilter<"Flashcard"> | string | null
    audioUrl?: StringNullableFilter<"Flashcard"> | string | null
    deckId?: UuidFilter<"Flashcard"> | string
    deck?: XOR<FlashcardDeckScalarRelationFilter, FlashcardDeckWhereInput>
    userProgress?: UserFlashcardProgressListRelationFilter
  }, "id">

  export type FlashcardOrderByWithAggregationInput = {
    id?: SortOrder
    frontContent?: SortOrder
    backContent?: SortOrder
    exampleSentence?: SortOrderInput | SortOrder
    audioUrl?: SortOrderInput | SortOrder
    deckId?: SortOrder
    _count?: FlashcardCountOrderByAggregateInput
    _max?: FlashcardMaxOrderByAggregateInput
    _min?: FlashcardMinOrderByAggregateInput
  }

  export type FlashcardScalarWhereWithAggregatesInput = {
    AND?: FlashcardScalarWhereWithAggregatesInput | FlashcardScalarWhereWithAggregatesInput[]
    OR?: FlashcardScalarWhereWithAggregatesInput[]
    NOT?: FlashcardScalarWhereWithAggregatesInput | FlashcardScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Flashcard"> | string
    frontContent?: StringWithAggregatesFilter<"Flashcard"> | string
    backContent?: StringWithAggregatesFilter<"Flashcard"> | string
    exampleSentence?: StringNullableWithAggregatesFilter<"Flashcard"> | string | null
    audioUrl?: StringNullableWithAggregatesFilter<"Flashcard"> | string | null
    deckId?: UuidWithAggregatesFilter<"Flashcard"> | string
  }

  export type DeckTagWhereInput = {
    AND?: DeckTagWhereInput | DeckTagWhereInput[]
    OR?: DeckTagWhereInput[]
    NOT?: DeckTagWhereInput | DeckTagWhereInput[]
    tagId?: UuidFilter<"DeckTag"> | string
    deckId?: UuidFilter<"DeckTag"> | string
    deck?: XOR<FlashcardDeckScalarRelationFilter, FlashcardDeckWhereInput>
    tag?: XOR<TagScalarRelationFilter, TagWhereInput>
  }

  export type DeckTagOrderByWithRelationInput = {
    tagId?: SortOrder
    deckId?: SortOrder
    deck?: FlashcardDeckOrderByWithRelationInput
    tag?: TagOrderByWithRelationInput
  }

  export type DeckTagWhereUniqueInput = Prisma.AtLeast<{
    tagId_deckId?: DeckTagTagIdDeckIdCompoundUniqueInput
    AND?: DeckTagWhereInput | DeckTagWhereInput[]
    OR?: DeckTagWhereInput[]
    NOT?: DeckTagWhereInput | DeckTagWhereInput[]
    tagId?: UuidFilter<"DeckTag"> | string
    deckId?: UuidFilter<"DeckTag"> | string
    deck?: XOR<FlashcardDeckScalarRelationFilter, FlashcardDeckWhereInput>
    tag?: XOR<TagScalarRelationFilter, TagWhereInput>
  }, "tagId_deckId">

  export type DeckTagOrderByWithAggregationInput = {
    tagId?: SortOrder
    deckId?: SortOrder
    _count?: DeckTagCountOrderByAggregateInput
    _max?: DeckTagMaxOrderByAggregateInput
    _min?: DeckTagMinOrderByAggregateInput
  }

  export type DeckTagScalarWhereWithAggregatesInput = {
    AND?: DeckTagScalarWhereWithAggregatesInput | DeckTagScalarWhereWithAggregatesInput[]
    OR?: DeckTagScalarWhereWithAggregatesInput[]
    NOT?: DeckTagScalarWhereWithAggregatesInput | DeckTagScalarWhereWithAggregatesInput[]
    tagId?: UuidWithAggregatesFilter<"DeckTag"> | string
    deckId?: UuidWithAggregatesFilter<"DeckTag"> | string
  }

  export type UserFlashcardProgressWhereInput = {
    AND?: UserFlashcardProgressWhereInput | UserFlashcardProgressWhereInput[]
    OR?: UserFlashcardProgressWhereInput[]
    NOT?: UserFlashcardProgressWhereInput | UserFlashcardProgressWhereInput[]
    userId?: UuidFilter<"UserFlashcardProgress"> | string
    flashcardId?: UuidFilter<"UserFlashcardProgress"> | string
    status?: EnumFlashcardStatusFilter<"UserFlashcardProgress"> | $Enums.FlashcardStatus
    nextReviewAt?: DateTimeFilter<"UserFlashcardProgress"> | Date | string
    repetitions?: IntFilter<"UserFlashcardProgress"> | number
    easeFactor?: FloatFilter<"UserFlashcardProgress"> | number
    interval?: IntFilter<"UserFlashcardProgress"> | number
    learningStep?: IntFilter<"UserFlashcardProgress"> | number
    flashcard?: XOR<FlashcardScalarRelationFilter, FlashcardWhereInput>
  }

  export type UserFlashcardProgressOrderByWithRelationInput = {
    userId?: SortOrder
    flashcardId?: SortOrder
    status?: SortOrder
    nextReviewAt?: SortOrder
    repetitions?: SortOrder
    easeFactor?: SortOrder
    interval?: SortOrder
    learningStep?: SortOrder
    flashcard?: FlashcardOrderByWithRelationInput
  }

  export type UserFlashcardProgressWhereUniqueInput = Prisma.AtLeast<{
    userId_flashcardId?: UserFlashcardProgressUserIdFlashcardIdCompoundUniqueInput
    AND?: UserFlashcardProgressWhereInput | UserFlashcardProgressWhereInput[]
    OR?: UserFlashcardProgressWhereInput[]
    NOT?: UserFlashcardProgressWhereInput | UserFlashcardProgressWhereInput[]
    userId?: UuidFilter<"UserFlashcardProgress"> | string
    flashcardId?: UuidFilter<"UserFlashcardProgress"> | string
    status?: EnumFlashcardStatusFilter<"UserFlashcardProgress"> | $Enums.FlashcardStatus
    nextReviewAt?: DateTimeFilter<"UserFlashcardProgress"> | Date | string
    repetitions?: IntFilter<"UserFlashcardProgress"> | number
    easeFactor?: FloatFilter<"UserFlashcardProgress"> | number
    interval?: IntFilter<"UserFlashcardProgress"> | number
    learningStep?: IntFilter<"UserFlashcardProgress"> | number
    flashcard?: XOR<FlashcardScalarRelationFilter, FlashcardWhereInput>
  }, "userId_flashcardId">

  export type UserFlashcardProgressOrderByWithAggregationInput = {
    userId?: SortOrder
    flashcardId?: SortOrder
    status?: SortOrder
    nextReviewAt?: SortOrder
    repetitions?: SortOrder
    easeFactor?: SortOrder
    interval?: SortOrder
    learningStep?: SortOrder
    _count?: UserFlashcardProgressCountOrderByAggregateInput
    _avg?: UserFlashcardProgressAvgOrderByAggregateInput
    _max?: UserFlashcardProgressMaxOrderByAggregateInput
    _min?: UserFlashcardProgressMinOrderByAggregateInput
    _sum?: UserFlashcardProgressSumOrderByAggregateInput
  }

  export type UserFlashcardProgressScalarWhereWithAggregatesInput = {
    AND?: UserFlashcardProgressScalarWhereWithAggregatesInput | UserFlashcardProgressScalarWhereWithAggregatesInput[]
    OR?: UserFlashcardProgressScalarWhereWithAggregatesInput[]
    NOT?: UserFlashcardProgressScalarWhereWithAggregatesInput | UserFlashcardProgressScalarWhereWithAggregatesInput[]
    userId?: UuidWithAggregatesFilter<"UserFlashcardProgress"> | string
    flashcardId?: UuidWithAggregatesFilter<"UserFlashcardProgress"> | string
    status?: EnumFlashcardStatusWithAggregatesFilter<"UserFlashcardProgress"> | $Enums.FlashcardStatus
    nextReviewAt?: DateTimeWithAggregatesFilter<"UserFlashcardProgress"> | Date | string
    repetitions?: IntWithAggregatesFilter<"UserFlashcardProgress"> | number
    easeFactor?: FloatWithAggregatesFilter<"UserFlashcardProgress"> | number
    interval?: IntWithAggregatesFilter<"UserFlashcardProgress"> | number
    learningStep?: IntWithAggregatesFilter<"UserFlashcardProgress"> | number
  }

  export type TagCreateInput = {
    id?: string
    name: string
    deckTags?: DeckTagCreateNestedManyWithoutTagInput
  }

  export type TagUncheckedCreateInput = {
    id?: string
    name: string
    deckTags?: DeckTagUncheckedCreateNestedManyWithoutTagInput
  }

  export type TagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    deckTags?: DeckTagUpdateManyWithoutTagNestedInput
  }

  export type TagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    deckTags?: DeckTagUncheckedUpdateManyWithoutTagNestedInput
  }

  export type TagCreateManyInput = {
    id?: string
    name: string
  }

  export type TagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type TagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type FlashcardDeckCreateInput = {
    id?: string
    title: string
    createdAt?: Date | string
    description?: string | null
    isPublic?: boolean
    userId: string
    deckTags?: DeckTagCreateNestedManyWithoutDeckInput
    flashcards?: FlashcardCreateNestedManyWithoutDeckInput
  }

  export type FlashcardDeckUncheckedCreateInput = {
    id?: string
    title: string
    createdAt?: Date | string
    description?: string | null
    isPublic?: boolean
    userId: string
    deckTags?: DeckTagUncheckedCreateNestedManyWithoutDeckInput
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutDeckInput
  }

  export type FlashcardDeckUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
    deckTags?: DeckTagUpdateManyWithoutDeckNestedInput
    flashcards?: FlashcardUpdateManyWithoutDeckNestedInput
  }

  export type FlashcardDeckUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
    deckTags?: DeckTagUncheckedUpdateManyWithoutDeckNestedInput
    flashcards?: FlashcardUncheckedUpdateManyWithoutDeckNestedInput
  }

  export type FlashcardDeckCreateManyInput = {
    id?: string
    title: string
    createdAt?: Date | string
    description?: string | null
    isPublic?: boolean
    userId: string
  }

  export type FlashcardDeckUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type FlashcardDeckUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type FlashcardCreateInput = {
    id?: string
    frontContent: string
    backContent: string
    exampleSentence?: string | null
    audioUrl?: string | null
    deck: FlashcardDeckCreateNestedOneWithoutFlashcardsInput
    userProgress?: UserFlashcardProgressCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardUncheckedCreateInput = {
    id?: string
    frontContent: string
    backContent: string
    exampleSentence?: string | null
    audioUrl?: string | null
    deckId: string
    userProgress?: UserFlashcardProgressUncheckedCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    frontContent?: StringFieldUpdateOperationsInput | string
    backContent?: StringFieldUpdateOperationsInput | string
    exampleSentence?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deck?: FlashcardDeckUpdateOneRequiredWithoutFlashcardsNestedInput
    userProgress?: UserFlashcardProgressUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    frontContent?: StringFieldUpdateOperationsInput | string
    backContent?: StringFieldUpdateOperationsInput | string
    exampleSentence?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deckId?: StringFieldUpdateOperationsInput | string
    userProgress?: UserFlashcardProgressUncheckedUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardCreateManyInput = {
    id?: string
    frontContent: string
    backContent: string
    exampleSentence?: string | null
    audioUrl?: string | null
    deckId: string
  }

  export type FlashcardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    frontContent?: StringFieldUpdateOperationsInput | string
    backContent?: StringFieldUpdateOperationsInput | string
    exampleSentence?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FlashcardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    frontContent?: StringFieldUpdateOperationsInput | string
    backContent?: StringFieldUpdateOperationsInput | string
    exampleSentence?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deckId?: StringFieldUpdateOperationsInput | string
  }

  export type DeckTagCreateInput = {
    deck: FlashcardDeckCreateNestedOneWithoutDeckTagsInput
    tag: TagCreateNestedOneWithoutDeckTagsInput
  }

  export type DeckTagUncheckedCreateInput = {
    tagId: string
    deckId: string
  }

  export type DeckTagUpdateInput = {
    deck?: FlashcardDeckUpdateOneRequiredWithoutDeckTagsNestedInput
    tag?: TagUpdateOneRequiredWithoutDeckTagsNestedInput
  }

  export type DeckTagUncheckedUpdateInput = {
    tagId?: StringFieldUpdateOperationsInput | string
    deckId?: StringFieldUpdateOperationsInput | string
  }

  export type DeckTagCreateManyInput = {
    tagId: string
    deckId: string
  }

  export type DeckTagUpdateManyMutationInput = {

  }

  export type DeckTagUncheckedUpdateManyInput = {
    tagId?: StringFieldUpdateOperationsInput | string
    deckId?: StringFieldUpdateOperationsInput | string
  }

  export type UserFlashcardProgressCreateInput = {
    userId: string
    status?: $Enums.FlashcardStatus
    nextReviewAt?: Date | string
    repetitions?: number
    easeFactor?: number
    interval?: number
    learningStep?: number
    flashcard: FlashcardCreateNestedOneWithoutUserProgressInput
  }

  export type UserFlashcardProgressUncheckedCreateInput = {
    userId: string
    flashcardId: string
    status?: $Enums.FlashcardStatus
    nextReviewAt?: Date | string
    repetitions?: number
    easeFactor?: number
    interval?: number
    learningStep?: number
  }

  export type UserFlashcardProgressUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumFlashcardStatusFieldUpdateOperationsInput | $Enums.FlashcardStatus
    nextReviewAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repetitions?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    interval?: IntFieldUpdateOperationsInput | number
    learningStep?: IntFieldUpdateOperationsInput | number
    flashcard?: FlashcardUpdateOneRequiredWithoutUserProgressNestedInput
  }

  export type UserFlashcardProgressUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    flashcardId?: StringFieldUpdateOperationsInput | string
    status?: EnumFlashcardStatusFieldUpdateOperationsInput | $Enums.FlashcardStatus
    nextReviewAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repetitions?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    interval?: IntFieldUpdateOperationsInput | number
    learningStep?: IntFieldUpdateOperationsInput | number
  }

  export type UserFlashcardProgressCreateManyInput = {
    userId: string
    flashcardId: string
    status?: $Enums.FlashcardStatus
    nextReviewAt?: Date | string
    repetitions?: number
    easeFactor?: number
    interval?: number
    learningStep?: number
  }

  export type UserFlashcardProgressUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumFlashcardStatusFieldUpdateOperationsInput | $Enums.FlashcardStatus
    nextReviewAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repetitions?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    interval?: IntFieldUpdateOperationsInput | number
    learningStep?: IntFieldUpdateOperationsInput | number
  }

  export type UserFlashcardProgressUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    flashcardId?: StringFieldUpdateOperationsInput | string
    status?: EnumFlashcardStatusFieldUpdateOperationsInput | $Enums.FlashcardStatus
    nextReviewAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repetitions?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    interval?: IntFieldUpdateOperationsInput | number
    learningStep?: IntFieldUpdateOperationsInput | number
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

  export type DeckTagListRelationFilter = {
    every?: DeckTagWhereInput
    some?: DeckTagWhereInput
    none?: DeckTagWhereInput
  }

  export type DeckTagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TagCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type TagMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type TagMinOrderByAggregateInput = {
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type FlashcardListRelationFilter = {
    every?: FlashcardWhereInput
    some?: FlashcardWhereInput
    none?: FlashcardWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type FlashcardOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FlashcardDeckCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    description?: SortOrder
    isPublic?: SortOrder
    userId?: SortOrder
  }

  export type FlashcardDeckMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    description?: SortOrder
    isPublic?: SortOrder
    userId?: SortOrder
  }

  export type FlashcardDeckMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    createdAt?: SortOrder
    description?: SortOrder
    isPublic?: SortOrder
    userId?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FlashcardDeckScalarRelationFilter = {
    is?: FlashcardDeckWhereInput
    isNot?: FlashcardDeckWhereInput
  }

  export type UserFlashcardProgressListRelationFilter = {
    every?: UserFlashcardProgressWhereInput
    some?: UserFlashcardProgressWhereInput
    none?: UserFlashcardProgressWhereInput
  }

  export type UserFlashcardProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FlashcardCountOrderByAggregateInput = {
    id?: SortOrder
    frontContent?: SortOrder
    backContent?: SortOrder
    exampleSentence?: SortOrder
    audioUrl?: SortOrder
    deckId?: SortOrder
  }

  export type FlashcardMaxOrderByAggregateInput = {
    id?: SortOrder
    frontContent?: SortOrder
    backContent?: SortOrder
    exampleSentence?: SortOrder
    audioUrl?: SortOrder
    deckId?: SortOrder
  }

  export type FlashcardMinOrderByAggregateInput = {
    id?: SortOrder
    frontContent?: SortOrder
    backContent?: SortOrder
    exampleSentence?: SortOrder
    audioUrl?: SortOrder
    deckId?: SortOrder
  }

  export type TagScalarRelationFilter = {
    is?: TagWhereInput
    isNot?: TagWhereInput
  }

  export type DeckTagTagIdDeckIdCompoundUniqueInput = {
    tagId: string
    deckId: string
  }

  export type DeckTagCountOrderByAggregateInput = {
    tagId?: SortOrder
    deckId?: SortOrder
  }

  export type DeckTagMaxOrderByAggregateInput = {
    tagId?: SortOrder
    deckId?: SortOrder
  }

  export type DeckTagMinOrderByAggregateInput = {
    tagId?: SortOrder
    deckId?: SortOrder
  }

  export type EnumFlashcardStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FlashcardStatus | EnumFlashcardStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FlashcardStatus[] | ListEnumFlashcardStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FlashcardStatus[] | ListEnumFlashcardStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFlashcardStatusFilter<$PrismaModel> | $Enums.FlashcardStatus
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

  export type FlashcardScalarRelationFilter = {
    is?: FlashcardWhereInput
    isNot?: FlashcardWhereInput
  }

  export type UserFlashcardProgressUserIdFlashcardIdCompoundUniqueInput = {
    userId: string
    flashcardId: string
  }

  export type UserFlashcardProgressCountOrderByAggregateInput = {
    userId?: SortOrder
    flashcardId?: SortOrder
    status?: SortOrder
    nextReviewAt?: SortOrder
    repetitions?: SortOrder
    easeFactor?: SortOrder
    interval?: SortOrder
    learningStep?: SortOrder
  }

  export type UserFlashcardProgressAvgOrderByAggregateInput = {
    repetitions?: SortOrder
    easeFactor?: SortOrder
    interval?: SortOrder
    learningStep?: SortOrder
  }

  export type UserFlashcardProgressMaxOrderByAggregateInput = {
    userId?: SortOrder
    flashcardId?: SortOrder
    status?: SortOrder
    nextReviewAt?: SortOrder
    repetitions?: SortOrder
    easeFactor?: SortOrder
    interval?: SortOrder
    learningStep?: SortOrder
  }

  export type UserFlashcardProgressMinOrderByAggregateInput = {
    userId?: SortOrder
    flashcardId?: SortOrder
    status?: SortOrder
    nextReviewAt?: SortOrder
    repetitions?: SortOrder
    easeFactor?: SortOrder
    interval?: SortOrder
    learningStep?: SortOrder
  }

  export type UserFlashcardProgressSumOrderByAggregateInput = {
    repetitions?: SortOrder
    easeFactor?: SortOrder
    interval?: SortOrder
    learningStep?: SortOrder
  }

  export type EnumFlashcardStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FlashcardStatus | EnumFlashcardStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FlashcardStatus[] | ListEnumFlashcardStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FlashcardStatus[] | ListEnumFlashcardStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFlashcardStatusWithAggregatesFilter<$PrismaModel> | $Enums.FlashcardStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFlashcardStatusFilter<$PrismaModel>
    _max?: NestedEnumFlashcardStatusFilter<$PrismaModel>
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

  export type DeckTagCreateNestedManyWithoutTagInput = {
    create?: XOR<DeckTagCreateWithoutTagInput, DeckTagUncheckedCreateWithoutTagInput> | DeckTagCreateWithoutTagInput[] | DeckTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: DeckTagCreateOrConnectWithoutTagInput | DeckTagCreateOrConnectWithoutTagInput[]
    createMany?: DeckTagCreateManyTagInputEnvelope
    connect?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
  }

  export type DeckTagUncheckedCreateNestedManyWithoutTagInput = {
    create?: XOR<DeckTagCreateWithoutTagInput, DeckTagUncheckedCreateWithoutTagInput> | DeckTagCreateWithoutTagInput[] | DeckTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: DeckTagCreateOrConnectWithoutTagInput | DeckTagCreateOrConnectWithoutTagInput[]
    createMany?: DeckTagCreateManyTagInputEnvelope
    connect?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DeckTagUpdateManyWithoutTagNestedInput = {
    create?: XOR<DeckTagCreateWithoutTagInput, DeckTagUncheckedCreateWithoutTagInput> | DeckTagCreateWithoutTagInput[] | DeckTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: DeckTagCreateOrConnectWithoutTagInput | DeckTagCreateOrConnectWithoutTagInput[]
    upsert?: DeckTagUpsertWithWhereUniqueWithoutTagInput | DeckTagUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: DeckTagCreateManyTagInputEnvelope
    set?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    disconnect?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    delete?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    connect?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    update?: DeckTagUpdateWithWhereUniqueWithoutTagInput | DeckTagUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: DeckTagUpdateManyWithWhereWithoutTagInput | DeckTagUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: DeckTagScalarWhereInput | DeckTagScalarWhereInput[]
  }

  export type DeckTagUncheckedUpdateManyWithoutTagNestedInput = {
    create?: XOR<DeckTagCreateWithoutTagInput, DeckTagUncheckedCreateWithoutTagInput> | DeckTagCreateWithoutTagInput[] | DeckTagUncheckedCreateWithoutTagInput[]
    connectOrCreate?: DeckTagCreateOrConnectWithoutTagInput | DeckTagCreateOrConnectWithoutTagInput[]
    upsert?: DeckTagUpsertWithWhereUniqueWithoutTagInput | DeckTagUpsertWithWhereUniqueWithoutTagInput[]
    createMany?: DeckTagCreateManyTagInputEnvelope
    set?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    disconnect?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    delete?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    connect?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    update?: DeckTagUpdateWithWhereUniqueWithoutTagInput | DeckTagUpdateWithWhereUniqueWithoutTagInput[]
    updateMany?: DeckTagUpdateManyWithWhereWithoutTagInput | DeckTagUpdateManyWithWhereWithoutTagInput[]
    deleteMany?: DeckTagScalarWhereInput | DeckTagScalarWhereInput[]
  }

  export type DeckTagCreateNestedManyWithoutDeckInput = {
    create?: XOR<DeckTagCreateWithoutDeckInput, DeckTagUncheckedCreateWithoutDeckInput> | DeckTagCreateWithoutDeckInput[] | DeckTagUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: DeckTagCreateOrConnectWithoutDeckInput | DeckTagCreateOrConnectWithoutDeckInput[]
    createMany?: DeckTagCreateManyDeckInputEnvelope
    connect?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
  }

  export type FlashcardCreateNestedManyWithoutDeckInput = {
    create?: XOR<FlashcardCreateWithoutDeckInput, FlashcardUncheckedCreateWithoutDeckInput> | FlashcardCreateWithoutDeckInput[] | FlashcardUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutDeckInput | FlashcardCreateOrConnectWithoutDeckInput[]
    createMany?: FlashcardCreateManyDeckInputEnvelope
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
  }

  export type DeckTagUncheckedCreateNestedManyWithoutDeckInput = {
    create?: XOR<DeckTagCreateWithoutDeckInput, DeckTagUncheckedCreateWithoutDeckInput> | DeckTagCreateWithoutDeckInput[] | DeckTagUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: DeckTagCreateOrConnectWithoutDeckInput | DeckTagCreateOrConnectWithoutDeckInput[]
    createMany?: DeckTagCreateManyDeckInputEnvelope
    connect?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
  }

  export type FlashcardUncheckedCreateNestedManyWithoutDeckInput = {
    create?: XOR<FlashcardCreateWithoutDeckInput, FlashcardUncheckedCreateWithoutDeckInput> | FlashcardCreateWithoutDeckInput[] | FlashcardUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutDeckInput | FlashcardCreateOrConnectWithoutDeckInput[]
    createMany?: FlashcardCreateManyDeckInputEnvelope
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DeckTagUpdateManyWithoutDeckNestedInput = {
    create?: XOR<DeckTagCreateWithoutDeckInput, DeckTagUncheckedCreateWithoutDeckInput> | DeckTagCreateWithoutDeckInput[] | DeckTagUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: DeckTagCreateOrConnectWithoutDeckInput | DeckTagCreateOrConnectWithoutDeckInput[]
    upsert?: DeckTagUpsertWithWhereUniqueWithoutDeckInput | DeckTagUpsertWithWhereUniqueWithoutDeckInput[]
    createMany?: DeckTagCreateManyDeckInputEnvelope
    set?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    disconnect?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    delete?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    connect?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    update?: DeckTagUpdateWithWhereUniqueWithoutDeckInput | DeckTagUpdateWithWhereUniqueWithoutDeckInput[]
    updateMany?: DeckTagUpdateManyWithWhereWithoutDeckInput | DeckTagUpdateManyWithWhereWithoutDeckInput[]
    deleteMany?: DeckTagScalarWhereInput | DeckTagScalarWhereInput[]
  }

  export type FlashcardUpdateManyWithoutDeckNestedInput = {
    create?: XOR<FlashcardCreateWithoutDeckInput, FlashcardUncheckedCreateWithoutDeckInput> | FlashcardCreateWithoutDeckInput[] | FlashcardUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutDeckInput | FlashcardCreateOrConnectWithoutDeckInput[]
    upsert?: FlashcardUpsertWithWhereUniqueWithoutDeckInput | FlashcardUpsertWithWhereUniqueWithoutDeckInput[]
    createMany?: FlashcardCreateManyDeckInputEnvelope
    set?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    disconnect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    delete?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    update?: FlashcardUpdateWithWhereUniqueWithoutDeckInput | FlashcardUpdateWithWhereUniqueWithoutDeckInput[]
    updateMany?: FlashcardUpdateManyWithWhereWithoutDeckInput | FlashcardUpdateManyWithWhereWithoutDeckInput[]
    deleteMany?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
  }

  export type DeckTagUncheckedUpdateManyWithoutDeckNestedInput = {
    create?: XOR<DeckTagCreateWithoutDeckInput, DeckTagUncheckedCreateWithoutDeckInput> | DeckTagCreateWithoutDeckInput[] | DeckTagUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: DeckTagCreateOrConnectWithoutDeckInput | DeckTagCreateOrConnectWithoutDeckInput[]
    upsert?: DeckTagUpsertWithWhereUniqueWithoutDeckInput | DeckTagUpsertWithWhereUniqueWithoutDeckInput[]
    createMany?: DeckTagCreateManyDeckInputEnvelope
    set?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    disconnect?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    delete?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    connect?: DeckTagWhereUniqueInput | DeckTagWhereUniqueInput[]
    update?: DeckTagUpdateWithWhereUniqueWithoutDeckInput | DeckTagUpdateWithWhereUniqueWithoutDeckInput[]
    updateMany?: DeckTagUpdateManyWithWhereWithoutDeckInput | DeckTagUpdateManyWithWhereWithoutDeckInput[]
    deleteMany?: DeckTagScalarWhereInput | DeckTagScalarWhereInput[]
  }

  export type FlashcardUncheckedUpdateManyWithoutDeckNestedInput = {
    create?: XOR<FlashcardCreateWithoutDeckInput, FlashcardUncheckedCreateWithoutDeckInput> | FlashcardCreateWithoutDeckInput[] | FlashcardUncheckedCreateWithoutDeckInput[]
    connectOrCreate?: FlashcardCreateOrConnectWithoutDeckInput | FlashcardCreateOrConnectWithoutDeckInput[]
    upsert?: FlashcardUpsertWithWhereUniqueWithoutDeckInput | FlashcardUpsertWithWhereUniqueWithoutDeckInput[]
    createMany?: FlashcardCreateManyDeckInputEnvelope
    set?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    disconnect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    delete?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    connect?: FlashcardWhereUniqueInput | FlashcardWhereUniqueInput[]
    update?: FlashcardUpdateWithWhereUniqueWithoutDeckInput | FlashcardUpdateWithWhereUniqueWithoutDeckInput[]
    updateMany?: FlashcardUpdateManyWithWhereWithoutDeckInput | FlashcardUpdateManyWithWhereWithoutDeckInput[]
    deleteMany?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
  }

  export type FlashcardDeckCreateNestedOneWithoutFlashcardsInput = {
    create?: XOR<FlashcardDeckCreateWithoutFlashcardsInput, FlashcardDeckUncheckedCreateWithoutFlashcardsInput>
    connectOrCreate?: FlashcardDeckCreateOrConnectWithoutFlashcardsInput
    connect?: FlashcardDeckWhereUniqueInput
  }

  export type UserFlashcardProgressCreateNestedManyWithoutFlashcardInput = {
    create?: XOR<UserFlashcardProgressCreateWithoutFlashcardInput, UserFlashcardProgressUncheckedCreateWithoutFlashcardInput> | UserFlashcardProgressCreateWithoutFlashcardInput[] | UserFlashcardProgressUncheckedCreateWithoutFlashcardInput[]
    connectOrCreate?: UserFlashcardProgressCreateOrConnectWithoutFlashcardInput | UserFlashcardProgressCreateOrConnectWithoutFlashcardInput[]
    createMany?: UserFlashcardProgressCreateManyFlashcardInputEnvelope
    connect?: UserFlashcardProgressWhereUniqueInput | UserFlashcardProgressWhereUniqueInput[]
  }

  export type UserFlashcardProgressUncheckedCreateNestedManyWithoutFlashcardInput = {
    create?: XOR<UserFlashcardProgressCreateWithoutFlashcardInput, UserFlashcardProgressUncheckedCreateWithoutFlashcardInput> | UserFlashcardProgressCreateWithoutFlashcardInput[] | UserFlashcardProgressUncheckedCreateWithoutFlashcardInput[]
    connectOrCreate?: UserFlashcardProgressCreateOrConnectWithoutFlashcardInput | UserFlashcardProgressCreateOrConnectWithoutFlashcardInput[]
    createMany?: UserFlashcardProgressCreateManyFlashcardInputEnvelope
    connect?: UserFlashcardProgressWhereUniqueInput | UserFlashcardProgressWhereUniqueInput[]
  }

  export type FlashcardDeckUpdateOneRequiredWithoutFlashcardsNestedInput = {
    create?: XOR<FlashcardDeckCreateWithoutFlashcardsInput, FlashcardDeckUncheckedCreateWithoutFlashcardsInput>
    connectOrCreate?: FlashcardDeckCreateOrConnectWithoutFlashcardsInput
    upsert?: FlashcardDeckUpsertWithoutFlashcardsInput
    connect?: FlashcardDeckWhereUniqueInput
    update?: XOR<XOR<FlashcardDeckUpdateToOneWithWhereWithoutFlashcardsInput, FlashcardDeckUpdateWithoutFlashcardsInput>, FlashcardDeckUncheckedUpdateWithoutFlashcardsInput>
  }

  export type UserFlashcardProgressUpdateManyWithoutFlashcardNestedInput = {
    create?: XOR<UserFlashcardProgressCreateWithoutFlashcardInput, UserFlashcardProgressUncheckedCreateWithoutFlashcardInput> | UserFlashcardProgressCreateWithoutFlashcardInput[] | UserFlashcardProgressUncheckedCreateWithoutFlashcardInput[]
    connectOrCreate?: UserFlashcardProgressCreateOrConnectWithoutFlashcardInput | UserFlashcardProgressCreateOrConnectWithoutFlashcardInput[]
    upsert?: UserFlashcardProgressUpsertWithWhereUniqueWithoutFlashcardInput | UserFlashcardProgressUpsertWithWhereUniqueWithoutFlashcardInput[]
    createMany?: UserFlashcardProgressCreateManyFlashcardInputEnvelope
    set?: UserFlashcardProgressWhereUniqueInput | UserFlashcardProgressWhereUniqueInput[]
    disconnect?: UserFlashcardProgressWhereUniqueInput | UserFlashcardProgressWhereUniqueInput[]
    delete?: UserFlashcardProgressWhereUniqueInput | UserFlashcardProgressWhereUniqueInput[]
    connect?: UserFlashcardProgressWhereUniqueInput | UserFlashcardProgressWhereUniqueInput[]
    update?: UserFlashcardProgressUpdateWithWhereUniqueWithoutFlashcardInput | UserFlashcardProgressUpdateWithWhereUniqueWithoutFlashcardInput[]
    updateMany?: UserFlashcardProgressUpdateManyWithWhereWithoutFlashcardInput | UserFlashcardProgressUpdateManyWithWhereWithoutFlashcardInput[]
    deleteMany?: UserFlashcardProgressScalarWhereInput | UserFlashcardProgressScalarWhereInput[]
  }

  export type UserFlashcardProgressUncheckedUpdateManyWithoutFlashcardNestedInput = {
    create?: XOR<UserFlashcardProgressCreateWithoutFlashcardInput, UserFlashcardProgressUncheckedCreateWithoutFlashcardInput> | UserFlashcardProgressCreateWithoutFlashcardInput[] | UserFlashcardProgressUncheckedCreateWithoutFlashcardInput[]
    connectOrCreate?: UserFlashcardProgressCreateOrConnectWithoutFlashcardInput | UserFlashcardProgressCreateOrConnectWithoutFlashcardInput[]
    upsert?: UserFlashcardProgressUpsertWithWhereUniqueWithoutFlashcardInput | UserFlashcardProgressUpsertWithWhereUniqueWithoutFlashcardInput[]
    createMany?: UserFlashcardProgressCreateManyFlashcardInputEnvelope
    set?: UserFlashcardProgressWhereUniqueInput | UserFlashcardProgressWhereUniqueInput[]
    disconnect?: UserFlashcardProgressWhereUniqueInput | UserFlashcardProgressWhereUniqueInput[]
    delete?: UserFlashcardProgressWhereUniqueInput | UserFlashcardProgressWhereUniqueInput[]
    connect?: UserFlashcardProgressWhereUniqueInput | UserFlashcardProgressWhereUniqueInput[]
    update?: UserFlashcardProgressUpdateWithWhereUniqueWithoutFlashcardInput | UserFlashcardProgressUpdateWithWhereUniqueWithoutFlashcardInput[]
    updateMany?: UserFlashcardProgressUpdateManyWithWhereWithoutFlashcardInput | UserFlashcardProgressUpdateManyWithWhereWithoutFlashcardInput[]
    deleteMany?: UserFlashcardProgressScalarWhereInput | UserFlashcardProgressScalarWhereInput[]
  }

  export type FlashcardDeckCreateNestedOneWithoutDeckTagsInput = {
    create?: XOR<FlashcardDeckCreateWithoutDeckTagsInput, FlashcardDeckUncheckedCreateWithoutDeckTagsInput>
    connectOrCreate?: FlashcardDeckCreateOrConnectWithoutDeckTagsInput
    connect?: FlashcardDeckWhereUniqueInput
  }

  export type TagCreateNestedOneWithoutDeckTagsInput = {
    create?: XOR<TagCreateWithoutDeckTagsInput, TagUncheckedCreateWithoutDeckTagsInput>
    connectOrCreate?: TagCreateOrConnectWithoutDeckTagsInput
    connect?: TagWhereUniqueInput
  }

  export type FlashcardDeckUpdateOneRequiredWithoutDeckTagsNestedInput = {
    create?: XOR<FlashcardDeckCreateWithoutDeckTagsInput, FlashcardDeckUncheckedCreateWithoutDeckTagsInput>
    connectOrCreate?: FlashcardDeckCreateOrConnectWithoutDeckTagsInput
    upsert?: FlashcardDeckUpsertWithoutDeckTagsInput
    connect?: FlashcardDeckWhereUniqueInput
    update?: XOR<XOR<FlashcardDeckUpdateToOneWithWhereWithoutDeckTagsInput, FlashcardDeckUpdateWithoutDeckTagsInput>, FlashcardDeckUncheckedUpdateWithoutDeckTagsInput>
  }

  export type TagUpdateOneRequiredWithoutDeckTagsNestedInput = {
    create?: XOR<TagCreateWithoutDeckTagsInput, TagUncheckedCreateWithoutDeckTagsInput>
    connectOrCreate?: TagCreateOrConnectWithoutDeckTagsInput
    upsert?: TagUpsertWithoutDeckTagsInput
    connect?: TagWhereUniqueInput
    update?: XOR<XOR<TagUpdateToOneWithWhereWithoutDeckTagsInput, TagUpdateWithoutDeckTagsInput>, TagUncheckedUpdateWithoutDeckTagsInput>
  }

  export type FlashcardCreateNestedOneWithoutUserProgressInput = {
    create?: XOR<FlashcardCreateWithoutUserProgressInput, FlashcardUncheckedCreateWithoutUserProgressInput>
    connectOrCreate?: FlashcardCreateOrConnectWithoutUserProgressInput
    connect?: FlashcardWhereUniqueInput
  }

  export type EnumFlashcardStatusFieldUpdateOperationsInput = {
    set?: $Enums.FlashcardStatus
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

  export type FlashcardUpdateOneRequiredWithoutUserProgressNestedInput = {
    create?: XOR<FlashcardCreateWithoutUserProgressInput, FlashcardUncheckedCreateWithoutUserProgressInput>
    connectOrCreate?: FlashcardCreateOrConnectWithoutUserProgressInput
    upsert?: FlashcardUpsertWithoutUserProgressInput
    connect?: FlashcardWhereUniqueInput
    update?: XOR<XOR<FlashcardUpdateToOneWithWhereWithoutUserProgressInput, FlashcardUpdateWithoutUserProgressInput>, FlashcardUncheckedUpdateWithoutUserProgressInput>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumFlashcardStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FlashcardStatus | EnumFlashcardStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FlashcardStatus[] | ListEnumFlashcardStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FlashcardStatus[] | ListEnumFlashcardStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFlashcardStatusFilter<$PrismaModel> | $Enums.FlashcardStatus
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

  export type NestedEnumFlashcardStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FlashcardStatus | EnumFlashcardStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FlashcardStatus[] | ListEnumFlashcardStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FlashcardStatus[] | ListEnumFlashcardStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFlashcardStatusWithAggregatesFilter<$PrismaModel> | $Enums.FlashcardStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFlashcardStatusFilter<$PrismaModel>
    _max?: NestedEnumFlashcardStatusFilter<$PrismaModel>
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

  export type DeckTagCreateWithoutTagInput = {
    deck: FlashcardDeckCreateNestedOneWithoutDeckTagsInput
  }

  export type DeckTagUncheckedCreateWithoutTagInput = {
    deckId: string
  }

  export type DeckTagCreateOrConnectWithoutTagInput = {
    where: DeckTagWhereUniqueInput
    create: XOR<DeckTagCreateWithoutTagInput, DeckTagUncheckedCreateWithoutTagInput>
  }

  export type DeckTagCreateManyTagInputEnvelope = {
    data: DeckTagCreateManyTagInput | DeckTagCreateManyTagInput[]
    skipDuplicates?: boolean
  }

  export type DeckTagUpsertWithWhereUniqueWithoutTagInput = {
    where: DeckTagWhereUniqueInput
    update: XOR<DeckTagUpdateWithoutTagInput, DeckTagUncheckedUpdateWithoutTagInput>
    create: XOR<DeckTagCreateWithoutTagInput, DeckTagUncheckedCreateWithoutTagInput>
  }

  export type DeckTagUpdateWithWhereUniqueWithoutTagInput = {
    where: DeckTagWhereUniqueInput
    data: XOR<DeckTagUpdateWithoutTagInput, DeckTagUncheckedUpdateWithoutTagInput>
  }

  export type DeckTagUpdateManyWithWhereWithoutTagInput = {
    where: DeckTagScalarWhereInput
    data: XOR<DeckTagUpdateManyMutationInput, DeckTagUncheckedUpdateManyWithoutTagInput>
  }

  export type DeckTagScalarWhereInput = {
    AND?: DeckTagScalarWhereInput | DeckTagScalarWhereInput[]
    OR?: DeckTagScalarWhereInput[]
    NOT?: DeckTagScalarWhereInput | DeckTagScalarWhereInput[]
    tagId?: UuidFilter<"DeckTag"> | string
    deckId?: UuidFilter<"DeckTag"> | string
  }

  export type DeckTagCreateWithoutDeckInput = {
    tag: TagCreateNestedOneWithoutDeckTagsInput
  }

  export type DeckTagUncheckedCreateWithoutDeckInput = {
    tagId: string
  }

  export type DeckTagCreateOrConnectWithoutDeckInput = {
    where: DeckTagWhereUniqueInput
    create: XOR<DeckTagCreateWithoutDeckInput, DeckTagUncheckedCreateWithoutDeckInput>
  }

  export type DeckTagCreateManyDeckInputEnvelope = {
    data: DeckTagCreateManyDeckInput | DeckTagCreateManyDeckInput[]
    skipDuplicates?: boolean
  }

  export type FlashcardCreateWithoutDeckInput = {
    id?: string
    frontContent: string
    backContent: string
    exampleSentence?: string | null
    audioUrl?: string | null
    userProgress?: UserFlashcardProgressCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardUncheckedCreateWithoutDeckInput = {
    id?: string
    frontContent: string
    backContent: string
    exampleSentence?: string | null
    audioUrl?: string | null
    userProgress?: UserFlashcardProgressUncheckedCreateNestedManyWithoutFlashcardInput
  }

  export type FlashcardCreateOrConnectWithoutDeckInput = {
    where: FlashcardWhereUniqueInput
    create: XOR<FlashcardCreateWithoutDeckInput, FlashcardUncheckedCreateWithoutDeckInput>
  }

  export type FlashcardCreateManyDeckInputEnvelope = {
    data: FlashcardCreateManyDeckInput | FlashcardCreateManyDeckInput[]
    skipDuplicates?: boolean
  }

  export type DeckTagUpsertWithWhereUniqueWithoutDeckInput = {
    where: DeckTagWhereUniqueInput
    update: XOR<DeckTagUpdateWithoutDeckInput, DeckTagUncheckedUpdateWithoutDeckInput>
    create: XOR<DeckTagCreateWithoutDeckInput, DeckTagUncheckedCreateWithoutDeckInput>
  }

  export type DeckTagUpdateWithWhereUniqueWithoutDeckInput = {
    where: DeckTagWhereUniqueInput
    data: XOR<DeckTagUpdateWithoutDeckInput, DeckTagUncheckedUpdateWithoutDeckInput>
  }

  export type DeckTagUpdateManyWithWhereWithoutDeckInput = {
    where: DeckTagScalarWhereInput
    data: XOR<DeckTagUpdateManyMutationInput, DeckTagUncheckedUpdateManyWithoutDeckInput>
  }

  export type FlashcardUpsertWithWhereUniqueWithoutDeckInput = {
    where: FlashcardWhereUniqueInput
    update: XOR<FlashcardUpdateWithoutDeckInput, FlashcardUncheckedUpdateWithoutDeckInput>
    create: XOR<FlashcardCreateWithoutDeckInput, FlashcardUncheckedCreateWithoutDeckInput>
  }

  export type FlashcardUpdateWithWhereUniqueWithoutDeckInput = {
    where: FlashcardWhereUniqueInput
    data: XOR<FlashcardUpdateWithoutDeckInput, FlashcardUncheckedUpdateWithoutDeckInput>
  }

  export type FlashcardUpdateManyWithWhereWithoutDeckInput = {
    where: FlashcardScalarWhereInput
    data: XOR<FlashcardUpdateManyMutationInput, FlashcardUncheckedUpdateManyWithoutDeckInput>
  }

  export type FlashcardScalarWhereInput = {
    AND?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
    OR?: FlashcardScalarWhereInput[]
    NOT?: FlashcardScalarWhereInput | FlashcardScalarWhereInput[]
    id?: UuidFilter<"Flashcard"> | string
    frontContent?: StringFilter<"Flashcard"> | string
    backContent?: StringFilter<"Flashcard"> | string
    exampleSentence?: StringNullableFilter<"Flashcard"> | string | null
    audioUrl?: StringNullableFilter<"Flashcard"> | string | null
    deckId?: UuidFilter<"Flashcard"> | string
  }

  export type FlashcardDeckCreateWithoutFlashcardsInput = {
    id?: string
    title: string
    createdAt?: Date | string
    description?: string | null
    isPublic?: boolean
    userId: string
    deckTags?: DeckTagCreateNestedManyWithoutDeckInput
  }

  export type FlashcardDeckUncheckedCreateWithoutFlashcardsInput = {
    id?: string
    title: string
    createdAt?: Date | string
    description?: string | null
    isPublic?: boolean
    userId: string
    deckTags?: DeckTagUncheckedCreateNestedManyWithoutDeckInput
  }

  export type FlashcardDeckCreateOrConnectWithoutFlashcardsInput = {
    where: FlashcardDeckWhereUniqueInput
    create: XOR<FlashcardDeckCreateWithoutFlashcardsInput, FlashcardDeckUncheckedCreateWithoutFlashcardsInput>
  }

  export type UserFlashcardProgressCreateWithoutFlashcardInput = {
    userId: string
    status?: $Enums.FlashcardStatus
    nextReviewAt?: Date | string
    repetitions?: number
    easeFactor?: number
    interval?: number
    learningStep?: number
  }

  export type UserFlashcardProgressUncheckedCreateWithoutFlashcardInput = {
    userId: string
    status?: $Enums.FlashcardStatus
    nextReviewAt?: Date | string
    repetitions?: number
    easeFactor?: number
    interval?: number
    learningStep?: number
  }

  export type UserFlashcardProgressCreateOrConnectWithoutFlashcardInput = {
    where: UserFlashcardProgressWhereUniqueInput
    create: XOR<UserFlashcardProgressCreateWithoutFlashcardInput, UserFlashcardProgressUncheckedCreateWithoutFlashcardInput>
  }

  export type UserFlashcardProgressCreateManyFlashcardInputEnvelope = {
    data: UserFlashcardProgressCreateManyFlashcardInput | UserFlashcardProgressCreateManyFlashcardInput[]
    skipDuplicates?: boolean
  }

  export type FlashcardDeckUpsertWithoutFlashcardsInput = {
    update: XOR<FlashcardDeckUpdateWithoutFlashcardsInput, FlashcardDeckUncheckedUpdateWithoutFlashcardsInput>
    create: XOR<FlashcardDeckCreateWithoutFlashcardsInput, FlashcardDeckUncheckedCreateWithoutFlashcardsInput>
    where?: FlashcardDeckWhereInput
  }

  export type FlashcardDeckUpdateToOneWithWhereWithoutFlashcardsInput = {
    where?: FlashcardDeckWhereInput
    data: XOR<FlashcardDeckUpdateWithoutFlashcardsInput, FlashcardDeckUncheckedUpdateWithoutFlashcardsInput>
  }

  export type FlashcardDeckUpdateWithoutFlashcardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
    deckTags?: DeckTagUpdateManyWithoutDeckNestedInput
  }

  export type FlashcardDeckUncheckedUpdateWithoutFlashcardsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
    deckTags?: DeckTagUncheckedUpdateManyWithoutDeckNestedInput
  }

  export type UserFlashcardProgressUpsertWithWhereUniqueWithoutFlashcardInput = {
    where: UserFlashcardProgressWhereUniqueInput
    update: XOR<UserFlashcardProgressUpdateWithoutFlashcardInput, UserFlashcardProgressUncheckedUpdateWithoutFlashcardInput>
    create: XOR<UserFlashcardProgressCreateWithoutFlashcardInput, UserFlashcardProgressUncheckedCreateWithoutFlashcardInput>
  }

  export type UserFlashcardProgressUpdateWithWhereUniqueWithoutFlashcardInput = {
    where: UserFlashcardProgressWhereUniqueInput
    data: XOR<UserFlashcardProgressUpdateWithoutFlashcardInput, UserFlashcardProgressUncheckedUpdateWithoutFlashcardInput>
  }

  export type UserFlashcardProgressUpdateManyWithWhereWithoutFlashcardInput = {
    where: UserFlashcardProgressScalarWhereInput
    data: XOR<UserFlashcardProgressUpdateManyMutationInput, UserFlashcardProgressUncheckedUpdateManyWithoutFlashcardInput>
  }

  export type UserFlashcardProgressScalarWhereInput = {
    AND?: UserFlashcardProgressScalarWhereInput | UserFlashcardProgressScalarWhereInput[]
    OR?: UserFlashcardProgressScalarWhereInput[]
    NOT?: UserFlashcardProgressScalarWhereInput | UserFlashcardProgressScalarWhereInput[]
    userId?: UuidFilter<"UserFlashcardProgress"> | string
    flashcardId?: UuidFilter<"UserFlashcardProgress"> | string
    status?: EnumFlashcardStatusFilter<"UserFlashcardProgress"> | $Enums.FlashcardStatus
    nextReviewAt?: DateTimeFilter<"UserFlashcardProgress"> | Date | string
    repetitions?: IntFilter<"UserFlashcardProgress"> | number
    easeFactor?: FloatFilter<"UserFlashcardProgress"> | number
    interval?: IntFilter<"UserFlashcardProgress"> | number
    learningStep?: IntFilter<"UserFlashcardProgress"> | number
  }

  export type FlashcardDeckCreateWithoutDeckTagsInput = {
    id?: string
    title: string
    createdAt?: Date | string
    description?: string | null
    isPublic?: boolean
    userId: string
    flashcards?: FlashcardCreateNestedManyWithoutDeckInput
  }

  export type FlashcardDeckUncheckedCreateWithoutDeckTagsInput = {
    id?: string
    title: string
    createdAt?: Date | string
    description?: string | null
    isPublic?: boolean
    userId: string
    flashcards?: FlashcardUncheckedCreateNestedManyWithoutDeckInput
  }

  export type FlashcardDeckCreateOrConnectWithoutDeckTagsInput = {
    where: FlashcardDeckWhereUniqueInput
    create: XOR<FlashcardDeckCreateWithoutDeckTagsInput, FlashcardDeckUncheckedCreateWithoutDeckTagsInput>
  }

  export type TagCreateWithoutDeckTagsInput = {
    id?: string
    name: string
  }

  export type TagUncheckedCreateWithoutDeckTagsInput = {
    id?: string
    name: string
  }

  export type TagCreateOrConnectWithoutDeckTagsInput = {
    where: TagWhereUniqueInput
    create: XOR<TagCreateWithoutDeckTagsInput, TagUncheckedCreateWithoutDeckTagsInput>
  }

  export type FlashcardDeckUpsertWithoutDeckTagsInput = {
    update: XOR<FlashcardDeckUpdateWithoutDeckTagsInput, FlashcardDeckUncheckedUpdateWithoutDeckTagsInput>
    create: XOR<FlashcardDeckCreateWithoutDeckTagsInput, FlashcardDeckUncheckedCreateWithoutDeckTagsInput>
    where?: FlashcardDeckWhereInput
  }

  export type FlashcardDeckUpdateToOneWithWhereWithoutDeckTagsInput = {
    where?: FlashcardDeckWhereInput
    data: XOR<FlashcardDeckUpdateWithoutDeckTagsInput, FlashcardDeckUncheckedUpdateWithoutDeckTagsInput>
  }

  export type FlashcardDeckUpdateWithoutDeckTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
    flashcards?: FlashcardUpdateManyWithoutDeckNestedInput
  }

  export type FlashcardDeckUncheckedUpdateWithoutDeckTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isPublic?: BoolFieldUpdateOperationsInput | boolean
    userId?: StringFieldUpdateOperationsInput | string
    flashcards?: FlashcardUncheckedUpdateManyWithoutDeckNestedInput
  }

  export type TagUpsertWithoutDeckTagsInput = {
    update: XOR<TagUpdateWithoutDeckTagsInput, TagUncheckedUpdateWithoutDeckTagsInput>
    create: XOR<TagCreateWithoutDeckTagsInput, TagUncheckedCreateWithoutDeckTagsInput>
    where?: TagWhereInput
  }

  export type TagUpdateToOneWithWhereWithoutDeckTagsInput = {
    where?: TagWhereInput
    data: XOR<TagUpdateWithoutDeckTagsInput, TagUncheckedUpdateWithoutDeckTagsInput>
  }

  export type TagUpdateWithoutDeckTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type TagUncheckedUpdateWithoutDeckTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type FlashcardCreateWithoutUserProgressInput = {
    id?: string
    frontContent: string
    backContent: string
    exampleSentence?: string | null
    audioUrl?: string | null
    deck: FlashcardDeckCreateNestedOneWithoutFlashcardsInput
  }

  export type FlashcardUncheckedCreateWithoutUserProgressInput = {
    id?: string
    frontContent: string
    backContent: string
    exampleSentence?: string | null
    audioUrl?: string | null
    deckId: string
  }

  export type FlashcardCreateOrConnectWithoutUserProgressInput = {
    where: FlashcardWhereUniqueInput
    create: XOR<FlashcardCreateWithoutUserProgressInput, FlashcardUncheckedCreateWithoutUserProgressInput>
  }

  export type FlashcardUpsertWithoutUserProgressInput = {
    update: XOR<FlashcardUpdateWithoutUserProgressInput, FlashcardUncheckedUpdateWithoutUserProgressInput>
    create: XOR<FlashcardCreateWithoutUserProgressInput, FlashcardUncheckedCreateWithoutUserProgressInput>
    where?: FlashcardWhereInput
  }

  export type FlashcardUpdateToOneWithWhereWithoutUserProgressInput = {
    where?: FlashcardWhereInput
    data: XOR<FlashcardUpdateWithoutUserProgressInput, FlashcardUncheckedUpdateWithoutUserProgressInput>
  }

  export type FlashcardUpdateWithoutUserProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    frontContent?: StringFieldUpdateOperationsInput | string
    backContent?: StringFieldUpdateOperationsInput | string
    exampleSentence?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deck?: FlashcardDeckUpdateOneRequiredWithoutFlashcardsNestedInput
  }

  export type FlashcardUncheckedUpdateWithoutUserProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    frontContent?: StringFieldUpdateOperationsInput | string
    backContent?: StringFieldUpdateOperationsInput | string
    exampleSentence?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deckId?: StringFieldUpdateOperationsInput | string
  }

  export type DeckTagCreateManyTagInput = {
    deckId: string
  }

  export type DeckTagUpdateWithoutTagInput = {
    deck?: FlashcardDeckUpdateOneRequiredWithoutDeckTagsNestedInput
  }

  export type DeckTagUncheckedUpdateWithoutTagInput = {
    deckId?: StringFieldUpdateOperationsInput | string
  }

  export type DeckTagUncheckedUpdateManyWithoutTagInput = {
    deckId?: StringFieldUpdateOperationsInput | string
  }

  export type DeckTagCreateManyDeckInput = {
    tagId: string
  }

  export type FlashcardCreateManyDeckInput = {
    id?: string
    frontContent: string
    backContent: string
    exampleSentence?: string | null
    audioUrl?: string | null
  }

  export type DeckTagUpdateWithoutDeckInput = {
    tag?: TagUpdateOneRequiredWithoutDeckTagsNestedInput
  }

  export type DeckTagUncheckedUpdateWithoutDeckInput = {
    tagId?: StringFieldUpdateOperationsInput | string
  }

  export type DeckTagUncheckedUpdateManyWithoutDeckInput = {
    tagId?: StringFieldUpdateOperationsInput | string
  }

  export type FlashcardUpdateWithoutDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    frontContent?: StringFieldUpdateOperationsInput | string
    backContent?: StringFieldUpdateOperationsInput | string
    exampleSentence?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    userProgress?: UserFlashcardProgressUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardUncheckedUpdateWithoutDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    frontContent?: StringFieldUpdateOperationsInput | string
    backContent?: StringFieldUpdateOperationsInput | string
    exampleSentence?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
    userProgress?: UserFlashcardProgressUncheckedUpdateManyWithoutFlashcardNestedInput
  }

  export type FlashcardUncheckedUpdateManyWithoutDeckInput = {
    id?: StringFieldUpdateOperationsInput | string
    frontContent?: StringFieldUpdateOperationsInput | string
    backContent?: StringFieldUpdateOperationsInput | string
    exampleSentence?: NullableStringFieldUpdateOperationsInput | string | null
    audioUrl?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserFlashcardProgressCreateManyFlashcardInput = {
    userId: string
    status?: $Enums.FlashcardStatus
    nextReviewAt?: Date | string
    repetitions?: number
    easeFactor?: number
    interval?: number
    learningStep?: number
  }

  export type UserFlashcardProgressUpdateWithoutFlashcardInput = {
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumFlashcardStatusFieldUpdateOperationsInput | $Enums.FlashcardStatus
    nextReviewAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repetitions?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    interval?: IntFieldUpdateOperationsInput | number
    learningStep?: IntFieldUpdateOperationsInput | number
  }

  export type UserFlashcardProgressUncheckedUpdateWithoutFlashcardInput = {
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumFlashcardStatusFieldUpdateOperationsInput | $Enums.FlashcardStatus
    nextReviewAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repetitions?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    interval?: IntFieldUpdateOperationsInput | number
    learningStep?: IntFieldUpdateOperationsInput | number
  }

  export type UserFlashcardProgressUncheckedUpdateManyWithoutFlashcardInput = {
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumFlashcardStatusFieldUpdateOperationsInput | $Enums.FlashcardStatus
    nextReviewAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repetitions?: IntFieldUpdateOperationsInput | number
    easeFactor?: FloatFieldUpdateOperationsInput | number
    interval?: IntFieldUpdateOperationsInput | number
    learningStep?: IntFieldUpdateOperationsInput | number
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