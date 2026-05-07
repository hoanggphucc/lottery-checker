import CheckTicket from "@/components/home/CheckTicket";
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
    <div className="flex justify-center">
      <CheckTicket provinces={res?.data?.result || []} />
    </div>
  );
}
