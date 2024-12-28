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

const GENRE_OPTIONS = [
  "Fiction",
  "Non-Fiction",
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
}

export default function StoriesPage() {
  const [storyTitle, setStoryTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('');
  const [previewAudio, setPreviewAudio] = useState<File | null>(null);
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([{ title: '', audio: null }]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState<{
    title?: boolean;
    description?: boolean;
    price?: boolean;
    genre?: boolean;
    cover?: boolean;
    previewAudio?: boolean;
    chapters?: boolean;
  }>({});
  const [showErrors, setShowErrors] = useState(false);

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

    const newChapters = [...chapters];
    newChapters[index] = {
      ...newChapters[index],
      audio: file,
      isUploading: true,
      uploadProgress: 0
    };
    setChapters(newChapters);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      const updatedChapters = [...newChapters];
      updatedChapters[index].uploadProgress = i;
      setChapters(updatedChapters);
    }

    // Create audio URL after upload complete
    newChapters[index] = {
      ...newChapters[index],
      audioUrl: URL.createObjectURL(file),
      isUploading: false
    };
    setChapters(newChapters);
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
      description: description.trim().length < 50,
      price: parseFloat(price) <= 0,
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
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-field');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const formData = new FormData();
    formData.append('storyTitle', storyTitle);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('genre', genre);
    if (cover) formData.append('cover', cover);
    if (previewAudio) formData.append('previewAudio', previewAudio);
    
    chapters.forEach((chapter, index) => {
      if (chapter.title) formData.append(`chapter${index}Title`, chapter.title);
      if (chapter.audio) formData.append(`chapter${index}Audio`, chapter.audio);
    });
    
    // TODO: Implement API call to upload story
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-8">
        <BookOpen className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Upload New Story</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Story Details</CardTitle>
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
                  placeholder="Enter story description (minimum 50 characters)"
                  className={`w-full min-h-[150px] p-2 rounded-md border 
                    ${showErrors && errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                <div className={`text-sm ${description.length < 50 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {description.length}/50 characters minimum
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      placeholder="Enter price"
                      className={`w-full ${showErrors && errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
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

        <Card>
          <CardHeader>
            <CardTitle>Preview Audio</CardTitle>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Chapters</CardTitle>
            <Button type="button" onClick={addChapter} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add Chapter
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {chapters.map((chapter, index) => (
              <div key={index} className="relative p-6 border rounded-xl bg-card">
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
          >
            Upload Story
          </Button>
        </div>

        {/* Error summary alert */}
        {showErrors && Object.values(errors).some(error => error) && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              Please correct the following errors:
              <ul className="list-disc pl-4 mt-2">
                {errors.title && <li>Enter a story title</li>}
                {errors.description && <li>Description must be at least 50 characters</li>}
                {errors.price && <li>Enter a valid price</li>}
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
