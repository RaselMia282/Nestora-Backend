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

export const paymentService = {
  createPaymentsIntoDB,
};
