
/**
 * Client
**/

import * as runtime from './runtime/client.js';
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
 * Model Profile
 * 
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>
/**
 * Model Settings
 * 
 */
export type Settings = $Result.DefaultSelection<Prisma.$SettingsPayload>
/**
 * Model MissionProgress
 * 
 */
export type MissionProgress = $Result.DefaultSelection<Prisma.$MissionProgressPayload>
/**
 * Model ScoreEntry
 * 
 */
export type ScoreEntry = $Result.DefaultSelection<Prisma.$ScoreEntryPayload>
/**
 * Model UnlockedCharacter
 * 
 */
export type UnlockedCharacter = $Result.DefaultSelection<Prisma.$UnlockedCharacterPayload>
/**
 * Model GameRun
 * 
 */
export type GameRun = $Result.DefaultSelection<Prisma.$GameRunPayload>
/**
 * Model RefreshToken
 * 
 */
export type RefreshToken = $Result.DefaultSelection<Prisma.$RefreshTokenPayload>
/**
 * Model EmailVerificationToken
 * 
 */
export type EmailVerificationToken = $Result.DefaultSelection<Prisma.$EmailVerificationTokenPayload>
/**
 * Model PasswordResetToken
 * 
 */
export type PasswordResetToken = $Result.DefaultSelection<Prisma.$PasswordResetTokenPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const AuthRole: {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUPPORT: 'SUPPORT'
};

export type AuthRole = (typeof AuthRole)[keyof typeof AuthRole]


export const MissionStatus: {
  locked: 'locked',
  unlocked: 'unlocked',
  in_progress: 'in_progress',
  completed: 'completed'
};

export type MissionStatus = (typeof MissionStatus)[keyof typeof MissionStatus]


export const Difficulty: {
  squire: 'squire',
  knight: 'knight',
  champion: 'champion'
};

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty]


export const MissionRank: {
  S: 'S',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D'
};

export type MissionRank = (typeof MissionRank)[keyof typeof MissionRank]


export const GameRunStatus: {
  started: 'started',
  completed: 'completed',
  defeated: 'defeated',
  rejected: 'rejected'
};

export type GameRunStatus = (typeof GameRunStatus)[keyof typeof GameRunStatus]

}

export type AuthRole = $Enums.AuthRole

export const AuthRole: typeof $Enums.AuthRole

export type MissionStatus = $Enums.MissionStatus

export const MissionStatus: typeof $Enums.MissionStatus

export type Difficulty = $Enums.Difficulty

export const Difficulty: typeof $Enums.Difficulty

export type MissionRank = $Enums.MissionRank

export const MissionRank: typeof $Enums.MissionRank

export type GameRunStatus = $Enums.GameRunStatus

export const GameRunStatus: typeof $Enums.GameRunStatus

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
 * Read more in our [docs](https://pris.ly/d/client).
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
   * Read more in our [docs](https://pris.ly/d/client).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profile.findMany()
    * ```
    */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.settings`: Exposes CRUD operations for the **Settings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Settings
    * const settings = await prisma.settings.findMany()
    * ```
    */
  get settings(): Prisma.SettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.missionProgress`: Exposes CRUD operations for the **MissionProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MissionProgresses
    * const missionProgresses = await prisma.missionProgress.findMany()
    * ```
    */
  get missionProgress(): Prisma.MissionProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.scoreEntry`: Exposes CRUD operations for the **ScoreEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ScoreEntries
    * const scoreEntries = await prisma.scoreEntry.findMany()
    * ```
    */
  get scoreEntry(): Prisma.ScoreEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.unlockedCharacter`: Exposes CRUD operations for the **UnlockedCharacter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UnlockedCharacters
    * const unlockedCharacters = await prisma.unlockedCharacter.findMany()
    * ```
    */
  get unlockedCharacter(): Prisma.UnlockedCharacterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameRun`: Exposes CRUD operations for the **GameRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameRuns
    * const gameRuns = await prisma.gameRun.findMany()
    * ```
    */
  get gameRun(): Prisma.GameRunDelegate<ExtArgs, ClientOptions>;

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
   * `prisma.emailVerificationToken`: Exposes CRUD operations for the **EmailVerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EmailVerificationTokens
    * const emailVerificationTokens = await prisma.emailVerificationToken.findMany()
    * ```
    */
  get emailVerificationToken(): Prisma.EmailVerificationTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passwordResetToken`: Exposes CRUD operations for the **PasswordResetToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResetTokens
    * const passwordResetTokens = await prisma.passwordResetToken.findMany()
    * ```
    */
  get passwordResetToken(): Prisma.PasswordResetTokenDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
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
    Profile: 'Profile',
    Settings: 'Settings',
    MissionProgress: 'MissionProgress',
    ScoreEntry: 'ScoreEntry',
    UnlockedCharacter: 'UnlockedCharacter',
    GameRun: 'GameRun',
    RefreshToken: 'RefreshToken',
    EmailVerificationToken: 'EmailVerificationToken',
    PasswordResetToken: 'PasswordResetToken'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "profile" | "settings" | "missionProgress" | "scoreEntry" | "unlockedCharacter" | "gameRun" | "refreshToken" | "emailVerificationToken" | "passwordResetToken"
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
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>
        fields: Prisma.ProfileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[]
          }
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>
          }
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfile>
          }
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfileGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number
          }
        }
      }
      Settings: {
        payload: Prisma.$SettingsPayload<ExtArgs>
        fields: Prisma.SettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          findFirst: {
            args: Prisma.SettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          findMany: {
            args: Prisma.SettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>[]
          }
          create: {
            args: Prisma.SettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          createMany: {
            args: Prisma.SettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>[]
          }
          delete: {
            args: Prisma.SettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          update: {
            args: Prisma.SettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          deleteMany: {
            args: Prisma.SettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>[]
          }
          upsert: {
            args: Prisma.SettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingsPayload>
          }
          aggregate: {
            args: Prisma.SettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSettings>
          }
          groupBy: {
            args: Prisma.SettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettingsCountArgs<ExtArgs>
            result: $Utils.Optional<SettingsCountAggregateOutputType> | number
          }
        }
      }
      MissionProgress: {
        payload: Prisma.$MissionProgressPayload<ExtArgs>
        fields: Prisma.MissionProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MissionProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MissionProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionProgressPayload>
          }
          findFirst: {
            args: Prisma.MissionProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MissionProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionProgressPayload>
          }
          findMany: {
            args: Prisma.MissionProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionProgressPayload>[]
          }
          create: {
            args: Prisma.MissionProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionProgressPayload>
          }
          createMany: {
            args: Prisma.MissionProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MissionProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionProgressPayload>[]
          }
          delete: {
            args: Prisma.MissionProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionProgressPayload>
          }
          update: {
            args: Prisma.MissionProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionProgressPayload>
          }
          deleteMany: {
            args: Prisma.MissionProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MissionProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MissionProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionProgressPayload>[]
          }
          upsert: {
            args: Prisma.MissionProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MissionProgressPayload>
          }
          aggregate: {
            args: Prisma.MissionProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMissionProgress>
          }
          groupBy: {
            args: Prisma.MissionProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<MissionProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.MissionProgressCountArgs<ExtArgs>
            result: $Utils.Optional<MissionProgressCountAggregateOutputType> | number
          }
        }
      }
      ScoreEntry: {
        payload: Prisma.$ScoreEntryPayload<ExtArgs>
        fields: Prisma.ScoreEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScoreEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScoreEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreEntryPayload>
          }
          findFirst: {
            args: Prisma.ScoreEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScoreEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreEntryPayload>
          }
          findMany: {
            args: Prisma.ScoreEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreEntryPayload>[]
          }
          create: {
            args: Prisma.ScoreEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreEntryPayload>
          }
          createMany: {
            args: Prisma.ScoreEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScoreEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreEntryPayload>[]
          }
          delete: {
            args: Prisma.ScoreEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreEntryPayload>
          }
          update: {
            args: Prisma.ScoreEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreEntryPayload>
          }
          deleteMany: {
            args: Prisma.ScoreEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScoreEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScoreEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreEntryPayload>[]
          }
          upsert: {
            args: Prisma.ScoreEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ScoreEntryPayload>
          }
          aggregate: {
            args: Prisma.ScoreEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateScoreEntry>
          }
          groupBy: {
            args: Prisma.ScoreEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScoreEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScoreEntryCountArgs<ExtArgs>
            result: $Utils.Optional<ScoreEntryCountAggregateOutputType> | number
          }
        }
      }
      UnlockedCharacter: {
        payload: Prisma.$UnlockedCharacterPayload<ExtArgs>
        fields: Prisma.UnlockedCharacterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UnlockedCharacterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnlockedCharacterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UnlockedCharacterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnlockedCharacterPayload>
          }
          findFirst: {
            args: Prisma.UnlockedCharacterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnlockedCharacterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UnlockedCharacterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnlockedCharacterPayload>
          }
          findMany: {
            args: Prisma.UnlockedCharacterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnlockedCharacterPayload>[]
          }
          create: {
            args: Prisma.UnlockedCharacterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnlockedCharacterPayload>
          }
          createMany: {
            args: Prisma.UnlockedCharacterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UnlockedCharacterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnlockedCharacterPayload>[]
          }
          delete: {
            args: Prisma.UnlockedCharacterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnlockedCharacterPayload>
          }
          update: {
            args: Prisma.UnlockedCharacterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnlockedCharacterPayload>
          }
          deleteMany: {
            args: Prisma.UnlockedCharacterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UnlockedCharacterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UnlockedCharacterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnlockedCharacterPayload>[]
          }
          upsert: {
            args: Prisma.UnlockedCharacterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnlockedCharacterPayload>
          }
          aggregate: {
            args: Prisma.UnlockedCharacterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUnlockedCharacter>
          }
          groupBy: {
            args: Prisma.UnlockedCharacterGroupByArgs<ExtArgs>
            result: $Utils.Optional<UnlockedCharacterGroupByOutputType>[]
          }
          count: {
            args: Prisma.UnlockedCharacterCountArgs<ExtArgs>
            result: $Utils.Optional<UnlockedCharacterCountAggregateOutputType> | number
          }
        }
      }
      GameRun: {
        payload: Prisma.$GameRunPayload<ExtArgs>
        fields: Prisma.GameRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRunPayload>
          }
          findFirst: {
            args: Prisma.GameRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRunPayload>
          }
          findMany: {
            args: Prisma.GameRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRunPayload>[]
          }
          create: {
            args: Prisma.GameRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRunPayload>
          }
          createMany: {
            args: Prisma.GameRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRunPayload>[]
          }
          delete: {
            args: Prisma.GameRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRunPayload>
          }
          update: {
            args: Prisma.GameRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRunPayload>
          }
          deleteMany: {
            args: Prisma.GameRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRunPayload>[]
          }
          upsert: {
            args: Prisma.GameRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRunPayload>
          }
          aggregate: {
            args: Prisma.GameRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameRun>
          }
          groupBy: {
            args: Prisma.GameRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameRunCountArgs<ExtArgs>
            result: $Utils.Optional<GameRunCountAggregateOutputType> | number
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
      EmailVerificationToken: {
        payload: Prisma.$EmailVerificationTokenPayload<ExtArgs>
        fields: Prisma.EmailVerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EmailVerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EmailVerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.EmailVerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EmailVerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>
          }
          findMany: {
            args: Prisma.EmailVerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>[]
          }
          create: {
            args: Prisma.EmailVerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>
          }
          createMany: {
            args: Prisma.EmailVerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EmailVerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.EmailVerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>
          }
          update: {
            args: Prisma.EmailVerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.EmailVerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EmailVerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EmailVerificationTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>[]
          }
          upsert: {
            args: Prisma.EmailVerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EmailVerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.EmailVerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEmailVerificationToken>
          }
          groupBy: {
            args: Prisma.EmailVerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<EmailVerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.EmailVerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<EmailVerificationTokenCountAggregateOutputType> | number
          }
        }
      }
      PasswordResetToken: {
        payload: Prisma.$PasswordResetTokenPayload<ExtArgs>
        fields: Prisma.PasswordResetTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          findFirst: {
            args: Prisma.PasswordResetTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          findMany: {
            args: Prisma.PasswordResetTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          create: {
            args: Prisma.PasswordResetTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          createMany: {
            args: Prisma.PasswordResetTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          delete: {
            args: Prisma.PasswordResetTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          update: {
            args: Prisma.PasswordResetTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          upsert: {
            args: Prisma.PasswordResetTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          aggregate: {
            args: Prisma.PasswordResetTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordResetToken>
          }
          groupBy: {
            args: Prisma.PasswordResetTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordResetTokenCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetTokenCountAggregateOutputType> | number
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
     * Read more in our [docs](https://pris.ly/d/logging).
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
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
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
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    profile?: ProfileOmit
    settings?: SettingsOmit
    missionProgress?: MissionProgressOmit
    scoreEntry?: ScoreEntryOmit
    unlockedCharacter?: UnlockedCharacterOmit
    gameRun?: GameRunOmit
    refreshToken?: RefreshTokenOmit
    emailVerificationToken?: EmailVerificationTokenOmit
    passwordResetToken?: PasswordResetTokenOmit
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
    mission_progress: number
    score_entries: number
    unlocked_characters: number
    game_runs: number
    refresh_tokens: number
    email_verification_tokens: number
    password_reset_tokens: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mission_progress?: boolean | UserCountOutputTypeCountMission_progressArgs
    score_entries?: boolean | UserCountOutputTypeCountScore_entriesArgs
    unlocked_characters?: boolean | UserCountOutputTypeCountUnlocked_charactersArgs
    game_runs?: boolean | UserCountOutputTypeCountGame_runsArgs
    refresh_tokens?: boolean | UserCountOutputTypeCountRefresh_tokensArgs
    email_verification_tokens?: boolean | UserCountOutputTypeCountEmail_verification_tokensArgs
    password_reset_tokens?: boolean | UserCountOutputTypeCountPassword_reset_tokensArgs
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
  export type UserCountOutputTypeCountMission_progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MissionProgressWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountScore_entriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScoreEntryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUnlocked_charactersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UnlockedCharacterWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGame_runsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameRunWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRefresh_tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEmail_verification_tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailVerificationTokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPassword_reset_tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetTokenWhereInput
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
    username: string | null
    username_normalized: string | null
    password: string | null
    role: $Enums.AuthRole | null
    email_verified_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    username_normalized: string | null
    password: string | null
    role: $Enums.AuthRole | null
    email_verified_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    username_normalized: number
    password: number
    role: number
    email_verified_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    username_normalized?: true
    password?: true
    role?: true
    email_verified_at?: true
    created_at?: true
    updated_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    username_normalized?: true
    password?: true
    role?: true
    email_verified_at?: true
    created_at?: true
    updated_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    username_normalized?: true
    password?: true
    role?: true
    email_verified_at?: true
    created_at?: true
    updated_at?: true
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
    username: string
    username_normalized: string
    password: string
    role: $Enums.AuthRole
    email_verified_at: Date | null
    created_at: Date
    updated_at: Date
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
    username?: boolean
    username_normalized?: boolean
    password?: boolean
    role?: boolean
    email_verified_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    profile?: boolean | User$profileArgs<ExtArgs>
    settings?: boolean | User$settingsArgs<ExtArgs>
    mission_progress?: boolean | User$mission_progressArgs<ExtArgs>
    score_entries?: boolean | User$score_entriesArgs<ExtArgs>
    unlocked_characters?: boolean | User$unlocked_charactersArgs<ExtArgs>
    game_runs?: boolean | User$game_runsArgs<ExtArgs>
    refresh_tokens?: boolean | User$refresh_tokensArgs<ExtArgs>
    email_verification_tokens?: boolean | User$email_verification_tokensArgs<ExtArgs>
    password_reset_tokens?: boolean | User$password_reset_tokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    username_normalized?: boolean
    password?: boolean
    role?: boolean
    email_verified_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    username_normalized?: boolean
    password?: boolean
    role?: boolean
    email_verified_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    username_normalized?: boolean
    password?: boolean
    role?: boolean
    email_verified_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "username" | "username_normalized" | "password" | "role" | "email_verified_at" | "created_at" | "updated_at", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    profile?: boolean | User$profileArgs<ExtArgs>
    settings?: boolean | User$settingsArgs<ExtArgs>
    mission_progress?: boolean | User$mission_progressArgs<ExtArgs>
    score_entries?: boolean | User$score_entriesArgs<ExtArgs>
    unlocked_characters?: boolean | User$unlocked_charactersArgs<ExtArgs>
    game_runs?: boolean | User$game_runsArgs<ExtArgs>
    refresh_tokens?: boolean | User$refresh_tokensArgs<ExtArgs>
    email_verification_tokens?: boolean | User$email_verification_tokensArgs<ExtArgs>
    password_reset_tokens?: boolean | User$password_reset_tokensArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      profile: Prisma.$ProfilePayload<ExtArgs> | null
      settings: Prisma.$SettingsPayload<ExtArgs> | null
      mission_progress: Prisma.$MissionProgressPayload<ExtArgs>[]
      score_entries: Prisma.$ScoreEntryPayload<ExtArgs>[]
      unlocked_characters: Prisma.$UnlockedCharacterPayload<ExtArgs>[]
      game_runs: Prisma.$GameRunPayload<ExtArgs>[]
      refresh_tokens: Prisma.$RefreshTokenPayload<ExtArgs>[]
      email_verification_tokens: Prisma.$EmailVerificationTokenPayload<ExtArgs>[]
      password_reset_tokens: Prisma.$PasswordResetTokenPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      username_normalized: string
      password: string
      role: $Enums.AuthRole
      email_verified_at: Date | null
      created_at: Date
      updated_at: Date
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
    profile<T extends User$profileArgs<ExtArgs> = {}>(args?: Subset<T, User$profileArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    settings<T extends User$settingsArgs<ExtArgs> = {}>(args?: Subset<T, User$settingsArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    mission_progress<T extends User$mission_progressArgs<ExtArgs> = {}>(args?: Subset<T, User$mission_progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MissionProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    score_entries<T extends User$score_entriesArgs<ExtArgs> = {}>(args?: Subset<T, User$score_entriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScoreEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    unlocked_characters<T extends User$unlocked_charactersArgs<ExtArgs> = {}>(args?: Subset<T, User$unlocked_charactersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnlockedCharacterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    game_runs<T extends User$game_runsArgs<ExtArgs> = {}>(args?: Subset<T, User$game_runsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    refresh_tokens<T extends User$refresh_tokensArgs<ExtArgs> = {}>(args?: Subset<T, User$refresh_tokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    email_verification_tokens<T extends User$email_verification_tokensArgs<ExtArgs> = {}>(args?: Subset<T, User$email_verification_tokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    password_reset_tokens<T extends User$password_reset_tokensArgs<ExtArgs> = {}>(args?: Subset<T, User$password_reset_tokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly username: FieldRef<"User", 'String'>
    readonly username_normalized: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'AuthRole'>
    readonly email_verified_at: FieldRef<"User", 'DateTime'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly updated_at: FieldRef<"User", 'DateTime'>
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
   * User.profile
   */
  export type User$profileArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    where?: ProfileWhereInput
  }

  /**
   * User.settings
   */
  export type User$settingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    where?: SettingsWhereInput
  }

  /**
   * User.mission_progress
   */
  export type User$mission_progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressInclude<ExtArgs> | null
    where?: MissionProgressWhereInput
    orderBy?: MissionProgressOrderByWithRelationInput | MissionProgressOrderByWithRelationInput[]
    cursor?: MissionProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MissionProgressScalarFieldEnum | MissionProgressScalarFieldEnum[]
  }

  /**
   * User.score_entries
   */
  export type User$score_entriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryInclude<ExtArgs> | null
    where?: ScoreEntryWhereInput
    orderBy?: ScoreEntryOrderByWithRelationInput | ScoreEntryOrderByWithRelationInput[]
    cursor?: ScoreEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScoreEntryScalarFieldEnum | ScoreEntryScalarFieldEnum[]
  }

  /**
   * User.unlocked_characters
   */
  export type User$unlocked_charactersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterInclude<ExtArgs> | null
    where?: UnlockedCharacterWhereInput
    orderBy?: UnlockedCharacterOrderByWithRelationInput | UnlockedCharacterOrderByWithRelationInput[]
    cursor?: UnlockedCharacterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UnlockedCharacterScalarFieldEnum | UnlockedCharacterScalarFieldEnum[]
  }

  /**
   * User.game_runs
   */
  export type User$game_runsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunInclude<ExtArgs> | null
    where?: GameRunWhereInput
    orderBy?: GameRunOrderByWithRelationInput | GameRunOrderByWithRelationInput[]
    cursor?: GameRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameRunScalarFieldEnum | GameRunScalarFieldEnum[]
  }

  /**
   * User.refresh_tokens
   */
  export type User$refresh_tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * User.email_verification_tokens
   */
  export type User$email_verification_tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenInclude<ExtArgs> | null
    where?: EmailVerificationTokenWhereInput
    orderBy?: EmailVerificationTokenOrderByWithRelationInput | EmailVerificationTokenOrderByWithRelationInput[]
    cursor?: EmailVerificationTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EmailVerificationTokenScalarFieldEnum | EmailVerificationTokenScalarFieldEnum[]
  }

  /**
   * User.password_reset_tokens
   */
  export type User$password_reset_tokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    where?: PasswordResetTokenWhereInput
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    cursor?: PasswordResetTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
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
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null
    _avg: ProfileAvgAggregateOutputType | null
    _sum: ProfileSumAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  export type ProfileAvgAggregateOutputType = {
    level: number | null
    xp: number | null
    total_points: number | null
    save_version: number | null
  }

  export type ProfileSumAggregateOutputType = {
    level: number | null
    xp: number | null
    total_points: number | null
    save_version: number | null
  }

  export type ProfileMinAggregateOutputType = {
    user_id: string | null
    level: number | null
    xp: number | null
    total_points: number | null
    title: string | null
    current_mission_id: string | null
    highest_unlocked_mission_id: string | null
    save_version: number | null
    emperor_knight_unlocked_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProfileMaxAggregateOutputType = {
    user_id: string | null
    level: number | null
    xp: number | null
    total_points: number | null
    title: string | null
    current_mission_id: string | null
    highest_unlocked_mission_id: string | null
    save_version: number | null
    emperor_knight_unlocked_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ProfileCountAggregateOutputType = {
    user_id: number
    level: number
    xp: number
    total_points: number
    title: number
    current_mission_id: number
    highest_unlocked_mission_id: number
    save_version: number
    emperor_knight_unlocked_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ProfileAvgAggregateInputType = {
    level?: true
    xp?: true
    total_points?: true
    save_version?: true
  }

  export type ProfileSumAggregateInputType = {
    level?: true
    xp?: true
    total_points?: true
    save_version?: true
  }

  export type ProfileMinAggregateInputType = {
    user_id?: true
    level?: true
    xp?: true
    total_points?: true
    title?: true
    current_mission_id?: true
    highest_unlocked_mission_id?: true
    save_version?: true
    emperor_knight_unlocked_at?: true
    created_at?: true
    updated_at?: true
  }

  export type ProfileMaxAggregateInputType = {
    user_id?: true
    level?: true
    xp?: true
    total_points?: true
    title?: true
    current_mission_id?: true
    highest_unlocked_mission_id?: true
    save_version?: true
    emperor_knight_unlocked_at?: true
    created_at?: true
    updated_at?: true
  }

  export type ProfileCountAggregateInputType = {
    user_id?: true
    level?: true
    xp?: true
    total_points?: true
    title?: true
    current_mission_id?: true
    highest_unlocked_mission_id?: true
    save_version?: true
    emperor_knight_unlocked_at?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ProfileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profiles
    **/
    _count?: true | ProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProfileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProfileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileMaxAggregateInputType
  }

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>
  }




  export type ProfileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfileWhereInput
    orderBy?: ProfileOrderByWithAggregationInput | ProfileOrderByWithAggregationInput[]
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum
    having?: ProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileCountAggregateInputType | true
    _avg?: ProfileAvgAggregateInputType
    _sum?: ProfileSumAggregateInputType
    _min?: ProfileMinAggregateInputType
    _max?: ProfileMaxAggregateInputType
  }

  export type ProfileGroupByOutputType = {
    user_id: string
    level: number
    xp: number
    total_points: number
    title: string
    current_mission_id: string
    highest_unlocked_mission_id: string
    save_version: number
    emperor_knight_unlocked_at: Date | null
    created_at: Date
    updated_at: Date
    _count: ProfileCountAggregateOutputType | null
    _avg: ProfileAvgAggregateOutputType | null
    _sum: ProfileSumAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>
        }
      >
    >


  export type ProfileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    level?: boolean
    xp?: boolean
    total_points?: boolean
    title?: boolean
    current_mission_id?: boolean
    highest_unlocked_mission_id?: boolean
    save_version?: boolean
    emperor_knight_unlocked_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    level?: boolean
    xp?: boolean
    total_points?: boolean
    title?: boolean
    current_mission_id?: boolean
    highest_unlocked_mission_id?: boolean
    save_version?: boolean
    emperor_knight_unlocked_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    level?: boolean
    xp?: boolean
    total_points?: boolean
    title?: boolean
    current_mission_id?: boolean
    highest_unlocked_mission_id?: boolean
    save_version?: boolean
    emperor_knight_unlocked_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profile"]>

  export type ProfileSelectScalar = {
    user_id?: boolean
    level?: boolean
    xp?: boolean
    total_points?: boolean
    title?: boolean
    current_mission_id?: boolean
    highest_unlocked_mission_id?: boolean
    save_version?: boolean
    emperor_knight_unlocked_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ProfileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"user_id" | "level" | "xp" | "total_points" | "title" | "current_mission_id" | "highest_unlocked_mission_id" | "save_version" | "emperor_knight_unlocked_at" | "created_at" | "updated_at", ExtArgs["result"]["profile"]>
  export type ProfileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProfileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ProfileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ProfilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Profile"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      user_id: string
      level: number
      xp: number
      total_points: number
      title: string
      current_mission_id: string
      highest_unlocked_mission_id: string
      save_version: number
      emperor_knight_unlocked_at: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["profile"]>
    composites: {}
  }

  type ProfileGetPayload<S extends boolean | null | undefined | ProfileDefaultArgs> = $Result.GetResult<Prisma.$ProfilePayload, S>

  type ProfileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfileCountAggregateInputType | true
    }

  export interface ProfileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Profile'], meta: { name: 'Profile' } }
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const profileWithUser_idOnly = await prisma.profile.findMany({ select: { user_id: true } })
     * 
     */
    findMany<T extends ProfileFindManyArgs>(args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     * 
     */
    create<T extends ProfileCreateArgs>(args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfileCreateManyArgs>(args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {ProfileCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Profiles and only return the `user_id`
     * const profileWithUser_idOnly = await prisma.profile.createManyAndReturn({
     *   select: { user_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(args?: SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     * 
     */
    delete<T extends ProfileDeleteArgs>(args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfileUpdateArgs>(args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfileDeleteManyArgs>(args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfileUpdateManyArgs>(args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {ProfileUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Profiles and only return the `user_id`
     * const profileWithUser_idOnly = await prisma.profile.updateManyAndReturn({
     *   select: { user_id: true },
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
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(args: SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>): Prisma__ProfileClient<$Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProfileAggregateArgs>(args: Subset<T, ProfileAggregateArgs>): Prisma.PrismaPromise<GetProfileAggregateType<T>>

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
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
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Profile model
   */
  readonly fields: ProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Profile model
   */
  interface ProfileFieldRefs {
    readonly user_id: FieldRef<"Profile", 'String'>
    readonly level: FieldRef<"Profile", 'Int'>
    readonly xp: FieldRef<"Profile", 'Int'>
    readonly total_points: FieldRef<"Profile", 'Int'>
    readonly title: FieldRef<"Profile", 'String'>
    readonly current_mission_id: FieldRef<"Profile", 'String'>
    readonly highest_unlocked_mission_id: FieldRef<"Profile", 'String'>
    readonly save_version: FieldRef<"Profile", 'Int'>
    readonly emperor_knight_unlocked_at: FieldRef<"Profile", 'DateTime'>
    readonly created_at: FieldRef<"Profile", 'DateTime'>
    readonly updated_at: FieldRef<"Profile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     */
    orderBy?: ProfileOrderByWithRelationInput | ProfileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     */
    skip?: number
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[]
  }

  /**
   * Profile create
   */
  export type ProfileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
  }

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Profile createManyAndReturn
   */
  export type ProfileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
  }

  /**
   * Profile updateManyAndReturn
   */
  export type ProfileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
  }

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput
    /**
     * Limit how many Profiles to delete.
     */
    limit?: number
  }

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null
  }


  /**
   * Model Settings
   */

  export type AggregateSettings = {
    _count: SettingsCountAggregateOutputType | null
    _avg: SettingsAvgAggregateOutputType | null
    _sum: SettingsSumAggregateOutputType | null
    _min: SettingsMinAggregateOutputType | null
    _max: SettingsMaxAggregateOutputType | null
  }

  export type SettingsAvgAggregateOutputType = {
    master_volume: number | null
    music_volume: number | null
    sfx_volume: number | null
  }

  export type SettingsSumAggregateOutputType = {
    master_volume: number | null
    music_volume: number | null
    sfx_volume: number | null
  }

  export type SettingsMinAggregateOutputType = {
    user_id: string | null
    master_volume: number | null
    music_volume: number | null
    sfx_volume: number | null
    reduced_motion: boolean | null
    screen_shake: boolean | null
    show_fps: boolean | null
    difficulty: $Enums.Difficulty | null
    updated_at: Date | null
  }

  export type SettingsMaxAggregateOutputType = {
    user_id: string | null
    master_volume: number | null
    music_volume: number | null
    sfx_volume: number | null
    reduced_motion: boolean | null
    screen_shake: boolean | null
    show_fps: boolean | null
    difficulty: $Enums.Difficulty | null
    updated_at: Date | null
  }

  export type SettingsCountAggregateOutputType = {
    user_id: number
    master_volume: number
    music_volume: number
    sfx_volume: number
    reduced_motion: number
    screen_shake: number
    show_fps: number
    difficulty: number
    key_bindings: number
    updated_at: number
    _all: number
  }


  export type SettingsAvgAggregateInputType = {
    master_volume?: true
    music_volume?: true
    sfx_volume?: true
  }

  export type SettingsSumAggregateInputType = {
    master_volume?: true
    music_volume?: true
    sfx_volume?: true
  }

  export type SettingsMinAggregateInputType = {
    user_id?: true
    master_volume?: true
    music_volume?: true
    sfx_volume?: true
    reduced_motion?: true
    screen_shake?: true
    show_fps?: true
    difficulty?: true
    updated_at?: true
  }

  export type SettingsMaxAggregateInputType = {
    user_id?: true
    master_volume?: true
    music_volume?: true
    sfx_volume?: true
    reduced_motion?: true
    screen_shake?: true
    show_fps?: true
    difficulty?: true
    updated_at?: true
  }

  export type SettingsCountAggregateInputType = {
    user_id?: true
    master_volume?: true
    music_volume?: true
    sfx_volume?: true
    reduced_motion?: true
    screen_shake?: true
    show_fps?: true
    difficulty?: true
    key_bindings?: true
    updated_at?: true
    _all?: true
  }

  export type SettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to aggregate.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Settings
    **/
    _count?: true | SettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SettingsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SettingsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SettingsMaxAggregateInputType
  }

  export type GetSettingsAggregateType<T extends SettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSettings[P]>
      : GetScalarType<T[P], AggregateSettings[P]>
  }




  export type SettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettingsWhereInput
    orderBy?: SettingsOrderByWithAggregationInput | SettingsOrderByWithAggregationInput[]
    by: SettingsScalarFieldEnum[] | SettingsScalarFieldEnum
    having?: SettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettingsCountAggregateInputType | true
    _avg?: SettingsAvgAggregateInputType
    _sum?: SettingsSumAggregateInputType
    _min?: SettingsMinAggregateInputType
    _max?: SettingsMaxAggregateInputType
  }

  export type SettingsGroupByOutputType = {
    user_id: string
    master_volume: number
    music_volume: number
    sfx_volume: number
    reduced_motion: boolean
    screen_shake: boolean
    show_fps: boolean
    difficulty: $Enums.Difficulty
    key_bindings: JsonValue
    updated_at: Date
    _count: SettingsCountAggregateOutputType | null
    _avg: SettingsAvgAggregateOutputType | null
    _sum: SettingsSumAggregateOutputType | null
    _min: SettingsMinAggregateOutputType | null
    _max: SettingsMaxAggregateOutputType | null
  }

  type GetSettingsGroupByPayload<T extends SettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettingsGroupByOutputType[P]>
            : GetScalarType<T[P], SettingsGroupByOutputType[P]>
        }
      >
    >


  export type SettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    master_volume?: boolean
    music_volume?: boolean
    sfx_volume?: boolean
    reduced_motion?: boolean
    screen_shake?: boolean
    show_fps?: boolean
    difficulty?: boolean
    key_bindings?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["settings"]>

  export type SettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    master_volume?: boolean
    music_volume?: boolean
    sfx_volume?: boolean
    reduced_motion?: boolean
    screen_shake?: boolean
    show_fps?: boolean
    difficulty?: boolean
    key_bindings?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["settings"]>

  export type SettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    user_id?: boolean
    master_volume?: boolean
    music_volume?: boolean
    sfx_volume?: boolean
    reduced_motion?: boolean
    screen_shake?: boolean
    show_fps?: boolean
    difficulty?: boolean
    key_bindings?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["settings"]>

  export type SettingsSelectScalar = {
    user_id?: boolean
    master_volume?: boolean
    music_volume?: boolean
    sfx_volume?: boolean
    reduced_motion?: boolean
    screen_shake?: boolean
    show_fps?: boolean
    difficulty?: boolean
    key_bindings?: boolean
    updated_at?: boolean
  }

  export type SettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"user_id" | "master_volume" | "music_volume" | "sfx_volume" | "reduced_motion" | "screen_shake" | "show_fps" | "difficulty" | "key_bindings" | "updated_at", ExtArgs["result"]["settings"]>
  export type SettingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SettingsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SettingsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Settings"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      user_id: string
      master_volume: number
      music_volume: number
      sfx_volume: number
      reduced_motion: boolean
      screen_shake: boolean
      show_fps: boolean
      difficulty: $Enums.Difficulty
      key_bindings: Prisma.JsonValue
      updated_at: Date
    }, ExtArgs["result"]["settings"]>
    composites: {}
  }

  type SettingsGetPayload<S extends boolean | null | undefined | SettingsDefaultArgs> = $Result.GetResult<Prisma.$SettingsPayload, S>

  type SettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SettingsCountAggregateInputType | true
    }

  export interface SettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Settings'], meta: { name: 'Settings' } }
    /**
     * Find zero or one Settings that matches the filter.
     * @param {SettingsFindUniqueArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettingsFindUniqueArgs>(args: SelectSubset<T, SettingsFindUniqueArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Settings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SettingsFindUniqueOrThrowArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, SettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindFirstArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettingsFindFirstArgs>(args?: SelectSubset<T, SettingsFindFirstArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Settings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindFirstOrThrowArgs} args - Arguments to find a Settings
     * @example
     * // Get one Settings
     * const settings = await prisma.settings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, SettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settings
     * const settings = await prisma.settings.findMany()
     * 
     * // Get first 10 Settings
     * const settings = await prisma.settings.findMany({ take: 10 })
     * 
     * // Only select the `user_id`
     * const settingsWithUser_idOnly = await prisma.settings.findMany({ select: { user_id: true } })
     * 
     */
    findMany<T extends SettingsFindManyArgs>(args?: SelectSubset<T, SettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Settings.
     * @param {SettingsCreateArgs} args - Arguments to create a Settings.
     * @example
     * // Create one Settings
     * const Settings = await prisma.settings.create({
     *   data: {
     *     // ... data to create a Settings
     *   }
     * })
     * 
     */
    create<T extends SettingsCreateArgs>(args: SelectSubset<T, SettingsCreateArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Settings.
     * @param {SettingsCreateManyArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const settings = await prisma.settings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SettingsCreateManyArgs>(args?: SelectSubset<T, SettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Settings and returns the data saved in the database.
     * @param {SettingsCreateManyAndReturnArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const settings = await prisma.settings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Settings and only return the `user_id`
     * const settingsWithUser_idOnly = await prisma.settings.createManyAndReturn({
     *   select: { user_id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, SettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Settings.
     * @param {SettingsDeleteArgs} args - Arguments to delete one Settings.
     * @example
     * // Delete one Settings
     * const Settings = await prisma.settings.delete({
     *   where: {
     *     // ... filter to delete one Settings
     *   }
     * })
     * 
     */
    delete<T extends SettingsDeleteArgs>(args: SelectSubset<T, SettingsDeleteArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Settings.
     * @param {SettingsUpdateArgs} args - Arguments to update one Settings.
     * @example
     * // Update one Settings
     * const settings = await prisma.settings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SettingsUpdateArgs>(args: SelectSubset<T, SettingsUpdateArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Settings.
     * @param {SettingsDeleteManyArgs} args - Arguments to filter Settings to delete.
     * @example
     * // Delete a few Settings
     * const { count } = await prisma.settings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SettingsDeleteManyArgs>(args?: SelectSubset<T, SettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settings
     * const settings = await prisma.settings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SettingsUpdateManyArgs>(args: SelectSubset<T, SettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings and returns the data updated in the database.
     * @param {SettingsUpdateManyAndReturnArgs} args - Arguments to update many Settings.
     * @example
     * // Update many Settings
     * const settings = await prisma.settings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Settings and only return the `user_id`
     * const settingsWithUser_idOnly = await prisma.settings.updateManyAndReturn({
     *   select: { user_id: true },
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
    updateManyAndReturn<T extends SettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, SettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Settings.
     * @param {SettingsUpsertArgs} args - Arguments to update or create a Settings.
     * @example
     * // Update or create a Settings
     * const settings = await prisma.settings.upsert({
     *   create: {
     *     // ... data to create a Settings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Settings we want to update
     *   }
     * })
     */
    upsert<T extends SettingsUpsertArgs>(args: SelectSubset<T, SettingsUpsertArgs<ExtArgs>>): Prisma__SettingsClient<$Result.GetResult<Prisma.$SettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsCountArgs} args - Arguments to filter Settings to count.
     * @example
     * // Count the number of Settings
     * const count = await prisma.settings.count({
     *   where: {
     *     // ... the filter for the Settings we want to count
     *   }
     * })
    **/
    count<T extends SettingsCountArgs>(
      args?: Subset<T, SettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SettingsAggregateArgs>(args: Subset<T, SettingsAggregateArgs>): Prisma.PrismaPromise<GetSettingsAggregateType<T>>

    /**
     * Group by Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingsGroupByArgs} args - Group by arguments.
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
      T extends SettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettingsGroupByArgs['orderBy'] }
        : { orderBy?: SettingsGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Settings model
   */
  readonly fields: SettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Settings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Settings model
   */
  interface SettingsFieldRefs {
    readonly user_id: FieldRef<"Settings", 'String'>
    readonly master_volume: FieldRef<"Settings", 'Float'>
    readonly music_volume: FieldRef<"Settings", 'Float'>
    readonly sfx_volume: FieldRef<"Settings", 'Float'>
    readonly reduced_motion: FieldRef<"Settings", 'Boolean'>
    readonly screen_shake: FieldRef<"Settings", 'Boolean'>
    readonly show_fps: FieldRef<"Settings", 'Boolean'>
    readonly difficulty: FieldRef<"Settings", 'Difficulty'>
    readonly key_bindings: FieldRef<"Settings", 'Json'>
    readonly updated_at: FieldRef<"Settings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Settings findUnique
   */
  export type SettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings findUniqueOrThrow
   */
  export type SettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings findFirst
   */
  export type SettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings findFirstOrThrow
   */
  export type SettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings findMany
   */
  export type SettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingsOrderByWithRelationInput | SettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Settings.
     */
    cursor?: SettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    distinct?: SettingsScalarFieldEnum | SettingsScalarFieldEnum[]
  }

  /**
   * Settings create
   */
  export type SettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * The data needed to create a Settings.
     */
    data: XOR<SettingsCreateInput, SettingsUncheckedCreateInput>
  }

  /**
   * Settings createMany
   */
  export type SettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Settings.
     */
    data: SettingsCreateManyInput | SettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Settings createManyAndReturn
   */
  export type SettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * The data used to create many Settings.
     */
    data: SettingsCreateManyInput | SettingsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Settings update
   */
  export type SettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * The data needed to update a Settings.
     */
    data: XOR<SettingsUpdateInput, SettingsUncheckedUpdateInput>
    /**
     * Choose, which Settings to update.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings updateMany
   */
  export type SettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingsUpdateManyMutationInput, SettingsUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingsWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
  }

  /**
   * Settings updateManyAndReturn
   */
  export type SettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingsUpdateManyMutationInput, SettingsUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingsWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Settings upsert
   */
  export type SettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * The filter to search for the Settings to update in case it exists.
     */
    where: SettingsWhereUniqueInput
    /**
     * In case the Settings found by the `where` argument doesn't exist, create a new Settings with this data.
     */
    create: XOR<SettingsCreateInput, SettingsUncheckedCreateInput>
    /**
     * In case the Settings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettingsUpdateInput, SettingsUncheckedUpdateInput>
  }

  /**
   * Settings delete
   */
  export type SettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
    /**
     * Filter which Settings to delete.
     */
    where: SettingsWhereUniqueInput
  }

  /**
   * Settings deleteMany
   */
  export type SettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to delete
     */
    where?: SettingsWhereInput
    /**
     * Limit how many Settings to delete.
     */
    limit?: number
  }

  /**
   * Settings without action
   */
  export type SettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Settings
     */
    select?: SettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Settings
     */
    omit?: SettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingsInclude<ExtArgs> | null
  }


  /**
   * Model MissionProgress
   */

  export type AggregateMissionProgress = {
    _count: MissionProgressCountAggregateOutputType | null
    _avg: MissionProgressAvgAggregateOutputType | null
    _sum: MissionProgressSumAggregateOutputType | null
    _min: MissionProgressMinAggregateOutputType | null
    _max: MissionProgressMaxAggregateOutputType | null
  }

  export type MissionProgressAvgAggregateOutputType = {
    best_score: number | null
    best_time_ms: number | null
    completions: number | null
  }

  export type MissionProgressSumAggregateOutputType = {
    best_score: number | null
    best_time_ms: number | null
    completions: number | null
  }

  export type MissionProgressMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    mission_id: string | null
    status: $Enums.MissionStatus | null
    best_score: number | null
    best_time_ms: number | null
    best_rank: $Enums.MissionRank | null
    completions: number | null
    first_completed_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type MissionProgressMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    mission_id: string | null
    status: $Enums.MissionStatus | null
    best_score: number | null
    best_time_ms: number | null
    best_rank: $Enums.MissionRank | null
    completions: number | null
    first_completed_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type MissionProgressCountAggregateOutputType = {
    id: number
    user_id: number
    mission_id: number
    status: number
    best_score: number
    best_time_ms: number
    best_rank: number
    completions: number
    first_completed_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type MissionProgressAvgAggregateInputType = {
    best_score?: true
    best_time_ms?: true
    completions?: true
  }

  export type MissionProgressSumAggregateInputType = {
    best_score?: true
    best_time_ms?: true
    completions?: true
  }

  export type MissionProgressMinAggregateInputType = {
    id?: true
    user_id?: true
    mission_id?: true
    status?: true
    best_score?: true
    best_time_ms?: true
    best_rank?: true
    completions?: true
    first_completed_at?: true
    created_at?: true
    updated_at?: true
  }

  export type MissionProgressMaxAggregateInputType = {
    id?: true
    user_id?: true
    mission_id?: true
    status?: true
    best_score?: true
    best_time_ms?: true
    best_rank?: true
    completions?: true
    first_completed_at?: true
    created_at?: true
    updated_at?: true
  }

  export type MissionProgressCountAggregateInputType = {
    id?: true
    user_id?: true
    mission_id?: true
    status?: true
    best_score?: true
    best_time_ms?: true
    best_rank?: true
    completions?: true
    first_completed_at?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type MissionProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MissionProgress to aggregate.
     */
    where?: MissionProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MissionProgresses to fetch.
     */
    orderBy?: MissionProgressOrderByWithRelationInput | MissionProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MissionProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MissionProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MissionProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MissionProgresses
    **/
    _count?: true | MissionProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MissionProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MissionProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MissionProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MissionProgressMaxAggregateInputType
  }

  export type GetMissionProgressAggregateType<T extends MissionProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateMissionProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMissionProgress[P]>
      : GetScalarType<T[P], AggregateMissionProgress[P]>
  }




  export type MissionProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MissionProgressWhereInput
    orderBy?: MissionProgressOrderByWithAggregationInput | MissionProgressOrderByWithAggregationInput[]
    by: MissionProgressScalarFieldEnum[] | MissionProgressScalarFieldEnum
    having?: MissionProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MissionProgressCountAggregateInputType | true
    _avg?: MissionProgressAvgAggregateInputType
    _sum?: MissionProgressSumAggregateInputType
    _min?: MissionProgressMinAggregateInputType
    _max?: MissionProgressMaxAggregateInputType
  }

  export type MissionProgressGroupByOutputType = {
    id: string
    user_id: string
    mission_id: string
    status: $Enums.MissionStatus
    best_score: number
    best_time_ms: number | null
    best_rank: $Enums.MissionRank | null
    completions: number
    first_completed_at: Date | null
    created_at: Date
    updated_at: Date
    _count: MissionProgressCountAggregateOutputType | null
    _avg: MissionProgressAvgAggregateOutputType | null
    _sum: MissionProgressSumAggregateOutputType | null
    _min: MissionProgressMinAggregateOutputType | null
    _max: MissionProgressMaxAggregateOutputType | null
  }

  type GetMissionProgressGroupByPayload<T extends MissionProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MissionProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MissionProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MissionProgressGroupByOutputType[P]>
            : GetScalarType<T[P], MissionProgressGroupByOutputType[P]>
        }
      >
    >


  export type MissionProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    mission_id?: boolean
    status?: boolean
    best_score?: boolean
    best_time_ms?: boolean
    best_rank?: boolean
    completions?: boolean
    first_completed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["missionProgress"]>

  export type MissionProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    mission_id?: boolean
    status?: boolean
    best_score?: boolean
    best_time_ms?: boolean
    best_rank?: boolean
    completions?: boolean
    first_completed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["missionProgress"]>

  export type MissionProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    mission_id?: boolean
    status?: boolean
    best_score?: boolean
    best_time_ms?: boolean
    best_rank?: boolean
    completions?: boolean
    first_completed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["missionProgress"]>

  export type MissionProgressSelectScalar = {
    id?: boolean
    user_id?: boolean
    mission_id?: boolean
    status?: boolean
    best_score?: boolean
    best_time_ms?: boolean
    best_rank?: boolean
    completions?: boolean
    first_completed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type MissionProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "mission_id" | "status" | "best_score" | "best_time_ms" | "best_rank" | "completions" | "first_completed_at" | "created_at" | "updated_at", ExtArgs["result"]["missionProgress"]>
  export type MissionProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MissionProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MissionProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MissionProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MissionProgress"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      mission_id: string
      status: $Enums.MissionStatus
      best_score: number
      best_time_ms: number | null
      best_rank: $Enums.MissionRank | null
      completions: number
      first_completed_at: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["missionProgress"]>
    composites: {}
  }

  type MissionProgressGetPayload<S extends boolean | null | undefined | MissionProgressDefaultArgs> = $Result.GetResult<Prisma.$MissionProgressPayload, S>

  type MissionProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MissionProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MissionProgressCountAggregateInputType | true
    }

  export interface MissionProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MissionProgress'], meta: { name: 'MissionProgress' } }
    /**
     * Find zero or one MissionProgress that matches the filter.
     * @param {MissionProgressFindUniqueArgs} args - Arguments to find a MissionProgress
     * @example
     * // Get one MissionProgress
     * const missionProgress = await prisma.missionProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MissionProgressFindUniqueArgs>(args: SelectSubset<T, MissionProgressFindUniqueArgs<ExtArgs>>): Prisma__MissionProgressClient<$Result.GetResult<Prisma.$MissionProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MissionProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MissionProgressFindUniqueOrThrowArgs} args - Arguments to find a MissionProgress
     * @example
     * // Get one MissionProgress
     * const missionProgress = await prisma.missionProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MissionProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, MissionProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MissionProgressClient<$Result.GetResult<Prisma.$MissionProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MissionProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionProgressFindFirstArgs} args - Arguments to find a MissionProgress
     * @example
     * // Get one MissionProgress
     * const missionProgress = await prisma.missionProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MissionProgressFindFirstArgs>(args?: SelectSubset<T, MissionProgressFindFirstArgs<ExtArgs>>): Prisma__MissionProgressClient<$Result.GetResult<Prisma.$MissionProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MissionProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionProgressFindFirstOrThrowArgs} args - Arguments to find a MissionProgress
     * @example
     * // Get one MissionProgress
     * const missionProgress = await prisma.missionProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MissionProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, MissionProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__MissionProgressClient<$Result.GetResult<Prisma.$MissionProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MissionProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MissionProgresses
     * const missionProgresses = await prisma.missionProgress.findMany()
     * 
     * // Get first 10 MissionProgresses
     * const missionProgresses = await prisma.missionProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const missionProgressWithIdOnly = await prisma.missionProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MissionProgressFindManyArgs>(args?: SelectSubset<T, MissionProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MissionProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MissionProgress.
     * @param {MissionProgressCreateArgs} args - Arguments to create a MissionProgress.
     * @example
     * // Create one MissionProgress
     * const MissionProgress = await prisma.missionProgress.create({
     *   data: {
     *     // ... data to create a MissionProgress
     *   }
     * })
     * 
     */
    create<T extends MissionProgressCreateArgs>(args: SelectSubset<T, MissionProgressCreateArgs<ExtArgs>>): Prisma__MissionProgressClient<$Result.GetResult<Prisma.$MissionProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MissionProgresses.
     * @param {MissionProgressCreateManyArgs} args - Arguments to create many MissionProgresses.
     * @example
     * // Create many MissionProgresses
     * const missionProgress = await prisma.missionProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MissionProgressCreateManyArgs>(args?: SelectSubset<T, MissionProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MissionProgresses and returns the data saved in the database.
     * @param {MissionProgressCreateManyAndReturnArgs} args - Arguments to create many MissionProgresses.
     * @example
     * // Create many MissionProgresses
     * const missionProgress = await prisma.missionProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MissionProgresses and only return the `id`
     * const missionProgressWithIdOnly = await prisma.missionProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MissionProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, MissionProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MissionProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MissionProgress.
     * @param {MissionProgressDeleteArgs} args - Arguments to delete one MissionProgress.
     * @example
     * // Delete one MissionProgress
     * const MissionProgress = await prisma.missionProgress.delete({
     *   where: {
     *     // ... filter to delete one MissionProgress
     *   }
     * })
     * 
     */
    delete<T extends MissionProgressDeleteArgs>(args: SelectSubset<T, MissionProgressDeleteArgs<ExtArgs>>): Prisma__MissionProgressClient<$Result.GetResult<Prisma.$MissionProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MissionProgress.
     * @param {MissionProgressUpdateArgs} args - Arguments to update one MissionProgress.
     * @example
     * // Update one MissionProgress
     * const missionProgress = await prisma.missionProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MissionProgressUpdateArgs>(args: SelectSubset<T, MissionProgressUpdateArgs<ExtArgs>>): Prisma__MissionProgressClient<$Result.GetResult<Prisma.$MissionProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MissionProgresses.
     * @param {MissionProgressDeleteManyArgs} args - Arguments to filter MissionProgresses to delete.
     * @example
     * // Delete a few MissionProgresses
     * const { count } = await prisma.missionProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MissionProgressDeleteManyArgs>(args?: SelectSubset<T, MissionProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MissionProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MissionProgresses
     * const missionProgress = await prisma.missionProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MissionProgressUpdateManyArgs>(args: SelectSubset<T, MissionProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MissionProgresses and returns the data updated in the database.
     * @param {MissionProgressUpdateManyAndReturnArgs} args - Arguments to update many MissionProgresses.
     * @example
     * // Update many MissionProgresses
     * const missionProgress = await prisma.missionProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MissionProgresses and only return the `id`
     * const missionProgressWithIdOnly = await prisma.missionProgress.updateManyAndReturn({
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
    updateManyAndReturn<T extends MissionProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, MissionProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MissionProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MissionProgress.
     * @param {MissionProgressUpsertArgs} args - Arguments to update or create a MissionProgress.
     * @example
     * // Update or create a MissionProgress
     * const missionProgress = await prisma.missionProgress.upsert({
     *   create: {
     *     // ... data to create a MissionProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MissionProgress we want to update
     *   }
     * })
     */
    upsert<T extends MissionProgressUpsertArgs>(args: SelectSubset<T, MissionProgressUpsertArgs<ExtArgs>>): Prisma__MissionProgressClient<$Result.GetResult<Prisma.$MissionProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MissionProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionProgressCountArgs} args - Arguments to filter MissionProgresses to count.
     * @example
     * // Count the number of MissionProgresses
     * const count = await prisma.missionProgress.count({
     *   where: {
     *     // ... the filter for the MissionProgresses we want to count
     *   }
     * })
    **/
    count<T extends MissionProgressCountArgs>(
      args?: Subset<T, MissionProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MissionProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MissionProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MissionProgressAggregateArgs>(args: Subset<T, MissionProgressAggregateArgs>): Prisma.PrismaPromise<GetMissionProgressAggregateType<T>>

    /**
     * Group by MissionProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MissionProgressGroupByArgs} args - Group by arguments.
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
      T extends MissionProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MissionProgressGroupByArgs['orderBy'] }
        : { orderBy?: MissionProgressGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MissionProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMissionProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MissionProgress model
   */
  readonly fields: MissionProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MissionProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MissionProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the MissionProgress model
   */
  interface MissionProgressFieldRefs {
    readonly id: FieldRef<"MissionProgress", 'String'>
    readonly user_id: FieldRef<"MissionProgress", 'String'>
    readonly mission_id: FieldRef<"MissionProgress", 'String'>
    readonly status: FieldRef<"MissionProgress", 'MissionStatus'>
    readonly best_score: FieldRef<"MissionProgress", 'Int'>
    readonly best_time_ms: FieldRef<"MissionProgress", 'Int'>
    readonly best_rank: FieldRef<"MissionProgress", 'MissionRank'>
    readonly completions: FieldRef<"MissionProgress", 'Int'>
    readonly first_completed_at: FieldRef<"MissionProgress", 'DateTime'>
    readonly created_at: FieldRef<"MissionProgress", 'DateTime'>
    readonly updated_at: FieldRef<"MissionProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MissionProgress findUnique
   */
  export type MissionProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressInclude<ExtArgs> | null
    /**
     * Filter, which MissionProgress to fetch.
     */
    where: MissionProgressWhereUniqueInput
  }

  /**
   * MissionProgress findUniqueOrThrow
   */
  export type MissionProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressInclude<ExtArgs> | null
    /**
     * Filter, which MissionProgress to fetch.
     */
    where: MissionProgressWhereUniqueInput
  }

  /**
   * MissionProgress findFirst
   */
  export type MissionProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressInclude<ExtArgs> | null
    /**
     * Filter, which MissionProgress to fetch.
     */
    where?: MissionProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MissionProgresses to fetch.
     */
    orderBy?: MissionProgressOrderByWithRelationInput | MissionProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MissionProgresses.
     */
    cursor?: MissionProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MissionProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MissionProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MissionProgresses.
     */
    distinct?: MissionProgressScalarFieldEnum | MissionProgressScalarFieldEnum[]
  }

  /**
   * MissionProgress findFirstOrThrow
   */
  export type MissionProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressInclude<ExtArgs> | null
    /**
     * Filter, which MissionProgress to fetch.
     */
    where?: MissionProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MissionProgresses to fetch.
     */
    orderBy?: MissionProgressOrderByWithRelationInput | MissionProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MissionProgresses.
     */
    cursor?: MissionProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MissionProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MissionProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MissionProgresses.
     */
    distinct?: MissionProgressScalarFieldEnum | MissionProgressScalarFieldEnum[]
  }

  /**
   * MissionProgress findMany
   */
  export type MissionProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressInclude<ExtArgs> | null
    /**
     * Filter, which MissionProgresses to fetch.
     */
    where?: MissionProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MissionProgresses to fetch.
     */
    orderBy?: MissionProgressOrderByWithRelationInput | MissionProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MissionProgresses.
     */
    cursor?: MissionProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MissionProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MissionProgresses.
     */
    skip?: number
    distinct?: MissionProgressScalarFieldEnum | MissionProgressScalarFieldEnum[]
  }

  /**
   * MissionProgress create
   */
  export type MissionProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a MissionProgress.
     */
    data: XOR<MissionProgressCreateInput, MissionProgressUncheckedCreateInput>
  }

  /**
   * MissionProgress createMany
   */
  export type MissionProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MissionProgresses.
     */
    data: MissionProgressCreateManyInput | MissionProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MissionProgress createManyAndReturn
   */
  export type MissionProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * The data used to create many MissionProgresses.
     */
    data: MissionProgressCreateManyInput | MissionProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MissionProgress update
   */
  export type MissionProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a MissionProgress.
     */
    data: XOR<MissionProgressUpdateInput, MissionProgressUncheckedUpdateInput>
    /**
     * Choose, which MissionProgress to update.
     */
    where: MissionProgressWhereUniqueInput
  }

  /**
   * MissionProgress updateMany
   */
  export type MissionProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MissionProgresses.
     */
    data: XOR<MissionProgressUpdateManyMutationInput, MissionProgressUncheckedUpdateManyInput>
    /**
     * Filter which MissionProgresses to update
     */
    where?: MissionProgressWhereInput
    /**
     * Limit how many MissionProgresses to update.
     */
    limit?: number
  }

  /**
   * MissionProgress updateManyAndReturn
   */
  export type MissionProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * The data used to update MissionProgresses.
     */
    data: XOR<MissionProgressUpdateManyMutationInput, MissionProgressUncheckedUpdateManyInput>
    /**
     * Filter which MissionProgresses to update
     */
    where?: MissionProgressWhereInput
    /**
     * Limit how many MissionProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MissionProgress upsert
   */
  export type MissionProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the MissionProgress to update in case it exists.
     */
    where: MissionProgressWhereUniqueInput
    /**
     * In case the MissionProgress found by the `where` argument doesn't exist, create a new MissionProgress with this data.
     */
    create: XOR<MissionProgressCreateInput, MissionProgressUncheckedCreateInput>
    /**
     * In case the MissionProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MissionProgressUpdateInput, MissionProgressUncheckedUpdateInput>
  }

  /**
   * MissionProgress delete
   */
  export type MissionProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressInclude<ExtArgs> | null
    /**
     * Filter which MissionProgress to delete.
     */
    where: MissionProgressWhereUniqueInput
  }

  /**
   * MissionProgress deleteMany
   */
  export type MissionProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MissionProgresses to delete
     */
    where?: MissionProgressWhereInput
    /**
     * Limit how many MissionProgresses to delete.
     */
    limit?: number
  }

  /**
   * MissionProgress without action
   */
  export type MissionProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MissionProgress
     */
    select?: MissionProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MissionProgress
     */
    omit?: MissionProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MissionProgressInclude<ExtArgs> | null
  }


  /**
   * Model ScoreEntry
   */

  export type AggregateScoreEntry = {
    _count: ScoreEntryCountAggregateOutputType | null
    _avg: ScoreEntryAvgAggregateOutputType | null
    _sum: ScoreEntrySumAggregateOutputType | null
    _min: ScoreEntryMinAggregateOutputType | null
    _max: ScoreEntryMaxAggregateOutputType | null
  }

  export type ScoreEntryAvgAggregateOutputType = {
    score: number | null
    duration_ms: number | null
  }

  export type ScoreEntrySumAggregateOutputType = {
    score: number | null
    duration_ms: number | null
  }

  export type ScoreEntryMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    mission_id: string | null
    run_id: string | null
    score: number | null
    duration_ms: number | null
    rank: $Enums.MissionRank | null
    difficulty: $Enums.Difficulty | null
    created_at: Date | null
  }

  export type ScoreEntryMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    mission_id: string | null
    run_id: string | null
    score: number | null
    duration_ms: number | null
    rank: $Enums.MissionRank | null
    difficulty: $Enums.Difficulty | null
    created_at: Date | null
  }

  export type ScoreEntryCountAggregateOutputType = {
    id: number
    user_id: number
    mission_id: number
    run_id: number
    score: number
    duration_ms: number
    rank: number
    difficulty: number
    created_at: number
    _all: number
  }


  export type ScoreEntryAvgAggregateInputType = {
    score?: true
    duration_ms?: true
  }

  export type ScoreEntrySumAggregateInputType = {
    score?: true
    duration_ms?: true
  }

  export type ScoreEntryMinAggregateInputType = {
    id?: true
    user_id?: true
    mission_id?: true
    run_id?: true
    score?: true
    duration_ms?: true
    rank?: true
    difficulty?: true
    created_at?: true
  }

  export type ScoreEntryMaxAggregateInputType = {
    id?: true
    user_id?: true
    mission_id?: true
    run_id?: true
    score?: true
    duration_ms?: true
    rank?: true
    difficulty?: true
    created_at?: true
  }

  export type ScoreEntryCountAggregateInputType = {
    id?: true
    user_id?: true
    mission_id?: true
    run_id?: true
    score?: true
    duration_ms?: true
    rank?: true
    difficulty?: true
    created_at?: true
    _all?: true
  }

  export type ScoreEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScoreEntry to aggregate.
     */
    where?: ScoreEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScoreEntries to fetch.
     */
    orderBy?: ScoreEntryOrderByWithRelationInput | ScoreEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScoreEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScoreEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScoreEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ScoreEntries
    **/
    _count?: true | ScoreEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ScoreEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ScoreEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScoreEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScoreEntryMaxAggregateInputType
  }

  export type GetScoreEntryAggregateType<T extends ScoreEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateScoreEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateScoreEntry[P]>
      : GetScalarType<T[P], AggregateScoreEntry[P]>
  }




  export type ScoreEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScoreEntryWhereInput
    orderBy?: ScoreEntryOrderByWithAggregationInput | ScoreEntryOrderByWithAggregationInput[]
    by: ScoreEntryScalarFieldEnum[] | ScoreEntryScalarFieldEnum
    having?: ScoreEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScoreEntryCountAggregateInputType | true
    _avg?: ScoreEntryAvgAggregateInputType
    _sum?: ScoreEntrySumAggregateInputType
    _min?: ScoreEntryMinAggregateInputType
    _max?: ScoreEntryMaxAggregateInputType
  }

  export type ScoreEntryGroupByOutputType = {
    id: string
    user_id: string
    mission_id: string
    run_id: string
    score: number
    duration_ms: number
    rank: $Enums.MissionRank
    difficulty: $Enums.Difficulty
    created_at: Date
    _count: ScoreEntryCountAggregateOutputType | null
    _avg: ScoreEntryAvgAggregateOutputType | null
    _sum: ScoreEntrySumAggregateOutputType | null
    _min: ScoreEntryMinAggregateOutputType | null
    _max: ScoreEntryMaxAggregateOutputType | null
  }

  type GetScoreEntryGroupByPayload<T extends ScoreEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScoreEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScoreEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScoreEntryGroupByOutputType[P]>
            : GetScalarType<T[P], ScoreEntryGroupByOutputType[P]>
        }
      >
    >


  export type ScoreEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    mission_id?: boolean
    run_id?: boolean
    score?: boolean
    duration_ms?: boolean
    rank?: boolean
    difficulty?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scoreEntry"]>

  export type ScoreEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    mission_id?: boolean
    run_id?: boolean
    score?: boolean
    duration_ms?: boolean
    rank?: boolean
    difficulty?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scoreEntry"]>

  export type ScoreEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    mission_id?: boolean
    run_id?: boolean
    score?: boolean
    duration_ms?: boolean
    rank?: boolean
    difficulty?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["scoreEntry"]>

  export type ScoreEntrySelectScalar = {
    id?: boolean
    user_id?: boolean
    mission_id?: boolean
    run_id?: boolean
    score?: boolean
    duration_ms?: boolean
    rank?: boolean
    difficulty?: boolean
    created_at?: boolean
  }

  export type ScoreEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "mission_id" | "run_id" | "score" | "duration_ms" | "rank" | "difficulty" | "created_at", ExtArgs["result"]["scoreEntry"]>
  export type ScoreEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ScoreEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ScoreEntryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $ScoreEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ScoreEntry"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      mission_id: string
      run_id: string
      score: number
      duration_ms: number
      rank: $Enums.MissionRank
      difficulty: $Enums.Difficulty
      created_at: Date
    }, ExtArgs["result"]["scoreEntry"]>
    composites: {}
  }

  type ScoreEntryGetPayload<S extends boolean | null | undefined | ScoreEntryDefaultArgs> = $Result.GetResult<Prisma.$ScoreEntryPayload, S>

  type ScoreEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScoreEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScoreEntryCountAggregateInputType | true
    }

  export interface ScoreEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ScoreEntry'], meta: { name: 'ScoreEntry' } }
    /**
     * Find zero or one ScoreEntry that matches the filter.
     * @param {ScoreEntryFindUniqueArgs} args - Arguments to find a ScoreEntry
     * @example
     * // Get one ScoreEntry
     * const scoreEntry = await prisma.scoreEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScoreEntryFindUniqueArgs>(args: SelectSubset<T, ScoreEntryFindUniqueArgs<ExtArgs>>): Prisma__ScoreEntryClient<$Result.GetResult<Prisma.$ScoreEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ScoreEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScoreEntryFindUniqueOrThrowArgs} args - Arguments to find a ScoreEntry
     * @example
     * // Get one ScoreEntry
     * const scoreEntry = await prisma.scoreEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScoreEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, ScoreEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScoreEntryClient<$Result.GetResult<Prisma.$ScoreEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScoreEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreEntryFindFirstArgs} args - Arguments to find a ScoreEntry
     * @example
     * // Get one ScoreEntry
     * const scoreEntry = await prisma.scoreEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScoreEntryFindFirstArgs>(args?: SelectSubset<T, ScoreEntryFindFirstArgs<ExtArgs>>): Prisma__ScoreEntryClient<$Result.GetResult<Prisma.$ScoreEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ScoreEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreEntryFindFirstOrThrowArgs} args - Arguments to find a ScoreEntry
     * @example
     * // Get one ScoreEntry
     * const scoreEntry = await prisma.scoreEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScoreEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, ScoreEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScoreEntryClient<$Result.GetResult<Prisma.$ScoreEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ScoreEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScoreEntries
     * const scoreEntries = await prisma.scoreEntry.findMany()
     * 
     * // Get first 10 ScoreEntries
     * const scoreEntries = await prisma.scoreEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scoreEntryWithIdOnly = await prisma.scoreEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScoreEntryFindManyArgs>(args?: SelectSubset<T, ScoreEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScoreEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ScoreEntry.
     * @param {ScoreEntryCreateArgs} args - Arguments to create a ScoreEntry.
     * @example
     * // Create one ScoreEntry
     * const ScoreEntry = await prisma.scoreEntry.create({
     *   data: {
     *     // ... data to create a ScoreEntry
     *   }
     * })
     * 
     */
    create<T extends ScoreEntryCreateArgs>(args: SelectSubset<T, ScoreEntryCreateArgs<ExtArgs>>): Prisma__ScoreEntryClient<$Result.GetResult<Prisma.$ScoreEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ScoreEntries.
     * @param {ScoreEntryCreateManyArgs} args - Arguments to create many ScoreEntries.
     * @example
     * // Create many ScoreEntries
     * const scoreEntry = await prisma.scoreEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScoreEntryCreateManyArgs>(args?: SelectSubset<T, ScoreEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ScoreEntries and returns the data saved in the database.
     * @param {ScoreEntryCreateManyAndReturnArgs} args - Arguments to create many ScoreEntries.
     * @example
     * // Create many ScoreEntries
     * const scoreEntry = await prisma.scoreEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ScoreEntries and only return the `id`
     * const scoreEntryWithIdOnly = await prisma.scoreEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScoreEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, ScoreEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScoreEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ScoreEntry.
     * @param {ScoreEntryDeleteArgs} args - Arguments to delete one ScoreEntry.
     * @example
     * // Delete one ScoreEntry
     * const ScoreEntry = await prisma.scoreEntry.delete({
     *   where: {
     *     // ... filter to delete one ScoreEntry
     *   }
     * })
     * 
     */
    delete<T extends ScoreEntryDeleteArgs>(args: SelectSubset<T, ScoreEntryDeleteArgs<ExtArgs>>): Prisma__ScoreEntryClient<$Result.GetResult<Prisma.$ScoreEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ScoreEntry.
     * @param {ScoreEntryUpdateArgs} args - Arguments to update one ScoreEntry.
     * @example
     * // Update one ScoreEntry
     * const scoreEntry = await prisma.scoreEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScoreEntryUpdateArgs>(args: SelectSubset<T, ScoreEntryUpdateArgs<ExtArgs>>): Prisma__ScoreEntryClient<$Result.GetResult<Prisma.$ScoreEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ScoreEntries.
     * @param {ScoreEntryDeleteManyArgs} args - Arguments to filter ScoreEntries to delete.
     * @example
     * // Delete a few ScoreEntries
     * const { count } = await prisma.scoreEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScoreEntryDeleteManyArgs>(args?: SelectSubset<T, ScoreEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScoreEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScoreEntries
     * const scoreEntry = await prisma.scoreEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScoreEntryUpdateManyArgs>(args: SelectSubset<T, ScoreEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ScoreEntries and returns the data updated in the database.
     * @param {ScoreEntryUpdateManyAndReturnArgs} args - Arguments to update many ScoreEntries.
     * @example
     * // Update many ScoreEntries
     * const scoreEntry = await prisma.scoreEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ScoreEntries and only return the `id`
     * const scoreEntryWithIdOnly = await prisma.scoreEntry.updateManyAndReturn({
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
    updateManyAndReturn<T extends ScoreEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, ScoreEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ScoreEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ScoreEntry.
     * @param {ScoreEntryUpsertArgs} args - Arguments to update or create a ScoreEntry.
     * @example
     * // Update or create a ScoreEntry
     * const scoreEntry = await prisma.scoreEntry.upsert({
     *   create: {
     *     // ... data to create a ScoreEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScoreEntry we want to update
     *   }
     * })
     */
    upsert<T extends ScoreEntryUpsertArgs>(args: SelectSubset<T, ScoreEntryUpsertArgs<ExtArgs>>): Prisma__ScoreEntryClient<$Result.GetResult<Prisma.$ScoreEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ScoreEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreEntryCountArgs} args - Arguments to filter ScoreEntries to count.
     * @example
     * // Count the number of ScoreEntries
     * const count = await prisma.scoreEntry.count({
     *   where: {
     *     // ... the filter for the ScoreEntries we want to count
     *   }
     * })
    **/
    count<T extends ScoreEntryCountArgs>(
      args?: Subset<T, ScoreEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScoreEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ScoreEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScoreEntryAggregateArgs>(args: Subset<T, ScoreEntryAggregateArgs>): Prisma.PrismaPromise<GetScoreEntryAggregateType<T>>

    /**
     * Group by ScoreEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScoreEntryGroupByArgs} args - Group by arguments.
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
      T extends ScoreEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScoreEntryGroupByArgs['orderBy'] }
        : { orderBy?: ScoreEntryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ScoreEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScoreEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ScoreEntry model
   */
  readonly fields: ScoreEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ScoreEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScoreEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the ScoreEntry model
   */
  interface ScoreEntryFieldRefs {
    readonly id: FieldRef<"ScoreEntry", 'String'>
    readonly user_id: FieldRef<"ScoreEntry", 'String'>
    readonly mission_id: FieldRef<"ScoreEntry", 'String'>
    readonly run_id: FieldRef<"ScoreEntry", 'String'>
    readonly score: FieldRef<"ScoreEntry", 'Int'>
    readonly duration_ms: FieldRef<"ScoreEntry", 'Int'>
    readonly rank: FieldRef<"ScoreEntry", 'MissionRank'>
    readonly difficulty: FieldRef<"ScoreEntry", 'Difficulty'>
    readonly created_at: FieldRef<"ScoreEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ScoreEntry findUnique
   */
  export type ScoreEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryInclude<ExtArgs> | null
    /**
     * Filter, which ScoreEntry to fetch.
     */
    where: ScoreEntryWhereUniqueInput
  }

  /**
   * ScoreEntry findUniqueOrThrow
   */
  export type ScoreEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryInclude<ExtArgs> | null
    /**
     * Filter, which ScoreEntry to fetch.
     */
    where: ScoreEntryWhereUniqueInput
  }

  /**
   * ScoreEntry findFirst
   */
  export type ScoreEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryInclude<ExtArgs> | null
    /**
     * Filter, which ScoreEntry to fetch.
     */
    where?: ScoreEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScoreEntries to fetch.
     */
    orderBy?: ScoreEntryOrderByWithRelationInput | ScoreEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScoreEntries.
     */
    cursor?: ScoreEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScoreEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScoreEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScoreEntries.
     */
    distinct?: ScoreEntryScalarFieldEnum | ScoreEntryScalarFieldEnum[]
  }

  /**
   * ScoreEntry findFirstOrThrow
   */
  export type ScoreEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryInclude<ExtArgs> | null
    /**
     * Filter, which ScoreEntry to fetch.
     */
    where?: ScoreEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScoreEntries to fetch.
     */
    orderBy?: ScoreEntryOrderByWithRelationInput | ScoreEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ScoreEntries.
     */
    cursor?: ScoreEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScoreEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScoreEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ScoreEntries.
     */
    distinct?: ScoreEntryScalarFieldEnum | ScoreEntryScalarFieldEnum[]
  }

  /**
   * ScoreEntry findMany
   */
  export type ScoreEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryInclude<ExtArgs> | null
    /**
     * Filter, which ScoreEntries to fetch.
     */
    where?: ScoreEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ScoreEntries to fetch.
     */
    orderBy?: ScoreEntryOrderByWithRelationInput | ScoreEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ScoreEntries.
     */
    cursor?: ScoreEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ScoreEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ScoreEntries.
     */
    skip?: number
    distinct?: ScoreEntryScalarFieldEnum | ScoreEntryScalarFieldEnum[]
  }

  /**
   * ScoreEntry create
   */
  export type ScoreEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a ScoreEntry.
     */
    data: XOR<ScoreEntryCreateInput, ScoreEntryUncheckedCreateInput>
  }

  /**
   * ScoreEntry createMany
   */
  export type ScoreEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScoreEntries.
     */
    data: ScoreEntryCreateManyInput | ScoreEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ScoreEntry createManyAndReturn
   */
  export type ScoreEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * The data used to create many ScoreEntries.
     */
    data: ScoreEntryCreateManyInput | ScoreEntryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ScoreEntry update
   */
  export type ScoreEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a ScoreEntry.
     */
    data: XOR<ScoreEntryUpdateInput, ScoreEntryUncheckedUpdateInput>
    /**
     * Choose, which ScoreEntry to update.
     */
    where: ScoreEntryWhereUniqueInput
  }

  /**
   * ScoreEntry updateMany
   */
  export type ScoreEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ScoreEntries.
     */
    data: XOR<ScoreEntryUpdateManyMutationInput, ScoreEntryUncheckedUpdateManyInput>
    /**
     * Filter which ScoreEntries to update
     */
    where?: ScoreEntryWhereInput
    /**
     * Limit how many ScoreEntries to update.
     */
    limit?: number
  }

  /**
   * ScoreEntry updateManyAndReturn
   */
  export type ScoreEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * The data used to update ScoreEntries.
     */
    data: XOR<ScoreEntryUpdateManyMutationInput, ScoreEntryUncheckedUpdateManyInput>
    /**
     * Filter which ScoreEntries to update
     */
    where?: ScoreEntryWhereInput
    /**
     * Limit how many ScoreEntries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ScoreEntry upsert
   */
  export type ScoreEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the ScoreEntry to update in case it exists.
     */
    where: ScoreEntryWhereUniqueInput
    /**
     * In case the ScoreEntry found by the `where` argument doesn't exist, create a new ScoreEntry with this data.
     */
    create: XOR<ScoreEntryCreateInput, ScoreEntryUncheckedCreateInput>
    /**
     * In case the ScoreEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScoreEntryUpdateInput, ScoreEntryUncheckedUpdateInput>
  }

  /**
   * ScoreEntry delete
   */
  export type ScoreEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryInclude<ExtArgs> | null
    /**
     * Filter which ScoreEntry to delete.
     */
    where: ScoreEntryWhereUniqueInput
  }

  /**
   * ScoreEntry deleteMany
   */
  export type ScoreEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ScoreEntries to delete
     */
    where?: ScoreEntryWhereInput
    /**
     * Limit how many ScoreEntries to delete.
     */
    limit?: number
  }

  /**
   * ScoreEntry without action
   */
  export type ScoreEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScoreEntry
     */
    select?: ScoreEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the ScoreEntry
     */
    omit?: ScoreEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScoreEntryInclude<ExtArgs> | null
  }


  /**
   * Model UnlockedCharacter
   */

  export type AggregateUnlockedCharacter = {
    _count: UnlockedCharacterCountAggregateOutputType | null
    _min: UnlockedCharacterMinAggregateOutputType | null
    _max: UnlockedCharacterMaxAggregateOutputType | null
  }

  export type UnlockedCharacterMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    character_id: string | null
    source: string | null
    unlocked_at: Date | null
  }

  export type UnlockedCharacterMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    character_id: string | null
    source: string | null
    unlocked_at: Date | null
  }

  export type UnlockedCharacterCountAggregateOutputType = {
    id: number
    user_id: number
    character_id: number
    source: number
    unlocked_at: number
    _all: number
  }


  export type UnlockedCharacterMinAggregateInputType = {
    id?: true
    user_id?: true
    character_id?: true
    source?: true
    unlocked_at?: true
  }

  export type UnlockedCharacterMaxAggregateInputType = {
    id?: true
    user_id?: true
    character_id?: true
    source?: true
    unlocked_at?: true
  }

  export type UnlockedCharacterCountAggregateInputType = {
    id?: true
    user_id?: true
    character_id?: true
    source?: true
    unlocked_at?: true
    _all?: true
  }

  export type UnlockedCharacterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnlockedCharacter to aggregate.
     */
    where?: UnlockedCharacterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnlockedCharacters to fetch.
     */
    orderBy?: UnlockedCharacterOrderByWithRelationInput | UnlockedCharacterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UnlockedCharacterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnlockedCharacters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnlockedCharacters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UnlockedCharacters
    **/
    _count?: true | UnlockedCharacterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UnlockedCharacterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UnlockedCharacterMaxAggregateInputType
  }

  export type GetUnlockedCharacterAggregateType<T extends UnlockedCharacterAggregateArgs> = {
        [P in keyof T & keyof AggregateUnlockedCharacter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUnlockedCharacter[P]>
      : GetScalarType<T[P], AggregateUnlockedCharacter[P]>
  }




  export type UnlockedCharacterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UnlockedCharacterWhereInput
    orderBy?: UnlockedCharacterOrderByWithAggregationInput | UnlockedCharacterOrderByWithAggregationInput[]
    by: UnlockedCharacterScalarFieldEnum[] | UnlockedCharacterScalarFieldEnum
    having?: UnlockedCharacterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UnlockedCharacterCountAggregateInputType | true
    _min?: UnlockedCharacterMinAggregateInputType
    _max?: UnlockedCharacterMaxAggregateInputType
  }

  export type UnlockedCharacterGroupByOutputType = {
    id: string
    user_id: string
    character_id: string
    source: string
    unlocked_at: Date
    _count: UnlockedCharacterCountAggregateOutputType | null
    _min: UnlockedCharacterMinAggregateOutputType | null
    _max: UnlockedCharacterMaxAggregateOutputType | null
  }

  type GetUnlockedCharacterGroupByPayload<T extends UnlockedCharacterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UnlockedCharacterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UnlockedCharacterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UnlockedCharacterGroupByOutputType[P]>
            : GetScalarType<T[P], UnlockedCharacterGroupByOutputType[P]>
        }
      >
    >


  export type UnlockedCharacterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    character_id?: boolean
    source?: boolean
    unlocked_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["unlockedCharacter"]>

  export type UnlockedCharacterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    character_id?: boolean
    source?: boolean
    unlocked_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["unlockedCharacter"]>

  export type UnlockedCharacterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    character_id?: boolean
    source?: boolean
    unlocked_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["unlockedCharacter"]>

  export type UnlockedCharacterSelectScalar = {
    id?: boolean
    user_id?: boolean
    character_id?: boolean
    source?: boolean
    unlocked_at?: boolean
  }

  export type UnlockedCharacterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "character_id" | "source" | "unlocked_at", ExtArgs["result"]["unlockedCharacter"]>
  export type UnlockedCharacterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UnlockedCharacterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UnlockedCharacterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UnlockedCharacterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UnlockedCharacter"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      character_id: string
      source: string
      unlocked_at: Date
    }, ExtArgs["result"]["unlockedCharacter"]>
    composites: {}
  }

  type UnlockedCharacterGetPayload<S extends boolean | null | undefined | UnlockedCharacterDefaultArgs> = $Result.GetResult<Prisma.$UnlockedCharacterPayload, S>

  type UnlockedCharacterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UnlockedCharacterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UnlockedCharacterCountAggregateInputType | true
    }

  export interface UnlockedCharacterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UnlockedCharacter'], meta: { name: 'UnlockedCharacter' } }
    /**
     * Find zero or one UnlockedCharacter that matches the filter.
     * @param {UnlockedCharacterFindUniqueArgs} args - Arguments to find a UnlockedCharacter
     * @example
     * // Get one UnlockedCharacter
     * const unlockedCharacter = await prisma.unlockedCharacter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UnlockedCharacterFindUniqueArgs>(args: SelectSubset<T, UnlockedCharacterFindUniqueArgs<ExtArgs>>): Prisma__UnlockedCharacterClient<$Result.GetResult<Prisma.$UnlockedCharacterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UnlockedCharacter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UnlockedCharacterFindUniqueOrThrowArgs} args - Arguments to find a UnlockedCharacter
     * @example
     * // Get one UnlockedCharacter
     * const unlockedCharacter = await prisma.unlockedCharacter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UnlockedCharacterFindUniqueOrThrowArgs>(args: SelectSubset<T, UnlockedCharacterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UnlockedCharacterClient<$Result.GetResult<Prisma.$UnlockedCharacterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UnlockedCharacter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnlockedCharacterFindFirstArgs} args - Arguments to find a UnlockedCharacter
     * @example
     * // Get one UnlockedCharacter
     * const unlockedCharacter = await prisma.unlockedCharacter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UnlockedCharacterFindFirstArgs>(args?: SelectSubset<T, UnlockedCharacterFindFirstArgs<ExtArgs>>): Prisma__UnlockedCharacterClient<$Result.GetResult<Prisma.$UnlockedCharacterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UnlockedCharacter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnlockedCharacterFindFirstOrThrowArgs} args - Arguments to find a UnlockedCharacter
     * @example
     * // Get one UnlockedCharacter
     * const unlockedCharacter = await prisma.unlockedCharacter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UnlockedCharacterFindFirstOrThrowArgs>(args?: SelectSubset<T, UnlockedCharacterFindFirstOrThrowArgs<ExtArgs>>): Prisma__UnlockedCharacterClient<$Result.GetResult<Prisma.$UnlockedCharacterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UnlockedCharacters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnlockedCharacterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UnlockedCharacters
     * const unlockedCharacters = await prisma.unlockedCharacter.findMany()
     * 
     * // Get first 10 UnlockedCharacters
     * const unlockedCharacters = await prisma.unlockedCharacter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const unlockedCharacterWithIdOnly = await prisma.unlockedCharacter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UnlockedCharacterFindManyArgs>(args?: SelectSubset<T, UnlockedCharacterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnlockedCharacterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UnlockedCharacter.
     * @param {UnlockedCharacterCreateArgs} args - Arguments to create a UnlockedCharacter.
     * @example
     * // Create one UnlockedCharacter
     * const UnlockedCharacter = await prisma.unlockedCharacter.create({
     *   data: {
     *     // ... data to create a UnlockedCharacter
     *   }
     * })
     * 
     */
    create<T extends UnlockedCharacterCreateArgs>(args: SelectSubset<T, UnlockedCharacterCreateArgs<ExtArgs>>): Prisma__UnlockedCharacterClient<$Result.GetResult<Prisma.$UnlockedCharacterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UnlockedCharacters.
     * @param {UnlockedCharacterCreateManyArgs} args - Arguments to create many UnlockedCharacters.
     * @example
     * // Create many UnlockedCharacters
     * const unlockedCharacter = await prisma.unlockedCharacter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UnlockedCharacterCreateManyArgs>(args?: SelectSubset<T, UnlockedCharacterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UnlockedCharacters and returns the data saved in the database.
     * @param {UnlockedCharacterCreateManyAndReturnArgs} args - Arguments to create many UnlockedCharacters.
     * @example
     * // Create many UnlockedCharacters
     * const unlockedCharacter = await prisma.unlockedCharacter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UnlockedCharacters and only return the `id`
     * const unlockedCharacterWithIdOnly = await prisma.unlockedCharacter.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UnlockedCharacterCreateManyAndReturnArgs>(args?: SelectSubset<T, UnlockedCharacterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnlockedCharacterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UnlockedCharacter.
     * @param {UnlockedCharacterDeleteArgs} args - Arguments to delete one UnlockedCharacter.
     * @example
     * // Delete one UnlockedCharacter
     * const UnlockedCharacter = await prisma.unlockedCharacter.delete({
     *   where: {
     *     // ... filter to delete one UnlockedCharacter
     *   }
     * })
     * 
     */
    delete<T extends UnlockedCharacterDeleteArgs>(args: SelectSubset<T, UnlockedCharacterDeleteArgs<ExtArgs>>): Prisma__UnlockedCharacterClient<$Result.GetResult<Prisma.$UnlockedCharacterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UnlockedCharacter.
     * @param {UnlockedCharacterUpdateArgs} args - Arguments to update one UnlockedCharacter.
     * @example
     * // Update one UnlockedCharacter
     * const unlockedCharacter = await prisma.unlockedCharacter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UnlockedCharacterUpdateArgs>(args: SelectSubset<T, UnlockedCharacterUpdateArgs<ExtArgs>>): Prisma__UnlockedCharacterClient<$Result.GetResult<Prisma.$UnlockedCharacterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UnlockedCharacters.
     * @param {UnlockedCharacterDeleteManyArgs} args - Arguments to filter UnlockedCharacters to delete.
     * @example
     * // Delete a few UnlockedCharacters
     * const { count } = await prisma.unlockedCharacter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UnlockedCharacterDeleteManyArgs>(args?: SelectSubset<T, UnlockedCharacterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UnlockedCharacters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnlockedCharacterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UnlockedCharacters
     * const unlockedCharacter = await prisma.unlockedCharacter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UnlockedCharacterUpdateManyArgs>(args: SelectSubset<T, UnlockedCharacterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UnlockedCharacters and returns the data updated in the database.
     * @param {UnlockedCharacterUpdateManyAndReturnArgs} args - Arguments to update many UnlockedCharacters.
     * @example
     * // Update many UnlockedCharacters
     * const unlockedCharacter = await prisma.unlockedCharacter.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UnlockedCharacters and only return the `id`
     * const unlockedCharacterWithIdOnly = await prisma.unlockedCharacter.updateManyAndReturn({
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
    updateManyAndReturn<T extends UnlockedCharacterUpdateManyAndReturnArgs>(args: SelectSubset<T, UnlockedCharacterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnlockedCharacterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UnlockedCharacter.
     * @param {UnlockedCharacterUpsertArgs} args - Arguments to update or create a UnlockedCharacter.
     * @example
     * // Update or create a UnlockedCharacter
     * const unlockedCharacter = await prisma.unlockedCharacter.upsert({
     *   create: {
     *     // ... data to create a UnlockedCharacter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UnlockedCharacter we want to update
     *   }
     * })
     */
    upsert<T extends UnlockedCharacterUpsertArgs>(args: SelectSubset<T, UnlockedCharacterUpsertArgs<ExtArgs>>): Prisma__UnlockedCharacterClient<$Result.GetResult<Prisma.$UnlockedCharacterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UnlockedCharacters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnlockedCharacterCountArgs} args - Arguments to filter UnlockedCharacters to count.
     * @example
     * // Count the number of UnlockedCharacters
     * const count = await prisma.unlockedCharacter.count({
     *   where: {
     *     // ... the filter for the UnlockedCharacters we want to count
     *   }
     * })
    **/
    count<T extends UnlockedCharacterCountArgs>(
      args?: Subset<T, UnlockedCharacterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UnlockedCharacterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UnlockedCharacter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnlockedCharacterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UnlockedCharacterAggregateArgs>(args: Subset<T, UnlockedCharacterAggregateArgs>): Prisma.PrismaPromise<GetUnlockedCharacterAggregateType<T>>

    /**
     * Group by UnlockedCharacter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnlockedCharacterGroupByArgs} args - Group by arguments.
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
      T extends UnlockedCharacterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UnlockedCharacterGroupByArgs['orderBy'] }
        : { orderBy?: UnlockedCharacterGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UnlockedCharacterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUnlockedCharacterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UnlockedCharacter model
   */
  readonly fields: UnlockedCharacterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UnlockedCharacter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UnlockedCharacterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UnlockedCharacter model
   */
  interface UnlockedCharacterFieldRefs {
    readonly id: FieldRef<"UnlockedCharacter", 'String'>
    readonly user_id: FieldRef<"UnlockedCharacter", 'String'>
    readonly character_id: FieldRef<"UnlockedCharacter", 'String'>
    readonly source: FieldRef<"UnlockedCharacter", 'String'>
    readonly unlocked_at: FieldRef<"UnlockedCharacter", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UnlockedCharacter findUnique
   */
  export type UnlockedCharacterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterInclude<ExtArgs> | null
    /**
     * Filter, which UnlockedCharacter to fetch.
     */
    where: UnlockedCharacterWhereUniqueInput
  }

  /**
   * UnlockedCharacter findUniqueOrThrow
   */
  export type UnlockedCharacterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterInclude<ExtArgs> | null
    /**
     * Filter, which UnlockedCharacter to fetch.
     */
    where: UnlockedCharacterWhereUniqueInput
  }

  /**
   * UnlockedCharacter findFirst
   */
  export type UnlockedCharacterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterInclude<ExtArgs> | null
    /**
     * Filter, which UnlockedCharacter to fetch.
     */
    where?: UnlockedCharacterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnlockedCharacters to fetch.
     */
    orderBy?: UnlockedCharacterOrderByWithRelationInput | UnlockedCharacterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnlockedCharacters.
     */
    cursor?: UnlockedCharacterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnlockedCharacters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnlockedCharacters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnlockedCharacters.
     */
    distinct?: UnlockedCharacterScalarFieldEnum | UnlockedCharacterScalarFieldEnum[]
  }

  /**
   * UnlockedCharacter findFirstOrThrow
   */
  export type UnlockedCharacterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterInclude<ExtArgs> | null
    /**
     * Filter, which UnlockedCharacter to fetch.
     */
    where?: UnlockedCharacterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnlockedCharacters to fetch.
     */
    orderBy?: UnlockedCharacterOrderByWithRelationInput | UnlockedCharacterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UnlockedCharacters.
     */
    cursor?: UnlockedCharacterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnlockedCharacters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnlockedCharacters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UnlockedCharacters.
     */
    distinct?: UnlockedCharacterScalarFieldEnum | UnlockedCharacterScalarFieldEnum[]
  }

  /**
   * UnlockedCharacter findMany
   */
  export type UnlockedCharacterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterInclude<ExtArgs> | null
    /**
     * Filter, which UnlockedCharacters to fetch.
     */
    where?: UnlockedCharacterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UnlockedCharacters to fetch.
     */
    orderBy?: UnlockedCharacterOrderByWithRelationInput | UnlockedCharacterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UnlockedCharacters.
     */
    cursor?: UnlockedCharacterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UnlockedCharacters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UnlockedCharacters.
     */
    skip?: number
    distinct?: UnlockedCharacterScalarFieldEnum | UnlockedCharacterScalarFieldEnum[]
  }

  /**
   * UnlockedCharacter create
   */
  export type UnlockedCharacterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterInclude<ExtArgs> | null
    /**
     * The data needed to create a UnlockedCharacter.
     */
    data: XOR<UnlockedCharacterCreateInput, UnlockedCharacterUncheckedCreateInput>
  }

  /**
   * UnlockedCharacter createMany
   */
  export type UnlockedCharacterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UnlockedCharacters.
     */
    data: UnlockedCharacterCreateManyInput | UnlockedCharacterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UnlockedCharacter createManyAndReturn
   */
  export type UnlockedCharacterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * The data used to create many UnlockedCharacters.
     */
    data: UnlockedCharacterCreateManyInput | UnlockedCharacterCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UnlockedCharacter update
   */
  export type UnlockedCharacterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterInclude<ExtArgs> | null
    /**
     * The data needed to update a UnlockedCharacter.
     */
    data: XOR<UnlockedCharacterUpdateInput, UnlockedCharacterUncheckedUpdateInput>
    /**
     * Choose, which UnlockedCharacter to update.
     */
    where: UnlockedCharacterWhereUniqueInput
  }

  /**
   * UnlockedCharacter updateMany
   */
  export type UnlockedCharacterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UnlockedCharacters.
     */
    data: XOR<UnlockedCharacterUpdateManyMutationInput, UnlockedCharacterUncheckedUpdateManyInput>
    /**
     * Filter which UnlockedCharacters to update
     */
    where?: UnlockedCharacterWhereInput
    /**
     * Limit how many UnlockedCharacters to update.
     */
    limit?: number
  }

  /**
   * UnlockedCharacter updateManyAndReturn
   */
  export type UnlockedCharacterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * The data used to update UnlockedCharacters.
     */
    data: XOR<UnlockedCharacterUpdateManyMutationInput, UnlockedCharacterUncheckedUpdateManyInput>
    /**
     * Filter which UnlockedCharacters to update
     */
    where?: UnlockedCharacterWhereInput
    /**
     * Limit how many UnlockedCharacters to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UnlockedCharacter upsert
   */
  export type UnlockedCharacterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterInclude<ExtArgs> | null
    /**
     * The filter to search for the UnlockedCharacter to update in case it exists.
     */
    where: UnlockedCharacterWhereUniqueInput
    /**
     * In case the UnlockedCharacter found by the `where` argument doesn't exist, create a new UnlockedCharacter with this data.
     */
    create: XOR<UnlockedCharacterCreateInput, UnlockedCharacterUncheckedCreateInput>
    /**
     * In case the UnlockedCharacter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UnlockedCharacterUpdateInput, UnlockedCharacterUncheckedUpdateInput>
  }

  /**
   * UnlockedCharacter delete
   */
  export type UnlockedCharacterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterInclude<ExtArgs> | null
    /**
     * Filter which UnlockedCharacter to delete.
     */
    where: UnlockedCharacterWhereUniqueInput
  }

  /**
   * UnlockedCharacter deleteMany
   */
  export type UnlockedCharacterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UnlockedCharacters to delete
     */
    where?: UnlockedCharacterWhereInput
    /**
     * Limit how many UnlockedCharacters to delete.
     */
    limit?: number
  }

  /**
   * UnlockedCharacter without action
   */
  export type UnlockedCharacterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnlockedCharacter
     */
    select?: UnlockedCharacterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UnlockedCharacter
     */
    omit?: UnlockedCharacterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UnlockedCharacterInclude<ExtArgs> | null
  }


  /**
   * Model GameRun
   */

  export type AggregateGameRun = {
    _count: GameRunCountAggregateOutputType | null
    _min: GameRunMinAggregateOutputType | null
    _max: GameRunMaxAggregateOutputType | null
  }

  export type GameRunMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    mission_id: string | null
    status: $Enums.GameRunStatus | null
    started_at: Date | null
    completed_at: Date | null
  }

  export type GameRunMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    mission_id: string | null
    status: $Enums.GameRunStatus | null
    started_at: Date | null
    completed_at: Date | null
  }

  export type GameRunCountAggregateOutputType = {
    id: number
    user_id: number
    mission_id: number
    status: number
    started_at: number
    completed_at: number
    _all: number
  }


  export type GameRunMinAggregateInputType = {
    id?: true
    user_id?: true
    mission_id?: true
    status?: true
    started_at?: true
    completed_at?: true
  }

  export type GameRunMaxAggregateInputType = {
    id?: true
    user_id?: true
    mission_id?: true
    status?: true
    started_at?: true
    completed_at?: true
  }

  export type GameRunCountAggregateInputType = {
    id?: true
    user_id?: true
    mission_id?: true
    status?: true
    started_at?: true
    completed_at?: true
    _all?: true
  }

  export type GameRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameRun to aggregate.
     */
    where?: GameRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRuns to fetch.
     */
    orderBy?: GameRunOrderByWithRelationInput | GameRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameRuns
    **/
    _count?: true | GameRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameRunMaxAggregateInputType
  }

  export type GetGameRunAggregateType<T extends GameRunAggregateArgs> = {
        [P in keyof T & keyof AggregateGameRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameRun[P]>
      : GetScalarType<T[P], AggregateGameRun[P]>
  }




  export type GameRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameRunWhereInput
    orderBy?: GameRunOrderByWithAggregationInput | GameRunOrderByWithAggregationInput[]
    by: GameRunScalarFieldEnum[] | GameRunScalarFieldEnum
    having?: GameRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameRunCountAggregateInputType | true
    _min?: GameRunMinAggregateInputType
    _max?: GameRunMaxAggregateInputType
  }

  export type GameRunGroupByOutputType = {
    id: string
    user_id: string
    mission_id: string
    status: $Enums.GameRunStatus
    started_at: Date
    completed_at: Date | null
    _count: GameRunCountAggregateOutputType | null
    _min: GameRunMinAggregateOutputType | null
    _max: GameRunMaxAggregateOutputType | null
  }

  type GetGameRunGroupByPayload<T extends GameRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameRunGroupByOutputType[P]>
            : GetScalarType<T[P], GameRunGroupByOutputType[P]>
        }
      >
    >


  export type GameRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    mission_id?: boolean
    status?: boolean
    started_at?: boolean
    completed_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameRun"]>

  export type GameRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    mission_id?: boolean
    status?: boolean
    started_at?: boolean
    completed_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameRun"]>

  export type GameRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    mission_id?: boolean
    status?: boolean
    started_at?: boolean
    completed_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameRun"]>

  export type GameRunSelectScalar = {
    id?: boolean
    user_id?: boolean
    mission_id?: boolean
    status?: boolean
    started_at?: boolean
    completed_at?: boolean
  }

  export type GameRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "mission_id" | "status" | "started_at" | "completed_at", ExtArgs["result"]["gameRun"]>
  export type GameRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type GameRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type GameRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $GameRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameRun"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      mission_id: string
      status: $Enums.GameRunStatus
      started_at: Date
      completed_at: Date | null
    }, ExtArgs["result"]["gameRun"]>
    composites: {}
  }

  type GameRunGetPayload<S extends boolean | null | undefined | GameRunDefaultArgs> = $Result.GetResult<Prisma.$GameRunPayload, S>

  type GameRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameRunCountAggregateInputType | true
    }

  export interface GameRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameRun'], meta: { name: 'GameRun' } }
    /**
     * Find zero or one GameRun that matches the filter.
     * @param {GameRunFindUniqueArgs} args - Arguments to find a GameRun
     * @example
     * // Get one GameRun
     * const gameRun = await prisma.gameRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameRunFindUniqueArgs>(args: SelectSubset<T, GameRunFindUniqueArgs<ExtArgs>>): Prisma__GameRunClient<$Result.GetResult<Prisma.$GameRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameRunFindUniqueOrThrowArgs} args - Arguments to find a GameRun
     * @example
     * // Get one GameRun
     * const gameRun = await prisma.gameRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameRunFindUniqueOrThrowArgs>(args: SelectSubset<T, GameRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameRunClient<$Result.GetResult<Prisma.$GameRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRunFindFirstArgs} args - Arguments to find a GameRun
     * @example
     * // Get one GameRun
     * const gameRun = await prisma.gameRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameRunFindFirstArgs>(args?: SelectSubset<T, GameRunFindFirstArgs<ExtArgs>>): Prisma__GameRunClient<$Result.GetResult<Prisma.$GameRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRunFindFirstOrThrowArgs} args - Arguments to find a GameRun
     * @example
     * // Get one GameRun
     * const gameRun = await prisma.gameRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameRunFindFirstOrThrowArgs>(args?: SelectSubset<T, GameRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameRunClient<$Result.GetResult<Prisma.$GameRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameRuns
     * const gameRuns = await prisma.gameRun.findMany()
     * 
     * // Get first 10 GameRuns
     * const gameRuns = await prisma.gameRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameRunWithIdOnly = await prisma.gameRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameRunFindManyArgs>(args?: SelectSubset<T, GameRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameRun.
     * @param {GameRunCreateArgs} args - Arguments to create a GameRun.
     * @example
     * // Create one GameRun
     * const GameRun = await prisma.gameRun.create({
     *   data: {
     *     // ... data to create a GameRun
     *   }
     * })
     * 
     */
    create<T extends GameRunCreateArgs>(args: SelectSubset<T, GameRunCreateArgs<ExtArgs>>): Prisma__GameRunClient<$Result.GetResult<Prisma.$GameRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameRuns.
     * @param {GameRunCreateManyArgs} args - Arguments to create many GameRuns.
     * @example
     * // Create many GameRuns
     * const gameRun = await prisma.gameRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameRunCreateManyArgs>(args?: SelectSubset<T, GameRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameRuns and returns the data saved in the database.
     * @param {GameRunCreateManyAndReturnArgs} args - Arguments to create many GameRuns.
     * @example
     * // Create many GameRuns
     * const gameRun = await prisma.gameRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameRuns and only return the `id`
     * const gameRunWithIdOnly = await prisma.gameRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameRunCreateManyAndReturnArgs>(args?: SelectSubset<T, GameRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameRun.
     * @param {GameRunDeleteArgs} args - Arguments to delete one GameRun.
     * @example
     * // Delete one GameRun
     * const GameRun = await prisma.gameRun.delete({
     *   where: {
     *     // ... filter to delete one GameRun
     *   }
     * })
     * 
     */
    delete<T extends GameRunDeleteArgs>(args: SelectSubset<T, GameRunDeleteArgs<ExtArgs>>): Prisma__GameRunClient<$Result.GetResult<Prisma.$GameRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameRun.
     * @param {GameRunUpdateArgs} args - Arguments to update one GameRun.
     * @example
     * // Update one GameRun
     * const gameRun = await prisma.gameRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameRunUpdateArgs>(args: SelectSubset<T, GameRunUpdateArgs<ExtArgs>>): Prisma__GameRunClient<$Result.GetResult<Prisma.$GameRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameRuns.
     * @param {GameRunDeleteManyArgs} args - Arguments to filter GameRuns to delete.
     * @example
     * // Delete a few GameRuns
     * const { count } = await prisma.gameRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameRunDeleteManyArgs>(args?: SelectSubset<T, GameRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameRuns
     * const gameRun = await prisma.gameRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameRunUpdateManyArgs>(args: SelectSubset<T, GameRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameRuns and returns the data updated in the database.
     * @param {GameRunUpdateManyAndReturnArgs} args - Arguments to update many GameRuns.
     * @example
     * // Update many GameRuns
     * const gameRun = await prisma.gameRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameRuns and only return the `id`
     * const gameRunWithIdOnly = await prisma.gameRun.updateManyAndReturn({
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
    updateManyAndReturn<T extends GameRunUpdateManyAndReturnArgs>(args: SelectSubset<T, GameRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameRun.
     * @param {GameRunUpsertArgs} args - Arguments to update or create a GameRun.
     * @example
     * // Update or create a GameRun
     * const gameRun = await prisma.gameRun.upsert({
     *   create: {
     *     // ... data to create a GameRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameRun we want to update
     *   }
     * })
     */
    upsert<T extends GameRunUpsertArgs>(args: SelectSubset<T, GameRunUpsertArgs<ExtArgs>>): Prisma__GameRunClient<$Result.GetResult<Prisma.$GameRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRunCountArgs} args - Arguments to filter GameRuns to count.
     * @example
     * // Count the number of GameRuns
     * const count = await prisma.gameRun.count({
     *   where: {
     *     // ... the filter for the GameRuns we want to count
     *   }
     * })
    **/
    count<T extends GameRunCountArgs>(
      args?: Subset<T, GameRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends GameRunAggregateArgs>(args: Subset<T, GameRunAggregateArgs>): Prisma.PrismaPromise<GetGameRunAggregateType<T>>

    /**
     * Group by GameRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRunGroupByArgs} args - Group by arguments.
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
      T extends GameRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameRunGroupByArgs['orderBy'] }
        : { orderBy?: GameRunGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, GameRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameRun model
   */
  readonly fields: GameRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the GameRun model
   */
  interface GameRunFieldRefs {
    readonly id: FieldRef<"GameRun", 'String'>
    readonly user_id: FieldRef<"GameRun", 'String'>
    readonly mission_id: FieldRef<"GameRun", 'String'>
    readonly status: FieldRef<"GameRun", 'GameRunStatus'>
    readonly started_at: FieldRef<"GameRun", 'DateTime'>
    readonly completed_at: FieldRef<"GameRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameRun findUnique
   */
  export type GameRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunInclude<ExtArgs> | null
    /**
     * Filter, which GameRun to fetch.
     */
    where: GameRunWhereUniqueInput
  }

  /**
   * GameRun findUniqueOrThrow
   */
  export type GameRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunInclude<ExtArgs> | null
    /**
     * Filter, which GameRun to fetch.
     */
    where: GameRunWhereUniqueInput
  }

  /**
   * GameRun findFirst
   */
  export type GameRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunInclude<ExtArgs> | null
    /**
     * Filter, which GameRun to fetch.
     */
    where?: GameRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRuns to fetch.
     */
    orderBy?: GameRunOrderByWithRelationInput | GameRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameRuns.
     */
    cursor?: GameRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameRuns.
     */
    distinct?: GameRunScalarFieldEnum | GameRunScalarFieldEnum[]
  }

  /**
   * GameRun findFirstOrThrow
   */
  export type GameRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunInclude<ExtArgs> | null
    /**
     * Filter, which GameRun to fetch.
     */
    where?: GameRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRuns to fetch.
     */
    orderBy?: GameRunOrderByWithRelationInput | GameRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameRuns.
     */
    cursor?: GameRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameRuns.
     */
    distinct?: GameRunScalarFieldEnum | GameRunScalarFieldEnum[]
  }

  /**
   * GameRun findMany
   */
  export type GameRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunInclude<ExtArgs> | null
    /**
     * Filter, which GameRuns to fetch.
     */
    where?: GameRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRuns to fetch.
     */
    orderBy?: GameRunOrderByWithRelationInput | GameRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameRuns.
     */
    cursor?: GameRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRuns.
     */
    skip?: number
    distinct?: GameRunScalarFieldEnum | GameRunScalarFieldEnum[]
  }

  /**
   * GameRun create
   */
  export type GameRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunInclude<ExtArgs> | null
    /**
     * The data needed to create a GameRun.
     */
    data: XOR<GameRunCreateInput, GameRunUncheckedCreateInput>
  }

  /**
   * GameRun createMany
   */
  export type GameRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameRuns.
     */
    data: GameRunCreateManyInput | GameRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameRun createManyAndReturn
   */
  export type GameRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * The data used to create many GameRuns.
     */
    data: GameRunCreateManyInput | GameRunCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameRun update
   */
  export type GameRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunInclude<ExtArgs> | null
    /**
     * The data needed to update a GameRun.
     */
    data: XOR<GameRunUpdateInput, GameRunUncheckedUpdateInput>
    /**
     * Choose, which GameRun to update.
     */
    where: GameRunWhereUniqueInput
  }

  /**
   * GameRun updateMany
   */
  export type GameRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameRuns.
     */
    data: XOR<GameRunUpdateManyMutationInput, GameRunUncheckedUpdateManyInput>
    /**
     * Filter which GameRuns to update
     */
    where?: GameRunWhereInput
    /**
     * Limit how many GameRuns to update.
     */
    limit?: number
  }

  /**
   * GameRun updateManyAndReturn
   */
  export type GameRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * The data used to update GameRuns.
     */
    data: XOR<GameRunUpdateManyMutationInput, GameRunUncheckedUpdateManyInput>
    /**
     * Filter which GameRuns to update
     */
    where?: GameRunWhereInput
    /**
     * Limit how many GameRuns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameRun upsert
   */
  export type GameRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunInclude<ExtArgs> | null
    /**
     * The filter to search for the GameRun to update in case it exists.
     */
    where: GameRunWhereUniqueInput
    /**
     * In case the GameRun found by the `where` argument doesn't exist, create a new GameRun with this data.
     */
    create: XOR<GameRunCreateInput, GameRunUncheckedCreateInput>
    /**
     * In case the GameRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameRunUpdateInput, GameRunUncheckedUpdateInput>
  }

  /**
   * GameRun delete
   */
  export type GameRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunInclude<ExtArgs> | null
    /**
     * Filter which GameRun to delete.
     */
    where: GameRunWhereUniqueInput
  }

  /**
   * GameRun deleteMany
   */
  export type GameRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameRuns to delete
     */
    where?: GameRunWhereInput
    /**
     * Limit how many GameRuns to delete.
     */
    limit?: number
  }

  /**
   * GameRun without action
   */
  export type GameRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRun
     */
    select?: GameRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRun
     */
    omit?: GameRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRunInclude<ExtArgs> | null
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
    user_id: string | null
    token_hash: string | null
    family_id: string | null
    expires_at: Date | null
    revoked_at: Date | null
    replaced_by: string | null
    created_at: Date | null
  }

  export type RefreshTokenMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    token_hash: string | null
    family_id: string | null
    expires_at: Date | null
    revoked_at: Date | null
    replaced_by: string | null
    created_at: Date | null
  }

  export type RefreshTokenCountAggregateOutputType = {
    id: number
    user_id: number
    token_hash: number
    family_id: number
    expires_at: number
    revoked_at: number
    replaced_by: number
    created_at: number
    _all: number
  }


  export type RefreshTokenMinAggregateInputType = {
    id?: true
    user_id?: true
    token_hash?: true
    family_id?: true
    expires_at?: true
    revoked_at?: true
    replaced_by?: true
    created_at?: true
  }

  export type RefreshTokenMaxAggregateInputType = {
    id?: true
    user_id?: true
    token_hash?: true
    family_id?: true
    expires_at?: true
    revoked_at?: true
    replaced_by?: true
    created_at?: true
  }

  export type RefreshTokenCountAggregateInputType = {
    id?: true
    user_id?: true
    token_hash?: true
    family_id?: true
    expires_at?: true
    revoked_at?: true
    replaced_by?: true
    created_at?: true
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
    user_id: string
    token_hash: string
    family_id: string
    expires_at: Date
    revoked_at: Date | null
    replaced_by: string | null
    created_at: Date
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
    user_id?: boolean
    token_hash?: boolean
    family_id?: boolean
    expires_at?: boolean
    revoked_at?: boolean
    replaced_by?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    token_hash?: boolean
    family_id?: boolean
    expires_at?: boolean
    revoked_at?: boolean
    replaced_by?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    token_hash?: boolean
    family_id?: boolean
    expires_at?: boolean
    revoked_at?: boolean
    replaced_by?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["refreshToken"]>

  export type RefreshTokenSelectScalar = {
    id?: boolean
    user_id?: boolean
    token_hash?: boolean
    family_id?: boolean
    expires_at?: boolean
    revoked_at?: boolean
    replaced_by?: boolean
    created_at?: boolean
  }

  export type RefreshTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "token_hash" | "family_id" | "expires_at" | "revoked_at" | "replaced_by" | "created_at", ExtArgs["result"]["refreshToken"]>
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
      user_id: string
      token_hash: string
      family_id: string
      expires_at: Date
      revoked_at: Date | null
      replaced_by: string | null
      created_at: Date
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
    readonly user_id: FieldRef<"RefreshToken", 'String'>
    readonly token_hash: FieldRef<"RefreshToken", 'String'>
    readonly family_id: FieldRef<"RefreshToken", 'String'>
    readonly expires_at: FieldRef<"RefreshToken", 'DateTime'>
    readonly revoked_at: FieldRef<"RefreshToken", 'DateTime'>
    readonly replaced_by: FieldRef<"RefreshToken", 'String'>
    readonly created_at: FieldRef<"RefreshToken", 'DateTime'>
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
   * Model EmailVerificationToken
   */

  export type AggregateEmailVerificationToken = {
    _count: EmailVerificationTokenCountAggregateOutputType | null
    _min: EmailVerificationTokenMinAggregateOutputType | null
    _max: EmailVerificationTokenMaxAggregateOutputType | null
  }

  export type EmailVerificationTokenMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    token_hash: string | null
    expires_at: Date | null
    used_at: Date | null
    created_at: Date | null
  }

  export type EmailVerificationTokenMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    token_hash: string | null
    expires_at: Date | null
    used_at: Date | null
    created_at: Date | null
  }

  export type EmailVerificationTokenCountAggregateOutputType = {
    id: number
    user_id: number
    token_hash: number
    expires_at: number
    used_at: number
    created_at: number
    _all: number
  }


  export type EmailVerificationTokenMinAggregateInputType = {
    id?: true
    user_id?: true
    token_hash?: true
    expires_at?: true
    used_at?: true
    created_at?: true
  }

  export type EmailVerificationTokenMaxAggregateInputType = {
    id?: true
    user_id?: true
    token_hash?: true
    expires_at?: true
    used_at?: true
    created_at?: true
  }

  export type EmailVerificationTokenCountAggregateInputType = {
    id?: true
    user_id?: true
    token_hash?: true
    expires_at?: true
    used_at?: true
    created_at?: true
    _all?: true
  }

  export type EmailVerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailVerificationToken to aggregate.
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailVerificationTokens to fetch.
     */
    orderBy?: EmailVerificationTokenOrderByWithRelationInput | EmailVerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EmailVerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailVerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailVerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EmailVerificationTokens
    **/
    _count?: true | EmailVerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EmailVerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EmailVerificationTokenMaxAggregateInputType
  }

  export type GetEmailVerificationTokenAggregateType<T extends EmailVerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateEmailVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEmailVerificationToken[P]>
      : GetScalarType<T[P], AggregateEmailVerificationToken[P]>
  }




  export type EmailVerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EmailVerificationTokenWhereInput
    orderBy?: EmailVerificationTokenOrderByWithAggregationInput | EmailVerificationTokenOrderByWithAggregationInput[]
    by: EmailVerificationTokenScalarFieldEnum[] | EmailVerificationTokenScalarFieldEnum
    having?: EmailVerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EmailVerificationTokenCountAggregateInputType | true
    _min?: EmailVerificationTokenMinAggregateInputType
    _max?: EmailVerificationTokenMaxAggregateInputType
  }

  export type EmailVerificationTokenGroupByOutputType = {
    id: string
    user_id: string
    token_hash: string
    expires_at: Date
    used_at: Date | null
    created_at: Date
    _count: EmailVerificationTokenCountAggregateOutputType | null
    _min: EmailVerificationTokenMinAggregateOutputType | null
    _max: EmailVerificationTokenMaxAggregateOutputType | null
  }

  type GetEmailVerificationTokenGroupByPayload<T extends EmailVerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EmailVerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EmailVerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EmailVerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], EmailVerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type EmailVerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    token_hash?: boolean
    expires_at?: boolean
    used_at?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emailVerificationToken"]>

  export type EmailVerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    token_hash?: boolean
    expires_at?: boolean
    used_at?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emailVerificationToken"]>

  export type EmailVerificationTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    token_hash?: boolean
    expires_at?: boolean
    used_at?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["emailVerificationToken"]>

  export type EmailVerificationTokenSelectScalar = {
    id?: boolean
    user_id?: boolean
    token_hash?: boolean
    expires_at?: boolean
    used_at?: boolean
    created_at?: boolean
  }

  export type EmailVerificationTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "token_hash" | "expires_at" | "used_at" | "created_at", ExtArgs["result"]["emailVerificationToken"]>
  export type EmailVerificationTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EmailVerificationTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type EmailVerificationTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $EmailVerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EmailVerificationToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      token_hash: string
      expires_at: Date
      used_at: Date | null
      created_at: Date
    }, ExtArgs["result"]["emailVerificationToken"]>
    composites: {}
  }

  type EmailVerificationTokenGetPayload<S extends boolean | null | undefined | EmailVerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$EmailVerificationTokenPayload, S>

  type EmailVerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EmailVerificationTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EmailVerificationTokenCountAggregateInputType | true
    }

  export interface EmailVerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EmailVerificationToken'], meta: { name: 'EmailVerificationToken' } }
    /**
     * Find zero or one EmailVerificationToken that matches the filter.
     * @param {EmailVerificationTokenFindUniqueArgs} args - Arguments to find a EmailVerificationToken
     * @example
     * // Get one EmailVerificationToken
     * const emailVerificationToken = await prisma.emailVerificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EmailVerificationTokenFindUniqueArgs>(args: SelectSubset<T, EmailVerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EmailVerificationToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EmailVerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a EmailVerificationToken
     * @example
     * // Get one EmailVerificationToken
     * const emailVerificationToken = await prisma.emailVerificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EmailVerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, EmailVerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmailVerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenFindFirstArgs} args - Arguments to find a EmailVerificationToken
     * @example
     * // Get one EmailVerificationToken
     * const emailVerificationToken = await prisma.emailVerificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EmailVerificationTokenFindFirstArgs>(args?: SelectSubset<T, EmailVerificationTokenFindFirstArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EmailVerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenFindFirstOrThrowArgs} args - Arguments to find a EmailVerificationToken
     * @example
     * // Get one EmailVerificationToken
     * const emailVerificationToken = await prisma.emailVerificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EmailVerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, EmailVerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EmailVerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EmailVerificationTokens
     * const emailVerificationTokens = await prisma.emailVerificationToken.findMany()
     * 
     * // Get first 10 EmailVerificationTokens
     * const emailVerificationTokens = await prisma.emailVerificationToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const emailVerificationTokenWithIdOnly = await prisma.emailVerificationToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EmailVerificationTokenFindManyArgs>(args?: SelectSubset<T, EmailVerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EmailVerificationToken.
     * @param {EmailVerificationTokenCreateArgs} args - Arguments to create a EmailVerificationToken.
     * @example
     * // Create one EmailVerificationToken
     * const EmailVerificationToken = await prisma.emailVerificationToken.create({
     *   data: {
     *     // ... data to create a EmailVerificationToken
     *   }
     * })
     * 
     */
    create<T extends EmailVerificationTokenCreateArgs>(args: SelectSubset<T, EmailVerificationTokenCreateArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EmailVerificationTokens.
     * @param {EmailVerificationTokenCreateManyArgs} args - Arguments to create many EmailVerificationTokens.
     * @example
     * // Create many EmailVerificationTokens
     * const emailVerificationToken = await prisma.emailVerificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EmailVerificationTokenCreateManyArgs>(args?: SelectSubset<T, EmailVerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EmailVerificationTokens and returns the data saved in the database.
     * @param {EmailVerificationTokenCreateManyAndReturnArgs} args - Arguments to create many EmailVerificationTokens.
     * @example
     * // Create many EmailVerificationTokens
     * const emailVerificationToken = await prisma.emailVerificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EmailVerificationTokens and only return the `id`
     * const emailVerificationTokenWithIdOnly = await prisma.emailVerificationToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EmailVerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, EmailVerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EmailVerificationToken.
     * @param {EmailVerificationTokenDeleteArgs} args - Arguments to delete one EmailVerificationToken.
     * @example
     * // Delete one EmailVerificationToken
     * const EmailVerificationToken = await prisma.emailVerificationToken.delete({
     *   where: {
     *     // ... filter to delete one EmailVerificationToken
     *   }
     * })
     * 
     */
    delete<T extends EmailVerificationTokenDeleteArgs>(args: SelectSubset<T, EmailVerificationTokenDeleteArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EmailVerificationToken.
     * @param {EmailVerificationTokenUpdateArgs} args - Arguments to update one EmailVerificationToken.
     * @example
     * // Update one EmailVerificationToken
     * const emailVerificationToken = await prisma.emailVerificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EmailVerificationTokenUpdateArgs>(args: SelectSubset<T, EmailVerificationTokenUpdateArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EmailVerificationTokens.
     * @param {EmailVerificationTokenDeleteManyArgs} args - Arguments to filter EmailVerificationTokens to delete.
     * @example
     * // Delete a few EmailVerificationTokens
     * const { count } = await prisma.emailVerificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EmailVerificationTokenDeleteManyArgs>(args?: SelectSubset<T, EmailVerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailVerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EmailVerificationTokens
     * const emailVerificationToken = await prisma.emailVerificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EmailVerificationTokenUpdateManyArgs>(args: SelectSubset<T, EmailVerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EmailVerificationTokens and returns the data updated in the database.
     * @param {EmailVerificationTokenUpdateManyAndReturnArgs} args - Arguments to update many EmailVerificationTokens.
     * @example
     * // Update many EmailVerificationTokens
     * const emailVerificationToken = await prisma.emailVerificationToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EmailVerificationTokens and only return the `id`
     * const emailVerificationTokenWithIdOnly = await prisma.emailVerificationToken.updateManyAndReturn({
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
    updateManyAndReturn<T extends EmailVerificationTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, EmailVerificationTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EmailVerificationToken.
     * @param {EmailVerificationTokenUpsertArgs} args - Arguments to update or create a EmailVerificationToken.
     * @example
     * // Update or create a EmailVerificationToken
     * const emailVerificationToken = await prisma.emailVerificationToken.upsert({
     *   create: {
     *     // ... data to create a EmailVerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EmailVerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends EmailVerificationTokenUpsertArgs>(args: SelectSubset<T, EmailVerificationTokenUpsertArgs<ExtArgs>>): Prisma__EmailVerificationTokenClient<$Result.GetResult<Prisma.$EmailVerificationTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EmailVerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenCountArgs} args - Arguments to filter EmailVerificationTokens to count.
     * @example
     * // Count the number of EmailVerificationTokens
     * const count = await prisma.emailVerificationToken.count({
     *   where: {
     *     // ... the filter for the EmailVerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends EmailVerificationTokenCountArgs>(
      args?: Subset<T, EmailVerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EmailVerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EmailVerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends EmailVerificationTokenAggregateArgs>(args: Subset<T, EmailVerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetEmailVerificationTokenAggregateType<T>>

    /**
     * Group by EmailVerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EmailVerificationTokenGroupByArgs} args - Group by arguments.
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
      T extends EmailVerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EmailVerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: EmailVerificationTokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, EmailVerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EmailVerificationToken model
   */
  readonly fields: EmailVerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EmailVerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EmailVerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the EmailVerificationToken model
   */
  interface EmailVerificationTokenFieldRefs {
    readonly id: FieldRef<"EmailVerificationToken", 'String'>
    readonly user_id: FieldRef<"EmailVerificationToken", 'String'>
    readonly token_hash: FieldRef<"EmailVerificationToken", 'String'>
    readonly expires_at: FieldRef<"EmailVerificationToken", 'DateTime'>
    readonly used_at: FieldRef<"EmailVerificationToken", 'DateTime'>
    readonly created_at: FieldRef<"EmailVerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * EmailVerificationToken findUnique
   */
  export type EmailVerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenInclude<ExtArgs> | null
    /**
     * Filter, which EmailVerificationToken to fetch.
     */
    where: EmailVerificationTokenWhereUniqueInput
  }

  /**
   * EmailVerificationToken findUniqueOrThrow
   */
  export type EmailVerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenInclude<ExtArgs> | null
    /**
     * Filter, which EmailVerificationToken to fetch.
     */
    where: EmailVerificationTokenWhereUniqueInput
  }

  /**
   * EmailVerificationToken findFirst
   */
  export type EmailVerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenInclude<ExtArgs> | null
    /**
     * Filter, which EmailVerificationToken to fetch.
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailVerificationTokens to fetch.
     */
    orderBy?: EmailVerificationTokenOrderByWithRelationInput | EmailVerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailVerificationTokens.
     */
    cursor?: EmailVerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailVerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailVerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailVerificationTokens.
     */
    distinct?: EmailVerificationTokenScalarFieldEnum | EmailVerificationTokenScalarFieldEnum[]
  }

  /**
   * EmailVerificationToken findFirstOrThrow
   */
  export type EmailVerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenInclude<ExtArgs> | null
    /**
     * Filter, which EmailVerificationToken to fetch.
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailVerificationTokens to fetch.
     */
    orderBy?: EmailVerificationTokenOrderByWithRelationInput | EmailVerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EmailVerificationTokens.
     */
    cursor?: EmailVerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailVerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailVerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EmailVerificationTokens.
     */
    distinct?: EmailVerificationTokenScalarFieldEnum | EmailVerificationTokenScalarFieldEnum[]
  }

  /**
   * EmailVerificationToken findMany
   */
  export type EmailVerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenInclude<ExtArgs> | null
    /**
     * Filter, which EmailVerificationTokens to fetch.
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EmailVerificationTokens to fetch.
     */
    orderBy?: EmailVerificationTokenOrderByWithRelationInput | EmailVerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EmailVerificationTokens.
     */
    cursor?: EmailVerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EmailVerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EmailVerificationTokens.
     */
    skip?: number
    distinct?: EmailVerificationTokenScalarFieldEnum | EmailVerificationTokenScalarFieldEnum[]
  }

  /**
   * EmailVerificationToken create
   */
  export type EmailVerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a EmailVerificationToken.
     */
    data: XOR<EmailVerificationTokenCreateInput, EmailVerificationTokenUncheckedCreateInput>
  }

  /**
   * EmailVerificationToken createMany
   */
  export type EmailVerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EmailVerificationTokens.
     */
    data: EmailVerificationTokenCreateManyInput | EmailVerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EmailVerificationToken createManyAndReturn
   */
  export type EmailVerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to create many EmailVerificationTokens.
     */
    data: EmailVerificationTokenCreateManyInput | EmailVerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EmailVerificationToken update
   */
  export type EmailVerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a EmailVerificationToken.
     */
    data: XOR<EmailVerificationTokenUpdateInput, EmailVerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which EmailVerificationToken to update.
     */
    where: EmailVerificationTokenWhereUniqueInput
  }

  /**
   * EmailVerificationToken updateMany
   */
  export type EmailVerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EmailVerificationTokens.
     */
    data: XOR<EmailVerificationTokenUpdateManyMutationInput, EmailVerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which EmailVerificationTokens to update
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * Limit how many EmailVerificationTokens to update.
     */
    limit?: number
  }

  /**
   * EmailVerificationToken updateManyAndReturn
   */
  export type EmailVerificationTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * The data used to update EmailVerificationTokens.
     */
    data: XOR<EmailVerificationTokenUpdateManyMutationInput, EmailVerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which EmailVerificationTokens to update
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * Limit how many EmailVerificationTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EmailVerificationToken upsert
   */
  export type EmailVerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the EmailVerificationToken to update in case it exists.
     */
    where: EmailVerificationTokenWhereUniqueInput
    /**
     * In case the EmailVerificationToken found by the `where` argument doesn't exist, create a new EmailVerificationToken with this data.
     */
    create: XOR<EmailVerificationTokenCreateInput, EmailVerificationTokenUncheckedCreateInput>
    /**
     * In case the EmailVerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EmailVerificationTokenUpdateInput, EmailVerificationTokenUncheckedUpdateInput>
  }

  /**
   * EmailVerificationToken delete
   */
  export type EmailVerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenInclude<ExtArgs> | null
    /**
     * Filter which EmailVerificationToken to delete.
     */
    where: EmailVerificationTokenWhereUniqueInput
  }

  /**
   * EmailVerificationToken deleteMany
   */
  export type EmailVerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EmailVerificationTokens to delete
     */
    where?: EmailVerificationTokenWhereInput
    /**
     * Limit how many EmailVerificationTokens to delete.
     */
    limit?: number
  }

  /**
   * EmailVerificationToken without action
   */
  export type EmailVerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EmailVerificationToken
     */
    select?: EmailVerificationTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EmailVerificationToken
     */
    omit?: EmailVerificationTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EmailVerificationTokenInclude<ExtArgs> | null
  }


  /**
   * Model PasswordResetToken
   */

  export type AggregatePasswordResetToken = {
    _count: PasswordResetTokenCountAggregateOutputType | null
    _min: PasswordResetTokenMinAggregateOutputType | null
    _max: PasswordResetTokenMaxAggregateOutputType | null
  }

  export type PasswordResetTokenMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    token_hash: string | null
    expires_at: Date | null
    used_at: Date | null
    created_at: Date | null
  }

  export type PasswordResetTokenMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    token_hash: string | null
    expires_at: Date | null
    used_at: Date | null
    created_at: Date | null
  }

  export type PasswordResetTokenCountAggregateOutputType = {
    id: number
    user_id: number
    token_hash: number
    expires_at: number
    used_at: number
    created_at: number
    _all: number
  }


  export type PasswordResetTokenMinAggregateInputType = {
    id?: true
    user_id?: true
    token_hash?: true
    expires_at?: true
    used_at?: true
    created_at?: true
  }

  export type PasswordResetTokenMaxAggregateInputType = {
    id?: true
    user_id?: true
    token_hash?: true
    expires_at?: true
    used_at?: true
    created_at?: true
  }

  export type PasswordResetTokenCountAggregateInputType = {
    id?: true
    user_id?: true
    token_hash?: true
    expires_at?: true
    used_at?: true
    created_at?: true
    _all?: true
  }

  export type PasswordResetTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetToken to aggregate.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResetTokens
    **/
    _count?: true | PasswordResetTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetTokenMaxAggregateInputType
  }

  export type GetPasswordResetTokenAggregateType<T extends PasswordResetTokenAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordResetToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordResetToken[P]>
      : GetScalarType<T[P], AggregatePasswordResetToken[P]>
  }




  export type PasswordResetTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetTokenWhereInput
    orderBy?: PasswordResetTokenOrderByWithAggregationInput | PasswordResetTokenOrderByWithAggregationInput[]
    by: PasswordResetTokenScalarFieldEnum[] | PasswordResetTokenScalarFieldEnum
    having?: PasswordResetTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetTokenCountAggregateInputType | true
    _min?: PasswordResetTokenMinAggregateInputType
    _max?: PasswordResetTokenMaxAggregateInputType
  }

  export type PasswordResetTokenGroupByOutputType = {
    id: string
    user_id: string
    token_hash: string
    expires_at: Date
    used_at: Date | null
    created_at: Date
    _count: PasswordResetTokenCountAggregateOutputType | null
    _min: PasswordResetTokenMinAggregateOutputType | null
    _max: PasswordResetTokenMaxAggregateOutputType | null
  }

  type GetPasswordResetTokenGroupByPayload<T extends PasswordResetTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetTokenGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetTokenGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    token_hash?: boolean
    expires_at?: boolean
    used_at?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    token_hash?: boolean
    expires_at?: boolean
    used_at?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    token_hash?: boolean
    expires_at?: boolean
    used_at?: boolean
    created_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectScalar = {
    id?: boolean
    user_id?: boolean
    token_hash?: boolean
    expires_at?: boolean
    used_at?: boolean
    created_at?: boolean
  }

  export type PasswordResetTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "token_hash" | "expires_at" | "used_at" | "created_at", ExtArgs["result"]["passwordResetToken"]>
  export type PasswordResetTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PasswordResetTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PasswordResetTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PasswordResetTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordResetToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      token_hash: string
      expires_at: Date
      used_at: Date | null
      created_at: Date
    }, ExtArgs["result"]["passwordResetToken"]>
    composites: {}
  }

  type PasswordResetTokenGetPayload<S extends boolean | null | undefined | PasswordResetTokenDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetTokenPayload, S>

  type PasswordResetTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasswordResetTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasswordResetTokenCountAggregateInputType | true
    }

  export interface PasswordResetTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetToken'], meta: { name: 'PasswordResetToken' } }
    /**
     * Find zero or one PasswordResetToken that matches the filter.
     * @param {PasswordResetTokenFindUniqueArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetTokenFindUniqueArgs>(args: SelectSubset<T, PasswordResetTokenFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PasswordResetToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasswordResetTokenFindUniqueOrThrowArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindFirstArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetTokenFindFirstArgs>(args?: SelectSubset<T, PasswordResetTokenFindFirstArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindFirstOrThrowArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasswordResetTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetToken.findMany()
     * 
     * // Get first 10 PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetTokenFindManyArgs>(args?: SelectSubset<T, PasswordResetTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PasswordResetToken.
     * @param {PasswordResetTokenCreateArgs} args - Arguments to create a PasswordResetToken.
     * @example
     * // Create one PasswordResetToken
     * const PasswordResetToken = await prisma.passwordResetToken.create({
     *   data: {
     *     // ... data to create a PasswordResetToken
     *   }
     * })
     * 
     */
    create<T extends PasswordResetTokenCreateArgs>(args: SelectSubset<T, PasswordResetTokenCreateArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PasswordResetTokens.
     * @param {PasswordResetTokenCreateManyArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetTokenCreateManyArgs>(args?: SelectSubset<T, PasswordResetTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasswordResetTokens and returns the data saved in the database.
     * @param {PasswordResetTokenCreateManyAndReturnArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasswordResetTokens and only return the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasswordResetTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PasswordResetToken.
     * @param {PasswordResetTokenDeleteArgs} args - Arguments to delete one PasswordResetToken.
     * @example
     * // Delete one PasswordResetToken
     * const PasswordResetToken = await prisma.passwordResetToken.delete({
     *   where: {
     *     // ... filter to delete one PasswordResetToken
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetTokenDeleteArgs>(args: SelectSubset<T, PasswordResetTokenDeleteArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PasswordResetToken.
     * @param {PasswordResetTokenUpdateArgs} args - Arguments to update one PasswordResetToken.
     * @example
     * // Update one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetTokenUpdateArgs>(args: SelectSubset<T, PasswordResetTokenUpdateArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PasswordResetTokens.
     * @param {PasswordResetTokenDeleteManyArgs} args - Arguments to filter PasswordResetTokens to delete.
     * @example
     * // Delete a few PasswordResetTokens
     * const { count } = await prisma.passwordResetToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetTokenDeleteManyArgs>(args?: SelectSubset<T, PasswordResetTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetTokenUpdateManyArgs>(args: SelectSubset<T, PasswordResetTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetTokens and returns the data updated in the database.
     * @param {PasswordResetTokenUpdateManyAndReturnArgs} args - Arguments to update many PasswordResetTokens.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PasswordResetTokens and only return the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.updateManyAndReturn({
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
    updateManyAndReturn<T extends PasswordResetTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PasswordResetToken.
     * @param {PasswordResetTokenUpsertArgs} args - Arguments to update or create a PasswordResetToken.
     * @example
     * // Update or create a PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.upsert({
     *   create: {
     *     // ... data to create a PasswordResetToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordResetToken we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetTokenUpsertArgs>(args: SelectSubset<T, PasswordResetTokenUpsertArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenCountArgs} args - Arguments to filter PasswordResetTokens to count.
     * @example
     * // Count the number of PasswordResetTokens
     * const count = await prisma.passwordResetToken.count({
     *   where: {
     *     // ... the filter for the PasswordResetTokens we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetTokenCountArgs>(
      args?: Subset<T, PasswordResetTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordResetToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PasswordResetTokenAggregateArgs>(args: Subset<T, PasswordResetTokenAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetTokenAggregateType<T>>

    /**
     * Group by PasswordResetToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenGroupByArgs} args - Group by arguments.
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
      T extends PasswordResetTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetTokenGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetTokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PasswordResetTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordResetToken model
   */
  readonly fields: PasswordResetTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordResetToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the PasswordResetToken model
   */
  interface PasswordResetTokenFieldRefs {
    readonly id: FieldRef<"PasswordResetToken", 'String'>
    readonly user_id: FieldRef<"PasswordResetToken", 'String'>
    readonly token_hash: FieldRef<"PasswordResetToken", 'String'>
    readonly expires_at: FieldRef<"PasswordResetToken", 'DateTime'>
    readonly used_at: FieldRef<"PasswordResetToken", 'DateTime'>
    readonly created_at: FieldRef<"PasswordResetToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordResetToken findUnique
   */
  export type PasswordResetTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken findUniqueOrThrow
   */
  export type PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken findFirst
   */
  export type PasswordResetTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken findFirstOrThrow
   */
  export type PasswordResetTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken findMany
   */
  export type PasswordResetTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetTokens to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken create
   */
  export type PasswordResetTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a PasswordResetToken.
     */
    data: XOR<PasswordResetTokenCreateInput, PasswordResetTokenUncheckedCreateInput>
  }

  /**
   * PasswordResetToken createMany
   */
  export type PasswordResetTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResetTokens.
     */
    data: PasswordResetTokenCreateManyInput | PasswordResetTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordResetToken createManyAndReturn
   */
  export type PasswordResetTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * The data used to create many PasswordResetTokens.
     */
    data: PasswordResetTokenCreateManyInput | PasswordResetTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordResetToken update
   */
  export type PasswordResetTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a PasswordResetToken.
     */
    data: XOR<PasswordResetTokenUpdateInput, PasswordResetTokenUncheckedUpdateInput>
    /**
     * Choose, which PasswordResetToken to update.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken updateMany
   */
  export type PasswordResetTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokenWhereInput
    /**
     * Limit how many PasswordResetTokens to update.
     */
    limit?: number
  }

  /**
   * PasswordResetToken updateManyAndReturn
   */
  export type PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokenWhereInput
    /**
     * Limit how many PasswordResetTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordResetToken upsert
   */
  export type PasswordResetTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the PasswordResetToken to update in case it exists.
     */
    where: PasswordResetTokenWhereUniqueInput
    /**
     * In case the PasswordResetToken found by the `where` argument doesn't exist, create a new PasswordResetToken with this data.
     */
    create: XOR<PasswordResetTokenCreateInput, PasswordResetTokenUncheckedCreateInput>
    /**
     * In case the PasswordResetToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetTokenUpdateInput, PasswordResetTokenUncheckedUpdateInput>
  }

  /**
   * PasswordResetToken delete
   */
  export type PasswordResetTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter which PasswordResetToken to delete.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken deleteMany
   */
  export type PasswordResetTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetTokens to delete
     */
    where?: PasswordResetTokenWhereInput
    /**
     * Limit how many PasswordResetTokens to delete.
     */
    limit?: number
  }

  /**
   * PasswordResetToken without action
   */
  export type PasswordResetTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
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
    username: 'username',
    username_normalized: 'username_normalized',
    password: 'password',
    role: 'role',
    email_verified_at: 'email_verified_at',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const ProfileScalarFieldEnum: {
    user_id: 'user_id',
    level: 'level',
    xp: 'xp',
    total_points: 'total_points',
    title: 'title',
    current_mission_id: 'current_mission_id',
    highest_unlocked_mission_id: 'highest_unlocked_mission_id',
    save_version: 'save_version',
    emperor_knight_unlocked_at: 'emperor_knight_unlocked_at',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]


  export const SettingsScalarFieldEnum: {
    user_id: 'user_id',
    master_volume: 'master_volume',
    music_volume: 'music_volume',
    sfx_volume: 'sfx_volume',
    reduced_motion: 'reduced_motion',
    screen_shake: 'screen_shake',
    show_fps: 'show_fps',
    difficulty: 'difficulty',
    key_bindings: 'key_bindings',
    updated_at: 'updated_at'
  };

  export type SettingsScalarFieldEnum = (typeof SettingsScalarFieldEnum)[keyof typeof SettingsScalarFieldEnum]


  export const MissionProgressScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    mission_id: 'mission_id',
    status: 'status',
    best_score: 'best_score',
    best_time_ms: 'best_time_ms',
    best_rank: 'best_rank',
    completions: 'completions',
    first_completed_at: 'first_completed_at',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type MissionProgressScalarFieldEnum = (typeof MissionProgressScalarFieldEnum)[keyof typeof MissionProgressScalarFieldEnum]


  export const ScoreEntryScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    mission_id: 'mission_id',
    run_id: 'run_id',
    score: 'score',
    duration_ms: 'duration_ms',
    rank: 'rank',
    difficulty: 'difficulty',
    created_at: 'created_at'
  };

  export type ScoreEntryScalarFieldEnum = (typeof ScoreEntryScalarFieldEnum)[keyof typeof ScoreEntryScalarFieldEnum]


  export const UnlockedCharacterScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    character_id: 'character_id',
    source: 'source',
    unlocked_at: 'unlocked_at'
  };

  export type UnlockedCharacterScalarFieldEnum = (typeof UnlockedCharacterScalarFieldEnum)[keyof typeof UnlockedCharacterScalarFieldEnum]


  export const GameRunScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    mission_id: 'mission_id',
    status: 'status',
    started_at: 'started_at',
    completed_at: 'completed_at'
  };

  export type GameRunScalarFieldEnum = (typeof GameRunScalarFieldEnum)[keyof typeof GameRunScalarFieldEnum]


  export const RefreshTokenScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    token_hash: 'token_hash',
    family_id: 'family_id',
    expires_at: 'expires_at',
    revoked_at: 'revoked_at',
    replaced_by: 'replaced_by',
    created_at: 'created_at'
  };

  export type RefreshTokenScalarFieldEnum = (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum]


  export const EmailVerificationTokenScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    token_hash: 'token_hash',
    expires_at: 'expires_at',
    used_at: 'used_at',
    created_at: 'created_at'
  };

  export type EmailVerificationTokenScalarFieldEnum = (typeof EmailVerificationTokenScalarFieldEnum)[keyof typeof EmailVerificationTokenScalarFieldEnum]


  export const PasswordResetTokenScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    token_hash: 'token_hash',
    expires_at: 'expires_at',
    used_at: 'used_at',
    created_at: 'created_at'
  };

  export type PasswordResetTokenScalarFieldEnum = (typeof PasswordResetTokenScalarFieldEnum)[keyof typeof PasswordResetTokenScalarFieldEnum]


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
   * Reference to a field of type 'AuthRole'
   */
  export type EnumAuthRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthRole'>
    


  /**
   * Reference to a field of type 'AuthRole[]'
   */
  export type ListEnumAuthRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthRole[]'>
    


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
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Difficulty'
   */
  export type EnumDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Difficulty'>
    


  /**
   * Reference to a field of type 'Difficulty[]'
   */
  export type ListEnumDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Difficulty[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'MissionStatus'
   */
  export type EnumMissionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MissionStatus'>
    


  /**
   * Reference to a field of type 'MissionStatus[]'
   */
  export type ListEnumMissionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MissionStatus[]'>
    


  /**
   * Reference to a field of type 'MissionRank'
   */
  export type EnumMissionRankFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MissionRank'>
    


  /**
   * Reference to a field of type 'MissionRank[]'
   */
  export type ListEnumMissionRankFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MissionRank[]'>
    


  /**
   * Reference to a field of type 'GameRunStatus'
   */
  export type EnumGameRunStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GameRunStatus'>
    


  /**
   * Reference to a field of type 'GameRunStatus[]'
   */
  export type ListEnumGameRunStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GameRunStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    username_normalized?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumAuthRoleFilter<"User"> | $Enums.AuthRole
    email_verified_at?: DateTimeNullableFilter<"User"> | Date | string | null
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    profile?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
    settings?: XOR<SettingsNullableScalarRelationFilter, SettingsWhereInput> | null
    mission_progress?: MissionProgressListRelationFilter
    score_entries?: ScoreEntryListRelationFilter
    unlocked_characters?: UnlockedCharacterListRelationFilter
    game_runs?: GameRunListRelationFilter
    refresh_tokens?: RefreshTokenListRelationFilter
    email_verification_tokens?: EmailVerificationTokenListRelationFilter
    password_reset_tokens?: PasswordResetTokenListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    username_normalized?: SortOrder
    password?: SortOrder
    role?: SortOrder
    email_verified_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    profile?: ProfileOrderByWithRelationInput
    settings?: SettingsOrderByWithRelationInput
    mission_progress?: MissionProgressOrderByRelationAggregateInput
    score_entries?: ScoreEntryOrderByRelationAggregateInput
    unlocked_characters?: UnlockedCharacterOrderByRelationAggregateInput
    game_runs?: GameRunOrderByRelationAggregateInput
    refresh_tokens?: RefreshTokenOrderByRelationAggregateInput
    email_verification_tokens?: EmailVerificationTokenOrderByRelationAggregateInput
    password_reset_tokens?: PasswordResetTokenOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username_normalized?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumAuthRoleFilter<"User"> | $Enums.AuthRole
    email_verified_at?: DateTimeNullableFilter<"User"> | Date | string | null
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    profile?: XOR<ProfileNullableScalarRelationFilter, ProfileWhereInput> | null
    settings?: XOR<SettingsNullableScalarRelationFilter, SettingsWhereInput> | null
    mission_progress?: MissionProgressListRelationFilter
    score_entries?: ScoreEntryListRelationFilter
    unlocked_characters?: UnlockedCharacterListRelationFilter
    game_runs?: GameRunListRelationFilter
    refresh_tokens?: RefreshTokenListRelationFilter
    email_verification_tokens?: EmailVerificationTokenListRelationFilter
    password_reset_tokens?: PasswordResetTokenListRelationFilter
  }, "id" | "email" | "username_normalized">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    username_normalized?: SortOrder
    password?: SortOrder
    role?: SortOrder
    email_verified_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    username_normalized?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumAuthRoleWithAggregatesFilter<"User"> | $Enums.AuthRole
    email_verified_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    user_id?: StringFilter<"Profile"> | string
    level?: IntFilter<"Profile"> | number
    xp?: IntFilter<"Profile"> | number
    total_points?: IntFilter<"Profile"> | number
    title?: StringFilter<"Profile"> | string
    current_mission_id?: StringFilter<"Profile"> | string
    highest_unlocked_mission_id?: StringFilter<"Profile"> | string
    save_version?: IntFilter<"Profile"> | number
    emperor_knight_unlocked_at?: DateTimeNullableFilter<"Profile"> | Date | string | null
    created_at?: DateTimeFilter<"Profile"> | Date | string
    updated_at?: DateTimeFilter<"Profile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ProfileOrderByWithRelationInput = {
    user_id?: SortOrder
    level?: SortOrder
    xp?: SortOrder
    total_points?: SortOrder
    title?: SortOrder
    current_mission_id?: SortOrder
    highest_unlocked_mission_id?: SortOrder
    save_version?: SortOrder
    emperor_knight_unlocked_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ProfileWhereUniqueInput = Prisma.AtLeast<{
    user_id?: string
    AND?: ProfileWhereInput | ProfileWhereInput[]
    OR?: ProfileWhereInput[]
    NOT?: ProfileWhereInput | ProfileWhereInput[]
    level?: IntFilter<"Profile"> | number
    xp?: IntFilter<"Profile"> | number
    total_points?: IntFilter<"Profile"> | number
    title?: StringFilter<"Profile"> | string
    current_mission_id?: StringFilter<"Profile"> | string
    highest_unlocked_mission_id?: StringFilter<"Profile"> | string
    save_version?: IntFilter<"Profile"> | number
    emperor_knight_unlocked_at?: DateTimeNullableFilter<"Profile"> | Date | string | null
    created_at?: DateTimeFilter<"Profile"> | Date | string
    updated_at?: DateTimeFilter<"Profile"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "user_id">

  export type ProfileOrderByWithAggregationInput = {
    user_id?: SortOrder
    level?: SortOrder
    xp?: SortOrder
    total_points?: SortOrder
    title?: SortOrder
    current_mission_id?: SortOrder
    highest_unlocked_mission_id?: SortOrder
    save_version?: SortOrder
    emperor_knight_unlocked_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ProfileCountOrderByAggregateInput
    _avg?: ProfileAvgOrderByAggregateInput
    _max?: ProfileMaxOrderByAggregateInput
    _min?: ProfileMinOrderByAggregateInput
    _sum?: ProfileSumOrderByAggregateInput
  }

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    OR?: ProfileScalarWhereWithAggregatesInput[]
    NOT?: ProfileScalarWhereWithAggregatesInput | ProfileScalarWhereWithAggregatesInput[]
    user_id?: StringWithAggregatesFilter<"Profile"> | string
    level?: IntWithAggregatesFilter<"Profile"> | number
    xp?: IntWithAggregatesFilter<"Profile"> | number
    total_points?: IntWithAggregatesFilter<"Profile"> | number
    title?: StringWithAggregatesFilter<"Profile"> | string
    current_mission_id?: StringWithAggregatesFilter<"Profile"> | string
    highest_unlocked_mission_id?: StringWithAggregatesFilter<"Profile"> | string
    save_version?: IntWithAggregatesFilter<"Profile"> | number
    emperor_knight_unlocked_at?: DateTimeNullableWithAggregatesFilter<"Profile"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Profile"> | Date | string
  }

  export type SettingsWhereInput = {
    AND?: SettingsWhereInput | SettingsWhereInput[]
    OR?: SettingsWhereInput[]
    NOT?: SettingsWhereInput | SettingsWhereInput[]
    user_id?: StringFilter<"Settings"> | string
    master_volume?: FloatFilter<"Settings"> | number
    music_volume?: FloatFilter<"Settings"> | number
    sfx_volume?: FloatFilter<"Settings"> | number
    reduced_motion?: BoolFilter<"Settings"> | boolean
    screen_shake?: BoolFilter<"Settings"> | boolean
    show_fps?: BoolFilter<"Settings"> | boolean
    difficulty?: EnumDifficultyFilter<"Settings"> | $Enums.Difficulty
    key_bindings?: JsonFilter<"Settings">
    updated_at?: DateTimeFilter<"Settings"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SettingsOrderByWithRelationInput = {
    user_id?: SortOrder
    master_volume?: SortOrder
    music_volume?: SortOrder
    sfx_volume?: SortOrder
    reduced_motion?: SortOrder
    screen_shake?: SortOrder
    show_fps?: SortOrder
    difficulty?: SortOrder
    key_bindings?: SortOrder
    updated_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SettingsWhereUniqueInput = Prisma.AtLeast<{
    user_id?: string
    AND?: SettingsWhereInput | SettingsWhereInput[]
    OR?: SettingsWhereInput[]
    NOT?: SettingsWhereInput | SettingsWhereInput[]
    master_volume?: FloatFilter<"Settings"> | number
    music_volume?: FloatFilter<"Settings"> | number
    sfx_volume?: FloatFilter<"Settings"> | number
    reduced_motion?: BoolFilter<"Settings"> | boolean
    screen_shake?: BoolFilter<"Settings"> | boolean
    show_fps?: BoolFilter<"Settings"> | boolean
    difficulty?: EnumDifficultyFilter<"Settings"> | $Enums.Difficulty
    key_bindings?: JsonFilter<"Settings">
    updated_at?: DateTimeFilter<"Settings"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "user_id">

  export type SettingsOrderByWithAggregationInput = {
    user_id?: SortOrder
    master_volume?: SortOrder
    music_volume?: SortOrder
    sfx_volume?: SortOrder
    reduced_motion?: SortOrder
    screen_shake?: SortOrder
    show_fps?: SortOrder
    difficulty?: SortOrder
    key_bindings?: SortOrder
    updated_at?: SortOrder
    _count?: SettingsCountOrderByAggregateInput
    _avg?: SettingsAvgOrderByAggregateInput
    _max?: SettingsMaxOrderByAggregateInput
    _min?: SettingsMinOrderByAggregateInput
    _sum?: SettingsSumOrderByAggregateInput
  }

  export type SettingsScalarWhereWithAggregatesInput = {
    AND?: SettingsScalarWhereWithAggregatesInput | SettingsScalarWhereWithAggregatesInput[]
    OR?: SettingsScalarWhereWithAggregatesInput[]
    NOT?: SettingsScalarWhereWithAggregatesInput | SettingsScalarWhereWithAggregatesInput[]
    user_id?: StringWithAggregatesFilter<"Settings"> | string
    master_volume?: FloatWithAggregatesFilter<"Settings"> | number
    music_volume?: FloatWithAggregatesFilter<"Settings"> | number
    sfx_volume?: FloatWithAggregatesFilter<"Settings"> | number
    reduced_motion?: BoolWithAggregatesFilter<"Settings"> | boolean
    screen_shake?: BoolWithAggregatesFilter<"Settings"> | boolean
    show_fps?: BoolWithAggregatesFilter<"Settings"> | boolean
    difficulty?: EnumDifficultyWithAggregatesFilter<"Settings"> | $Enums.Difficulty
    key_bindings?: JsonWithAggregatesFilter<"Settings">
    updated_at?: DateTimeWithAggregatesFilter<"Settings"> | Date | string
  }

  export type MissionProgressWhereInput = {
    AND?: MissionProgressWhereInput | MissionProgressWhereInput[]
    OR?: MissionProgressWhereInput[]
    NOT?: MissionProgressWhereInput | MissionProgressWhereInput[]
    id?: StringFilter<"MissionProgress"> | string
    user_id?: StringFilter<"MissionProgress"> | string
    mission_id?: StringFilter<"MissionProgress"> | string
    status?: EnumMissionStatusFilter<"MissionProgress"> | $Enums.MissionStatus
    best_score?: IntFilter<"MissionProgress"> | number
    best_time_ms?: IntNullableFilter<"MissionProgress"> | number | null
    best_rank?: EnumMissionRankNullableFilter<"MissionProgress"> | $Enums.MissionRank | null
    completions?: IntFilter<"MissionProgress"> | number
    first_completed_at?: DateTimeNullableFilter<"MissionProgress"> | Date | string | null
    created_at?: DateTimeFilter<"MissionProgress"> | Date | string
    updated_at?: DateTimeFilter<"MissionProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MissionProgressOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    status?: SortOrder
    best_score?: SortOrder
    best_time_ms?: SortOrderInput | SortOrder
    best_rank?: SortOrderInput | SortOrder
    completions?: SortOrder
    first_completed_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type MissionProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    user_id_mission_id?: MissionProgressUser_idMission_idCompoundUniqueInput
    AND?: MissionProgressWhereInput | MissionProgressWhereInput[]
    OR?: MissionProgressWhereInput[]
    NOT?: MissionProgressWhereInput | MissionProgressWhereInput[]
    user_id?: StringFilter<"MissionProgress"> | string
    mission_id?: StringFilter<"MissionProgress"> | string
    status?: EnumMissionStatusFilter<"MissionProgress"> | $Enums.MissionStatus
    best_score?: IntFilter<"MissionProgress"> | number
    best_time_ms?: IntNullableFilter<"MissionProgress"> | number | null
    best_rank?: EnumMissionRankNullableFilter<"MissionProgress"> | $Enums.MissionRank | null
    completions?: IntFilter<"MissionProgress"> | number
    first_completed_at?: DateTimeNullableFilter<"MissionProgress"> | Date | string | null
    created_at?: DateTimeFilter<"MissionProgress"> | Date | string
    updated_at?: DateTimeFilter<"MissionProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "user_id_mission_id">

  export type MissionProgressOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    status?: SortOrder
    best_score?: SortOrder
    best_time_ms?: SortOrderInput | SortOrder
    best_rank?: SortOrderInput | SortOrder
    completions?: SortOrder
    first_completed_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: MissionProgressCountOrderByAggregateInput
    _avg?: MissionProgressAvgOrderByAggregateInput
    _max?: MissionProgressMaxOrderByAggregateInput
    _min?: MissionProgressMinOrderByAggregateInput
    _sum?: MissionProgressSumOrderByAggregateInput
  }

  export type MissionProgressScalarWhereWithAggregatesInput = {
    AND?: MissionProgressScalarWhereWithAggregatesInput | MissionProgressScalarWhereWithAggregatesInput[]
    OR?: MissionProgressScalarWhereWithAggregatesInput[]
    NOT?: MissionProgressScalarWhereWithAggregatesInput | MissionProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MissionProgress"> | string
    user_id?: StringWithAggregatesFilter<"MissionProgress"> | string
    mission_id?: StringWithAggregatesFilter<"MissionProgress"> | string
    status?: EnumMissionStatusWithAggregatesFilter<"MissionProgress"> | $Enums.MissionStatus
    best_score?: IntWithAggregatesFilter<"MissionProgress"> | number
    best_time_ms?: IntNullableWithAggregatesFilter<"MissionProgress"> | number | null
    best_rank?: EnumMissionRankNullableWithAggregatesFilter<"MissionProgress"> | $Enums.MissionRank | null
    completions?: IntWithAggregatesFilter<"MissionProgress"> | number
    first_completed_at?: DateTimeNullableWithAggregatesFilter<"MissionProgress"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"MissionProgress"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"MissionProgress"> | Date | string
  }

  export type ScoreEntryWhereInput = {
    AND?: ScoreEntryWhereInput | ScoreEntryWhereInput[]
    OR?: ScoreEntryWhereInput[]
    NOT?: ScoreEntryWhereInput | ScoreEntryWhereInput[]
    id?: StringFilter<"ScoreEntry"> | string
    user_id?: StringFilter<"ScoreEntry"> | string
    mission_id?: StringFilter<"ScoreEntry"> | string
    run_id?: StringFilter<"ScoreEntry"> | string
    score?: IntFilter<"ScoreEntry"> | number
    duration_ms?: IntFilter<"ScoreEntry"> | number
    rank?: EnumMissionRankFilter<"ScoreEntry"> | $Enums.MissionRank
    difficulty?: EnumDifficultyFilter<"ScoreEntry"> | $Enums.Difficulty
    created_at?: DateTimeFilter<"ScoreEntry"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type ScoreEntryOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    run_id?: SortOrder
    score?: SortOrder
    duration_ms?: SortOrder
    rank?: SortOrder
    difficulty?: SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type ScoreEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    run_id?: string
    AND?: ScoreEntryWhereInput | ScoreEntryWhereInput[]
    OR?: ScoreEntryWhereInput[]
    NOT?: ScoreEntryWhereInput | ScoreEntryWhereInput[]
    user_id?: StringFilter<"ScoreEntry"> | string
    mission_id?: StringFilter<"ScoreEntry"> | string
    score?: IntFilter<"ScoreEntry"> | number
    duration_ms?: IntFilter<"ScoreEntry"> | number
    rank?: EnumMissionRankFilter<"ScoreEntry"> | $Enums.MissionRank
    difficulty?: EnumDifficultyFilter<"ScoreEntry"> | $Enums.Difficulty
    created_at?: DateTimeFilter<"ScoreEntry"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "run_id">

  export type ScoreEntryOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    run_id?: SortOrder
    score?: SortOrder
    duration_ms?: SortOrder
    rank?: SortOrder
    difficulty?: SortOrder
    created_at?: SortOrder
    _count?: ScoreEntryCountOrderByAggregateInput
    _avg?: ScoreEntryAvgOrderByAggregateInput
    _max?: ScoreEntryMaxOrderByAggregateInput
    _min?: ScoreEntryMinOrderByAggregateInput
    _sum?: ScoreEntrySumOrderByAggregateInput
  }

  export type ScoreEntryScalarWhereWithAggregatesInput = {
    AND?: ScoreEntryScalarWhereWithAggregatesInput | ScoreEntryScalarWhereWithAggregatesInput[]
    OR?: ScoreEntryScalarWhereWithAggregatesInput[]
    NOT?: ScoreEntryScalarWhereWithAggregatesInput | ScoreEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ScoreEntry"> | string
    user_id?: StringWithAggregatesFilter<"ScoreEntry"> | string
    mission_id?: StringWithAggregatesFilter<"ScoreEntry"> | string
    run_id?: StringWithAggregatesFilter<"ScoreEntry"> | string
    score?: IntWithAggregatesFilter<"ScoreEntry"> | number
    duration_ms?: IntWithAggregatesFilter<"ScoreEntry"> | number
    rank?: EnumMissionRankWithAggregatesFilter<"ScoreEntry"> | $Enums.MissionRank
    difficulty?: EnumDifficultyWithAggregatesFilter<"ScoreEntry"> | $Enums.Difficulty
    created_at?: DateTimeWithAggregatesFilter<"ScoreEntry"> | Date | string
  }

  export type UnlockedCharacterWhereInput = {
    AND?: UnlockedCharacterWhereInput | UnlockedCharacterWhereInput[]
    OR?: UnlockedCharacterWhereInput[]
    NOT?: UnlockedCharacterWhereInput | UnlockedCharacterWhereInput[]
    id?: StringFilter<"UnlockedCharacter"> | string
    user_id?: StringFilter<"UnlockedCharacter"> | string
    character_id?: StringFilter<"UnlockedCharacter"> | string
    source?: StringFilter<"UnlockedCharacter"> | string
    unlocked_at?: DateTimeFilter<"UnlockedCharacter"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UnlockedCharacterOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    character_id?: SortOrder
    source?: SortOrder
    unlocked_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UnlockedCharacterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    user_id_character_id?: UnlockedCharacterUser_idCharacter_idCompoundUniqueInput
    AND?: UnlockedCharacterWhereInput | UnlockedCharacterWhereInput[]
    OR?: UnlockedCharacterWhereInput[]
    NOT?: UnlockedCharacterWhereInput | UnlockedCharacterWhereInput[]
    user_id?: StringFilter<"UnlockedCharacter"> | string
    character_id?: StringFilter<"UnlockedCharacter"> | string
    source?: StringFilter<"UnlockedCharacter"> | string
    unlocked_at?: DateTimeFilter<"UnlockedCharacter"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "user_id_character_id">

  export type UnlockedCharacterOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    character_id?: SortOrder
    source?: SortOrder
    unlocked_at?: SortOrder
    _count?: UnlockedCharacterCountOrderByAggregateInput
    _max?: UnlockedCharacterMaxOrderByAggregateInput
    _min?: UnlockedCharacterMinOrderByAggregateInput
  }

  export type UnlockedCharacterScalarWhereWithAggregatesInput = {
    AND?: UnlockedCharacterScalarWhereWithAggregatesInput | UnlockedCharacterScalarWhereWithAggregatesInput[]
    OR?: UnlockedCharacterScalarWhereWithAggregatesInput[]
    NOT?: UnlockedCharacterScalarWhereWithAggregatesInput | UnlockedCharacterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UnlockedCharacter"> | string
    user_id?: StringWithAggregatesFilter<"UnlockedCharacter"> | string
    character_id?: StringWithAggregatesFilter<"UnlockedCharacter"> | string
    source?: StringWithAggregatesFilter<"UnlockedCharacter"> | string
    unlocked_at?: DateTimeWithAggregatesFilter<"UnlockedCharacter"> | Date | string
  }

  export type GameRunWhereInput = {
    AND?: GameRunWhereInput | GameRunWhereInput[]
    OR?: GameRunWhereInput[]
    NOT?: GameRunWhereInput | GameRunWhereInput[]
    id?: StringFilter<"GameRun"> | string
    user_id?: StringFilter<"GameRun"> | string
    mission_id?: StringFilter<"GameRun"> | string
    status?: EnumGameRunStatusFilter<"GameRun"> | $Enums.GameRunStatus
    started_at?: DateTimeFilter<"GameRun"> | Date | string
    completed_at?: DateTimeNullableFilter<"GameRun"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type GameRunOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    status?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type GameRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GameRunWhereInput | GameRunWhereInput[]
    OR?: GameRunWhereInput[]
    NOT?: GameRunWhereInput | GameRunWhereInput[]
    user_id?: StringFilter<"GameRun"> | string
    mission_id?: StringFilter<"GameRun"> | string
    status?: EnumGameRunStatusFilter<"GameRun"> | $Enums.GameRunStatus
    started_at?: DateTimeFilter<"GameRun"> | Date | string
    completed_at?: DateTimeNullableFilter<"GameRun"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type GameRunOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    status?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrderInput | SortOrder
    _count?: GameRunCountOrderByAggregateInput
    _max?: GameRunMaxOrderByAggregateInput
    _min?: GameRunMinOrderByAggregateInput
  }

  export type GameRunScalarWhereWithAggregatesInput = {
    AND?: GameRunScalarWhereWithAggregatesInput | GameRunScalarWhereWithAggregatesInput[]
    OR?: GameRunScalarWhereWithAggregatesInput[]
    NOT?: GameRunScalarWhereWithAggregatesInput | GameRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GameRun"> | string
    user_id?: StringWithAggregatesFilter<"GameRun"> | string
    mission_id?: StringWithAggregatesFilter<"GameRun"> | string
    status?: EnumGameRunStatusWithAggregatesFilter<"GameRun"> | $Enums.GameRunStatus
    started_at?: DateTimeWithAggregatesFilter<"GameRun"> | Date | string
    completed_at?: DateTimeNullableWithAggregatesFilter<"GameRun"> | Date | string | null
  }

  export type RefreshTokenWhereInput = {
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    id?: StringFilter<"RefreshToken"> | string
    user_id?: StringFilter<"RefreshToken"> | string
    token_hash?: StringFilter<"RefreshToken"> | string
    family_id?: StringFilter<"RefreshToken"> | string
    expires_at?: DateTimeFilter<"RefreshToken"> | Date | string
    revoked_at?: DateTimeNullableFilter<"RefreshToken"> | Date | string | null
    replaced_by?: StringNullableFilter<"RefreshToken"> | string | null
    created_at?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type RefreshTokenOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    family_id?: SortOrder
    expires_at?: SortOrder
    revoked_at?: SortOrderInput | SortOrder
    replaced_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type RefreshTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token_hash?: string
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    user_id?: StringFilter<"RefreshToken"> | string
    family_id?: StringFilter<"RefreshToken"> | string
    expires_at?: DateTimeFilter<"RefreshToken"> | Date | string
    revoked_at?: DateTimeNullableFilter<"RefreshToken"> | Date | string | null
    replaced_by?: StringNullableFilter<"RefreshToken"> | string | null
    created_at?: DateTimeFilter<"RefreshToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token_hash">

  export type RefreshTokenOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    family_id?: SortOrder
    expires_at?: SortOrder
    revoked_at?: SortOrderInput | SortOrder
    replaced_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: RefreshTokenCountOrderByAggregateInput
    _max?: RefreshTokenMaxOrderByAggregateInput
    _min?: RefreshTokenMinOrderByAggregateInput
  }

  export type RefreshTokenScalarWhereWithAggregatesInput = {
    AND?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    OR?: RefreshTokenScalarWhereWithAggregatesInput[]
    NOT?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RefreshToken"> | string
    user_id?: StringWithAggregatesFilter<"RefreshToken"> | string
    token_hash?: StringWithAggregatesFilter<"RefreshToken"> | string
    family_id?: StringWithAggregatesFilter<"RefreshToken"> | string
    expires_at?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
    revoked_at?: DateTimeNullableWithAggregatesFilter<"RefreshToken"> | Date | string | null
    replaced_by?: StringNullableWithAggregatesFilter<"RefreshToken"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"RefreshToken"> | Date | string
  }

  export type EmailVerificationTokenWhereInput = {
    AND?: EmailVerificationTokenWhereInput | EmailVerificationTokenWhereInput[]
    OR?: EmailVerificationTokenWhereInput[]
    NOT?: EmailVerificationTokenWhereInput | EmailVerificationTokenWhereInput[]
    id?: StringFilter<"EmailVerificationToken"> | string
    user_id?: StringFilter<"EmailVerificationToken"> | string
    token_hash?: StringFilter<"EmailVerificationToken"> | string
    expires_at?: DateTimeFilter<"EmailVerificationToken"> | Date | string
    used_at?: DateTimeNullableFilter<"EmailVerificationToken"> | Date | string | null
    created_at?: DateTimeFilter<"EmailVerificationToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type EmailVerificationTokenOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    expires_at?: SortOrder
    used_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type EmailVerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token_hash?: string
    AND?: EmailVerificationTokenWhereInput | EmailVerificationTokenWhereInput[]
    OR?: EmailVerificationTokenWhereInput[]
    NOT?: EmailVerificationTokenWhereInput | EmailVerificationTokenWhereInput[]
    user_id?: StringFilter<"EmailVerificationToken"> | string
    expires_at?: DateTimeFilter<"EmailVerificationToken"> | Date | string
    used_at?: DateTimeNullableFilter<"EmailVerificationToken"> | Date | string | null
    created_at?: DateTimeFilter<"EmailVerificationToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token_hash">

  export type EmailVerificationTokenOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    expires_at?: SortOrder
    used_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: EmailVerificationTokenCountOrderByAggregateInput
    _max?: EmailVerificationTokenMaxOrderByAggregateInput
    _min?: EmailVerificationTokenMinOrderByAggregateInput
  }

  export type EmailVerificationTokenScalarWhereWithAggregatesInput = {
    AND?: EmailVerificationTokenScalarWhereWithAggregatesInput | EmailVerificationTokenScalarWhereWithAggregatesInput[]
    OR?: EmailVerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: EmailVerificationTokenScalarWhereWithAggregatesInput | EmailVerificationTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EmailVerificationToken"> | string
    user_id?: StringWithAggregatesFilter<"EmailVerificationToken"> | string
    token_hash?: StringWithAggregatesFilter<"EmailVerificationToken"> | string
    expires_at?: DateTimeWithAggregatesFilter<"EmailVerificationToken"> | Date | string
    used_at?: DateTimeNullableWithAggregatesFilter<"EmailVerificationToken"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"EmailVerificationToken"> | Date | string
  }

  export type PasswordResetTokenWhereInput = {
    AND?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    OR?: PasswordResetTokenWhereInput[]
    NOT?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    id?: StringFilter<"PasswordResetToken"> | string
    user_id?: StringFilter<"PasswordResetToken"> | string
    token_hash?: StringFilter<"PasswordResetToken"> | string
    expires_at?: DateTimeFilter<"PasswordResetToken"> | Date | string
    used_at?: DateTimeNullableFilter<"PasswordResetToken"> | Date | string | null
    created_at?: DateTimeFilter<"PasswordResetToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PasswordResetTokenOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    expires_at?: SortOrder
    used_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PasswordResetTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token_hash?: string
    AND?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    OR?: PasswordResetTokenWhereInput[]
    NOT?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    user_id?: StringFilter<"PasswordResetToken"> | string
    expires_at?: DateTimeFilter<"PasswordResetToken"> | Date | string
    used_at?: DateTimeNullableFilter<"PasswordResetToken"> | Date | string | null
    created_at?: DateTimeFilter<"PasswordResetToken"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token_hash">

  export type PasswordResetTokenOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    expires_at?: SortOrder
    used_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: PasswordResetTokenCountOrderByAggregateInput
    _max?: PasswordResetTokenMaxOrderByAggregateInput
    _min?: PasswordResetTokenMinOrderByAggregateInput
  }

  export type PasswordResetTokenScalarWhereWithAggregatesInput = {
    AND?: PasswordResetTokenScalarWhereWithAggregatesInput | PasswordResetTokenScalarWhereWithAggregatesInput[]
    OR?: PasswordResetTokenScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetTokenScalarWhereWithAggregatesInput | PasswordResetTokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PasswordResetToken"> | string
    user_id?: StringWithAggregatesFilter<"PasswordResetToken"> | string
    token_hash?: StringWithAggregatesFilter<"PasswordResetToken"> | string
    expires_at?: DateTimeWithAggregatesFilter<"PasswordResetToken"> | Date | string
    used_at?: DateTimeNullableWithAggregatesFilter<"PasswordResetToken"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"PasswordResetToken"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterCreateNestedManyWithoutUserInput
    game_runs?: GameRunCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressUncheckedCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryUncheckedCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterUncheckedCreateNestedManyWithoutUserInput
    game_runs?: GameRunUncheckedCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUncheckedUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUncheckedUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUncheckedUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUncheckedUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileCreateInput = {
    level?: number
    xp?: number
    total_points?: number
    title?: string
    current_mission_id?: string
    highest_unlocked_mission_id?: string
    save_version?: number
    emperor_knight_unlocked_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutProfileInput
  }

  export type ProfileUncheckedCreateInput = {
    user_id: string
    level?: number
    xp?: number
    total_points?: number
    title?: string
    current_mission_id?: string
    highest_unlocked_mission_id?: string
    save_version?: number
    emperor_knight_unlocked_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProfileUpdateInput = {
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    total_points?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    current_mission_id?: StringFieldUpdateOperationsInput | string
    highest_unlocked_mission_id?: StringFieldUpdateOperationsInput | string
    save_version?: IntFieldUpdateOperationsInput | number
    emperor_knight_unlocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProfileNestedInput
  }

  export type ProfileUncheckedUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    total_points?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    current_mission_id?: StringFieldUpdateOperationsInput | string
    highest_unlocked_mission_id?: StringFieldUpdateOperationsInput | string
    save_version?: IntFieldUpdateOperationsInput | number
    emperor_knight_unlocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileCreateManyInput = {
    user_id: string
    level?: number
    xp?: number
    total_points?: number
    title?: string
    current_mission_id?: string
    highest_unlocked_mission_id?: string
    save_version?: number
    emperor_knight_unlocked_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProfileUpdateManyMutationInput = {
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    total_points?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    current_mission_id?: StringFieldUpdateOperationsInput | string
    highest_unlocked_mission_id?: StringFieldUpdateOperationsInput | string
    save_version?: IntFieldUpdateOperationsInput | number
    emperor_knight_unlocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUncheckedUpdateManyInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    total_points?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    current_mission_id?: StringFieldUpdateOperationsInput | string
    highest_unlocked_mission_id?: StringFieldUpdateOperationsInput | string
    save_version?: IntFieldUpdateOperationsInput | number
    emperor_knight_unlocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingsCreateInput = {
    master_volume?: number
    music_volume?: number
    sfx_volume?: number
    reduced_motion?: boolean
    screen_shake?: boolean
    show_fps?: boolean
    difficulty?: $Enums.Difficulty
    key_bindings: JsonNullValueInput | InputJsonValue
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutSettingsInput
  }

  export type SettingsUncheckedCreateInput = {
    user_id: string
    master_volume?: number
    music_volume?: number
    sfx_volume?: number
    reduced_motion?: boolean
    screen_shake?: boolean
    show_fps?: boolean
    difficulty?: $Enums.Difficulty
    key_bindings: JsonNullValueInput | InputJsonValue
    updated_at?: Date | string
  }

  export type SettingsUpdateInput = {
    master_volume?: FloatFieldUpdateOperationsInput | number
    music_volume?: FloatFieldUpdateOperationsInput | number
    sfx_volume?: FloatFieldUpdateOperationsInput | number
    reduced_motion?: BoolFieldUpdateOperationsInput | boolean
    screen_shake?: BoolFieldUpdateOperationsInput | boolean
    show_fps?: BoolFieldUpdateOperationsInput | boolean
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    key_bindings?: JsonNullValueInput | InputJsonValue
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSettingsNestedInput
  }

  export type SettingsUncheckedUpdateInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    master_volume?: FloatFieldUpdateOperationsInput | number
    music_volume?: FloatFieldUpdateOperationsInput | number
    sfx_volume?: FloatFieldUpdateOperationsInput | number
    reduced_motion?: BoolFieldUpdateOperationsInput | boolean
    screen_shake?: BoolFieldUpdateOperationsInput | boolean
    show_fps?: BoolFieldUpdateOperationsInput | boolean
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    key_bindings?: JsonNullValueInput | InputJsonValue
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingsCreateManyInput = {
    user_id: string
    master_volume?: number
    music_volume?: number
    sfx_volume?: number
    reduced_motion?: boolean
    screen_shake?: boolean
    show_fps?: boolean
    difficulty?: $Enums.Difficulty
    key_bindings: JsonNullValueInput | InputJsonValue
    updated_at?: Date | string
  }

  export type SettingsUpdateManyMutationInput = {
    master_volume?: FloatFieldUpdateOperationsInput | number
    music_volume?: FloatFieldUpdateOperationsInput | number
    sfx_volume?: FloatFieldUpdateOperationsInput | number
    reduced_motion?: BoolFieldUpdateOperationsInput | boolean
    screen_shake?: BoolFieldUpdateOperationsInput | boolean
    show_fps?: BoolFieldUpdateOperationsInput | boolean
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    key_bindings?: JsonNullValueInput | InputJsonValue
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingsUncheckedUpdateManyInput = {
    user_id?: StringFieldUpdateOperationsInput | string
    master_volume?: FloatFieldUpdateOperationsInput | number
    music_volume?: FloatFieldUpdateOperationsInput | number
    sfx_volume?: FloatFieldUpdateOperationsInput | number
    reduced_motion?: BoolFieldUpdateOperationsInput | boolean
    screen_shake?: BoolFieldUpdateOperationsInput | boolean
    show_fps?: BoolFieldUpdateOperationsInput | boolean
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    key_bindings?: JsonNullValueInput | InputJsonValue
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionProgressCreateInput = {
    id?: string
    mission_id: string
    status?: $Enums.MissionStatus
    best_score?: number
    best_time_ms?: number | null
    best_rank?: $Enums.MissionRank | null
    completions?: number
    first_completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    user: UserCreateNestedOneWithoutMission_progressInput
  }

  export type MissionProgressUncheckedCreateInput = {
    id?: string
    user_id: string
    mission_id: string
    status?: $Enums.MissionStatus
    best_score?: number
    best_time_ms?: number | null
    best_rank?: $Enums.MissionRank | null
    completions?: number
    first_completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MissionProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumMissionStatusFieldUpdateOperationsInput | $Enums.MissionStatus
    best_score?: IntFieldUpdateOperationsInput | number
    best_time_ms?: NullableIntFieldUpdateOperationsInput | number | null
    best_rank?: NullableEnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank | null
    completions?: IntFieldUpdateOperationsInput | number
    first_completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMission_progressNestedInput
  }

  export type MissionProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumMissionStatusFieldUpdateOperationsInput | $Enums.MissionStatus
    best_score?: IntFieldUpdateOperationsInput | number
    best_time_ms?: NullableIntFieldUpdateOperationsInput | number | null
    best_rank?: NullableEnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank | null
    completions?: IntFieldUpdateOperationsInput | number
    first_completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionProgressCreateManyInput = {
    id?: string
    user_id: string
    mission_id: string
    status?: $Enums.MissionStatus
    best_score?: number
    best_time_ms?: number | null
    best_rank?: $Enums.MissionRank | null
    completions?: number
    first_completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MissionProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumMissionStatusFieldUpdateOperationsInput | $Enums.MissionStatus
    best_score?: IntFieldUpdateOperationsInput | number
    best_time_ms?: NullableIntFieldUpdateOperationsInput | number | null
    best_rank?: NullableEnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank | null
    completions?: IntFieldUpdateOperationsInput | number
    first_completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumMissionStatusFieldUpdateOperationsInput | $Enums.MissionStatus
    best_score?: IntFieldUpdateOperationsInput | number
    best_time_ms?: NullableIntFieldUpdateOperationsInput | number | null
    best_rank?: NullableEnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank | null
    completions?: IntFieldUpdateOperationsInput | number
    first_completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScoreEntryCreateInput = {
    id?: string
    mission_id: string
    run_id: string
    score: number
    duration_ms: number
    rank: $Enums.MissionRank
    difficulty: $Enums.Difficulty
    created_at?: Date | string
    user: UserCreateNestedOneWithoutScore_entriesInput
  }

  export type ScoreEntryUncheckedCreateInput = {
    id?: string
    user_id: string
    mission_id: string
    run_id: string
    score: number
    duration_ms: number
    rank: $Enums.MissionRank
    difficulty: $Enums.Difficulty
    created_at?: Date | string
  }

  export type ScoreEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    run_id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    duration_ms?: IntFieldUpdateOperationsInput | number
    rank?: EnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutScore_entriesNestedInput
  }

  export type ScoreEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    run_id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    duration_ms?: IntFieldUpdateOperationsInput | number
    rank?: EnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScoreEntryCreateManyInput = {
    id?: string
    user_id: string
    mission_id: string
    run_id: string
    score: number
    duration_ms: number
    rank: $Enums.MissionRank
    difficulty: $Enums.Difficulty
    created_at?: Date | string
  }

  export type ScoreEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    run_id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    duration_ms?: IntFieldUpdateOperationsInput | number
    rank?: EnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScoreEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    run_id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    duration_ms?: IntFieldUpdateOperationsInput | number
    rank?: EnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnlockedCharacterCreateInput = {
    id?: string
    character_id: string
    source: string
    unlocked_at?: Date | string
    user: UserCreateNestedOneWithoutUnlocked_charactersInput
  }

  export type UnlockedCharacterUncheckedCreateInput = {
    id?: string
    user_id: string
    character_id: string
    source: string
    unlocked_at?: Date | string
  }

  export type UnlockedCharacterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    character_id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    unlocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUnlocked_charactersNestedInput
  }

  export type UnlockedCharacterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    character_id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    unlocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnlockedCharacterCreateManyInput = {
    id?: string
    user_id: string
    character_id: string
    source: string
    unlocked_at?: Date | string
  }

  export type UnlockedCharacterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    character_id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    unlocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnlockedCharacterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    character_id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    unlocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameRunCreateInput = {
    id?: string
    mission_id: string
    status?: $Enums.GameRunStatus
    started_at?: Date | string
    completed_at?: Date | string | null
    user: UserCreateNestedOneWithoutGame_runsInput
  }

  export type GameRunUncheckedCreateInput = {
    id?: string
    user_id: string
    mission_id: string
    status?: $Enums.GameRunStatus
    started_at?: Date | string
    completed_at?: Date | string | null
  }

  export type GameRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameRunStatusFieldUpdateOperationsInput | $Enums.GameRunStatus
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutGame_runsNestedInput
  }

  export type GameRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameRunStatusFieldUpdateOperationsInput | $Enums.GameRunStatus
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameRunCreateManyInput = {
    id?: string
    user_id: string
    mission_id: string
    status?: $Enums.GameRunStatus
    started_at?: Date | string
    completed_at?: Date | string | null
  }

  export type GameRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameRunStatusFieldUpdateOperationsInput | $Enums.GameRunStatus
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameRunStatusFieldUpdateOperationsInput | $Enums.GameRunStatus
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RefreshTokenCreateInput = {
    id?: string
    token_hash: string
    family_id: string
    expires_at: Date | string
    revoked_at?: Date | string | null
    replaced_by?: string | null
    created_at?: Date | string
    user: UserCreateNestedOneWithoutRefresh_tokensInput
  }

  export type RefreshTokenUncheckedCreateInput = {
    id?: string
    user_id: string
    token_hash: string
    family_id: string
    expires_at: Date | string
    revoked_at?: Date | string | null
    replaced_by?: string | null
    created_at?: Date | string
  }

  export type RefreshTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    family_id?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replaced_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutRefresh_tokensNestedInput
  }

  export type RefreshTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    family_id?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replaced_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateManyInput = {
    id?: string
    user_id: string
    token_hash: string
    family_id: string
    expires_at: Date | string
    revoked_at?: Date | string | null
    replaced_by?: string | null
    created_at?: Date | string
  }

  export type RefreshTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    family_id?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replaced_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    family_id?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replaced_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailVerificationTokenCreateInput = {
    id?: string
    token_hash: string
    expires_at: Date | string
    used_at?: Date | string | null
    created_at?: Date | string
    user: UserCreateNestedOneWithoutEmail_verification_tokensInput
  }

  export type EmailVerificationTokenUncheckedCreateInput = {
    id?: string
    user_id: string
    token_hash: string
    expires_at: Date | string
    used_at?: Date | string | null
    created_at?: Date | string
  }

  export type EmailVerificationTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutEmail_verification_tokensNestedInput
  }

  export type EmailVerificationTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailVerificationTokenCreateManyInput = {
    id?: string
    user_id: string
    token_hash: string
    expires_at: Date | string
    used_at?: Date | string | null
    created_at?: Date | string
  }

  export type EmailVerificationTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailVerificationTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenCreateInput = {
    id?: string
    token_hash: string
    expires_at: Date | string
    used_at?: Date | string | null
    created_at?: Date | string
    user: UserCreateNestedOneWithoutPassword_reset_tokensInput
  }

  export type PasswordResetTokenUncheckedCreateInput = {
    id?: string
    user_id: string
    token_hash: string
    expires_at: Date | string
    used_at?: Date | string | null
    created_at?: Date | string
  }

  export type PasswordResetTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPassword_reset_tokensNestedInput
  }

  export type PasswordResetTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenCreateManyInput = {
    id?: string
    user_id: string
    token_hash: string
    expires_at: Date | string
    used_at?: Date | string | null
    created_at?: Date | string
  }

  export type PasswordResetTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumAuthRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthRole | EnumAuthRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthRoleFilter<$PrismaModel> | $Enums.AuthRole
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

  export type ProfileNullableScalarRelationFilter = {
    is?: ProfileWhereInput | null
    isNot?: ProfileWhereInput | null
  }

  export type SettingsNullableScalarRelationFilter = {
    is?: SettingsWhereInput | null
    isNot?: SettingsWhereInput | null
  }

  export type MissionProgressListRelationFilter = {
    every?: MissionProgressWhereInput
    some?: MissionProgressWhereInput
    none?: MissionProgressWhereInput
  }

  export type ScoreEntryListRelationFilter = {
    every?: ScoreEntryWhereInput
    some?: ScoreEntryWhereInput
    none?: ScoreEntryWhereInput
  }

  export type UnlockedCharacterListRelationFilter = {
    every?: UnlockedCharacterWhereInput
    some?: UnlockedCharacterWhereInput
    none?: UnlockedCharacterWhereInput
  }

  export type GameRunListRelationFilter = {
    every?: GameRunWhereInput
    some?: GameRunWhereInput
    none?: GameRunWhereInput
  }

  export type RefreshTokenListRelationFilter = {
    every?: RefreshTokenWhereInput
    some?: RefreshTokenWhereInput
    none?: RefreshTokenWhereInput
  }

  export type EmailVerificationTokenListRelationFilter = {
    every?: EmailVerificationTokenWhereInput
    some?: EmailVerificationTokenWhereInput
    none?: EmailVerificationTokenWhereInput
  }

  export type PasswordResetTokenListRelationFilter = {
    every?: PasswordResetTokenWhereInput
    some?: PasswordResetTokenWhereInput
    none?: PasswordResetTokenWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MissionProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScoreEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UnlockedCharacterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RefreshTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EmailVerificationTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PasswordResetTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    username_normalized?: SortOrder
    password?: SortOrder
    role?: SortOrder
    email_verified_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    username_normalized?: SortOrder
    password?: SortOrder
    role?: SortOrder
    email_verified_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    username_normalized?: SortOrder
    password?: SortOrder
    role?: SortOrder
    email_verified_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
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

  export type EnumAuthRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthRole | EnumAuthRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthRoleWithAggregatesFilter<$PrismaModel> | $Enums.AuthRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthRoleFilter<$PrismaModel>
    _max?: NestedEnumAuthRoleFilter<$PrismaModel>
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

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type ProfileCountOrderByAggregateInput = {
    user_id?: SortOrder
    level?: SortOrder
    xp?: SortOrder
    total_points?: SortOrder
    title?: SortOrder
    current_mission_id?: SortOrder
    highest_unlocked_mission_id?: SortOrder
    save_version?: SortOrder
    emperor_knight_unlocked_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProfileAvgOrderByAggregateInput = {
    level?: SortOrder
    xp?: SortOrder
    total_points?: SortOrder
    save_version?: SortOrder
  }

  export type ProfileMaxOrderByAggregateInput = {
    user_id?: SortOrder
    level?: SortOrder
    xp?: SortOrder
    total_points?: SortOrder
    title?: SortOrder
    current_mission_id?: SortOrder
    highest_unlocked_mission_id?: SortOrder
    save_version?: SortOrder
    emperor_knight_unlocked_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProfileMinOrderByAggregateInput = {
    user_id?: SortOrder
    level?: SortOrder
    xp?: SortOrder
    total_points?: SortOrder
    title?: SortOrder
    current_mission_id?: SortOrder
    highest_unlocked_mission_id?: SortOrder
    save_version?: SortOrder
    emperor_knight_unlocked_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ProfileSumOrderByAggregateInput = {
    level?: SortOrder
    xp?: SortOrder
    total_points?: SortOrder
    save_version?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyFilter<$PrismaModel> | $Enums.Difficulty
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

  export type SettingsCountOrderByAggregateInput = {
    user_id?: SortOrder
    master_volume?: SortOrder
    music_volume?: SortOrder
    sfx_volume?: SortOrder
    reduced_motion?: SortOrder
    screen_shake?: SortOrder
    show_fps?: SortOrder
    difficulty?: SortOrder
    key_bindings?: SortOrder
    updated_at?: SortOrder
  }

  export type SettingsAvgOrderByAggregateInput = {
    master_volume?: SortOrder
    music_volume?: SortOrder
    sfx_volume?: SortOrder
  }

  export type SettingsMaxOrderByAggregateInput = {
    user_id?: SortOrder
    master_volume?: SortOrder
    music_volume?: SortOrder
    sfx_volume?: SortOrder
    reduced_motion?: SortOrder
    screen_shake?: SortOrder
    show_fps?: SortOrder
    difficulty?: SortOrder
    updated_at?: SortOrder
  }

  export type SettingsMinOrderByAggregateInput = {
    user_id?: SortOrder
    master_volume?: SortOrder
    music_volume?: SortOrder
    sfx_volume?: SortOrder
    reduced_motion?: SortOrder
    screen_shake?: SortOrder
    show_fps?: SortOrder
    difficulty?: SortOrder
    updated_at?: SortOrder
  }

  export type SettingsSumOrderByAggregateInput = {
    master_volume?: SortOrder
    music_volume?: SortOrder
    sfx_volume?: SortOrder
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.Difficulty
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDifficultyFilter<$PrismaModel>
    _max?: NestedEnumDifficultyFilter<$PrismaModel>
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

  export type EnumMissionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MissionStatus | EnumMissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MissionStatus[] | ListEnumMissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MissionStatus[] | ListEnumMissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMissionStatusFilter<$PrismaModel> | $Enums.MissionStatus
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

  export type EnumMissionRankNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MissionRank | EnumMissionRankFieldRefInput<$PrismaModel> | null
    in?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMissionRankNullableFilter<$PrismaModel> | $Enums.MissionRank | null
  }

  export type MissionProgressUser_idMission_idCompoundUniqueInput = {
    user_id: string
    mission_id: string
  }

  export type MissionProgressCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    status?: SortOrder
    best_score?: SortOrder
    best_time_ms?: SortOrder
    best_rank?: SortOrder
    completions?: SortOrder
    first_completed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MissionProgressAvgOrderByAggregateInput = {
    best_score?: SortOrder
    best_time_ms?: SortOrder
    completions?: SortOrder
  }

  export type MissionProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    status?: SortOrder
    best_score?: SortOrder
    best_time_ms?: SortOrder
    best_rank?: SortOrder
    completions?: SortOrder
    first_completed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MissionProgressMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    status?: SortOrder
    best_score?: SortOrder
    best_time_ms?: SortOrder
    best_rank?: SortOrder
    completions?: SortOrder
    first_completed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MissionProgressSumOrderByAggregateInput = {
    best_score?: SortOrder
    best_time_ms?: SortOrder
    completions?: SortOrder
  }

  export type EnumMissionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MissionStatus | EnumMissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MissionStatus[] | ListEnumMissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MissionStatus[] | ListEnumMissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMissionStatusWithAggregatesFilter<$PrismaModel> | $Enums.MissionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMissionStatusFilter<$PrismaModel>
    _max?: NestedEnumMissionStatusFilter<$PrismaModel>
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

  export type EnumMissionRankNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MissionRank | EnumMissionRankFieldRefInput<$PrismaModel> | null
    in?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMissionRankNullableWithAggregatesFilter<$PrismaModel> | $Enums.MissionRank | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMissionRankNullableFilter<$PrismaModel>
    _max?: NestedEnumMissionRankNullableFilter<$PrismaModel>
  }

  export type EnumMissionRankFilter<$PrismaModel = never> = {
    equals?: $Enums.MissionRank | EnumMissionRankFieldRefInput<$PrismaModel>
    in?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel>
    notIn?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel>
    not?: NestedEnumMissionRankFilter<$PrismaModel> | $Enums.MissionRank
  }

  export type ScoreEntryCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    run_id?: SortOrder
    score?: SortOrder
    duration_ms?: SortOrder
    rank?: SortOrder
    difficulty?: SortOrder
    created_at?: SortOrder
  }

  export type ScoreEntryAvgOrderByAggregateInput = {
    score?: SortOrder
    duration_ms?: SortOrder
  }

  export type ScoreEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    run_id?: SortOrder
    score?: SortOrder
    duration_ms?: SortOrder
    rank?: SortOrder
    difficulty?: SortOrder
    created_at?: SortOrder
  }

  export type ScoreEntryMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    run_id?: SortOrder
    score?: SortOrder
    duration_ms?: SortOrder
    rank?: SortOrder
    difficulty?: SortOrder
    created_at?: SortOrder
  }

  export type ScoreEntrySumOrderByAggregateInput = {
    score?: SortOrder
    duration_ms?: SortOrder
  }

  export type EnumMissionRankWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MissionRank | EnumMissionRankFieldRefInput<$PrismaModel>
    in?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel>
    notIn?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel>
    not?: NestedEnumMissionRankWithAggregatesFilter<$PrismaModel> | $Enums.MissionRank
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMissionRankFilter<$PrismaModel>
    _max?: NestedEnumMissionRankFilter<$PrismaModel>
  }

  export type UnlockedCharacterUser_idCharacter_idCompoundUniqueInput = {
    user_id: string
    character_id: string
  }

  export type UnlockedCharacterCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    character_id?: SortOrder
    source?: SortOrder
    unlocked_at?: SortOrder
  }

  export type UnlockedCharacterMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    character_id?: SortOrder
    source?: SortOrder
    unlocked_at?: SortOrder
  }

  export type UnlockedCharacterMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    character_id?: SortOrder
    source?: SortOrder
    unlocked_at?: SortOrder
  }

  export type EnumGameRunStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GameRunStatus | EnumGameRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameRunStatus[] | ListEnumGameRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameRunStatus[] | ListEnumGameRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameRunStatusFilter<$PrismaModel> | $Enums.GameRunStatus
  }

  export type GameRunCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    status?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrder
  }

  export type GameRunMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    status?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrder
  }

  export type GameRunMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    mission_id?: SortOrder
    status?: SortOrder
    started_at?: SortOrder
    completed_at?: SortOrder
  }

  export type EnumGameRunStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameRunStatus | EnumGameRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameRunStatus[] | ListEnumGameRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameRunStatus[] | ListEnumGameRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameRunStatusWithAggregatesFilter<$PrismaModel> | $Enums.GameRunStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameRunStatusFilter<$PrismaModel>
    _max?: NestedEnumGameRunStatusFilter<$PrismaModel>
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

  export type RefreshTokenCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    family_id?: SortOrder
    expires_at?: SortOrder
    revoked_at?: SortOrder
    replaced_by?: SortOrder
    created_at?: SortOrder
  }

  export type RefreshTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    family_id?: SortOrder
    expires_at?: SortOrder
    revoked_at?: SortOrder
    replaced_by?: SortOrder
    created_at?: SortOrder
  }

  export type RefreshTokenMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    family_id?: SortOrder
    expires_at?: SortOrder
    revoked_at?: SortOrder
    replaced_by?: SortOrder
    created_at?: SortOrder
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

  export type EmailVerificationTokenCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    expires_at?: SortOrder
    used_at?: SortOrder
    created_at?: SortOrder
  }

  export type EmailVerificationTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    expires_at?: SortOrder
    used_at?: SortOrder
    created_at?: SortOrder
  }

  export type EmailVerificationTokenMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    expires_at?: SortOrder
    used_at?: SortOrder
    created_at?: SortOrder
  }

  export type PasswordResetTokenCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    expires_at?: SortOrder
    used_at?: SortOrder
    created_at?: SortOrder
  }

  export type PasswordResetTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    expires_at?: SortOrder
    used_at?: SortOrder
    created_at?: SortOrder
  }

  export type PasswordResetTokenMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    token_hash?: SortOrder
    expires_at?: SortOrder
    used_at?: SortOrder
    created_at?: SortOrder
  }

  export type ProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<ProfileCreateWithoutUserInput, ProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput
    connect?: ProfileWhereUniqueInput
  }

  export type SettingsCreateNestedOneWithoutUserInput = {
    create?: XOR<SettingsCreateWithoutUserInput, SettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: SettingsCreateOrConnectWithoutUserInput
    connect?: SettingsWhereUniqueInput
  }

  export type MissionProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<MissionProgressCreateWithoutUserInput, MissionProgressUncheckedCreateWithoutUserInput> | MissionProgressCreateWithoutUserInput[] | MissionProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MissionProgressCreateOrConnectWithoutUserInput | MissionProgressCreateOrConnectWithoutUserInput[]
    createMany?: MissionProgressCreateManyUserInputEnvelope
    connect?: MissionProgressWhereUniqueInput | MissionProgressWhereUniqueInput[]
  }

  export type ScoreEntryCreateNestedManyWithoutUserInput = {
    create?: XOR<ScoreEntryCreateWithoutUserInput, ScoreEntryUncheckedCreateWithoutUserInput> | ScoreEntryCreateWithoutUserInput[] | ScoreEntryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScoreEntryCreateOrConnectWithoutUserInput | ScoreEntryCreateOrConnectWithoutUserInput[]
    createMany?: ScoreEntryCreateManyUserInputEnvelope
    connect?: ScoreEntryWhereUniqueInput | ScoreEntryWhereUniqueInput[]
  }

  export type UnlockedCharacterCreateNestedManyWithoutUserInput = {
    create?: XOR<UnlockedCharacterCreateWithoutUserInput, UnlockedCharacterUncheckedCreateWithoutUserInput> | UnlockedCharacterCreateWithoutUserInput[] | UnlockedCharacterUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UnlockedCharacterCreateOrConnectWithoutUserInput | UnlockedCharacterCreateOrConnectWithoutUserInput[]
    createMany?: UnlockedCharacterCreateManyUserInputEnvelope
    connect?: UnlockedCharacterWhereUniqueInput | UnlockedCharacterWhereUniqueInput[]
  }

  export type GameRunCreateNestedManyWithoutUserInput = {
    create?: XOR<GameRunCreateWithoutUserInput, GameRunUncheckedCreateWithoutUserInput> | GameRunCreateWithoutUserInput[] | GameRunUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameRunCreateOrConnectWithoutUserInput | GameRunCreateOrConnectWithoutUserInput[]
    createMany?: GameRunCreateManyUserInputEnvelope
    connect?: GameRunWhereUniqueInput | GameRunWhereUniqueInput[]
  }

  export type RefreshTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type EmailVerificationTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<EmailVerificationTokenCreateWithoutUserInput, EmailVerificationTokenUncheckedCreateWithoutUserInput> | EmailVerificationTokenCreateWithoutUserInput[] | EmailVerificationTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmailVerificationTokenCreateOrConnectWithoutUserInput | EmailVerificationTokenCreateOrConnectWithoutUserInput[]
    createMany?: EmailVerificationTokenCreateManyUserInputEnvelope
    connect?: EmailVerificationTokenWhereUniqueInput | EmailVerificationTokenWhereUniqueInput[]
  }

  export type PasswordResetTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
  }

  export type ProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<ProfileCreateWithoutUserInput, ProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput
    connect?: ProfileWhereUniqueInput
  }

  export type SettingsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<SettingsCreateWithoutUserInput, SettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: SettingsCreateOrConnectWithoutUserInput
    connect?: SettingsWhereUniqueInput
  }

  export type MissionProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MissionProgressCreateWithoutUserInput, MissionProgressUncheckedCreateWithoutUserInput> | MissionProgressCreateWithoutUserInput[] | MissionProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MissionProgressCreateOrConnectWithoutUserInput | MissionProgressCreateOrConnectWithoutUserInput[]
    createMany?: MissionProgressCreateManyUserInputEnvelope
    connect?: MissionProgressWhereUniqueInput | MissionProgressWhereUniqueInput[]
  }

  export type ScoreEntryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ScoreEntryCreateWithoutUserInput, ScoreEntryUncheckedCreateWithoutUserInput> | ScoreEntryCreateWithoutUserInput[] | ScoreEntryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScoreEntryCreateOrConnectWithoutUserInput | ScoreEntryCreateOrConnectWithoutUserInput[]
    createMany?: ScoreEntryCreateManyUserInputEnvelope
    connect?: ScoreEntryWhereUniqueInput | ScoreEntryWhereUniqueInput[]
  }

  export type UnlockedCharacterUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UnlockedCharacterCreateWithoutUserInput, UnlockedCharacterUncheckedCreateWithoutUserInput> | UnlockedCharacterCreateWithoutUserInput[] | UnlockedCharacterUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UnlockedCharacterCreateOrConnectWithoutUserInput | UnlockedCharacterCreateOrConnectWithoutUserInput[]
    createMany?: UnlockedCharacterCreateManyUserInputEnvelope
    connect?: UnlockedCharacterWhereUniqueInput | UnlockedCharacterWhereUniqueInput[]
  }

  export type GameRunUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<GameRunCreateWithoutUserInput, GameRunUncheckedCreateWithoutUserInput> | GameRunCreateWithoutUserInput[] | GameRunUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameRunCreateOrConnectWithoutUserInput | GameRunCreateOrConnectWithoutUserInput[]
    createMany?: GameRunCreateManyUserInputEnvelope
    connect?: GameRunWhereUniqueInput | GameRunWhereUniqueInput[]
  }

  export type RefreshTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput> | RefreshTokenCreateWithoutUserInput[] | RefreshTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: RefreshTokenCreateOrConnectWithoutUserInput | RefreshTokenCreateOrConnectWithoutUserInput[]
    createMany?: RefreshTokenCreateManyUserInputEnvelope
    connect?: RefreshTokenWhereUniqueInput | RefreshTokenWhereUniqueInput[]
  }

  export type EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EmailVerificationTokenCreateWithoutUserInput, EmailVerificationTokenUncheckedCreateWithoutUserInput> | EmailVerificationTokenCreateWithoutUserInput[] | EmailVerificationTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmailVerificationTokenCreateOrConnectWithoutUserInput | EmailVerificationTokenCreateOrConnectWithoutUserInput[]
    createMany?: EmailVerificationTokenCreateManyUserInputEnvelope
    connect?: EmailVerificationTokenWhereUniqueInput | EmailVerificationTokenWhereUniqueInput[]
  }

  export type PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumAuthRoleFieldUpdateOperationsInput = {
    set?: $Enums.AuthRole
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<ProfileCreateWithoutUserInput, ProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput
    upsert?: ProfileUpsertWithoutUserInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutUserInput, ProfileUpdateWithoutUserInput>, ProfileUncheckedUpdateWithoutUserInput>
  }

  export type SettingsUpdateOneWithoutUserNestedInput = {
    create?: XOR<SettingsCreateWithoutUserInput, SettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: SettingsCreateOrConnectWithoutUserInput
    upsert?: SettingsUpsertWithoutUserInput
    disconnect?: SettingsWhereInput | boolean
    delete?: SettingsWhereInput | boolean
    connect?: SettingsWhereUniqueInput
    update?: XOR<XOR<SettingsUpdateToOneWithWhereWithoutUserInput, SettingsUpdateWithoutUserInput>, SettingsUncheckedUpdateWithoutUserInput>
  }

  export type MissionProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<MissionProgressCreateWithoutUserInput, MissionProgressUncheckedCreateWithoutUserInput> | MissionProgressCreateWithoutUserInput[] | MissionProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MissionProgressCreateOrConnectWithoutUserInput | MissionProgressCreateOrConnectWithoutUserInput[]
    upsert?: MissionProgressUpsertWithWhereUniqueWithoutUserInput | MissionProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MissionProgressCreateManyUserInputEnvelope
    set?: MissionProgressWhereUniqueInput | MissionProgressWhereUniqueInput[]
    disconnect?: MissionProgressWhereUniqueInput | MissionProgressWhereUniqueInput[]
    delete?: MissionProgressWhereUniqueInput | MissionProgressWhereUniqueInput[]
    connect?: MissionProgressWhereUniqueInput | MissionProgressWhereUniqueInput[]
    update?: MissionProgressUpdateWithWhereUniqueWithoutUserInput | MissionProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MissionProgressUpdateManyWithWhereWithoutUserInput | MissionProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MissionProgressScalarWhereInput | MissionProgressScalarWhereInput[]
  }

  export type ScoreEntryUpdateManyWithoutUserNestedInput = {
    create?: XOR<ScoreEntryCreateWithoutUserInput, ScoreEntryUncheckedCreateWithoutUserInput> | ScoreEntryCreateWithoutUserInput[] | ScoreEntryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScoreEntryCreateOrConnectWithoutUserInput | ScoreEntryCreateOrConnectWithoutUserInput[]
    upsert?: ScoreEntryUpsertWithWhereUniqueWithoutUserInput | ScoreEntryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ScoreEntryCreateManyUserInputEnvelope
    set?: ScoreEntryWhereUniqueInput | ScoreEntryWhereUniqueInput[]
    disconnect?: ScoreEntryWhereUniqueInput | ScoreEntryWhereUniqueInput[]
    delete?: ScoreEntryWhereUniqueInput | ScoreEntryWhereUniqueInput[]
    connect?: ScoreEntryWhereUniqueInput | ScoreEntryWhereUniqueInput[]
    update?: ScoreEntryUpdateWithWhereUniqueWithoutUserInput | ScoreEntryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ScoreEntryUpdateManyWithWhereWithoutUserInput | ScoreEntryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ScoreEntryScalarWhereInput | ScoreEntryScalarWhereInput[]
  }

  export type UnlockedCharacterUpdateManyWithoutUserNestedInput = {
    create?: XOR<UnlockedCharacterCreateWithoutUserInput, UnlockedCharacterUncheckedCreateWithoutUserInput> | UnlockedCharacterCreateWithoutUserInput[] | UnlockedCharacterUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UnlockedCharacterCreateOrConnectWithoutUserInput | UnlockedCharacterCreateOrConnectWithoutUserInput[]
    upsert?: UnlockedCharacterUpsertWithWhereUniqueWithoutUserInput | UnlockedCharacterUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UnlockedCharacterCreateManyUserInputEnvelope
    set?: UnlockedCharacterWhereUniqueInput | UnlockedCharacterWhereUniqueInput[]
    disconnect?: UnlockedCharacterWhereUniqueInput | UnlockedCharacterWhereUniqueInput[]
    delete?: UnlockedCharacterWhereUniqueInput | UnlockedCharacterWhereUniqueInput[]
    connect?: UnlockedCharacterWhereUniqueInput | UnlockedCharacterWhereUniqueInput[]
    update?: UnlockedCharacterUpdateWithWhereUniqueWithoutUserInput | UnlockedCharacterUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UnlockedCharacterUpdateManyWithWhereWithoutUserInput | UnlockedCharacterUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UnlockedCharacterScalarWhereInput | UnlockedCharacterScalarWhereInput[]
  }

  export type GameRunUpdateManyWithoutUserNestedInput = {
    create?: XOR<GameRunCreateWithoutUserInput, GameRunUncheckedCreateWithoutUserInput> | GameRunCreateWithoutUserInput[] | GameRunUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameRunCreateOrConnectWithoutUserInput | GameRunCreateOrConnectWithoutUserInput[]
    upsert?: GameRunUpsertWithWhereUniqueWithoutUserInput | GameRunUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GameRunCreateManyUserInputEnvelope
    set?: GameRunWhereUniqueInput | GameRunWhereUniqueInput[]
    disconnect?: GameRunWhereUniqueInput | GameRunWhereUniqueInput[]
    delete?: GameRunWhereUniqueInput | GameRunWhereUniqueInput[]
    connect?: GameRunWhereUniqueInput | GameRunWhereUniqueInput[]
    update?: GameRunUpdateWithWhereUniqueWithoutUserInput | GameRunUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GameRunUpdateManyWithWhereWithoutUserInput | GameRunUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GameRunScalarWhereInput | GameRunScalarWhereInput[]
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

  export type EmailVerificationTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<EmailVerificationTokenCreateWithoutUserInput, EmailVerificationTokenUncheckedCreateWithoutUserInput> | EmailVerificationTokenCreateWithoutUserInput[] | EmailVerificationTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmailVerificationTokenCreateOrConnectWithoutUserInput | EmailVerificationTokenCreateOrConnectWithoutUserInput[]
    upsert?: EmailVerificationTokenUpsertWithWhereUniqueWithoutUserInput | EmailVerificationTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EmailVerificationTokenCreateManyUserInputEnvelope
    set?: EmailVerificationTokenWhereUniqueInput | EmailVerificationTokenWhereUniqueInput[]
    disconnect?: EmailVerificationTokenWhereUniqueInput | EmailVerificationTokenWhereUniqueInput[]
    delete?: EmailVerificationTokenWhereUniqueInput | EmailVerificationTokenWhereUniqueInput[]
    connect?: EmailVerificationTokenWhereUniqueInput | EmailVerificationTokenWhereUniqueInput[]
    update?: EmailVerificationTokenUpdateWithWhereUniqueWithoutUserInput | EmailVerificationTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EmailVerificationTokenUpdateManyWithWhereWithoutUserInput | EmailVerificationTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EmailVerificationTokenScalarWhereInput | EmailVerificationTokenScalarWhereInput[]
  }

  export type PasswordResetTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput | PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    set?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    disconnect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    delete?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    update?: PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput | PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetTokenUpdateManyWithWhereWithoutUserInput | PasswordResetTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
  }

  export type ProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<ProfileCreateWithoutUserInput, ProfileUncheckedCreateWithoutUserInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput
    upsert?: ProfileUpsertWithoutUserInput
    disconnect?: ProfileWhereInput | boolean
    delete?: ProfileWhereInput | boolean
    connect?: ProfileWhereUniqueInput
    update?: XOR<XOR<ProfileUpdateToOneWithWhereWithoutUserInput, ProfileUpdateWithoutUserInput>, ProfileUncheckedUpdateWithoutUserInput>
  }

  export type SettingsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<SettingsCreateWithoutUserInput, SettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: SettingsCreateOrConnectWithoutUserInput
    upsert?: SettingsUpsertWithoutUserInput
    disconnect?: SettingsWhereInput | boolean
    delete?: SettingsWhereInput | boolean
    connect?: SettingsWhereUniqueInput
    update?: XOR<XOR<SettingsUpdateToOneWithWhereWithoutUserInput, SettingsUpdateWithoutUserInput>, SettingsUncheckedUpdateWithoutUserInput>
  }

  export type MissionProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MissionProgressCreateWithoutUserInput, MissionProgressUncheckedCreateWithoutUserInput> | MissionProgressCreateWithoutUserInput[] | MissionProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MissionProgressCreateOrConnectWithoutUserInput | MissionProgressCreateOrConnectWithoutUserInput[]
    upsert?: MissionProgressUpsertWithWhereUniqueWithoutUserInput | MissionProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MissionProgressCreateManyUserInputEnvelope
    set?: MissionProgressWhereUniqueInput | MissionProgressWhereUniqueInput[]
    disconnect?: MissionProgressWhereUniqueInput | MissionProgressWhereUniqueInput[]
    delete?: MissionProgressWhereUniqueInput | MissionProgressWhereUniqueInput[]
    connect?: MissionProgressWhereUniqueInput | MissionProgressWhereUniqueInput[]
    update?: MissionProgressUpdateWithWhereUniqueWithoutUserInput | MissionProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MissionProgressUpdateManyWithWhereWithoutUserInput | MissionProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MissionProgressScalarWhereInput | MissionProgressScalarWhereInput[]
  }

  export type ScoreEntryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ScoreEntryCreateWithoutUserInput, ScoreEntryUncheckedCreateWithoutUserInput> | ScoreEntryCreateWithoutUserInput[] | ScoreEntryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScoreEntryCreateOrConnectWithoutUserInput | ScoreEntryCreateOrConnectWithoutUserInput[]
    upsert?: ScoreEntryUpsertWithWhereUniqueWithoutUserInput | ScoreEntryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ScoreEntryCreateManyUserInputEnvelope
    set?: ScoreEntryWhereUniqueInput | ScoreEntryWhereUniqueInput[]
    disconnect?: ScoreEntryWhereUniqueInput | ScoreEntryWhereUniqueInput[]
    delete?: ScoreEntryWhereUniqueInput | ScoreEntryWhereUniqueInput[]
    connect?: ScoreEntryWhereUniqueInput | ScoreEntryWhereUniqueInput[]
    update?: ScoreEntryUpdateWithWhereUniqueWithoutUserInput | ScoreEntryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ScoreEntryUpdateManyWithWhereWithoutUserInput | ScoreEntryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ScoreEntryScalarWhereInput | ScoreEntryScalarWhereInput[]
  }

  export type UnlockedCharacterUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UnlockedCharacterCreateWithoutUserInput, UnlockedCharacterUncheckedCreateWithoutUserInput> | UnlockedCharacterCreateWithoutUserInput[] | UnlockedCharacterUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UnlockedCharacterCreateOrConnectWithoutUserInput | UnlockedCharacterCreateOrConnectWithoutUserInput[]
    upsert?: UnlockedCharacterUpsertWithWhereUniqueWithoutUserInput | UnlockedCharacterUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UnlockedCharacterCreateManyUserInputEnvelope
    set?: UnlockedCharacterWhereUniqueInput | UnlockedCharacterWhereUniqueInput[]
    disconnect?: UnlockedCharacterWhereUniqueInput | UnlockedCharacterWhereUniqueInput[]
    delete?: UnlockedCharacterWhereUniqueInput | UnlockedCharacterWhereUniqueInput[]
    connect?: UnlockedCharacterWhereUniqueInput | UnlockedCharacterWhereUniqueInput[]
    update?: UnlockedCharacterUpdateWithWhereUniqueWithoutUserInput | UnlockedCharacterUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UnlockedCharacterUpdateManyWithWhereWithoutUserInput | UnlockedCharacterUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UnlockedCharacterScalarWhereInput | UnlockedCharacterScalarWhereInput[]
  }

  export type GameRunUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<GameRunCreateWithoutUserInput, GameRunUncheckedCreateWithoutUserInput> | GameRunCreateWithoutUserInput[] | GameRunUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameRunCreateOrConnectWithoutUserInput | GameRunCreateOrConnectWithoutUserInput[]
    upsert?: GameRunUpsertWithWhereUniqueWithoutUserInput | GameRunUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GameRunCreateManyUserInputEnvelope
    set?: GameRunWhereUniqueInput | GameRunWhereUniqueInput[]
    disconnect?: GameRunWhereUniqueInput | GameRunWhereUniqueInput[]
    delete?: GameRunWhereUniqueInput | GameRunWhereUniqueInput[]
    connect?: GameRunWhereUniqueInput | GameRunWhereUniqueInput[]
    update?: GameRunUpdateWithWhereUniqueWithoutUserInput | GameRunUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GameRunUpdateManyWithWhereWithoutUserInput | GameRunUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GameRunScalarWhereInput | GameRunScalarWhereInput[]
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

  export type EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EmailVerificationTokenCreateWithoutUserInput, EmailVerificationTokenUncheckedCreateWithoutUserInput> | EmailVerificationTokenCreateWithoutUserInput[] | EmailVerificationTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EmailVerificationTokenCreateOrConnectWithoutUserInput | EmailVerificationTokenCreateOrConnectWithoutUserInput[]
    upsert?: EmailVerificationTokenUpsertWithWhereUniqueWithoutUserInput | EmailVerificationTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EmailVerificationTokenCreateManyUserInputEnvelope
    set?: EmailVerificationTokenWhereUniqueInput | EmailVerificationTokenWhereUniqueInput[]
    disconnect?: EmailVerificationTokenWhereUniqueInput | EmailVerificationTokenWhereUniqueInput[]
    delete?: EmailVerificationTokenWhereUniqueInput | EmailVerificationTokenWhereUniqueInput[]
    connect?: EmailVerificationTokenWhereUniqueInput | EmailVerificationTokenWhereUniqueInput[]
    update?: EmailVerificationTokenUpdateWithWhereUniqueWithoutUserInput | EmailVerificationTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EmailVerificationTokenUpdateManyWithWhereWithoutUserInput | EmailVerificationTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EmailVerificationTokenScalarWhereInput | EmailVerificationTokenScalarWhereInput[]
  }

  export type PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput | PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    set?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    disconnect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    delete?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    update?: PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput | PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetTokenUpdateManyWithWhereWithoutUserInput | PasswordResetTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutProfileInput = {
    create?: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutProfileNestedInput = {
    create?: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput
    upsert?: UserUpsertWithoutProfileInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProfileInput, UserUpdateWithoutProfileInput>, UserUncheckedUpdateWithoutProfileInput>
  }

  export type UserCreateNestedOneWithoutSettingsInput = {
    create?: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSettingsInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumDifficultyFieldUpdateOperationsInput = {
    set?: $Enums.Difficulty
  }

  export type UserUpdateOneRequiredWithoutSettingsNestedInput = {
    create?: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSettingsInput
    upsert?: UserUpsertWithoutSettingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSettingsInput, UserUpdateWithoutSettingsInput>, UserUncheckedUpdateWithoutSettingsInput>
  }

  export type UserCreateNestedOneWithoutMission_progressInput = {
    create?: XOR<UserCreateWithoutMission_progressInput, UserUncheckedCreateWithoutMission_progressInput>
    connectOrCreate?: UserCreateOrConnectWithoutMission_progressInput
    connect?: UserWhereUniqueInput
  }

  export type EnumMissionStatusFieldUpdateOperationsInput = {
    set?: $Enums.MissionStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableEnumMissionRankFieldUpdateOperationsInput = {
    set?: $Enums.MissionRank | null
  }

  export type UserUpdateOneRequiredWithoutMission_progressNestedInput = {
    create?: XOR<UserCreateWithoutMission_progressInput, UserUncheckedCreateWithoutMission_progressInput>
    connectOrCreate?: UserCreateOrConnectWithoutMission_progressInput
    upsert?: UserUpsertWithoutMission_progressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMission_progressInput, UserUpdateWithoutMission_progressInput>, UserUncheckedUpdateWithoutMission_progressInput>
  }

  export type UserCreateNestedOneWithoutScore_entriesInput = {
    create?: XOR<UserCreateWithoutScore_entriesInput, UserUncheckedCreateWithoutScore_entriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutScore_entriesInput
    connect?: UserWhereUniqueInput
  }

  export type EnumMissionRankFieldUpdateOperationsInput = {
    set?: $Enums.MissionRank
  }

  export type UserUpdateOneRequiredWithoutScore_entriesNestedInput = {
    create?: XOR<UserCreateWithoutScore_entriesInput, UserUncheckedCreateWithoutScore_entriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutScore_entriesInput
    upsert?: UserUpsertWithoutScore_entriesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutScore_entriesInput, UserUpdateWithoutScore_entriesInput>, UserUncheckedUpdateWithoutScore_entriesInput>
  }

  export type UserCreateNestedOneWithoutUnlocked_charactersInput = {
    create?: XOR<UserCreateWithoutUnlocked_charactersInput, UserUncheckedCreateWithoutUnlocked_charactersInput>
    connectOrCreate?: UserCreateOrConnectWithoutUnlocked_charactersInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUnlocked_charactersNestedInput = {
    create?: XOR<UserCreateWithoutUnlocked_charactersInput, UserUncheckedCreateWithoutUnlocked_charactersInput>
    connectOrCreate?: UserCreateOrConnectWithoutUnlocked_charactersInput
    upsert?: UserUpsertWithoutUnlocked_charactersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUnlocked_charactersInput, UserUpdateWithoutUnlocked_charactersInput>, UserUncheckedUpdateWithoutUnlocked_charactersInput>
  }

  export type UserCreateNestedOneWithoutGame_runsInput = {
    create?: XOR<UserCreateWithoutGame_runsInput, UserUncheckedCreateWithoutGame_runsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGame_runsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumGameRunStatusFieldUpdateOperationsInput = {
    set?: $Enums.GameRunStatus
  }

  export type UserUpdateOneRequiredWithoutGame_runsNestedInput = {
    create?: XOR<UserCreateWithoutGame_runsInput, UserUncheckedCreateWithoutGame_runsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGame_runsInput
    upsert?: UserUpsertWithoutGame_runsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGame_runsInput, UserUpdateWithoutGame_runsInput>, UserUncheckedUpdateWithoutGame_runsInput>
  }

  export type UserCreateNestedOneWithoutRefresh_tokensInput = {
    create?: XOR<UserCreateWithoutRefresh_tokensInput, UserUncheckedCreateWithoutRefresh_tokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefresh_tokensInput
    connect?: UserWhereUniqueInput
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneRequiredWithoutRefresh_tokensNestedInput = {
    create?: XOR<UserCreateWithoutRefresh_tokensInput, UserUncheckedCreateWithoutRefresh_tokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutRefresh_tokensInput
    upsert?: UserUpsertWithoutRefresh_tokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutRefresh_tokensInput, UserUpdateWithoutRefresh_tokensInput>, UserUncheckedUpdateWithoutRefresh_tokensInput>
  }

  export type UserCreateNestedOneWithoutEmail_verification_tokensInput = {
    create?: XOR<UserCreateWithoutEmail_verification_tokensInput, UserUncheckedCreateWithoutEmail_verification_tokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutEmail_verification_tokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutEmail_verification_tokensNestedInput = {
    create?: XOR<UserCreateWithoutEmail_verification_tokensInput, UserUncheckedCreateWithoutEmail_verification_tokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutEmail_verification_tokensInput
    upsert?: UserUpsertWithoutEmail_verification_tokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEmail_verification_tokensInput, UserUpdateWithoutEmail_verification_tokensInput>, UserUncheckedUpdateWithoutEmail_verification_tokensInput>
  }

  export type UserCreateNestedOneWithoutPassword_reset_tokensInput = {
    create?: XOR<UserCreateWithoutPassword_reset_tokensInput, UserUncheckedCreateWithoutPassword_reset_tokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutPassword_reset_tokensInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPassword_reset_tokensNestedInput = {
    create?: XOR<UserCreateWithoutPassword_reset_tokensInput, UserUncheckedCreateWithoutPassword_reset_tokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutPassword_reset_tokensInput
    upsert?: UserUpsertWithoutPassword_reset_tokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPassword_reset_tokensInput, UserUpdateWithoutPassword_reset_tokensInput>, UserUncheckedUpdateWithoutPassword_reset_tokensInput>
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

  export type NestedEnumAuthRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthRole | EnumAuthRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthRoleFilter<$PrismaModel> | $Enums.AuthRole
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

  export type NestedEnumAuthRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthRole | EnumAuthRoleFieldRefInput<$PrismaModel>
    in?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.AuthRole[] | ListEnumAuthRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumAuthRoleWithAggregatesFilter<$PrismaModel> | $Enums.AuthRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAuthRoleFilter<$PrismaModel>
    _max?: NestedEnumAuthRoleFilter<$PrismaModel>
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

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyFilter<$PrismaModel> | $Enums.Difficulty
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Difficulty | EnumDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Difficulty[] | ListEnumDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.Difficulty
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDifficultyFilter<$PrismaModel>
    _max?: NestedEnumDifficultyFilter<$PrismaModel>
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

  export type NestedEnumMissionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MissionStatus | EnumMissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MissionStatus[] | ListEnumMissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MissionStatus[] | ListEnumMissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMissionStatusFilter<$PrismaModel> | $Enums.MissionStatus
  }

  export type NestedEnumMissionRankNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MissionRank | EnumMissionRankFieldRefInput<$PrismaModel> | null
    in?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMissionRankNullableFilter<$PrismaModel> | $Enums.MissionRank | null
  }

  export type NestedEnumMissionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MissionStatus | EnumMissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MissionStatus[] | ListEnumMissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MissionStatus[] | ListEnumMissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMissionStatusWithAggregatesFilter<$PrismaModel> | $Enums.MissionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMissionStatusFilter<$PrismaModel>
    _max?: NestedEnumMissionStatusFilter<$PrismaModel>
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

  export type NestedEnumMissionRankNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MissionRank | EnumMissionRankFieldRefInput<$PrismaModel> | null
    in?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel> | null
    not?: NestedEnumMissionRankNullableWithAggregatesFilter<$PrismaModel> | $Enums.MissionRank | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumMissionRankNullableFilter<$PrismaModel>
    _max?: NestedEnumMissionRankNullableFilter<$PrismaModel>
  }

  export type NestedEnumMissionRankFilter<$PrismaModel = never> = {
    equals?: $Enums.MissionRank | EnumMissionRankFieldRefInput<$PrismaModel>
    in?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel>
    notIn?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel>
    not?: NestedEnumMissionRankFilter<$PrismaModel> | $Enums.MissionRank
  }

  export type NestedEnumMissionRankWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MissionRank | EnumMissionRankFieldRefInput<$PrismaModel>
    in?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel>
    notIn?: $Enums.MissionRank[] | ListEnumMissionRankFieldRefInput<$PrismaModel>
    not?: NestedEnumMissionRankWithAggregatesFilter<$PrismaModel> | $Enums.MissionRank
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMissionRankFilter<$PrismaModel>
    _max?: NestedEnumMissionRankFilter<$PrismaModel>
  }

  export type NestedEnumGameRunStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GameRunStatus | EnumGameRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameRunStatus[] | ListEnumGameRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameRunStatus[] | ListEnumGameRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameRunStatusFilter<$PrismaModel> | $Enums.GameRunStatus
  }

  export type NestedEnumGameRunStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameRunStatus | EnumGameRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameRunStatus[] | ListEnumGameRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameRunStatus[] | ListEnumGameRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameRunStatusWithAggregatesFilter<$PrismaModel> | $Enums.GameRunStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameRunStatusFilter<$PrismaModel>
    _max?: NestedEnumGameRunStatusFilter<$PrismaModel>
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

  export type ProfileCreateWithoutUserInput = {
    level?: number
    xp?: number
    total_points?: number
    title?: string
    current_mission_id?: string
    highest_unlocked_mission_id?: string
    save_version?: number
    emperor_knight_unlocked_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProfileUncheckedCreateWithoutUserInput = {
    level?: number
    xp?: number
    total_points?: number
    title?: string
    current_mission_id?: string
    highest_unlocked_mission_id?: string
    save_version?: number
    emperor_knight_unlocked_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProfileCreateOrConnectWithoutUserInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutUserInput, ProfileUncheckedCreateWithoutUserInput>
  }

  export type SettingsCreateWithoutUserInput = {
    master_volume?: number
    music_volume?: number
    sfx_volume?: number
    reduced_motion?: boolean
    screen_shake?: boolean
    show_fps?: boolean
    difficulty?: $Enums.Difficulty
    key_bindings: JsonNullValueInput | InputJsonValue
    updated_at?: Date | string
  }

  export type SettingsUncheckedCreateWithoutUserInput = {
    master_volume?: number
    music_volume?: number
    sfx_volume?: number
    reduced_motion?: boolean
    screen_shake?: boolean
    show_fps?: boolean
    difficulty?: $Enums.Difficulty
    key_bindings: JsonNullValueInput | InputJsonValue
    updated_at?: Date | string
  }

  export type SettingsCreateOrConnectWithoutUserInput = {
    where: SettingsWhereUniqueInput
    create: XOR<SettingsCreateWithoutUserInput, SettingsUncheckedCreateWithoutUserInput>
  }

  export type MissionProgressCreateWithoutUserInput = {
    id?: string
    mission_id: string
    status?: $Enums.MissionStatus
    best_score?: number
    best_time_ms?: number | null
    best_rank?: $Enums.MissionRank | null
    completions?: number
    first_completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MissionProgressUncheckedCreateWithoutUserInput = {
    id?: string
    mission_id: string
    status?: $Enums.MissionStatus
    best_score?: number
    best_time_ms?: number | null
    best_rank?: $Enums.MissionRank | null
    completions?: number
    first_completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MissionProgressCreateOrConnectWithoutUserInput = {
    where: MissionProgressWhereUniqueInput
    create: XOR<MissionProgressCreateWithoutUserInput, MissionProgressUncheckedCreateWithoutUserInput>
  }

  export type MissionProgressCreateManyUserInputEnvelope = {
    data: MissionProgressCreateManyUserInput | MissionProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ScoreEntryCreateWithoutUserInput = {
    id?: string
    mission_id: string
    run_id: string
    score: number
    duration_ms: number
    rank: $Enums.MissionRank
    difficulty: $Enums.Difficulty
    created_at?: Date | string
  }

  export type ScoreEntryUncheckedCreateWithoutUserInput = {
    id?: string
    mission_id: string
    run_id: string
    score: number
    duration_ms: number
    rank: $Enums.MissionRank
    difficulty: $Enums.Difficulty
    created_at?: Date | string
  }

  export type ScoreEntryCreateOrConnectWithoutUserInput = {
    where: ScoreEntryWhereUniqueInput
    create: XOR<ScoreEntryCreateWithoutUserInput, ScoreEntryUncheckedCreateWithoutUserInput>
  }

  export type ScoreEntryCreateManyUserInputEnvelope = {
    data: ScoreEntryCreateManyUserInput | ScoreEntryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UnlockedCharacterCreateWithoutUserInput = {
    id?: string
    character_id: string
    source: string
    unlocked_at?: Date | string
  }

  export type UnlockedCharacterUncheckedCreateWithoutUserInput = {
    id?: string
    character_id: string
    source: string
    unlocked_at?: Date | string
  }

  export type UnlockedCharacterCreateOrConnectWithoutUserInput = {
    where: UnlockedCharacterWhereUniqueInput
    create: XOR<UnlockedCharacterCreateWithoutUserInput, UnlockedCharacterUncheckedCreateWithoutUserInput>
  }

  export type UnlockedCharacterCreateManyUserInputEnvelope = {
    data: UnlockedCharacterCreateManyUserInput | UnlockedCharacterCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type GameRunCreateWithoutUserInput = {
    id?: string
    mission_id: string
    status?: $Enums.GameRunStatus
    started_at?: Date | string
    completed_at?: Date | string | null
  }

  export type GameRunUncheckedCreateWithoutUserInput = {
    id?: string
    mission_id: string
    status?: $Enums.GameRunStatus
    started_at?: Date | string
    completed_at?: Date | string | null
  }

  export type GameRunCreateOrConnectWithoutUserInput = {
    where: GameRunWhereUniqueInput
    create: XOR<GameRunCreateWithoutUserInput, GameRunUncheckedCreateWithoutUserInput>
  }

  export type GameRunCreateManyUserInputEnvelope = {
    data: GameRunCreateManyUserInput | GameRunCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RefreshTokenCreateWithoutUserInput = {
    id?: string
    token_hash: string
    family_id: string
    expires_at: Date | string
    revoked_at?: Date | string | null
    replaced_by?: string | null
    created_at?: Date | string
  }

  export type RefreshTokenUncheckedCreateWithoutUserInput = {
    id?: string
    token_hash: string
    family_id: string
    expires_at: Date | string
    revoked_at?: Date | string | null
    replaced_by?: string | null
    created_at?: Date | string
  }

  export type RefreshTokenCreateOrConnectWithoutUserInput = {
    where: RefreshTokenWhereUniqueInput
    create: XOR<RefreshTokenCreateWithoutUserInput, RefreshTokenUncheckedCreateWithoutUserInput>
  }

  export type RefreshTokenCreateManyUserInputEnvelope = {
    data: RefreshTokenCreateManyUserInput | RefreshTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EmailVerificationTokenCreateWithoutUserInput = {
    id?: string
    token_hash: string
    expires_at: Date | string
    used_at?: Date | string | null
    created_at?: Date | string
  }

  export type EmailVerificationTokenUncheckedCreateWithoutUserInput = {
    id?: string
    token_hash: string
    expires_at: Date | string
    used_at?: Date | string | null
    created_at?: Date | string
  }

  export type EmailVerificationTokenCreateOrConnectWithoutUserInput = {
    where: EmailVerificationTokenWhereUniqueInput
    create: XOR<EmailVerificationTokenCreateWithoutUserInput, EmailVerificationTokenUncheckedCreateWithoutUserInput>
  }

  export type EmailVerificationTokenCreateManyUserInputEnvelope = {
    data: EmailVerificationTokenCreateManyUserInput | EmailVerificationTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PasswordResetTokenCreateWithoutUserInput = {
    id?: string
    token_hash: string
    expires_at: Date | string
    used_at?: Date | string | null
    created_at?: Date | string
  }

  export type PasswordResetTokenUncheckedCreateWithoutUserInput = {
    id?: string
    token_hash: string
    expires_at: Date | string
    used_at?: Date | string | null
    created_at?: Date | string
  }

  export type PasswordResetTokenCreateOrConnectWithoutUserInput = {
    where: PasswordResetTokenWhereUniqueInput
    create: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetTokenCreateManyUserInputEnvelope = {
    data: PasswordResetTokenCreateManyUserInput | PasswordResetTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ProfileUpsertWithoutUserInput = {
    update: XOR<ProfileUpdateWithoutUserInput, ProfileUncheckedUpdateWithoutUserInput>
    create: XOR<ProfileCreateWithoutUserInput, ProfileUncheckedCreateWithoutUserInput>
    where?: ProfileWhereInput
  }

  export type ProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: ProfileWhereInput
    data: XOR<ProfileUpdateWithoutUserInput, ProfileUncheckedUpdateWithoutUserInput>
  }

  export type ProfileUpdateWithoutUserInput = {
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    total_points?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    current_mission_id?: StringFieldUpdateOperationsInput | string
    highest_unlocked_mission_id?: StringFieldUpdateOperationsInput | string
    save_version?: IntFieldUpdateOperationsInput | number
    emperor_knight_unlocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUncheckedUpdateWithoutUserInput = {
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    total_points?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    current_mission_id?: StringFieldUpdateOperationsInput | string
    highest_unlocked_mission_id?: StringFieldUpdateOperationsInput | string
    save_version?: IntFieldUpdateOperationsInput | number
    emperor_knight_unlocked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingsUpsertWithoutUserInput = {
    update: XOR<SettingsUpdateWithoutUserInput, SettingsUncheckedUpdateWithoutUserInput>
    create: XOR<SettingsCreateWithoutUserInput, SettingsUncheckedCreateWithoutUserInput>
    where?: SettingsWhereInput
  }

  export type SettingsUpdateToOneWithWhereWithoutUserInput = {
    where?: SettingsWhereInput
    data: XOR<SettingsUpdateWithoutUserInput, SettingsUncheckedUpdateWithoutUserInput>
  }

  export type SettingsUpdateWithoutUserInput = {
    master_volume?: FloatFieldUpdateOperationsInput | number
    music_volume?: FloatFieldUpdateOperationsInput | number
    sfx_volume?: FloatFieldUpdateOperationsInput | number
    reduced_motion?: BoolFieldUpdateOperationsInput | boolean
    screen_shake?: BoolFieldUpdateOperationsInput | boolean
    show_fps?: BoolFieldUpdateOperationsInput | boolean
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    key_bindings?: JsonNullValueInput | InputJsonValue
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingsUncheckedUpdateWithoutUserInput = {
    master_volume?: FloatFieldUpdateOperationsInput | number
    music_volume?: FloatFieldUpdateOperationsInput | number
    sfx_volume?: FloatFieldUpdateOperationsInput | number
    reduced_motion?: BoolFieldUpdateOperationsInput | boolean
    screen_shake?: BoolFieldUpdateOperationsInput | boolean
    show_fps?: BoolFieldUpdateOperationsInput | boolean
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    key_bindings?: JsonNullValueInput | InputJsonValue
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: MissionProgressWhereUniqueInput
    update: XOR<MissionProgressUpdateWithoutUserInput, MissionProgressUncheckedUpdateWithoutUserInput>
    create: XOR<MissionProgressCreateWithoutUserInput, MissionProgressUncheckedCreateWithoutUserInput>
  }

  export type MissionProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: MissionProgressWhereUniqueInput
    data: XOR<MissionProgressUpdateWithoutUserInput, MissionProgressUncheckedUpdateWithoutUserInput>
  }

  export type MissionProgressUpdateManyWithWhereWithoutUserInput = {
    where: MissionProgressScalarWhereInput
    data: XOR<MissionProgressUpdateManyMutationInput, MissionProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type MissionProgressScalarWhereInput = {
    AND?: MissionProgressScalarWhereInput | MissionProgressScalarWhereInput[]
    OR?: MissionProgressScalarWhereInput[]
    NOT?: MissionProgressScalarWhereInput | MissionProgressScalarWhereInput[]
    id?: StringFilter<"MissionProgress"> | string
    user_id?: StringFilter<"MissionProgress"> | string
    mission_id?: StringFilter<"MissionProgress"> | string
    status?: EnumMissionStatusFilter<"MissionProgress"> | $Enums.MissionStatus
    best_score?: IntFilter<"MissionProgress"> | number
    best_time_ms?: IntNullableFilter<"MissionProgress"> | number | null
    best_rank?: EnumMissionRankNullableFilter<"MissionProgress"> | $Enums.MissionRank | null
    completions?: IntFilter<"MissionProgress"> | number
    first_completed_at?: DateTimeNullableFilter<"MissionProgress"> | Date | string | null
    created_at?: DateTimeFilter<"MissionProgress"> | Date | string
    updated_at?: DateTimeFilter<"MissionProgress"> | Date | string
  }

  export type ScoreEntryUpsertWithWhereUniqueWithoutUserInput = {
    where: ScoreEntryWhereUniqueInput
    update: XOR<ScoreEntryUpdateWithoutUserInput, ScoreEntryUncheckedUpdateWithoutUserInput>
    create: XOR<ScoreEntryCreateWithoutUserInput, ScoreEntryUncheckedCreateWithoutUserInput>
  }

  export type ScoreEntryUpdateWithWhereUniqueWithoutUserInput = {
    where: ScoreEntryWhereUniqueInput
    data: XOR<ScoreEntryUpdateWithoutUserInput, ScoreEntryUncheckedUpdateWithoutUserInput>
  }

  export type ScoreEntryUpdateManyWithWhereWithoutUserInput = {
    where: ScoreEntryScalarWhereInput
    data: XOR<ScoreEntryUpdateManyMutationInput, ScoreEntryUncheckedUpdateManyWithoutUserInput>
  }

  export type ScoreEntryScalarWhereInput = {
    AND?: ScoreEntryScalarWhereInput | ScoreEntryScalarWhereInput[]
    OR?: ScoreEntryScalarWhereInput[]
    NOT?: ScoreEntryScalarWhereInput | ScoreEntryScalarWhereInput[]
    id?: StringFilter<"ScoreEntry"> | string
    user_id?: StringFilter<"ScoreEntry"> | string
    mission_id?: StringFilter<"ScoreEntry"> | string
    run_id?: StringFilter<"ScoreEntry"> | string
    score?: IntFilter<"ScoreEntry"> | number
    duration_ms?: IntFilter<"ScoreEntry"> | number
    rank?: EnumMissionRankFilter<"ScoreEntry"> | $Enums.MissionRank
    difficulty?: EnumDifficultyFilter<"ScoreEntry"> | $Enums.Difficulty
    created_at?: DateTimeFilter<"ScoreEntry"> | Date | string
  }

  export type UnlockedCharacterUpsertWithWhereUniqueWithoutUserInput = {
    where: UnlockedCharacterWhereUniqueInput
    update: XOR<UnlockedCharacterUpdateWithoutUserInput, UnlockedCharacterUncheckedUpdateWithoutUserInput>
    create: XOR<UnlockedCharacterCreateWithoutUserInput, UnlockedCharacterUncheckedCreateWithoutUserInput>
  }

  export type UnlockedCharacterUpdateWithWhereUniqueWithoutUserInput = {
    where: UnlockedCharacterWhereUniqueInput
    data: XOR<UnlockedCharacterUpdateWithoutUserInput, UnlockedCharacterUncheckedUpdateWithoutUserInput>
  }

  export type UnlockedCharacterUpdateManyWithWhereWithoutUserInput = {
    where: UnlockedCharacterScalarWhereInput
    data: XOR<UnlockedCharacterUpdateManyMutationInput, UnlockedCharacterUncheckedUpdateManyWithoutUserInput>
  }

  export type UnlockedCharacterScalarWhereInput = {
    AND?: UnlockedCharacterScalarWhereInput | UnlockedCharacterScalarWhereInput[]
    OR?: UnlockedCharacterScalarWhereInput[]
    NOT?: UnlockedCharacterScalarWhereInput | UnlockedCharacterScalarWhereInput[]
    id?: StringFilter<"UnlockedCharacter"> | string
    user_id?: StringFilter<"UnlockedCharacter"> | string
    character_id?: StringFilter<"UnlockedCharacter"> | string
    source?: StringFilter<"UnlockedCharacter"> | string
    unlocked_at?: DateTimeFilter<"UnlockedCharacter"> | Date | string
  }

  export type GameRunUpsertWithWhereUniqueWithoutUserInput = {
    where: GameRunWhereUniqueInput
    update: XOR<GameRunUpdateWithoutUserInput, GameRunUncheckedUpdateWithoutUserInput>
    create: XOR<GameRunCreateWithoutUserInput, GameRunUncheckedCreateWithoutUserInput>
  }

  export type GameRunUpdateWithWhereUniqueWithoutUserInput = {
    where: GameRunWhereUniqueInput
    data: XOR<GameRunUpdateWithoutUserInput, GameRunUncheckedUpdateWithoutUserInput>
  }

  export type GameRunUpdateManyWithWhereWithoutUserInput = {
    where: GameRunScalarWhereInput
    data: XOR<GameRunUpdateManyMutationInput, GameRunUncheckedUpdateManyWithoutUserInput>
  }

  export type GameRunScalarWhereInput = {
    AND?: GameRunScalarWhereInput | GameRunScalarWhereInput[]
    OR?: GameRunScalarWhereInput[]
    NOT?: GameRunScalarWhereInput | GameRunScalarWhereInput[]
    id?: StringFilter<"GameRun"> | string
    user_id?: StringFilter<"GameRun"> | string
    mission_id?: StringFilter<"GameRun"> | string
    status?: EnumGameRunStatusFilter<"GameRun"> | $Enums.GameRunStatus
    started_at?: DateTimeFilter<"GameRun"> | Date | string
    completed_at?: DateTimeNullableFilter<"GameRun"> | Date | string | null
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
    id?: StringFilter<"RefreshToken"> | string
    user_id?: StringFilter<"RefreshToken"> | string
    token_hash?: StringFilter<"RefreshToken"> | string
    family_id?: StringFilter<"RefreshToken"> | string
    expires_at?: DateTimeFilter<"RefreshToken"> | Date | string
    revoked_at?: DateTimeNullableFilter<"RefreshToken"> | Date | string | null
    replaced_by?: StringNullableFilter<"RefreshToken"> | string | null
    created_at?: DateTimeFilter<"RefreshToken"> | Date | string
  }

  export type EmailVerificationTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: EmailVerificationTokenWhereUniqueInput
    update: XOR<EmailVerificationTokenUpdateWithoutUserInput, EmailVerificationTokenUncheckedUpdateWithoutUserInput>
    create: XOR<EmailVerificationTokenCreateWithoutUserInput, EmailVerificationTokenUncheckedCreateWithoutUserInput>
  }

  export type EmailVerificationTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: EmailVerificationTokenWhereUniqueInput
    data: XOR<EmailVerificationTokenUpdateWithoutUserInput, EmailVerificationTokenUncheckedUpdateWithoutUserInput>
  }

  export type EmailVerificationTokenUpdateManyWithWhereWithoutUserInput = {
    where: EmailVerificationTokenScalarWhereInput
    data: XOR<EmailVerificationTokenUpdateManyMutationInput, EmailVerificationTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type EmailVerificationTokenScalarWhereInput = {
    AND?: EmailVerificationTokenScalarWhereInput | EmailVerificationTokenScalarWhereInput[]
    OR?: EmailVerificationTokenScalarWhereInput[]
    NOT?: EmailVerificationTokenScalarWhereInput | EmailVerificationTokenScalarWhereInput[]
    id?: StringFilter<"EmailVerificationToken"> | string
    user_id?: StringFilter<"EmailVerificationToken"> | string
    token_hash?: StringFilter<"EmailVerificationToken"> | string
    expires_at?: DateTimeFilter<"EmailVerificationToken"> | Date | string
    used_at?: DateTimeNullableFilter<"EmailVerificationToken"> | Date | string | null
    created_at?: DateTimeFilter<"EmailVerificationToken"> | Date | string
  }

  export type PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: PasswordResetTokenWhereUniqueInput
    update: XOR<PasswordResetTokenUpdateWithoutUserInput, PasswordResetTokenUncheckedUpdateWithoutUserInput>
    create: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: PasswordResetTokenWhereUniqueInput
    data: XOR<PasswordResetTokenUpdateWithoutUserInput, PasswordResetTokenUncheckedUpdateWithoutUserInput>
  }

  export type PasswordResetTokenUpdateManyWithWhereWithoutUserInput = {
    where: PasswordResetTokenScalarWhereInput
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type PasswordResetTokenScalarWhereInput = {
    AND?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
    OR?: PasswordResetTokenScalarWhereInput[]
    NOT?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
    id?: StringFilter<"PasswordResetToken"> | string
    user_id?: StringFilter<"PasswordResetToken"> | string
    token_hash?: StringFilter<"PasswordResetToken"> | string
    expires_at?: DateTimeFilter<"PasswordResetToken"> | Date | string
    used_at?: DateTimeNullableFilter<"PasswordResetToken"> | Date | string | null
    created_at?: DateTimeFilter<"PasswordResetToken"> | Date | string
  }

  export type UserCreateWithoutProfileInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    settings?: SettingsCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterCreateNestedManyWithoutUserInput
    game_runs?: GameRunCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutProfileInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressUncheckedCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryUncheckedCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterUncheckedCreateNestedManyWithoutUserInput
    game_runs?: GameRunUncheckedCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutProfileInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
  }

  export type UserUpsertWithoutProfileInput = {
    update: XOR<UserUpdateWithoutProfileInput, UserUncheckedUpdateWithoutProfileInput>
    create: XOR<UserCreateWithoutProfileInput, UserUncheckedCreateWithoutProfileInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProfileInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProfileInput, UserUncheckedUpdateWithoutProfileInput>
  }

  export type UserUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: SettingsUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUncheckedUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUncheckedUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUncheckedUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUncheckedUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSettingsInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterCreateNestedManyWithoutUserInput
    game_runs?: GameRunCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSettingsInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressUncheckedCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryUncheckedCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterUncheckedCreateNestedManyWithoutUserInput
    game_runs?: GameRunUncheckedCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSettingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
  }

  export type UserUpsertWithoutSettingsInput = {
    update: XOR<UserUpdateWithoutSettingsInput, UserUncheckedUpdateWithoutSettingsInput>
    create: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSettingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSettingsInput, UserUncheckedUpdateWithoutSettingsInput>
  }

  export type UserUpdateWithoutSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUncheckedUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUncheckedUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUncheckedUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUncheckedUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutMission_progressInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    score_entries?: ScoreEntryCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterCreateNestedManyWithoutUserInput
    game_runs?: GameRunCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMission_progressInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    score_entries?: ScoreEntryUncheckedCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterUncheckedCreateNestedManyWithoutUserInput
    game_runs?: GameRunUncheckedCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMission_progressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMission_progressInput, UserUncheckedCreateWithoutMission_progressInput>
  }

  export type UserUpsertWithoutMission_progressInput = {
    update: XOR<UserUpdateWithoutMission_progressInput, UserUncheckedUpdateWithoutMission_progressInput>
    create: XOR<UserCreateWithoutMission_progressInput, UserUncheckedCreateWithoutMission_progressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMission_progressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMission_progressInput, UserUncheckedUpdateWithoutMission_progressInput>
  }

  export type UserUpdateWithoutMission_progressInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    score_entries?: ScoreEntryUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMission_progressInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    score_entries?: ScoreEntryUncheckedUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUncheckedUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUncheckedUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutScore_entriesInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterCreateNestedManyWithoutUserInput
    game_runs?: GameRunCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutScore_entriesInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressUncheckedCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterUncheckedCreateNestedManyWithoutUserInput
    game_runs?: GameRunUncheckedCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutScore_entriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutScore_entriesInput, UserUncheckedCreateWithoutScore_entriesInput>
  }

  export type UserUpsertWithoutScore_entriesInput = {
    update: XOR<UserUpdateWithoutScore_entriesInput, UserUncheckedUpdateWithoutScore_entriesInput>
    create: XOR<UserCreateWithoutScore_entriesInput, UserUncheckedCreateWithoutScore_entriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutScore_entriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutScore_entriesInput, UserUncheckedUpdateWithoutScore_entriesInput>
  }

  export type UserUpdateWithoutScore_entriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutScore_entriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUncheckedUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUncheckedUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUncheckedUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutUnlocked_charactersInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryCreateNestedManyWithoutUserInput
    game_runs?: GameRunCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUnlocked_charactersInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressUncheckedCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryUncheckedCreateNestedManyWithoutUserInput
    game_runs?: GameRunUncheckedCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUnlocked_charactersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUnlocked_charactersInput, UserUncheckedCreateWithoutUnlocked_charactersInput>
  }

  export type UserUpsertWithoutUnlocked_charactersInput = {
    update: XOR<UserUpdateWithoutUnlocked_charactersInput, UserUncheckedUpdateWithoutUnlocked_charactersInput>
    create: XOR<UserCreateWithoutUnlocked_charactersInput, UserUncheckedCreateWithoutUnlocked_charactersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUnlocked_charactersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUnlocked_charactersInput, UserUncheckedUpdateWithoutUnlocked_charactersInput>
  }

  export type UserUpdateWithoutUnlocked_charactersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUnlocked_charactersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUncheckedUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUncheckedUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUncheckedUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutGame_runsInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutGame_runsInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressUncheckedCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryUncheckedCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterUncheckedCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutGame_runsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGame_runsInput, UserUncheckedCreateWithoutGame_runsInput>
  }

  export type UserUpsertWithoutGame_runsInput = {
    update: XOR<UserUpdateWithoutGame_runsInput, UserUncheckedUpdateWithoutGame_runsInput>
    create: XOR<UserCreateWithoutGame_runsInput, UserUncheckedCreateWithoutGame_runsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGame_runsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGame_runsInput, UserUncheckedUpdateWithoutGame_runsInput>
  }

  export type UserUpdateWithoutGame_runsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutGame_runsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUncheckedUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUncheckedUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUncheckedUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutRefresh_tokensInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterCreateNestedManyWithoutUserInput
    game_runs?: GameRunCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRefresh_tokensInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressUncheckedCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryUncheckedCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterUncheckedCreateNestedManyWithoutUserInput
    game_runs?: GameRunUncheckedCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRefresh_tokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRefresh_tokensInput, UserUncheckedCreateWithoutRefresh_tokensInput>
  }

  export type UserUpsertWithoutRefresh_tokensInput = {
    update: XOR<UserUpdateWithoutRefresh_tokensInput, UserUncheckedUpdateWithoutRefresh_tokensInput>
    create: XOR<UserCreateWithoutRefresh_tokensInput, UserUncheckedCreateWithoutRefresh_tokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutRefresh_tokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutRefresh_tokensInput, UserUncheckedUpdateWithoutRefresh_tokensInput>
  }

  export type UserUpdateWithoutRefresh_tokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRefresh_tokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUncheckedUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUncheckedUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUncheckedUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUncheckedUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutEmail_verification_tokensInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterCreateNestedManyWithoutUserInput
    game_runs?: GameRunCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEmail_verification_tokensInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressUncheckedCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryUncheckedCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterUncheckedCreateNestedManyWithoutUserInput
    game_runs?: GameRunUncheckedCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    password_reset_tokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEmail_verification_tokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEmail_verification_tokensInput, UserUncheckedCreateWithoutEmail_verification_tokensInput>
  }

  export type UserUpsertWithoutEmail_verification_tokensInput = {
    update: XOR<UserUpdateWithoutEmail_verification_tokensInput, UserUncheckedUpdateWithoutEmail_verification_tokensInput>
    create: XOR<UserCreateWithoutEmail_verification_tokensInput, UserUncheckedCreateWithoutEmail_verification_tokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEmail_verification_tokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEmail_verification_tokensInput, UserUncheckedUpdateWithoutEmail_verification_tokensInput>
  }

  export type UserUpdateWithoutEmail_verification_tokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEmail_verification_tokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUncheckedUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUncheckedUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUncheckedUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUncheckedUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    password_reset_tokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPassword_reset_tokensInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileCreateNestedOneWithoutUserInput
    settings?: SettingsCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterCreateNestedManyWithoutUserInput
    game_runs?: GameRunCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPassword_reset_tokensInput = {
    id?: string
    email: string
    username: string
    username_normalized: string
    password: string
    role?: $Enums.AuthRole
    email_verified_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput
    settings?: SettingsUncheckedCreateNestedOneWithoutUserInput
    mission_progress?: MissionProgressUncheckedCreateNestedManyWithoutUserInput
    score_entries?: ScoreEntryUncheckedCreateNestedManyWithoutUserInput
    unlocked_characters?: UnlockedCharacterUncheckedCreateNestedManyWithoutUserInput
    game_runs?: GameRunUncheckedCreateNestedManyWithoutUserInput
    refresh_tokens?: RefreshTokenUncheckedCreateNestedManyWithoutUserInput
    email_verification_tokens?: EmailVerificationTokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPassword_reset_tokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPassword_reset_tokensInput, UserUncheckedCreateWithoutPassword_reset_tokensInput>
  }

  export type UserUpsertWithoutPassword_reset_tokensInput = {
    update: XOR<UserUpdateWithoutPassword_reset_tokensInput, UserUncheckedUpdateWithoutPassword_reset_tokensInput>
    create: XOR<UserCreateWithoutPassword_reset_tokensInput, UserUncheckedCreateWithoutPassword_reset_tokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPassword_reset_tokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPassword_reset_tokensInput, UserUncheckedUpdateWithoutPassword_reset_tokensInput>
  }

  export type UserUpdateWithoutPassword_reset_tokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneWithoutUserNestedInput
    settings?: SettingsUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPassword_reset_tokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    username_normalized?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumAuthRoleFieldUpdateOperationsInput | $Enums.AuthRole
    email_verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput
    settings?: SettingsUncheckedUpdateOneWithoutUserNestedInput
    mission_progress?: MissionProgressUncheckedUpdateManyWithoutUserNestedInput
    score_entries?: ScoreEntryUncheckedUpdateManyWithoutUserNestedInput
    unlocked_characters?: UnlockedCharacterUncheckedUpdateManyWithoutUserNestedInput
    game_runs?: GameRunUncheckedUpdateManyWithoutUserNestedInput
    refresh_tokens?: RefreshTokenUncheckedUpdateManyWithoutUserNestedInput
    email_verification_tokens?: EmailVerificationTokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MissionProgressCreateManyUserInput = {
    id?: string
    mission_id: string
    status?: $Enums.MissionStatus
    best_score?: number
    best_time_ms?: number | null
    best_rank?: $Enums.MissionRank | null
    completions?: number
    first_completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ScoreEntryCreateManyUserInput = {
    id?: string
    mission_id: string
    run_id: string
    score: number
    duration_ms: number
    rank: $Enums.MissionRank
    difficulty: $Enums.Difficulty
    created_at?: Date | string
  }

  export type UnlockedCharacterCreateManyUserInput = {
    id?: string
    character_id: string
    source: string
    unlocked_at?: Date | string
  }

  export type GameRunCreateManyUserInput = {
    id?: string
    mission_id: string
    status?: $Enums.GameRunStatus
    started_at?: Date | string
    completed_at?: Date | string | null
  }

  export type RefreshTokenCreateManyUserInput = {
    id?: string
    token_hash: string
    family_id: string
    expires_at: Date | string
    revoked_at?: Date | string | null
    replaced_by?: string | null
    created_at?: Date | string
  }

  export type EmailVerificationTokenCreateManyUserInput = {
    id?: string
    token_hash: string
    expires_at: Date | string
    used_at?: Date | string | null
    created_at?: Date | string
  }

  export type PasswordResetTokenCreateManyUserInput = {
    id?: string
    token_hash: string
    expires_at: Date | string
    used_at?: Date | string | null
    created_at?: Date | string
  }

  export type MissionProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumMissionStatusFieldUpdateOperationsInput | $Enums.MissionStatus
    best_score?: IntFieldUpdateOperationsInput | number
    best_time_ms?: NullableIntFieldUpdateOperationsInput | number | null
    best_rank?: NullableEnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank | null
    completions?: IntFieldUpdateOperationsInput | number
    first_completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumMissionStatusFieldUpdateOperationsInput | $Enums.MissionStatus
    best_score?: IntFieldUpdateOperationsInput | number
    best_time_ms?: NullableIntFieldUpdateOperationsInput | number | null
    best_rank?: NullableEnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank | null
    completions?: IntFieldUpdateOperationsInput | number
    first_completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MissionProgressUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumMissionStatusFieldUpdateOperationsInput | $Enums.MissionStatus
    best_score?: IntFieldUpdateOperationsInput | number
    best_time_ms?: NullableIntFieldUpdateOperationsInput | number | null
    best_rank?: NullableEnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank | null
    completions?: IntFieldUpdateOperationsInput | number
    first_completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScoreEntryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    run_id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    duration_ms?: IntFieldUpdateOperationsInput | number
    rank?: EnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScoreEntryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    run_id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    duration_ms?: IntFieldUpdateOperationsInput | number
    rank?: EnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScoreEntryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    run_id?: StringFieldUpdateOperationsInput | string
    score?: IntFieldUpdateOperationsInput | number
    duration_ms?: IntFieldUpdateOperationsInput | number
    rank?: EnumMissionRankFieldUpdateOperationsInput | $Enums.MissionRank
    difficulty?: EnumDifficultyFieldUpdateOperationsInput | $Enums.Difficulty
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnlockedCharacterUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    character_id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    unlocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnlockedCharacterUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    character_id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    unlocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnlockedCharacterUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    character_id?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    unlocked_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameRunUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameRunStatusFieldUpdateOperationsInput | $Enums.GameRunStatus
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameRunUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameRunStatusFieldUpdateOperationsInput | $Enums.GameRunStatus
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameRunUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    mission_id?: StringFieldUpdateOperationsInput | string
    status?: EnumGameRunStatusFieldUpdateOperationsInput | $Enums.GameRunStatus
    started_at?: DateTimeFieldUpdateOperationsInput | Date | string
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RefreshTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    family_id?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replaced_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    family_id?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replaced_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    family_id?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    replaced_by?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailVerificationTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailVerificationTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EmailVerificationTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token_hash?: StringFieldUpdateOperationsInput | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    used_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
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