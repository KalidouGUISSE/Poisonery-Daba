import { Schema, model } from "mongoose"

type CounterDocument = {
  _id: string
  seq: number
}

const counterSchema = new Schema<CounterDocument>(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false }
)

export const CounterModel = model<CounterDocument>("Counter", counterSchema)

export async function getNextSequence(name: string) {
  const counter = await CounterModel.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean()

  return counter.seq
}
