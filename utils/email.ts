import nodemailer from "nodemailer";

type User = { email: string; name: string };

const SendKEYSHTML = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body style="font-size: 0.8rem; font-family: sans-serif; background-color: #f1f3f5; height: 100vh; margin: 0; padding: 0; text-align: center;">
        <!-- HEADER -->
        <header style="background: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); background-size: cover; background-position: 50% 20%; height: 12rem; text-align: center; padding: 2rem;">
          <img src="https://dai.com.mx/Imagenes/Logo-Dai.png" alt="Logo dai" style="width: 10rem; filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.459));" />
          <h1 style="color: #fff; font-style: italic; font-size: 1.6rem; font-weight: 200;">¡ Tu Soporte en el Camino !</h1>
        </header>

        <!-- MAIN CONTENT -->
        <main style="padding: 1rem 2rem; text-align: center;">
          <div style="margin-bottom: 2rem;">
            <p style="display: inline-block; font-size: 1.2rem; font-weight: 700; color: #fff; background: linear-gradient(to right, #5c7cfa, #f06595); padding: 1rem 2rem; border-radius: 11px;">🎈🎉Bienvenido @NAME@ ya eres parte de la familia DAI🥳🎉</p>
          </div>

          <div style="display: inline-block; margin-bottom: 2rem;">
            <div>
              <p style="text-transform: uppercase; font-size: 1.2rem; font-weight: 600;">Su contraseña es:</p>
              <span style="font-size: 1.2rem; font-weight: 600; color: #1864ab;">@PASSWORD@</span>
            </div>

            <a href="#" style="text-transform: uppercase; font-size: 1.2rem; font-weight: 600; background-color: #099268; color: #fff; padding: 1rem 2rem; border-radius: 11px; text-decoration: none; display: inline-block; margin-top: 1.5rem;">Ingresar al sistema</a>
          </div>

          <div>
            <p style="color: #495057; font-size: 1.2rem; font-style: italic; font-weight: 500;">⚠️ Por tu seguridad, nunca compartas tu contraseña con nadie. Es información personal y confidencial que protege tu cuenta. Mantenerla privada es clave para evitar accesos no autorizados.</p>
          </div>
        </main>

        <!-- FOOTER -->
        <footer style="background-color: #212529; color: #fff; padding: 1.5rem 2rem; text-align: center;">
          <div style="display: inline-block; margin-bottom: 1.5rem;">
            <img src="https://dai.com.mx/Imagenes/Logo-Dai.png" alt="Logo dai" style="width: 7rem; filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.459));" />
            <p style="font-size: 1rem;">&copy; DISTRIBUIDORA DE AUTO INDUSTRIAS (DAI)</p>
          </div>
          <div style="display: inline-block; margin-bottom: 1.5rem;">
            <div style="margin-bottom: 1.5rem;">
              <p style="font-size: 1.2rem;">Visita nuestro sitio web</p>
              <a href="https://dai.com.mx/" style="color: #dbe4ff; text-decoration: none;">Dai page</a>
            </div>

            <div>
              <p style="font-size: 1.2rem;">Volver a Dai System</p>
              <a href="http://localhost:5173/login" style="color: #dbe4ff; text-decoration: none;">Dai System</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
`;
class Email {
  private to: string;
  private firstName: string;
  private url: string;
  private _from: string;

  constructor(user: User, url: string = "") {
    this.to = user.email;
    this.firstName = user.name;
    this.url = url;
    this._from = `Distribuidoras de Autoindustrias<${process.env.EMAIL_FROM}>`;
  }

  private _newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template: string, subject: string) {
    // 1) rende HTML based on pug template
    const html = `${template}`;

    // 2) Define the email option
    const mailOptions = {
      from: this._from,
      to: this.to,
      subject,
      html,
    };

    //3) Create a transport and send email
    await this._newTransport().sendMail(mailOptions);
  }

  async sendPassword({ password }: { password: string }) {
    // 1) rende HTML based on pug template
    const html = `${SendKEYSHTML.replace("@NAME@", this.firstName).replace(
      "@PASSWORD@",
      password
    )}`;

    // 2) Define the email option
    const mailOptions = {
      from: this._from,
      to: this.to,
      subject: "DAI - contraseña",
      html,
    };

    //3) Create a transport and send email
    await this._newTransport().sendMail(mailOptions);
  }
}

export default Email;
