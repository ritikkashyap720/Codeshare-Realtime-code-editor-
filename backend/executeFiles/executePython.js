const { exec } = require("child_process");


const executePython = (filepath, input) => {
  return new Promise((resolve, reject) => {
    const child = exec(
      `python -u "${filepath}"`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
        if (stdout == "") {
          resolve(stdout = "")
        }
      }
    );
    if (input) {
      child.stdin.write(input)
      child.stdin.end()
    }
  });
};


module.exports = {
  executePython,
};