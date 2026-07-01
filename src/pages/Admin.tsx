import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3,
  Settings, Plus, Search, Edit, Trash2, TrendingUp, DollarSign,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { useStore } from '@/store';
import { products as allProducts } from '@/data/products';
import { formatPrice } from '@/lib/utils';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'customers' | 'analytics' | 'settings';

export default function Admin() {
  const { orders } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setShowAddModal] = useState(false);

  // Analytics data
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const totalOrders = orders.length;
  const totalProducts = allProducts.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'products' as AdminTab, label: 'Products', icon: <Package size={18} /> },
    { id: 'orders' as AdminTab, label: 'Orders', icon: <ShoppingCart size={18} /> },
    { id: 'customers' as AdminTab, label: 'Customers', icon: <Users size={18} /> },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'settings' as AdminTab, label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <main className="min-h-screen bg-raius-bg pt-20 md:pt-6">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-raius-elevated border-r border-raius-glass-border flex-shrink-0">
          <div className="p-6">
            <Link to="/" className="text-micro tracking-[0.2em] text-raius-text">RAIUS</Link>
            <p className="text-xs text-raius-text-tertiary mt-1">Admin Panel</p>
          </div>
          <nav className="px-3 pb-6 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${
                  activeTab === tab.id ? 'bg-raius-warm/10 text-raius-warm' : 'text-raius-text-secondary hover:text-raius-text hover:bg-raius-hover'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="font-display text-3xl text-raius-text mb-8">Dashboard</h1>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Revenue" value={formatPrice(totalRevenue)} icon={<DollarSign size={20} />} trend="up" />
                <StatCard title="Total Orders" value={String(totalOrders)} icon={<ShoppingCart size={20} />} trend="up" />
                <StatCard title="Products" value={String(totalProducts)} icon={<Package size={20} />} trend="neutral" />
                <StatCard title="Avg. Order" value={formatPrice(avgOrderValue)} icon={<TrendingUp size={20} />} trend="up" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-raius-elevated p-6">
                  <h3 className="text-micro text-raius-text mb-4">RECENT ORDERS</h3>
                  {orders.length === 0 ? (
                    <p className="text-sm text-raius-text-secondary">No orders yet</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between py-2 border-b border-raius-glass-border last:border-0">
                          <div>
                            <p className="text-sm text-raius-text">{order.id}</p>
                            <p className="text-xs text-raius-text-tertiary">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <span className="text-sm text-raius-text">{formatPrice(order.total)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-raius-elevated p-6">
                  <h3 className="text-micro text-raius-text mb-4">TOP PRODUCTS</h3>
                  <div className="space-y-3">
                    {allProducts.slice(0, 5).map((product, i) => (
                      <div key={product.id} className="flex items-center gap-3 py-2 border-b border-raius-glass-border last:border-0">
                        <span className="text-xs text-raius-text-tertiary w-4">{i + 1}</span>
                        <div className="w-8 h-10 bg-raius-hover flex-shrink-0 overflow-hidden">
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-raius-text truncate">{product.name}</p>
                        </div>
                        <span className="text-sm text-raius-text">{formatPrice(product.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-3xl text-raius-text">Products</h1>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-raius-warm text-raius-bg text-micro px-4 py-2.5 hover:brightness-110 transition-all"
                >
                  <Plus size={16} />
                  ADD PRODUCT
                </button>
              </div>

              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-raius-text-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-raius-elevated border border-raius-glass-border text-raius-text placeholder:text-raius-text-tertiary pl-10 pr-4 py-2.5 outline-none focus:border-raius-warm"
                />
              </div>

              <div className="bg-raius-elevated overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-raius-glass-border">
                        <th className="text-left text-micro text-raius-text-tertiary p-4">PRODUCT</th>
                        <th className="text-left text-micro text-raius-text-tertiary p-4">CATEGORY</th>
                        <th className="text-left text-micro text-raius-text-tertiary p-4">PRICE</th>
                        <th className="text-left text-micro text-raius-text-tertiary p-4">STATUS</th>
                        <th className="text-right text-micro text-raius-text-tertiary p-4">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="border-b border-raius-glass-border last:border-0 hover:bg-raius-hover/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 bg-raius-hover flex-shrink-0 overflow-hidden">
                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                              </div>
                              <span className="text-sm text-raius-text">{product.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-raius-text-secondary">{product.category}</td>
                          <td className="p-4 text-sm text-raius-text">{formatPrice(product.price)}</td>
                          <td className="p-4">
                            <span className={`text-micro px-2 py-1 ${product.isNew ? 'bg-raius-navy text-raius-text' : 'bg-raius-hover text-raius-text-secondary'}`}>
                              {product.isNew ? 'NEW' : 'ACTIVE'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1.5 text-raius-text-secondary hover:text-raius-warm transition-colors">
                                <Edit size={14} />
                              </button>
                              <button className="p-1.5 text-raius-text-secondary hover:text-raius-burgundy transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === 'orders' && (
            <div>
              <h1 className="font-display text-3xl text-raius-text mb-6">Orders</h1>
              {orders.length === 0 ? (
                <div className="bg-raius-elevated p-12 text-center">
                  <p className="text-raius-text-secondary">No orders yet</p>
                </div>
              ) : (
                <div className="bg-raius-elevated overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-raius-glass-border">
                        <th className="text-left text-micro text-raius-text-tertiary p-4">ORDER</th>
                        <th className="text-left text-micro text-raius-text-tertiary p-4">DATE</th>
                        <th className="text-left text-micro text-raius-text-tertiary p-4">ITEMS</th>
                        <th className="text-left text-micro text-raius-text-tertiary p-4">STATUS</th>
                        <th className="text-right text-micro text-raius-text-tertiary p-4">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-raius-glass-border last:border-0 hover:bg-raius-hover/50">
                          <td className="p-4 text-sm text-raius-text">{order.id}</td>
                          <td className="p-4 text-sm text-raius-text-secondary">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="p-4 text-sm text-raius-text-secondary">{order.items.length} items</td>
                          <td className="p-4">
                            <span className="text-micro px-2 py-1 bg-raius-warm/10 text-raius-warm">{order.status}</span>
                          </td>
                          <td className="p-4 text-sm text-raius-text text-right">{formatPrice(order.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Customers */}
          {activeTab === 'customers' && (
            <div>
              <h1 className="font-display text-3xl text-raius-text mb-6">Customers</h1>
              <div className="bg-raius-elevated p-12 text-center">
                <Users size={40} className="text-raius-text-tertiary mx-auto mb-4" />
                <p className="text-raius-text-secondary">Customer management coming soon</p>
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeTab === 'analytics' && (
            <div>
              <h1 className="font-display text-3xl text-raius-text mb-6">Analytics</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-raius-elevated p-6">
                  <h3 className="text-micro text-raius-text mb-4">SALES OVERVIEW</h3>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-raius-warm/30 hover:bg-raius-warm/50 transition-colors" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
                      <span key={m} className="text-[10px] text-raius-text-tertiary flex-1 text-center">{m}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-raius-elevated p-6">
                  <h3 className="text-micro text-raius-text mb-4">CATEGORY BREAKDOWN</h3>
                  <div className="space-y-4">
                    {['Hoodies', 'T-Shirts', 'Jackets', 'Pants', 'Accessories'].map((cat, i) => (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-raius-text">{cat}</span>
                          <span className="text-raius-text-secondary">{[35, 25, 20, 12, 8][i]}%</span>
                        </div>
                        <div className="h-2 bg-raius-hover rounded-full overflow-hidden">
                          <div className="h-full bg-raius-warm/50 rounded-full" style={{ width: `${[35, 25, 20, 12, 8][i]}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div>
              <h1 className="font-display text-3xl text-raius-text mb-6">Settings</h1>
              <div className="bg-raius-elevated p-6 max-w-lg space-y-6">
                <div>
                  <label className="text-micro text-raius-text block mb-2">STORE NAME</label>
                  <input type="text" defaultValue="RAIUS" className="w-full bg-raius-bg border border-raius-glass-border text-raius-text px-4 py-2.5 outline-none focus:border-raius-warm" />
                </div>
                <div>
                  <label className="text-micro text-raius-text block mb-2">CURRENCY</label>
                  <select className="w-full bg-raius-bg border border-raius-glass-border text-raius-text px-4 py-2.5 outline-none focus:border-raius-warm">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>AUD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="text-micro text-raius-text block mb-2">SHIPPING FROM</label>
                  <input type="text" defaultValue="United Kingdom" className="w-full bg-raius-bg border border-raius-glass-border text-raius-text px-4 py-2.5 outline-none focus:border-raius-warm" />
                </div>
                <button className="bg-raius-warm text-raius-bg text-micro px-6 py-2.5 hover:brightness-110 transition-all">
                  SAVE CHANGES
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, icon, trend }: { title: string; value: string; icon: React.ReactNode; trend: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="bg-raius-elevated p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-raius-warm">{icon}</span>
        {trend === 'up' && <ArrowUpRight size={16} className="text-green-500" />}
        {trend === 'down' && <ArrowDownRight size={16} className="text-red-500" />}
      </div>
      <p className="text-2xl font-display text-raius-text">{value}</p>
      <p className="text-micro text-raius-text-tertiary mt-1">{title}</p>
    </div>
  );
}
