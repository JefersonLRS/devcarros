import { Container } from "../../components/container";
import logoImg from "../../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { auth } from "../../services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

const schema = z.object({
  name: z.string().min(1, "Esse campo é obrigatório."),
  email: z
    .string()
    .email("Digite um email válido.")
    .min(1, "Esse campo é obrigatório."),
  password: z.string().min(6, "A senha deve ter no mínimmo 6 caracteres."),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const [loadingAuth, setLoadingAuth] = useState(false);
  const navigate = useNavigate();
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
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (user) => {
        await updateProfile(user.user, {
          displayName: data.name,
        });

        setDoc(doc(db, "users", user.user.uid), {
          uid: user.user.uid,
          name: data.name,
          email: data.email,
          favorites: [],
        });
        setLoadingAuth(false);
        toast.success("Seja bem-vindo(a), " + data.name + "!");
        navigate("/", { replace: true });
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
        toast.error(
          "Falha ao cadastra-se, verifique se esse email já está em uso."
        );
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
          className="bg-[#17181A] p-4 max-w-xl shadow-md w-full rounded-lg"
        >
          <div className="mb-3">
            <Input
              type="text"
              placeholder="Digite seu nome completo"
              name="name"
              error={errors.name?.message}
              register={register}
            />
          </div>

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

          <button className="bg-gradient-to-r from-blue-900 to-blue-500 text-white w-full p-2 rounded-lg">
            {loadingAuth ? (
              <l-ring stroke={2} color="white" size={25} />
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
        <div>
          <p className="mt-4 text-white">
            <span className="opacity-70">Já possui uma conta?</span>
            <span className="">
              <Link to="/login"> Entrar</Link>
            </span>
          </p>
        </div>
      </div>
    </Container>
  );
}
