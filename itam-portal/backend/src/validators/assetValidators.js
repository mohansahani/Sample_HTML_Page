const { body } = require('express-validator');

const createAssetValidator = [
  body('assetType').isIn(['Laptop', 'Desktop']),
  body('assignedEmployeeName').optional().isString().trim(),
  body('isSpare').isBoolean(),
  body('branchName').isString().trim().notEmpty(),
  body('zoneName').isString().trim().notEmpty(),
  body('designation').optional().isString().trim(),
  body('contactNumber').optional().isString().trim(),
  body('employeeRole').optional().isString().trim(),
  body('userId').optional().isString().trim(),
  body('workOrderId').optional().isString().trim()
];

const updateAssetValidator = [
  body('assetType').optional().isIn(['Laptop', 'Desktop']),
  body('assignedEmployeeName').optional().isString().trim(),
  body('isSpare').optional().isBoolean(),
  body('branchName').optional().isString().trim(),
  body('zoneName').optional().isString().trim(),
  body('designation').optional().isString().trim(),
  body('contactNumber').optional().isString().trim(),
  body('employeeRole').optional().isString().trim(),
  body('userId').optional().isString().trim(),
  body('workOrderId').optional().isString().trim()
];

module.exports = { createAssetValidator, updateAssetValidator };