import mongoose from "mongoose";
import { OrderStatus } from "@hmtickets.org/common";

// An intreface for creating new Order
interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

// An interface for Order's model props
interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

// An interface for Order document
interface OrderDoc extends mongoose.Document {
  id: string;
  userId: string;
  status: OrderStatus;
  version: number;
  price: number;
}

const schema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
  },
  {
    versionKey: "version",
    toJSON: {
      transform(doc, ret: Record<string, any>) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

schema.pre("save", function () {
  if (!this.isNew) {
    this.$where = {
      version: this.get("version"),
    };
  }

  const currentVersion = this.get("version") || 0;
  this.set("version", currentVersion + 1);
});

schema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    ...attrs,
    _id: attrs.id,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", schema);

export { Order };
