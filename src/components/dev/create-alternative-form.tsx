"use client";

import { createAlternativeAction } from "@/app/dev/create-alternative/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  createAlternativeFormSchema,
  type CreateAlternativeForm,
} from "@/types/alternative";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import { LoaderButton } from "../loader-button";

export function CreateAlternativeForm() {
  const form = useForm<CreateAlternativeForm>({
    resolver: zodResolver(createAlternativeFormSchema),
    defaultValues: {
      name: "",
      url: "",
      price: 0,
      pricingModel: "",
      isPaid: true,
    },
  });

  const { execute, isPending } = useServerAction(createAlternativeAction);

  function onSubmit(values: CreateAlternativeForm) {
    execute(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Alternative</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternative Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Alternative name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricingModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pricing Model</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. monthly, yearly, one-time"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPaid"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Paid Alternative
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Whether this alternative requires payment to use
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <LoaderButton isPending={isPending}>
              Create Alternative
            </LoaderButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
