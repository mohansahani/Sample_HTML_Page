import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';
import AssetForm from '../components/AssetForm';
import FileUpload from '../components/FileUpload';

const initFilters = {
  q: '',
  assetType: '',
  assignedEmployeeName: '',
  isSpare: '',
  branchName: '',
  zoneName: '',
  designation: '',
  contactNumber: '',
  employeeRole: '',
  userId: '',
  workOrderId: ''
};

export default function Assets() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [filters, setFilters] = useState(initFilters);
  const [data, setData] = useState({ items: [], page: 1, totalPages: 1, total: 0 });
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', String(data.page || 1));
    params.set('limit', String(limit));
    params.set('sortBy', sortBy);
    params.set('order', order);
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined) params.set(k, String(v));
    });
    return params.toString();
  }, [filters, data.page, limit, sortBy, order]);

  async function fetchData(page = 1) {
    setLoading(true);
    try {
      const { data } = await api.get(`/assets?${query}`.replace(/page=\d+/, `page=${page}`));
      setData(data);
    } catch (e) {
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(1); }, [query]); // eslint-disable-line

  function updateFilter(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }));
  }

  async function handleCreate(payload) {
    try {
      await api.post('/assets', payload);
      toast.success('Asset created');
      setShowForm(false);
      fetchData(1);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Create failed');
    }
  }

  async function handleUpdate(payload) {
    try {
      await api.put(`/assets/${editing._id}`, payload);
      toast.success('Asset updated');
      setShowForm(false);
      setEditing(null);
      fetchData(data.page);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this asset?')) return;
    try {
      await api.delete(`/assets/${id}`);
      toast.success('Deleted');
      fetchData(data.page);
    } catch (e) {
      toast.error('Delete failed');
    }
  }

  async function uploadFile(file) {
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await api.post('/assets/bulk-import', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    toast.success(`Inserted: ${data.inserted}, Errors: ${data.errors.length}`);
    if (data.errors.length) {
      console.warn('Import errors', data.errors);
    }
    fetchData(1);
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="font-semibold mb-3">Search & Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="input" placeholder="Global search" value={filters.q} onChange={e => updateFilter('q', e.target.value)} />
          <select className="input" value={filters.assetType} onChange={e => updateFilter('assetType', e.target.value)}>
            <option value="">Asset Type</option>
            <option value="Laptop">Laptop</option>
            <option value="Desktop">Desktop</option>
          </select>
          <select className="input" value={filters.isSpare} onChange={e => updateFilter('isSpare', e.target.value)}>
            <option value="">Assigned/Spare</option>
            <option value="false">Assigned</option>
            <option value="true">Spare</option>
          </select>
          <input className="input" placeholder="Assigned Employee Name" value={filters.assignedEmployeeName} onChange={e => updateFilter('assignedEmployeeName', e.target.value)} />
          <input className="input" placeholder="Branch Name" value={filters.branchName} onChange={e => updateFilter('branchName', e.target.value)} />
          <input className="input" placeholder="Zone Name" value={filters.zoneName} onChange={e => updateFilter('zoneName', e.target.value)} />
          <input className="input" placeholder="Designation" value={filters.designation} onChange={e => updateFilter('designation', e.target.value)} />
          <input className="input" placeholder="Contact Number" value={filters.contactNumber} onChange={e => updateFilter('contactNumber', e.target.value)} />
          <input className="input" placeholder="Role" value={filters.employeeRole} onChange={e => updateFilter('employeeRole', e.target.value)} />
          <input className="input" placeholder="User ID" value={filters.userId} onChange={e => updateFilter('userId', e.target.value)} />
          <input className="input" placeholder="WO ID" value={filters.workOrderId} onChange={e => updateFilter('workOrderId', e.target.value)} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label>Sort by</label>
          <select className="input" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="createdAt">Created</option>
            <option value="assetType">Asset Type</option>
            <option value="zoneName">Zone</option>
            <option value="branchName">Branch</option>
          </select>
          <select className="input" value={order} onChange={e => setOrder(e.target.value)}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button className="btn" onClick={() => { setEditing(null); setShowForm(true); }}>+ Add Asset</button>
            <FileUpload onUpload={uploadFile} />
          </div>
        )}
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th className="th">Type</th>
                  <th className="th">Assigned Employee</th>
                  <th className="th">Spare</th>
                  <th className="th">Branch</th>
                  <th className="th">Zone</th>
                  <th className="th">Designation</th>
                  <th className="th">Contact</th>
                  <th className="th">Role</th>
                  <th className="th">User ID</th>
                  <th className="th">WO ID</th>
                  {isAdmin && <th className="th">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {data.items.map(a => (
                  <tr key={a._id}>
                    <td className="td">{a.assetType}</td>
                    <td className="td">{a.assignedEmployeeName || '-'}</td>
                    <td className="td">{a.isSpare ? 'Yes' : 'No'}</td>
                    <td className="td">{a.branchName}</td>
                    <td className="td">{a.zoneName}</td>
                    <td className="td">{a.designation || '-'}</td>
                    <td className="td">{a.contactNumber || '-'}</td>
                    <td className="td">{a.employeeRole || '-'}</td>
                    <td className="td">{a.userId || '-'}</td>
                    <td className="td">{a.workOrderId || '-'}</td>
                    {isAdmin && (
                      <td className="td">
                        <div className="flex gap-2">
                          <button className="btn btn-secondary" onClick={() => { setEditing(a); setShowForm(true); }}>Edit</button>
                          <button className="btn" onClick={() => handleDelete(a._id)}>Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {data.items.length === 0 && (
                  <tr><td className="td" colSpan={isAdmin ? 11 : 10}>No records</td></tr>
                )}
              </tbody>
            </table>
            <Pagination page={data.page} totalPages={data.totalPages} onChange={p => fetchData(p)} />
          </>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="card w-full max-w-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">{editing ? 'Edit Asset' : 'Add Asset'}</h3>
              <button className="btn btn-secondary" onClick={() => { setShowForm(false); setEditing(null); }}>Close</button>
            </div>
            <AssetForm
              initial={editing}
              onSubmit={editing ? handleUpdate : handleCreate}
              onCancel={() => { setShowForm(false); setEditing(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}