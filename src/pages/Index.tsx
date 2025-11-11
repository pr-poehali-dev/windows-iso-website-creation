import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ISOFile {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  version: string;
  architecture: string;
}

const Index = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploads, setUploads] = useState<ISOFile[]>([
    {
      id: '2',
      name: 'Windows_10_Pro_Home_x64.iso',
      size: 2040109465,
      uploadDate: new Date('2024-11-05'),
      version: 'Windows 10 Pro/Home',
      architecture: 'x64',
      description: '',
    },
  ]);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.iso')) {
      toast({
        title: 'Ошибка',
        description: 'Можно загружать только ISO файлы',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          
          const newUpload: ISOFile = {
            id: Date.now().toString(),
            name: file.name,
            size: file.size,
            uploadDate: new Date(),
            version: 'Windows',
            architecture: 'x64',
            description: '',
          };
          
          setUploads((prev) => [newUpload, ...prev]);
          
          toast({
            title: 'Успешно загружено',
            description: `${file.name} готов к использованию`,
          });
          
          return 0;
        }
        return prev + 2;
      });
    }, 50);
  };

  const handleDelete = (id: string) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
    toast({
      title: 'Удалено',
      description: 'ISO образ удален из списка',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#1A1F2C] to-[#0f1419]">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            ISO Manager
          </h1>
          <p className="text-xl text-[#8E9196]">
            Загружайте и управляйте образами Windows
          </p>
        </div>

        <Card className="mb-8 bg-[#1e2330] border-[#2a3140] shadow-xl">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center">
                <Icon name="Upload" className="text-[#0EA5E9]" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Загрузить ISO</h2>
                <p className="text-[#8E9196] text-sm">Выберите ISO образ Windows для загрузки</p>
              </div>
            </div>

            {uploading ? (
              <div className="space-y-4">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-[#8E9196] text-center">
                  Загрузка: {progress}%
                </p>
              </div>
            ) : (
              <label className="block">
                <input
                  type="file"
                  accept=".iso"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-[#2a3140] rounded-lg p-12 text-center cursor-pointer hover:border-[#0EA5E9] transition-all hover:bg-[#0EA5E9]/5">
                  <Icon name="HardDrive" className="mx-auto text-[#8E9196] mb-4" size={48} />
                  <p className="text-[#8E9196] mb-2">
                    Нажмите или перетащите ISO файл сюда
                  </p>
                  <p className="text-sm text-[#6b7280]">
                    Поддерживаются только .iso файлы
                  </p>
                </div>
              </label>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="History" className="text-[#0EA5E9]" size={24} />
            <h2 className="text-2xl font-semibold text-white">История загрузок</h2>
            <Badge variant="secondary" className="bg-[#0EA5E9]/10 text-[#0EA5E9] border-none">
              {uploads.length}
            </Badge>
          </div>

          {uploads.length === 0 ? (
            <Card className="bg-[#1e2330] border-[#2a3140] p-12 text-center">
              <Icon name="Inbox" className="mx-auto text-[#8E9196] mb-4" size={48} />
              <p className="text-[#8E9196]">Нет загруженных образов</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {uploads.map((upload) => (
                <Card
                  key={upload.id}
                  className="bg-[#1e2330] border-[#2a3140] hover:border-[#0EA5E9]/50 transition-all hover:shadow-lg hover:shadow-[#0EA5E9]/10"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-[#0EA5E9]/10 flex items-center justify-center flex-shrink-0">
                          <Icon name="Disc" className="text-[#0EA5E9]" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-2 truncate">
                            {upload.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline" className="border-[#0EA5E9]/30 text-[#0EA5E9] bg-[#0EA5E9]/5">
                              {upload.version}
                            </Badge>
                            <Badge variant="outline" className="border-[#8E9196]/30 text-[#8E9196]">
                              {upload.architecture}
                            </Badge>
                          </div>
                          {upload.description && (
                            <p className="text-sm text-[#8E9196] mb-3">{upload.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-sm text-[#8E9196]">
                            <div className="flex items-center gap-1">
                              <Icon name="HardDrive" size={14} />
                              <span>{formatFileSize(upload.size)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              <span>{formatDate(upload.uploadDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const desc = prompt('Введите описание для образа:');
                            if (desc !== null) {
                              setUploads((prev) =>
                                prev.map((u) =>
                                  u.id === upload.id ? { ...u, description: desc } : u
                                )
                              );
                            }
                          }}
                          className="border-[#8E9196]/30 text-[#8E9196] hover:bg-[#8E9196]/10"
                        >
                          <Icon name="Edit" size={18} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-[#0EA5E9]/30 text-[#0EA5E9] hover:bg-[#0EA5E9]/10"
                        >
                          <Icon name="Download" size={18} />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(upload.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;