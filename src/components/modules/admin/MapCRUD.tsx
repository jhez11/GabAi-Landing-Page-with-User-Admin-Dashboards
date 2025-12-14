import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { motion } from 'framer-motion';
import { useData } from '../../../contexts/DataContext';
export function MapCRUD() {
  const {
    mapLocations,
    addMapLocation,
    updateMapLocation,
    deleteMapLocation
  } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    latitude: '',
    longitude: '',
    description: ''
  });
  const filteredLocations = mapLocations.filter(loc => loc.name.toLowerCase().includes(searchTerm.toLowerCase()) || loc.type.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleAdd = () => {
    setEditingLocation(null);
    setFormData({
      name: '',
      type: '',
      latitude: '',
      longitude: '',
      description: ''
    });
    setIsModalOpen(true);
  };
  const handleEdit = (location: any) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      type: location.type,
      latitude: location.coords[0].toString(),
      longitude: location.coords[1].toString(),
      description: location.description || ''
    });
    setIsModalOpen(true);
  };
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this location?')) {
      deleteMapLocation(id);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locationData = {
      name: formData.name,
      type: formData.type,
      coords: [parseFloat(formData.latitude), parseFloat(formData.longitude)] as [number, number],
      description: formData.description
    };
    if (editingLocation) {
      updateMapLocation(editingLocation.id, locationData);
    } else {
      addMapLocation(locationData);
    }
    setIsModalOpen(false);
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Manage Map Markers
          </h2>
          <p className="text-sm text-muted-foreground">
            Update campus locations and coordinates.
          </p>
        </div>
        <Button onClick={handleAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Add Marker
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" /> Map Locations (
              {mapLocations.length})
            </CardTitle>
            <div className="w-full sm:w-72">
              <Input placeholder="Search locations..." icon={<Search className="h-4 w-4" />} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border-y sm:border sm:rounded-lg border-border">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Location Name
                      </th>
                      <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Type
                      </th>
                      <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Coordinates
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {filteredLocations.map((loc, index) => <motion.tr key={loc.id} initial={{
                    opacity: 0
                  }} animate={{
                    opacity: 1
                  }} transition={{
                    delay: index * 0.05
                  }} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <div className="font-medium text-sm">
                              {loc.name}
                            </div>
                            <div className="text-xs text-muted-foreground sm:hidden">
                              {loc.type}
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-4 py-4">
                          <span className="inline-flex items-center rounded-full bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary">
                            {loc.type}
                          </span>
                        </td>
                        <td className="hidden md:table-cell px-4 py-4 font-mono text-xs text-muted-foreground">
                          {loc.coords[0].toFixed(4)}, {loc.coords[1].toFixed(4)}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(loc)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(loc.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingLocation ? 'Edit Location' : 'Add Location'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Location Name" value={formData.name} onChange={e => setFormData({
          ...formData,
          name: e.target.value
        })} placeholder="e.g., Main Administration Building" required />
          <Input label="Type" value={formData.type} onChange={e => setFormData({
          ...formData,
          type: e.target.value
        })} placeholder="e.g., Admin, Academic, Student Services" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Latitude" type="number" step="any" value={formData.latitude} onChange={e => setFormData({
            ...formData,
            latitude: e.target.value
          })} placeholder="e.g., 9.0394" required />
            <Input label="Longitude" type="number" step="any" value={formData.longitude} onChange={e => setFormData({
            ...formData,
            longitude: e.target.value
          })} placeholder="e.g., 126.2161" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description (Optional)
            </label>
            <textarea value={formData.description} onChange={e => setFormData({
            ...formData,
            description: e.target.value
          })} placeholder="Brief description of the location..." className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {editingLocation ? 'Update Location' : 'Create Location'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>;
}