const readline = require("readline");
const fs = require("fs");

const output = fs.createWriteStream("../src/words.json");

let rl = readline.createInterface({
  input: fs.createReadStream("./1-1000.txt"),
});

let line_no = 0;

output.write("[\n");

rl.on("line", function (line) {
  line_no++;
  if (line.length > 2) {
    line_wr++;
    output.write(`  "${line}",\n`);
  }
});

rl.on("close", function (line) {
  output.write("]\n");
  output.close();
  console.log(`Total lines: ${line_no} | wrote: ${line_wr}`);
  console.log(linesOf);
});
