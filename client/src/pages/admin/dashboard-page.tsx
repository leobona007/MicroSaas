import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sidebar } from "@/components/layout/sidebar";
import { useState } from "react";
import { format, subDays, subMonths, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Appointment, Transaction } from "@shared/schema";
import { Users, Scissors, DollarSign, Calendar } from "lucide-react";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("week");
  
  // Calculate date ranges
  const today = new Date();
  const startDate = dateRange === 'week' 
    ? startOfWeek(today, { weekStartsOn: 1 }) 
    : dateRange === 'month' 
      ? subDays(today, 30) 
      : subMonths(today, 12);
  
  // Fetch appointments
  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });
  
  // Fetch transactions
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
  
  // Calculate metrics
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === "completed").length;
  const completionRate = totalAppointments ? (completedAppointments / totalAppointments * 100).toFixed(0) : "0";
  
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netProfit = totalIncome - totalExpenses;
  
  // Prepare chart data
  // Daily appointments data
  const daysInRange = eachDayOfInterval({ start: startDate, end: today });
  const appointmentsByDay = daysInRange.map(day => {
    const count = appointments.filter(a => {
      const appDate = new Date(a.date);
      return format(appDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    }).length;
    
    return {
      day: format(day, 'dd/MM'),
      appointments: count
    };
  });
  
  // Service distribution data
  const serviceMap = new Map<number, { name: string; count: number }>();
  appointments.forEach(appointment => {
    const serviceId = appointment.serviceId;
    if (serviceMap.has(serviceId)) {
      const service = serviceMap.get(serviceId)!;
      serviceMap.set(serviceId, { ...service, count: service.count + 1 });
    } else {
      // Since we don't have service details in this query, use a placeholder
      serviceMap.set(serviceId, { name: `Serviço ${serviceId}`, count: 1 });
    }
  });
  
  const serviceData = Array.from(serviceMap.values());
  
  // Financial data for the selected period
  const financialData = daysInRange.map(day => {
    const dayTransactions = transactions.filter(t => {
      const txDate = new Date(t.date);
      return format(txDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
    
    const income = dayTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = dayTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      day: format(day, 'dd/MM'),
      income,
      expenses
    };
  });
  
  // Status distribution
  const statusCounts = {
    scheduled: appointments.filter(a => a.status === "scheduled").length,
    completed: appointments.filter(a => a.status === "completed").length,
    cancelled: appointments.filter(a => a.status === "cancelled").length,
    noShow: appointments.filter(a => a.status === "no-show").length,
  };
  
  const statusData = [
    { name: "Agendado", value: statusCounts.scheduled },
    { name: "Concluído", value: statusCounts.completed },
    { name: "Cancelado", value: statusCounts.cancelled },
    { name: "Não Compareceu", value: statusCounts.noShow },
  ];
  
  const COLORS = ['#a90eb3', '#e3a000', '#3182CE', '#FC8181'];
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col ml-64">
        <div className="p-8">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>
          
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Agendamentos
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAppointments}</div>
                <p className="text-xs text-muted-foreground">
                  {completionRate}% de taxa de conclusão
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Receita Total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalIncome.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Lucro: R$ {netProfit.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Clientes
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAppointments}</div>
                <p className="text-xs text-muted-foreground">
                  Novos este mês
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Serviços
                </CardTitle>
                <Scissors className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{serviceData.length}</div>
                <p className="text-xs text-muted-foreground">
                  Serviços ativos
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <Tabs defaultValue="week" value={dateRange} onValueChange={(v) => setDateRange(v as any)}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Análise de Dados</h2>
              <TabsList>
                <TabsTrigger value="week">Semana</TabsTrigger>
                <TabsTrigger value="month">Mês</TabsTrigger>
                <TabsTrigger value="year">Ano</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Agendamentos</CardTitle>
                  <CardDescription>
                    Número de agendamentos por dia
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={appointmentsByDay}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="appointments" fill="#a90eb3" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Status dos Agendamentos</CardTitle>
                  <CardDescription>
                    Distribuição por status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Financeiro</CardTitle>
                  <CardDescription>
                    Receitas e despesas por dia
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="income" fill="#e3a000" name="Receita" />
                        <Bar dataKey="expenses" fill="#a90eb3" name="Despesas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Serviços Mais Populares</CardTitle>
                  <CardDescription>
                    Distribuição de serviços
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={serviceData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#a90eb3" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
