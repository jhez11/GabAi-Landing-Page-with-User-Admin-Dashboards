import React, { useCallback, useState, useRef } from 'react';
import { Upload, Link as LinkIcon, X, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface ImageInputProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  maxSizeMB?: number;
  allowedFormats?: string[];
  label?: string;
}
type TabType = 'upload' | 'url';
export function ImageInput({
  value,
  onChange,
  maxSizeMB = 5,
  allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  label = 'Image'
}: ImageInputProps) {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const validateImage = useCallback((file: File): string | null => {
    // Check file type
    if (!allowedFormats.includes(file.type)) {
      return `Invalid format. Allowed: ${allowedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`;
    }
    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return `File too large. Maximum size: ${maxSizeMB}MB`;
    }
    return null;
  }, [allowedFormats, maxSizeMB]);
  const handleFile = useCallback((file: File) => {
    setError(null);
    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  }, [validateImage, onChange]);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);
  const handleUrlSubmit = useCallback(async () => {
    if (!urlInput.trim()) {
      setError('Please enter a URL');
      return;
    }
    setError(null);
    setIsValidating(true);
    try {
      // Validate URL format
      new URL(urlInput);
      // Try to load the image to validate it exists and is an image
      const img = new Image();
      img.onload = () => {
        onChange(urlInput);
        setIsValidating(false);
      };
      img.onerror = () => {
        setError('Failed to load image from URL');
        setIsValidating(false);
      };
      img.src = urlInput;
    } catch {
      setError('Invalid URL format');
      setIsValidating(false);
    }
  }, [urlInput, onChange]);
  const handleRemove = useCallback(() => {
    onChange('');
    setUrlInput('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);
  return <div className="space-y-3">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}

      {/* Tab Switcher */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        <button type="button" onClick={() => setActiveTab('upload')} className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'upload' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
          {activeTab === 'upload' && <motion.div layoutId="activeTab" className="absolute inset-0 bg-background rounded-md shadow-sm" transition={{
          type: 'spring',
          bounce: 0.2,
          duration: 0.6
        }} />}
          <span className="relative z-10 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload File
          </span>
        </button>

        <button type="button" onClick={() => setActiveTab('url')} className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'url' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
          {activeTab === 'url' && <motion.div layoutId="activeTab" className="absolute inset-0 bg-background rounded-md shadow-sm" transition={{
          type: 'spring',
          bounce: 0.2,
          duration: 0.6
        }} />}
          <span className="relative z-10 flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Use URL
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? <motion.div key="upload" initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: 20
        }} transition={{
          duration: 0.2
        }} className="space-y-3">
              <input ref={fileInputRef} type="file" accept={allowedFormats.join(',')} onChange={handleFileSelect} className="hidden" />

              <div onDrop={handleDrop} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`} onClick={() => fileInputRef.current?.click()}>
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <motion.div animate={{
                y: isDragging ? -8 : 0,
                scale: isDragging ? 1.1 : 1
              }} className={`p-3 rounded-full ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <Upload className="h-6 w-6" />
                  </motion.div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      {isDragging ? 'Drop image here' : 'Drop image or click'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {allowedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}{' '}
                      up to {maxSizeMB}MB
                    </p>
                  </div>
                </div>
              </div>
            </motion.div> : <motion.div key="url" initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: 20
        }} transition={{
          duration: 0.2
        }} className="space-y-3">
              <div className="space-y-2">
                <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyPress={e => {
              if (e.key === 'Enter') {
                handleUrlSubmit();
              }
            }} placeholder="https://example.com/image.jpg" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />

                <button type="button" onClick={handleUrlSubmit} disabled={isValidating || !urlInput.trim()} className="w-full h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                  {isValidating ? <>
                      <motion.div animate={{
                  rotate: 360
                }} transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear'
                }} className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
                      Validating...
                    </> : <>
                      <Check className="h-4 w-4" />
                      Load Image
                    </>}
                </button>
              </div>

              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter a direct link to an image file. The URL should end with
                  .jpg, .png, .gif, or .webp
                </p>
              </div>
            </motion.div>}
        </AnimatePresence>

        {/* Preview Area */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Preview</p>

          <AnimatePresence mode="wait">
            {value ? <motion.div key="preview" initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} exit={{
            opacity: 0,
            scale: 0.9
          }} transition={{
            duration: 0.2
          }} className="relative group">
                <div className="relative w-[150px] h-[150px] rounded-lg overflow-hidden border border-border shadow-sm bg-muted">
                  <img src={value} alt="Preview" className="w-full h-full object-cover" />

                  <button type="button" onClick={handleRemove} className="absolute top-2 right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div> : <motion.div key="empty" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} className="w-[150px] h-[150px] rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
                <p className="text-xs text-muted-foreground text-center px-4">
                  No image selected
                </p>
              </motion.div>}
          </AnimatePresence>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && <motion.div initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -10
      }} className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </motion.div>}
      </AnimatePresence>
    </div>;
}