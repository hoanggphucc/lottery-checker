import { getServerSession } from "next-auth";
import LoginForm from "@/components/auth/LoginForm";
import authOptions from "@/app/api/auth/auth.options";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(ROUTES.HOME);
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <LoginForm />
    </div>
  );
}
