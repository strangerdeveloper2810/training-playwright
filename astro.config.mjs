// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	site: 'https://training-playwright.vercel.app',
	integrations: [
		starlight({
			title: 'QC Training',
			description: 'Tai lieu training cho QC Team - HR Tool',
			defaultLocale: 'vi',
			locales: {
				vi: { label: 'Tiếng Việt', lang: 'vi' },
				en: { label: 'English', lang: 'en' },
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/hr-tool' },
			],
			sidebar: [
				{
					label: 'Nền tảng kỹ thuật',
					translations: { en: 'Foundations' },
					items: [
						{ label: 'Kiến trúc Full-stack cho Tester', translations: { en: 'Fullstack Architecture for Testers' }, slug: 'foundations/01-kien-truc-fullstack-cho-tester' },
						{ label: 'HTTP & Network cơ bản', translations: { en: 'HTTP & Network Fundamentals' }, slug: 'foundations/02-http-network-co-ban' },
						{ label: 'Database cơ bản cho Tester', translations: { en: 'Database Fundamentals for Testers' }, slug: 'foundations/03-database-co-ban-cho-tester' },
						{ label: 'Git & Quy trình làm việc nhóm', translations: { en: 'Git & Team Workflow' }, slug: 'foundations/04-git-quy-trinh-nhom' },
					],
				},
				{
					label: 'Căn bản',
					translations: { en: 'Basics' },
					items: [
						{ label: 'QC Fundamentals', slug: 'basics/01-fundamentals' },
						{ label: 'Bug Report Template', slug: 'basics/02-bug-report-template' },
						{ label: 'Web Basics', slug: 'basics/03-web-basics' },
						{ label: 'Testing Types & Levels', slug: 'basics/04-testing-types-and-levels' },
						{ label: 'Test Design Techniques', slug: 'basics/05-test-design-techniques' },
						{ label: 'Viết Test Case chuẩn', translations: { en: 'Writing Standard Test Cases' }, slug: 'basics/06-viet-test-case-chuan' },
						{ label: 'Test Plan & Test Strategy', slug: 'basics/07-test-plan-test-strategy' },
					],
				},
				{
					label: 'Thực hành',
					translations: { en: 'Practice' },
					items: [
						{ label: 'Smoke Test Checklist', slug: 'practice/03-smoke-test-checklist' },
						{ label: 'Test Cases by Module', slug: 'practice/04-test-cases-by-module' },
						{ label: 'Regression Test Checklist', slug: 'practice/05-regression-test-checklist' },
						{ label: 'Manual API Testing', slug: 'practice/06-manual-api-testing' },
						{ label: 'Database Testing thực hành', translations: { en: 'Database Testing in Practice' }, slug: 'practice/07-database-testing-thuc-hanh' },
						{ label: 'Cross-browser Compatibility', slug: 'practice/08-cross-browser-compatibility' },
						{ label: 'Usability & Accessibility Testing', slug: 'practice/09-usability-accessibility-testing' },
						{ label: 'Performance Testing - Khái niệm', translations: { en: 'Performance Testing - Concepts' }, slug: 'practice/10-performance-testing-khai-niem' },
						{ label: 'Security Testing cơ bản', translations: { en: 'Security Testing Basics' }, slug: 'practice/11-security-testing-co-ban' },
					],
				},
				{
					label: 'Báo cáo',
					translations: { en: 'Reports' },
					items: [
						{ label: 'Test Report Templates', slug: 'reports/06-test-report-template' },
						{ label: 'Test Metrics & Dashboard', slug: 'reports/07-test-metrics-dashboard' },
					],
				},
				{
					label: 'Automation Testing',
					translations: { en: 'Automation Testing' },
					items: [
						{ label: '01. Vì sao Automation & Test Pyramid', translations: { en: '01. Why Automation & Test Pyramid' }, slug: 'automation/01-vi-sao-automation-test-pyramid' },
						{ label: '02. TypeScript & Node.js cơ bản cho Tester', translations: { en: '02. TypeScript & Node.js Basics for Testers' }, slug: 'automation/02-typescript-nodejs-co-ban-cho-tester' },
						{ label: '03. Unit Testing cơ bản', translations: { en: '03. Unit Testing Basics' }, slug: 'automation/03-unit-testing-co-ban' },
						{ label: '04. Playwright 101', slug: 'automation/04-playwright-101' },
						{ label: '05. Locators & Selectors', slug: 'automation/05-locators-selectors' },
						{ label: '06. Actions, Interactions & Waiting', slug: 'automation/06-actions-interactions-waiting' },
						{ label: '07. Assertions', slug: 'automation/07-assertions' },
						{ label: '08. Page Object Model', slug: 'automation/08-page-object-model' },
						{ label: '09. Fixtures & Test Data', slug: 'automation/09-fixtures-test-data' },
						{ label: '10. Authentication & Storage State', slug: 'automation/10-authentication-storage-state' },
						{ label: '11. Data-driven Testing', slug: 'automation/11-data-driven-testing' },
						{ label: '12. Visual Regression Testing', slug: 'automation/12-visual-regression-testing' },
						{ label: '13. Cross-browser & Parallel Execution', slug: 'automation/13-cross-browser-parallel-execution' },
						{ label: '14. Mobile Web Testing', slug: 'automation/14-mobile-web-testing' },
						{ label: '15. Accessibility Testing tự động', translations: { en: '15. Automated Accessibility Testing' }, slug: 'automation/15-accessibility-testing-tu-dong' },
						{ label: '16. API Testing (Playwright & tRPC)', slug: 'automation/16-api-testing-playwright-trpc' },
						{ label: '17. Database Verification trong Automation', translations: { en: '17. Database Verification in Automation' }, slug: 'automation/17-database-verification-automation' },
						{ label: '18. Debug, Trace Viewer & Codegen', slug: 'automation/18-debug-trace-viewer-codegen' },
						{ label: '19. CI/CD với GitHub Actions & Reporting', translations: { en: '19. CI/CD with GitHub Actions & Reporting' }, slug: 'automation/19-cicd-github-actions-reporting' },
						{ label: '20. Performance & Security Testing tự động', translations: { en: '20. Automated Performance & Security Testing' }, slug: 'automation/20-performance-security-testing-tu-dong' },
						{ label: '21. Best Practices & Cheatsheet', slug: 'automation/21-best-practices-cheatsheet' },
					],
				},
				{
					label: 'Case Studies',
					translations: { en: 'Case Studies' },
					items: [
						{ label: 'Regression từ Bug đã fix', translations: { en: 'Regression Tests from Fixed Bugs' }, slug: 'case-studies/01-regression-tu-bug-da-fix' },
						{ label: 'Test Suite theo Domain', translations: { en: 'Test Suites by Domain' }, slug: 'case-studies/02-test-suite-theo-domain' },
						{ label: 'Multi-role Auth & Permission Testing', slug: 'case-studies/03-multi-role-auth-permission' },
					],
				},
			],
			customCss: ['./src/tailwind.css'],
		}),
		tailwind({ applyBaseStyles: false }),
	],
});
