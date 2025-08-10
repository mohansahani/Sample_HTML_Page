const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { auth, requireRole } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { createAssetValidator, updateAssetValidator } = require('../validators/assetValidators');
const {
  listAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  stats,
  bulkImport
} = require('../controllers/assetController');

router.get('/stats', auth, stats);
router.get('/', auth, listAssets);
router.get('/:id', auth, getAsset);
router.post('/', auth, requireRole('Admin'), createAssetValidator, validateRequest, createAsset);
router.put('/:id', auth, requireRole('Admin'), updateAssetValidator, validateRequest, updateAsset);
router.delete('/:id', auth, requireRole('Admin'), deleteAsset);
router.post('/bulk-import', auth, requireRole('Admin'), upload.single('file'), bulkImport);

module.exports = router;