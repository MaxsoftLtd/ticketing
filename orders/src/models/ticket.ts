import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";

// An intreface for creating new ticket
interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

// An interface for ticket's model props
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

// An interface for ticket document
interface TicketDoc extends mongoose.Document {
  id: string;
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

schema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    ...attrs,
    _id: attrs.id,
  });
};

schema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

schema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", schema);

export { Ticket, TicketDoc };
