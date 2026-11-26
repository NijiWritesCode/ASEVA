import React from 'react';
import { useKobo } from '../../hooks/useKobo';
import { Card } from '../shared/Card';
import { DollarSign, PieChart, ShieldCheck } from 'lucide-react';

export function EventFinancialWidget({
  agreedPriceKobo = 0,
  totalPaidKobo = 0,
  balanceDueKobo = 0,
  totalExpensesKobo = 0,
}) {
  const { formatNaira } = useKobo();

  const agreedNum = Number(agreedPriceKobo) || 0;
  const paidNum = Number(totalPaidKobo) || 0;
  const balanceNum = Number(balanceDueKobo) || (agreedNum - paidNum);
  const expensesNum = Number(totalExpensesKobo) || 0;

  // Percentage of contract paid
  const paidPercent = agreedNum > 0 ? Math.min(100, Math.round((paidNum / agreedNum) * 100)) : 0;
  
  // Gross Profit Margin
  const grossProfitKobo = agreedNum - expensesNum;
  const grossMarginPercent = agreedNum > 0 ? Math.round((grossProfitKobo / agreedNum) * 100) : 0;

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-sand-200">
        <div>
          <h3 className="font-serif text-base font-bold text-obsidian-950">
            Event Fiscal Summary
          </h3>
          <p className="text-[11px] text-obsidian-500">
            Deterministic balance due in Nigerian Naira (NGN kobo)
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-sand-200 text-obsidian-700">
          NGN Standard
        </span>
      </div>

      {/* Progress Bar of Collected Cash */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-obsidian-600">Payment Inflow Progress</span>
          <span className="text-emerald-700 font-bold">{paidPercent}% Collected</span>
        </div>
        <div className="w-full h-2.5 bg-sand-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-500"
            style={{ width: `${paidPercent}%` }}
          />
        </div>
      </div>

      {/* Figures Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        <div>
          <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">
            Agreed Fee
          </span>
          <p className="font-serif text-sm font-bold text-obsidian-950 mt-0.5 font-mono">
            {formatNaira(agreedNum, false)}
          </p>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">
            Cash Received
          </span>
          <p className="font-serif text-sm font-bold text-emerald-700 mt-0.5 font-mono">
            {formatNaira(paidNum, false)}
          </p>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">
            Balance Due
          </span>
          <p className="font-serif text-sm font-bold text-amber-800 mt-0.5 font-mono">
            {formatNaira(balanceNum, false)}
          </p>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">
            Gross Margin
          </span>
          <p className="font-serif text-sm font-bold text-obsidian-950 mt-0.5 font-mono">
            {grossMarginPercent}%
          </p>
        </div>
      </div>
    </Card>
  );
}
