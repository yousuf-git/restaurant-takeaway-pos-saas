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
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { DineInTable } from '@/types/database';
import { toast } from 'sonner';

const PosTables = () => {
  const user = useAuthStore((s) => s.user);
  const [tables, setTables] = useState<DineInTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchTables = async () => {
    if (!user?.restaurant_id) return;
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .eq('restaurant_id', user.restaurant_id)
      .order('table_number');
    if (error) {
      toast.error('Failed to load tables');
      console.error(error);
    }
    setTables((data as DineInTable[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTables();
  }, [user?.restaurant_id]);

  const openCreate = () => {
    setEditingId(null);
    setTableNumber('');
    setFormOpen(true);
  };

  const openEdit = (t: DineInTable) => {
    setEditingId(t.id);
    setTableNumber(t.table_number);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!tableNumber.trim() || !user?.restaurant_id) {
      toast.error('Table number is required');
      return;
    }
    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from('tables')
        .update({ table_number: tableNumber.trim() })
        .eq('id', editingId);
      if (error) {
        toast.error(error.message.includes('duplicate') ? 'Table number already exists' : 'Failed to update table');
      } else {
        toast.success('Table updated');
      }
    } else {
      const { error } = await supabase.from('tables').insert({
        table_number: tableNumber.trim(),
        restaurant_id: user.restaurant_id,
      });
      if (error) {
        toast.error(error.message.includes('duplicate') ? 'Table number already exists' : 'Failed to create table');
      } else {
        toast.success('Table created');
      }
    }
    setSaving(false);
    setFormOpen(false);
    fetchTables();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('tables').delete().eq('id', deleteId);
    if (error) {
      toast.error('Failed to delete table');
    } else {
      toast.success('Table deleted');
    }
    setDeleteId(null);
    fetchTables();
  };

  return (
    <div className="p-6 h-screen overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Tables</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your restaurant's dining tables</p>
        </div>
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
          <p className="text-muted-foreground">No tables yet. Add your first table.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tables.map((t) => (
            <div key={t.id} className="rounded-xl border bg-card p-4 flex flex-col items-center gap-3">
              <span className="text-lg font-bold font-mono">{t.table_number}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(t)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(t.id)}>
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Table' : 'Add Table'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Table Number <span className="text-destructive">*</span></Label>
              <Input
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="e.g. T-1, A2, VIP-1"
                autoFocus
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Table?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this table.</AlertDialogDescription>
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

export default PosTables;
