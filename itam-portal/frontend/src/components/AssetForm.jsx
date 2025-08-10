import { useEffect, useState } from 'react';

const empty = {
  assetType: 'Laptop',
  assignedEmployeeName: '',
  isSpare: false,
  branchName: '',
  zoneName: '',
  designation: '',
  contactNumber: '',
  employeeRole: '',
  userId: '',
  workOrderId: ''
};

export default function AssetForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initial ? { ...empty, ...initial } : empty);
  }, [initial]);

  function validate() {
    const e = {};
    if (!form.assetType) e.assetType = 'Required';
    if (!['Laptop', 'Desktop'].includes(form.assetType)) e.assetType = 'Invalid type';
    if (!form.branchName) e.branchName = 'Required';
    if (!form.zoneName) e.zoneName = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Asset Type</label>
          <select className="input" value={form.assetType} onChange={e => setForm({ ...form, assetType: e.target.value })}>
            <option>Laptop</option>
            <option>Desktop</option>
          </select>
          {errors.assetType && <p className="text-red-600 text-sm">{errors.assetType}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Assigned Employee Name</label>
          <input className="input" value={form.assignedEmployeeName} onChange={e => setForm({ ...form, assignedEmployeeName: e.target.value })}/>
        </div>
        <div>
          <label className="block text-sm mb-1">Spare</label>
          <select className="input" value={form.isSpare ? 'true' : 'false'} onChange={e => setForm({ ...form, isSpare: e.target.value === 'true' })}>
            <option value="false">Assigned</option>
            <option value="true">Spare</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Branch Name</label>
          <input className="input" value={form.branchName} onChange={e => setForm({ ...form, branchName: e.target.value })}/>
          {errors.branchName && <p className="text-red-600 text-sm">{errors.branchName}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Zone Name</label>
          <input className="input" value={form.zoneName} onChange={e => setForm({ ...form, zoneName: e.target.value })}/>
          {errors.zoneName && <p className="text-red-600 text-sm">{errors.zoneName}</p>}
        </div>
        <div>
          <label className="block text-sm mb-1">Designation</label>
          <input className="input" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })}/>
        </div>
        <div>
          <label className="block text-sm mb-1">Contact Number</label>
          <input className="input" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })}/>
        </div>
        <div>
          <label className="block text-sm mb-1">Role</label>
          <input className="input" value={form.employeeRole} onChange={e => setForm({ ...form, employeeRole: e.target.value })}/>
        </div>
        <div>
          <label className="block text-sm mb-1">User ID</label>
          <input className="input" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })}/>
        </div>
        <div>
          <label className="block text-sm mb-1">WO ID</label>
          <input className="input" value={form.workOrderId} onChange={e => setForm({ ...form, workOrderId: e.target.value })}/>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn" type="submit">{initial ? 'Update' : 'Create'}</button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}