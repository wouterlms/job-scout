const axios = require("axios");
const cheerio = require("cheerio");

module.exports = class Provider {
    name;
    #templateUrl;
    #params;

    constructor(name, templateUrl, params) {
        this.name = name;
        this.#templateUrl = templateUrl;
        this.#params = params;

        this.createUrl();
    }

    createUrl() {
        Object.keys(this.#params.settings).forEach(setting => {
            const value = this.#params.settings[setting];

            this.#templateUrl = this.#templateUrl.replace(
                `[${setting.toUpperCase()}]`,
                value,
            );
        });
    }

    getJobs() {
        return new Promise(resolve => {
            const jobs = [];
            let nResults = 0;

            this.#params.settings.keywords.forEach(async keyword => {
                const url = this.#templateUrl.replace(
                    "[KEYWORD]",
                    keyword.replace(/ /g, "+"),
                );
                const $ = await this.scrape(url);

                this.filterJobs($).forEach(job => {
                    if (this.isGoodTitle(job.title)) {
                        jobs.push(job);
                    }
                });

                ++nResults;

                if (nResults === this.#params.settings.keywords.length) {
                    resolve(jobs);
                }
            });
        });
    }

    async scrape(url) {
        const result = await axios.get(url);
        return cheerio.load(result.data);
    }

    isGoodTitle(title) {
        let isBadTitle = false;
        let isGoodTitle = false;

        this.#params.settings.badTitleWords.forEach(word => {
            if (title.toLowerCase().includes(word.toLowerCase())) {
                isBadTitle = true;
            }
        });

        if (!isBadTitle) {
            this.#params.settings.goodTitleWords.forEach(word => {
                if (title.toLowerCase().includes(word.toLowerCase())) {
                    isGoodTitle = true;
                }
            });
        }

        return !isBadTitle && isGoodTitle;
    }

    filterJobs($) {
        const jobs = [];

        $(this.#params.elements.job).each((i, el) => {
            const title = $(el)
                .find(this.#params.elements.title)
                .text()
                .replace(/\n/g, "")
                .replace(/\t/g, "");
            const company = $(el)
                .find(this.#params.elements.company)
                .text()
                .replace(/\n/g, "")
                .replace(/\t/g, "");
            const location = $(el)
                .find(this.#params.elements.location)
                .text()
                .replace(/\n/g, "")
                .replace(/\t/g, "");
            const salary =
                $(el)
                    .find(this.#params.elements.salary)
                    .text()
                    .replace(/\n/g, "")
                    .replace(/\t/g, "") || "N/A";
            let link = `${$(el).find(this.#params.elements.link).attr("href")}`;

            if (!link.includes("http")) {
                const baseUrl = this.#templateUrl.split("/");

                if (link.charAt(0) !== '/') {
                    link = `/${link}`;
                }

                link = `https://${baseUrl[2]}${link}`;
            }

            const job = { title, company, location, salary, link };

            jobs.push(job);
        });

        return jobs;
    }
};
