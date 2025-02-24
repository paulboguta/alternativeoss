"use client";

import { subscribeToNewsletter } from "@/actions/email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const { execute, status } = useServerAction(subscribeToNewsletter);
  const isPending = status === "pending";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const [result, error] = await execute({ email });
    if (error) {
      toast.error(error.message);
      return;
    }

    if (result?.success) {
      toast.success(result.message);
      setEmail("");
    } else if (result) {
      toast.error(result.message);
    }
  };

  return (
    <>
      <p className="max-w-[550px] text-lg text-white font-light leading-tight">
        Find and compare the best open source alternatives to popular software
        tools. Get weekly recommendations in your inbox.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-3 flex w-full max-w-sm space-x-2"
      >
        <Input
          type="email"
          placeholder="Enter your email"
          className="h-9 focus-visible:ring-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
        <Button
          type="submit"
          className="h-9 cursor-pointer"
          disabled={isPending}
        >
          {isPending ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </>
  );
}
