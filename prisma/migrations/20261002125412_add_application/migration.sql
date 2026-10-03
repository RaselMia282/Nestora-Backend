-- CreateIndex
CREATE INDEX "applications_roomId_idx" ON "applications"("roomId");

-- CreateIndex
CREATE INDEX "applications_tenantId_idx" ON "applications"("tenantId");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");
