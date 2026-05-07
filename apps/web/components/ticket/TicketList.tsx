"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import moment from "moment";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/utils/queryParams";

type Props = {
  tickets: ITicket[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
};

const TicketList: React.FC<Props> = ({
  tickets,
  pagination: { page, limit, total },
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleChangeLimit = (size: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "limit",
      value: size,
      pathname,
    });

    router.push(newUrl, { scroll: true });
  };

  const handleChangePage = (nextPage: number) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value: nextPage.toString(),
      pathname,
    });

    router.push(newUrl, { scroll: true });
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableCaption>My tickets</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket Number</TableHead>
            <TableHead>Province</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket._id}>
              <TableCell>{ticket.ticketNumber}</TableCell>
              <TableCell>{ticket.province}</TableCell>
              <TableCell>
                {moment(ticket.date, "YYYY-MM-DD").format("DD/MM/YYYY")}
              </TableCell>
              <TableCell className="text-right">
                {ticket.isWinner ? "Won" : "Lose"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <Select
            defaultValue={limit.toString()}
            onValueChange={handleChangeLimit}
          >
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            {page > 1 && (
              <>
                <PaginationItem onClick={() => handleChangePage(page - 1)}>
                  <PaginationPrevious />
                </PaginationItem>
                <PaginationItem onClick={() => handleChangePage(page - 1)}>
                  <PaginationLink>{page - 1}</PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationLink isActive>{page}</PaginationLink>
            </PaginationItem>
            <PaginationItem onClick={() => handleChangePage(page + 1)}>
              <PaginationLink>{page + 1}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem onClick={() => handleChangePage(page + 1)}>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default TicketList;
