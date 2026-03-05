import { useState, useEffect, useCallback } from 'react';
import { Loader2, Search, Package, Calendar, ChevronsUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/integrations/supabase/client';
import { ItemWithVariants } from '@/types/database';

function toInputDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface VariantStat {
  label: string;
  quantity: number;
  revenue: number;
}

interface ItemStatResult {
  orderCount: number;
  totalQuantity: number;
  totalRevenue: number;
  variants: VariantStat[];
  hasMultipleVariants: boolean;
}

const PosItemStats = () => {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<ItemWithVariants[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [dateFrom, setDateFrom] = useState(() => toInputDate(new Date()));
  const [dateTo, setDateTo] = useState(() => toInputDate(new Date()));
  const [stats, setStats] = useState<ItemStatResult | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [searched, setSearched] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);

  // Fetch items for dropdown
  useEffect(() => {
    if (!user?.restaurant_id) return;
    const fetchItems = async () => {
      const { data } = await supabase
        .from('items')
        .select('*, item_variants(*)')
        .eq('restaurant_id', user.restaurant_id!)
        .order('sort_order')
        .order('name');
      setItems((data as ItemWithVariants[]) || []);
      setLoadingItems(false);
    };
    fetchItems();
  }, [user?.restaurant_id]);

  const selectedItem = items.find((i) => String(i.id) === selectedItemId);

  const fetchStats = useCallback(async () => {
    if (!user?.restaurant_id || !selectedItemId) return;

    setLoadingStats(true);
    setSearched(true);

    const from = new Date(dateFrom);
    from.setHours(0, 0, 0, 0);
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);

    // Get all confirmed orders in the date range
    const { data: orders, error } = await supabase
      .from('orders')
      .select('id, total_amount, order_items(*)')
      .eq('restaurant_id', user.restaurant_id!)
      .eq('status', 'confirmed')
      .gte('created_at', from.toISOString())
      .lte('created_at', to.toISOString());

    if (error) {
      console.error(error);
      setStats(null);
      setLoadingStats(false);
      return;
    }

    const itemName = selectedItem?.name || '';
    // Supabase returns the relation key as 'item_variants' (table name), not 'variants'
    const itemVariants = (selectedItem as any)?.item_variants || selectedItem?.variants || [];
    const hasMultipleVariants = itemVariants.filter((v: any) => v.label !== 'Default').length > 0;

    // Find orders containing this item and compute stats
    let orderCount = 0;
    let totalQuantity = 0;
    let totalRevenue = 0;
    const variantMap: Record<string, VariantStat> = {};

    (orders || []).forEach((order: any) => {
      const matchingItems = (order.order_items || []).filter(
        (oi: any) => oi.item_name === itemName
      );
      if (matchingItems.length > 0) {
        orderCount++;
        matchingItems.forEach((oi: any) => {
          totalQuantity += oi.quantity;
          totalRevenue += Number(oi.subtotal);

          if (hasMultipleVariants) {
            const label = oi.variant_label || 'Default';
            if (!variantMap[label]) {
              variantMap[label] = { label, quantity: 0, revenue: 0 };
            }
            variantMap[label].quantity += oi.quantity;
            variantMap[label].revenue += Number(oi.subtotal);
          }
        });
      }
    });

    const variants = Object.values(variantMap).sort((a, b) => b.revenue - a.revenue);

    setStats({ orderCount, totalQuantity, totalRevenue, variants, hasMultipleVariants });
    setLoadingStats(false);
  }, [user?.restaurant_id, selectedItemId, dateFrom, dateTo, selectedItem?.name]);

  return (
    <div className="p-6 h-screen overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Item Stats</h1>
        <p className="text-sm text-muted-foreground mt-1">
          See how many orders include a specific item and the revenue it generated.
        </p>
      </div>

      {/* Controls */}
      <div className="rounded-xl border bg-card shadow-sm p-5 mb-6 space-y-4">
        {/* Item selector (searchable) */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">Select Item</label>
          {loadingItems ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading items...
            </div>
          ) : (
            <Popover open={comboOpen} onOpenChange={setComboOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboOpen}
                  className="w-full sm:w-80 justify-between font-normal"
                >
                  {selectedItem ? selectedItem.name : 'Search items...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full sm:w-80 p-0" align="start">
                <Command>
                  <CommandInput placeholder="Type to search..." />
                  <CommandList>
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandGroup>
                      {items.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.name}
                          onSelect={() => {
                            setSelectedItemId(String(item.id));
                            setComboOpen(false);
                          }}
                        >
                          <Check className={cn('mr-2 h-4 w-4', selectedItemId === String(item.id) ? 'opacity-100' : 'opacity-0')} />
                          {item.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Date range */}
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="text-sm font-medium mb-1.5 block">From</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-40 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">To</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-40 text-sm"
            />
          </div>
          <Button
            onClick={fetchStats}
            disabled={!selectedItemId || loadingStats}
          >
            {loadingStats ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}
            Get Stats
          </Button>
        </div>
      </div>

      {/* Results */}
      {loadingStats ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : stats && searched ? (
        <div className="space-y-4">
          {/* Item name header */}
          <div className="rounded-xl border bg-card shadow-sm px-5 py-4">
            <p className="text-xs text-muted-foreground mb-1">Item</p>
            <p className="text-xl font-bold">{selectedItem?.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {dateFrom === dateTo
                ? `On ${new Date(dateFrom).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}`
                : `${new Date(dateFrom).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })} — ${new Date(dateTo).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}`
              }
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border bg-card shadow-sm px-5 py-4">
              <p className="text-xs text-muted-foreground mb-1">Orders Containing Item</p>
              <p className="text-3xl font-bold text-primary">{stats.orderCount}</p>
            </div>
            <div className="rounded-xl border bg-card shadow-sm px-5 py-4">
              <p className="text-xs text-muted-foreground mb-1">Total Quantity Sold</p>
              <p className="text-3xl font-bold">{stats.totalQuantity}</p>
            </div>
            <div className="rounded-xl border bg-card shadow-sm px-5 py-4">
              <p className="text-xs text-muted-foreground mb-1">Revenue from Item</p>
              <p className="text-3xl font-bold text-green-600">Rs {stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>

          {/* Variant breakdown */}
          {stats.hasMultipleVariants && stats.variants.length > 0 && (
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b bg-muted/30">
                <h2 className="font-semibold text-sm">Variant Breakdown</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b">
                      <th className="text-left py-2.5 px-5 font-medium">Variant</th>
                      <th className="text-center py-2.5 px-4 font-medium">Qty Sold</th>
                      <th className="text-right py-2.5 px-5 font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.variants.map((v) => (
                      <tr key={v.label} className="border-b last:border-0">
                        <td className="py-2.5 px-5 font-medium">{v.label}</td>
                        <td className="py-2.5 px-4 text-center">{v.quantity}</td>
                        <td className="py-2.5 px-5 text-right font-mono font-medium">Rs {v.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t font-semibold bg-muted/20">
                      <td className="py-2.5 px-5">Total</td>
                      <td className="py-2.5 px-4 text-center">{stats.totalQuantity}</td>
                      <td className="py-2.5 px-5 text-right font-mono">Rs {stats.totalRevenue.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {stats.orderCount === 0 && (
            <div className="text-center py-8 rounded-xl border bg-card">
              <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No orders found for this item in the selected date range</p>
            </div>
          )}
        </div>
      ) : searched ? (
        <div className="text-center py-20 rounded-xl border bg-card">
          <Package className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No data found</p>
        </div>
      ) : (
        <div className="text-center py-20 rounded-xl border bg-card">
          <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Select an item and date range, then click "Get Stats"</p>
        </div>
      )}
    </div>
  );
};

export default PosItemStats;
