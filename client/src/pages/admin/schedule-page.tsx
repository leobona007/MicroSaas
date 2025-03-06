import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format, parseISO, startOfWeek, endOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Filter, Check, X, Plus, Search } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Appointment, Professional, Service, InsertAppointment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

export default function SchedulePage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [openFilter, setOpenFilter] = useState(false);
  const [openNewAppointment, setOpenNewAppointment] = useState(false);
  const [filters, setFilters] = useState({
    professionalId: "",
    status: "",
    serviceId: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch appointments for the selected date
  const { data: appointments = [], isLoading: isAppointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments", format(selectedDate, "yyyy-MM-dd")],
  });

  // Fetch professionals
  const { data: professionals = [] } = useQuery<Professional[]>({
    queryKey: ["/api/professionals"],
  });

  // Fetch services
  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  // Create appointment mutation
  const createAppointmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/appointments", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Agendamento criado",
        description: "O agendamento foi criado com sucesso.",
      });
      setOpenNewAppointment(false);
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar agendamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update appointment status mutation
  const updateAppointmentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/appointments/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status atualizado",
        description: "O status do agendamento foi atualizado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // New appointment form
  const formSchema = z.object({
    userId: z.coerce.number().min(1, "Selecione um cliente"),
    professionalId: z.coerce.number().min(1, "Selecione um profissional"),
    serviceId: z.coerce.number().min(1, "Selecione um serviço"),
    date: z.date(),
    startTime: z.string().min(1, "Horário é obrigatório"),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: 1, // Default to first user for simplicity
      professionalId: 0,
      serviceId: 0,
      date: selectedDate,
      startTime: "09:00",
      notes: "",
    },
  });

  // Update the date in the form when selected date changes
  useEffect(() => {
    form.setValue("date", selectedDate);
  }, [selectedDate, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Get service to calculate end time
    const service = services.find(s => s.id === values.serviceId);
    if (!service) {
      toast({
        title: "Erro ao criar agendamento",
        description: "Serviço não encontrado.",
        variant: "destructive",
      });
      return;
    }

    // Calculate end time
    const [hours, minutes] = values.startTime.split(":").map(Number);
    const startDate = new Date(values.date);
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + service.duration);
    
    const formattedEndTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    createAppointmentMutation.mutate({
      ...values,
      endTime: formattedEndTime,
      status: "scheduled",
    });
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    let matches = true;

    if (filters.professionalId && appointment.professionalId.toString() !== filters.professionalId) {
      matches = false;
    }

    if (filters.serviceId && appointment.serviceId.toString() !== filters.serviceId) {
      matches = false;
    }

    if (filters.status && appointment.status !== filters.status) {
      matches = false;
    }

    // Search by user ID (in a real app, you'd search by name)
    if (searchQuery && !appointment.userId.toString().includes(searchQuery)) {
      matches = false;
    }

    return matches;
  });

  // Get service and professional details for an appointment
  const getAppointmentDetails = (appointment: Appointment) => {
    const service = services.find(s => s.id === appointment.serviceId);
    const professional = professionals.find(p => p.id === appointment.professionalId);
    
    return {
      serviceName: service?.name || "Serviço desconhecido",
      professionalName: professional?.name || "Profissional desconhecido",
    };
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | null
      | undefined = "default";
    
    switch (status) {
      case "completed":
        variant = "default";
        break;
      case "scheduled":
        variant = "secondary";
        break;
      case "cancelled":
        variant = "destructive";
        break;
      case "no-show":
        variant = "outline";
        break;
    }
    
    const statusMap: Record<string, string> = {
      completed: "Concluído",
      scheduled: "Agendado",
      cancelled: "Cancelado",
      "no-show": "Não Compareceu",
    };
    
    return <Badge variant={variant}>{statusMap[status] || status}</Badge>;
  };

  // Mark as completed handler
  const handleMarkAsCompleted = (id: number) => {
    updateAppointmentMutation.mutate({
      id,
      data: { status: "completed" },
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col ml-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cliente..."
                  className="w-[200px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Popover open={openFilter} onOpenChange={setOpenFilter}>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filtrar Agendamentos</h4>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Profissional</label>
                      <Select
                        value={filters.professionalId}
                        onValueChange={(value) => setFilters({...filters, professionalId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os profissionais" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos os profissionais</SelectItem>
                          {professionals.map(professional => (
                            <SelectItem key={professional.id} value={professional.id.toString()}>
                              {professional.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Serviço</label>
                      <Select
                        value={filters.serviceId}
                        onValueChange={(value) => setFilters({...filters, serviceId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os serviços" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos os serviços</SelectItem>
                          {services.map(service => (
                            <SelectItem key={service.id} value={service.id.toString()}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select
                        value={filters.status}
                        onValueChange={(value) => setFilters({...filters, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos os status</SelectItem>
                          <SelectItem value="scheduled">Agendado</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                          <SelectItem value="no-show">Não Compareceu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFilters({
                            professionalId: "",
                            status: "",
                            serviceId: "",
                          });
                          setOpenFilter(false);
                        }}
                      >
                        Limpar
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setOpenFilter(false)}
                      >
                        Aplicar Filtros
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Dialog open={openNewAppointment} onOpenChange={setOpenNewAppointment}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Agendamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Agendamento</DialogTitle>
                    <DialogDescription>
                      Preencha os dados abaixo para criar um novo agendamento.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="professionalId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profissional</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um profissional" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {professionals.map((professional) => (
                                  <SelectItem key={professional.id} value={professional.id.toString()}>
                                    {professional.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="serviceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Serviço</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              defaultValue={field.value.toString()}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um serviço" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {services.map((service) => (
                                  <SelectItem key={service.id} value={service.id.toString()}>
                                    {service.name} - {service.duration}min - R${service.price.toFixed(2)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Data</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP", { locale: ptBR })
                                      ) : (
                                        <span>Selecione uma data</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => date && field.onChange(date)}
                                    disabled={(date) => {
                                      // Disable past dates
                                      const today = new Date();
                                      today.setHours(0, 0, 0, 0);
                                      return date < today;
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horário</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea rows={3} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOpenNewAppointment(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={createAppointmentMutation.isPending}>
                          {createAppointmentMutation.isPending ? "Criando..." : "Criar Agendamento"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-[300px_1fr]">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="border rounded-md"
                />
              </CardContent>
            </Card>
            
            {/* Appointments List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  Agendamentos para {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAppointmentsLoading ? (
                  <div className="text-center py-4">Carregando agendamentos...</div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhum agendamento encontrado para esta data.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Horário</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Profissional</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.map((appointment) => {
                        const { serviceName, professionalName } = getAppointmentDetails(appointment);
                        return (
                          <TableRow key={appointment.id}>
                            <TableCell className="font-medium">
                              {appointment.startTime} - {appointment.endTime}
                            </TableCell>
                            <TableCell>Cliente {appointment.userId}</TableCell>
                            <TableCell>{serviceName}</TableCell>
                            <TableCell>{professionalName}</TableCell>
                            <TableCell>
                              <StatusBadge status={appointment.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              {appointment.status === "scheduled" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleMarkAsCompleted(appointment.id)}
                                  variant="outline"
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Concluir
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
