import AppError from "../utils/appError";
import { NextFunction, Response, Request } from "express";
import User from "../models/userModel";
import generateDocument from "../utils/documentGenerator";
import UserComplementaryData from "../models/userComplementaryDataModel";

// Define una interfaz para los datos que se reemplazarán en el documento
interface TemplateData {
  name: string;
  email: string;
  date: string;
}

const getFormatCurrDate = () => {
  const date = new Date();
  const formatDate = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return formatDate;
};

export const getDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { doc } = req.query;

  if (!doc) {
    return next(
      new AppError(
        "Ingrese el tipo de documento a descargar, ejemplo: .../downloadDoc?doc=paymentTransfer",
        401
      )
    );
  }

  let data;
  // currentDate =

  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError("No se encontro el usuario", 404));

  switch (doc) {
    case "paymentTransfer":
      data = {
        path: "./pago_transferencia.docx",
        data: {
          name: `${user.name}  ${user.paternSurname}  ${user.motherSurname}`,
          email: user.email,
          date: getFormatCurrDate(),
        },
      };
      break;
    case "individualContract":
      const complemetaryDataUser = await UserComplementaryData.findOne({
        user: req.params.id,
      });

      if (!complemetaryDataUser)
        return next(
          new AppError(
            "No existen datos complementarios para la creacion del documento.",
            404
          )
        );

      data = {
        path: "./contrato_individual.docx",
        data: {
          name: `${user?.name}  ${user?.paternSurname}  ${user?.motherSurname}`,
          age: user?.age,
          maritalStatus: user?.maritalStatus,
          gender: user?.gender,
          curp: complemetaryDataUser?.curp,
          rfc: complemetaryDataUser?.rfc,
          imssNumber: complemetaryDataUser?.imssNumber,
          address: user?.address,
          postalCode: user?.postalCode,
          date: getFormatCurrDate(),
        },
      };
      break;
    case "confidentialityAgreement":
      data = {
        path: "./contrato_confidencialidad.docx",
        data: {
          name: `${user?.name.toUpperCase()} ${user?.paternSurname.toUpperCase()} ${user?.motherSurname?.toUpperCase()}`,
          address: user?.address?.toUpperCase(),
          date: getFormatCurrDate().toUpperCase(),
        },
      };
      break;

    case "resignationLetter":
      data = {
        path: "./carta_renuncia.docx",
        data: {
          name: `${user?.name}  ${user?.paternSurname}  ${user?.motherSurname}`,
          date: getFormatCurrDate(),
        },
      };
      break;
  }

  if (!data || !data.path) {
    return next(
      new AppError("No se pudo encontrar la plantilla para el documento.", 404)
    );
  }

  try {
    const docBuffer = generateDocument(data);

    // Set headers http for dowload docs
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${doc}-user-${user?.employNumber}.docx`
    );

    // Send buffer doc
    res.send(docBuffer);
  } catch (error: any) {
    console.error("Error al generar el archivo:", error);
    return next(new AppError("Error al generar el documento", 500));
  }
};
