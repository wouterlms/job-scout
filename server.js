require('dotenv').config();

const Providers = require("./Providers");
const JobFinder = require("./JobFinder");
const Email = require("./Email");

const jobFinder = new JobFinder({
    interval: 10,
    email: new Email("gmail", {
        user: process.env.USER,
        pass: process.env.PASS,
    }),
    mailTo: process.env.MAIL_TO,
});

jobFinder
    .addProvider(Providers.indeed)
    .addProvider(Providers.jooble)
    .addProvider(Providers.glassdoor)
	.addProvider(Providers.creativeSkills)
	.addProvider(Providers.jobat);

jobFinder.findJobs();
