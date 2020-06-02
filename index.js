const path = require("path");
const fs = require("fs");
const https = require("https");
const getBasePath = () => {
  if (process.argv.length > 2) return process.argv[2];
  if (process.platform === "win32") return "C:\\SkIDE\\bin\\";
  if (process.platform === "darwin")
    return "/Applications/SkIDE.app/Contents/Java/bin/";
  return null;
};
const fetchUrl = (
  url,
  parseJSON = true,
  requestSecure = true,
  logging = false
) => {
  const reqMod = https;
  if (logging) console.log("REQ START", requestSecure ? "https" : "http", url);
  return new Promise((resolve, reject) => {
    reqMod
      .get(url, (resp) => {
        const dataBuffers = [];
        resp.on("data", (chunk) => {
          dataBuffers.push(chunk);
        });

        resp.on("end", () => {
          if (logging)
            console.log("REQ END", requestSecure ? "https" : "http", url);
          const joined = dataBuffers.join("");
          resolve(parseJSON ? JSON.parse(joined) : joined);
        });
      })
      .on("error", (err) => {
        if (logging)
          console.log("REQ ERROR", requestSecure ? "https" : "http", url, err);
        reject(err);
      });
  });
};

const getOsNum = () => {
  if (process.platform === "win32") return 0;
  if (process.platform === "darwin") return 1;
  if (process.platform === "linux") return 2;
  return -1;
};

console.log("Detected OS:", process.platform);
if (getOsNum() === -1) {
  console.log("unsupported os");
  process.exit(0);
}
const baseFolder = getBasePath();
const homedir = require("os").homedir();
if (fs.existsSync(path.join(homedir, ".skide_lockfile"))) {
  console.log(
    `SkIDE is Running, please quit it before starting this, or delete the lockfile "${path.join(
      homedir,
      ".skide_lockfile"
    )}" if its not running`
  );
  process.exit(0);
}
if (!fs.existsSync(baseFolder)) {
  console.log("base dir does not exist");
  process.exit(0);
}

const versionFile = path.join(baseFolder, "versions");
if (!fs.existsSync(versionFile)) {
  console.log("local version file doesnt exist");
  process.exit(0);
}
const localContent = JSON.parse(fs.readFileSync(versionFile, "utf-8"));
const REMOTE_URL = "https://skide.liz3.net/?_q=version";
fetchUrl(REMOTE_URL)
  .then((res) => {
    const { latest, beta } = res;
    if (
      !fs.existsSync(path.join(baseFolder, "ide.jar")) ||
      latest !== localContent.binary ||
      (localContent.beta && beta !== localContent.binary)
    ) {
      const targetVersion = localContent.beta ? beta : latest;
      console.log(`Upgrading => ${targetVersion}`);
      const file = fs.createWriteStream(path.join(baseFolder, "ide.jar"));
      const request = https.get(
        `https://skide.liz3.net/?_q=get&component=binary&os=${getOsNum()}&ver=${targetVersion}`,
        (response) => {
          response.on("end", () => {
            localContent.binary = targetVersion;
            fs.writeFileSync(versionFile, JSON.stringify(localContent));
            console.log("finished upgrading!");
          });
          response.pipe(file);
        }
      );
    } else {
      console.log("SKIDE is on the newest version");
    }
  })
  .catch((err) => {
    console.log("failed to fetch remote data");
  });
