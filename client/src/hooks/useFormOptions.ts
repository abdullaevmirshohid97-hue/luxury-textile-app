import { useQuery } from "@tanstack/react-query";
import { useLanguageStore } from "@/lib/i18n";
import type { FormOption } from "@shared/schema";

function getLocalizedLabel(option: FormOption, lang: string): string {
  const labels = { uz: option.labelUz, ru: option.labelRu, en: option.labelEn };
  return labels[lang as keyof typeof labels] || option.labelEn;
}

export function useFormOptions(field: string) {
  const { language } = useLanguageStore();
  
  const { data: options, isLoading, error, isError } = useQuery<FormOption[]>({
    queryKey: [`/api/content/form-options/${field}`],
  });

  const localizedOptions = options
    ?.filter(opt => opt.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(opt => ({
      value: opt.optionValue,
      label: getLocalizedLabel(opt, language),
    })) || [];

  return { options: localizedOptions, isLoading, error, isError };
}
