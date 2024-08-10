import {
  createHostAccount,
  createHostAccountLink,
} from "../../../services/stripe/accounts";
import stripe from "stripe";

export const createHostAccountAndGetId = async (): Promise<string | null> =>
  (await createHostAccount())?.id || null;

export const createHostAccountAndAccountLink = async (
  returnUrl: string,
  refreshUrl: string,
): Promise<stripe.AccountLink | null> => {
  const accountId = await createHostAccountAndGetId();
  if (accountId) return createHostAccountLink(accountId, returnUrl, refreshUrl);
  else console.log("error");
  return null;
};
