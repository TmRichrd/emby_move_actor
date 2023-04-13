const fs = require('fs')
const path = require('path')
const request = require('request')
// themoviedb API 密钥 (v3 auth)
const tmdbKey = ""

const mediaDir = 'Z:/'

const filePath = path.resolve(mediaDir);

/**
 * 查询目标 目录下所有文件或文件夹名为 filename 的文件路径
 * @param {String} dir  查询目录
 * @param {String} filename  查询文件的名称
 * @returns {Array} 所有满足条件的文件路径
 */
function getAllDirbyFilename (dir, filename) {
  let dirPath = path.resolve(__dirname, dir);
  let files = fs.readdirSync(dirPath); // 该文件夹下的所有文件名称 (文件夹 + 文件)
  let resultArr = [];

  files.forEach(file => {
    let filePath = dir + '/' + file; // 当前文件 | 文件夹的路径

    // 满足查询条件文件
    if (file.includes(filename))
    {
      return resultArr.push(filePath);
    }

    // 继续深搜文件夹
    if (fs.statSync(filePath).isDirectory())
    {
      resultArr.push(...getAllDirbyFilename(filePath, filename));
    }

  })

  return resultArr;
}

let fileArr = getAllDirbyFilename(mediaDir, '.actor');

function getImages (actorDirs = []) {
  if (actorDirs.length)
  {
    actorDirs.forEach((img) => {
      fs.readdir(img, (err, file) => {
        if (file && file.length)
        {
          for (let i = 0; i < file.length; i++)
          {
            const item = file[i];
            const imgpath = img + '/' + item
            if (!imgpath.includes('tmdb'))
            {
              let pos = imgpath.lastIndexOf('/')
              let str = imgpath.substr(pos + 1)
              let aname = str.substring(0, str.lastIndexOf("."))
              let pname = str.substring(0, str.lastIndexOf(".")).replace(/_/g, ' ')
              console.log(`请求人物${pname}`);
              const url = `https://api.themoviedb.org/3/search/person?api_key=${tmdbKey}&query=${encodeURI(pname)}&page=1&include_adult=false`
              request(url, (err, res, body) => {
                if (!err && res.statusCode == 200)
                {
                  const data = JSON.parse(body)
                  if (data.results && data.results.length)
                  {
                    const tmdbId = data.results[0].id
                    console.log(`人物${pname}-------tmdb--------编号为:${tmdbId}`);
                    fs.rename(imgpath, `${img}/${aname}-tmdb-${tmdbId}.jpg`, err => { })
                  }
                }
              })
            }
          }
        }
      })
    })
  }
}
getImages(fileArr)