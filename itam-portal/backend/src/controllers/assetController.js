const Asset = require('../models/Asset');
const xlsx = require('xlsx');

function buildFilters(query) {
  const filters = {};
  const fields = [
    'assetType',
    'assignedEmployeeName',
    'isSpare',
    'branchName',
    'zoneName',
    'designation',
    'contactNumber',
    'employeeRole',
    'userId',
    'workOrderId'
  ];

  for (const key of fields) {
    if (query[key] !== undefined && query[key] !== '') {
      if (key === 'isSpare') {
        filters.isSpare = query.isSpare === 'true' || query.isSpare === true;
      } else if (['assetType'].includes(key)) {
        filters[key] = query[key];
      } else {
        filters[key] = { $regex: String(query[key]), $options: 'i' };
      }
    }
  }

  if (query.q) {
    filters.$text = { $search: query.q };
  }

  return filters;
}

async function listAssets(req, res) {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  const filters = buildFilters(req.query);
  const [total, items] = await Promise.all([
    Asset.countDocuments(filters),
    Asset.find(filters)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
  ]);

  res.json({
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  });
}

async function getAsset(req, res) {
  const asset = await Asset.findById(req.params.id).lean();
  if (!asset) return res.status(404).json({ message: 'Asset not found' });
  res.json(asset);
}

async function createAsset(req, res) {
  const payload = req.body;
  const asset = await Asset.create(payload);
  res.status(201).json(asset);
}

async function updateAsset(req, res) {
  const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
  if (!asset) return res.status(404).json({ message: 'Asset not found' });
  res.json(asset);
}

async function deleteAsset(req, res) {
  const asset = await Asset.findByIdAndDelete(req.params.id).lean();
  if (!asset) return res.status(404).json({ message: 'Asset not found' });
  res.json({ message: 'Deleted' });
}

async function stats(req, res) {
  const [byType, byZone, byBranch, assignedVsSpare] = await Promise.all([
    Asset.aggregate([{ $group: { _id: '$assetType', count: { $sum: 1 } } }]),
    Asset.aggregate([{ $group: { _id: '$zoneName', count: { $sum: 1 } } }]),
    Asset.aggregate([{ $group: { _id: '$branchName', count: { $sum: 1 } } }]),
    Asset.aggregate([{ $group: { _id: '$isSpare', count: { $sum: 1 } } }])
  ]);

  res.json({
    byType,
    byZone,
    byBranch,
    assignedVsSpare: assignedVsSpare.map(x => ({ label: x._id ? 'Spare' : 'Assigned', count: x.count }))
  });
}

async function bulkImport(req, res) {
  if (!req.file) return res.status(400).json({ message: 'File required' });

  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  const errors = [];
  const docs = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const rowIndex = i + 2; // header is row 1

    try {
      const doc = {
        assetType: String(r['Asset Type'] || r.assetType || '').trim(),
        assignedEmployeeName: String(r['Assigned Employee Name'] || r.assignedEmployeeName || '').trim(),
        isSpare: String(r['Spare'] || r.isSpare || r['Spare Assets'] || '').toLowerCase() === 'true' || r['Spare'] === true || r.isSpare === true,
        branchName: String(r['Branch Name'] || r.branchName || '').trim(),
        zoneName: String(r['Zone Name'] || r.zoneName || '').trim(),
        designation: String(r['Designation'] || r.designation || '').trim(),
        contactNumber: String(r['Contact Number'] || r.contactNumber || '').trim(),
        employeeRole: String(r['Role'] || r.employeeRole || '').trim(),
        userId: String(r['User ID'] || r.userId || '').trim(),
        workOrderId: String(r['WO ID'] || r.workOrderId || '').trim()
      };

      if (!['Laptop', 'Desktop'].includes(doc.assetType)) throw new Error('assetType must be Laptop or Desktop');
      if (!doc.branchName) throw new Error('branchName is required');
      if (!doc.zoneName) throw new Error('zoneName is required');

      docs.push(doc);
    } catch (e) {
      errors.push({ row: rowIndex, error: e.message });
    }
  }

  let inserted = 0;
  if (docs.length) {
    const result = await Asset.insertMany(docs, { ordered: false });
    inserted = result.length;
  }

  res.json({ inserted, errors, totalRows: rows.length });
}

module.exports = {
  listAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  stats,
  bulkImport
};