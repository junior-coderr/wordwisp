import mongoose, { Schema } from 'mongoose';

const userMessageSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const UserMessage = mongoose.models.UserMessage || mongoose.model('UserMessage', userMessageSchema);

export default UserMessage;
