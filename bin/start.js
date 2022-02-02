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
		await exec(command);
	} catch (error) {
		console.log(logError, error, logDefault);
	}
};

const createPackageJSON = (packageJson, projectName) => {
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

	fs.writeFile(`${process.cwd()}/package.json`, JSON.stringify(newPackage, null, 2));
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
		await executeCommand(`git clone --depth 1 ${git_repo} ${projectPath}`).then((res) => console.log(res));

		process.chdir(projectPath);
		console.log(logColor1, "Installing dependencies...", logDefault);
		await executeCommand(`npm install`);
		console.log();

		await executeCommand("rm -rf ./.git");
		fs.unlinkSync(path.join(projectPath, "LICENSE.MD"));
		fs.rm(path.join(projectPath, "bin"), { recursive: true });
		fs.unlinkSync(path.join(projectPath, "package.json"));

		console.log(logColor1, "Creating a .gitignore", logDefault);
		await executeCommand("curl -o .gitignore https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore");

		console.log(logColor1, "Building package.json", logDefault);
		createPackageJSON(packageJson, projectName);

		console.log("\x1b[32m", "The installation is done, this is ready to use !", "\x1b[0m");
		console.log();

		console.log("\x1b[34m", "You can start by typing:");
		console.log(`\tcd ${projectName}`);
		console.log("\tnpm start", "\x1b[0m");
		console.log();
		console.log("Check Readme.md for more informations");
		console.log();
	} catch (error) {
		console.log(error);
		fs.rm(projectPath, { recursive: true });
	}
})();

// // create folder and initialize npm
// exec(
// 	`mkdir -p ${process.argv[2]} && cd ${process.argv[2]} && npm init -f`,
// 	(initErr, initStdout, initStderr) => {
// 		if (initErr) {
// 			console.error(`Everything was fine, then it wasn't:
//     ${initErr}`);
// 			return;
// 		}
// 		const packageJSON = `${process.argv[2]}/package.json`;
// 		// replace the default scripts
// 		fs.readFile(packageJSON, (err, file) => {
// 			if (err) throw err;
// 			const data = file
// 				.toString()
// 				.replace('"test": "echo \\"Error: no test specified\\" && exit 1"', scripts)
// 				.replace('"keywords": []', babel);
// 			fs.writeFile(packageJSON, data, (err2) => err2 || true);
// 		});
// 		// npm will remove the .gitignore file when the package is installed,
// 		// therefore it cannot be copied, locally and needs to be downloaded.
// 		// Use your raw .gitignore once you pushed your code to GitHub.
// 		https.get(gitIgnore, (res) => {
// 			res.setEncoding("utf8");
// 			let body = "";
// 			res.on("data", (data) => {
// 				body += data;
// 			});
// 			res.on("end", () => {
// 				fs.writeFile(
// 					`${process.argv[2]}/.gitignore`,
// 					body,
// 					{ encoding: "utf-8" },
// 					(err) => {
// 						if (err) throw err;
// 					}
// 				);
// 			});
// 		});

// 		console.log("npm init -- done\n");

// 		// installing dependencies
// 		console.log("Installing deps -- it might take a few minutes..");
// 		const devDeps = getDeps(packageJson.devDependencies);
// 		const deps = getDeps(packageJson.dependencies);

// 		let err = false;
// 		let initArr = [];
// 		initArr[0] = `cd ${process.argv[2]}`;
// 		initArr[1] = `git init `;
// 		initArr[2] = `node -v `;
// 		initArr[3] = `npm -v `;
// 		initArr[4] = Object.keys(devDeps).length ? `npm i -D ${devDeps} ` : ` `;
// 		initArr[5] = `npm i -S ${deps}`;

// 		initArr.forEach((value) => {
// 			exec(value, (error, stdout, stderr) => {
// 				if (error) {
// 					err = true;
// 					console.error(`The following error happened when running ${value}: ${error}`);
// 					return;
// 				}
// 				console.log(stdout);
// 			});
// 		});
// 		if (!err) {
// 			console.log("Copying additional files..");
// 			// copy additional source files
// 			fs.copy(path.join(__dirname, "../src"), `${process.argv[2]}/src`)
// 				.then(() =>
// 					console.log(
// 						`All done!\n\nYour project is now ready\n\nUse the below command to run the app.\n\ncd ${process.argv[2]}\nnpm start`
// 					)
// 				)
// 				.catch((err) => console.error(err));
// 		}
// 	}
// );
