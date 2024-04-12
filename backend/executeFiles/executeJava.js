const { exec } = require("child_process");

const executeJava = (filepath, input) => {
    return new Promise((resolve, reject) => {
        var child = exec(
            `cd ${filepath} && java Main.java `,
            (error, stdout, stderr) => {
                error && reject({ error, stderr });
                stderr && reject(stderr);
                resolve(stdout);
                if (stdout == "") {
                    resolve(stdout = "")
                }
            }
        );
        
        if(input){
            child.stdin.write(input)
            child.stdin.end()
        }

        setTimeout(()=>{
            child.kill('SIGINT')
        },5000)
    });
};

module.exports = { executeJava }
