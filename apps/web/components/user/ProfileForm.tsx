"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { handleSaveProfile } from "@/utils/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon } from "lucide-react";
import moment from "moment";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type Props = {
  user: IUser | null;
};

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  dob: z.date(),
});

const ProfileForm: React.FC<Props> = ({ user }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      dob: user?.dob ? moment(user?.dob, "YYYY-MM-DD").toDate() : new Date(),
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await handleSaveProfile({
        name: data.name,
        dob: moment(data.dob).format("YYYY-MM-DD"),
      });
      toast.success("Update successfully");
    } catch (err) {
      toast.error("Failed to update");
    }
  }

  return (
    <div>
      <p>Profile</p>
      <form id="form-profile" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-profile-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="form-profile-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter name"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="dob"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-profile-name">
                  Date of Birth
                </FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!field.value}
                      className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                    >
                      {field.value ? (
                        moment(field.value).format("DD/MM/YYYY")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button
            type="submit"
            form="form-profile"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default ProfileForm;
