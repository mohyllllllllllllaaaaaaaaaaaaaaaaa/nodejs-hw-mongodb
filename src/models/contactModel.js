import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: String,
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      required: true,
    },
     userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,

    },
  },
  { timestamps: true, versionKey: false }
);

export default model('Contact', contactSchema);