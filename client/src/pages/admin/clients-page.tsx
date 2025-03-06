import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, InsertUser } from "@shared/schema";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
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
  CardDescription,
  CardFooter,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, Plus, MoreVertical, User as UserIcon, Instagram, Phone, Scissors, UserCheck } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "@shared/schema";

export default function ClientsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false);
  const [newClientOpen, setNewClientOpen] = useState(false);

  // Fetch clients (all users with role "client")
  const { data: allUsers = [], isLoading: isUsersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      // In a real app, this would be a proper API endpoint
      // Mock data for demonstration purposes
      const res = await fetch("/api/user");
      if (!res.ok) {
        return []; // Return empty array if not authenticated or error
      }

      // Return current user as an array for now
      const user = await res.json();
      return [user];
    },
  });

  // Filter clients (only users with role "client")
  const clients = allUsers.filter(user => user.role === "client");

  // Fetch appointments for client details
  const { data: clientAppointments = [] } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments", selectedClient?.id],
    enabled: !!selectedClient,
    queryFn: async () => {
      // In a real app, this would be a proper API endpoint
      // Mock data for demonstration purposes
      return [];
    },
  });

  // Create new client mutation
  const createClientMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso.",
      });
      setNewClientOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // New client form schema
  const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().optional(),
    address: z.string().optional(),
    instagram: z.string().optional(),
    username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      instagram: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createClientMutation.mutate({
      ...values,
      role: "client",
      profilePicture: "",
    });
  };

  // Filter clients based on search query
  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      (client.phone && client.phone.includes(query))
    );
  });

  // View client details
  const handleViewClient = (client: User) => {
    setSelectedClient(client);
    setClientDetailsOpen(true);
  };

  // Calculate client metrics
  const getMostFrequentService = (clientId: number) => {
    // In a real app, you would analyze client appointments
    // For now, return a placeholder
    return "Corte de Cabelo";
  };

  const getLastProfessional = (clientId: number) => {
    // In a real app, you would analyze client appointments
    // For now, return a placeholder
    return "John Smith";
  };

  return (
    <Sidebar>
      <div className="flex-1 flex flex-col"> {/* Removed ml-64 */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cliente..."
                  className="w-[250px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Dialog open={newClientOpen} onOpenChange={setNewClientOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
                    <DialogDescription>
                      Preencha os dados abaixo para cadastrar um novo cliente.
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do cliente" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="email@exemplo.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input placeholder="(00) 00000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input placeholder="Endereço do cliente" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <Input placeholder="@perfil" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome de Usuário</FormLabel>
                              <FormControl>
                                <Input placeholder="username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Senha</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setNewClientOpen(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" disabled={createClientMutation.isPending}>
                          {createClientMutation.isPending ? "Cadastrando..." : "Cadastrar Cliente"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                Gerenciamento de clientes cadastrados no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isUsersLoading ? (
                <div className="text-center py-4">Carregando clientes...</div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  {searchQuery ? "Nenhum cliente encontrado com este termo." : "Nenhum cliente cadastrado."}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Nome</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Instagram</TableHead>
                      <TableHead>Serviço Mais Frequente</TableHead>
                      <TableHead>Último Profissional</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id} onClick={() => handleViewClient(client)} className="cursor-pointer">
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{client.email}</span>
                            <span className="text-sm text-muted-foreground">{client.phone || "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell>{client.instagram || "—"}</TableCell>
                        <TableCell>{getMostFrequentService(client.id)}</TableCell>
                        <TableCell>{getLastProfessional(client.id)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewClient(client)}>
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem>Editar Cliente</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                Excluir Cliente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Client Rankings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ranking de Clientes</CardTitle>
              <CardDescription>
                Clientes classificados por número de visitas e valor gasto.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visits">
                <TabsList className="grid w-[400px] grid-cols-2">
                  <TabsTrigger value="visits">Por Visitas</TabsTrigger>
                  <TabsTrigger value="spending">Por Valor Gasto</TabsTrigger>
                </TabsList>
                <TabsContent value="visits" className="pt-4">
                  {filteredClients.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhum cliente cadastrado.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredClients.slice(0, 5).map((client, index) => (
                        <div key={client.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                            </div>
                          </div>
                          <div className="font-medium">
                            {Math.floor(Math.random() * 20) + 1} visitas
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="spending" className="pt-4">
                  {filteredClients.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      Nenhum cliente cadastrado.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredClients.slice(0, 5).map((client, index) => (
                        <div key={client.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{client.name}</p>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                            </div>
                          </div>
                          <div className="font-medium">
                            R$ {(Math.random() * 1000).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Client Details Dialog */}
        {selectedClient && (
          <Dialog open={clientDetailsOpen} onOpenChange={setClientDetailsOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Detalhes do Cliente</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 pt-4">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center mb-4">
                    <UserIcon className="h-16 w-16 text-muted-foreground" />
                  </div>

                  <h3 className="text-lg font-medium">{selectedClient.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedClient.email}</p>

                  <div className="w-full mt-6 space-y-2">
                    {selectedClient.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedClient.phone}</span>
                      </div>
                    )}

                    {selectedClient.instagram && (
                      <div className="flex items-center gap-2 text-sm">
                        <Instagram className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedClient.instagram}</span>
                      </div>
                    )}

                    {selectedClient.address && (
                      <div className="flex items-start gap-2 text-sm">
                        <div className="mt-0.5 shrink-0">
                          <Search className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span>{selectedClient.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Tabs defaultValue="history">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="history">Histórico</TabsTrigger>
                      <TabsTrigger value="services">Serviços</TabsTrigger>
                      <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="history" className="pt-4">
                      <h3 className="text-sm font-medium mb-2">Últimos Agendamentos</h3>
                      <ScrollArea className="h-[300px]">
                        {clientAppointments.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            Nenhum agendamento encontrado para este cliente.
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {clientAppointments.map((appointment) => (
                              <div key={appointment.id} className="border rounded-md p-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium">{appointment.date}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {appointment.startTime} - {appointment.endTime}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm">Serviço ID: {appointment.serviceId}</div>
                                    <div className="text-sm text-muted-foreground">
                                      Profissional ID: {appointment.professionalId}
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2 flex items-center">
                                  <div className={`text-xs px-2 py-1 rounded-full ${
                                    appointment.status === "completed" 
                                      ? "bg-green-100 text-green-800" 
                                      : appointment.status === "cancelled" 
                                        ? "bg-red-100 text-red-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}>
                                    {appointment.status}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="services" className="pt-4">
                      <h3 className="text-sm font-medium mb-2">Serviços Preferidos</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-purple-600" />
                            <span>Corte de Cabelo</span>
                          </div>
                          <div className="text-sm">10 agendamentos</div>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-purple-600" />
                            <span>Coloração</span>
                          </div>
                          <div className="text-sm">5 agendamentos</div>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-purple-600" />
                            <span>Manicure</span>
                          </div>
                          <div className="text-sm">3 agendamentos</div>
                        </div>
                      </div>

                      <h3 className="text-sm font-medium mt-6 mb-2">Profissionais Preferidos</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-purple-600" />
                            <span>John Smith</span>
                          </div>
                          <div className="text-sm">7 agendamentos</div>
                        </div>
                        <div className="flex justify-between items-center p-3 border rounded-md">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-purple-600" />
                            <span>Maria Silva</span>
                          </div>
                          <div className="text-sm">4 agendamentos</div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="stats" className="pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="p-4">
                            <CardTitle className="text-md">Total Gasto</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold">R$ 850,00</div>
                            <p className="text-xs text-muted-foreground">
                              Desde o primeiro agendamento
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="p-4">
                            <CardTitle className="text-md">Visitas</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold">18</div>
                            <p className="text-xs text-muted-foreground">
                              Total de agendamentos
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="p-4">
                            <CardTitle className="text-md">Média por Visita</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="text-2xl font-bold">R$ 47,22</div>
                            <p className="text-xs text-muted-foreground">
                              Valor médio por agendamento
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="p-4">
                            <CardTitle className="text-md">Última Visita</CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="text-lg font-bold">10/06/2023</div>
                            <p className="text-xs text-muted-foreground">
                              15 dias atrás
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setClientDetailsOpen(false)}>
                  Fechar
                </Button>
                <Button>Agendar Nova Visita</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Sidebar>
  );
}