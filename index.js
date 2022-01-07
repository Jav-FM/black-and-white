const yargs = require("yargs");
const http = require("http");
const fs = require("fs");
const Jimp = require("jimp");
const url = require("url");

// Para correr aplicación, escribir en termina:
// node index.js levantarServidor --k=123

const argv = yargs
  //Creación de comando:
  .command(
    "levantarServidor",
    "Comando para levantar servidor de black & white",
    {
      key: {
        describe: "Clave para levantar servidor",
        demand: "true",
        alias: "k",
      },
    },
    ({ key }) => {
      //Con clave correcta, se levanta servidor:
      if (key === 123) {
        http
          .createServer((req, res) => {
            //Ruta a raiz para renderizar formulario
            if (req.url == "/") {
              res.writeHead(200, {
                "Content-Type": 'text/html;charset"',
              });
              fs.readFile("index.html", "utf8", (err, html) => {
                res.end(html);
              });
            }
            //Aplicando estilos CSS desde archivo externo
            if (req.url == "/estilos") {
              res.writeHead(200, { "Content-Type": "text/css" });
              fs.readFile("styles.css", (err, css) => {
                res.end(css);
              });
            }
            //Imagen en blanco y negro
            if (req.url.includes("blancoynegro")) {
              const { img } = url.parse(req.url, true).query;
              Jimp.read(img, (err, lenna) => {
                if (err) throw err;
                lenna
                  .greyscale()
                  .quality(60)
                  .resize(350, Jimp.AUTO)
                  .writeAsync("newImg.jpg")
                  .then(() => {
                    fs.readFile("newImg.jpg", (err, imagen) => {
                      res.writeHead(200, { "Content-Type": "image/jpeg" });
                      res.end(imagen);
                    });
                  });
              });
            }
          })
          .listen(3000, () => {
            console.log("Server ON");
          });
      } else {
        //Respuesta en caso de clave incorrecta:
        console.log("Clave incorrecta");
      }
    }
  )
  .help().argv;
