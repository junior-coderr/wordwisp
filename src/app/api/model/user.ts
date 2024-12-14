import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  image: string;
  email: string;
  book_access: mongoose.Types.ObjectId[];
  transactions: mongoose.Types.ObjectId;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  book_access: [{ type: mongoose.Types.ObjectId, ref: 'Story', required: false }],
  transactions: { type: mongoose.Types.ObjectId, ref: 'Transaction', required: false }
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;