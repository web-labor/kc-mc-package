const fs = require('fs')
const path = require('path')
const yazl = require('yazl')
const crypto = require('crypto')
class KcMcPackage {
    constructor(opt) {
        this.opt = opt
    }
    apply(compiler) {
        const { projectName } = this.opt
        compiler.plugin('afterEmit', async (comilation, cb) => {
            console.log(
                '\n============================压缩文件=========================='
            )
            const pre = path.resolve(__dirname) + '/'
            const zipFile = new yazl.ZipFile()
            const zipFile2 = new yazl.ZipFile()

            for (const name in comilation.assets) {
                let source = comilation.assets[name].source()
                zipFile.addBuffer(Buffer.from(source), name)
            }
            zipFile.end()
            await new Promise((resolve) => {
                zipFile.outputStream.pipe(
                    fs.createWriteStream(`${pre}dist.zip`).on('close', () => {
                        const buffer = fs.readFileSync(
                            path.join(__dirname, `dist.zip`)
                        )
                        const hash = crypto.createHash('md5')
                        hash.update(buffer, 'utf8')
                        const md5 = hash.digest('hex')
                        const str = `${md5} ${projectName}.zip`
                        fs.writeFile(
                            `${pre}/${projectName}.txt`,
                            str,
                            function (err) {
                                if (err) {
                                    // 写入文件失败
                                } else {
                                    // 写入文件成功
                                    resolve('结束')
                                }
                            }
                        )
                    })
                )
            })
            await new Promise((resolve) => {
                zipFile2.addFile(`${pre}dist.zip`, `${projectName}.zip`)
                zipFile2.addFile(
                    `${path.resolve(__dirname, `${projectName}.txt`)}`,
                    `${projectName}.txt`
                )
                zipFile2.end()
                zipFile2.outputStream.pipe(
                    fs
                        .createWriteStream(
                            `${path.resolve(__dirname, `${projectName}.zip`)}`
                        )
                        .on('close', () => {
                            console.log('打包完成')
                            resolve()
                        })
                )
            })

            fs.unlink(`${pre}${projectName}.txt`, () => {})
            fs.unlink(`${pre}dist.zip`, () => {})
        })
    }
}

module.exports = KcMcPackage
