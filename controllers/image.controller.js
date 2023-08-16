const { successResponse } = require("../helpers/methods");
const nodeHtmlToImage = require("node-html-to-image");

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
// exports.index = async (req, res) => {
//   res.send(
//     successResponse("Express JS API Boiler Plate working like a charm...", {
//       data: "here comes you payload...",
//     })
//   );
// };

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.gerarImagem = async (req, res) => {
  nodeHtmlToImage({
    output: "./public/image.jpg",
    html: "<html><body>Hello world!</body></html>",
  }).then(() => console.log("The image was created successfully!"));

  // send image as response
  res.send(
    successResponse(
      "Express JS API Boiler Plate post api working like a charm...",
      {
        data: "http://localhost:5000/image.jpg",
      }
    )
  );
};
