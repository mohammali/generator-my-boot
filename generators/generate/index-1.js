"use strict";

const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  initializing() {}

  prompting() {
    const prompts = [];

    prompts.push({
      type: "input",
      name: "appName",
      message: "Application name",
      default: this.appName
    });

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  configuring() {}

  writing() {}

  install() {}
};
