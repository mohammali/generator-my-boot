'use strict';

const Generator = require('yeoman-generator');
const path = require('path');
const fse = require('fs-extra');
const maven = require('maven');

module.exports = class extends Generator {
    initializing() {
        this.log.info('initializing');
        this.springVersion = '2.2.4.RELEASE';
        this.appName = path.basename(this.destinationRoot());
        this.groupId = 'com.example';
        this.artifactId = this.appName;
        this.kotlinVersion = '1.3.61';
    }

    prompting() {
        this.log.info('prompting');
        const prompts = [];

        prompts.push({
            type: 'input',
            name: 'appName',
            message: 'Application name',
            default: this.appName
        });

        prompts.push({
            type: 'input',
            name: 'groupId',
            message: 'Group Id',
            default: this.groupId
        });

        prompts.push({
            type: 'input',
            name: 'artifactId',
            message: 'Artifact Id',
            default: path.basename(this.destinationRoot())
        });

        prompts.push({
            type: 'input',
            name: 'kotlinVersion',
            message: 'Kotlin Version',
            default: this.kotlinVersion
        });

        prompts.push({
            type: 'input',
            name: 'springVersion',
            message: 'Spring Boot Version',
            default: this.springVersion
        });

        return this.prompt(prompts).then(props => {
            // To access props later use this.props.someAnswer;
            this._installFeatures(props);
        });
    }

    configuring() {
        this.log.info('config');
        this.log.info(this.groupId);
        this.packageFolders = `${this.groupId.replace('.', '/')}/${this.appName}`;
        this.packageSignature = `${this.groupId}.${this.artifactId}`;
        this.config.set('appName', this.appName);
        this.config.set('groupId', this.groupId);
        this.config.set('artifactId', this.artifactId);
        this.config.set('kotlinVersion', this.kotlinVersion);
        this.config.set('springVersion', this.springVersion);
        this.config.set('packageSignature', this.packageSignature);
        this.config.set('packageFolders', this.packageFolders);
    }

    writing() {
        this.log.info('writing');
        /* Maven POM */
        this._copyTpl('pom.xml', 'pom.xml');

        /* Main Code */
        let mainDir = 'src/main/kotlin';
        fse.mkdirp(mainDir);
        let srcMain = `${mainDir}/${this.packageFolders}`;

        this._copyTpl('main/kotlin/Application.kt', `${srcMain}/Application.kt`);
    }

    install() {
        this.log.info('install');
        let done = this.async();
        maven
            .create({cwd: this.destinationRoot(), quiet: true, threads: '1C'})
            .execute('initialize')
            .then(() => {
                this.log.ok('Maven project is valid');
                done();
            });
    }

    _installFeatures(props) {
        Object.keys(props).forEach((k) => {
            this[k] = props[k];
        });
    }

    _copy(src, dest) {
        this.fs.copy(this.templatePath(src), this.destinationPath(dest));
    }

    _copyTpl(src, dest) {
        this.fs.copyTpl(this.templatePath(src), this.destinationPath(dest), this);
    }
};
