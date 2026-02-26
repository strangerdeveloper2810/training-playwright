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
					label: 'Căn bản',
					translations: { en: 'Basics' },
					items: [
						{ label: 'QC Fundamentals', slug: 'basics/01-fundamentals' },
						{ label: 'Bug Report Template', slug: 'basics/02-bug-report-template' },
						{ label: 'Web Basics', slug: 'basics/03-web-basics' },
					],
				},
				{
					label: 'Thực hành',
					translations: { en: 'Practice' },
					items: [
						{ label: 'Smoke Test Checklist', slug: 'practice/03-smoke-test-checklist' },
						{ label: 'Test Cases by Module', slug: 'practice/04-test-cases-by-module' },
						{ label: 'Regression Test Checklist', slug: 'practice/05-regression-test-checklist' },
					],
				},
				{
					label: 'Báo cáo',
					translations: { en: 'Reports' },
					items: [
						{ label: 'Test Report Templates', slug: 'reports/06-test-report-template' },
					],
				},
				{
					label: 'Nâng cao',
					translations: { en: 'Advanced' },
					items: [
						{ label: 'API Testing Guide', slug: 'advanced/07-api-testing-guide' },
						{ label: 'Playwright Training', slug: 'advanced/08-playwright-training' },
					],
				},
			],
			customCss: ['./src/tailwind.css'],
		}),
		tailwind({ applyBaseStyles: false }),
	],
});
