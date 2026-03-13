"use client";

import React, { useState, useEffect, useCallback, useActionState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type {
  Question,
  QuestionType,
  MultipleChoiceOption,
  TrueFalseStatement,
  MatchingPrompt,
  MatchingOption,
  MatchingCorrectPair,
} from "@/lib/types";
import {
  addQuestionToTest,
  updateQuestion,
  deleteQuestion,
} from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Trash2,
  X,
  Loader2,
  Edit,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DOMPurify from "dompurify";
import dynamic from "next/dynamic";
import { Alert } from "@/components/ui/alert";

// --- HELPER TYPES ---
type NewOption = { text: string; is_correct: boolean };
type NewStatement = { text: string; is_true: boolean };
type NewMatchItem = { id: string | number; text: string };
type NewPair = { promptId: string | number; optionId: string | number | null };

const ClientPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Sebelumnya</span>
      </Button>
      <span className="text-sm font-medium text-muted-foreground">
        Halaman {currentPage} dari {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span className="sr-only">Berikutnya</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

const TinyEditor = dynamic(
  () => import("@/components/ui/tinymce-editor").then((mod) => mod.TinyEditor),
  {
    ssr: false, // Editor ini juga hanya bisa berjalan di client
    loading: () => (
      <div className="border rounded-md min-h-[500px] flex items-center justify-center">
        <p>Memuat editor canggih...</p>
      </div>
    ),
  }
);

// --- SUB-KOMPONEN FORM: Pilihan Ganda ---
const MultipleChoiceForm = ({
  options,
  setOptions,
}: {
  options: NewOption[];
  setOptions: React.Dispatch<React.SetStateAction<NewOption[]>>;
}) => {
  const [isComplex, setIsComplex] = useState(
    options.filter((o) => o.is_correct).length > 1
  );

  // Handler ini sekarang menerima konten HTML dari TinyEditor
  const handleOptionTextChange = (index: number, content: string) => {
    setOptions((prev) =>
      prev.map((o, i) => (i === index ? { ...o, text: content } : o))
    );
  };

  const handleCorrectChange = (index: number, checked: boolean) => {
    if (!isComplex) {
      setOptions((prev) =>
        prev.map((o, i) => ({ ...o, is_correct: i === index }))
      );
    } else {
      setOptions((prev) =>
        prev.map((o, i) => (i === index ? { ...o, is_correct: checked } : o))
      );
    }
  };

  const addOption = () =>
    setOptions((prev) => [...prev, { text: "", is_correct: false }]);
  const removeOption = (index: number) =>
    setOptions((prev) => prev.filter((_, i) => i !== index));

  useEffect(() => {
    setIsComplex(options.filter((o) => o.is_correct).length > 1);
  }, [options]);

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isComplex"
          checked={isComplex}
          onCheckedChange={(c) => setIsComplex(c as boolean)}
        />
        <Label htmlFor="isComplex">Izinkan beberapa jawaban benar</Label>
      </div>
      <Label>Pilihan Jawaban</Label>
      <div className="space-y-3">
        {options.map((opt, index) => (
          // [PERUBAHAN UI] Menggunakan items-start agar sejajar dengan RTE yang lebih tinggi
          <div key={index} className="flex items-start gap-3">
            <div className="flex items-center pt-2 gap-2">
              {" "}
              {/* Wrapper untuk label dan checkbox */}
              <Label
                htmlFor={`opt-${index}`}
                className="flex h-9 w-9 items-center justify-center rounded-md border font-mono flex-shrink-0"
              >
                {String.fromCharCode(65 + index)}
              </Label>
              <Checkbox
                id={`opt-${index}`}
                checked={opt.is_correct}
                onCheckedChange={(c) =>
                  handleCorrectChange(index, c as boolean)
                }
              />
            </div>

            {/* [PERUBAHAN UTAMA] Mengganti <Input> dengan <TinyEditor> */}
            <div className="w-full">
              <TinyEditor
                variant="compact"
                value={opt.text}
                onChange={(content) => handleOptionTextChange(index, content)}
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive mt-2" // Beri sedikit margin atas
              onClick={() => removeOption(index)}
              disabled={options.length <= 2}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addOption}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Tambah Pilihan
      </Button>
      <input
        type="hidden"
        name="options"
        value={JSON.stringify(
          options.map((o) => ({
            option_text: o.text,
            is_correct: o.is_correct,
          }))
        )}
      />
    </div>
  );
};

// --- SUB-KOMPONEN FORM: Benar/Salah ---
const TrueFalseForm = ({
  statements,
  setStatements,
}: {
  statements: NewStatement[];
  setStatements: React.Dispatch<React.SetStateAction<NewStatement[]>>;
}) => {
  // Handler sekarang menerima konten HTML
  const handleTextChange = (index: number, content: string) =>
    setStatements((prev) =>
      prev.map((s, i) => (i === index ? { ...s, text: content } : s))
    );

  const handleBoolChange = (index: number, checked: boolean) =>
    setStatements((prev) =>
      prev.map((s, i) => (i === index ? { ...s, is_true: checked } : s))
    );

  const addItem = () =>
    setStatements((prev) => [...prev, { text: "", is_true: true }]);
  const removeItem = (index: number) =>
    setStatements((prev) => prev.filter((_, i) => i !== index));

  return (
    <div className="space-y-4 border-t pt-4">
      <Label>Daftar Pernyataan</Label>
      <div className="space-y-3">
        {statements.map((stmt, index) => (
          <div key={index} className="flex items-start gap-3">
            {/* [PERUBAHAN UTAMA] Mengganti <Input> dengan <TinyEditor> */}
            <div className="w-full">
              <TinyEditor
                variant="compact"
                value={stmt.text}
                onChange={(content) => handleTextChange(index, content)}
              />
            </div>

            <div className="flex flex-col items-center gap-2 pt-2">
              {" "}
              {/* Wrapper untuk Switch dan Tombol Hapus */}
              <div className="flex items-center gap-2 rounded-md border p-2 text-sm">
                <Label htmlFor={`tf-${index}`}>Benar</Label>
                <Switch
                  id={`tf-${index}`}
                  checked={stmt.is_true}
                  onCheckedChange={(c) => handleBoolChange(index, c)}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeItem(index)}
                disabled={statements.length <= 1}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Tambah Pernyataan
      </Button>
      <input
        type="hidden"
        name="statements"
        value={JSON.stringify(
          statements.map((s) => ({
            statement_text: s.text,
            is_true: s.is_true,
          }))
        )}
      />
    </div>
  );
};

// --- SUB-KOMPONEN FORM: Menjodohkan ---
const MatchingForm = ({
  prompts,
  setPrompts,
  matchOptions,
  setMatchOptions,
  pairs,
  setPairs,
}: {
  prompts: NewMatchItem[];
  setPrompts: React.Dispatch<React.SetStateAction<NewMatchItem[]>>;
  matchOptions: NewMatchItem[];
  setMatchOptions: React.Dispatch<React.SetStateAction<NewMatchItem[]>>;
  pairs: NewPair[];
  setPairs: React.Dispatch<React.SetStateAction<NewPair[]>>;
}) => {
  const addItem = (
    setter: React.Dispatch<React.SetStateAction<NewMatchItem[]>>
  ) => setter((prev) => [...prev, { id: Date.now(), text: "" }]);

  const removeItem = (
    id: string | number,
    setter: React.Dispatch<React.SetStateAction<NewMatchItem[]>>
  ) => setter((prev) => prev.filter((item) => item.id !== id));

  // Handler sekarang menerima konten HTML
  const updateText = (
    id: string | number,
    content: string,
    setter: React.Dispatch<React.SetStateAction<NewMatchItem[]>>
  ) =>
    setter((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: content } : item))
    );
  const updatePair = (promptId: string | number, optionId: string | number) => {
    setPairs((prev) => {
      const newPairs = prev.filter((p) => p.promptId !== promptId);
      return [...newPairs, { promptId, optionId }];
    });
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom A (Prompts) */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Kolom A (Prompts)</Label>
          {prompts.map((p) => (
            <div key={p.id} className="space-y-2">
              <TinyEditor
                variant="compact"
                value={p.text}
                onChange={(content) => updateText(p.id, content, setPrompts)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-destructive"
                onClick={() => removeItem(p.id, setPrompts)}
                disabled={prompts.length <= 1}
              >
                <X className="h-4 w-4 mr-2" /> Hapus Prompt
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => addItem(setPrompts)}
            className="w-full"
          >
            <Plus className="h-4 w-4" /> Tambah Prompt
          </Button>
        </div>

        {/* Kolom B (Pilihan) */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Kolom B (Pilihan)</Label>
          {matchOptions.map((o) => (
            <div key={o.id} className="space-y-2">
              <TinyEditor
                variant="compact"
                value={o.text}
                onChange={(content) =>
                  updateText(o.id, content, setMatchOptions)
                }
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-destructive"
                onClick={() => removeItem(o.id, setMatchOptions)}
                disabled={matchOptions.length <= 1}
              >
                <X className="h-4 w-4 mr-2" /> Hapus Pilihan
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => addItem(setMatchOptions)}
            className="w-full"
          >
            <Plus className="h-4 w-4" /> Tambah Pilihan
          </Button>
        </div>
      </div>
      <div className="border-t pt-4 space-y-6">
        <Label className="text-lg font-semibold">Kunci Jawaban</Label>
        <p className="text-sm text-muted-foreground">
          Jodohkan setiap item di Kolom A dengan satu item di Kolom B.
        </p>

        {prompts.map((prompt) => (
          <div key={prompt.id} className="p-4 border rounded-lg space-y-4">
            <Label>Jodoh untuk Prompt:</Label>
            {/* Tampilkan prompt (Kolom A) */}
            <div
              className="prose dark:prose-invert max-w-none prose-sm p-3 bg-muted/50 rounded-md"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(prompt.text),
              }}
            />

            {/* Tampilkan semua pilihan (Kolom B) sebagai radio button */}
            <RadioGroup
              value={pairs
                .find((p) => p.promptId === prompt.id)
                ?.optionId?.toString()}
              onValueChange={(optionId) => updatePair(prompt.id, optionId)}
            >
              <Label>Pilih Pasangan dari Kolom B:</Label>
              <div className="space-y-3">
                {matchOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-start gap-3 p-2 border rounded-md has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400"
                  >
                    <RadioGroupItem
                      value={option.id.toString()}
                      id={`${prompt.id}-${option.id}`}
                    />
                    <Label
                      htmlFor={`${prompt.id}-${option.id}`}
                      className="font-normal flex-1 cursor-pointer"
                    >
                      <div
                        className="prose dark:prose-invert max-w-none prose-sm"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(option.text),
                        }}
                      />
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        ))}
      </div>
      <input
        type="hidden"
        name="prompts"
        value={JSON.stringify(prompts.map((p) => ({ text: p.text })))}
      />
      <input
        type="hidden"
        name="matchOptions"
        value={JSON.stringify(matchOptions.map((o) => ({ text: o.text })))}
      />
      <input
        type="hidden"
        name="pairs"
        value={JSON.stringify(
          // Pindahkan logika perhitungan `finalPairs` ke sini.
          // Ini memastikan data yang paling baru yang digunakan saat form disubmit.
          pairs
            .map((p) => {
              const prompt = prompts.find((item) => item.id === p.promptId);
              const option = matchOptions.find(
                (item) => item.id.toString() === p.optionId?.toString()
              );
              if (prompt && option && prompt.text && option.text) {
                return { prompt_text: prompt.text, option_text: option.text };
              }
              return null;
            })
            .filter(Boolean)
        )}
      />
    </div>
  );
};

// --- KOMPONEN DETAIL SOAL (PREVIEW) ---
function QuestionDetail({
  question,
  questionIndex,
  onEdit,
  testInfo,
}: {
  question: Question;
  questionIndex: number;
  onEdit: () => void;
  testInfo: { points_per_question: number };
}) {
  const typeMap: Record<QuestionType, string> = {
    MULTIPLE_CHOICE: "Pilihan Ganda",
    TRUE_FALSE: "Benar/Salah",
    MATCHING: "Menjodohkan",
    ESSAY: "Esai",
  };

  const sanitizeConfig = {
    ADD_TAGS: ["table", "thead", "tbody", "tr", "th", "td", "caption"],
    ADD_ATTR: ["colspan", "rowspan", "scope"],
  };

  const sanitizeHTML = (html: string | undefined | null) => {
    if (typeof window === "undefined") {
      return html || "";
    }
    return DOMPurify.sanitize(html || "", sanitizeConfig);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-8 sticky top-4 h-fit">
      <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Soal #{questionIndex}</h3>
          <Button onClick={onEdit} variant="outline" size="sm" className="h-9 rounded-lg">
            <Edit className="h-4 w-4 mr-2" />
            Edit Soal
          </Button>
        </div>
        <div className="mt-2 text-sm text-slate-500">
          <Badge className="bg-indigo-100 hover:bg-indigo-100 text-indigo-700 border-none font-medium px-2 py-0.5 rounded-md">{typeMap[question.type]}</Badge>
          <span className="ml-2">({Number(testInfo.points_per_question).toFixed(2)} poin)</span>
        </div>
      </div>
      <div className="p-5 sm:p-6 space-y-6">
        {/* Teks Pertanyaan Utama */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Pertanyaan</Label>
          <div className="p-3 bg-muted/50 rounded-md">
            <div
              className="prose dark:prose-invert max-w-none prose-sm"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(question.question_text) }}
            />
          </div>
        </div>

        {/* --- Detail Berdasarkan Tipe Soal --- */}

        {question.type === "MULTIPLE_CHOICE" && question.multiple_choice_options && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Pilihan Jawaban</Label>
            <div className="space-y-2">
              {question.multiple_choice_options.map((option, index) => (
                <div key={option.id} className={cn("flex items-start gap-3 p-2 rounded-md border", option.is_correct ? "bg-green-50 border-green-200" : "bg-gray-50")}>
                  <span className="flex h-6 w-6 mt-1 items-center justify-center rounded-full bg-white border text-xs font-mono flex-shrink-0">{String.fromCharCode(65 + index)}</span>
                  <div className="prose dark:prose-invert max-w-none prose-sm flex-1" dangerouslySetInnerHTML={{ __html: sanitizeHTML(option.option_text) }} />
                  {option.is_correct && <Badge variant="default" className="text-xs self-center">Benar</Badge>}
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === "TRUE_FALSE" && question.true_false_statements && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Daftar Pernyataan</Label>
            <div className="space-y-2">
              {question.true_false_statements.map((statement, index) => (
                <div key={statement.id} className={cn("flex items-start gap-3 p-3 rounded-md border", statement.is_true ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
                  <span className="flex h-6 w-6 mt-1 items-center justify-center rounded-full bg-white border text-xs font-mono flex-shrink-0">{index + 1}</span>
                  <div className="prose dark:prose-invert max-w-none prose-sm flex-1" dangerouslySetInnerHTML={{ __html: sanitizeHTML(statement.statement_text) }} />
                  <Badge variant={statement.is_true ? "default" : "destructive"} className="text-xs self-center">{statement.is_true ? "Benar" : "Salah"}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === "MATCHING" && question.matching_prompts && question.matching_options && question.matching_correct_pairs && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Kolom A (Prompts)</Label>
                <div className="space-y-1">
                  {question.matching_prompts.map((prompt, index) => (
                    <div key={prompt.id} className="flex items-start gap-2 p-2 bg-blue-50 border-blue-200 border rounded-md">
                      <span className="flex h-6 w-6 mt-1 items-center justify-center rounded-full bg-white border text-xs font-mono flex-shrink-0">{index + 1}</span>
                      <div className="prose dark:prose-invert max-w-none prose-sm flex-1" dangerouslySetInnerHTML={{ __html: sanitizeHTML(prompt.prompt_text) }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Kolom B (Pilihan)</Label>
                <div className="space-y-1">
                  {question.matching_options.map((option, index) => (
                    <div key={option.id} className="flex items-start gap-2 p-2 bg-gray-50 border rounded-md">
                      <span className="flex h-6 w-6 mt-1 items-center justify-center rounded-full bg-white border text-xs font-mono flex-shrink-0">{String.fromCharCode(65 + index)}</span>
                      <div className="prose dark:prose-invert max-w-none prose-sm flex-1" dangerouslySetInnerHTML={{ __html: sanitizeHTML(option.option_text) }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Kunci Jawaban</Label>
              <div className="space-y-3">
                {question.matching_prompts.map((prompt, index) => {
                  const correctPair = question.matching_correct_pairs!.find(p => p.prompt_id === prompt.id);
                  if (!correctPair) return null;

                  const option = question.matching_options!.find(o => o.id === correctPair.option_id);
                  if (!option) return null;

                  const promptIndex = index + 1;
                  const optionIndex = question.matching_options!.findIndex(o => o.id === correctPair.option_id);
                  const optionLetter = optionIndex !== -1 ? String.fromCharCode(65 + optionIndex) : '';
                  
                  return (
                    <div key={prompt.id} className="p-3 bg-green-50 border-green-200 border rounded-lg space-y-3">
                      <div className="flex items-center text-sm font-semibold">
                        <span>Pasangan Soal #{promptIndex} → Pilihan {optionLetter}</span>
                      </div>
                      <div className="grid grid-cols-2 items-center gap-3">
                        <div className="prose dark:prose-invert max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: sanitizeHTML(prompt.prompt_text) }} />
                        <div className="prose dark:prose-invert max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: sanitizeHTML(option.option_text) }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {question.type === "ESSAY" && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Kunci Jawaban</Label>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div 
                    className="prose dark:prose-invert max-w-none prose-sm text-slate-700"
                    // [PERBAIKAN KUNCI] Akses elemen pertama dari array essay_answer
                    dangerouslySetInnerHTML={{ __html: sanitizeHTML(question.essay_answer?.answer_key) }}
                />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// --- DAFTAR SOAL (SISI KIRI) ---
function QuestionList({
  questions,
  totalQuestions,
  selectedQuestionId,
  onSelect,
  onDelete,
  currentPage,
  itemsPerPage,
}: {
  questions: Question[];
  totalQuestions: number;
  selectedQuestionId: string | null;
  onSelect: (question: Question) => void;
  onDelete: (questionId: string) => void;
  currentPage: number;
  itemsPerPage: number;
}) {
  const typeMap: Record<QuestionType, string> = {
    MULTIPLE_CHOICE: "Pilihan Ganda",
    TRUE_FALSE: "Benar/Salah",
    MATCHING: "Menjodohkan",
    ESSAY: "Esai",
  };

  // [PERUBAHAN UTAMA] Fungsi helper untuk membersihkan dan memotong teks
  const formatQuestionText = (html: string) => {
    if (typeof window === "undefined") return "Memuat...";

    const doc = new DOMParser().parseFromString(html, "text/html");
    const plainText = doc.body.textContent?.trim() || "";

    // 1. Prioritaskan teks jika ada
    if (plainText) {
      if (plainText.length > 50) {
        return plainText.substring(0, 50) + "...";
      }
      return plainText;
    }

    // 2. Jika tidak ada teks, baru cek media
    if (html.includes("<img")) {
      return "[Soal berisi Gambar]";
    }
    if (html.includes("<table")) {
      return "[Soal berisi Tabel]";
    }

    // 3. Fallback jika benar-benar kosong
    return "[Soal Kosong]";
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800">Daftar Soal ({totalQuestions})</h3>
      </div>
      <div className="p-5 sm:p-6 space-y-3">
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div key={q.id} className="flex items-center gap-2">
              <button
                onClick={() => onSelect(q)}
                className={cn(
                  "flex-1 text-left p-3 border rounded-xl flex items-center justify-between gap-3 transition-colors overflow-hidden",
                  selectedQuestionId === q.id
                    ? "ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50/50 text-indigo-700"
                    : "hover:bg-slate-50 border-slate-200 text-slate-700"
                )}
              >
                <p className="font-semibold text-sm truncate min-w-0">
                  {(currentPage - 1) * itemsPerPage + index + 1}.{" "}
                  {formatQuestionText(q.question_text)}
                </p>
                <Badge
                  className={cn("text-xs flex-shrink-0 border-none font-medium px-2 py-0.5 rounded-md", selectedQuestionId === q.id ? "bg-indigo-200 text-indigo-800 hover:bg-indigo-200" : "bg-slate-100 text-slate-600 hover:bg-slate-100")}
                >
                  {typeMap[q.type]}
                </Badge>
              </button>
              <Button
                aria-label="Hapus Soal"
                variant="ghost"
                size="icon"
                className="text-destructive h-9 w-9 flex-shrink-0"
                onClick={() => onDelete(q.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Belum ada soal.
          </p>
        )}
      </div>
    </div>
  );
}

// --- FORM UTAMA (SEKARANG FULLY UNCONTROLLED) ---
function QuestionForm({
  testId,
  selectedQuestion,
  onFinish,
  allQuestions,
}: any) {
  // SEMUA state untuk form ini sekarang ada di sini. Inilah satu-satunya "sumber kebenaran".
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionText, setQuestionText] = useState(
    selectedQuestion?.question_text || ""
  );
  const [marks, setMarks] = useState(selectedQuestion?.marks || 1);
  const [questionType, setQuestionType] = useState<QuestionType>(
    selectedQuestion?.type || "MULTIPLE_CHOICE"
  );
  const [options, setOptions] = useState<NewOption[]>(
    selectedQuestion?.multiple_choice_options?.map(
      (o: MultipleChoiceOption) => ({
        text: o.option_text,
        is_correct: o.is_correct,
      })
    ) || [
      { text: "", is_correct: true },
      { text: "", is_correct: false },
    ]
  );
  const [statements, setStatements] = useState<NewStatement[]>(
    selectedQuestion?.true_false_statements?.map((s: TrueFalseStatement) => ({
      text: s.statement_text,
      is_true: s.is_true,
    })) || [{ text: "", is_true: true }]
  );
  const [prompts, setPrompts] = useState<NewMatchItem[]>(
    selectedQuestion?.matching_prompts?.map((p: MatchingPrompt) => ({
      id: p.id,
      text: p.prompt_text,
    })) || [{ id: Date.now(), text: "" }]
  );
  const [matchOptions, setMatchOptions] = useState<NewMatchItem[]>(
    selectedQuestion?.matching_options?.map((o: MatchingOption) => ({
      id: o.id,
      text: o.option_text,
    })) || [{ id: Date.now() + 1, text: "" }]
  );
  const [pairs, setPairs] = useState<NewPair[]>(
    selectedQuestion?.matching_correct_pairs?.map((p: MatchingCorrectPair) => ({
      promptId: p.prompt_id,
      optionId: p.option_id,
    })) || []
  );

  const [essayAnswerKey, setEssayAnswerKey] = useState(selectedQuestion?.essay_answer?.answer_key || '');

  const questionIndex = selectedQuestion
    ? allQuestions.findIndex((q: Question) => q.id === selectedQuestion.id) + 1
    : 0;
  const typeToRender = selectedQuestion ? selectedQuestion.type : questionType;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    console.log("--- [CLIENT LOG] DATA YANG AKAN DIKIRIM ---");
    console.log("Teks Pertanyaan:", questionText);
    console.log("Pilihan Ganda:", JSON.stringify(options, null, 2));
    console.log("Pernyataan B/S:", JSON.stringify(statements, null, 2));
    console.log("-----------------------------------------");
    
    // Buat FormData KOSONG. Kita akan mengisinya secara manual.
    const formData = new FormData();
    
    // Tambahkan data-data penting
    formData.append("testId", testId);
    if (selectedQuestion) {
      formData.append("questionId", selectedQuestion.id);
    }

    // Ambil data langsung dari state React yang PALING BARU
    formData.append("questionText", questionText); // <-- Ini sekarang 100% akurat
    formData.append("type", typeToRender);
    
    // Tambahkan data dari sub-komponen
    formData.append("options", JSON.stringify(options.map((o) => ({ option_text: o.text, is_correct: o.is_correct }))));
    formData.append("statements", JSON.stringify(statements.map((s) => ({ statement_text: s.text, is_true: s.is_true }))));
    formData.append("prompts", JSON.stringify(prompts.map((p) => ({ text: p.text }))));
    formData.append("matchOptions", JSON.stringify(matchOptions.map((o) => ({ text: o.text }))));

    const finalPairs = pairs.map((p) => {
        const prompt = prompts.find((item) => item.id === p.promptId);
        const option = matchOptions.find((item) => item.id.toString() === p.optionId?.toString());
        if (prompt && option && prompt.text && option.text) {
          return { prompt_text: prompt.text, option_text: option.text };
        }
        return null;
      }).filter(Boolean);
    formData.append("pairs", JSON.stringify(finalPairs));

    if (typeToRender === "ESSAY") {
      formData.append("essayAnswerKey", essayAnswerKey);
    }

    // Panggil server action dengan data yang sudah pasti benar
    const action = selectedQuestion ? updateQuestion : addQuestionToTest;
    const result = await action(null, formData);

    if (result?.error) {
      toast.error("Gagal", { description: result.error });
    } else {
      toast.success(`Soal berhasil ${selectedQuestion ? "diperbarui" : "ditambahkan"}!`);
      onFinish();
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">{selectedQuestion ? `Edit Soal #${questionIndex}` : "Tambah Soal Baru"}</h3>
        {selectedQuestion && (<Button variant="link" className="p-0 h-auto self-start text-slate-500 hover:text-slate-700" onClick={onFinish}>Batal & Kembali</Button>)}
      </div>
      <div className="p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Teks Pertanyaan</Label>
            <TinyEditor value={questionText} onChange={setQuestionText} />
          </div>

          <div className="space-y-2">
            <Label>Tipe Soal</Label>
            <Select
              value={typeToRender}
              onValueChange={(v) => !selectedQuestion && setQuestionType(v as QuestionType)}
              disabled={!!selectedQuestion}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MULTIPLE_CHOICE">Pilihan Ganda</SelectItem>
                <SelectItem value="TRUE_FALSE">Benar/Salah</SelectItem>
                <SelectItem value="MATCHING">Menjodohkan</SelectItem>
                <SelectItem value="ESSAY">Esai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hapus semua state 'marks' dan input 'Poin' */}

          {typeToRender === "MULTIPLE_CHOICE" && <MultipleChoiceForm options={options} setOptions={setOptions} />}
          {typeToRender === "TRUE_FALSE" && <TrueFalseForm statements={statements} setStatements={setStatements} />}
          {typeToRender === "MATCHING" && <MatchingForm prompts={prompts} setPrompts={setPrompts} matchOptions={matchOptions} setMatchOptions={setMatchOptions} pairs={pairs} setPairs={setPairs} />}
          {typeToRender === "ESSAY" && (
            <div className="space-y-2 border-t pt-4">
              <Label>Kunci Jawaban Esai</Label>
              <p className="text-xs text-muted-foreground">Masukkan poin-poin atau kata kunci utama.</p>
              <TinyEditor variant="compact" value={essayAnswerKey} onChange={setEssayAnswerKey} />
            </div>
          )}

          <SubmitButton text={selectedQuestion ? "Simpan Perubahan" : "Simpan Soal"} isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
}

// --- KOMPONEN INDUK UTAMA ---
export default function QuestionEditor({
  testId,
  testInfo,
}: {
  testId: string;
  testInfo: any;
}) {
  const supabase = createClient();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [isFormActive, setIsFormActive] = useState(false);

  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const QUESTIONS_PER_PAGE = 10;

  // [PERUBAHAN] Fungsi untuk mengambil data dari Supabase di sisi client
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("questions")
      .select(
        `
          *,
          multiple_choice_options(*),
          true_false_statements(*),
          matching_prompts(*),
          matching_options(*),
          matching_correct_pairs(*),
          essay_answer:essay_answers(*)
        `
      )
      .eq("test_id", testId)
      .order("sort_order", { ascending: true });

    // [PERBAIKAN UTAMA] Log data mentah yang diterima dari Supabase
    if (error) {
      toast.error("Gagal memuat soal", { description: error.message });
      setQuestions([]);
    } else {
      setQuestions(data as Question[]);
    }
    setIsLoading(false);
  }, [testId, supabase]);

  // [PERUBAHAN] Mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // --- Handler UI (sebagian besar sama, beberapa dimodifikasi) ---
  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
    setIsFormActive(false);
  };

  const handleAddNew = () => {
    setSelectedQuestion(null);
    setIsFormActive(true);
  };

  const handleEdit = () => {
    setIsFormActive(true);
  };

  const handleFormFinish = () => {
    setIsFormActive(false);
    setSelectedQuestion(null);
    // [PERUBAHAN] Panggil fetchQuestions() untuk update UI, bukan router.refresh()
    fetchQuestions();
  };

   const handleDelete = (questionId: string) => { // Buat jadi fungsi biasa, bukan async
    const formData = new FormData();
    formData.append("questionId", questionId);

    // [PERBAIKAN UTAMA] Update state UI secara manual di callback 'success'
    toast.promise(deleteQuestion(formData), {
      loading: "Menghapus soal...",
      success: (res) => {
        if (res.error) {
          // Jika ada error dari server, lempar error agar ditangkap oleh .error()
          throw new Error(res.error);
        }
        
        // 1. Update state UI secara instan
        setQuestions(currentQuestions => currentQuestions.filter(q => q.id !== questionId));
        
        // 2. Reset tampilan detail jika soal yang dihapus sedang dipilih
        if (selectedQuestion?.id === questionId) {
          setSelectedQuestion(null);
          setIsFormActive(false);
        }

        // 3. (Opsional tapi bagus) Kita masih bisa panggil fetchQuestions di latar belakang
        //    untuk memastikan sinkronisasi total, terutama jika ada pagination/urutan.
        fetchQuestions();

        return "Soal berhasil dihapus!";
      },
      error: (err) => `Gagal menghapus: ${err.message}`,
    });
  };

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const paginatedQuestions = questions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      const isSelectedQuestionVisible = questions
        .slice((page - 1) * QUESTIONS_PER_PAGE, page * QUESTIONS_PER_PAGE)
        .some((q) => q.id === selectedQuestion?.id);
      if (!isSelectedQuestionVisible) {
        setSelectedQuestion(null);
        setIsFormActive(false);
      }
      setCurrentPage(page);
    }
  };

  // [PERUBAHAN] Tampilkan state loading jika data belum siap
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10 border rounded-lg bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-4 text-muted-foreground">Memuat soal...</span>
      </div>
    );
  }

  const questionIndex = selectedQuestion
    ? questions.findIndex((q) => q.id === selectedQuestion.id) + 1
    : 0;

  const questionLimitReached = questions.length >= testInfo.total_questions;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button onClick={handleAddNew} disabled={questionLimitReached} className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm px-6">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Soal Baru
        </Button>
      </div>
      {questionLimitReached && (
        <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
          <AlertCircle className="h-5 w-5 mr-2" />
          Anda telah mencapai batas jumlah soal untuk ujian ini.
        </Alert>
      )}

      {/* [LAYOUT BARU] Kiri-Kanan dengan pembagian 4/8 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Sisi KIRI: Daftar Soal yang lebih ramping */}
        <div className="lg:col-span-4">
          <QuestionList
            questions={paginatedQuestions}
            totalQuestions={questions.length}
            selectedQuestionId={selectedQuestion?.id || null}
            onSelect={handleQuestionSelect}
            onDelete={handleDelete}
            // [PERBAIKAN 3] Teruskan state dan konstanta sebagai props
            currentPage={currentPage}
            itemsPerPage={QUESTIONS_PER_PAGE}
          />
          <ClientPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* 2. Sisi KANAN: Form/Detail yang lebih lebar */}
        <div className="lg:col-span-8">
          {isFormActive ? (
            <QuestionForm
              key={selectedQuestion ? selectedQuestion.id : "new-question"}
              testId={testId}
              selectedQuestion={selectedQuestion}
              onFinish={handleFormFinish}
              allQuestions={questions}
            />
          ) : selectedQuestion ? (
            <QuestionDetail
              question={selectedQuestion}
              questionIndex={questionIndex}
              onEdit={handleEdit}
              testInfo={testInfo} // Kirim data testInfo ke QuestionDetail
            />
          ) : (
            <div className="h-full flex items-center justify-center min-h-[400px] bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-center p-8">
                <p className="text-slate-500 font-medium">
                  {questions.length > 0
                    ? "Pilih soal dari daftar di sebelah kiri."
                    : "Belum ada soal. Klik 'Tambah Soal Baru'."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- HELPER TOMBOL SUBMIT ---
function SubmitButton({
  text,
  isSubmitting,
}: {
  text: string;
  isSubmitting: boolean;
}) {
  return (
    <Button type="submit" disabled={isSubmitting} className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm">
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Proses...
        </>
      ) : (
        text
      )}
    </Button>
  );
}
