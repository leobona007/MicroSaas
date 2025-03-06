import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Scissors, User, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const loginSchema = z.object({
  username: z.string().min(1, {
    message: "Nome de usuário é obrigatório",
  }),
  password: z.string().min(1, {
    message: "Senha é obrigatória",
  }),
});

const registerSchema = z.object({
  name: z.string().min(1, {
    message: "Nome é obrigatório",
  }),
  email: z.string().email({
    message: "Email inválido",
  }),
  username: z.string().min(3, {
    message: "Nome de usuário deve ter pelo menos 3 caracteres",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter pelo menos 6 caracteres",
  }),
});

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [_, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: z.infer<typeof registerSchema>) => {
    registerMutation.mutate({
      ...values,
      role: "client",
      address: "",
      phone: "",
      instagram: "",
      profilePicture: "",
    });
  };

  return (
    <div className="flex min-h-screen flex-col-reverse md:flex-row">
      {/* Login/Register Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <Scissors className="h-10 w-10 text-purple-600" />
            </div>
            <CardTitle className="text-2xl">Bem-vindo</CardTitle>
            <CardDescription>
              Acesse sua conta para agendar seus horários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome de usuário</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                              <User className="ml-2 h-5 w-5 text-muted-foreground" />
                              <Input 
                                placeholder="Digite seu nome de usuário" 
                                className="border-0 focus-visible:ring-0" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                              <Lock className="ml-2 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type="password" 
                                placeholder="Digite sua senha" 
                                className="border-0 focus-visible:ring-0" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-700 hover:bg-purple-800" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-3">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                              <User className="ml-2 h-5 w-5 text-muted-foreground" />
                              <Input 
                                placeholder="Digite seu nome completo" 
                                className="border-0 focus-visible:ring-0" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                              <Mail className="ml-2 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type="email" 
                                placeholder="Digite seu email" 
                                className="border-0 focus-visible:ring-0" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome de usuário</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                              <User className="ml-2 h-5 w-5 text-muted-foreground" />
                              <Input 
                                placeholder="Escolha um nome de usuário" 
                                className="border-0 focus-visible:ring-0" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-ring">
                              <Lock className="ml-2 h-5 w-5 text-muted-foreground" />
                              <Input 
                                type="password" 
                                placeholder="Escolha uma senha" 
                                className="border-0 focus-visible:ring-0" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-700 hover:bg-purple-800 mt-3" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-muted-foreground">
              {activeTab === "login" ? (
                <p>
                  Não tem uma conta?{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-purple-700"
                    onClick={() => setActiveTab("register")}
                  >
                    Cadastre-se
                  </Button>
                </p>
              ) : (
                <p>
                  Já tem uma conta?{" "}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-purple-700"
                    onClick={() => setActiveTab("login")}
                  >
                    Faça login
                  </Button>
                </p>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Hero Section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#a90eb3] to-[#e3a000] flex flex-col items-center justify-center text-white p-6 md:p-10">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Salão de Beleza & Barbearia
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Agende seu horário com os melhores profissionais. Nosso sistema facilita a escolha de serviços, horários e profissionais.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Agende Online</h3>
              <p className="opacity-80 text-sm">Marque seu horário a qualquer momento, 24/7</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Serviços Premium</h3>
              <p className="opacity-80 text-sm">Ampla variedade de serviços com os melhores profissionais</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Experiência Única</h3>
              <p className="opacity-80 text-sm">Ambiente agradável e atendimento personalizado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
