import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import logoImg from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import toast from "react-hot-toast";

const schema = z.object({
  email: z
    .string()
    .email("Digite um email válido.")
    .min(1, "Esse campo é obrigatório."),
  password: z.string().min(6, "A senha deve ter no mínimmo 6 caracteres."),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const [loadingAuth, setLoadingAuth] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
  });

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  async function onSubmit(data: FormData) {
    setLoadingAuth(true);

    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then(() => {
        setLoadingAuth(false);
        toast.success("Seja bem-vindo!");
        navigate("/", { replace: true });
      })
      .catch((error) => {
        toast.error("Email ou senha incorretos.");
        console.error(error);
        setLoadingAuth(false);
      });
  }

  return (
    <Container>
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <Link className="mb-6 max-w-sm w-full" to="/">
          <img className="w-full" src={logoImg} alt="Logo do site" />
        </Link>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-4 shadow-md max-w-xl w-full rounded-lg"
        >
          <div className="mb-3">
            <Input
              type="text"
              placeholder="Digite seu email"
              name="email"
              error={errors.email?.message}
              register={register}
            />
          </div>

          <div className="mb-3">
            <Input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              error={errors.password?.message}
              register={register}
            />
          </div>

          <button className="bg-[#06233F] text-white w-full p-2 rounded-lg">
            {loadingAuth ? (
              <l-ring stroke={2} color="white" size={25} />
            ) : (
              "Entrar"
            )}
          </button>
        </form>
        <div>
          <p className="mt-4">
            <span className="opacity-70">Não tem uma conta?</span>
            <span className="">
              <Link to="/register"> Cadastre-se</Link>
            </span>
          </p>
        </div>
      </div>
    </Container>
  );
}
