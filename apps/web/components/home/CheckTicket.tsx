"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleCheckTicket } from "@/utils/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import moment from "moment";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

type Props = {
  provinces: IProvince[];
};

const formSchema = z.object({
  province: z.string().nonempty("Province is required"),
  date: z.date(),
  ticketNumber: z
    .string()
    .nonempty("Ticket Number is required")
    .length(6, "Must be 6 numbers"),
});

const CheckTicket: React.FC<Props> = ({ provinces }) => {
  const [results, setResults] = useState<ICheckTicketResult[] | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      province: "",
      date: new Date(),
      ticketNumber: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await handleCheckTicket({
      province: data.province,
      date: moment(data.date).format("YYYY-MM-DD"),
      ticketNumber: data.ticketNumber,
    });
    setResults(res.data || []);
  }

  return (
    <div className="w-full max-w-[500px]">
      <form id="form-check-ticket" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex gap-4">
            <div className="space-y-4">
              <Controller
                name="province"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Provinces</SelectLabel>
                          {provinces.map((p) => (
                            <SelectItem key={p.id} value={p.code}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="ticketNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      id="form-check-ticket-ticket-number"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter ticket number"
                      autoComplete="off"
                      maxLength={6}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button
                type="submit"
                form="form-check-ticket"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Checking..." : "Check"}
              </Button>
            </div>
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Calendar
                    selected={field.value}
                    onSelect={field.onChange}
                    mode="single"
                    className="rounded-lg border"
                    captionLayout="dropdown"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </form>
      {results && (
        <p>
          {results.length !== 0
            ? `You won ${results[0].prize}`
            : `You didn’t win any prize`}
        </p>
      )}
    </div>
  );
};

export default CheckTicket;
