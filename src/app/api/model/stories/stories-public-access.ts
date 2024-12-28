import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  coverImageUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  audioPreviewUrl: {
    type: String,
    required: true
  },
  full_story_token: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

const Story = mongoose.model('Story', storySchema);

export default Story;
