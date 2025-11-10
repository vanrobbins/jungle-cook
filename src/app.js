/* Mobile nav toggling implemented with jQuery
	 - toggles `.open` on the <header> when hamburger clicked
	 - closes the mobile menu when a link inside `.mobile-menu` is clicked
	 
*/
// CONTROLLER: Manages user interactions and application flow
import { pageModel, createAlert, createToast, firebaseService } from "./model.js";

// Main App Controller
class AppController {
	constructor() {}

	init() {
		// Preload routes first (ensures route modules are available) then initialize UI
		this.initNavigation();
		this.initMobileNav();
		// routing should be initialized after preload to avoid race conditions
		// (initRouting will call route which uses pageModel)
		// Note: preloadRoutes is asynchronous; return the promise so caller can await init()
		return pageModel.preloadRoutes().then(() => this.initRouting());
	}

	// Initialize navigation interactions
	initNavigation() {
		// Update active nav link based on current hash
		$(window).on("hashchange" || "load", () => {
			const hash = window.location.hash || "#home";
			$(".nav-links a").removeClass("active");
			$(`.nav-links a[href="${hash}"]`).addClass("active");
		});

		// Set initial active link
		const initialHash = window.location.hash || "#home";
		$(`.nav-links a[href="${initialHash}"]`).addClass("active");
	}
	initMobileNav() {
		var $header = $("header");
		var $hamburger = $(".hamburger-icon");

		function toggleMenu() {
			$header.toggleClass("open");
		}

		// click or Enter/Space on the hamburger toggles the menu
		$hamburger.on("click", function (e) {
			e.preventDefault();
			toggleMenu();
		});

		// close mobile menu when a link is selected
		$(document).on("click", ".mobile-menu a", function () {
			$header.removeClass("open");
		});
	}

	initRouting() {
		$(window).on("hashchange" || "load", () => this.route());
		this.route();
	}

	async route() {
		const pageName = location.hash.slice(1);
		try {
			const result = await pageModel.changePage(pageName);
			// Controller updates the view based on Model data
			if (result.success) {
				$("#app").html(result.content);
				// Initialize page-specific listeners after content loads
				this.initPageListeners(pageName);
			} else {
				const lastPage = pageModel.getLastLoadedPage();
				createAlert({
					type: "404",
					title: "404 - Page Not Found",
					message: "The page you're looking for doesn't exist.",
					confirmText: "Go Home",
					cancelText: "Go Back",
					onCancel: () => {
						console.log(lastPage);
						window.location.hash = `#${lastPage}`;
					},
				});
			}
		} catch (error) {
			console.error("Error during routing:", error);
			const lastPage = pageModel.getLastLoadedPage();
			createAlert({
				type: "404",
				title: "404 - Page Not Found",
				message: "The page you're looking for doesn't exist.",
				confirmText: "Go Home",
				cancelText: "Go Back",
				onCancel: () => {
					window.location.hash = `#${lastPage}`;
				},
			});
		}
	}
	updateAuthUI(user) {
		const signedIn = !!user;
		this.authState = signedIn;

		// target both nav items (desktop + mobile) — use the data attribute `data-nav-login`
		const $btns = $("[data-nav-login]");

		$btns.each((_, el) => {
			const $el = $(el);
			$el.off("click.auth"); // remove previous namespaced handler to avoid duplicates
			if (signedIn) {
				$el.text("Sign Out").attr("href", "#");
				$el.on("click.auth", (e) => {
					e.preventDefault();
					firebaseService
						.signOutUser()
						.then(() => {
							createToast({ message: "Signed out" });
							window.location.hash = "#home";
						})
						.catch((err) => createAlert({ title: "Sign out failed", message: err.message || String(err) }));
				});
			} else {
				$el.text("Log In").attr("href", "#login");
			}
		});
	}
	initLoginListeners() {
		// login button
		$(document).on("click", "#login-btn", async () => {
			const email = $("#login-email").val() || "";
			const pass = $("#login-pass").val() || "";
			try {
				await firebaseService.loginWithEmail(email, pass);
				window.location.hash = "";
				createToast({ message: "Signed in" });
			} catch (err) {
				createAlert({ title: "Login failed", message: err.message || err.toString() });
			}
		});

		// signup button
		$(document).on("click", "#signup-btn", async () => {
			const email = $("#signup-email").val() || "";
			const pass = $("#signup-pass").val() || "";
			const name = $("#signup-fName").val() + " " + $("#signup-lName").val() || "";
			try {
				await firebaseService.signupWithEmail(email, pass);
				firebaseService.changeUsername(name);
				console.log(name);
				window.location.hash = "";
				createToast({ message: "Account created" });
			} catch (err) {
				createAlert({ title: "Signup failed", message: err.message || err.toString() });
			}
		});
	}

	// Initialize listeners based on the current page
	initPageListeners(pageName) {
		switch (pageName) {
			case "login":
				this.initLoginListeners();
				break;
			default:
				break;
		}
	}
}

// Initialize app when document ready
$(document).ready(async () => {
	const app = new AppController();
	try {
		firebaseService.init();

		firebaseService.onAuthStateChanged((user) => {
			// call the instance method (not a global function)
			app.updateAuthUI(user);
		});
		await app.init(); // preloads routes and starts routing
	} catch (e) {
		console.error("App init failed:", e);
	}
	console.log("Available routes:", pageModel.getAvailableRoutes());
});

$(function () {});
