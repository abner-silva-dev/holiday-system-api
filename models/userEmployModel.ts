// import mongoose, { Model, Schema } from "mongoose";

// export interface DocsDocument extends Document {
//   curriculumVitae: string;
//   actaNacimiento: string;
//   curp: string;
//   comprobanteDomicilio: string;
//   ine: string;
//   imssDoc: string;
//   rfc: string;
//   creditoInfonavit: string;
//   afore: string;
//   cartaRecomentacion: string;
//   estadoCuenta: string;
//   comprobanteEstudiosCelula: string;
//   licenciaConducir: string;
// }

// export interface ArchiveDocument extends Document {
//   archive: DocsDocument[];
//   user: mongoose.Types.ObjectId;
// }

// const archiveSchema = new Schema({
//   archive: [
//     {
//       curriculumVitae: String,
//       actaNacimiento: String,
//       curp: String,
//       comprobanteDomicilio: String,
//       ine: String,
//       imssDoc: String,
//       rfc: String,
//       creditoInfonavit: String,
//       afore: String,
//       cartaRecomentacion: String,
//       estadoCuenta: String,
//       comprobanteEstudiosCelula: String,
//       licenciaConducir: String,
//     },
//   ],

//   user: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: [true, "El Archivo deben estar asociadas a un usuario"],
//   },
// });

// const Archive: Model<ArchiveDocument> = mongoose.model<ArchiveDocument>(
//   "Archive",
//   archiveSchema
// );

// export default Archive;

import mongoose, { Document, Model } from "mongoose";

const { Schema } = mongoose;

interface EmployDocument extends Document {
  companyName: string;
  businessField: string;
  address: string;
  phone: string;
  startDate: string;
  endDate: string;
  position: string;
  finalSalary: string;
  immediateBoss: string;
  separationReason: string;
}

export interface EmploysDocument extends Document {
  employs: EmployDocument[];
  user: mongoose.Types.ObjectId;
}

const employSchema = new Schema<EmploysDocument>({
  employs: [
    {
      companyName: { type: String, required: true },
      businessField: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
      position: { type: String, required: true },
      finalSalary: { type: String, required: true },
      immediateBoss: { type: String, required: true },
      separationReason: { type: String, required: true },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const UserEmploy: Model<EmployDocument> = mongoose.model<EmployDocument>(
  "userEmploys",
  employSchema
);

export default UserEmploy;
