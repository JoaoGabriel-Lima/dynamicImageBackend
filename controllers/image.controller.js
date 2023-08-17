const { successResponse } = require("../helpers/methods");
const nodeHtmlToImage = require("node-html-to-image");
const fetch = require("node-fetch");

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
  let {
    musicPlayerURL,
    musicName,
    musicAuthor,
    musicDuration,
    discordUserAvatar,
  } = req.body;

  // fetch deezer api
  let musicInfo = await fetch(
    "https://api.deezer.com/search/track?q=" + musicName
  );
  musicInfo = await musicInfo.json();

  musicName = musicInfo?.data[0]?.title || musicName;
  musicAuthor = musicInfo?.data[0]?.artist?.name || musicAuthor;
  musicDuration = musicInfo?.data[0]?.duration || musicDuration;
  musicPlayerURL = musicInfo?.data[0]?.album?.cover_big || musicPlayerURL;

  await nodeHtmlToImage({
    output: "./public/image.jpg",
    html: `
        <html><head><style>body {width: 1920px;height: 1080px;}</style></head><body><image style="position: absolute"  src="https://cdn.discordapp.com/attachments/1131702965586116719/1141520923703390288/Player_modelo.png"  width="1920"  height="1080"/>
        <image
        style="position: absolute; top: 211px; left: 211px; border-radius: 9px"
        src="{{musicPlayerURL}}"
        width="670"
        height="676"
        />
        <image
        style="position: absolute; left: 1672px; top: 75px; border-radius: 9999px"
        src="{{discordUserAvatar}}"
        width="190"
        height="190"
        />
        <div
        style="
        left: 988px;
        top: 483px;
        position: absolute;
        display: flex;
        flex-direction: column;
        color: white;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        "
        >
        <h1 style="font-size: 45px; margin-bottom: 20px">
        {{musicName}}
        </h1>
        <h2 style="font-size: 35px; font-weight: 300; margin-bottom: 0px">
        {{musicAuthor}}
        </h2>
        <h3 style="font-size: 55px; font-weight: 600; margin-top: 20px">{{musicDuration}}</h3>
        </div>
        </body>
        </html>

    `,
    content: {
      musicPlayerURL: musicPlayerURL,
      musicName: musicName,
      musicAuthor: musicAuthor,
      musicDuration: musicDuration,
      discordUserAvatar:
        discordUserAvatar ||
        "https://i.scdn.co/image/ab6761610000e5eba03696716c9ee605006047fd",
    },
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
