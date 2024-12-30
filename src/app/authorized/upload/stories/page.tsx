'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Loader2, Upload, BookOpen, ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { getAudioDuration } from '@/lib/audio-utils';
import { Switch } from "@/components/ui/switch";

const GENRE_OPTIONS = [
  "Fiction",
  "Non-Fiction",
  "Experience",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Horror",
  "Thriller",
  "Biography",
  "History",
  "Children's",
  "Young Adult",
  "Poetry",
  "Self-Help",
  "Business"
];

interface Chapter {
  title: string;
  audio: File | null;
  audioUrl?: string;
  uploadProgress?: number;
  isUploading?: boolean;
  duration?: number;
}

export default function StoriesPage() {
  const [storyTitle, setStoryTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('');
  const [previewAudio, setPreviewAudio] = useState<File | null>(null);
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([{ title: '', audio: null }]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState<{
    title?: boolean;
    description?: boolean;
    genre?: boolean;
    cover?: boolean;
    previewAudio?: boolean;
    chapters?: boolean;
  }>({});
  const [showErrors, setShowErrors] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePreviewAudioChange = (file: File | null) => {
    if (file) {
      setPreviewAudio(file);
      setPreviewAudioUrl(URL.createObjectURL(file));
    } else {
      setPreviewAudio(null);
      setPreviewAudioUrl('');
    }
  };

  const handleCoverChange = (file: File | null) => {
    setCover(file);
    if (file) {
      setCoverPreviewUrl(URL.createObjectURL(file));
    } else {
      setCoverPreviewUrl('');
    }
  };

  const handleChapterAudioChange = async (index: number, file: File | null) => {
    if (!file) return;

    try {
      const newChapters = [...chapters];
      newChapters[index] = {
        ...newChapters[index],
        audio: file,
        isUploading: true,
        uploadProgress: 0
      };
      setChapters(newChapters);

      // Calculate actual duration
      const duration = await getAudioDuration(file);
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        const updatedChapters = [...newChapters];
        updatedChapters[index].uploadProgress = i;
        setChapters(updatedChapters);
      }

      newChapters[index] = {
        ...newChapters[index],
        audioUrl: URL.createObjectURL(file),
        duration: duration,
        isUploading: false
      };
      setChapters(newChapters);
      
      toast.success(`Chapter ${index + 1} audio uploaded successfully (${duration} minutes)`);
    } catch (error) {
      toast.error(`Failed to process chapter ${index + 1} audio`);
      console.error('Audio processing error:', error);
      
      const newChapters = [...chapters];
      newChapters[index] = {
        ...newChapters[index],
        audio: null,
        isUploading: false
      };
      setChapters(newChapters);
    }
  };

  const addChapter = () => {
    setChapters([...chapters, { title: '', audio: null }]);
  };

  const removeChapter = (index: number) => {
    const newChapters = chapters.filter((_, i) => i !== index);
    setChapters(newChapters);
  };

  const validateForm = () => {
    const newErrors = {
      title: storyTitle.trim() === '',
      description: description.trim().length <25,
      genre: genre === '',
      cover: cover === null,
      previewAudio: previewAudio === null,
      chapters: !chapters.every(chapter => 
        chapter.title.trim() !== '' && 
        chapter.audio !== null && 
        !chapter.isUploading
      )
    };

    setErrors(newErrors);
    
    if (Object.values(newErrors).some(error => error)) {
      toast.error("Please fill in all required fields correctly");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    
    if (!validateForm()) {
      const firstErrorField = document.querySelector('.error-field');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsPublishing(true);
    try {
      const formData = new FormData();
      formData.append('storyTitle', storyTitle);
      formData.append('premiumStatus', isPremium.toString());
      formData.append('description', description);
      formData.append('genre', genre);
      formData.append('cover', cover as Blob);
      formData.append('previewAudio', previewAudio as Blob);
      formData.append('noOfChapters', chapters.length.toString());
      
      // Add loading toast
      const loadingToast = toast.loading('Publishing your story...');
      
      chapters.forEach((chapter, index) => {
        formData.append(`chapter${index}Title`, chapter.title);
        formData.append(`chapter${index}Audio`, chapter.audio as Blob);
        // Ensure duration is a valid number
        const duration = typeof chapter.duration === 'number' ? chapter.duration : 0;
        formData.append(`chapter${index}Duration`, duration.toString());
      });

      const response = await fetch('/api/stories', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Story published successfully!', {
        description: 'Your story is now available in your library.'
      });

      // Optional: Clear form or redirect
      // router.push(`/stories/${data.storyId}`);
      
    } catch (error) {
      toast.error('Failed to publish story', {
        description: error instanceof Error ? error.message : 'Please try again later'
      });
      console.error('Upload error:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-[#5956E9]/10 p-3 rounded-lg">
          <BookOpen className="w-7 h-7 text-[#5956E9]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Publish New Story</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Share your story with the world
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-2 border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-6 w-1 bg-[#5956E9] rounded-full" />
              Story Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="storyTitle">Story Title</Label>
                <Input
                  id="storyTitle"
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  required
                  placeholder="Enter story title"
                  className={`w-full ${showErrors && errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {showErrors && errors.title && (
                  <span className="text-sm text-red-500">Title is required</span>
                )}

                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Enter story description (minimum 25 characters)"
                  className={`w-full min-h-[150px] p-2 rounded-md border 
                    ${showErrors && errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                <div className={`text-sm ${description.length < 25 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {description.length}/25 characters minimum
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="premium-toggle">Story Type</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="premium-toggle"
                        checked={isPremium}
                        onCheckedChange={setIsPremium}
                      />
                      <Label htmlFor="premium-toggle" className="cursor-pointer">
                        {isPremium ? 'Premium Story' : 'Free Story'}
                      </Label>
                    </div>
                    {isPremium && (
                      <p className="text-sm text-muted-foreground">
                        Premium stories are only accessible to premium subscribers
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Select
                      value={genre}
                      onValueChange={setGenre}
                      required
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENRE_OPTIONS.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Label htmlFor="cover" className="mt-4 block">Book Cover</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="cover"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleCoverChange(e.target.files?.[0] || null)}
                    required
                    className={`w-full ${showErrors && errors.cover ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {cover && <Upload className="w-5 h-5 text-green-500" />}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cover Preview</Label>
                <div className="border rounded-lg p-4 flex flex-col items-center justify-center bg-muted">
                  {coverPreviewUrl ? (
                    <div className="relative w-40 h-56 overflow-hidden rounded-md shadow-md">
                      <img
                        src={coverPreviewUrl}
                        alt="Book cover preview"
                        className="object-cover w-full h-full hover:scale-105 transition-transform"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-56 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <p className="text-sm text-center">
                        Cover preview will appear here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-muted">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-6 w-1 bg-[#5956E9] rounded-full" />
              Preview Audio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="previewAudio">Upload a short sample of your audiobook</Label>
              <Input
                id="previewAudio"
                type="file"
                accept="audio/*"
                onChange={(e) => handlePreviewAudioChange(e.target.files?.[0] || null)}
                required
                className={`w-full ${showErrors && errors.previewAudio ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
            </div>
            {previewAudioUrl && (
              <div className="bg-muted p-4 rounded-lg">
                <Label className="mb-2 block">Preview Audio Sample</Label>
                <audio controls className="w-full">
                  <source src={previewAudioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-muted">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="h-6 w-1 bg-[#5956E9] rounded-full" />
              Chapters
            </CardTitle>
            <Button 
              type="button" 
              onClick={addChapter} 
              variant="outline" 
              size="sm"
              className="border-[#5956E9] text-[#5956E9] hover:bg-[#5956E9]/10"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Chapter
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {chapters.map((chapter, index) => (
              <div 
                key={index} 
                className="relative p-6 border-2 border-muted rounded-xl bg-card hover:border-[#5956E9]/30 transition-colors"
              >
                <div className="absolute right-4 top-4">
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChapter(index)}
                      className="hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Chapter {index + 1}</h3>
                  <Separator />
                  
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`chapter${index}Title`}>Chapter Title</Label>
                      <Input
                        id={`chapter${index}Title`}
                        type="text"
                        value={chapter.title}
                        onChange={(e) => {
                          const newChapters = [...chapters];
                          newChapters[index].title = e.target.value;
                          setChapters(newChapters);
                        }}
                        required
                        placeholder="Enter chapter title"
                        className={`w-full ${showErrors && errors.chapters ? 'border-red-500 focus:ring-red-500' : ''}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`chapter${index}Audio`}>Chapter Audio</Label>
                      <Input
                        id={`chapter${index}Audio`}
                        type="file"
                        accept="audio/*"
                        onChange={(e) => handleChapterAudioChange(index, e.target.files?.[0] || null)}
                        required
                        disabled={chapter.isUploading}
                        className={`w-full ${showErrors && errors.chapters ? 'border-red-500 focus:ring-red-500' : ''}`}
                      />
                      {chapter.isUploading && (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Uploading... {chapter.uploadProgress}%</span>
                          </div>
                          <Progress value={chapter.uploadProgress} className="h-2" />
                        </div>
                      )}
                    </div>

                    {chapter.audioUrl && !chapter.isUploading && (
                      <div className="bg-muted p-4 rounded-lg">
                        <Label className="mb-2 block">Audio Preview</Label>
                        <audio controls className="w-full">
                          <source src={chapter.audioUrl} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button 
            type="submit" 
            size="lg"
            disabled={isPublishing}
            className="bg-[#5956E9] hover:bg-[#4845c7] text-white px-8"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish'
            )}
          </Button>
        </div>

        {/* Error summary alert */}
        {showErrors && Object.values(errors).some(error => error) && (
          <Alert variant="destructive" className="mt-4 border-2">
            <AlertDescription className="space-y-2">
              <p className="font-medium">Please correct the following errors:</p>
              <ul className="list-disc pl-4 space-y-1 text-sm">
                {errors.title && <li>Enter a story title</li>}
                {errors.description && <li>Description must be at least 25 characters</li>}
                {errors.genre && <li>Select a genre</li>}
                {errors.cover && <li>Upload a cover image</li>}
                {errors.previewAudio && <li>Upload a preview audio</li>}
                {errors.chapters && <li>Complete all chapter details</li>}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
}
