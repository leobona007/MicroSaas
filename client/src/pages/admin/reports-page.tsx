import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, subMonths, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { cn } from "@/lib/utils";
import { CalendarRange, Download, Filter, CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Appointment, Service, Professional, Transaction } from "@shared/schema";
<<<<<<< HEAD
=======
import { useMobile } from "@/hooks/use-mobile";
>>>>>>> 857c171 (first commit)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
<<<<<<< HEAD
=======
import { ScrollArea } from "@/components/ui/scroll-area";
>>>>>>> 857c171 (first commit)

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"services" | "clients" | "finance" | "schedule">("services");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
<<<<<<< HEAD
=======
  const isMobile = useMobile();
>>>>>>> 857c171 (first commit)
  
  // Fetch service data
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });
  
  // Fetch professional data
  const { data: professionals = [] } = useQuery<Professional[]>({
    queryKey: ["/api/professionals"],
  });
  
  // Fetch appointments
  const { data: appointments = [] } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });
  
  // Fetch transactions
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });
  
  // Filter data by date range
  const filterByDateRange = <T extends { date: string | Date }>(items: T[]): T[] => {
    if (!dateRange?.from) return items;
    
    return items.filter(item => {
      const itemDate = new Date(item.date);
      if (dateRange.from && dateRange.to) {
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      }
      return itemDate >= dateRange.from;
    });
  };
  
  const filteredAppointments = filterByDateRange(appointments);
  const filteredTransactions = filterByDateRange(transactions);
  
  // Prepare data for services report
  const serviceReportData = services.map(service => {
    const serviceAppointments = filteredAppointments.filter(a => a.serviceId === service.id);
    const completedAppointments = serviceAppointments.filter(a => a.status === "completed");
    
    const revenue = completedAppointments.length * service.price;
    
    return {
      id: service.id,
      name: service.name,
      appointments: serviceAppointments.length,
      completed: completedAppointments.length,
      revenue: revenue,
    };
  }).sort((a, b) => b.appointments - a.appointments);
  
  // Prepare data for clients report
  const clientsById = filteredAppointments.reduce((acc, appointment) => {
    const userId = appointment.userId;
    if (!acc[userId]) {
      acc[userId] = {
        id: userId,
        appointments: 0,
        completed: 0,
        cancelled: 0,
        noShow: 0,
        revenue: 0,
      };
    }
    
    acc[userId].appointments += 1;
    
    if (appointment.status === "completed") {
      acc[userId].completed += 1;
<<<<<<< HEAD
      // Find service to calculate revenue
=======
      // Find service price
>>>>>>> 857c171 (first commit)
      const service = services.find(s => s.id === appointment.serviceId);
      if (service) {
        acc[userId].revenue += service.price;
      }
    } else if (appointment.status === "cancelled") {
      acc[userId].cancelled += 1;
    } else if (appointment.status === "no-show") {
      acc[userId].noShow += 1;
    }
    
    return acc;
  }, {} as Record<number, { id: number; appointments: number; completed: number; cancelled: number; noShow: number; revenue: number; }>);
  
<<<<<<< HEAD
  const clientReportData = Object.values(clientsById)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10); // Top 10 clients
  
  // Prepare data for financial report
  const incomeByDay: Record<string, number> = {};
  const expensesByDay: Record<string, number> = {};
  
  filteredTransactions.forEach(transaction => {
    const date = format(new Date(transaction.date), 'yyyy-MM-dd');
    
    if (transaction.type === "income") {
      incomeByDay[date] = (incomeByDay[date] || 0) + transaction.amount;
    } else {
      expensesByDay[date] = (expensesByDay[date] || 0) + transaction.amount;
    }
  });
  
  const daysInRange = dateRange?.from && dateRange?.to 
    ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
    : [];
  
  const financialReportData = daysInRange.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return {
      date: format(day, 'dd/MM'),
=======
  const clientReportData = Object.values(clientsById).sort((a, b) => b.appointments - a.appointments);
  
  // Prepare data for finance report
  const incomeByDay = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);
  
  const expensesByDay = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);
  
  // Create an array of all dates in the range
  const allDates = dateRange?.from && dateRange?.to
    ? eachDayOfInterval({ start: dateRange.from, end: dateRange.to })
    : [];
  
  const financeReportData = allDates.map(date => {
    const dateStr = format(date, "yyyy-MM-dd");
    return {
      date: format(date, "dd/MM"),
>>>>>>> 857c171 (first commit)
      income: incomeByDay[dateStr] || 0,
      expenses: expensesByDay[dateStr] || 0,
      profit: (incomeByDay[dateStr] || 0) - (expensesByDay[dateStr] || 0),
    };
  });
  
<<<<<<< HEAD
  const totalIncome = Object.values(incomeByDay).reduce((sum, val) => sum + val, 0);
  const totalExpenses = Object.values(expensesByDay).reduce((sum, val) => sum + val, 0);
  const totalProfit = totalIncome - totalExpenses;
  
  // Prepare data for schedule report
  const scheduleReportData = filteredAppointments.reduce((acc, appointment) => {
    const status = appointment.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const scheduleChartData = [
    { name: "Agendado", value: scheduleReportData["scheduled"] || 0 },
    { name: "Concluído", value: scheduleReportData["completed"] || 0 },
    { name: "Cancelado", value: scheduleReportData["cancelled"] || 0 },
    { name: "Não Compareceu", value: scheduleReportData["no-show"] || 0 },
  ];
  
  const COLORS = ['#a90eb3', '#e3a000', '#3182CE', '#FC8181'];
  
  // Handle date range selection
  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col ml-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
            
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-auto">
                    <CalendarRange className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Selecione o período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="services" value={reportType} onValueChange={(v) => setReportType(v as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="services">Serviços</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="finance">Financeiro</TabsTrigger>
              <TabsTrigger value="schedule">Agenda</TabsTrigger>
            </TabsList>
            
            {/* Services Report */}
            <TabsContent value="services" className="pt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total de Agendamentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {filteredAppointments.length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Serviços Mais Populares</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {serviceReportData.length > 0 ? serviceReportData[0].name : "Nenhum"}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {serviceReportData.length > 0 ? `${serviceReportData[0].appointments} agendamentos` : ""}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Receita por Serviços</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      R$ {serviceReportData.reduce((sum, s) => sum + s.revenue, 0).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Popularidade dos Serviços</CardTitle>
                  <CardDescription>
                    Número de agendamentos por serviço
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={serviceReportData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Bar dataKey="appointments" fill="#a90eb3" name="Agendamentos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes dos Serviços</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Agendamentos</TableHead>
                        <TableHead>Concluídos</TableHead>
                        <TableHead>Taxa de Conclusão</TableHead>
                        <TableHead className="text-right">Receita</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceReportData.map((service) => {
                        const completionRate = service.appointments > 0 
                          ? ((service.completed / service.appointments) * 100).toFixed(0) + "%" 
                          : "N/A";
                        
                        return (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.name}</TableCell>
                            <TableCell>
                              R$ {services.find(s => s.id === service.id)?.price.toFixed(2) || "0.00"}
                            </TableCell>
                            <TableCell>{service.appointments}</TableCell>
                            <TableCell>{service.completed}</TableCell>
                            <TableCell>{completionRate}</TableCell>
                            <TableCell className="text-right">R$ {service.revenue.toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Clients Report */}
            <TabsContent value="clients" className="pt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total de Clientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {Object.keys(clientsById).length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Cliente Mais Frequente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {clientReportData.length > 0 ? `Cliente ${clientReportData[0].id}` : "Nenhum"}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {clientReportData.length > 0 ? `${clientReportData[0].appointments} agendamentos` : ""}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Receita Total de Clientes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      R$ {clientReportData.reduce((sum, c) => sum + c.revenue, 0).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Top 10 Clientes por Receita</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={clientReportData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="id" name="Cliente" />
                        <YAxis />
                        <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                        <Bar dataKey="revenue" fill="#e3a000" name="Receita" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes dos Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Total de Agendamentos</TableHead>
                        <TableHead>Concluídos</TableHead>
                        <TableHead>Cancelados</TableHead>
                        <TableHead>Não Compareceu</TableHead>
                        <TableHead className="text-right">Valor Gasto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientReportData.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">Cliente {client.id}</TableCell>
                          <TableCell>{client.appointments}</TableCell>
                          <TableCell>{client.completed}</TableCell>
                          <TableCell>{client.cancelled}</TableCell>
                          <TableCell>{client.noShow}</TableCell>
                          <TableCell className="text-right">R$ {client.revenue.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Finance Report */}
            <TabsContent value="finance" className="pt-6">
              <div className="grid gap-6 md:grid-cols-3 mb-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Receita Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      R$ {totalIncome.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Despesas Totais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      R$ {totalExpenses.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={cn(
                  "border-l-4",
                  totalProfit >= 0 ? "border-l-purple-600" : "border-l-red-600"
                )}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Lucro Líquido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={cn(
                      "text-3xl font-bold",
                      totalProfit >= 0 ? "text-purple-600" : "text-red-600"
                    )}>
                      R$ {totalProfit.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Evolução Financeira</CardTitle>
                  <CardDescription>
                    Receitas, despesas e lucro durante o período
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={financialReportData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                        <Line type="monotone" dataKey="income" stroke="#e3a000" name="Receita" />
                        <Line type="monotone" dataKey="expenses" stroke="#a90eb3" name="Despesas" />
                        <Line type="monotone" dataKey="profit" stroke="#3182CE" name="Lucro" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Financeiro</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Receitas</TableHead>
                        <TableHead>Despesas</TableHead>
                        <TableHead className="text-right">Lucro</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financialReportData.map((day, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{day.date}</TableCell>
                          <TableCell className="text-green-600">R$ {day.income.toFixed(2)}</TableCell>
                          <TableCell className="text-red-600">R$ {day.expenses.toFixed(2)}</TableCell>
                          <TableCell className={cn(
                            "text-right font-medium",
                            day.profit >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            R$ {day.profit.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Schedule Report */}
            <TabsContent value="schedule" className="pt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total de Agendamentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {filteredAppointments.length}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Concluídos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {scheduleReportData["completed"] || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {filteredAppointments.length > 0
                        ? `${(((scheduleReportData["completed"] || 0) / filteredAppointments.length) * 100).toFixed(0)}% do total`
                        : "0% do total"}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Cancelados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-500">
                      {scheduleReportData["cancelled"] || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {filteredAppointments.length > 0
                        ? `${(((scheduleReportData["cancelled"] || 0) / filteredAppointments.length) * 100).toFixed(0)}% do total`
                        : "0% do total"}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Não Compareceram</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-amber-500">
                      {scheduleReportData["no-show"] || 0}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {filteredAppointments.length > 0
                        ? `${(((scheduleReportData["no-show"] || 0) / filteredAppointments.length) * 100).toFixed(0)}% do total`
                        : "0% do total"}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição de Status</CardTitle>
                    <CardDescription>
                      Percentual de agendamentos por status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={scheduleChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {scheduleChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho por Profissional</CardTitle>
                    <CardDescription>
                      Número de agendamentos por profissional
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={professionals.map(p => {
                          const professionalAppointments = filteredAppointments.filter(a => a.professionalId === p.id);
                          const completed = professionalAppointments.filter(a => a.status === "completed").length;
                          
                          return {
                            name: p.name,
                            total: professionalAppointments.length,
                            completed: completed,
                          };
                        })}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="total" fill="#a90eb3" name="Total" />
                          <Bar dataKey="completed" fill="#e3a000" name="Concluídos" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Horários</CardTitle>
                  <CardDescription>
                    Distribuição de agendamentos por horário do dia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={
                        (() => {
                          const hourlyData: Record<string, number> = {};
                          
                          // Initialize hours
                          for (let i = 8; i <= 20; i++) {
                            const hour = i.toString().padStart(2, '0') + ":00";
                            hourlyData[hour] = 0;
                          }
                          
                          // Count appointments by hour
                          filteredAppointments.forEach(appointment => {
                            const hour = (appointment.startTime as string).split(":")[0] + ":00";
                            if (hourlyData[hour] !== undefined) {
                              hourlyData[hour] += 1;
                            }
                          });
                          
                          // Convert to array for chart
                          return Object.entries(hourlyData).map(([hour, count]) => ({
                            hour,
                            count,
                          }));
                        })()
                      }>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#a90eb3" name="Agendamentos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
=======
  // Prepare data for schedule report
  const appointmentsByDay = filteredAppointments.reduce((acc, appointment) => {
    const date = appointment.date;
    if (!acc[date]) {
      acc[date] = {
        date,
        total: 0,
        completed: 0,
        cancelled: 0,
        noShow: 0,
      };
    }
    
    acc[date].total += 1;
    
    if (appointment.status === "completed") {
      acc[date].completed += 1;
    } else if (appointment.status === "cancelled") {
      acc[date].cancelled += 1;
    } else if (appointment.status === "no-show") {
      acc[date].noShow += 1;
    }
    
    return acc;
  }, {} as Record<string, { date: string; total: number; completed: number; cancelled: number; noShow: number; }>);
  
  const scheduleReportData = Object.values(appointmentsByDay).map(day => ({
    ...day,
    date: format(new Date(day.date), "dd/MM"),
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate summary metrics
  const totalAppointments = filteredAppointments.length;
  const completedAppointments = filteredAppointments.filter(a => a.status === "completed").length;
  const cancelledAppointments = filteredAppointments.filter(a => a.status === "cancelled").length;
  const noShowAppointments = filteredAppointments.filter(a => a.status === "no-show").length;
  
  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netProfit = totalIncome - totalExpenses;
  
  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <Sidebar>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full sm:w-auto justify-start text-left font-normal"
                >
                  <CalendarRange className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} - {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={isMobile ? 1 : 2}
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="services" value={reportType} onValueChange={(value) => setReportType(value as any)}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="finance">Financeiro</TabsTrigger>
            <TabsTrigger value="schedule">Agenda</TabsTrigger>
          </TabsList>
          
          {/* Services Report */}
          <TabsContent value="services" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Agendamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAppointments}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Serviços Realizados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedAppointments}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalAppointments ? Math.round((completedAppointments / totalAppointments) * 100) : 0}%
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Serviços Mais Populares</CardTitle>
                <CardDescription>
                  Número de agendamentos por serviço no período selecionado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={serviceReportData}
                      layout={isMobile ? "vertical" : "horizontal"}
                      margin={{
                        top: 5,
                        right: 30,
                        left: isMobile ? 100 : 30,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      {isMobile ? (
                        <>
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            tick={{ fontSize: 10 }}
                            width={90}
                          />
                          <XAxis 
                            type="number" 
                            tick={{ fontSize: 10 }}
                          />
                        </>
                      ) : (
                        <>
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            allowDecimals={false}
                            tick={{ fontSize: 12 }}
                          />
                        </>
                      )}
                      <Tooltip />
                      <Bar dataKey="appointments" fill="#8884d8" name="Agendamentos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Sidebar>
>>>>>>> 857c171 (first commit)
  );
}
