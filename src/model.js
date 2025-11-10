// MODEL: Manages application state and data

import { createAlert, createToast } from "../lib/util.js";
import { firebaseService } from "./firebase/firebaseService.js";
// Load route modules (each should export an HTML string named `html`).
// Using import.meta.glob lets Vite resolve these modules in dev and build.
const pageLoaders = import.meta.glob("./routes/*.js");

class PageModel {
	constructor() {
		this.currentPage = "";
		this.lastLoadedPage = "home";
		// Cached page contents after preloading
		this._routeCache = {};
	}

	setCurrentPage(pageID) {
		this.currentPage = pageID;
	}

	getCurrentPage() {
		return this.currentPage;
	}

	getLastLoadedPage() {
		return this.lastLoadedPage;
	}

	setLastLoadedPage(pageID) {
		this.lastLoadedPage = pageID;
	}

	// Load page content
	async loadPageContent(pageID) {
		// Prefer loading route modules from `src/routes/*.js` which export
		// an `html` string. This avoids fetch and server-fallback issues.
		const pageName = pageID === "" ? "home" : pageID;
		const key = `./routes/${pageName}.js`;
		// Return cached content if available
		if (this._routeCache[pageName]) {
			return this._routeCache[pageName];
		}
		const loader = pageLoaders[key];
		if (!loader) {
			const err = new Error(`Page "${pageName}" not found (no route module)`);
			console.error(err);
			throw err;
		}

		try {
			const mod = await loader();
			// support both named export `html` and default export
			const content = (mod && (mod.html || mod.default)) || null;
			if (!content || typeof content !== "string") {
				throw new Error(`Route module ./routes/${pageName}.js did not provide an HTML string`);
			}
			// cache for subsequent lookups
			this._routeCache[pageName] = content;
			return content;
		} catch (error) {
			console.error(`Error loading ${pageID || "home"} page:`, error);
			throw error;
		}
	}

	// Preload all route modules and cache their HTML strings.
	async preloadRoutes() {
		const keys = Object.keys(pageLoaders);
		for (const key of keys) {
			try {
				const mod = await pageLoaders[key]();
				const name = key.replace("./routes/", "").replace(/\.js$/, "");
				const content = (mod && (mod.html || mod.default)) || null;
				if (content && typeof content === "string") {
					this._routeCache[name] = content;
				}
			} catch (e) {
				console.warn(`Failed to preload ${key}:`, e);
			}
		}
		return Object.keys(this._routeCache);
	}

	getAvailableRoutes() {
		return Object.keys(this._routeCache);
	}
	async changePage(pageID) {
		console.log(`Changing to page ${pageID}`);

		try {
			// Load page content - MODEL only handles data
			this.setCurrentPage(pageID);
			const content = await this.loadPageContent(pageID);

			// Track last successfully loaded page
			this.setLastLoadedPage(pageID || "home");

			// Return data to controller - no DOM manipulation in model
			return {
				success: true,
				content: content,
				pageID: pageID,
			};
		} catch (error) {
			return {
				success: false,
				error: error.message,
				pageID: pageID,
			};
		}
	}
}

// Export model instances
const pageModel = new PageModel();

export { pageModel };

// Re-export helpers from lib so other modules can import them via model
export { createAlert, createToast };
//Re-export firebase
export { firebaseService };
