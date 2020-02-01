"use strict";

const Generator = require("yeoman-generator");
const path = require("path");
const fse = require("fs-extra");
const maven = require("maven");

module.exports = class extends Generator {
  initializing() {
    this.log.info("initializing");
    this.springVersion = "2.2.4.RELEASE";
    this.appName = path.basename(this.destinationRoot());
    this.groupId = "com.example";
    this.artifactId = this.appName;
    this.kotlinVersion = "1.3.61";
    this.email = "user@example.com";
    this.maintainer = "me";
    this.jarFileName = "service";
  }

  prompting() {
    this.log.info("prompting");
    const prompts = [];

    prompts.push({
      type: "input",
      name: "appName",
      message: "Application name",
      default: this.appName
    });

    prompts.push({
      type: "input",
      name: "groupId",
      message: "Group Id",
      default: this.groupId
    });

    prompts.push({
      type: "input",
      name: "artifactId",
      message: "Artifact Id",
      default: path.basename(this.destinationRoot())
    });

    prompts.push({
      type: "input",
      name: "kotlinVersion",
      message: "Kotlin Version",
      default: this.kotlinVersion
    });

    prompts.push({
      type: "input",
      name: "springVersion",
      message: "Spring Boot Version",
      default: this.springVersion
    });

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this._installFeatures(props);
    });
  }

  configuring() {
    this.packageFolders = `${this.groupId.replace(".", "/")}/${this.appName}`;
    this.packageSignature = `${this.groupId}.${this.artifactId}`;
    let validAppName = this.appName.replace(" ", "_").replace("-", "_");
    this.dbUser = `${validAppName}_user`;
    this.dbName = `${validAppName}_db`;
    this.dbPassword = this._generatePassword(16);

    this.config.set("appName", this.appName);
    this.config.set("groupId", this.groupId);
    this.config.set("artifactId", this.artifactId);
    this.config.set("kotlinVersion", this.kotlinVersion);
    this.config.set("springVersion", this.springVersion);
    this.config.set("packageSignature", this.packageSignature);
    this.config.set("packageFolders", this.packageFolders);
    this.config.set("dbUser", this.dbUser);
    this.config.set("dbName", this.dbName);
    this.config.set("dbPassword", this.dbPassword);
  }

  writing() {
    this.log.info("writing");

    /* Maven POM */
    this._copyTpl("pom.xml", "pom.xml");

    /* Docker files */
    this._copyTpl("docker/docker-compose.yml", "docker-compose.yml");
    this._copyTpl("docker/docker-entrypoint.sh", "docker-entrypoint.sh");
    this._copyTpl("docker/Dockerfile", "Dockerfile");
    this._copyTpl("docker/run-on-docker.sh", "run-on-docker.sh");

    /* SQL file */
    fse.mkdirp("sql");
    this._copyTpl(
      "sql/create_database_user.sql",
      "sql/create_database_user.sql"
    );

    /* Main Code */
    let mainDir = "src/main";
    fse.mkdirp(`${mainDir}/kotlin`);
    let srcMain = `${mainDir}/kotlin/${this.packageFolders}`;
    fse.mkdirp(`${mainDir}/resources`);
    let resMain = `${mainDir}/resources`;

    /* Code */
    this._copyTpl("main/kotlin/Application.kt", `${srcMain}/Application.kt`);

    /* Resources */
    this._copyTpl(
      "main/resources/application.yml",
      `${resMain}/application.yml`
    );
    this._copyTpl(
      "main/resources/application-prod.yml",
      `${resMain}/application-prod.yml`
    );
    this._copyTpl("main/resources/banner.txt", `${resMain}/banner.txt`);
    this._copyTpl(
      "main/resources/logback-spring.xml",
      `${resMain}/logback-spring.xml`
    );

    fse.mkdirp(`${resMain}/db/changelog`);
    this._copyTpl(
      "main/resources/db/changelog.xml",
      `${resMain}/db/changelog.xml`
    );

    /* Test Code */
    let testDir = "src/test/kotlin";
    fse.mkdirp(testDir);
    let srcTest = `${testDir}/${this.packageFolders}`;

    this._copyTpl(
      "test/kotlin/ApplicationTest.kt",
      `${srcTest}/ApplicationTest.kt`
    );
  }

  install() {
    this.log.info("install");
    let done = this.async();
    maven
      .create({ cwd: this.destinationRoot(), quiet: true, threads: "1C" })
      .execute("initialize")
      .then(() => {
        this.log.ok("Maven project is valid");
        done();
      });
  }

  _installFeatures(props) {
    Object.keys(props).forEach(k => {
      this[k] = props[k];
    });
  }

  _copy(src, dest) {
    this.fs.copy(this.templatePath(src), this.destinationPath(dest));
  }

  _copyTpl(src, dest) {
    this.fs.copyTpl(this.templatePath(src), this.destinationPath(dest), this);
  }

  _generatePassword(length) {
    let charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    let i = 0;
    let n = charset.length;
    for (; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    return retVal;
  }
};
