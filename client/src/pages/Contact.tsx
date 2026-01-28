import { useState } from "react";
import { useSearch } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function Contact() {
  const t = useTranslations();
  const { toast } = useToast();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const productSlug = params.get("product");
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: productSlug ? `I'm interested in the product: ${productSlug}` : "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/inquiries", {
        ...data,
        productId: null,
      });
      return response;
    },
    onSuccess: () => {
      setSubmitted(true);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4" data-testid="text-contact-title">
            {t.contact.title}
          </h1>
          <p className="text-body text-lg text-muted-foreground" data-testid="text-contact-subtitle">
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6 sm:p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Thank you!</h3>
                    <p className="text-body text-muted-foreground">
                      We've received your message and will get back to you soon.
                    </p>
                    <Button
                      className="mt-6 text-body"
                      onClick={() => setSubmitted(false)}
                      data-testid="button-send-another"
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-body">{t.contact.name}</FormLabel>
                            <FormControl>
                              <Input {...field} className="text-body" data-testid="input-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-body">{t.contact.email}</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} className="text-body" data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-body">{t.contact.phone}</FormLabel>
                            <FormControl>
                              <Input type="tel" {...field} className="text-body" data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-body">{t.contact.message}</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={5}
                                className="text-body resize-none"
                                data-testid="input-message"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full text-body"
                        disabled={submitMutation.isPending}
                        data-testid="button-submit"
                      >
                        {submitMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          t.contact.send
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <Card>
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t.contact.email}</h3>
                    <a
                      href="mailto:info@marycollection.com"
                      className="text-body text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="link-email"
                    >
                      info@marycollection.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t.contact.phone}</h3>
                    <a
                      href="tel:+998901234567"
                      className="text-body text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="link-phone"
                    >
                      +998 90 123 45 67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <SiWhatsapp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <a
                      href="https://wa.me/998901234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="link-whatsapp"
                    >
                      +998 90 123 45 67
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t.contact.address}</h3>
                    <p className="text-body text-muted-foreground">
                      Tashkent, Uzbekistan<br />
                      Mirzo Ulugbek district
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t.contact.workingHours}</h3>
                    <p className="text-body text-muted-foreground">
                      Mon - Fri: 9:00 - 18:00<br />
                      Sat: 10:00 - 15:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d191885.50264869612!2d69.1393354625!3d41.31151310000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mary Collection Location"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
