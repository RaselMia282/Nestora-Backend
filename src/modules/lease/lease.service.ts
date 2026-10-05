import { ApplicationStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateLease, IUpdateLease } from "./lease.interface";

const createLeaseIntoDB = async (ownerId: string, payload: ICreateLease) => {
  const application = await prisma.application.findUnique({
    where: {
      id: payload.applicationId,
    },
    include: {
      room: {
        include: {
          property: true,
        },
      },
      lease: true,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  if (application.status !== ApplicationStatus.APPROVED) {
    throw new Error("Lease can only be created for an approved application");
  }

  if (application.room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized to create this lease");
  }

  if (application.lease) {
    throw new Error("A lease already exists for this application");
  }

  const result = await prisma.lease.create({
    data: {
      applicationId: payload.applicationId,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      monthlyRent: payload.monthlyRent,
      securityDeposit: payload.securityDeposit,
    },
  });
  return result;
};

const getAllLeaseIntoDB = async () => {
  const result = await prisma.lease.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const getSingleLeaseIntoDB = async (id: string) => {
  const result = await prisma.lease.findUnique({
    where: {
      id,
    },
    include: {
      application: {
        include: {
          room: {
            include: {
              property: true,
            },
          },
          tenant: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const updateLeaseIntoDB = async (
  ownerId: string,
  leaseId: string,
  payload: IUpdateLease,
) => {
  const lease = await prisma.lease.findUnique({
    where: {
      id: leaseId,
    },
    include: {
      application: {
        include: {
          room: {
            include: {
              property: true,
            },
          },
        },
      },
    },
  });
  if (!lease) {
    throw new Error("Lease not found");
  }

  if (lease.application.room.property.ownerId !== ownerId) {
    throw new Error("You are not allowed to update this lease");
  }

  if (lease.isSigned) {
    throw new Error("Singed lease can not be update");
  }

  const updateData: any = {
    ...payload,
  };

  if (payload.startDate) {
    updateData.startDate = new Date(payload.startDate);
  }

  if (payload.endDate) {
    updateData.endDate = new Date(payload.endDate);
  }

  if (payload.startDate || payload.endDate) {
    const startDate = payload.startDate
      ? new Date(payload.startDate)
      : lease.startDate;

    const endDate = payload.endDate ? new Date(payload.endDate) : lease.endDate;

    if (endDate <= startDate) {
      throw new Error("End date must be after start date");
    }
  }

  return prisma.lease.update({
    where: { id: leaseId },
    data: updateData,
  });
};

const terminateLeaseIntoDB = async (ownerId: string, leaseId: string) => {
  const lease = await prisma.lease.findUnique({
    where: { id: leaseId },
    include: {
      application: {
        include: {
          room: {
            include: {
              property: true,
            },
          },
        },
      },
    },
  });

  if (!lease) {
    throw new Error("Lease not found");
  }

  if (lease.application.room.property.ownerId !== ownerId) {
    throw new Error("You are not authorized to terminate this lease");
  }

  if (lease.status === "TERMINATED") {
    throw new Error("Lease is already terminated");
  }

  return prisma.lease.update({
    where: { id: leaseId },
    data: {
      status: "TERMINATED",
    },
  });
};

const signLeaseIntoDB = async (tenantId, leaseId) => {
  const lease = await prisma.lease.findUnique({
    where: { id: leaseId },
    include: {
      application: true,
    },
  });

  if (!lease) {
    throw new Error("Lease not found");
  }

  if (lease.application.tenantId !== tenantId) {
    throw new Error("You are not authorized to sign this lease");
  }

  if (lease.isSigned) {
    throw new Error("Lease already signed");
  }

  return prisma.lease.update({
    where: { id: leaseId },
    data: {
      isSigned: true,
    },
  });
};

export const leaseService = {
  createLeaseIntoDB,
  getAllLeaseIntoDB,
  getSingleLeaseIntoDB,
  updateLeaseIntoDB,
  terminateLeaseIntoDB,
  signLeaseIntoDB,
};
