import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logisticsService } from "@/features/logistics/services/logisticsService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await logisticsService.login(name.trim(), phone.trim());
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <form className="w-full max-w-sm space-y-4 rounded-2xl border bg-white p-6 shadow-sm" onSubmit={submit}>
        <h1 className="text-2xl font-bold text-blue-700">Login</h1>
        <p className="text-sm text-slate-600">Acesso rápido para operação logística.</p>

        <Input
          required
          placeholder="Nome"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-12"
        />
        <Input
          required
          placeholder="Telefone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="h-12"
        />

        <Button className="h-12 w-full bg-blue-600 hover:bg-blue-700" disabled={loading} type="submit">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
