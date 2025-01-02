import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  image: string;
  email: string;
  userType: 'listener' | 'creator';
  storiesUploaded?: mongoose.Types.ObjectId[];
  likedStories?: mongoose.Types.ObjectId[];
  totalEarnings?: number;
  password?: string;
  isVerified?: boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: false, default: null },
  email: { type: String, required: true, unique: true },
  userType: { 
    type: String, 
    enum: ['listener', 'creator'], 
    default: 'listener' 
  },
  storiesUploaded: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Story' 
  }],
  likedStories: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Story' 
  }],
  totalEarnings: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isSubscribed: {
    type: Boolean,
    default: false
  },
  password: { type: String },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;