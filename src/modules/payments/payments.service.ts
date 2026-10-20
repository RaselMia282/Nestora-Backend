import Stripe from "stripe";
import config from "../../config";
import { PaymentMethod, PaymentStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { ICreatePayment } from "./payments.interface";

const createPaymentsIntoDB = async (
  tenantId: string,
  payload: ICreatePayment,
) => {
  const { leaseId } = payload;

  const lease = await prisma.lease.findUnique({
    where: {
      id: leaseId,
    },
    include: {
      application: true,
      payments: true,
    },
  });

  if (!lease) {
    throw new Error("Lease not found");
  }

  if (lease.application.tenantId !== tenantId) {
    throw new Error("You are not authorized to make this payment");
  }

  if (!lease.isSigned) {
    throw new Error("Lease must be signed before making payment");
  }

  if (lease.status === "TERMINATED") {
    throw new Error("Cannot make payment for a terminated lease");
  }

  const completedPayment = lease.payments.find(
    (payment) => payment.status === PaymentStatus.COMPLETED,
  );

  if (completedPayment) {
    throw new Error("Payment has already been completed for this lease");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",

    //  line items
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: "Nestora Rent",
          },
          unit_amount: Math.round(lease.monthlyRent),
        },

        quantity: 1,
      },
    ],
    success_url: `http://localhost:3001/payment/sucess?sessionId={CHECKOUT_SESSION_ID}`,

    cancel_url: `http://localhost:3001/payment/cancel?leaseId=${lease.id}`,

    metadata: {
      leaseId: lease.id,
      tenantId: tenantId,
    },
  });

  //   save payment
  await prisma.payment.create({
    data: {
      leaseId: lease.id,
      amount: lease.monthlyRent,
      tenantId,
      transactionId: session.id,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.PENDING,

      paymentData: {
        checkoutUrl: session.url,
        sessionId: session.id,
        currency: session.currency || "USD",
        paymentStatus: session.payment_status,
      } as any,
    },
  });

  return {
    url: session.url,
  };
};

// const handleWebhookIntoDB = async (payload: Buffer, signature: string) => {
//   const endpointSecret = config.stripe_webhook_secret;
//   const event = stripe.webhooks.constructEvent(
//     payload,
//     signature,
//     endpointSecret as string,
//   );

//   switch (event.type) {
//     case "checkout.session.completed": {
//       const session = event.data.object as Stripe.Checkout.Session;
//       const leaseId = session.metadata?.leaseId;

//       if (leaseId) {
//         await prisma.payment.update({
//           where: {
//             leaseId,
//           },
//           data: {
//             status: PaymentStatus.COMPLETED,
//             transactionId: session.payment_intent as string,

//             paymentData: {
//               checkUrl: session.url,
//               sessionId: session.id,
//               currency: session.currency || "usd",
//               paymentStatus: session.payment_status,
//             } as any,
//           },
//         });
//       }
//       break;
//     }
//   }
// };

const handleWebhookIntoDB = async (payload: Buffer, signature: string) => {
  try {
    console.log("🔥 WEBHOOK START");

    const endpointSecret = config.stripe_webhook_secret;

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret as string,
    );

    console.log("🔥 EVENT TYPE:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("🔥 SESSION ID:", session.id);
        console.log("🔥 METADATA:", session.metadata);

        const leaseId = session.metadata?.leaseId;

        console.log("🔥 LEASE ID:", leaseId);

        if (leaseId) {
          await prisma.payment.update({
            where: {
              leaseId,
            },
            data: {
              status: PaymentStatus.COMPLETED,
              transactionId: session.payment_intent as string,
              paymentData: {
                checkUrl: session.url,
                sessionId: session.id,
                currency: session.currency || "usd",
                paymentStatus: session.payment_status,
              } as any,
            },
          });

          console.log("🔥 PAYMENT UPDATED");
        }

        break;
      }
    }

    console.log("🔥 WEBHOOK SUCCESS");
  } catch (error) {
    console.error("🔥🔥 WEBHOOK ERROR:", error);
    throw error;
  }
};

const getMyPaymentIntoDB = async (tenantId: string) => {
  const payments = await prisma.payment.findMany({
    where: {
      tenantId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return payments;
};

export const paymentService = {
  createPaymentsIntoDB,
  handleWebhookIntoDB,
  getMyPaymentIntoDB,
};
