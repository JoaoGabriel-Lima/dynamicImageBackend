const axios = require("axios");
const puppeteer = require("puppeteer");

exports.gerarImagem = async (req, res) => {
  let {
    musicPlayerURL,
    musicName,
    musicAuthor,
    musicDuration,
    discordUserAvatar,
  } = req.body;

  // fetch deezer api
  let musicInfo = await axios.get(
    `https://api.deezer.com/search/track?q=${musicName}`
  );

  //   musicInfo = await musicInfo.json();
  musicInfo = musicInfo?.data;

  musicName = musicInfo?.data[0]?.title || musicName;
  musicAuthor = musicInfo?.data[0]?.artist?.name || musicAuthor;
  musicDuration = musicInfo?.data[0]?.duration || musicDuration;
  musicPlayerURL = musicInfo?.data[0]?.album?.cover_big || musicPlayerURL;
  discordUserAvatar =
    discordUserAvatar ||
    "https://i.scdn.co/image/ab6761610000e5eba03696716c9ee605006047fd";

  if (!musicDuration.toString().includes(":")) {
    let minutes = Math.floor(musicDuration / 60);
    let seconds = musicDuration - minutes * 60;
    musicDuration = `${minutes}:${seconds}`;
  }

  const imgHTML = `
        <html><head><style>body {width: 1920px;height: 1080px; margin: 0px;}</style></head><body><image style="position: absolute"  src="https://cdn.discordapp.com/attachments/1131702965586116719/1141520923703390288/Player_modelo.png"  width="1920"  height="1080"/>
        <image
        style="position: absolute; top: 203px; left: 203px; border-radius: 9px"
        src="${musicPlayerURL}"
        width="670"
        height="676"
        />
        <image
        style="position: absolute; left: 1664px; top: 66px; border-radius: 9999px"
        src="${discordUserAvatar}"
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
        <h1 style="font-size: 45px; margin-bottom: 2px">
        ${musicName}
        </h1>
        <h2 style="font-size: 35px; font-weight: 300; margin-bottom: 0px">
        ${musicAuthor}
        </h2>
        <h3 style="font-size: 55px; font-weight: 600; margin-top: 20px">${musicDuration}</h3>
        </div>
        </body>
        </html>

    `;

  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await page.setContent(imgHTML);
  await page.screenshot({ path: "./public/image.png" });
  await browser.close();

  // await nodeHtmlToImage({
  //   output: "./public/image.jpg",
  //   html:`
  //       <html><head><style>body {width: 1920px;height: 1080px;}</style></head><body><image style="position: absolute"  src="https://cdn.discordapp.com/attachments/1131702965586116719/1141520923703390288/Player_modelo.png"  width="1920"  height="1080"/>
  //       <image
  //       style="position: absolute; top: 211px; left: 211px; border-radius: 9px"
  //       src="${musicPlayerURL}"
  //       width="670"
  //       height="676"
  //       />
  //       <image
  //       style="position: absolute; left: 1672px; top: 75px; border-radius: 9999px"
  //       src="${discordUserAvatar}"
  //       width="190"
  //       height="190"
  //       />
  //       <div
  //       style="
  //       left: 988px;
  //       top: 483px;
  //       position: absolute;
  //       display: flex;
  //       flex-direction: column;
  //       color: white;
  //       font-family: Verdana, Geneva, Tahoma, sans-serif;
  //       "
  //       >
  //       <h1 style="font-size: 45px; margin-bottom: 20px">
  //       ${musicName}
  //       </h1>
  //       <h2 style="font-size: 35px; font-weight: 300; margin-bottom: 0px">
  //       ${musicAuthor}
  //       </h2>
  //       <h3 style="font-size: 55px; font-weight: 600; margin-top: 20px">${musicDuration}</h3>
  //       </div>
  //       </body>
  //       </html>

  //   `,
  //   content: {
  //     musicPlayerURL: musicPlayerURL,
  //     musicName: musicName,
  //     musicAuthor: musicAuthor,
  //     musicDuration: musicDuration,
  //     discordUserAvatar:
  //       discordUserAvatar ||
  //       "https://i.scdn.co/image/ab6761610000e5eba03696716c9ee605006047fd",
  //   },
  // });

  // send image as response
  res.status(200).json({ message: "Image Created" });
};
