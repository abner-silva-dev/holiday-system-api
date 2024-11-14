import mongoose, { Model, Schema } from "mongoose";

export interface ArchiveDocument extends Document {
  curriculumVitae: string;
  actaNacimiento: string;
  curp: string;
  comprobanteDomicilio: string;
  ine: string;
  imssDoc: string;
  rfc: string;
  creditoInfonavit: string;
  afore: string;
  cartaRecomentacion: string;
  estadoCuenta: string;
  comprobanteEstudiosCelula: string;
  licenciaConducir: string;
  user: mongoose.Types.ObjectId;
}

const archiveSchema = new Schema({
  curriculumVitae: String,
  actaNacimiento: String,
  curp: String,
  comprobanteDomicilio: String,
  ine: String,
  imssDoc: String,
  rfc: String,
  creditoInfonavit: String,
  afore: String,
  cartaRecomentacion: String,
  estadoCuenta: String,
  comprobanteEstudiosCelula: String,
  licenciaConducir: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El Archivo deben estar asociadas a un usuario"],
  },
});

const Archive: Model<ArchiveDocument> = mongoose.model<ArchiveDocument>(
  "Archive",
  archiveSchema
);

export default Archive;
