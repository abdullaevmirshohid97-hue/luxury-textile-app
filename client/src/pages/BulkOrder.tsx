import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Package, CheckCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslations, useLanguageStore } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { GLOBAL_CONTACT } from "@shared/globalConfig";

export default function BulkOrder() {
  const t = useTranslations();
  const { language } = useLanguageStore();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    businessType: "",
    productType: "",
    estimatedQuantity: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest("POST", "/api/bulk-order", { ...data, language });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: language === "ru" ? "Успешно!" : language === "uz" ? "Muvaffaqiyatli!" : "Success!",
        description: t.bulkOrder.success,
      });
    },
    onError: () => {
      toast({
        title: language === "ru" ? "Ошибка" : language === "uz" ? "Xatolik" : "Error",
        description: language === "ru" ? "Произошла ошибка. Попробуйте позже." : 
                     language === "uz" ? "Xatolik yuz berdi. Keyinroq urinib ko'ring." :
                     "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || !formData.businessType || !formData.productType) {
      toast({
        title: language === "ru" ? "Заполните все поля" : language === "uz" ? "Barcha maydonlarni to'ldiring" : "Fill all fields",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-serif mb-4">{t.bulkOrder.success}</h1>
          <p className="text-muted-foreground mb-6">
            {language === "ru" ? `Телефон: ${GLOBAL_CONTACT.phone}` :
             language === "uz" ? `Telefon: ${GLOBAL_CONTACT.phone}` :
             `Phone: ${GLOBAL_CONTACT.phone}`}
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" data-testid="button-new-order">
            {language === "ru" ? "Новый запрос" : language === "uz" ? "Yangi so'rov" : "New Request"}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Package className="h-4 w-4" />
              <span className="text-sm font-medium">B2B</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-6" data-testid="text-page-title">
              {t.bulkOrder.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t.bulkOrder.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {t.bulkOrder.formTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.bulkOrder.phone} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    data-testid="input-phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">{t.bulkOrder.businessType} *</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                  >
                    <SelectTrigger id="businessType" data-testid="select-business-type">
                      <SelectValue placeholder={t.bulkOrder.businessType} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spa">{t.bulkOrder.businessTypes.spa}</SelectItem>
                      <SelectItem value="hotel">{t.bulkOrder.businessTypes.hotel}</SelectItem>
                      <SelectItem value="barber">{t.bulkOrder.businessTypes.barber}</SelectItem>
                      <SelectItem value="retail">{t.bulkOrder.businessTypes.retail}</SelectItem>
                      <SelectItem value="other">{t.bulkOrder.businessTypes.other}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productType">{t.bulkOrder.productType} *</Label>
                  <Select
                    value={formData.productType}
                    onValueChange={(value) => setFormData({ ...formData, productType: value })}
                  >
                    <SelectTrigger id="productType" data-testid="select-product-type">
                      <SelectValue placeholder={t.bulkOrder.productType} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bathrobes">{t.bulkOrder.productTypes.bathrobes}</SelectItem>
                      <SelectItem value="towels">{t.bulkOrder.productTypes.towels}</SelectItem>
                      <SelectItem value="sets">{t.bulkOrder.productTypes.sets}</SelectItem>
                      <SelectItem value="accessories">{t.bulkOrder.productTypes.accessories}</SelectItem>
                      <SelectItem value="mixed">{t.bulkOrder.productTypes.mixed}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">{t.bulkOrder.quantity}</Label>
                  <Select
                    value={formData.estimatedQuantity}
                    onValueChange={(value) => setFormData({ ...formData, estimatedQuantity: value })}
                  >
                    <SelectTrigger id="quantity" data-testid="select-quantity">
                      <SelectValue placeholder={t.bulkOrder.quantity} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50-100">{t.bulkOrder.quantities.small}</SelectItem>
                      <SelectItem value="100-500">{t.bulkOrder.quantities.medium}</SelectItem>
                      <SelectItem value="500-1000">{t.bulkOrder.quantities.large}</SelectItem>
                      <SelectItem value="1000+">{t.bulkOrder.quantities.enterprise}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t.bulkOrder.message}</Label>
                  <Textarea
                    id="message"
                    placeholder={t.bulkOrder.message}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    data-testid="textarea-message"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full" 
                  disabled={mutation.isPending}
                  data-testid="button-submit-order"
                >
                  {mutation.isPending ? "..." : t.bulkOrder.submit}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-muted-foreground">
            <p className="mb-2">
              {language === "ru" ? "Или свяжитесь напрямую:" : 
               language === "uz" ? "Yoki to'g'ridan-to'g'ri bog'laning:" :
               "Or contact us directly:"}
            </p>
            <p className="font-medium text-foreground">{GLOBAL_CONTACT.phone}</p>
            <p className="text-sm">{GLOBAL_CONTACT.email}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
