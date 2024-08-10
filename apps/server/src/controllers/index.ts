import { QueryWithHelpers } from "mongoose";

export const validateExisting = <T = string>(value: T) => !!value;

export const findDocs = async <T = any, K = any>(
  query: QueryWithHelpers<T, K>,
  lean = true,
) => (lean ? query.lean() : query);
