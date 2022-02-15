#!/usr/bin/env node
/*
 * Firstly, clone the boilerplate from github to a new folder.
 ! Secondly, change directories to the folder and install the dependencies in the package.json
 ? Thirdly,
 TODO: Fourthly
 */
const fs = require("fs");
const util = require("util");
const path = require("path");
const exec = util.promisify(require("child_process").exec);
const packageJson = require("../package.json");

// const https = require("https");
// const scripts = `"start": "react-scripts start",\n"build": "react-scripts build", \n"test": "react-scripts test",\n"eject": "react-scripts eject"`;
const babel = `"babel": ${JSON.stringify(packageJson.babel)}`;
const gitIgnore = `https://gist.githubusercontent.com/abrahym-sharfeldden/d954a5b16df0984617662f0ce38312cf/raw/50288c5167eacbe6d92789c8b9a76d01eb8c7407/.gitignore`;

// setting console.log color constants
const logDefault = "\x1b[0m";
const logError = "\x1b[31m";
const logColor1 = "\x1b[33m";
const logColor2 = "\x1b[34m";

// Verify that an app name is provided
if (process.argv.length < 3) {
	console.log(logError, "Please provide a name for your app.\n For example: ", "npx react-boilerplate my-app");
	process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo = "https://github.com/abrahym-sharfeldden/react-boilerplate.git";

try {
	fs.mkdirSync(projectPath);
} catch (err) {
	if (err.code == "EEXIST") {
		console.log(
			logError,
			`The project '${projectName}' already exist in the current directory, please give it another name.`,
			logDefault
		);
	} else {
		console.log(err);
	}
	fs.rm(projectPath, { recursive: true });
	process.exit(1);
}

const executeCommand = async (command) => {
	try {
		const { stdout, stderr } = await exec(command);
		console.log(stdout);
		console.log(stderr);
	} catch (error) {
		console.log(logError, error, logDefault);
	}
};

const createPackageJSON = async (packageJson, projectName) => {
	const { bin, keywords, license, homepage, repository, bugs, ...newPackage } = packageJson;

	Object.assign(newPackage, {
		name: projectName,
		version: "1.0.0",
		description: "",
		author: "",
		scripts: {
			start: "react-scripts start",
			build: "react-scripts build",
			test: "react-scripts test",
			eject: "react-scripts eject",
		},
		dependencies: {
			react: "^17.0.2",
			"react-dom": "^17.0.2",
			"react-scripts": "^3.4.4",
		},
		devDependencies: {
			"react-error-overlay": "6.0.9",
		},
		resolutions: {
			"react-error-overlay": "6.0.9",
		},
	});

	fs.writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(newPackage, null, 2));
};

(async () => {
	/* Main function, executes once all the previous checks pass
	 * * Firstly, clone the boilerplate from github to a new folder.
	 * * Secondly, change directories (process.chdir(path) = cd path) to the folder and install the dependencies in the package.json
	 * * Thirdly, remove ./.git ./bin ./LICENSES.MD ./package.json from the new project
	 */

	console.log("Initializing project..");
	try {
		console.log(logColor1, "Downloading the boilerplate from Github...", logDefault);
		await executeCommand(`git clone --depth 1 ${git_repo} ${projectPath}`);

		process.chdir(projectPath);
		console.log(logColor1, "Installing dependencies...", logDefault);
		await executeCommand(`npm install`);
		console.log();

		await executeCommand("rm -rf ./.git");
		fs.unlinkSync(path.join(projectPath, "LICENSE.MD"));
		fs.rm(path.join(projectPath, "bin"), { recursive: true }, (err) => {
			if (err) {
				console.error(err.message);
				return;
			}
		});
		fs.unlinkSync(path.join(projectPath, "package.json"));

		console.log(logColor1, "Building package.json", logDefault);
		await createPackageJSON(packageJson, projectName);

		console.log("\x1b[32m", "The installation is done, this is ready to use !", "\x1b[0m");
		console.log();

		console.log("\x1b[34m", "You can start by typing:");
		console.log(`\tcd ${projectName}`);
		console.log("\tnpm start", "\x1b[0m");
		console.log();
		console.log("Check Readme.md for more informations");
	} catch (error) {
		console.log(error);
		fs.rm(projectPath, { recursive: true }, (err) => {
			if (err) {
				console.error(err.message);
				return;
			}

			console.log("File deleted successfully");
		});
	}
})();
