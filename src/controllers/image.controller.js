const axios = require("axios");
const puppeteer = require("puppeteer");
require("dotenv").config();

exports.gerarImagem = async (req, res) => {
  let {
    musicPlayerURL,
    musicName,
    musicAuthor,
    musicDuration,
    discordUserAvatar,
  } = req.body;

  musicName = musicName.replace(/\[[^\]]*\]/g, "");
  musicName = musicName.replace(/\([^()]*\)/g, "");
  musicName = musicName.replace(/- /g, "");
  musicName = musicName.replace(/(ft.|feat.).*/g, "");

  musicName = musicName.trim();
  // fetch deezer api
  let musicInfo = await axios.get(
    `https://api.deezer.com/search/track?q=${musicName}`
  );

  //   musicInfo = await musicInfo.json();
  musicInfo = musicInfo?.data;

  // regex to remove parenteses and content inside

  musicName = musicInfo?.data[0]?.title || musicName;
  musicAuthor = musicInfo?.data[0]?.artist?.name || musicAuthor;
  musicDuration = musicInfo?.data[0]?.duration || musicDuration;
  musicPlayerURL = musicInfo?.data[0]?.album?.cover_big || musicPlayerURL;
  discordUserAvatar =
    discordUserAvatar ||
    "https://cdn.discordapp.com/attachments/1070772604450906173/1141526309370085376/Aviso.jpg";

  if (!musicDuration.toString().includes(":")) {
    let minutes = Math.floor(musicDuration / 60);
    let seconds = musicDuration - minutes * 60;
    // formart time 00:00
    console.log(seconds);
    // add 0 if seconds < 10 ex: 00:09
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    if (seconds < 10) {
      seconds = `0${seconds}`;
    }
    musicDuration = `${minutes}:${seconds}`;
  }

  const imgHTML = `
<html>
  <head>
    <style>
      body {
        width: 1280px;
        height: 720px;
        margin: 0px;
      }
    </style>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <image
      style="position: absolute"
      src="https://cdn.discordapp.com/attachments/1131702965586116719/1141520923703390288/Player_modelo.png"
      width="1280"
      height="720"
    />
    <div
      style="
        position: absolute;
        top: 135px;
        left: 135px;
        border-radius: 6px;
        width: 447px;
        height: 451px;
        background-image: url(${musicPlayerURL});
        background-position: center;
        background-size: cover;
      "
    ></div>
    <image
      style="position: absolute; left: 1109px; top: 44px; border-radius: 9999px"
      src="${discordUserAvatar}"
      width="127"
      height="127"
    />
    <div
      style="
        left: 649px;
        top: 297px;
        position: absolute;
        display: flex;
        flex-direction: column;
        color: white;
        font-family: Poppins, sans-serif;
      "
    >
      <h2 style="font-size: 44px; margin: 0px; max-width: 533px">
        ${musicName.slice(0, 60) + (musicName.length > 50 ? "..." : "")}
      </h2>
      <h2
        style="
          font-size: 27px;
          font-weight: 100;
          margin-bottom: 0px;
          margin-top: 0px
          max-width: 533px;
        "
      >
        ${musicAuthor}
      </h2>
      <h3 style="font-size: 40px; font-weight: 600; margin-top: 2px">${musicDuration}</h3>
    </div>
  </body>
</html>

    `;

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
  });
  await page.setContent(imgHTML);
  await page.screenshot({ path: "public/image.png" });
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
