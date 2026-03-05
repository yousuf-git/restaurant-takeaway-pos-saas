import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { DineInTable, Restaurant } from '@/types/database';
import { toast } from 'sonner';

const emptyForm = {
  table_number: '',
  restaurant_id: '' as string,
};

const TableList = () => {
  const [tables, setTables] = useState<(DineInTable & { restaurant_name?: string })[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchData = async () => {
    const [tablesRes, restRes] = await Promise.all([
      supabase.from('tables').select('*').order('restaurant_id').order('table_number'),
      supabase.from('restaurants').select('*').order('name'),
    ]);
    const restaurantList = (restRes.data as Restaurant[]) || [];
    setRestaurants(restaurantList);
    const restMap = Object.fromEntries(restaurantList.map((r) => [r.id, r.name]));
    setTables(
      ((tablesRes.data as DineInTable[]) || []).map((t) => ({
        ...t,
        restaurant_name: restMap[t.restaurant_id],
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (t: DineInTable) => {
    setEditingId(t.id);
    setForm({
      table_number: t.table_number,
      restaurant_id: String(t.restaurant_id),
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.table_number.trim()) {
      toast.error('Table number is required');
      return;
    }
    if (!form.restaurant_id) {
      toast.error('Restaurant is required');
      return;
    }

    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from('tables')
        .update({
          table_number: form.table_number.trim(),
          restaurant_id: Number(form.restaurant_id),
        })
        .eq('id', editingId);
      if (error) {
        toast.error('Failed to update table');
        console.error(error);
      } else {
        toast.success('Table updated');
      }
    } else {
      const { error } = await supabase.from('tables').insert({
        table_number: form.table_number.trim(),
        restaurant_id: Number(form.restaurant_id),
      });
      if (error) {
        toast.error(error.message.includes('duplicate') ? 'Table number already exists for this restaurant' : 'Failed to create table');
        console.error(error);
      } else {
        toast.success('Table created');
      }
    }

    setSaving(false);
    setFormOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('tables').delete().eq('id', deleteId);
    if (error) {
      toast.error('Failed to delete table');
      console.error(error);
    } else {
      toast.success('Table deleted');
    }
    setDeleteId(null);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tables</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : tables.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">No tables found. Add your first table.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Number</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium font-mono">{t.table_number}</TableCell>
                  <TableCell className="text-muted-foreground">{t.restaurant_name || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(t.id)}>
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Table' : 'Add Table'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Restaurant <span className="text-destructive">*</span></Label>
              <Select value={form.restaurant_id} onValueChange={(v) => setForm((f) => ({ ...f, restaurant_id: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Table Number <span className="text-destructive">*</span></Label>
              <Input
                value={form.table_number}
                onChange={(e) => setForm((f) => ({ ...f, table_number: e.target.value }))}
                placeholder="e.g. T-1, A2, VIP-1"
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? 'Update Table' : 'Create Table'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Table?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this table. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TableList;
