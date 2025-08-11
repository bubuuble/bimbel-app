'use client'

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

type Language = 'id' | 'en';

const languages = {
  id: { name: 'Bahasa Indonesia', flag: '🇮🇩' },
  en: { name: 'English', flag: '🇺🇸' }
};

export default function LanguageSwitcher() {
  const { language: currentLanguage, setLanguage, t } = useLanguage();

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="text-sm">{languages[currentLanguage].flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(languages).map(([code, { name, flag }]) => (
          <DropdownMenuItem 
            key={code}
            onClick={() => changeLanguage(code as Language)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span>{flag}</span>
              <span>{name}</span>
            </div>
            {currentLanguage === code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
