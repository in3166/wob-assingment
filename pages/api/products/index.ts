import Product from 'lib/models/Products'
import User from 'lib/models/Users'
import { NextApiRequest, NextApiResponse } from 'next'
import handlers from '../../../lib/_handlers'
import formidable from 'formidable'
import { v1 } from 'uuid'

export const config = {
  api: {
    bodyParser: false,
  },
}
const handler = handlers()

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const products = await Product.find({}).populate({ path: 'owner', model: User, select: '-password' })
  res.status(200).json({ success: true, products })
})

const asyncPares = (req: NextApiRequest): Promise<{ fields: any; files: any }> =>
  new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      uploadDir: `./public/products`,
      filter({ name }) {
        return !!name && (name.includes('img') || name.includes('file'))
      },
      filename(name, ext, part) {
        return `${v1()}-${part.originalFilename}`
      },
      maxFileSize: 5 * 1024 * 1024,
      multiples: true,
    })
    form.on('file', (name, file) => {
      if (!file.mimetype?.includes('image')) {
        throw new Error('Not image file.')
      }
    })
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      // resolve "returns" the promise so you will have a straighforward logic flow
      resolve({ fields, files })
      return null
    })
  })

handler.post(async (req: any, res: NextApiResponse) => {
  // const form = new formidable.IncomingForm()
  const result = await asyncPares(req)
  const { fields, files } = result

  const body = JSON.parse(fields.body)
  body.data.image = `/products/${files.file.newFilename}`

  const products = await Product.create(body.data)
  // res.status(200).json({ success: true, products })
  res.status(201).json({ success: true, data: products })
})

export default handler
