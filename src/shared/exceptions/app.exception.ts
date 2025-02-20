import { HttpException, HttpStatus } from '@nestjs/common';

export const getAppException = (
  code: EAppExceptionCode,
  details?: string | Record<string, unknown>,
): AppException => {
  const exception =
    AppExceptions[code] ||
    AppExceptions[EAppExceptionCode.INTERNAL_SERVER_ERROR];

  if (details) {
    return exception.wrapError(details);
  }

  return exception;
};

export class AppException extends HttpException {
  public localizedMessage: Record<string, string>;
  public details: string | Record<string, unknown>;
  public code: EAppExceptionCode;

  constructor(
    code: EAppExceptionCode,
    message: string,
    status: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: string | Record<string, any>,
    localizedMessage?: Record<string, string>,
  ) {
    // Calling parent constructor of base Exception class.
    super(message, status);

    this.name = AppException.name;
    this.localizedMessage = localizedMessage;
    this.details = details;
    this.code = code;
  }

  wrapError(error: string | Record<string, unknown>): AppException {
    let details = this.details || {};
    if (typeof details === 'string') {
      details = {
        message: details,
      };
    }
    return new AppException(this.code, this.message, this.getStatus(), {
      wrappedError: error,
      details,
    });
  }
}

export enum EAppExceptionCode {
  BAD_REQUEST = '0400',
  INTERNAL_SERVER_ERROR = '0500',
  CONCURRENT_OPERATION = '0409',
  INVALID_PARAMS = '0422',
  SERVICE_UNAVAILABLE = '0503',
  UNAUTHORIZED = '0401',
  INVALID_DATE = '04001',


  USER_NOT_FOUND = '1001',
  USER_ALREADY_ACTIVE = '1008',
  USER_IS_INACTIVE = '1010',
  INVALID_SIGNATURE = '1011',
  USERNAME_ALREADY_TAKEN = '1012',
  EMAIL_ALREADY_TAKEN = '1013',
  REFERRAL_CODE_NOT_FOUND = '1014',
  DISCORD_ALREADY_CONNECTED = '1015',
  X_ALREADY_CONNECTED = '1016',

  OPERATOR_NOT_ACTIVE = '2000',
  OPERATOR_NOT_FOUND = '2001',
  OPERATOR_ALREADY_ACTIVE = '2002',
  OPERATOR_OTP_INCORRECT = '2003',
  OPERATOR_PASSWORD_INCORRECT = '2004',
  OPERATOR_NOT_AUTHORIZED = '2005',
  INVALID_PASSWORD_LENGTH = '2006',
  INVALID_PASSWORD_FORMAT = '2007',
  CONTAIN_ACCEPTED_CHAR = '2008',
  TOTP_INVAILID = '2009',

  INSUFFICIENT_BALANCE = '3001',
  INSUFFICIENT_REWARD = '3002',
  INSUFFICIENT_ROUND_NOT_CLAIMED = '3003',

  COIN_ALREADY_EXISTS = '4001',
  COIN_NOT_FOUND = '4002',
  COIN_NOT_SUPPORTED = '4003',
  INVALID_ADDRESS = '4004',
  MAXIMUM_TOKEN = '4005',
  MAXIMUM_WHITELIST_TOKEN = '4006',
  PUBLISHED_TOKEN = '4007',
  IS_NATIVE_SOLANA = '4008',

  MEME_SOL_WHEEL_MIN_MAX_BET_NOT_CHANGE = '5001',
  MEME_SOL_WHEEL_GAME_DURATION_NOT_CHANGE = '5002',
  MEME_SOL_WHEEL_MIN_BET_LOWER_THAN_MAX_BET = '5003',
  MEME_SOL_WHEEL_BET_VALUE_GREATER_THAN_0 = '5004',
  MEME_SOL_WHEEL_ROUND_DURATION_GREATER_THAN_0 = '5005',
  MEME_SOL_WHEEL_PARTICIPANT_GREATER_THAN_2 = '5007',
  MEME_SOL_WHEEL_MIN_MAX_PLAYER_NOT_CHANGE = '5008',

  MEME_SOL_WHEEL_GAME_ROUND_NOT_FOUND = '6002',
  MEME_SOL_WHEEL_GAME_STATE_NOT_FOUND = '6003',

  MEME_SOL_WHEEL_PLAYER_NOT_FOUND = '7001',
  MEME_SOL_WHEEL_PLAYER_ALREADY_EXISTS = '7002',
  MEME_SOL_WHEEL_NO_WINNER_FOUND = '7003',

  MEME_SOL_WHEEL_FEE_TREASURY_RANGE = '8001',
  MEME_SOL_WHEEL_FEE_VALUE_UNCHANGED = '8002',

  DASHBOARD_NOT_FOUND = '9001',
  DASHBOARD_CHART_NOT_FOUND = '9002',

  QUEST_NOT_FOUND = '10001',
  END_DATE_AFTER_START_DATE = '10002',
  USER_QUEST_CHECK_IN_ALREADY_COMPLETED = '10004',
  NOT_SOCIAL_QUEST = '10005',
  USER_QUEST_ALREADY_COMPLETED = '10006',
  QUEST_NAME_ALREADY_EXISTS = '10007',
  QUEST_NAME_INVALID_FORMAT = '10008',
  QUEST_NOT_STARTED = '10009',
  QUEST_ALREADY_ENDED = '10010',
  QUEST_NOT_ACTIVE = '10011',

  LEADERBOARD_PAGE_EXCEEDS_MAX_VALUE = '11001',

  RACING_BALL_GAME_NOT_FOUND = '12001',
  RACING_BALL_GAME_ROUND_NOT_FOUND = '12002',
  RACING_BALL_GAME_STATE_NOT_FOUND = '12003',
  RACING_BALL_GAME_ROUND_NOT_EQUAL_CURRENT_ROUND = '12004',
  RACING_BALL_GAME_NOT_IN_DRAWING_STATUS = '12005',

  RACING_BALL_PLAYER_NOT_FOUND = '13001',
  RACING_BALL_PLAYER_ALREADY_EXISTS = '13002',
  RACING_BALL_NO_WINNER_FOUND = '13003',
  RACING_BALL_BUYING_VALUE_GREATER_THAN_0 = '13004',
  RACING_BALL_MIN_BUYING_LOWER_THAN_MAX_BUYING = '13005',
  RACING_BALL_PARTICIPANT_GREATER_THAN_2 = '13006',

  RACING_BALL_FEE_TREASURY_RANGE = '16001',
  RACING_BALL_FEE_VALUE_UNCHANGED = '16002',
}

export const AppExceptions: Record<EAppExceptionCode, AppException> = {
  [EAppExceptionCode.BAD_REQUEST]: new AppException(
    EAppExceptionCode.BAD_REQUEST,
    'Bad request',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.INTERNAL_SERVER_ERROR]: new AppException(
    EAppExceptionCode.INTERNAL_SERVER_ERROR,
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  ),
  [EAppExceptionCode.CONCURRENT_OPERATION]: new AppException(
    EAppExceptionCode.CONCURRENT_OPERATION,
    'Concurrent operation',
    HttpStatus.CONFLICT,
  ),
  [EAppExceptionCode.INVALID_PARAMS]: new AppException(
    EAppExceptionCode.INVALID_PARAMS,
    'Invalid params',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.SERVICE_UNAVAILABLE]: new AppException(
    EAppExceptionCode.SERVICE_UNAVAILABLE,
    'Service unavailable',
    HttpStatus.SERVICE_UNAVAILABLE,
  ),

  [EAppExceptionCode.UNAUTHORIZED]: new AppException(
    EAppExceptionCode.UNAUTHORIZED,
    'Unauthorized access',
    HttpStatus.UNAUTHORIZED,
  ),

  [EAppExceptionCode.INVALID_DATE]: new AppException(
    EAppExceptionCode.INVALID_DATE,
    'Invalid date format',
    HttpStatus.BAD_REQUEST,
  ),


  [EAppExceptionCode.USER_NOT_FOUND]: new AppException(
    EAppExceptionCode.USER_NOT_FOUND,
    'User not found',
    HttpStatus.NOT_FOUND,
  ),

  [EAppExceptionCode.USER_ALREADY_ACTIVE]: new AppException(
    EAppExceptionCode.USER_ALREADY_ACTIVE,
    'User is already active',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.USER_IS_INACTIVE]: new AppException(
    EAppExceptionCode.USER_IS_INACTIVE,
    'User is inactive',
    HttpStatus.FORBIDDEN,
  ),

  [EAppExceptionCode.INVALID_SIGNATURE]: new AppException(
    EAppExceptionCode.INVALID_SIGNATURE,
    'Invalid signature',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.USERNAME_ALREADY_TAKEN]: new AppException(
    EAppExceptionCode.USERNAME_ALREADY_TAKEN,
    'Username already taken',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.EMAIL_ALREADY_TAKEN]: new AppException(
    EAppExceptionCode.EMAIL_ALREADY_TAKEN,
    'Email already taken',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.REFERRAL_CODE_NOT_FOUND]: new AppException(
    EAppExceptionCode.REFERRAL_CODE_NOT_FOUND,
    'Referral code not found',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.DISCORD_ALREADY_CONNECTED]: new AppException(
    EAppExceptionCode.DISCORD_ALREADY_CONNECTED,
    'Discord already connected',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.X_ALREADY_CONNECTED]: new AppException(
    EAppExceptionCode.X_ALREADY_CONNECTED,
    'X already connected',
    HttpStatus.BAD_REQUEST,
  ),

  // New operator-related exceptions
  [EAppExceptionCode.OPERATOR_NOT_ACTIVE]: new AppException(
    EAppExceptionCode.OPERATOR_NOT_ACTIVE,
    'Operator is not active',
    HttpStatus.FORBIDDEN,
  ),
  [EAppExceptionCode.OPERATOR_NOT_FOUND]: new AppException(
    EAppExceptionCode.OPERATOR_NOT_FOUND,
    'Operator not found',
    HttpStatus.NOT_FOUND,
  ),
  [EAppExceptionCode.OPERATOR_ALREADY_ACTIVE]: new AppException(
    EAppExceptionCode.OPERATOR_ALREADY_ACTIVE,
    'Operator is already active',
    HttpStatus.BAD_REQUEST,
  ),
  [EAppExceptionCode.OPERATOR_OTP_INCORRECT]: new AppException(
    EAppExceptionCode.OPERATOR_OTP_INCORRECT,
    'Incorrect OTP for operator',
    HttpStatus.BAD_REQUEST,
  ),
  [EAppExceptionCode.OPERATOR_PASSWORD_INCORRECT]: new AppException(
    EAppExceptionCode.OPERATOR_PASSWORD_INCORRECT,
    'Incorrect password for operator',
    HttpStatus.BAD_REQUEST,
  ),
  [EAppExceptionCode.OPERATOR_NOT_AUTHORIZED]: new AppException(
    EAppExceptionCode.OPERATOR_NOT_AUTHORIZED,
    'Operator is not authorized',
    HttpStatus.FORBIDDEN,
  ),

  [EAppExceptionCode.INVALID_PASSWORD_LENGTH]: new AppException(
    EAppExceptionCode.INVALID_PASSWORD_LENGTH,
    'Between 8 and 128 characters',
    HttpStatus.FORBIDDEN,
  ),

  [EAppExceptionCode.INVALID_PASSWORD_FORMAT]: new AppException(
    EAppExceptionCode.INVALID_PASSWORD_FORMAT,
    'At least 1 Upper case, 1 lower case, 1 number',
    HttpStatus.FORBIDDEN,
  ),

  [EAppExceptionCode.CONTAIN_ACCEPTED_CHAR]: new AppException(
    EAppExceptionCode.CONTAIN_ACCEPTED_CHAR,
    'Password must be contain accepted character',
    HttpStatus.FORBIDDEN,
  ),

  [EAppExceptionCode.TOTP_INVAILID]: new AppException(
    EAppExceptionCode.TOTP_INVAILID,
    'Invalid token',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.INSUFFICIENT_BALANCE]: new AppException(
    EAppExceptionCode.INSUFFICIENT_BALANCE,
    'Insufficient balance',
    HttpStatus.BAD_REQUEST,
  ),
  [EAppExceptionCode.INSUFFICIENT_REWARD]: new AppException(
    EAppExceptionCode.INSUFFICIENT_REWARD,
    'Insufficient reward',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.INSUFFICIENT_ROUND_NOT_CLAIMED]: new AppException(
    EAppExceptionCode.INSUFFICIENT_ROUND_NOT_CLAIMED,
    'Insufficient round not claimed',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.COIN_ALREADY_EXISTS]: new AppException(
    EAppExceptionCode.COIN_ALREADY_EXISTS,
    'Coin already exists',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.COIN_NOT_FOUND]: new AppException(
    EAppExceptionCode.COIN_NOT_FOUND,
    'Coin not found',
    HttpStatus.NOT_FOUND,
  ),

  [EAppExceptionCode.COIN_NOT_SUPPORTED]: new AppException(
    EAppExceptionCode.COIN_NOT_SUPPORTED,
    'Coin not supported',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.INVALID_ADDRESS]: new AppException(
    EAppExceptionCode.INVALID_ADDRESS,
    'Invalid address',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.MAXIMUM_TOKEN]: new AppException(
    EAppExceptionCode.MAXIMUM_TOKEN,
    'List token is at maximum',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.MAXIMUM_WHITELIST_TOKEN]: new AppException(
    EAppExceptionCode.MAXIMUM_WHITELIST_TOKEN,
    'Whitelist token is at maximum',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.PUBLISHED_TOKEN]: new AppException(
    EAppExceptionCode.PUBLISHED_TOKEN,
    'Token have been published, can not be update',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.IS_NATIVE_SOLANA]: new AppException(
    EAppExceptionCode.IS_NATIVE_SOLANA,
    'This address is navtive Solana token',
    HttpStatus.BAD_REQUEST,
  ),


  [EAppExceptionCode.MEME_SOL_WHEEL_MIN_MAX_BET_NOT_CHANGE]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_MIN_MAX_BET_NOT_CHANGE,
    'Min/max bet not change',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.MEME_SOL_WHEEL_GAME_DURATION_NOT_CHANGE]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_GAME_DURATION_NOT_CHANGE,
    'Game duration not change',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.MEME_SOL_WHEEL_MIN_BET_LOWER_THAN_MAX_BET]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_MIN_BET_LOWER_THAN_MAX_BET,
    'Minimum bet can not be higher than maximum bet.',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.MEME_SOL_WHEEL_BET_VALUE_GREATER_THAN_0]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_BET_VALUE_GREATER_THAN_0,
    'Bet values must be greater than 0.',
    HttpStatus.BAD_REQUEST,
  ),


  [EAppExceptionCode.MEME_SOL_WHEEL_ROUND_DURATION_GREATER_THAN_0]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_ROUND_DURATION_GREATER_THAN_0,
    'Round duration must be greater than 0 seconds.',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.MEME_SOL_WHEEL_PARTICIPANT_GREATER_THAN_2]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_PARTICIPANT_GREATER_THAN_2,
    'Participant numbers must be greater than or equal to 2.',
    HttpStatus.BAD_REQUEST,
  ),


  [EAppExceptionCode.MEME_SOL_WHEEL_GAME_ROUND_NOT_FOUND]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_GAME_ROUND_NOT_FOUND,
    'Game round not found',
    HttpStatus.NOT_FOUND,
  ),

  [EAppExceptionCode.MEME_SOL_WHEEL_GAME_STATE_NOT_FOUND]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_GAME_STATE_NOT_FOUND,
    'Game state not found',
    HttpStatus.NOT_FOUND,
  ),

  [EAppExceptionCode.MEME_SOL_WHEEL_PLAYER_NOT_FOUND]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_PLAYER_NOT_FOUND,
    'Player not found',
    HttpStatus.NOT_FOUND,
  ),

  [EAppExceptionCode.MEME_SOL_WHEEL_PLAYER_ALREADY_EXISTS]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_PLAYER_ALREADY_EXISTS,
    'Player already exists',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.MEME_SOL_WHEEL_NO_WINNER_FOUND]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_NO_WINNER_FOUND,
    'No winner found',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.MEME_SOL_WHEEL_MIN_MAX_PLAYER_NOT_CHANGE]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_MIN_MAX_PLAYER_NOT_CHANGE,
    'Min max player not change',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.MEME_SOL_WHEEL_FEE_TREASURY_RANGE]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_FEE_TREASURY_RANGE,
    'System fee must be between 0 and 100.',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.MEME_SOL_WHEEL_FEE_VALUE_UNCHANGED]: new AppException(
    EAppExceptionCode.MEME_SOL_WHEEL_FEE_VALUE_UNCHANGED,
    'System fee unchanged',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.DASHBOARD_NOT_FOUND]: new AppException(
    EAppExceptionCode.DASHBOARD_NOT_FOUND,
    'Can not fetch dashboard data',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.DASHBOARD_CHART_NOT_FOUND]: new AppException(
    EAppExceptionCode.DASHBOARD_CHART_NOT_FOUND,
    'Can not fetch chart data',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.QUEST_NOT_FOUND]: new AppException(
    EAppExceptionCode.QUEST_NOT_FOUND,
    'Can not found quest',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.END_DATE_AFTER_START_DATE]: new AppException(
    EAppExceptionCode.END_DATE_AFTER_START_DATE,
    'End date must be after start date',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.USER_QUEST_CHECK_IN_ALREADY_COMPLETED]: new AppException(
    EAppExceptionCode.USER_QUEST_CHECK_IN_ALREADY_COMPLETED,
    'You have already checked in today',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.NOT_SOCIAL_QUEST]: new AppException(
    EAppExceptionCode.NOT_SOCIAL_QUEST,
    'This quest is not a social quest',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.USER_QUEST_ALREADY_COMPLETED]: new AppException(
    EAppExceptionCode.USER_QUEST_ALREADY_COMPLETED,
    'User quest already completed',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.QUEST_NAME_ALREADY_EXISTS]: new AppException(
    EAppExceptionCode.QUEST_NAME_ALREADY_EXISTS,
    'Quest name already exists',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.QUEST_NOT_STARTED]: new AppException(
    EAppExceptionCode.QUEST_NOT_STARTED,
    'Quest not started',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.QUEST_ALREADY_ENDED]: new AppException(
    EAppExceptionCode.QUEST_ALREADY_ENDED,
    'Quest already ended',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.QUEST_NAME_INVALID_FORMAT]: new AppException(
    EAppExceptionCode.QUEST_NAME_INVALID_FORMAT,
    'Only alphanumeric characters, spaces, hyphens, and underscores are allowed.',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.QUEST_NOT_ACTIVE]: new AppException(
    EAppExceptionCode.QUEST_NOT_ACTIVE,
    'Quest is not active',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.LEADERBOARD_PAGE_EXCEEDS_MAX_VALUE]: new AppException(
    EAppExceptionCode.LEADERBOARD_PAGE_EXCEEDS_MAX_VALUE,
    'Page exceeds the maximum allowed value of 300',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.RACING_BALL_GAME_NOT_FOUND]: new AppException(
    EAppExceptionCode.RACING_BALL_GAME_NOT_FOUND,
    'Racing ball game not found',
    HttpStatus.NOT_FOUND,
  ),

  [EAppExceptionCode.RACING_BALL_GAME_ROUND_NOT_FOUND]: new AppException(
    EAppExceptionCode.RACING_BALL_GAME_ROUND_NOT_FOUND,
    'Racing ball game round not found',
    HttpStatus.NOT_FOUND,
  ),

  [EAppExceptionCode.RACING_BALL_GAME_STATE_NOT_FOUND]: new AppException(
    EAppExceptionCode.RACING_BALL_GAME_STATE_NOT_FOUND,
    'Racing ball game state not found',
    HttpStatus.NOT_FOUND,
  ),

  [EAppExceptionCode.RACING_BALL_GAME_NOT_IN_DRAWING_STATUS]: new AppException(
    EAppExceptionCode.RACING_BALL_GAME_NOT_IN_DRAWING_STATUS,
    'Racing ball game is not in drawing status',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.RACING_BALL_PLAYER_NOT_FOUND]: new AppException(
    EAppExceptionCode.RACING_BALL_PLAYER_NOT_FOUND,
    'Racing ball player not found',
    HttpStatus.NOT_FOUND,
  ),

  [EAppExceptionCode.RACING_BALL_PLAYER_ALREADY_EXISTS]: new AppException(
    EAppExceptionCode.RACING_BALL_PLAYER_ALREADY_EXISTS,
    'Racing ball player already exists',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.RACING_BALL_NO_WINNER_FOUND]: new AppException(
    EAppExceptionCode.RACING_BALL_NO_WINNER_FOUND,
    'Racing ball no winner found',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.RACING_BALL_GAME_ROUND_NOT_EQUAL_CURRENT_ROUND]: new AppException(
    EAppExceptionCode.RACING_BALL_GAME_ROUND_NOT_EQUAL_CURRENT_ROUND,
    'Racing ball game round not equal current round',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.RACING_BALL_BUYING_VALUE_GREATER_THAN_0]: new AppException(
    EAppExceptionCode.RACING_BALL_BUYING_VALUE_GREATER_THAN_0,
    'Ball values must be greater than 0.',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.RACING_BALL_MIN_BUYING_LOWER_THAN_MAX_BUYING]: new AppException(
    EAppExceptionCode.RACING_BALL_MIN_BUYING_LOWER_THAN_MAX_BUYING,
    'Minimum buying ball cannot be higher than or equal to the maximum buying ball.',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.RACING_BALL_PARTICIPANT_GREATER_THAN_2]: new AppException(
    EAppExceptionCode.RACING_BALL_PARTICIPANT_GREATER_THAN_2,
    'Participant numbers must be greater than or equal to 2.',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.RACING_BALL_FEE_TREASURY_RANGE]: new AppException(
    EAppExceptionCode.RACING_BALL_FEE_TREASURY_RANGE,
    'System fee must be between 0 and 100.',
    HttpStatus.BAD_REQUEST,
  ),

  [EAppExceptionCode.RACING_BALL_FEE_VALUE_UNCHANGED]: new AppException(
    EAppExceptionCode.RACING_BALL_FEE_VALUE_UNCHANGED,
    'System fee unchanged',
    HttpStatus.BAD_REQUEST,
  ),
};
