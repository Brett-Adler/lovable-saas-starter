import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Schema = z.object({
  display_name: z.string().trim().min(1, "Required").max(120),
  avatar_url: z.string().trim().url("Must be a URL").max(2000).or(z.literal("")).optional(),
  phone: z.string().trim().max(40).or(z.literal("")).optional(),
  timezone: z.string().trim().max(80).or(z.literal("")).optional(),
  locale: z.string().trim().max(20).or(z.literal("")).optional(),
});

type Values = z.infer<typeof Schema>;

export const ProfileTab = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const form = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { display_name: "", avatar_url: "", phone: "", timezone: "", locale: "" },
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name,avatar_url,phone,timezone,locale")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        form.reset({
          display_name: data?.display_name ?? "",
          avatar_url: data?.avatar_url ?? "",
          phone: data?.phone ?? "",
          timezone: data?.timezone ?? "",
          locale: data?.locale ?? "",
        });
        setLoading(false);
      });
  }, [user, form]);

  const onSubmit = async (v: Values) => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: v.display_name,
        avatar_url: v.avatar_url || null,
        phone: v.phone || null,
        timezone: v.timezone || null,
        locale: v.locale || null,
      })
      .eq("id", user.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const avatarUrl = form.watch("avatar_url");
  const displayName = form.watch("display_name");
  const initials = (displayName || user?.email || "?").slice(0, 2).toUpperCase();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>How you appear across the app.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="text-sm text-muted-foreground">
                <div className="font-medium text-foreground">{user?.email}</div>
                Paste an image URL below to update your avatar.
              </div>
            </div>

            <FormField
              control={form.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl><Input autoComplete="name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl><Input type="url" placeholder="https://…" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input type="tel" autoComplete="tel" placeholder="+1 555 …" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locale</FormLabel>
                    <FormControl><Input placeholder="en" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl><Input placeholder="UTC" {...field} /></FormControl>
                  <FormDescription>IANA name (e.g. <code>America/New_York</code>).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Save profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
