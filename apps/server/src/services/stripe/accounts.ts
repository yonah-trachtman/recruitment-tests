import { stripeInstance } from ".";
import stripe from "stripe";

export const createHostAccount = async (): Promise<stripe.Account | null> => {
  try {
    return await stripeInstance.accounts.create({
      controller: {
        stripe_dashboard: {
          type: "none",
        },
        fees: {
          payer: "application",
        },
        losses: {
          payments: "application",
        },
        requirement_collection: "application",
      },
      capabilities: {
        transfers: { requested: true },
      },
      country: "US",
    });
  } catch (error) {
    console.error(
      "An error occurred when calling the Stripe API to create an account",
      error,
    );
    return null;
  }
};

export const createHostAccountLink = async (
  accountId: string,
  returnUrl: string,
  refreshUrl: string,
): Promise<stripe.AccountLink | null> => {
  try {
    return await stripeInstance.accountLinks.create({
      account: accountId,
      return_url: returnUrl,
      refresh_url: refreshUrl,
      type: "account_onboarding",
    });
  } catch (error) {
    console.error(
      "An error occurred when calling the Stripe API to create an account link:",
      error,
    );
    return null;
  }
};
