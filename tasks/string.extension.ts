interface String {
  format(...args: any[]): string;
  replaceAll(find: string, replace: string): string;
}

String.prototype.format = function (...args: any[]) {
  // use replace to iterate over the string
  // select the match and check if related argument is present
  // if yes, replace the match with the argument
  return this.replace(/{([0-9]+)}/g, function (match, index) {
    // check if the argument is present
    return typeof args[index] == "undefined" ? match : args[index];
  });
};

String.prototype.replaceAll = function (find: string, replace: string) {
  let regExp = new RegExp(find, "g");
  return this.replace(regExp, replace);
};
