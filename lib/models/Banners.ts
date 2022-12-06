import mongoose from 'mongoose'

const BannersSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Products',
    },
  },
  { timestamps: true }
)

export default mongoose.models.Banners || mongoose.model('Banners', BannersSchema)
