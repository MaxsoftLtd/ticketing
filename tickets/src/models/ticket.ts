import mongoose from "mongoose";

// An intreface for creating new ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// An interface for ticket's model props
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// An interface for ticket document
interface TicketDoc extends mongoose.Document {
  id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
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
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
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
  // 1. Filter the update to only look for the current version
  if (!this.isNew) {
    this.$where = {
      version: this.get("version"),
    };
  }

  // 2. Manually increment the version number for the upcoming save
  const currentVersion = this.get("version") || 0;
  this.set("version", currentVersion + 1);
});

schema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", schema);

export { Ticket };
