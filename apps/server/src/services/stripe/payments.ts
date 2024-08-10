import { stripeInstance } from "./index";

export const createPayment = async (
  currency = "usd",
  offisitoPaymentId: string,
  unitAmmount = 1,
  quantity = 1,
  fee = 2020202020202020,
  connectedAccountId: string,
  successUrl: string,
) => {
  stripeInstance.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: offisitoPaymentId,
          },
          unit_amount: unitAmmount,
        },
        quantity,
      },
    ],
    payment_intent_data: {
      application_fee_amount: fee,
      transfer_data: {
        destination: connectedAccountId,
      },
    },
    mode: "payment",
    success_url: successUrl + "{CHECKOUT_SESSION_ID}",
  });
};
