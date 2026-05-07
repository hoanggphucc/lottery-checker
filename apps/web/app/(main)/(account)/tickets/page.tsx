import authOptions from "@/app/api/auth/auth.options";
import TicketList from "@/components/ticket/TicketList";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";

export default async function TicketPage(props: {
  searchParams?: Promise<{
    page?: string;
    limit?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = +(searchParams?.page || 1);
  const limit = +(searchParams?.limit || 10);

  const session = await getServerSession(authOptions);
  const res = await sendRequest<IBackendRes<IModelPaginate<ITicket>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/tickets`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    queryParams: {
      page,
      limit,
    },
    nextOption: {
      cache: "no-store",
    },
  });

  return (
    <div className="Ticket">
      <TicketList
        tickets={res.data?.result || []}
        pagination={{
          page,
          limit,
          total: +(res.data?.meta?.total || 0),
        }}
      />
    </div>
  );
}
