import CheckTicketForm from "@/components/home/CheckTicketForm";
import { sendRequest } from "@/utils/api";

export default async function HomePage() {
  const res = await sendRequest<IBackendRes<IModelPaginate<IProvince>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/tickets/provinces`,
    method: "GET",
    queryParams: {
      page: 1,
      limit: 100,
    },
  });

  return (
    <div className="Home">
      <CheckTicketForm provinces={res?.data?.result || []} />
    </div>
  );
}
