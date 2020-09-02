const Provider = require("./Provider");
const settings = require("./settings").settings;

const indeed = new Provider(
    "indeed",
    `https://be.indeed.com/jobs?q=[KEYWORD]&l=[LOCATION]&radius=[RADIUS]`,
    {
        settings,
        elements: {
            job: ".jobsearch-SerpJobCard",
            title: ".jobtitle",
            company: ".company",
            location: ".location",
            salary: ".salary",
            link: ".jobtitle",
        },
    },
);

const jooble = new Provider(
    "jooble",
    "https://be.jooble.org/vacatures-[KEYWORD]/[LOCATION]",
    {
        settings,
        elements: {
            job: ".result ",
            title: ".link-position",
            company: ".company-name",
            location: ".serp_location__region",
            salary: ".salary",
            link: ".link-position",
        },
    },
);

const glassdoor = new Provider(
    "glassdoor",
    "https://nl.glassdoor.be/Vacature/belgium-[KEYWORD]-vacatures-SRCH_IL.0,7_IN25_KO8,23.htm?countryRedirect=true",
    {
        settings,
        elements: {
            job: ".react-job-listing",
            title: ".jobTitle",
            company: ".jobLink",
            location: ".loc",
            salary: "",
            link: ".jobLink",
        },
    },
);

const creativeSkills = new Provider(
    "creative skills",
    "https://www.creativeskills.be/?lang=nl",
    {
        settings,
        elements: {
            job: ".panel-default",
            title: ".cs_job_title",
            company: ".cs_job_company .nobr:nth-of-type(1)>span",
            location: ".cs_job_company .nobr:nth-of-type(2)>span",
            salary: "",
            link: ".cs_jobs_fulltitle>a",
        },
    },
);

const jobat = new Provider(
	"jobat",
	"https://www.jobat.be/nl/jobs/search/[KEYWORD]?l=[LOCATION]&kmfrom=[RADIUS]&fromzipcode=[ZIPCODE]",
	{
		settings,
		elements: {
			job: ".jobCard",
            title: ".jobCard-title>a",
            company: ".jobCard-company>a",
            location: ".jobCard-location",
            salary: "",
            link: ".jobCard-title>a",
		}
	}
)

module.exports = {
    indeed,
    jooble,
    glassdoor,
	creativeSkills,
	jobat,
};
