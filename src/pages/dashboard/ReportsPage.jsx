import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  PieChart as PieIcon, 
  Users, 
  DollarSign, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { dashboardService } from '../../services/dashboardService';
import { useKobo } from '../../hooks/useKobo';

export function ReportsPage() {
  const { formatNaira } = useKobo();

  const { data: reports, isLoading } = useQuery({
    queryKey: ['dashboard', 'reports'],
    queryFn: () => dashboardService.getReportsData(),
  });

  const handleExportCSV = () => {
    if (!reports) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Month,Cash Inflow (NGN Millions),Disbursements (NGN Millions),Retained Gross Margin (NGN Millions)\n';
    reports.monthlyData.forEach((row) => {
      csvContent += `${row.month},${row.revenue},${row.expenses},${row.margin}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ASEVA_Financial_Audit_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !reports) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="title" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton variant="card" count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian-950">
            Executive Performance & Margin Reports
          </h1>
          <p className="text-xs text-obsidian-600 mt-1">
            Audited financial inflows, monthly disbursement trends, enquiry conversion ratios, and retained operating margins.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-1.5" />
          <span>Export Audit CSV</span>
        </Button>
      </div>

      {/* Top 4 Performance High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-obsidian-500 font-semibold block">
            Average Gross Margin
          </span>
          <p className="font-mono text-2xl font-bold text-emerald-800">
            48.2%
          </p>
          <span className="text-[11px] text-emerald-600 font-light">
            Across luxury commissions
          </span>
        </div>

        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-obsidian-500 font-semibold block">
            Lead Conversion Rate
          </span>
          <p className="font-mono text-2xl font-bold text-obsidian-950">
            37.5%
          </p>
          <span className="text-[11px] text-obsidian-500 font-light">
            Inquiries to signed contracts
          </span>
        </div>

        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-obsidian-500 font-semibold block">
            Average Event Size
          </span>
          <p className="font-mono text-2xl font-bold text-gold-700">
            450 Guests
          </p>
          <span className="text-[11px] text-obsidian-500 font-light">
            High-capacity banquets
          </span>
        </div>

        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-obsidian-500 font-semibold block">
            Repeat Client Commissions
          </span>
          <p className="font-mono text-2xl font-bold text-obsidian-950">
            62%
          </p>
          <span className="text-[11px] text-obsidian-500 font-light">
            Patron retention index
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart 1: Monthly Cash Inflow vs Disbursements */}
        <div className="lg:col-span-8 bg-white border border-sand-300 p-6 rounded-sm shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-sand-200 pb-3">
            <div>
              <h2 className="font-serif text-base font-bold text-obsidian-950">
                Monthly Cash Inflow vs. Operating Disbursements
              </h2>
              <p className="text-xs text-obsidian-500">Values in Millions of Nigerian Naira (₦M)</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center text-gold-700 font-medium">
                <span className="w-2.5 h-2.5 bg-gold-500 rounded-sm mr-1.5" />
                Inflow
              </span>
              <span className="flex items-center text-obsidian-600 font-medium">
                <span className="w-2.5 h-2.5 bg-obsidian-800 rounded-sm mr-1.5" />
                Expenses
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reports.monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `₦${val}M`} />
                <Tooltip
                  formatter={(value, name) => [
                    `₦${value}M`,
                    name === 'revenue' ? 'Cash Inflow' : 'Disbursements',
                  ]}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#F8FAFC', borderRadius: '4px', fontSize: '11px' }}
                />
                <Bar dataKey="revenue" fill="#D4AF37" radius={[2, 2, 0, 0]} name="revenue" />
                <Bar dataKey="expenses" fill="#1E293B" radius={[2, 2, 0, 0]} name="expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Category Revenue Share Donut */}
        <div className="lg:col-span-4 bg-white border border-sand-300 p-6 rounded-sm shadow-sm space-y-4">
          <div className="border-b border-sand-200 pb-3">
            <h2 className="font-serif text-base font-bold text-obsidian-950">
              Contract Revenue by Category
            </h2>
            <p className="text-xs text-obsidian-500">Proportional value of booked projects</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reports.categoryShare}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {reports.categoryShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`₦${value}M Booked`, 'Volume']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#F8FAFC', borderRadius: '4px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-sand-200">
            {reports.categoryShare.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center text-obsidian-700">
                  <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-bold text-obsidian-900">₦{item.value}M</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enquiry Conversion Funnel */}
      <div className="bg-white border border-sand-300 p-6 rounded-sm shadow-sm space-y-4">
        <h2 className="font-serif text-base font-bold text-obsidian-950 border-b border-sand-200 pb-3">
          Customer Acquisition & Qualification Funnel
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          {reports.funnel.map((step, idx) => (
            <div key={idx} className="bg-sand-50 p-4 rounded-sm border border-sand-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gold-700 tracking-wider">
                Stage 0{idx + 1}
              </span>
              <p className="font-serif text-xl font-bold text-obsidian-950">
                {step.count}
              </p>
              <p className="text-xs text-obsidian-600 font-light">
                {step.stage}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
