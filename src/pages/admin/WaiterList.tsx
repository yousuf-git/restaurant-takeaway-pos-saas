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
import { Waiter, Restaurant } from '@/types/database';
import { toast } from 'sonner';

const emptyForm = {
  fullname: '',
  restaurant_id: '' as string,
};

const WaiterList = () => {
  const [waiters, setWaiters] = useState<(Waiter & { restaurant_name?: string })[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchData = async () => {
    const [waitersRes, restRes] = await Promise.all([
      supabase.from('waiters').select('*').order('restaurant_id').order('fullname'),
      supabase.from('restaurants').select('*').order('name'),
    ]);
    const restaurantList = (restRes.data as Restaurant[]) || [];
    setRestaurants(restaurantList);
    const restMap = Object.fromEntries(restaurantList.map((r) => [r.id, r.name]));
    setWaiters(
      ((waitersRes.data as Waiter[]) || []).map((w) => ({
        ...w,
        restaurant_name: restMap[w.restaurant_id],
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

  const openEdit = (w: Waiter) => {
    setEditingId(w.id);
    setForm({
      fullname: w.fullname,
      restaurant_id: String(w.restaurant_id),
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.fullname.trim()) {
      toast.error('Full name is required');
      return;
    }
    if (!form.restaurant_id) {
      toast.error('Restaurant is required');
      return;
    }

    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from('waiters')
        .update({
          fullname: form.fullname.trim(),
          restaurant_id: Number(form.restaurant_id),
        })
        .eq('id', editingId);
      if (error) {
        toast.error('Failed to update waiter');
        console.error(error);
      } else {
        toast.success('Waiter updated');
      }
    } else {
      const { error } = await supabase.from('waiters').insert({
        fullname: form.fullname.trim(),
        restaurant_id: Number(form.restaurant_id),
      });
      if (error) {
        toast.error('Failed to create waiter');
        console.error(error);
      } else {
        toast.success('Waiter created');
      }
    }

    setSaving(false);
    setFormOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('waiters').delete().eq('id', deleteId);
    if (error) {
      toast.error('Failed to delete waiter');
      console.error(error);
    } else {
      toast.success('Waiter deleted');
    }
    setDeleteId(null);
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Waiters</h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Waiter
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : waiters.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground">No waiters found. Add your first waiter.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Restaurant</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waiters.map((w) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.fullname}</TableCell>
                  <TableCell className="text-muted-foreground">{w.restaurant_name || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(w)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteId(w.id)}>
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
            <DialogTitle>{editingId ? 'Edit Waiter' : 'Add Waiter'}</DialogTitle>
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
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input
                value={form.fullname}
                onChange={(e) => setForm((f) => ({ ...f, fullname: e.target.value }))}
                placeholder="e.g. Ahmed Khan"
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? 'Update Waiter' : 'Create Waiter'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Waiter?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this waiter. This action cannot be undone.
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

export default WaiterList;
