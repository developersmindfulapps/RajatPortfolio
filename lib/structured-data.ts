export function getRootJsonLd() {
  const baseUrl = "https://www.rajatdeepsingh.xyz";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: "Rajat Deep Singh",
    givenName: "Rajat",
    familyName: "Singh",
    additionalName: "Deep",
    url: baseUrl,
    image: `${baseUrl}/assets/ai/rajat-ai.png`,
    jobTitle: "Senior Frontend Engineer",
    description:
      "Senior Frontend Engineer with 8+ years of enterprise experience building scalable web applications, microfrontends, and high-performance user interfaces with Angular, React, Next.js, and TypeScript.",
    worksFor: {
      "@type": "Organization",
      name: "Netcracker",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "BBSB Engineering College",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Fatehgarh Sahib",
        addressRegion: "Punjab",
        addressCountry: "IN",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gurgaon",
      addressRegion: "Haryana",
      addressCountry: "IN",
    },
    knowsAbout: [
      "Frontend Architecture",
      "Angular",
      "Angular Signals",
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Microfrontends",
      "RxJS",
      "AG Grid",
      "Highcharts",
      "Web Performance Optimization",
      "Tailwind CSS",
      "Node.js",
      "REST APIs",
      "GraphQL",
      "WCAG Accessibility",
    ],
    sameAs: [
      "https://github.com/developersmindfulapps",
      "https://www.linkedin.com/in/rajatdeepsingh2417/",
      "https://www.instagram.com/hereismyrhyme/",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    name: "Rajat Deep Singh | Senior Frontend Engineer & Web Developer",
    url: baseUrl,
    author: {
      "@id": `${baseUrl}/#person`,
    },
    description:
      "Official portfolio of Rajat Deep Singh — Senior Frontend Engineer specializing in Angular, React, Next.js, TypeScript, and enterprise frontend architecture.",
    inLanguage: "en-US",
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${baseUrl}/#profilepage`,
    name: "Rajat Deep Singh Portfolio & Professional Experience",
    url: baseUrl,
    mainEntity: {
      "@id": `${baseUrl}/#person`,
    },
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${baseUrl}/#service`,
    name: "Rajat Deep Singh — Frontend Engineering & Web Development Consulting",
    url: baseUrl,
    provider: {
      "@id": `${baseUrl}/#person`,
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Worldwide",
      },
      {
        "@type": "Country",
        name: "India",
      },
      {
        "@type": "City",
        name: "Gurgaon",
      },
      {
        "@type": "AdministrativeArea",
        name: "Delhi-NCR",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Frontend Engineering Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Enterprise Frontend Architecture (Angular, React, Next.js)",
            description:
              "Architecture design, microfrontend setup, state management with Angular Signals / RxJS / Zustand, and scalable component systems.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "High-Performance Business & Web Applications",
            description:
              "End-to-end development of fast, modern, and reliable web applications optimized for speed, mobile responsiveness, and SEO.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Data-Intensive Grids & Visualization (AG Grid, Highcharts)",
            description:
              "Custom high-throughput data tables handling 1M+ records with server-side pagination, real-time analytics charts, and dashboard workflows.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Frontend Performance & Core Web Vitals Auditing",
            description:
              "Bundle size reduction, code splitting, lazy-loading optimizations, and Lighthouse / WCAG performance enhancement.",
          },
        },
      ],
    },
  };

  return [personSchema, websiteSchema, profilePageSchema, professionalServiceSchema];
}
