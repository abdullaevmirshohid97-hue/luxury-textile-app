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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useTranslations, useLanguageStore } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { useFormOptions } from "@/hooks/useFormOptions";
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle, Building2 } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const QUALIFIED_VOLUMES = ["500-1000", "1000-5000", "5000+"];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company name is required"),
  role: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  sector: z.string().min(1, "Please select a sector"),
  volume: z.string().min(1, "Please select an estimated volume").refine(
    val => QUALIFIED_VOLUMES.includes(val),
    { message: "Minimum order quantity is 500 units. For smaller orders, please contact our retail partners." }
  ),
  timeline: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  moqConfirm: z.boolean().refine(val => val === true, { message: "Please confirm you meet the minimum order quantity" }),
});

type FormData = z.infer<typeof formSchema>;

export default function Contact() {
  const t = useTranslations();
  const { language } = useLanguageStore();
  const { toast } = useToast();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const productSlug = params.get("product");
  const [submitted, setSubmitted] = useState(false);

  const { options: sectorOptions, isLoading: sectorLoading } = useFormOptions("sector");
  const { options: volumeOptions, isLoading: volumeLoading } = useFormOptions("volume");

  const labels = {
    uz: {
      title: "B2B So'rov",
      subtitle: "Biznes hamkorlik uchun so'rov yuboring",
      company: "Kompaniya nomi",
      role: "Lavozim (ixtiyoriy)",
      sector: "Biznes yo'nalishi",
      volume: "Buyurtma hajmi (talab qilinadi)",
      timeline: "Loyiha muddati (ixtiyoriy)",
      projectDetails: "Loyiha tafsilotlari",
      success: "Rahmat!",
      successText: "So'rovingiz qabul qilindi. Biz odatda 24–48 soat ichida javob beramiz.",
      sendAnother: "Yangi so'rov yuborish",
    },
    ru: {
      title: "B2B-запрос",
      subtitle: "Отправьте запрос на бизнес-сотрудничество",
      company: "Название компании",
      role: "Должность (опционально)",
      sector: "Направление бизнеса",
      volume: "Объём заказа (обязательно)",
      timeline: "Сроки проекта (опционально)",
      projectDetails: "Детали проекта",
      success: "Спасибо!",
      successText: "Ваш запрос получен. Мы обычно отвечаем в течение 24–48 часов.",
      sendAnother: "Отправить новый запрос",
    },
    en: {
      title: "B2B Inquiry",
      subtitle: "Submit a business partnership inquiry",
      company: "Company Name",
      role: "Your Role (optional)",
      sector: "Business Sector",
      volume: "Order Volume (required)",
      timeline: "Project Timeline (optional)",
      projectDetails: "Project Details",
      success: "Thank you!",
      successText: "Your inquiry has been received. We typically respond within 24–48 hours.",
      sendAnother: "Submit another inquiry",
    },
  };

  const timelineOptions = {
    uz: [
      { value: "immediate", label: "Darhol (1 oy ichida)" },
      { value: "1-3months", label: "1–3 oy" },
      { value: "3-6months", label: "3–6 oy" },
      { value: "6months+", label: "6+ oy" },
      { value: "exploring", label: "Hali aniqlanmagan" },
    ],
    ru: [
      { value: "immediate", label: "Срочно (в течение 1 месяца)" },
      { value: "1-3months", label: "1–3 месяца" },
      { value: "3-6months", label: "3–6 месяцев" },
      { value: "6months+", label: "6+ месяцев" },
      { value: "exploring", label: "Ещё не определились" },
    ],
    en: [
      { value: "immediate", label: "Immediate (within 1 month)" },
      { value: "1-3months", label: "1–3 months" },
      { value: "3-6months", label: "3–6 months" },
      { value: "6months+", label: "6+ months" },
      { value: "exploring", label: "Still exploring" },
    ],
  };

  const l = labels[language];

  const moqNotice = {
    uz: {
      title: "Minimal Buyurtma Hajmi",
      text: "Biz 500+ dona buyurtmalar bilan ishlaymiz. Agar sizning ehtiyojlaringiz kichikroq bo'lsa, chakana do'konlarimizga tashrif buyuring.",
      badge: "B2B faqat",
    },
    ru: {
      title: "Минимальный объём заказа",
      text: "Мы работаем с заказами от 500+ единиц. Для меньших объёмов посетите наши розничные партнёры.",
      badge: "Только B2B",
    },
    en: {
      title: "Minimum Order Quantity",
      text: "We work with orders of 500+ units. For smaller quantities, please visit our retail partners.",
      badge: "B2B only",
    },
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      role: "",
      email: "",
      phone: "",
      sector: "",
      volume: "",
      timeline: "",
      message: productSlug ? `Interested in: ${productSlug}` : "",
      moqConfirm: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/inquiries", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: `[B2B Inquiry]\nCompany: ${data.company}\nRole: ${data.role || 'Not specified'}\nSector: ${data.sector}\nVolume: ${data.volume || 'Not specified'}\nTimeline: ${data.timeline || 'Not specified'}\n\n${data.message}`,
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
        description: "Failed to send your inquiry. Please try again.",
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
          <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-4 block">
            B2B
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4" data-testid="text-contact-title">
            {l.title}
          </h1>
          <p className="text-body text-lg text-muted-foreground" data-testid="text-contact-subtitle">
            {l.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* MOQ Filtering Notice */}
            <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-lg" data-testid="notice-moq">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary/70 bg-primary/10 px-2 py-0.5 rounded" data-testid="badge-b2b-only">
                  {moqNotice[language].badge}
                </span>
              </div>
              <h4 className="font-semibold text-sm mb-1" data-testid="text-moq-title">{moqNotice[language].title}</h4>
              <p className="text-sm text-muted-foreground" data-testid="text-moq-desc">{moqNotice[language].text}</p>
            </div>

            <Card>
              <CardContent className="p-6 sm:p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{l.success}</h3>
                    <p className="text-body text-muted-foreground">
                      {l.successText}
                    </p>
                    <Button
                      className="mt-6 text-body"
                      onClick={() => setSubmitted(false)}
                      data-testid="button-send-another"
                    >
                      {l.sendAnother}
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
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-body">{l.company}</FormLabel>
                            <FormControl>
                              <Input {...field} className="text-body" data-testid="input-company" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-body">{l.role}</FormLabel>
                            <FormControl>
                              <Input {...field} className="text-body" data-testid="input-role" placeholder={language === 'uz' ? "Masalan: Xaridlar bo'limi boshlig'i" : language === 'ru' ? "Например: Руководитель отдела закупок" : "e.g., Procurement Manager"} />
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
                        name="sector"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-body">{l.sector}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-body" data-testid="select-sector">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sectorLoading ? (
                                  <SelectItem value="_loading" disabled>Loading...</SelectItem>
                                ) : sectorOptions.length === 0 ? (
                                  <SelectItem value="_empty" disabled>No options available</SelectItem>
                                ) : (
                                  sectorOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="volume"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-body">{l.volume}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-body" data-testid="select-volume">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {volumeLoading ? (
                                  <SelectItem value="_loading" disabled>Loading...</SelectItem>
                                ) : volumeOptions.length === 0 ? (
                                  <SelectItem value="_empty" disabled>No options available</SelectItem>
                                ) : (
                                  volumeOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-body">{l.timeline}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="text-body" data-testid="select-timeline">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timelineOptions[language].map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-body">{l.projectDetails}</FormLabel>
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

                      {/* MOQ Confirmation Checkbox */}
                      <FormField
                        control={form.control}
                        name="moqConfirm"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-primary/10 p-4 bg-primary/[0.02]">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-moq-confirm"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-medium cursor-pointer">
                                {language === 'uz' ? 'Men minimal buyurtma hajmi (500+ dona) talablarini tushunaman va qabul qilaman.' : 
                                 language === 'ru' ? 'Я понимаю и принимаю требования к минимальному объёму заказа (500+ единиц).' : 
                                 'I understand and accept the minimum order quantity (500+ units) requirement.'}
                              </FormLabel>
                              <FormMessage />
                            </div>
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
                            {language === 'uz' ? 'Yuborilmoqda...' : language === 'ru' ? 'Отправка...' : 'Sending...'}
                          </>
                        ) : (
                          t.contact.send
                        )}
                      </Button>
                      <p className="text-sm text-muted-foreground text-center mt-4">
                        {language === 'uz' ? 'Biz odatda 24–48 soat ichida javob beramiz.' : 
                         language === 'ru' ? 'Мы обычно отвечаем в течение 24–48 часов.' : 
                         'We typically respond within 24–48 hours.'}
                      </p>
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
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">
                      {language === 'uz' ? 'B2B Bo\'limi' : language === 'ru' ? 'B2B-отдел' : 'B2B Department'}
                    </h3>
                    <p className="text-body text-muted-foreground">
                      {language === 'uz' ? 'Biznes hamkorlik uchun' : language === 'ru' ? 'Для бизнес-сотрудничества' : 'For business partnerships'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t.contact.email}</h3>
                    <a
                      href="mailto:mariamhome.uz@gmail.com"
                      className="text-body text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="link-email"
                    >
                      mariamhome.uz@gmail.com
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
                      href="tel:+998882599444"
                      className="text-body text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="link-phone"
                    >
                      +998 88 259 94 44
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
                      href="https://wa.me/998882599444"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="link-whatsapp"
                    >
                      +998 88 259 94 44
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t.contact.address}</h3>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Istiqbol+MFY+Turakurgan+1A+Namangan+Uzbekistan"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body text-muted-foreground hover:text-foreground transition-colors whitespace-pre-line"
                      data-testid="link-address"
                    >
                      {t.contact.fullAddress}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{t.contact.workingHours}</h3>
                    <p className="text-body text-muted-foreground">
                      {language === 'uz' ? 'Dush – Jum: 9:00 – 18:00' : language === 'ru' ? 'Пн – Пт: 9:00 – 18:00' : 'Mon – Fri: 9:00 – 18:00'}<br />
                      {language === 'uz' ? 'Shanba: 10:00 – 15:00' : language === 'ru' ? 'Сб: 10:00 – 15:00' : 'Sat: 10:00 – 15:00'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96471.98686399722!2d71.5969!3d41.0011!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38bb4f77096a9f79%3A0x5a42a5cb7a7c5c8a!2sNamangan%2C%20Uzbekistan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
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
