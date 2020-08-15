module.exports = {
	apps : [{
		name: "REST API",
		script: "src/index.js",
		exec_mode: "cluster",
		instances: "max",
	}],

	deploy : {
		production : {
			user: process.env.PROD_USER,
			host: process.env.PROD_HOST,
			path: process.env.PROD_PATH,

			key: "./id_rsa",
			ref: "origin/master",
			repo: "https://github.com/altar-gg/api.git",

			"ssh_options": ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
			"post-deploy" : "npm install && pm2 reload ecosystem.config.js --env production"
		}
	}
};
