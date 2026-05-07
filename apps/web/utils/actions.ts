"use server";

import authOptions from "@/app/api/auth/auth.options";
import { getServerSession } from "next-auth";
import { sendRequest } from "@/utils/api";

export async function handleCheckTicket(
  dto: ICheckTicketDto,
): Promise<IBackendRes<ICheckTicketResult[]>> {
  const session = await getServerSession(authOptions);

  if (session) {
    const res = await sendRequest<IBackendRes<ICheckTicketResult[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/tickets/check`,
      method: "GET",
      queryParams: {
        province: dto.province,
        date: dto.date,
        ticketNumber: dto.ticketNumber,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });
    return res;
  } else {
    const res = await sendRequest<IBackendRes<ICheckTicketResult[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/tickets/check/public`,
      method: "GET",
      queryParams: {
        province: dto.province,
        date: dto.date,
        ticketNumber: dto.ticketNumber,
      },
    });
    return res;
  }
}
