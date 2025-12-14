import React, { useCallback, useState } from 'react';
import { Upload, FileText, Check, AlertCircle, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
export function DatasetUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.type === 'application/json')) {
      setFile(droppedFile);
      setUploadStatus('idle');
    }
  }, []);
  const handleUpload = () => {
    if (!file) return;
    setUploadStatus('uploading');
    // Simulate upload
    setTimeout(() => {
      setUploadStatus('success');
    }, 2000);
  };
  return <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Database Management
        </h2>
        <p className="text-muted-foreground">
          Upload datasets to update the chatbot's knowledge base.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" /> Import Dataset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}>
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                {uploadStatus === 'success' ? <Check className="h-8 w-8 text-green-500" /> : <Upload className="h-8 w-8 text-muted-foreground" />}
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-lg">
                  {file ? file.name : 'Drag & drop file here'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {file ? `${(file.size / 1024).toFixed(2)} KB` : 'Supports CSV and JSON formats'}
                </p>
              </div>

              {file && uploadStatus !== 'success' && <Button onClick={handleUpload} isLoading={uploadStatus === 'uploading'}>
                  Upload to Database
                </Button>}

              {uploadStatus === 'success' && <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                  <Check className="h-4 w-4" /> Dataset successfully updated
                </div>}
            </div>
          </div>

          <div className="mt-8">
            <h4 className="font-medium mb-4">Recent Uploads</h4>
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-sm">
                        campus_data_v{i}.csv
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Uploaded 2 days ago by Admin
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Processed
                  </span>
                </div>)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}