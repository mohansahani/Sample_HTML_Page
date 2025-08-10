const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    assetType: { type: String, enum: ['Laptop', 'Desktop'], required: true },
    assignedEmployeeName: { type: String, default: '', trim: true },
    isSpare: { type: Boolean, default: false },
    branchName: { type: String, required: true, trim: true },
    zoneName: { type: String, required: true, trim: true },
    designation: { type: String, default: '', trim: true },
    contactNumber: { type: String, default: '', trim: true },
    employeeRole: { type: String, default: '', trim: true },
    userId: { type: String, default: '', trim: true },
    workOrderId: { type: String, default: '', trim: true }
  },
  { timestamps: true }
);

assetSchema.index({ assetType: 1 });
assetSchema.index({ zoneName: 1, branchName: 1 });
assetSchema.index({ isSpare: 1 });
assetSchema.index({
  assignedEmployeeName: 'text',
  branchName: 'text',
  zoneName: 'text',
  designation: 'text',
  employeeRole: 'text',
  userId: 'text',
  workOrderId: 'text'
});

module.exports = mongoose.model('Asset', assetSchema);