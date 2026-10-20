import { NextFunction, Request, Response } from "express";

import { dashboardService } from "./dashboard.service";
import { catchAsync } from "../../utilis/catchAsync";
import { sendResponse } from "../../utilis/sendResponse";

const getTenantDashboardOverview = catchAsync(
  async (req: Request, res: Response) => {
    const tenantId = req.user.id;

    const result =
      await dashboardService.getTenantDashboardOverviewIntoDB(tenantId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Dashboard overview retrieved successfully",
      data: result,
    });
  },
);

const getAdminDashboardOverview = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
           const result = await dashboardService.getAdminDashboardOverviewIntoDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin overview retrieved successfully",
      data: result,
    });
})


const getOwnerDashboardOverview = catchAsync(
  async (req: Request, res: Response) => {
    const ownerId = req.user.id;

    const result =
      await dashboardService.getOwnerDashboardOverviewIntoDB(ownerId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Owner dashboard overview retrieved successfully",
      data: result,
    });
  }
);

const getAllUsers = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

  const result = await dashboardService.getAllUsersIntoDB();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "All users fetched successfully",
      data: result,
    });

})

export const dashboardController = {
  getTenantDashboardOverview,
  getAdminDashboardOverview,
  getOwnerDashboardOverview,
  getAllUsers,
};
