process.env.PATH = `${process.env.PATH}:${__dirname}/wkhtmltopdf/lib`

const { spawn } = require("child_process")

module.exports = html => new Promise(((resolve, reject) => {
    const bufs = []

    const proc = spawn(
        "/bin/sh",
        ["-o", "pipefail", "-c", `${__dirname}/bin/wkhtmltopdf - - | cat`],
        { env: { ...process.env, FONTCONFIG_PATH: `/var/task/fonts` } }
    )

    proc
        .on("error", error => reject(error))
        .on("exit", code => {
            if (code) {
                reject(new Error(`wkhtmltopdf process exited with code ${code}`))
            } else {
                resolve(Buffer.concat(bufs))
            }
        });

    proc.stdin.end(html)

    proc.stdout
        .on("data", data => bufs.push(data))
        .on("error", error => reject(error))
}))