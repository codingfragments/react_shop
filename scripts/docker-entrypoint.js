#!/usr/bin/env node

import { existsSync } from 'fs';
import { spawn } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_PATH = process.env.DATABASE_PATH || './data/db.sqlite';

console.log('🚀 Starting KeyCraft Shop...');
console.log(`📁 Database path: ${DATABASE_PATH}`);

if (!existsSync(DATABASE_PATH)) {
	console.log('🔧 Database not found, initializing...');

	const dbReset = spawn('node', ['apps/api/dist/scripts/db-utils.js', 'reset'], {
		stdio: 'inherit',
		cwd: process.cwd()
	});

	dbReset.on('close', (code) => {
		if (code === 0) {
			console.log('✅ Database initialized successfully');
			startApp();
		} else {
			console.error('❌ Database initialization failed');
			process.exit(1);
		}
	});

	dbReset.on('error', (error) => {
		console.error('❌ Failed to run database initialization:', error);
		process.exit(1);
	});
} else {
	console.log('✅ Database found, starting application...');
	startApp();
}

function startApp() {
	console.log('🌟 Starting server...');

	const app = spawn('node', ['apps/api/dist/index.js'], {
		stdio: 'inherit',
		cwd: process.cwd()
	});

	app.on('close', (code) => {
		console.log(`Application exited with code ${code}`);
		process.exit(code);
	});

	app.on('error', (error) => {
		console.error('Failed to start application:', error);
		process.exit(1);
	});

	process.on('SIGTERM', () => {
		console.log('📡 Received SIGTERM, shutting down gracefully...');
		app.kill('SIGTERM');
	});

	process.on('SIGINT', () => {
		console.log('📡 Received SIGINT, shutting down gracefully...');
		app.kill('SIGINT');
	});
}
