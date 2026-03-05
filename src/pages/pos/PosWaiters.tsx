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
import { Waiter } from '@/types/database';
import { toast } from 'sonner';

const PosWaiters = () => {
  const user = useAuthStore((s) => s.user);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fullname, setFullname] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchWaiters = async () => {
    if (!user?.restaurant_id) return;
    const { data, error } = await supabase
      .from('waiters')
      .select('*')
      .eq('restaurant_id', user.restaurant_id)
      .order('fullname');
    if (error) {
      toast.error('Failed to load waiters');
      console.error(error);
    }
    setWaiters((data as Waiter[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchWaiters();
  }, [user?.restaurant_id]);

  const openCreate = () => {
    setEditingId(null);
    setFullname('');
    setFormOpen(true);
  };

  const openEdit = (w: Waiter) => {
    setEditingId(w.id);
    setFullname(w.fullname);
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!fullname.trim() || !user?.restaurant_id) {
      toast.error('Full name is required');
      return;
    }
    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from('waiters')
        .update({ fullname: fullname.trim() })
        .eq('id', editingId);
      if (error) {
        toast.error('Failed to update waiter');
      } else {
        toast.success('Waiter updated');
      }
    } else {
      const { error } = await supabase.from('waiters').insert({
        fullname: fullname.trim(),
        restaurant_id: user.restaurant_id,
      });
      if (error) {
        toast.error('Failed to create waiter');
      } else {
        toast.success('Waiter created');
      }
    }
    setSaving(false);
    setFormOpen(false);
    fetchWaiters();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('waiters').delete().eq('id', deleteId);
    if (error) {
      toast.error('Failed to delete waiter');
    } else {
      toast.success('Waiter deleted');
    }
    setDeleteId(null);
    fetchWaiters();
  };

  return (
    <div className="p-6 h-screen overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Waiters</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your restaurant's waiters</p>
        </div>
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
          <p className="text-muted-foreground">No waiters yet. Add your first waiter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {waiters.map((w) => (
            <div key={w.id} className="rounded-xl border bg-card p-4 flex flex-col items-center gap-3">
              <span className="text-sm font-semibold text-center">{w.fullname}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(w)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(w.id)}>
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
            <DialogTitle>{editingId ? 'Edit Waiter' : 'Add Waiter'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Full Name <span className="text-destructive">*</span></Label>
              <Input
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="e.g. Ahmed Khan"
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
            <AlertDialogTitle>Delete Waiter?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this waiter.</AlertDialogDescription>
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

export default PosWaiters;
