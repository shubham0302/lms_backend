const { Router } = require("express");
const { verifyToken, verifyRole } = require("../../middlewares/auth.middleware");
const { DashboardController } = require("../../controllers/report/dashboard");
const { ReportController } = require("../../controllers/report/report");

const reportRouter = Router();

reportRouter.get('/dashboard/company',[verifyToken,
    verifyRole({
        role:'company'
    }),],DashboardController.getCompanyDashboardCount)

reportRouter.get('/dashboard/trainee',[verifyToken,
    verifyRole({
        role:'trainee'
    }),],DashboardController.getTraineeDashboardCount)

reportRouter.get('/report/company',[verifyToken,
    verifyRole({
        role:'company'
    }),],ReportController.getReportCountByModule)

reportRouter.get('/report/trainee',[verifyToken,
    verifyRole({
        role:'trainee'
    }),],ReportController.getTraineeReport)

module.exports = {reportRouter}