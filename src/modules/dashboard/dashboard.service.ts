import {
  ApplicationStatus,
  LeaseStatus,
  PaymentStatus,
  VerificationStatus,
} from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getTenantDashboardOverviewIntoDB = async (tenantId: string) => {
  const activeLease = await prisma.lease.findFirst({
    where: {
      status: LeaseStatus.ACTIVE,
      application: {
        tenantId,
      },
    },
    select: {
      id: true,
      monthlyRent: true,
      startDate: true,
      endDate: true,
      isSigned: true,
    },
  });

  const [totalPayments, completedPayments, pendingPayments] = await Promise.all(
    [
      prisma.payment.count({
        where: {
          tenantId,
        },
      }),

      prisma.payment.count({
        where: {
          tenantId,
          status: PaymentStatus.COMPLETED,
        },
      }),

      prisma.payment.count({
        where: {
          tenantId,
          status: PaymentStatus.PENDING,
        },
      }),
    ],
  );

  return {
    activeLease,
    monthlyRent: activeLease?.monthlyRent || 0,
    totalPayments,
    completedPayments,
    pendingPayments,
  };
};

const getAdminDashboardOverviewIntoDB = async () => {
  const [
    totalUsers,
    totalProperties,
    totalListings,
    pendingApplications,
    activeLeases,
    completedPayments,
    pendingNidVerifications,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.property.count(),

    prisma.listing.count(),

    prisma.application.count({
      where: {
        status: ApplicationStatus.PENDING,
      },
    }),

    prisma.lease.count({
      where: {
        status: LeaseStatus.ACTIVE,
      },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus.COMPLETED,
      },
    }),

    prisma.identityVerification.count({
      where: {
        status: VerificationStatus.PENDING,
      },
    }),
  ]);

  return {
    totalUsers,
    totalProperties,
    totalListings,
    pendingApplications,
    activeLeases,
    completedPayments,
    pendingNidVerifications,
  };
};

const getOwnerDashboardOverviewIntoDB = async (ownerId: string) => {
  const [
    totalProperties,
    totalListings,
    totalApplications,
    pendingApplications,
    activeLeases,
    completedPayments,
  ] = await Promise.all([
    prisma.property.count({
      where: {
        ownerId,
      },
    }),

    prisma.listing.count({
      where: {
        room: {
          property: {
            ownerId,
          },
        },
      },
    }),

    prisma.application.count({
      where: {
        room: {
          property: {
            ownerId,
          },
        },
      },
    }),

    prisma.application.count({
      where: {
        status: ApplicationStatus.PENDING,
        room: {
          property: {
            ownerId,
          },
        },
      },
    }),

    prisma.lease.count({
      where: {
        status: LeaseStatus.ACTIVE,
        application: {
          room: {
            property: {
              ownerId,
            },
          },
        },
      },
    }),

    prisma.payment.count({
      where: {
        status: PaymentStatus.COMPLETED,
        lease: {
          application: {
            room: {
              property: {
                ownerId,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    totalProperties,
    totalListings,
    totalApplications,
    pendingApplications,
    activeLeases,
    completedPayments,
  };
};


const getAllUsersIntoDB = async()=>{
      const result = await prisma.user.findMany({
    select: {
      id: true,
      
      email: true,
      role: true,
      
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};


export const dashboardService = {
  getTenantDashboardOverviewIntoDB,
  getAdminDashboardOverviewIntoDB,
  getOwnerDashboardOverviewIntoDB,
  getAllUsersIntoDB,
};
