import mongoose from 'mongoose';

// Base chapter schema without audio URLs
const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Chapter title is required']
  },
  order: {
    type: Number,
    required: true
  },
  duration_inMinutes: {
    type: Number,  // Changed from String to Number
    required: true,
    min: 0
  },
  audioUrl: {
    type: String,
    required: true
  }
});

// Main story schema for general information
const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [25, 'Description must be at least 25 characters']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: [
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
      "Business",
      "Experience"
    ]
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required']
  },
  premiumStatus: {
    type: Boolean,
    required: [true, 'Premium status is required'],
    default: false
  },
  noOfChapters: {
    type: Number,
    required: [true, 'Number of chapters is required'],
    default: 1
  },
  author: {
    type: String,         // Will store user email
    required: [true, 'Author email is required']
  },
  authorName: {
    type: String,         // Will store display name
    required: [true, 'Author name is required']
  },
  previewAudio: {
    type: String,
    required: [true, 'Preview audio is required']
  },
  listens: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});


// Schema for storing audio URLs separately
const storyMediaSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
 
  chapterAudios: [{
    type: chapterSchema,
    required: true
  }]
});

// Indexes for better query performance
storyMediaSchema.index({ storyId: 1 });

// Schema for tracking unique listeners
const listenerTrackSchema = new mongoose.Schema({
  storyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  lastListenedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure unique combination of story and user
listenerTrackSchema.index({ storyId: 1, userEmail: 1 }, { unique: true });

// Update timestamp middleware
storySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Export models
export const Story = mongoose.models.Story || mongoose.model('Story', storySchema);
export const StoryMedia = mongoose.models.StoryMedia || mongoose.model('StoryMedia', storyMediaSchema);
export const ListenerTrack = mongoose.models.ListenerTrack || mongoose.model('ListenerTrack', listenerTrackSchema);
