"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LangCode, getT, T } from "@/lib/translations";

interface LangCtx { lang: LangCode; setLang: (l: LangCode) => void; t: T; }

const Ctx = createContext<LangCtx>({ lang: "en", setLang: () => {}, t: getT("en") });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("harvaan_lang") as LangCode | null;
    if (saved) setLangState(saved);
  }, []);

  const setLang = (l: LangCode) => {
    setLangState(l);
    localStorage.setItem("harvaan_lang", l);
  };

  return <Ctx.Provider value={{ lang, setLang, t: getT(lang) }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
