import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Globe } from "lucide-react";
import { useTranslations, useLanguageStore } from "@/lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type LoginData = {
  username: string;
  password: string;
};

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const t = useTranslations();
  const { language, setLanguage } = useLanguageStore();

  const loginSchema = z.object({
    username: z.string().min(1, t.admin.usernameRequired),
    password: z.string().min(1, t.admin.passwordRequired),
  });

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response;
    },
    onSuccess: () => {
      setLocation("/admin");
    },
    onError: () => {
      toast({
        title: t.admin.loginFailed,
        description: t.admin.invalidCredentials,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" data-testid="button-language-switcher">
              <Globe className="h-4 w-4 mr-2" />
              {language.toUpperCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setLanguage("en")} data-testid="button-lang-en">English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("ru")} data-testid="button-lang-ru">Русский</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("uz")} data-testid="button-lang-uz">O'zbekcha</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t.admin.maryCollection}</CardTitle>
          <p className="text-body text-sm text-muted-foreground">{t.admin.panel}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-body">{t.admin.username}</FormLabel>
                    <FormControl>
                      <Input {...field} className="text-body" data-testid="input-username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-body">{t.admin.password}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="text-body" data-testid="input-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full text-body"
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.admin.loggingIn}
                  </>
                ) : (
                  t.admin.login
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
