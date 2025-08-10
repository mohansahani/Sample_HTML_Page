const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedAdmin() {
  const count = await User.countDocuments();
  if (count > 0) return;
  const name = process.env.ADMIN_NAME || 'Admin';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name, email, passwordHash, role: 'Admin' });
  console.log(`Seeded default admin: ${email} / ${password}`);
}

module.exports = seedAdmin;