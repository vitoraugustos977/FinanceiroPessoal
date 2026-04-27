import { Component, inject, computed, effect, ViewChildren, QueryList } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { TransactionService } from '../../core/services/transaction.service';
import { CategoryService } from '../../core/services/category.service';
import { ObjectiveService } from '../../core/services/objective.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, RouterLink, MatCardModule, MatIconModule, MatProgressBarModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private objectiveService = inject(ObjectiveService);

  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;

  readonly balance = this.transactionService.balance;

  readonly currentMonthName = computed(() =>
    new Date().toLocaleDateString('pt-BR', { month: 'long' })
      .replace(/^\w/, (c) => c.toUpperCase())
  );

  readonly currentMonthReceitas = computed(() => {
    const now = new Date();
    return this.transactionService
      .getFiltered('receita', now.getFullYear(), now.getMonth() + 1)
      .reduce((s, t) => s + t.value, 0);
  });

  readonly currentMonthDespesas = computed(() => {
    const now = new Date();
    return this.transactionService
      .getFiltered('despesa', now.getFullYear(), now.getMonth() + 1)
      .reduce((s, t) => s + t.value, 0);
  });

  readonly currentMonthObjetivos = computed(() => {
    const now = new Date();
    return this.transactionService
      .getFiltered('objetivo', now.getFullYear(), now.getMonth() + 1)
      .reduce((s, t) => s + t.value, 0);
  });

  readonly barChartData = computed((): ChartData<'bar'> => {
    const monthly = this.transactionService.getMonthlyData(6);
    return {
      labels: monthly.map((m) => m.label),
      datasets: [
        {
          label: 'Receitas',
          data: monthly.map((m) => m.receitas),
          backgroundColor: '#8B8B4A',
          borderRadius: 6,
        },
        {
          label: 'Despesas',
          data: monthly.map((m) => m.despesas),
          backgroundColor: '#A31C2A',
          borderRadius: 6,
        },
        {
          label: 'Objetivos',
          data: monthly.map((m) => m.objetivos),
          backgroundColor: '#4A4820',
          borderRadius: 6,
        },
      ],
    };
  });

  readonly barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ` ${ctx.dataset.label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (v) =>
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(v)),
        },
      },
    },
  };

  readonly doughnutChartData = computed((): ChartData<'doughnut'> => {
    const expenses = this.transactionService.getCurrentMonthExpensesByCategory();
    const cats = this.categoryService.categories();

    const sorted = [...expenses].sort((a, b) => b.total - a.total);

    const total = sorted.reduce((s, e) => s + e.total, 0);
    const mainItems: typeof sorted = [];
    let othersTotal = 0;
    for (const e of sorted) {
      if (total > 0 && e.total / total < 0.03 && sorted.length > 5) {
        othersTotal += e.total;
      } else {
        mainItems.push(e);
      }
    }
    if (othersTotal > 0) mainItems.push({ categoryId: 'outros', total: othersTotal });

    return {
      labels: mainItems.map((e) => {
        if (e.categoryId === 'outros') return 'Outros';
        if (e.categoryId === 'sem-categoria') return 'Sem categoria';
        return cats.find((c) => c.id === e.categoryId)?.name ?? e.categoryId;
      }),
      datasets: [
        {
          data: mainItems.map((e) => e.total),
          backgroundColor: mainItems.map((e) => {
            if (e.categoryId === 'outros') return '#90A4AE';
            if (e.categoryId === 'sem-categoria') return '#BDBDBD';
            return cats.find((c) => c.id === e.categoryId)?.color ?? '#BDBDBD';
          }),
          hoverOffset: 8,
        },
      ],
    };
  });

  readonly doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = (ctx.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const val = ctx.parsed;
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0';
            return ` ${ctx.label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)} (${pct}%)`;
          },
        },
      },
    },
  };

  readonly hasDoughnutData = computed(() => {
    const data = this.doughnutChartData().datasets[0].data as number[];
    return data.some((v) => v > 0);
  });

  readonly receiptsDoughnutData = computed((): ChartData<'doughnut'> => {
    const receipts = this.transactionService.getCurrentMonthReceiptsByCategory();
    const cats = this.categoryService.categories();
    const sorted = [...receipts].sort((a, b) => b.total - a.total);
    const total = sorted.reduce((s, e) => s + e.total, 0);
    const mainItems: typeof sorted = [];
    let othersTotal = 0;
    for (const e of sorted) {
      if (total > 0 && e.total / total < 0.03 && sorted.length > 5) {
        othersTotal += e.total;
      } else {
        mainItems.push(e);
      }
    }
    if (othersTotal > 0) mainItems.push({ categoryId: 'outros', total: othersTotal });
    return {
      labels: mainItems.map((e) => {
        if (e.categoryId === 'outros') return 'Outros';
        if (e.categoryId === 'sem-categoria') return 'Sem categoria';
        return cats.find((c) => c.id === e.categoryId)?.name ?? e.categoryId;
      }),
      datasets: [{
        data: mainItems.map((e) => e.total),
        backgroundColor: mainItems.map((e) => {
          if (e.categoryId === 'outros') return '#90A4AE';
          if (e.categoryId === 'sem-categoria') return '#BDBDBD';
          return cats.find((c) => c.id === e.categoryId)?.color ?? '#BDBDBD';
        }),
        hoverOffset: 8,
      }],
    };
  });

  readonly hasReceiptsDoughnutData = computed(() => {
    const data = this.receiptsDoughnutData().datasets[0].data as number[];
    return data.some((v) => v > 0);
  });

  readonly balanceEvolutionData = computed((): ChartData<'line'> => {
    const evolution = this.transactionService.getBalanceEvolution(12);
    return {
      labels: evolution.map((e) => e.label),
      datasets: [{
        label: 'Saldo',
        data: evolution.map((e) => e.balance),
        borderColor: '#4A4820',
        backgroundColor: 'rgba(74,72,32,0.08)',
        pointBackgroundColor: evolution.map((e) => e.balance >= 0 ? '#4A4820' : '#A31C2A'),
        pointRadius: 4,
        fill: true,
        tension: 0.3,
      }],
    };
  });

  readonly balanceEvolutionOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ` Saldo: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (v) =>
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(v)),
        },
      },
    },
  };

  readonly lineChartData = computed((): ChartData<'line'> => {
    const monthly = this.transactionService.getMonthlyData(12);
    return {
      labels: monthly.map((m) => m.label),
      datasets: [
        {
          label: 'Receitas',
          data: monthly.map((m) => m.receitas),
          borderColor: '#8B8B4A',
          backgroundColor: 'rgba(139,139,74,0.1)',
          pointBackgroundColor: '#8B8B4A',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Despesas',
          data: monthly.map((m) => m.despesas),
          borderColor: '#A31C2A',
          backgroundColor: 'rgba(163,28,42,0.1)',
          pointBackgroundColor: '#A31C2A',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Objetivos',
          data: monthly.map((m) => m.objetivos),
          borderColor: '#4A4820',
          backgroundColor: 'rgba(74,72,32,0.1)',
          pointBackgroundColor: '#4A4820',
          fill: true,
          tension: 0.3,
        },
      ],
    };
  });

  readonly lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ` ${ctx.dataset.label}: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ctx.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (v) =>
            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(Number(v)),
        },
      },
    },
  };

  /** Retorna info de variação percentual entre dois valores. null = sem dados suficientes. */
  private calcVariation(
    current: number,
    previous: number,
    invertGood = false
  ): { pct: number; direction: 'up' | 'down' | 'flat'; isGood: boolean } | null {
    if (previous === 0 && current === 0) return null;
    const diff = current - previous;
    const direction: 'up' | 'down' | 'flat' =
      previous === 0 ? 'up' :
      diff / Math.abs(previous) > 0.005 ? 'up' :
      diff / Math.abs(previous) < -0.005 ? 'down' : 'flat';
    const pct = previous === 0 ? 100 : Math.abs((diff / Math.abs(previous)) * 100);
    const isGood = invertGood ? direction === 'down' : direction !== 'down';
    return { pct, direction, isGood };
  }

  readonly monthVariations = computed(() => {
    const now = new Date();
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevYear = prev.getFullYear();
    const prevMonth = prev.getMonth() + 1;
    const prevMonthName = prev.toLocaleDateString('pt-BR', { month: 'long' });

    const prevReceitas = this.transactionService
      .getFiltered('receita', prevYear, prevMonth)
      .reduce((s, t) => s + t.value, 0);
    const prevDespesas = this.transactionService
      .getFiltered('despesa', prevYear, prevMonth)
      .reduce((s, t) => s + t.value, 0);
    const prevObjetivos = this.transactionService
      .getFiltered('objetivo', prevYear, prevMonth)
      .reduce((s, t) => s + t.value, 0);

    const curReceitas = this.currentMonthReceitas();
    const curDespesas = this.currentMonthDespesas();
    const curObjetivos = this.currentMonthObjetivos();

    const curNet = curReceitas - curDespesas - curObjetivos;
    const prevNet = prevReceitas - prevDespesas - prevObjetivos;

    return {
      prevMonthName,
      receitas: this.calcVariation(curReceitas, prevReceitas),
      despesas: this.calcVariation(curDespesas, prevDespesas, true),
      objetivos: this.calcVariation(curObjetivos, prevObjetivos),
      balance: this.calcVariation(curNet, prevNet),
    };
  });

  readonly objectivesProgress = computed(() => {
    const objectives = this.objectiveService.objectives();
    const transactions = this.transactionService.transactions();
    return objectives.map((obj) => {
      const accumulated = transactions
        .filter((t) => t.type === 'objetivo' && t.objectiveId === obj.id)
        .reduce((s, t) => s + t.value, 0);
      const percentage = obj.targetValue > 0 ? Math.min((accumulated / obj.targetValue) * 100, 100) : 0;
      return { objective: obj, accumulated, percentage, isComplete: accumulated >= obj.targetValue };
    });
  });

  constructor() {
    // Forca o Chart.js a re-renderizar sempre que os dados dos signals mudarem
    effect(() => {
      this.barChartData();
      this.doughnutChartData();
      this.lineChartData();
      this.balanceEvolutionData();
      this.receiptsDoughnutData();
      this.charts?.forEach((c) => c.update());
    });
  }
}
