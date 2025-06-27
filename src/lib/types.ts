import type { Component } from 'svelte';

export interface PostData {
	title: string;
	subtitle: string;
	date: string;
	path: string;
	content?: Component;
}

export interface ProjectData {
	title: string;
	subtitle: string;
	imageSrc: string;
	href: string;
}
