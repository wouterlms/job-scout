const fs = require('fs');

module.exports = class JobFinder {

	#path = './jobs.txt';
	#providers = [];
	#cachedJobs = [];
	#settings;

	constructor(settings) {
		this.#settings = settings;
	}

	addProvider(provider) {
		this.#providers.push(provider);
		return this;
	}

	isJobCached(job) {
		return !!this.#cachedJobs.filter(
			_job => _job.title.toLowerCase() === job.title.toLowerCase() && _job.company.toLowerCase() === job.company.toLowerCase()
		).length;
	}

	sendEmail(jobs) {
		let html = '';

		jobs.forEach(job => {
			html += `
				<article style="padding: 1rem; background: rgb(250, 250, 250); border-radius: 8px; margin-bottom: 2rem;">
					<h1><a style="color: #847bff; text-decoration: none;" href="${job.link}" target="_blank">${job.title} at ${job.company}</a></h1>
					<p style="color: rgb(43,42,52);"><span style="font-weight: bold;">Location</span>: ${job.location}</p>
					<p style="color: rgb(43,42,52);"><span style="font-weight: bold;">Salary</span>: ${job.salary}.</p>
				</article>
			`;
		});

		this.#settings.email.send(this.#settings.mailTo, `I found ${jobs.length} new job${jobs.length === 1 ? '' : 's'}!`, html);
	}

	async scan() {
		const promises = [];

		this.#providers.forEach((provider) => promises.push(provider.getJobs()));

		const providersJobs = await Promise.all(promises);
		const jobs = [];

		// loop trough provider
		providersJobs.forEach(providerJobs => {

			// loop trough jobs of provider
			providerJobs.forEach(job => {
				jobs.push(job);
			});
		});

		const newJobs = jobs.filter(job => !this.isJobCached(job));
		this.#cachedJobs.push(...newJobs);

		this.updateFile();

		console.log(`finished @ ${new Date().toLocaleTimeString()} [${jobs.length} results, ${newJobs.length} new]`);
		console.log(`next scan: [${new Date(Date.now() + (this.#settings.interval * 60000)).toLocaleTimeString()}]`);
		
		if (newJobs.length > 0) {
			this.sendEmail(newJobs);
		}
	}

	async findJobs() {
		console.log('\n\n' +
					'===== SETTINGS ===== \n\n' +
					`providers: [${this.#providers.map(provider => provider.name).join(', ')}] \n` +
					`interval: [${this.#settings.interval} minutes] \n\n` +
					'==================== \n\n' +
					'Fetching list from jobs.txt...');

		await this.readFile();

		console.log(`Finished fetching list! [${this.#cachedJobs.length} jobs loaded] \n\n` +
					'Checking providers for jobs... \n');

		setInterval(() => {
			this.scan();
		}, this.#settings.interval * 60000);

		this.scan();
	}	

	updateFile() {
		fs.writeFileSync(this.#path, JSON.stringify(this.#cachedJobs));
	}

	async readFile() {
		return new Promise(async (resolve) => {
			if (fs.existsSync(this.#path)) {
				const data = await fs.readFileSync(this.#path, 'utf-8');

				this.#cachedJobs = JSON.parse(data);
				resolve(true);
			} else {
				resolve();
			}
		});
	}
}