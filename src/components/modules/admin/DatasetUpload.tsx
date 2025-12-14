import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Upload, FileText, Table, Database, Trash2, Eye, CheckCircle, XCircle, Loader2, AlertCircle, Folder, File, Image as ImageIcon, FileCode, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { motion, AnimatePresence } from 'framer-motion';
interface Dataset {
  id: string;
  name: string;
  type: 'faculty' | 'courses' | 'students' | 'document' | 'image' | 'spreadsheet' | 'code' | 'unknown';
  uploadDate: Date;
  size: number;
  fileType: string;
  folder: string;
  preview?: string;
  rowCount?: number;
  columns?: string[];
  data?: any[];
  metadata: {
    detectedType: string;
    confidence: number;
  };
}
interface KnowledgebaseFolder {
  name: string;
  count: number;
  types: string[];
}
interface ConnectionStatus {
  openai: 'connected' | 'disconnected' | 'checking';
  supabase: 'connected' | 'disconnected' | 'checking';
}
export function DatasetUpload() {
  const [datasets, setDatasets] = useState<Dataset[]>(() => {
    try {
      const stored = localStorage.getItem('gabai_datasets');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [folders, setFolders] = useState<KnowledgebaseFolder[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewDataset, setPreviewDataset] = useState<Dataset | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    openai: 'disconnected',
    supabase: 'disconnected'
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Update folders when datasets change
  useEffect(() => {
    const folderMap = new Map<string, {
      count: number;
      types: Set<string>;
    }>();
    datasets.forEach(dataset => {
      const existing = folderMap.get(dataset.folder) || {
        count: 0,
        types: new Set()
      };
      existing.count++;
      existing.types.add(dataset.type);
      folderMap.set(dataset.folder, existing);
    });
    const folderList = Array.from(folderMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      types: Array.from(data.types)
    }));
    setFolders(folderList);
  }, [datasets]);
  // Save datasets to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('gabai_datasets', JSON.stringify(datasets));
      // Trigger sidebar update
      window.dispatchEvent(new CustomEvent('datasets-updated', {
        detail: datasets
      }));
    } catch (error) {
      console.error('Error saving datasets:', error);
    }
  }, [datasets]);
  // Check connection status on mount
  useEffect(() => {
    checkConnections();
  }, []);
  const checkConnections = async () => {
    setConnectionStatus({
      openai: 'checking',
      supabase: 'checking'
    });
    // Simulate connection checks (in real app, these would be actual API calls)
    await new Promise(resolve => setTimeout(resolve, 1000));
    setConnectionStatus({
      openai: 'connected',
      supabase: 'connected' // Mock: would check actual Supabase connection
    });
  };
  const detectFileType = (file: File): Dataset['type'] => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return 'image';
    if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') return 'spreadsheet';
    if (ext === 'js' || ext === 'ts' || ext === 'jsx' || ext === 'tsx' || ext === 'py' || ext === 'java') return 'code';
    if (ext === 'pdf' || ext === 'doc' || ext === 'docx' || ext === 'txt') return 'document';
    return 'unknown';
  };
  const detectFolder = (fileType: Dataset['type'], fileName: string): string => {
    // Simulate intelligent folder organization
    switch (fileType) {
      case 'faculty':
      case 'courses':
      case 'students':
        return 'Academic Data';
      case 'image':
        return 'Media Assets';
      case 'document':
        return 'Documents';
      case 'spreadsheet':
        return 'Spreadsheets';
      case 'code':
        return 'Code Samples';
      default:
        return 'General Files';
    }
  };
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  const detectDatasetType = (data: any[], columns: string[]): {
    type: Dataset['type'];
    confidence: number;
  } => {
    const columnNames = columns.map(c => c.toLowerCase());
    // Faculty detection
    if (columnNames.some(c => c.includes('faculty') || c.includes('professor') || c.includes('instructor')) || columnNames.includes('name') && columnNames.includes('department') && columnNames.includes('email')) {
      return {
        type: 'faculty',
        confidence: 0.95
      };
    }
    // Course detection
    if (columnNames.some(c => c.includes('course') || c.includes('subject')) || columnNames.includes('code') && columnNames.includes('title')) {
      return {
        type: 'courses',
        confidence: 0.9
      };
    }
    // Student detection
    if (columnNames.some(c => c.includes('student') || c.includes('id')) || columnNames.includes('name') && columnNames.includes('year')) {
      return {
        type: 'students',
        confidence: 0.85
      };
    }
    return {
      type: 'unknown',
      confidence: 0.5
    };
  };
  const parseCSV = (text: string): {
    columns: string[];
    data: any[];
  } => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return {
      columns: [],
      data: []
    };
    const columns = lines[0].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: any = {};
      columns.forEach((col, i) => {
        row[col] = values[i] || '';
      });
      return row;
    });
    return {
      columns,
      data
    };
  };
  const parseJSON = (text: string): {
    columns: string[];
    data: any[];
  } => {
    try {
      const parsed = JSON.parse(text);
      const data = Array.isArray(parsed) ? parsed : [parsed];
      const columns = data.length > 0 ? Object.keys(data[0]) : [];
      return {
        columns,
        data
      };
    } catch {
      return {
        columns: [],
        data: []
      };
    }
  };
  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const fileType = detectFileType(file);
      let parsed: {
        columns?: string[];
        data?: any[];
        preview?: string;
      } = {};
      let detectedType: Dataset['type'] = fileType;
      let confidence = 0.7;
      // Handle different file types
      if (fileType === 'spreadsheet' && (file.name.endsWith('.csv') || file.name.endsWith('.json'))) {
        const text = await file.text();
        if (file.name.endsWith('.csv')) {
          const csvData = parseCSV(text);
          parsed = csvData;
          const detection = detectDatasetType(csvData.data, csvData.columns);
          detectedType = detection.type;
          confidence = detection.confidence;
        } else if (file.name.endsWith('.json')) {
          const jsonData = parseJSON(text);
          parsed = jsonData;
          const detection = detectDatasetType(jsonData.data, jsonData.columns);
          detectedType = detection.type;
          confidence = detection.confidence;
        }
      } else if (fileType === 'image') {
        // Create preview for images
        const reader = new FileReader();
        await new Promise(resolve => {
          reader.onload = e => {
            parsed.preview = e.target?.result as string;
            resolve(null);
          };
          reader.readAsDataURL(file);
        });
      } else if (fileType === 'document' || fileType === 'code') {
        // For text-based files, read first 500 chars as preview
        const text = await file.text();
        parsed.preview = text.substring(0, 500);
      }
      const folder = detectFolder(detectedType, file.name);
      const newDataset: Dataset = {
        id: Date.now().toString(),
        name: file.name,
        type: detectedType,
        uploadDate: new Date(),
        size: file.size,
        fileType: file.type || 'application/octet-stream',
        folder,
        preview: parsed.preview,
        rowCount: parsed.data?.length,
        columns: parsed.columns,
        data: parsed.data,
        metadata: {
          detectedType: detectedType,
          confidence
        }
      };
      setDatasets(prev => [newDataset, ...prev]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error processing file:', error);
      alert(`Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };
  const deleteDataset = (id: string) => {
    if (confirm('Are you sure you want to delete this dataset?')) {
      setDatasets(prev => prev.filter(d => d.id !== id));
    }
  };
  const getTypeIcon = (type: Dataset['type']) => {
    switch (type) {
      case 'faculty':
        return <span className="text-2xl">👨‍🏫</span>;
      case 'courses':
        return <span className="text-2xl">📚</span>;
      case 'students':
        return <span className="text-2xl">🎓</span>;
      case 'image':
        return <ImageIcon className="h-6 w-6 text-blue-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
      case 'code':
        return <FileCode className="h-6 w-6 text-purple-500" />;
      case 'document':
        return <FileText className="h-6 w-6 text-orange-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  const getTypeColor = (type: Dataset['type']) => {
    switch (type) {
      case 'faculty':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'courses':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'students':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };
  const ConnectionIndicator = ({
    service,
    status
  }: {
    service: string;
    status: ConnectionStatus['openai'];
  }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'connected':
          return 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
        case 'checking':
          return 'bg-yellow-500 animate-pulse';
        case 'disconnected':
          return 'bg-red-500';
        default:
          return 'bg-gray-400';
      }
    };
    const getStatusText = () => {
      switch (status) {
        case 'connected':
          return `${service}: Connected`;
        case 'checking':
          return `${service}: Checking...`;
        case 'disconnected':
          return `${service}: Disconnected`;
        default:
          return service;
      }
    };
    return <div className="group relative flex items-center justify-center w-6 h-6 rounded-full bg-muted hover:bg-muted/80 transition-colors cursor-help" title={getStatusText()}>
        <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} transition-all duration-500`} />
      </div>;
  };
  return <div className="space-y-6">
      {/* Success notification */}
      <AnimatePresence>
        {showSuccess && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">File uploaded successfully!</span>
          </motion.div>}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dataset Upload
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload and manage knowledge base datasets with AI-powered detection
          </p>
        </div>
        <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-full border border-border shadow-sm">
          <span className="text-xs font-medium text-muted-foreground mr-1">
            System Status:
          </span>
          <ConnectionIndicator service="OpenAI API" status={connectionStatus.openai} />
          <ConnectionIndicator service="Supabase" status={connectionStatus.supabase} />
        </div>
      </div>

      {/* Knowledgebase Folders */}
      {folders.length > 0 && <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Knowledgebase Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {folders.map(folder => <div key={folder.name} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <Folder className="h-8 w-8 text-primary" />
                  <div className="text-center">
                    <p className="text-sm font-medium truncate max-w-full">
                      {folder.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {folder.count} {folder.count === 1 ? 'file' : 'files'}
                    </p>
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>}

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`relative border-2 border-dashed rounded-lg p-12 transition-all ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50'}`}>
            <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />

            <div className="flex flex-col items-center justify-center text-center">
              <motion.div animate={{
              y: isDragging ? -10 : 0,
              scale: isDragging ? 1.1 : 1
            }} className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <Upload className="h-8 w-8" />
              </motion.div>

              <h3 className="text-lg font-semibold mb-2">
                {uploading ? 'Processing...' : isDragging ? 'Drop your file here' : 'Upload to Knowledgebase'}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop any file type here
              </p>

              <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </> : <>
                    <FileText className="h-4 w-4 mr-2" />
                    Choose File
                  </>}
              </Button>

              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                <span>Supports all file types • Organized automatically</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datasets List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Uploaded Files ({datasets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {datasets.length === 0 ? <div className="text-center py-12 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No files uploaded yet</p>
            </div> : <div className="space-y-3">
              <AnimatePresence>
                {datasets.map((dataset, index) => <motion.div key={dataset.id} initial={{
              opacity: 0,
              x: -20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: 20
            }} transition={{
              delay: index * 0.05
            }} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
                      {getTypeIcon(dataset.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold truncate">
                          {dataset.name}
                        </h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(dataset.type)}`}>
                          {dataset.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Folder className="h-3 w-3" />
                          {dataset.folder}
                        </span>
                        <span>{formatFileSize(dataset.size)}</span>
                        <span>
                          {new Date(dataset.uploadDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewDataset(dataset)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteDataset(dataset.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>)}
              </AnimatePresence>
            </div>}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Modal isOpen={!!previewDataset} onClose={() => setPreviewDataset(null)} title={previewDataset?.name || ''} size="xl">
        {previewDataset && <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-background">
                {getTypeIcon(previewDataset.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm px-2 py-0.5 rounded-full ${getTypeColor(previewDataset.type)}`}>
                    {previewDataset.type}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatFileSize(previewDataset.size)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Folder: {previewDataset.folder}
                </div>
              </div>
            </div>

            {/* Preview content based on type */}
            {previewDataset.preview && previewDataset.type === 'image' && <div className="rounded-lg overflow-hidden border border-border">
                <img src={previewDataset.preview} alt={previewDataset.name} className="w-full h-auto" />
              </div>}

            {previewDataset.preview && (previewDataset.type === 'document' || previewDataset.type === 'code') && <div className="p-4 bg-muted rounded-lg">
                  <pre className="text-xs overflow-auto max-h-64">
                    {previewDataset.preview}
                  </pre>
                  {previewDataset.preview.length >= 500 && <p className="text-xs text-muted-foreground mt-2">
                      Preview truncated...
                    </p>}
                </div>}

            {previewDataset.data && previewDataset.columns && <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      {previewDataset.columns.map(col => <th key={col} className="px-4 py-2 text-left font-medium">
                          {col}
                        </th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {previewDataset.data.slice(0, 10).map((row, i) => <tr key={i} className="hover:bg-muted/30">
                        {previewDataset.columns!.map(col => <td key={col} className="px-4 py-2">
                            {row[col]}
                          </td>)}
                      </tr>)}
                  </tbody>
                </table>
                {previewDataset.data.length > 10 && <div className="text-center py-2 text-xs text-muted-foreground">
                    Showing 10 of {previewDataset.data.length} rows
                  </div>}
              </div>}
          </div>}
      </Modal>
    </div>;
}