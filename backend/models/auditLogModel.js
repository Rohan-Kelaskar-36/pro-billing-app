import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  action: String, // e.g., 'Adjust Stock'
  details: String, // e.g., 'Reduced 3 units of Product X at Store Y'
  timestamp: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
