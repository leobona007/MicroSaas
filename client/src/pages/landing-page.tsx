import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Calendar, CheckCircle2, Clock, BarChart3, ShieldCheck, Smartphone, User, Scissors } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">BeautySalon</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Funcionalidades</a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900">Depoimentos</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Planos</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="outline" className="hidden sm:flex">Entrar</Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-purple-600 hover:bg-purple-700">Começar agora</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-purple-50 py-12 sm:py-16 lg:py-20 xl:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Gerencie seu salão ou barbearia com simplicidade
              </h1>
              <p className="mt-4 text-lg text-gray-600 sm:mt-6 sm:text-xl">
                Automatize agendamentos, fidelize clientes e aumente seus lucros com um sistema completo de gestão para salões de beleza e barbearias.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
                <Link href="/auth">
                  <Button className="bg-purple-600 hover:bg-purple-700 h-12 px-6 text-base">
                    Comece gratuitamente
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <span className="text-sm text-gray-500">
                  Experimente 14 dias grátis, sem necessidade de cartão.
                </span>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`inline-block h-8 w-8 rounded-full ring-2 ring-white bg-purple-${i*100}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">+2.500 profissionais</span> já usam nossa plataforma
                </p>
              </div>
            </div>
            <div className="relative lg:pl-8">
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80"
                  alt="Interface do sistema de agendamento"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Todas as ferramentas para o crescimento do seu negócio
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simplifique a gestão do seu salão, economize tempo e aumente seus lucros com nossas funcionalidades completas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Calendar className="h-6 w-6 text-purple-600" />,
                title: "Agendamento online 24h",
                description: "Seus clientes podem agendar a qualquer momento, mesmo quando o salão está fechado, reduzindo chamadas telefônicas."
              },
              {
                icon: <Clock className="h-6 w-6 text-purple-600" />,
                title: "Controle de agenda",
                description: "Visão completa da sua agenda, evite sobreposições e maximize o tempo de cada profissional."
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
                title: "Relatórios detalhados",
                description: "Acompanhe o desempenho do seu negócio com métricas e relatórios que ajudam na tomada de decisões."
              },
              {
                icon: <User className="h-6 w-6 text-purple-600" />,
                title: "Cadastro de clientes",
                description: "Gerencie perfis completos dos clientes, histórico de serviços e preferências pessoais."
              },
              {
                icon: <Smartphone className="h-6 w-6 text-purple-600" />,
                title: "Aplicativo responsivo",
                description: "Acesse de qualquer dispositivo. Seu cliente pode agendar pelo celular, tablet ou computador."
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-purple-600" />,
                title: "Segurança garantida",
                description: "Seus dados e dos seus clientes protegidos com os mais avançados protocolos de segurança."
              }
            ].map((feature, index) => (
              <div key={index} className="relative rounded-xl border p-6 hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section id="testimonials" className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              O que nossos clientes dizem
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Centenas de salões e barbearias já transformaram seus negócios com nossa plataforma.
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                content: "Reduzimos em 80% o tempo gasto com agendamentos. Nossos clientes adoram a praticidade de marcar pelo site a qualquer hora.",
                author: "Ana Silva",
                role: "Proprietária do Studio Ana Silva"
              },
              {
                content: "A organização da agenda melhorou muito. Não temos mais problemas de horários conflitantes e os clientes recebem lembretes automáticos.",
                author: "Carlos Oliveira",
                role: "Barbeiro Master na Barbearia Elite"
              },
              {
                content: "Com os relatórios, identificamos os serviços mais lucrativos e realocamos nossos profissionais para aumentar a rentabilidade em 35%.",
                author: "Mariana Santos",
                role: "Gerente no Espaço Beleza"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-xl bg-white p-8 shadow-sm"
              >
                <blockquote className="flex-1">
                  <p className="text-lg text-gray-900">"{testimonial.content}"</p>
                </blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-700">
                      {testimonial.author.split(' ').map(name => name[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Planos para todos os tamanhos de negócio
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Escolha o plano ideal para o seu salão ou barbearia e comece a transformar sua gestão hoje mesmo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Iniciante",
                price: "R$ 89,90",
                description: "Ideal para profissionais autônomos e pequenos salões.",
                features: [
                  "Até 2 profissionais",
                  "Agendamento online",
                  "Cadastro de clientes",
                  "Controle de agenda",
                  "Lembretes por e-mail"
                ]
              },
              {
                name: "Profissional",
                price: "R$ 149,90",
                description: "Perfeito para salões em crescimento.",
                features: [
                  "Até 5 profissionais",
                  "Tudo do plano Iniciante",
                  "Lembretes por SMS",
                  "Relatórios básicos",
                  "Fidelização de clientes"
                ],
                popular: true
              },
              {
                name: "Empresarial",
                price: "R$ 249,90",
                description: "Para redes de salões e negócios maiores.",
                features: [
                  "Profissionais ilimitados",
                  "Tudo do plano Profissional",
                  "Relatórios avançados",
                  "Integração financeira",
                  "Múltiplas unidades"
                ]
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`flex flex-col rounded-xl p-8 ${
                  plan.popular
                    ? "bg-purple-50 border-2 border-purple-200 shadow-lg"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="mb-4 inline-flex rounded-full bg-purple-100 px-4 py-1 text-xs font-semibold text-purple-700">
                    Mais popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold tracking-tight text-gray-900">{plan.price}</span>
                  <span className="ml-1 text-sm text-gray-600">/mês</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Link href="/auth">
                    <Button 
                      className={`w-full ${
                        plan.popular
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-white text-purple-600 border border-purple-600 hover:bg-purple-50"
                      }`}
                    >
                      Começar agora
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-purple-600 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto para transformar seu salão?
            </h2>
            <p className="mt-4 text-lg text-purple-100">
              Junte-se a milhares de profissionais que já modernizaram seus negócios. Experimente gratuitamente por 14 dias.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 h-12 px-6">
                  Comece gratuitamente
                </Button>
              </Link>
              <Button variant="outline" className="border-purple-200 text-white hover:bg-purple-700 h-12 px-6">
                Fale com um consultor
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Scissors className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">BeautySalon</span>
              </div>
              <p className="mt-4 text-sm text-gray-400">
                Transformando a gestão de salões de beleza e barbearias desde 2023.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white">Produto</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#features" className="text-sm text-gray-400 hover:text-white">Funcionalidades</a></li>
                <li><a href="#pricing" className="text-sm text-gray-400 hover:text-white">Preços</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Integrações</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Novidades</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white">Suporte</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Ajuda</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Tutoriais</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Contato</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white">Empresa</h3>
              <ul className="mt-4 space-y-2">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Sobre nós</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Carreiras</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-center text-sm text-gray-400">
              © 2023 BeautySalon. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
