// FILE: components/ui/tinymce-editor.tsx

'use client'

import React, { useRef, useEffect } from 'react'; // Impor useRef dan useEffect
import { Editor } from '@tinymce/tinymce-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export const TinyEditor = ({
  name, // <-- [PERBAIKAN 1] Tambahkan 'name' di sini
  value,
  onChange,
  defaultValue,
  disabled = false,
  variant = 'default'
}: {
  name?: string; // <-- [PERBAIKAN 2] Deklarasikan tipe untuk 'name'
  value?: string;
  onChange?: (content: string) => void;
  defaultValue?: string;
  disabled?: boolean;
  variant?: 'default' | 'compact';
}) => {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && defaultValue && value === undefined) {
      editorRef.current.setContent(defaultValue);
    }
  }, [defaultValue, value]);


  // [PERBAIKAN UTAMA] Fungsi upload yang sudah robust dan memenuhi kontrak tipe
  const handleImageUpload = async (blobInfo: any): Promise<string> => {
    const supabase = createClient();
    const file = blobInfo.blob();

    if (!file) {
      toast.error("File tidak valid.");
      throw new Error("File tidak valid.");
    }

    const toastId = toast.loading('Mengunggah gambar...');
    const fileName = `${Date.now()}_${blobInfo.filename()}`;
    
    const { data, error } = await supabase.storage
      .from('question_images') // Pastikan nama bucket ini benar
      .upload(fileName, file);

    if (error) {
      toast.error('Gagal mengunggah gambar', { id: toastId, description: error.message });
      // Melempar error akan memberitahu TinyMCE bahwa upload gagal
      throw new Error(error.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('question_images') // Pastikan nama bucket ini benar
      .getPublicUrl(data.path);

    toast.success('Gambar berhasil diunggah!', { id: toastId });
    // Mengembalikan URL akan memberitahu TinyMCE bahwa upload berhasil
    return publicUrl;
  };

  const compactToolbar = 'undo redo | blocks | bold italic underline | link image | removeformat';
  const defaultToolbar = 
    'undo redo | blocks | ' +
    'bold italic underline strikethrough | forecolor backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | ' +
    'removeformat | image media link | table | code | fullscreen preview | help';

  const compactPlugins = ['autolink', 'lists', 'link', 'image', 'wordcount'];
  const defaultPlugins = [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount'
  ];

  return (
    <Editor
      onInit={(evt, editor) => editorRef.current = editor}
      apiKey="xb65vj9vzemtepitp7iz3gavwjktrbcwfw8d15s1ywkk2pt8"
      // Jika 'value' ada, gunakan itu (controlled). Jika tidak, jangan set apa-apa di sini.
      value={value} 
      // Jika 'onChange' ada, gunakan itu. Jika tidak, jangan set apa-apa.
      onEditorChange={onChange ? (newValue) => onChange(newValue) : undefined}
      // Kita tambahkan 'textareaName' agar ia bisa mengirim data dengan FormData
      textareaName="questionText"
      init={{
        height: variant === 'compact' ? 250 : 500,
        menubar: variant === 'default',
        plugins: variant === 'default' ? defaultPlugins : compactPlugins,
        toolbar: variant === 'default' ? defaultToolbar : compactToolbar,
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        automatic_uploads: true,
        file_picker_types: 'image',
        images_upload_handler: handleImageUpload,
        image_uploadtab: true,
        media_live_embeds: true,
      }}
    />
  );
}