import authOptions from "@/app/api/auth/auth.options";
import ProfileForm from "@/components/user/ProfileForm";
import { TAGS } from "@/lib/tags";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const res = await sendRequest<IBackendRes<IUser>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/account`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      next: { tags: [TAGS.GET_PROFILE] },
    },
  });

  return (
    <div className="Profile">
      <ProfileForm user={res.data || null} />
    </div>
  );
}
