import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, Calendar, Clock, User, Scissors } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Professional, Service } from "@shared/schema";

type ConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  service: Service | undefined;
  date: Date | undefined;
  time: string | null;
  professional: Professional | undefined;
  isLoading: boolean;
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  service,
  date,
  time,
  professional,
  isLoading,
}: ConfirmationDialogProps) {
  if (!service || !date || !time || !professional) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            Confirmar Agendamento
          </DialogTitle>
          <DialogDescription>
            Por favor, confira os detalhes do seu agendamento antes de confirmar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <Scissors className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Serviço</h4>
              <p className="text-sm text-muted-foreground">{service.name}</p>
              <p className="text-sm font-medium mt-1">R$ {service.price.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Data</h4>
              <p className="text-sm text-muted-foreground">
                {format(date, "PPPP", { locale: ptBR })}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Horário</h4>
              <p className="text-sm text-muted-foreground">{time}</p>
              <p className="text-sm text-muted-foreground">Duração: {service.duration} minutos</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium">Profissional</h4>
              <p className="text-sm text-muted-foreground">{professional.name}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm} 
            className="bg-purple-700 hover:bg-purple-800"
            disabled={isLoading}
          >
            <Check className="h-4 w-4 mr-2" />
            {isLoading ? "Confirmando..." : "Confirmar Agendamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
