import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  isUUID,
  buildMessage
} from 'class-validator';

/**
 * ページネーションパラメータが有効な数値であることを検証するデコレータ
 * @param validationOptions バリデーションオプション
 */
export function IsValidPaginationParameter(validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isValidPaginationParameter',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (value === undefined || value === '') {
            return true; // 値が指定されていない場合はデフォルト値が使用されるため、有効とみなす
          }

          const number = Number(value);
          return !isNaN(number) && number > 0 && Number.isInteger(number);
        },
        defaultMessage: buildMessage(
          (eachPrefix) => `${eachPrefix}$property must be a positive integer`,
          validationOptions
        ),
      },
    });
  };
}

/**
 * 文字列が有効なUUID形式であることを検証するデコレータ
 * @param version UUIDバージョン（デフォルト: 4）
 * @param validationOptions バリデーションオプション
 */
export function IsUUIDCustom(version: '3' | '4' | '5' | 'all' = '4', validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isUuidCustom',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && isUUID(value, version);
        },
        defaultMessage: buildMessage(
          (eachPrefix) => `${eachPrefix}$property must be a valid UUID${version !== 'all' ? ' version ' + version : ''}`,
          validationOptions
        ),
      },
    });
  };
}

/**
 * 日付文字列が有効なISO形式であることを検証するデコレータ
 * @param validationOptions バリデーションオプション
 */
export function IsValidISODate(validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'isValidIsoDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') {
            return false;
          }

          const date = new Date(value);
          return !isNaN(date.getTime()) && value === date.toISOString();
        },
        defaultMessage: buildMessage(
          (eachPrefix) => `${eachPrefix}$property must be a valid ISO date string`,
          validationOptions
        ),
      },
    });
  };
}

/**
 * 文字列が最小長、最大長の範囲内であることを検証するデコレータ
 * @param min 最小長（デフォルト: 1）
 * @param max 最大長
 * @param validationOptions バリデーションオプション
 */
export function StringLength(min: number = 1, max?: number, validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      name: 'stringLength',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [min, max],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [min, max] = args.constraints;
          return typeof value === 'string' &&
                 value.length >= min &&
                 (max === undefined || value.length <= max);
        },
        defaultMessage: buildMessage(
          (eachPrefix, args: ValidationArguments) => {
            const [min, max] = args.constraints;
            return max === undefined
              ? `${eachPrefix}$property must be at least ${min} characters long`
              : `${eachPrefix}$property must be between ${min} and ${max} characters long`;
          },
          validationOptions
        ),
      },
    });
  };
}