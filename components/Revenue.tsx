import React from 'react';
import { CreditCard, Wallet, ArrowUpRight, ArrowDownLeft, Download, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { name: 'Week 1', amount: 12000 },
  { name: 'Week 2', amount: 18000 },
  { name: 'Week 3', amount: 15000 },
  { name: 'Week 4', amount: 24500 },
];

const transactions = [
  { id: '#INV-001', user: 'Rahul Sharma', plan: 'Elite Membership (Yearly)', amount: '₹14,999', date: 'Oct 24, 2023', status: 'Success' },
  { id: '#INV-002', user: 'Amit Verma', plan: 'Options Course', amount: '₹4,999', date: 'Oct 23, 2023', status: 'Success' },
  { id: '#INV-003', user: 'Priya Singh', plan: 'Pro Membership', amount: '₹2,999', date: 'Oct 23, 2023', status: 'Failed' },
  { id: '#INV-004', user: 'Vikram Malhotra', plan: 'Elite Membership', amount: '₹14,999', date: 'Oct 22, 2023', status: 'Success' },
  { id: '#INV-005', user: 'Neha Gupta', plan: 'Swing Trading Course', amount: '₹2,999', date: 'Oct 21, 2023', status: 'Success' },
];

const Revenue: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-white">Revenue & Billing</h2>
           <p className="text-slate-400 text-sm">Manage your earnings, payouts, and invoices.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-700 transition-colors text-sm">
          <Download size={16} /> Download Tax Report
        </button>
      </div>

      {/* Main Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 border border-indigo-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
           <p className="text-indigo-200 text-sm font-medium mb-1">Total Balance</p>
           <h3 className="text-3xl font-bold text-white mb-4">₹1,24,500.00</h3>
           <div className="flex gap-3">
              <button className="flex-1 bg-white text-indigo-900 font-bold py-2 rounded-lg text-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                 <ArrowUpRight size={16} /> Withdraw
              </button>
              <button className="flex-1 bg-indigo-800/50 text-white font-medium py-2 rounded-lg text-sm hover:bg-indigo-800 transition-colors border border-indigo-700">
                 Payout History
              </button>
           </div>
        </div>

        <div className="md:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Revenue Growth</h3>
              <select className="bg-slate-900 border border-slate-600 text-xs text-slate-300 rounded p-1.5 outline-none">
                 <option>This Month</option>
                 <option>Last 3 Months</option>
              </select>
           </div>
           <div className="h-[120px]">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={revenueData}>
                 <defs>
                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                 <XAxis dataKey="name" hide />
                 <YAxis hide />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                 />
                 <Area type="monotone" dataKey="amount" stroke="#818cf8" strokeWidth={3} fill="url(#colorRev)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
         <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Wallet size={18} className="text-slate-400" /> Recent Transactions
            </h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-slate-900/50 text-slate-400 font-medium border-b border-slate-700">
                  <tr>
                     <th className="px-6 py-3">Invoice ID</th>
                     <th className="px-6 py-3">User</th>
                     <th className="px-6 py-3">Plan / Item</th>
                     <th className="px-6 py-3">Date</th>
                     <th className="px-6 py-3">Amount</th>
                     <th className="px-6 py-3">Status</th>
                     <th className="px-6 py-3"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-700">
                  {transactions.map((tx, i) => (
                     <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-3 font-mono text-slate-300">{tx.id}</td>
                        <td className="px-6 py-3 text-white font-medium">{tx.user}</td>
                        <td className="px-6 py-3 text-slate-300">{tx.plan}</td>
                        <td className="px-6 py-3 text-slate-400 text-xs">{tx.date}</td>
                        <td className="px-6 py-3 font-bold text-white">{tx.amount}</td>
                        <td className="px-6 py-3">
                           <span className={`text-xs px-2 py-0.5 rounded font-medium border ${
                              tx.status === 'Success' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                           }`}>
                              {tx.status}
                           </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                           <button className="text-slate-500 hover:text-white transition-colors">
                              <FileText size={16} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Revenue;